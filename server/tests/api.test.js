/* global describe, it, expect, afterAll, beforeAll */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const HttpStatus = require('http-status-codes');
const supertest = require('supertest');
const app = require('../src/app');
const {
  newURL,
  existentURL,
  existentURL2,
  existentUser,
  initUrlsCollection,
  cleanDB,
} = require('./testConf');

const request = supertest(app);

beforeAll(initUrlsCollection);

describe('Api test', () => {
  it('should generate a new short url', async () => {
    const res = await request.post('/api/shorturl/new').send(newURL);

    expect(res.body._id).toBeUndefined();
    expect(res.body.users).toBeUndefined();

    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body.shortUrl.length).toBe(6);
  });
  it('should return a short url from an existent url', async () => {
    const extUrl = { url: existentURL.url };
    const res = await request.post('/api/shorturl/new').send(extUrl);

    expect(res.body._id).toBeUndefined();
    expect(res.body.users).toBeUndefined();

    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body.url).toBe(existentURL.url);
    expect(res.body.shortUrl).toBe(existentURL.shortUrl);
  });
  it('should response with a long url', async () => {
    const res = await request.get(`/api/shorturl/${existentURL.shortUrl}`);

    expect(res.body._id).toBeUndefined();
    expect(res.body.users).toBeUndefined();

    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body.url).toBe(existentURL.url);
    expect(res.body.shortUrl).toBe(existentURL.shortUrl);
  });
  it('should response with a 404 Error', async () => {
    const res = await request.get('/api/shorturl/AAAAAA');
    expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(res.body.message).toBe('Page not found');
  });

  it('should get Unauthorized error', async () => {
    const res = await request.get('/api/shorturl/list');
    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(res.body.message).toBe('Unauthorized');
  });
  it('a logged user should get a list of his urls', async () => {
    const loginResp = await request.post('/api/shorturl/list').send(existentUser);
    const res = await request.get('/api/shorturl/list').set('Authorization', `Bearer ${loginResp.body.token}`);
    const expectedResult = [
      existentURL,
      existentURL2,
    ];
    expect(res.body.urls).toBeEquals(expectedResult);
  });
});

afterAll(cleanDB);
