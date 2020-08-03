const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const client = require('./connection');

const saltRounds = 12;

// Insert a new user into the DB if it doesn't exist.
// Throws an error if the user cant be inserted
async function insertNewUser(user) {
  try {
    const db = await client.db;
    const userFound = await db.collection('users').findOne({ email: user.email });
    if (userFound) {
      // User exist, throw an error
      const error = new Error('User already exists.');
      error.statusCode = HttpStatus.CONFLICT;
      throw error;
    } else {
      // User doesn't exist, create one
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      let found = await db.collection('users').insertOne({
        email: user.email,
        password: hashedPassword,
      });
      [found] = found.ops;
      delete found._id;
      return found;
    }
  } catch (err) {
    err.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

// Find a user in the DB
async function findUser(user) {
  try {
    const db = await client.db;
    const userFound = await db.collection('users').findOne({ email: user.email });
    return userFound;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

module.exports = {
  insertNewUser,
  findUser,
};
