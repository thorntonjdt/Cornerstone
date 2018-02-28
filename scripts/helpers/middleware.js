var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

module.exports = {
  manager: (req, res, next) => {
    let token = req.headers.authorization ? jwt.verify(req.headers.authorization.split(' ')[1], secret) : '';
    if(token && token.manager) {
      next();
    } else {
      res.status(401).end()
    }
  },
  tenant: (req, res, next) => {
    let token = req.headers.authorization ? jwt.verify(req.headers.authorization.split(' ')[1], secret) : '';
    if(token && token.tenant) {
      next();
    } else {
      res.status(401).end()
    }
  }
}
