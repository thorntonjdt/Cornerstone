var express = require('express');
var router = express.Router();

var listing = require('../controllers/listing');

var async = require('../helpers/wrappers').async;

router.get('/listings/search', async(listing.search));

router.get('/listings/:id', async(listing.getPublic));

module.exports = router;
