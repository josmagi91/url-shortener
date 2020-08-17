const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const Joi = require('joi');
const Urls = require('../db/urls');
const { isLogged, validate } = require('../middlewares');

const router = Router();
const URL_ID_LENGTH = 6;
const urlSchema = Joi.object().keys({
  url: Joi.string().uri().required(),
});

// Shorten a url
router.post('/shorturl/new', validate(urlSchema), async (req, res, next) => {
  let userId;
  if (req.user) {
    userId = req.user._id;
  }
  const newUrl = req.body;
  try {
    // inserts a url and its creator
    const url = await Urls.insertUrl(newUrl, userId);
    res.json(url);
  } catch (err) {
    res.status(err.statusCode);
    next(err);
  }
});

// Get a list of urls created by the user logged;
router.get('/shorturl/list', isLogged, async (req, res, next) => {
  try {
    const urlList = await Urls.getListOfUrlFromUser(req.user._id);
    res.json({ urls: urlList });
  } catch (err) {
    res.status(err.statusCode);
    next(err);
  }
});

// Get the original url from a short url
router.get('/shorturl/:shortUrl', async (req, res, next) => {
  const { shortUrl } = req.params;
  if (shortUrl.length === URL_ID_LENGTH) {
    try {
      const url = await Urls.findShortUrl(shortUrl);
      if (url) {
        await Urls.increaseTimesUsed(shortUrl);
        res.json(url);
      } else {
        res.status(HttpStatus.NOT_FOUND);
        const error = new Error('Page not found');
        next(error);
      }
    } catch (err) {
      res.status(err.statusCode);
      next(err);
    }
  } else {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    const error = new Error('Bad short url');
    next(error);
  }
});

module.exports = router;
