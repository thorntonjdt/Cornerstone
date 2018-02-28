var express = require('express');
var router = express.Router();

var user = require('../controllers/user');
var async = require('../helpers/wrappers').async;

router.post('/login', async(user.login));
router.post('/signup', async(user.create));

module.exports = router;
