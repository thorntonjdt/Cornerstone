var Lease = require('../models/lease');
var Property = require('../models/property');
var Application = require('../models/application');
var Listing = require('../models/listing');
var Manager = require('../models/manager');
var Tenant = require('../models/tenant');
var Transaction = require('../models/transaction');

module.exports = {
  managerGetOne: async (req, res) => {
    let lease = await Lease.findById(req.params.id)
                            .populate({
                              path: 'listing',
                              select: 'unit property image bedrooms bathrooms',
                              populate: {path: 'property', select: 'address city state zip'}
                            })
                            .populate('tenant', 'first_name last_name')
                            .populate('transactions').lean();

    if(!lease) {
      throw new Error("No lease by this id");
    } else {
      res.send({"payload": lease});
    }

  },

  create: async (req, res) => {
    const { application, begins, ends, rent, deposit } = req.body;
    if(application && begins && rent && deposit){

      //Find and archive application
      const { listing, applicant } = await Application.findByIdAndUpdate(application, {archived: true}).populate('applicant').populate({path: 'listing', populate: {path: 'property'}}).lean();
      const listingId = listing._id;
      const applicantId = applicant._id;
      const tenantId = applicant.tenant;
      const property = listing.property;

      //Calculate prorated rent
      var beginDate = new Date(begins), y = beginDate.getFullYear(), m = beginDate.getMonth();
      var firstDay = beginDate.getDate();
      var endOfMonth = new Date(y, m + 1, 0);
      var lastDay = endOfMonth.getDate();
      var prorated = (firstDay/lastDay) * rent;
      var roundedProrated = (Math.round(100*prorated))/100;
      if(m == 11){
        var dueDate = new Date(y + 1, 0, 1);
      } else {
        var dueDate = new Date(y, m + 1, 1);
      }

      //Create lease and rent/deposit transactions
      const newLease = new Lease({
        begins: begins,
        ends: ends,
        rent: rent,
        listing: listingId,
        tenant: applicantId,
        balance: deposit
      });
      const depositTransaction = new Transaction({
        date: begins,
        amount: deposit,
        description: "Deposit",
        lease: newLease._id,
        balance: deposit
      })
      const rentTransaction = new Transaction({
        date: dueDate,
        amount: roundedProrated,
        description: "Prorated Rent",
        lease: newLease._id
      })
      await depositTransaction.save();
      await rentTransaction.save();

      //Add deposit and rent transactions to lease then save lease
      newLease.transactions.push(depositTransaction._id);
      newLease.transactions.push(rentTransaction._id)
      await newLease.save();

      const notification = {date: Date.now(), content: `Your application for ${property.address} has been accepted`, label: "View Lease", link: `/t/payments`};

      const updateTenant = Tenant.update({_id: tenantId}, {lease: newLease._id, $push: {notifications: notification}, $pull: {applications: application}});

      const updateListing = Listing.update({_id: listingId}, {applications: [], active: false});

      const updateProperty = Property.update({_id: property._id}, {$pull: {listings: listingId, applications: application}, $push: {lease: newLease._id}});

      const updateManager = Manager.update({_id: property.manager}, {$pull: {listings: listingId, applications: application, notifications: {link: `/m/applications/${req.body.application}`} }, $push: {leases: newLease._id, transactions: {$each: [depositTransaction._id, rentTransaction._id]}}});

      await Promise.all([updateTenant, updateListing, updateProperty, updateManager]);

      //Push new lease notification to tenant
      req.io.sockets.to(req.params.tenantId).emit('newNotification', notification);

      res.send({"id": newLease._id});
    } else {
      res.send({"error": "Invalid"});
    }

  },

  getForm: async (req, res) => {
    let application = await Application.findById(req.params.applicationId)
                                    .populate('applicant', 'first_name last_name')
                                    .populate({
                                      path: 'listing',
                                      select: 'rent deposit unit property available',
                                      populate: {
                                        path: 'property',
                                        select: 'address'
                                      }
                                    }).lean();

    res.send({"payload": application});
  }
}
