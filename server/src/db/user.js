const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const client = require('./connection');
const saltRounds = 12;

//Insert a new user into the DB if it doesn't exist
async function insertNewUser(user){
    try{
        const db = await client.db;
        const userFound = await db.collection('users').findOne({email: user.email});
        if(userFound){
            //User exist, throw an error
            const error = new Error('User already exists.');
            error.statusCode = HttpStatus.CONFLICT;
            throw error;
        }else{
            //User doesn't exist, create one
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            return db.collection('users').insertOne({
                email: user.email,
                password: hashedPassword
            });
        }
    }catch(err){
        err.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        throw err;
    }
}

module.exports = {
    insertNewUser
};
