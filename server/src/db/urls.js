const HttpStatus = require('http-status-codes');
const { ObjectId } = require('mongodb');
const client = require('./connection');

// Find a url document using a short url
async function findShortUrl(short) {
  try {
    const db = await client.db;
    const urlFound = await db.collection('urls').findOne({ shortUrl: short }, { projection: { _id: 0, users: 0 } });
    return urlFound;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

// Generates an alphanumeric url of 6 letters
async function generateShortUrl() {
  // Generate a random url until it finds an unused url
  let used;
  let newurl;
  /* eslint-disable no-await-in-loop */
  do {
    newurl = [...Math.random().toString(36).substring(2, 8)].map((letter) => {
      if (Math.random() > 0.5) {
        return letter.toUpperCase();
      }
      return letter;
    }).join('');
    used = await findShortUrl(newurl);
  } while (used);
  return newurl;
}

// Find a url in the DB
async function findUrl(url) {
  try {
    const db = await client.db;
    const urlFound = db.collection('urls').findOne({ url: url.url }, { projection: { _id: 0, users: 0 } });
    return urlFound;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

// Insert a url if it doesn't exist
async function insertUrl(urlInfo, userId) {
  try {
    const db = await client.db;
    const urlFound = await db.collection('urls').findOne({ url: urlInfo.url }, { projection: { _id: 0, users: 0 } });

    let userData;
    const time = new Date();
    if (userId) { // If user is logged, prepare data
      userData = {
        user: ObjectId(userId),
        date: time,
      };
    }
    if (urlFound) { // If it was shortened
      if (userId) { // If user is logged append his data
        await db.collection('urls').updateOne({ url: urlInfo.url, 'users.user': { $ne: userId } }, { $push: { users: userData } });
      }
      return urlFound;
    }

    // If it wasn't shortened
    // Data to insert
    const urlData = {
      url: urlInfo.url,
      shortUrl: await generateShortUrl(),
      timesUsed: 0,
      creation: time,
    };
    // If user is logged add his data
    if (userId) {
      urlData.users = [userData];
    }

    // Insert and return
    let result = await db.collection('urls').insertOne(urlData);
    [result] = result.ops;
    delete result.users;
    delete result._id;
    return result;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

// increase timesUsed by 1 for a url, return true, if executed correctly
async function increaseTimesUsed(short) {
  try {
    const db = await client.db;
    const opResult = await db.collection('urls').updateOne({ shortUrl: short }, { $inc: { timesUsed: 1 } });
    return opResult.result.ok === 1;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

async function getListOfUrlFromUser(userId) {
  try {
    const db = await client.db;
    const agg = [
      {
        $unwind: {
          path: '$users',
        },
      }, {
        $match: {
          'users.user': ObjectId(userId),
        },
      }, {
        $project: {
          _id: 0,
          url: 1,
          shortUrl: 1,
          timesUsed: 1,
          created: '$users.date',
        },
      },
    ];
    const cursor = await db.collection('urls').aggregate(agg);
    return await cursor.toArray();
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

module.exports = {
  findUrl,
  findShortUrl,
  getListOfUrlFromUser,
  increaseTimesUsed,
  insertUrl,
};
