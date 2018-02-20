var mongoose = require('mongoose');

var ListingSchema = mongoose.Schema({
  bedrooms: { type: Number, required: true},
  bathrooms: { type: Number, required: true},
  rent: { type: Number, required: true},
  deposit: { type: Number, default: 0 },
  unit: { type: Number, required: true},
  headline: { type: String, required: true},
  description: { type: String, required: true},
  property: {type: mongoose.Schema.ObjectId, ref: 'Property'},
  applications: [{type: mongoose.Schema.ObjectId, ref: 'Application'}],
  active: { type: Boolean, default: false },
  available: { type: String },
  location: { type: { type: String }, coordinates: [] },
  image: { type: String }
});

ListingSchema.index({location: '2dsphere'});

var Listing = module.exports = mongoose.model('Listing', ListingSchema);
