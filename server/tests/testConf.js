const bcrypt = require('bcrypt');
const client = require('../src/db/connection');

const NOW = new Date();
// URL constants
const newURL = {
  url: 'https://www.google.com/',
};

const existentURL = {
  url: 'https://stackoverflow.com/',
  shortUrl: 'AtHyAX',
  timesUsed: 0,
  created: new Date(2020, 8, 3),
};

const existentURL2 = {
  url: 'https://www.youtube.com/',
  shortUrl: 'TTBv2c',
  timesUsed: 0,
  created: new Date(2020, 7, 1),
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

// It's a copy of existentUser but password is hashed and contains a _id
const existentUserLogged = { ...existentUser };

async function initUsersCollection() {
  // Init DB and set values to users collection
  const db = await client.db;
  const hashedPassword = await bcrypt.hash(existentUser.password, 12);
  const usr = await db.collection('users').insertOne({
    email: existentUser.email,
    password: hashedPassword,
  });
  existentUserLogged._id = usr.ops[0]._id;
  existentUserLogged.password = hashedPassword;
}

async function initUrlsCollection() {
  // Init DB and set values to urls collection
  const db = await client.db;
  await initUsersCollection();
  existentURL.users = [{
    user: existentUserLogged._id,
    date: NOW,
  }];
  existentURL2.users = [{
    user: existentUserLogged._id,
    date: NOW,
  }];
  await db.collection('urls').insertMany([existentURL, existentURL2]);
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
  existentURL2,
  newUser,
  existentUser,
  existentUserLogged,
  nonExistentUser,
  nonExistentUserOrWrongPassword,
  initUsersCollection,
  initUrlsCollection,
  cleanDB,
};
