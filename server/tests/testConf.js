const bcrypt = require('bcrypt');
const client = require('../src/db/connection');

// URL constants
const newURL = {
  url: 'https://www.google.com/',
};

const existentURL = {
  url: 'https://stackoverflow.com/',
  shortUrl: 'AtHyAX',
  timesUsed: 0,
};

// user constants
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

async function initUsersCollection() {
  // Init DB and set values to users collection
  const db = await client.db;
  const hashedPassword = await bcrypt.hash(existentUser.password, 12);
  await db.collection('users').insertOne({
    email: existentUser.email,
    password: hashedPassword,
  });
}

async function initUrlsCollection() {
  // Init DB and set values to urls collection
  const db = await client.db;
  await db.collection('urls').insertOne(existentURL);
}

async function cleanDB() {
  // Clean up db and close connection
  const db = await client.db;
  await db.collection('users').deleteMany({});
  await db.collection('urls').deleteMany({});
  client.close();
}

module.exports = {
  newURL,
  existentURL,
  newUser,
  existentUser,
  nonExistentUser,
  nonExistentUserOrWrongPassword,
  initUsersCollection,
  initUrlsCollection,
  cleanDB,
};
