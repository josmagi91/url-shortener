const bcrypt = require('bcrypt');
const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../db/user');
const { validate } = require('../middlewares');

const router = Router();

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

function createToken(data, callback) {
  const payload = {
    _id: data._id,
    email: data.email,
  };
  jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' }, callback);
}

// Create a new user
router.post('/signup', validate(userSchema), (req, res, next) => {
  User.insertNewUser(req.body).then((newUser) => {
    // newUser has been inserted, now create a token and send it
    createToken(newUser, (err, token) => {
      if (err) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY);
        next(new Error('Can\'t create a token'));
      } else {
        res.json({ token });
      }
    });
  }).catch((err) => {
    res.status(err.statusCode);
    next(err);
  });
});

router.post('/login', validate(userSchema), (req, res, next) => {
  User.findUser(req.body).then((user) => {
    if (user) {
      // If a user has been found, compare user password with hashed password and send token.
      bcrypt.compare(req.body.password, user.password).then((passwordResult) => {
        if (passwordResult) {
          createToken(user, (err, token) => {
            if (err) {
              res.status(HttpStatus.UNPROCESSABLE_ENTITY);
              next(new Error('Can\'t create a token'));
            } else {
              res.json({ token });
            }
          });
        } else {
          res.status(HttpStatus.UNPROCESSABLE_ENTITY);
          next(new Error('Wrong mail or password.'));
        }
      });
    } else {
      // User not found, send an error.
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      next(new Error('Wrong mail or password.'));
    }
  });
});

module.exports = router;
