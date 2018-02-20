var mongoose = require('mongoose');

var Property = require('../models/property.js');
var User = require('../models/user.js');
var Listing = require('../models/listing.js');
var Lease = require('../models/lease.js');
var Manager = require('../models/manager.js');

var aws = require('aws-sdk');
aws.config.loadFromPath('scripts/config/s3.js');
var multer = require('multer');
var multerS3 = require('multer-s3');

var s3 = new aws.S3()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "jabberproperties",
        key: function (req, file, cb) {
            cb(null, req.params.id+'.png')
        }
    })
}).single('image');

module.exports = {
  getOne: async (req, res) => {
    let property = await Property.findById(req.params.id)
                          .populate({
                            path: 'applications',
                            populate: [{
                              path: 'applicant', select: 'first_name last_name'
                            },
                            {
                              path: 'listing', select: 'unit'
                            }]
                          }).lean();

    if(!property) {
      throw new Error("This property does not exist");
    } else {
      res.send({"payload": property});
    }
  },

  create: async (req, res) => {
    let property = await Property.find({address: req.body.address})

    if(!property.length){
      var newProperty = new Property({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        coords: [req.body.lng, req.body.lat],
        manager: req.params.id
      });

      await newProperty.save();

      await Manager.update({ _id: req.params.id}, { $push: { properties: newProperty._id}});

      res.send({"id": newProperty._id});
    } else {
      res.send({"error": "There is already a property with that address"})
    }
  },

  update: async function(req, res) {

    await Property.update({_id: req.params.id}, req.body);

    res.send({"message": "Success"});
  },

  delete: async (req, res) => {
    let { listings,
          manager,
          _id,
          applications,
          lease
        } = await Property.findById(req.params.id);

    const updateManager = Manager.update({_id: manager}, { $pull: { properties: _id}});

    const removeApplications = Promise.all(applications.map(async application => {
      await Manager.update({applications: application}, {$pull: { applications: application}})
    }))

    const removeListings = Promise.all(listings.map(async listing => {
      await Manager.update({listings: listing}, {$pull: { listings: listing}});
      await Listing.update({_id: listing}, {active: false})
    }));

    const updateLeases = Promise.all(lease.map(async leaseId => {
      await Lease.update({_id: leaseId}, {active: false});
    }))

    await Promise.all([updateManager, removeApplications, removeListings, updateLeases]);

    res.send({"message": "Success"})
  },

  getForm: async(req, res) => {
    let property = await Property.findById(req.params.id, 'address city state zip img listings');

    res.send({"payload": property});
  },

  imageUpload: async (req, res) => {
    upload(req, res, function(error){
      if(error){
        console.log(error);
      }
      Property.update({ _id: req.params.id }, { $set: { img: "https://s3-us-west-2.amazonaws.com/jabberproperties/"+req.params.id+".png" }}, (error) => {
        if(error){
          console.log(error);
        }
        res.send({"message": "Success"});
      });
    })
  },

  getListings: async (req, res) => {
    let property = await Property.findById(req.params.id)
                            .populate('listings', 'bedrooms bathrooms rent unit active image').lean();

    res.send({"payload": property.listings})
  },

  getLeases: async (req, res) => {
    let property = await Property.findById(req.params.id)
                            .populate({
                              path: 'lease',
                              populate: [{
                                path: 'listing',
                                select: 'unit'
                              }, {
                                path: 'tenant',
                                select: 'first_name last_name'
                              }]
                            }).lean();

    res.send({"payload": property.lease});
  }
}
