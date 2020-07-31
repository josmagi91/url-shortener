require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const HttpStatus = require('http-status-codes');
const client = require('../src/db/connection');
const userFunctions = require('../src/db/user');


const user = {
    email: 'user1@gmail.com',
    password: '12345678',
}

describe('user.js functions', () => {
    it('should insert a new user into the DB', async () => {
        const res = await userFunctions.insertNewUser(user);
        expect(res).toHaveProperty('_id');
        expect(res.email).toBe(user.email);
    });

    it('should fail to insert a duplicate user', async () => {
        try{
            const res = await userFunctions.insertNewUser(user);
            expect(res).toBeUndefined();
        }catch(err){
            expect(err.statusCode).toBe(HttpStatus.CONFLICT);
        }
    });
})

afterAll(async () => {
    //Clean up db and close connection
    const db = await client.db;
    await db.collection('users').deleteOne({email: user.email});
    client.close();
});
