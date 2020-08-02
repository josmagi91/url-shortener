const bcrypt = require('bcrypt');
const client = require('../src/db/connection');

const existentUser = {
  email: 'user0@mail.com',
  password: '12345678',
};

const newUser = {
  email: 'user1@mail.com',
  password: '12345678',
};

const nonExistentUser = {
  email: 'nonExistentUser@mail.com',
  password: '12345678',
};

const nonExistentUserOrWrongPassword = {
  email: 'nonExistentUser@mail.com',
  password: 'agwbweee',
};

async function initDB() {
  // Clean up db and close connection
  const db = await client.db;
  const hashedPassword = await bcrypt.hash(existentUser.password, 12);
  await db.collection('users').insertOne({
    email: existentUser.email,
    password: hashedPassword,
  });
}

async function cleanDB() {
  // Clean up db and close connection
  const db = await client.db;
  await db.collection('users').deleteMany({});
  client.close();
}

module.exports = {
  existentUser,
  newUser,
  nonExistentUser,
  nonExistentUserOrWrongPassword,
  initDB,
  cleanDB,
};
