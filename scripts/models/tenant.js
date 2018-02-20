var mongoose = require('mongoose');

var TenantSchema = mongoose.Schema({
  phone: { type: Number },
  lease: {type: mongoose.Schema.ObjectId, ref: 'Lease'},
  applications: [{type: mongoose.Schema.ObjectId, ref: 'Application'}],
  tickets: [{type: mongoose.Schema.ObjectId, ref: 'Ticket'}],
  notifications: []
});

var Tenant = module.exports = mongoose.model('Tenant', TenantSchema);
