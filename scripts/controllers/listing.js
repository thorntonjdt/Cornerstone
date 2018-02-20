var Property = require('../models/property.js');
var Listing = require('../models/listing.js');
var Manager = require('../models/manager.js');

var aws = require('aws-sdk');
aws.config.loadFromPath('scripts/config/s3.js');
var multer = require('multer');
var multerS3 = require('multer-s3');

var s3 = new aws.S3()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "jabberlistings",
        key: function (req, file, cb) {
            cb(null, req.params.id+'.png')
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
    let managerId = req.params.id;
    let propertyId = req.params.propertyId;

    let {coords} = await Property.findById(propertyId).lean();

    let newListing = new Listing({
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      rent: req.body.rent,
      deposit: req.body.deposit,
      unit: req.body.unit,
      headline: req.body.headline,
      description: req.body.description,
      available: req.body.available,
      active: req.body.active,
      location: {type: "Point", coordinates: coords},
      property: propertyId
    });

    await newListing.save();

    let updateProperty = Property.update({_id: propertyId}, { $push: { listings: newListing._id}})
    let updateManager = Manager.update({_id: managerId}, {$push: {listings: newListing._id}});

    await Promise.all([updateProperty, updateManager]);

    res.send({"id": newListing._id});
  },

  update: async (req, res) => {

    let listing = await Listing.update({ _id: req.params.id}, req.body);

    res.send({"message": "Success"});
  },

  imageUpload: async (req, res) => {
    upload(req, res, function(error){
      if(error){
        console.log(error);
      }
      Listing.update({ _id: req.params.id }, { $set: { image: "https://s3-us-west-2.amazonaws.com/jabberlistings/"+req.params.id+".png" }}, (error) => {
        if(error){
          console.log(error);
        }
        res.send({"message": "Success"});
      });
    })
  },

  search: async (req, res) => {
    let listings = await Listing.find({ active: true, location:
                                                       { $near:
                                                          {
                                                            $geometry: { type: "Point",  coordinates: [req.query.lng, req.query.lat] },
                                                            $maxDistance: 10 * 1609.34
                                                          }
                                                       }}, 'bedrooms bathrooms rent headline location image property')
                                                       .populate('property', 'address city state zip').lean();

    res.send({payload: listings});
  }
}
