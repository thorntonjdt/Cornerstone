var mongoose = require('mongoose');

var LeaseSchema = mongoose.Schema({
  begins: { type: Date },
  ends: { type: Date },
  balance: { type: Number, default: 0 },
  listing: { type: mongoose.Schema.ObjectId, ref: 'Listing' },
  tenant: { type: mongoose.Schema.ObjectId, ref: 'User'},
  rent: { type: Number },
  active: { type: Boolean, default: true },
  transactions: [{ type: mongoose.Schema.ObjectId, ref: 'Transaction'}]
});

var Lease = module.exports = mongoose.model('Lease', LeaseSchema);
