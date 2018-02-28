var Manager = require('../models/manager');

module.exports = {
  getProperties: async (req, res) => {
    let manager = await Manager.findById(req.params.id, 'properties')
                                  .populate('properties', 'address city state img zip').lean();

    if(!manager){
      throw new Error('Invalid Resource')
    }
    res.send({"payload": manager.properties})
  },

  getLeases: async (req, res) => {
    let manager = await Manager.findById(req.params.id, 'leases')
                                  .populate({
                                    path: 'leases',
                                    populate: [{
                                      path: 'listing',
                                      select: 'unit property',
                                      populate: { path: 'property', select: 'address'}
                                    }, {
                                        path: 'tenant',
                                        select: 'first_name last_name'
                                    }]
                                  }).lean();

    res.send({payload: manager.leases});
  },

  getListings: async (req, res) => {
    let manager = await Manager.findById(req.params.id, 'listings')
                        .populate({
                          path: 'listings',
                          select: 'bedrooms bathrooms rent active property image',
                          populate: {
                            path: 'property',
                            select: 'address'
                          }
                        }).lean();

    res.send({"payload": manager.listings});
  },

  getApplications: async (req, res) => {
    var id = req.params.id;

    let manager = await Manager.findById(id, 'applications')
                                      .populate({
                                        path: 'applications',
                                        populate: [{
                                          path: 'listing',
                                          select: 'property unit',
                                          populate: {
                                            path: 'property',
                                            select: 'address'
                                          }
                                        }, {
                                          path: 'applicant',
                                          select: 'first_name last_name'
                                        }]
                                      }).lean();

    res.send({"payload": manager.applications});
  },

  getNotifications: async (req, res) => {
    let manager = await Manager.findById(req.params.id).select('notifications').lean();

    res.send({payload: manager.notifications});
  },

  addNotification: async (req, res) => {
    await Manager.update({_id: req.params.id}, { $push: { notifications: req.body.notification}});

    res.send({"message": "Success"});
  },

  removeNotification: async (req, res) => {
    await Manager.update({_id: req.params.id}, { $pull: { notifications: { date: (+req.params.date) }}});

    res.send({"message": "Success"});
  },

  removeAllNotifications: async (req, res) => {
    await Manager.update({_id: req.params.id}, { $set: { notifications: []}});

    res.send({"message": "Success"});
  },

  getTickets: async (req, res) => {
    let manager = await Manager.findById(req.params.id, 'tickets')
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

    res.send({"payload": manager.tickets})
  },

  getTickets: async (req, res) => {
    let manager = await Manager.findById(req.params.id , 'tickets lease')
                                .populate({
                                  path: 'tickets',
                                  populate: {
                                    path: 'lease',
                                    select: 'listing',
                                    populate: {
                                      path: 'listing',
                                      select: 'property unit',
                                      populate: {
                                        path: 'property',
                                        select: 'address'
                                      }
                                    }
                                  }
                                }).lean();

    res.send({"payload": manager.tickets});
  }

}
