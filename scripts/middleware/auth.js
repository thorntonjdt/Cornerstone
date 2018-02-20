var jwt = require('jsonwebtoken');

module.exports = {
  manager: (req, res, next) => {
    let token = req.headers.authorization ? jwt.verify(req.headers.authorization.split(' ')[1], 'this is my secret and nobody elses') : '';
    if(token && token.manager) {
      next();
    } else {
      res.status(401).end()
    }
  },
  tenant: (req, res, next) => {
    let token = req.headers.authorization ? jwt.verify(req.headers.authorization.split(' ')[1], 'this is my secret and nobody elses') : '';
    if(token && token.tenant) {
      next();
    } else {
      res.status(401).end()
    }
  }
}
