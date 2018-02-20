var Ticket = require('../models/ticket');
var Tenant = require('../models/tenant');
var Manager = require('../models/manager');

module.exports = {
  create: async (req, res) => {
    var newTicket = new Ticket({
      lease: req.body.lease,
      title: req.body.title,
      description: req.body.description
    })

    await newTicket.save();

    let notification = {date: Date.now(), content: `You have a new maintenance request`, label: "View Ticket", link: `/m/maintenance/${newTicket._id}`};

    await Tenant.update({_id: req.params.id}, {$push: {tickets: newTicket._id}});
    let manager =  await Manager.update({leases: req.body.lease}, {$push: {tickets: newTicket._id, notifications: notification}});

    req.io.sockets.to(manager._id).emit('newNotification', notification);

    res.send({"message": "success"})
  },

  managerGet: async (req, res) => {
    let ticket = await Ticket.findById(req.params.id).populate([{path: 'lease', select: 'listing tenant', populate: [{path: 'listing', select: 'unit property', populate: {path: 'property', select: 'address city state'}}, {path: 'tenant', select: 'first_name last_name'}]}, {path: 'comments'}]).lean();

    res.send({"payload": ticket});
  },

  update: async (req, res) => {
    await Ticket.update({_id: req.params.id}, req.body);

    res.send({"message": "Success"});
  },

  tenantGet: async (req, res) => {
    let ticket = await Ticket.findById(req.params.id).populate([{path: 'lease', select: 'listing', populate: {path: 'listing', select: 'unit property', populate: {path: 'property', select: 'address city state'}}}, {path: 'comments'}]).lean();

    res.send({"payload": ticket});
  },
};
