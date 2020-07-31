const {Router} = require('express');
const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const user = require('../db/user')

const router = Router();

const userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

//create a new user
router.post('/signup', (req, res, next) => {
    const result = userSchema.validate(req.body);
    if(result.error){
        res.status(HttpStatus.UNPROCESSABLE_ENTITY);
        next(result.error);
    }else{
        user.insertNewUser(req.body)
        .then(data => {
            res.send('OK'); //TODO
        }).catch(err => {
            res.status(err.statusCode);
            next(err);
        });
    }
});

module.exports = router;