var express = require('express');
var router = express.Router();

var user = require('../controllers/user.js');
var wrapAsync = require('../helpers/wrappers.js').async;

router.post('/login', wrapAsync(user.login));
router.post('/signup', wrapAsync(user.create));

module.exports = router;
