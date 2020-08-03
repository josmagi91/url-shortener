const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const Joi = require('joi');
const Urls = require('../db/urls');

const router = Router();

const urlSchema = Joi.object().keys({
  url: Joi.string().uri().required(),
});

router.post('/shorturl/new', (req, res, next) => {
  const result = urlSchema.validate(req.body);
  if (result.error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    next(result.error);
  } else {
    Urls.insertUrl(req.body).then((url) => {
      res.json(url);
    }).catch((err) => {
      res.status(err.statusCode);
      next(err);
    });
  }
});

module.exports = router;
