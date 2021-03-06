/* global describe, it, expect, afterAll, beforeAll */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const HttpStatus = require('http-status-codes');
const userFunctions = require('../src/db/user');
const {
  existentUser,
  newUser,
  nonExistentUser,
  initUsersCollection,
  cleanDB,
} = require('./testConf');

beforeAll(initUsersCollection);

describe('user.js functions', () => {
  it('insertNewUser should insert a new user into the DB', async () => {
    const res = await userFunctions.insertNewUser(newUser);
    expect(res).toBeDefined();
    expect(res.email).toBe(newUser.email);
  });

  it('insertNewUser should fail to insert a duplicate user', async () => {
    try {
      const res = await userFunctions.insertNewUser(existentUser);
      expect(res).toBeUndefined();
    } catch (err) {
      expect(err.statusCode).toBe(HttpStatus.CONFLICT);
    }
  });

  it('userExists should find if exits a user in the DB', async () => {
    try {
      const res = await userFunctions.findUser(existentUser);
      expect(res.mail).toBe(existentUser.mail);
    } catch (err) {
      expect(err.statusCode).toBe(HttpStatus.CONFLICT);
    }
  });

  it('userExists should not find a user', async () => {
    const res = await userFunctions.findUser(nonExistentUser);
    expect(res).toBe(null);
  });
});

afterAll(cleanDB);
