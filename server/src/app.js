const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const auth = require('./auth');
const api = require('./api');
const { setUserFromToken, notFound, errorHandler } = require('./middlewares');

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(setUserFromToken);

// Routes
app.use('/auth', auth);
app.use('/api', api);

// Route not found and other errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
