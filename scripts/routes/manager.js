var express = require('express');
var router = express.Router();

var user = require('../controllers/user');
var manager = require('../controllers/manager');
var property = require('../controllers/property');
var lease = require('../controllers/lease');
var listing = require('../controllers/listing');
var application = require('../controllers/application');
var transaction = require('../controllers/transaction');
var ticket = require('../controllers/ticket');
var comment = require('../controllers/comment');

var auth = require('../helpers/middleware').manager;
var async = require('../helpers/wrappers').async;

router.use(auth);

router.get('/users/:id/notifications', async(manager.getNotifications));
router.put('/users/:id/notifications', async(manager.addNotification));
router.delete('/users/:id/notifications', async(manager.removeAllNotifications));
router.delete('/users/:id/notifications/:date', async(manager.removeNotification));

router.get('/managers/:id/applications', async(manager.getApplications));
router.get('/applications/:id', async(application.getOne));
router.put('/applications/:id', async(application.update));

router.get('/managers/:id/listings', async(manager.getListings));
router.post('/managers/:id/properties/:propertyId/listings', async(listing.create));
router.put('/listings/:id', async(listing.update));
router.post('/listings/:id/picture', async(listing.imageUpload));
router.get('/listings/:id', async(listing.getOne));

router.get('/managers/:id/properties', async(manager.getProperties));
router.post('/managers/:id/properties', async(property.create));
router.put('/properties/:id', async(property.update));
router.post('/properties/:id/picture', async(property.imageUpload));
router.get('/properties/:id/edit', async(property.getForm));
router.get('/properties/:id/listings', async(property.getListings));
router.get('/properties/:id/leases', async(property.getLeases));
router.get('/properties/:id', async(property.getOne));
router.delete('/properties/:id', async(property.delete));

router.get('/managers/:id/lease', async(manager.getLeases));
router.get('/leases/:id', async(lease.managerGetOne));
router.post('/lease', async(lease.create));
router.get('/lease/form/:applicationId', async(lease.getForm));

router.post('/leases/:id/transactions', async(transaction.managerCreate));

router.get('/managers/:id/tickets', async(manager.getTickets));
router.get('/tickets/:id', async(ticket.managerGet));
router.post('/tickets/:id/comments', async(comment.create));
router.put('/tickets/:id', async(ticket.update));

router.put('/users/:id', async(user.update));
router.get('/users/:id/info', async(user.getInfo));
router.get('/users/:id/account', async(user.getAccount));
router.put('/users/:id/email', async(user.updateEmail));
router.put('/users/:id/password', async(user.updatePassword));

module.exports = router;
