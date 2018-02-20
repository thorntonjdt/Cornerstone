var jwt = require('jsonwebtoken');

module.exports = {
  admin: (req, res, next) => {
    let token = req.headers.authorization ? jwt.verify(req.headers.authorization.split(' ')[1], 'this is my secret and nobody elses') : null;

    if(token.admin) {
      next();
    } else {
      res.status(401).end()
    }
  }
}
