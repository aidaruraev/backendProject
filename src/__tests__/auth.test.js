// __tests__/auth.test.js
const request = require('supertest');
const app = require('../server'); // Adjust the path to where your Express app is defined
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model
require("dotenv").config();

beforeAll(async () => {
    // Connect to the in-memory database or your test database
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    // Clear users before each test
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.text).toEqual('User Registered');
    });

    it('should login an existing user', async () => {
        await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'wrong@example.com',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual('Invalid Credentials');
    });
});
