const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());

console.log("MongoDB URI:", process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, reconnectTries: 5,  reconnectInterval: 5000, serverSelectionTimeoutMS: 20000 })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        if (!user) return res.sendStatus(403); // Check if user is null
        req.user = user;
        next();
    });
};

// Registration Endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send('Username, email, and password are required.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).send('User Registered');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Server Error');
    }
});


// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username, email });
    if (!user) {
        return res.status(401).send('Invalid Credentials'); // No user found
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send('Invalid Credentials'); // Incorrect password
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

// Profile Endpoint - GET (Fetch user profile)
app.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Return user profile (without password)
        res.json({
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Server Error');
    }
});




// Update Profile Endpoint
app.put('/profile', authenticate, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findById(req.user.userId);
    user.email = email || user.email;
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.send('Profile Updated');
});

// Delete User Endpoint
app.delete('/profile', authenticate, async (req, res) => {
    await User.findByIdAndDelete(req.user.userId);
    res.send('User Deleted');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
