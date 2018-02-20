var express = require('express');
var router = express.Router();

var listing = require('../controllers/listing.js');

var wrapAsync = require('../helpers/wrappers.js').async;

router.get('/listings/search', wrapAsync(listing.search));

router.get('/listings/:id', wrapAsync(listing.getPublic));

module.exports = router;
