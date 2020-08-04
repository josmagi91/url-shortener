/* global describe, it, expect, afterAll, beforeAll */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const urlsFunctions = require('../src/db/urls');
const {
  newURL,
  existentURL,
  initUrlsCollection,
  cleanDB,
} = require('./testConf');

beforeAll(initUrlsCollection);

describe('urls.js functions', () => {
  it('findUrl should find a url', async () => {
    const res = await urlsFunctions.findUrl({ url: existentURL.url });
    expect(res.url).toBe(existentURL.url);
    expect(res.shortUrl).toBe(existentURL.shortUrl);
  });
  it('findUrl should NOT find a url', async () => {
    const res = await urlsFunctions.findUrl(newURL);
    expect(res).toBe(null);
  });

  it('findShortUrl should find a url from a shor url', async () => {
    const res = await urlsFunctions.findShortUrl(existentURL.shortUrl);
    expect(res.url).toBe(existentURL.url);
    expect(res.shortUrl).toBe(existentURL.shortUrl);
  });

  it('insertUrl should insert a url', async () => {
    const res = await urlsFunctions.insertUrl(newURL);
    expect(res.url).toBe(newURL.url);
    expect(res.shortUrl).toBeDefined();
    expect(res.shortUrl.length).toBe(6);
  });
  it('insertUrl should return an existend short url', async () => {
    const res = await urlsFunctions.insertUrl(existentURL);
    expect(res.url).toBe(existentURL.url);
    expect(res.shortUrl).toBe(existentURL.shortUrl);
  });

  it('increaseTimesUsed, the field timesUsed should increase by one ', async () => {
    let res = await urlsFunctions.increaseTimesUsed(existentURL.shortUrl);
    expect(res).toBe(true);
    res = await urlsFunctions.increaseTimesUsed(existentURL.shortUrl);
    expect(res).toBe(true);
  });
});

afterAll(cleanDB);
