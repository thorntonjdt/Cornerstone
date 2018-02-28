var Property = require('../models/property');
var Listing = require('../models/listing');
var Manager = require('../models/manager');

var aws = require('aws-sdk');
aws.config.loadFromPath('scripts/config/s3.js');
var multer = require('multer');
var multerS3 = require('multer-s3');

var s3 = new aws.S3()

//Uploads image file to s3 bucket 'listings'
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "cornerstonelistings",
        key: function (req, file, cb) {
            cb(null, req.params.id+'.png') //Use listing._id for file name
        }
    })
}).single('image');

module.exports = {
  getOne: async (req, res) => {
      let listing = await Listing.findById(req.params.id, '-applications').lean();

      res.send({"payload": listing});
  },

  getPublic: async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate('property', '-listings -lease -img').populate('applications', 'applicant');

    if(!listing) {
      throw new Error("This listing does not exist");
    } else {
      res.send({"payload": listing});
    }
  },

  create: async (req, res) => {
    const managerId = req.params.id;
    const propertyId = req.params.propertyId;
    const { bedrooms, bathrooms, rent, deposit, unit, headline, description, available, active } = req.body;

    if(bedrooms && bathrooms && rent && unit && headline && description && available) {
      let {coords} = await Property.findById(propertyId).lean();

      let newListing = new Listing({
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        rent: rent,
        deposit: deposit,
        unit: unit,
        headline: headline,
        description: description,
        available: available,
        active: active,
        location: {type: "Point", coordinates: coords},
        property: propertyId
      });

      await newListing.save();

      let updateProperty = Property.update({_id: propertyId}, { $push: { listings: newListing._id}})
      let updateManager = Manager.update({_id: managerId}, {$push: {listings: newListing._id}});

      await Promise.all([updateProperty, updateManager]);

      res.send({"id": newListing._id});
    } else {
      res.send({"error": "Invalid"})
    }

  },

  update: async (req, res) => {

    let listing = await Listing.update({ _id: req.params.id}, req.body);

    res.send({"message": "Success"});
  },

  imageUpload: async (req, res) => {
    upload(req, res, error => {
      if(error){
        console.log(error);
      }
      Listing.update({ _id: req.params.id }, { $set: { image: "https://s3-us-west-2.amazonaws.com/cornerstonelistings/"+req.params.id+".png" }}, (error) => {
        if(error){
          console.log(error);
        }
        res.send({"message": "Success"});
      });
    })
  },

  search: async (req, res) => {
    let listings = await Listing.find({
                                  active: true,
                                  location: {
                                    $near: {
                                      $geometry: {
                                        type: "Point",
                                        coordinates: [req.query.lng, req.query.lat]
                                      },
                                      $maxDistance: 10 * 1609.34 //10 miles
                                    }
                                  }}, 'bedrooms bathrooms rent headline location image property')
                                  .populate('property', 'address city state zip').lean();

    res.send({payload: listings});
  }
}
