const jwt = require('jsonwebtoken');

function setUserFromToken(req, res, next) {
  const authorization = req.get('authorization');
  if (authorization) {
    const [bearer, token] = authorization.split(' ');
    if (bearer === 'Bearer' && token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          const error = new Error('Un-Authorized');
          res.status(401);
          next(error);
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = {
  setUserFromToken,
};
