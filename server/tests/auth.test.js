require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const HttpStatus = require('http-status-codes');
const supertest = require('supertest');
const app = require('../src/app');
const client = require('../src/db/connection');
const request = supertest(app);

const user = {
    email: 'user1@gmail.com',
    password: '12345678',
}

describe('Auth test', () => {
    it('should create a new account', async () => {
        const res = await request.post('/auth/signup')
        .send(user);
        expect(res.statusCode).toBe(HttpStatus.OK);
    });

    it('should fail to create a duplicate account', async () => {
        const res = await request.post('/auth/signup')
        .send(user);
        expect(res.statusCode).toBe(HttpStatus.CONFLICT);
        expect(res.body.message).toBe('User already exists.');
    });

    it('should fail to create an account (bad email)', async () => {
        const res = await request.post('/auth/signup')
        .send({
            email: 'user1m',
            password: 'Password25',
        });
        expect(res.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(res.body.message).toBe('"email" must be a valid email');
    });

    it('should fail to create an account (short password)', async () => {
        const res = await request.post('/auth/signup')
        .send({
            email: 'user2@gmail.com',
            password: 'pass',
        });
        expect(res.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(res.body.message).toBe('"password" length must be at least 8 characters long');
    });
})

afterAll(async () => {
    //Clean up db and close connection
    const db = await client.db;
    await db.collection('users').deleteOne({email: user.email});
    client.close();
});
