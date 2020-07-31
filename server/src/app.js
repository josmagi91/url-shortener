const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const HttpStatus = require('http-status-codes');
const auth = require('./auth');

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

//Routes
app.use('/auth', auth);

function notFound(req, res, next){
    const err = new Error(`Not found ${req.originalUrl}`);
    res.status(HttpStatus.NOT_FOUND);
    next(err);
}

function errorHandler(err, req, res, next){
    res.status(res.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
