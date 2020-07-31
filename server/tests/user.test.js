require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const HttpStatus = require('http-status-codes');
const client = require('../src/db/connection');
const userFunctions = require('../src/db/user');

const newUser = {
    email: 'user1@mail.com',
    password: '12345678',
};

const existentUser = {
    email: "user0@mail.com",
    password: "12345678"
};

const nonExistentUser = {
    email: 'nonExistentUser@mail.com',
    password: '12345678',
};

describe('user.js functions', () => {
    it('insertNewUser should insert a new user into the DB', async () => {
        const res = await userFunctions.insertNewUser(newUser);
        expect(res.ops).toBeDefined();
        expect(res.ops[0].email).toBe(newUser.email);
    });

    it('insertNewUser should fail to insert a duplicate user', async () => {
        try{
            const res = await userFunctions.insertNewUser(existentUser);
            expect(res).toBeUndefined();
        }catch(err){
            expect(err.statusCode).toBe(HttpStatus.CONFLICT);
        }
    });

    it('userExists should find if exits a user in the DB', async () => {
        const res = await userFunctions.findUser(existentUser);
        expect(res.mail).toBe(existentUser.mail);
    });

    it('userExists should not find a user', async () => {
        const res = await userFunctions.findUser(nonExistentUser);
        expect(res).toBe(null);
    });

})

afterAll(async () => {
    //Clean up db and close connection
    const db = await client.db;
    await db.collection('users').deleteOne({email: newUser.email});
    client.close();
});
