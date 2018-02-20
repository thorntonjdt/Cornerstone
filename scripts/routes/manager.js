var express = require('express');
var router = express.Router();

var user = require('../controllers/user.js');
var manager = require('../controllers/manager.js');
var property = require('../controllers/property.js');
var lease = require('../controllers/lease.js');
var listing = require('../controllers/listing.js');
var application = require('../controllers/application.js');
var transaction = require('../controllers/transaction.js');
var ticket = require('../controllers/ticket.js');
var comment = require('../controllers/comment.js');

var auth = require('../middleware/auth.js');
var wrapAsync = require('../helpers/wrappers.js').async;

router.use(auth.manager);

router.get('/users/:id/notifications', wrapAsync(manager.getNotifications));
router.put('/users/:id/notifications', wrapAsync(manager.addNotification));
router.delete('/users/:id/notifications', wrapAsync(manager.removeAllNotifications));
router.delete('/users/:id/notifications/:date', wrapAsync(manager.removeNotification));

router.get('/managers/:id/applications', wrapAsync(manager.getApplications));
router.get('/applications/:id', wrapAsync(application.getOne));
router.put('/applications/:id', wrapAsync(application.update));

router.get('/managers/:id/listings', wrapAsync(manager.getListings));
router.post('/managers/:id/properties/:propertyId/listings', wrapAsync(listing.create));
router.put('/listings/:id', wrapAsync(listing.update));
router.post('/listings/:id/picture', wrapAsync(listing.imageUpload));
router.get('/listings/:id', wrapAsync(listing.getOne));

router.get('/managers/:id/properties', wrapAsync(manager.getProperties));
router.post('/managers/:id/properties', wrapAsync(property.create));
router.put('/properties/:id', wrapAsync(property.update));
router.post('/properties/:id/picture', wrapAsync(property.imageUpload));
router.get('/properties/:id/edit', wrapAsync(property.getForm));
router.get('/properties/:id/listings', wrapAsync(property.getListings));
router.get('/properties/:id/leases', wrapAsync(property.getLeases));
router.get('/properties/:id', wrapAsync(property.getOne));
router.delete('/properties/:id', wrapAsync(property.delete));

router.get('/managers/:id/lease', wrapAsync(manager.getLeases));
router.get('/leases/:id', wrapAsync(lease.managerGetOne));
router.post('/lease', wrapAsync(lease.create));
router.get('/lease/form/:applicationId', wrapAsync(lease.getForm));

router.post('/leases/:id/transactions', wrapAsync(transaction.managerCreate));

router.get('/managers/:id/tickets', wrapAsync(manager.getTickets));
router.get('/tickets/:id', wrapAsync(ticket.managerGet));
router.post('/tickets/:id/comments', wrapAsync(comment.create));
router.put('/tickets/:id', wrapAsync(ticket.update));

router.put('/users/:id', wrapAsync(user.update));
router.get('/users/:id/info', wrapAsync(user.getInfo));
router.get('/users/:id/account', wrapAsync(user.getAccount));
router.put('/users/:id/email', wrapAsync(user.updateEmail));
router.put('/users/:id/password', wrapAsync(user.updatePassword));

module.exports = router;
