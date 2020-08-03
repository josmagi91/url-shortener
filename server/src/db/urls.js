const HttpStatus = require('http-status-codes');
const client = require('./connection');

// Generates an alphanumeric url of 6 letters
function generateShortUrl() {
  const newurl = [...Math.random().toString(36).substring(2, 8)].map((letter) => {
    if (Math.random() > 0.5) {
      return letter.toUpperCase();
    }
    return letter;
  }).join('');
  return newurl;
}

// Find a url in the DB
async function findUrl(url) {
  try {
    const db = await client.db;
    const urlFound = db.collection('urls').findOne({ url: url.url });
    return urlFound;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

// Find a url using a short url
async function findShortUrl(short) {
  try {
    const db = await client.db;
    const urlFound = await db.collection('urls').findOne({ shortUrl: short });
    if (urlFound) {
      delete urlFound._id;
    }
    return urlFound;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

// Insert a url if it doesn't exist, else return the url found
async function insertUrl(urlInfo) {
  try {
    const db = await client.db;
    const urlFound = await db.collection('urls').findOne({ url: urlInfo.url });
    if (urlFound) {
      // url found, return it
      delete urlFound._id;
      return urlFound;
    }
    // Generate a random url until it finds an unused url
    let short;
    let used;
    /* eslint-disable no-await-in-loop */
    do {
      short = generateShortUrl();
      used = await findShortUrl(short);
    } while (used);
    const urlData = {
      url: urlInfo.url,
      shortUrl: short,
    };
    // Insert and return
    let result = await db.collection('urls').insertOne(urlData);
    [result] = result.ops;
    delete result._id;
    return result;
  } catch (err) {
    err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

module.exports = {
  findUrl,
  findShortUrl,
  insertUrl,
};
