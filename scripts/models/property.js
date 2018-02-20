var mongoose = require('mongoose');

var PropertySchema = mongoose.Schema({
  address: { type: String, required: true},
  city: { type: String, required: true},
  state: { type: String, required: true},
  zip: { type: Number, required: true},
  coords: [],
  manager: {type: mongoose.Schema.ObjectId, ref: 'User'},
  listings: [{type: mongoose.Schema.ObjectId, ref: 'Listing'}],
  applications: [{type: mongoose.Schema.ObjectId, ref: 'Application'}],
  lease: [{ type: mongoose.Schema.ObjectId, ref: 'Lease'}],
  img: { type: String }
});

PropertySchema.index({ city: 1 }, { zip: 1 }, { collation: { locale: 'en', strength: 2 } });

var Property = module.exports = mongoose.model('Property', PropertySchema);
