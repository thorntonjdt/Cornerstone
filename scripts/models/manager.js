var mongoose = require('mongoose');

var ManagerSchema = mongoose.Schema({
  phone: { type: Number },
  leases: [{type: mongoose.Schema.ObjectId, ref: 'Lease'}],
  properties: [{type: mongoose.Schema.ObjectId, ref: 'Property'}],
  listings: [{type: mongoose.Schema.ObjectId, ref: 'Listing'}],
  applications: [{type: mongoose.Schema.ObjectId, ref: 'Application'}],
  notifications: [],
  tickets: [{type: mongoose.Schema.ObjectId, ref: 'Ticket'}]
});

var Manager = module.exports = mongoose.model('Manager', ManagerSchema);
