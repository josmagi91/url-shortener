const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');

// Get the token from user request, veryfy and set user in req.user
function setUserFromToken(req, res, next) {
  const authorization = req.get('authorization');
  if (authorization) {
    const [bearer, token] = authorization.split(' ');
    if (bearer === 'Bearer' && token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          const error = new Error('Unauthorized');
          res.status(HttpStatus.UNAUTHORIZED);
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

// Check if user is logged, else send an error
function isLogged(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error('Unauthorized');
    res.status(HttpStatus.UNAUTHORIZED);
    next(error);
  }
}

module.exports = {
  setUserFromToken,
  isLogged,
};