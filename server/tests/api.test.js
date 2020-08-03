/* global describe, it, expect, afterAll, beforeAll */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const HttpStatus = require('http-status-codes');
const supertest = require('supertest');
const app = require('../src/app');
const {
  newURL,
  existentURL,
  initUrlsCollection,
  cleanDB,
} = require('./testConf');

const request = supertest(app);

beforeAll(initUrlsCollection);

describe('Auth test', () => {
  it('should generate a new short url', async () => {
    const res = await request.post('/api/shorturl/new').send(newURL);
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body.shortUrl.length).toBe(6);
  });
  it('should return a short url from an existent url', async () => {
    const extUrl = { url: existentURL.url };
    const res = await request.post('/api/shorturl/new').send(extUrl);
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body.url).toBe(existentURL.url);
    expect(res.body.shortUrl).toBe(existentURL.shortUrl);
  });
});

afterAll(cleanDB);
