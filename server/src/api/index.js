const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const Joi = require('joi');
const Urls = require('../db/urls');

const router = Router();

const urlSchema = Joi.object().keys({
  url: Joi.string().uri().required(),
});

// Shorten a url
router.post('/shorturl/new', (req, res, next) => {
  const result = urlSchema.validate(req.body);
  if (result.error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    next(result.error);
  } else {
    if (req.user) {
      req.body.user = req.user._id;
    }
    Urls.insertUrl(req.body).then((url) => {
      res.json(url);
    }).catch((err) => {
      res.status(err.statusCode);
      next(err);
    });
  }
});

// Get the original url from a short url
router.get('/shorturl/:shortUrl', (req, res, next) => {
  const { shortUrl } = req.params;
  if (shortUrl.length === 6) {
    Urls.findShortUrl(shortUrl).then((url) => {
      if (url) {
        Urls.increaseTimesUsed(shortUrl).then(() => {
          res.json(url);
        });
      } else {
        res.status(HttpStatus.NOT_FOUND);
        const error = new Error('Page not found');
        next(error);
      }
    });
  } else {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    const error = new Error('Bad short url');
    next(error);
  }
});

module.exports = router;
