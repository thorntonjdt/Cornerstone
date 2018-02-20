var Property = require('../models/property.js');
var Listing = require('../models/listing.js');
var Application = require('../models/application.js');
var Manager = require('../models/manager.js');
var Tenant = require('../models/tenant.js');

module.exports = {
  getOne: async (req, res) => {
    let application = await Application.findById(req.params.id)
                                    .populate('applicant', 'first_name last_name email phone')
                                    .populate({
                                      path: 'listing',
                                      select: 'property unit',
                                      populate: {
                                        path: 'property',
                                        select: 'address'
                                      }
                                    });

    res.send({"payload": application})
  },

  create: async (req, res) => {
    let newApplication = new Application({
      applicant: req.body.user,
      listing: req.params.listingId
    });

    await newApplication.save();

    let notification = {date: Date.now(), content: `You have a new applicant for ${req.body.address}`, label: "View Application", link: `/m/applications/${newApplication._id}`};

    let updateListing = Listing.update({ _id: req.params.listingId}, { $push: { applications: newApplication._id}});

    let updateManager = Manager.update({ _id: req.params.managerId}, { $push: { applications: newApplication._id, notifications: notification}})

    let updateTenant = Tenant.update({ _id: req.body.tenant}, { $push: { applications: newApplication._id}});

    let updateProperty = Property.update({ _id: req.params.propertyId}, { $push: { applications: newApplication._id}});

    await Promise.all([updateListing, updateManager, updateTenant, updateProperty]);

    req.io.sockets.to(req.params.managerId).emit('newNotification', notification);

    res.send({"message": "Success"});
  },

  update: async (req, res) => {
    await Application.update({_id: req.params.id}, req.body);

    res.send({"message": "Success"});
  }
}
