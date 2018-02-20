var mongoose = require('mongoose');

var ApplicationSchema = mongoose.Schema({
  applicant: {type: mongoose.Schema.ObjectId, ref: 'User'},
  listing: {type: mongoose.Schema.ObjectId, ref: 'Listing'},
  archived: {type: Boolean, default: false}
}, {timestamps: true});

var Application = module.exports = mongoose.model('Application', ApplicationSchema);
