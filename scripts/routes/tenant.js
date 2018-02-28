var express = require('express');
var router = express.Router();

var tenant = require('../controllers/tenant');
var application = require('../controllers/application');
var transaction = require('../controllers/transaction');
var ticket = require('../controllers/ticket');
var comment = require('../controllers/comment');
var user = require('../controllers/user');

var auth = require('../helpers/middleware').tenant;
var async = require('../helpers/wrappers').async;

router.use(auth);

router.get('/users/:id/notifications', async(tenant.getNotifications));
router.put('/users/:id/notifications', async(tenant.addNotification));
router.delete('/users/:id/notifications', async(tenant.removeAllNotifications));
router.delete('/users/:id/notifications/:date', async(tenant.removeNotification));

router.get('/tenants/:id/leases', async(tenant.getLease));

router.post('/leases/:id/transactions', async(transaction.tenantCreate));

router.get("/tenants/:id/applications", async(tenant.getApplications));
router.post('/users/:managerId/properties/:propertyId/listings/:listingId/applications', async(application.create));

router.get('/tenants/:id/tickets', async(tenant.getTickets));
router.post('/tenants/:id/tickets', async(ticket.create));
router.get('/tickets/:id', async(ticket.tenantGet));
router.post('/tickets/:id/comments', async(comment.create));

router.put('/users/:id', async(user.update));
router.get('/users/:id/info', async(user.getInfo));
router.get('/users/:id/account', async(user.getAccount));
router.put('/users/:id/email', async(user.updateEmail));
router.put('/users/:id/password', async(user.updatePassword));

module.exports = router;
