const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const HttpStatus = require('http-status-codes');
const auth = require('./auth');
const api = require('./api');
const { setUserFromToken } = require('./auth/middlewares');

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(setUserFromToken);

// Routes
app.use('/auth', auth);
app.use('/api', api);

function notFound(req, res, next) {
  const err = new Error(`Not found ${req.originalUrl}`);
  res.status(HttpStatus.NOT_FOUND);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
