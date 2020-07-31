require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const HttpStatus = require('http-status-codes');
const supertest = require('supertest');
const app = require('../src/app');
const client = require('../src/db/connection');
const request = supertest(app);

const newUser = {
    email: 'user1@mail.com',
    password: '12345678',
};

const existentUser = {
    email: "user0@mail.com",
    password: "12345678"
};

const nonExistentUserOrWrongPassword = {
    email: 'nonExistentUser@mail.com',
    password: 'agwbweee',
};

describe('Auth test', () => {
    it('should create a new account', async () => {
        const res = await request.post('/auth/signup')
        .send(newUser);
        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail to create a duplicate account', async () => {
        const res = await request.post('/auth/signup')
        .send(existentUser);
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
            email: 'user2@mail.com',
            password: 'pass',
        });
        expect(res.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(res.body.message).toBe('"password" length must be at least 8 characters long');
    });

    it('should log in', async () => {
        const res = await request.post('/auth/login')
        .send(existentUser);
        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(res.body).toHaveProperty('token');
    });

    it('should not log in', async () => {
        const res = await request.post('/auth/login')
        .send(nonExistentUserOrWrongPassword);
        expect(res.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(res.body.message).toBe('Wrong mail or password.');
    });

})

afterAll(async () => {
    //Clean up db and close connection
    const db = await client.db;
    await db.collection('users').deleteOne({email: newUser.email});
    client.close();
});
