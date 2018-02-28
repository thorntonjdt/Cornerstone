var Tenant = require('../models/tenant');

module.exports = {
  getApplications: async (req, res) => {
    var id = req.params.id;

    let tenant = await Tenant.findById(id, 'applications')
                                      .populate({
                                        path: 'applications',
                                        select: 'listing createdAt',
                                        populate: {
                                          path: 'listing',
                                          select: 'property unit',
                                          populate: {
                                            path: 'property',
                                            select: 'address'
                                          }
                                        }
                                      }).lean();

    res.send({"payload": tenant.applications});
  },

  getNotifications: async (req, res) => {
    let tenant = await Tenant.findById(req.params.id, 'notifications').lean();

    res.send({payload: tenant.notifications});
  },

  addNotification: async (req, res) => {
    await Tenant.update({_id: req.params.id}, { $push: { notifications: req.body.notification}});

    res.send({"message": "Success"});
  },

  removeNotification: async (req, res) => {
    await Tenant.update({_id: req.params.id}, { $pull: { notifications: { date: (+req.params.date) }}});

    res.send({"message": "Success"});
  },

  removeAllNotifications: async (req, res) => {
    await Tenant.update({_id: req.params.id}, { $set: { notifications: []}});

    res.send({"message": "Success"});
  },

  getLease: async (req, res) => {
    let tenant = await Tenant.findById(req.params.id)
                              .populate({
                                path: 'lease',
                                populate: [{
                                  path: 'listing',
                                  select: 'unit property bedrooms bathrooms image',
                                  populate: {path: 'property', select: 'address city state zip'}
                                }, {
                                  path: 'transactions'
                                }]
                              }).lean();

    if(!tenant) {
      throw new Error("No lease by this id");
    } else {
      res.send({"payload": tenant.lease});
    }
  },

  getTickets: async (req, res) => {
    let tenant = await Tenant.findById(req.params.id, 'tickets lease')
                              .populate({
                                path: 'tickets',
                                populate: {
                                  path: 'lease',
                                  select: 'listing',
                                  populate: {
                                    path: 'listing',
                                    select: 'unit property',
                                    populate: {
                                      path: 'property',
                                      select: 'address'
                                    }
                                  }
                                }
                              }).lean();

    res.send({"payload": tenant});
  }
}
