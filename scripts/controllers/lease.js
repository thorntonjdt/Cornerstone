var Lease = require('../models/lease.js');
var Property = require('../models/property.js');
var Application = require('../models/application.js');
var Listing = require('../models/listing.js');
var Manager = require('../models/manager.js');
var Tenant = require('../models/tenant.js');
var Transaction = require('../models/transaction.js');

module.exports = {
  managerGetOne: async (req, res) => {
    let lease = await Lease.findById(req.params.id)
      .populate({
        path: 'listing',
        select: 'unit property image bedrooms bathrooms',
        populate: {path: 'property', select: 'address city state zip'}
      })
      .populate('tenant', 'first_name last_name')
      .populate('transactions')
    console.log(lease);
    if(!lease) {
      throw new Error("No lease by this id");
    } else {
      res.send({"payload": lease});
    }

  },

  create: async (req, res) => {
    const { listing, applicant } = await Application.findByIdAndUpdate(req.body.application, {archived: true}).populate('applicant').populate({path: 'listing', populate: {path: 'property'}}).lean();
    const listingId = listing._id;
    const applicantId = applicant._id;
    const tenantId = applicant.tenant;
    const property = listing.property;

    var begins = new Date(req.body.begins), y = begins.getFullYear(), m = begins.getMonth();
    var firstDay = begins.getDate();
    var endOfMonth = new Date(y, m + 1, 0);
    var lastDay = endOfMonth.getDate();

    var prorated = (firstDay/lastDay) * req.body.rent;
    var roundedProrated = (Math.round(100*prorated))/100;
    if(m == 11){
      var dueDate = new Date(y + 1, 0, 1);
    } else {
      var dueDate = new Date(y, m + 1, 1);
    }

    const newLease = new Lease({
      begins: req.body.begins,
      ends: req.body.ends,
      rent: req.body.rent,
      listing: listingId,
      tenant: applicantId,
      balance: req.body.deposit
    });
    const deposit = new Transaction({
      date: req.body.begins,
      amount: req.body.deposit,
      description: "Deposit",
      lease: newLease._id,
      balance: req.body.deposit
    })
    const firstPayment = new Transaction({
      date: dueDate,
      amount: roundedProrated,
      description: "Prorated Rent",
      lease: newLease._id
    })

    await deposit.save();
    await firstPayment.save();

    newLease.transactions.push(deposit._id);
    newLease.transactions.push(firstPayment._id)
    await newLease.save();

    const notification = {date: Date.now(), content: `Your application for ${property.address} has been accepted`, label: "View Lease", link: `/t/payments`};

    const updateTenant = Tenant.update({_id: tenantId}, {lease: newLease._id, $push: {notifications: notification}, $pull: {applications: req.body.application}});

    const updateListing = Listing.update({_id: listingId}, {applications: [], active: false});

    const updateProperty = Property.update({_id: property._id}, {$pull: {listings: listingId, applications: req.body.application}, $push: {lease: newLease._id}});

    const updateManager = Manager.update({_id: property.manager}, {$pull: {listings: listingId, applications: req.body.application, notifications: {link: `/m/applications/${req.body.application}`} }, $push: {leases: newLease._id, transactions: {$each: [deposit._id, firstPayment._id]}}});

    await Promise.all([updateTenant, updateListing, updateProperty, updateManager]);

    req.io.sockets.to(req.params.tenantId).emit('newNotification', notification);

    res.send({"id": newLease._id});
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
