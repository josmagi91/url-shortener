const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const Joi = require('joi');
const Urls = require('../db/urls');
const { isLogged, validate } = require('../middlewares');

const router = Router();

const urlSchema = Joi.object().keys({
  url: Joi.string().uri().required(),
});

// Shorten a url
router.post('/shorturl/new', validate(urlSchema), (req, res, next) => {
  let userId;
  if (req.user) {
    userId = req.user._id;
  }
  const newUrl = req.body;
  Urls.insertUrl(newUrl, userId).then((url) => {
    res.json(url);
  }).catch((err) => {
    res.status(err.statusCode);
    next(err);
  });
});

// Get a list of urls created by the user logged;
router.get('/shorturl/list', isLogged, (req, res, next) => {
  Urls.getListOfUrlFromUser(req.user._id).then((urlList) => {
    res.json({ urls: urlList });
  }).catch((err) => {
    res.status(err.statusCode);
    next(err);
  });
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
