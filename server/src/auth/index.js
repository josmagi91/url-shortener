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
router.post('/signup', validate(userSchema), async (req, res, next) => {
  try {
    const newUser = await User.insertNewUser(req.body);
    // newUser has been inserted, now create a token and send it
    createToken(newUser, (err, token) => {
      if (err) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY);
        next(new Error('Can\'t create a token'));
      } else {
        res.json({ token });
      }
    });
  } catch (err) {
    res.status(err.statusCode);
    next(err);
  }
});

router.post('/login', validate(userSchema), async (req, res, next) => {
  try {
    const user = await User.findUser(req.body);
    // If a user has been found, compare user password with hashed password and send token.
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      createToken(user, (err, token) => {
        if (err) {
          res.status(HttpStatus.UNPROCESSABLE_ENTITY);
          next(new Error('Can\'t create a token'));
        } else {
          res.json({ token }); // Respond with a token
        }
      });
    } else {
      // User not found, send an error.
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      next(new Error('Wrong mail or password.'));
    }
  } catch (err) {
    res.status(err.statusCode);
    next(err);
  }
});

module.exports = router;
