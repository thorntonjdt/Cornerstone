var mongoose = require('mongoose');

var TicketSchema = mongoose.Schema({
  lease: { type: mongoose.Schema.ObjectId, ref: 'Lease' },
  title: { type: String },
  description: { type: String },
  open: { type: Boolean, default: true },
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment'}],
  appointment: {type: Date}
}, {timestamps: true});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);
