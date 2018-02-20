var express = require('express');
var router = express.Router();

var tenant = require('../controllers/tenant.js');
var application = require('../controllers/application.js');
var transaction = require('../controllers/transaction.js');
var ticket = require('../controllers/ticket.js');
var comment = require('../controllers/comment.js');
var user = require('../controllers/user.js');

var auth = require('../middleware/auth.js');
var wrapAsync = require('../helpers/wrappers.js').async;

router.use(auth.tenant);

router.get('/users/:id/notifications', wrapAsync(tenant.getNotifications));
router.put('/users/:id/notifications', wrapAsync(tenant.addNotification));
router.delete('/users/:id/notifications', wrapAsync(tenant.removeAllNotifications));
router.delete('/users/:id/notifications/:date', wrapAsync(tenant.removeNotification));

router.get('/tenants/:id/leases', wrapAsync(tenant.getLease));

router.post('/leases/:id/transactions', wrapAsync(transaction.tenantCreate));

router.get("/tenants/:id/applications", wrapAsync(tenant.getApplications));
router.post('/users/:managerId/properties/:propertyId/listings/:listingId/applications', wrapAsync(application.create));

router.get('/tenants/:id/tickets', wrapAsync(tenant.getTickets));
router.post('/tenants/:id/tickets', wrapAsync(ticket.create));
router.get('/tickets/:id', wrapAsync(ticket.tenantGet));
router.post('/tickets/:id/comments', wrapAsync(comment.create));

router.put('/users/:id', wrapAsync(user.update));
router.get('/users/:id/info', wrapAsync(user.getInfo));
router.get('/users/:id/account', wrapAsync(user.getAccount));
router.put('/users/:id/email', wrapAsync(user.updateEmail));
router.put('/users/:id/password', wrapAsync(user.updatePassword));

module.exports = router;
