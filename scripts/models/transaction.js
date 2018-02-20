var mongoose = require('mongoose');

var TransactionSchema = mongoose.Schema({
  lease: { type: mongoose.Schema.ObjectId, ref: 'Lease'},
  date: { type: Date },
  amount: { type: Number },
  description: { type: String },
  balance: { type: Number }
}, {timestamps: true});

var Transaction = module.exports = mongoose.model('Transaction', TransactionSchema);
