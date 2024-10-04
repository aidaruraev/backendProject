// src/controllers/userController.js
const User = require('../models/User'); // Adjust path as necessary

// Register User
const registerUser = async (req, res) => {
    console.log('Request body:', req.body); // Log the request body
    const { username, password, email } = req.body;

    try {
        const newUser = new User({ username, password, email });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error); // Log the error
        res.status(500).json({ message: 'Error registering user', error });
    }
};

module.exports = { registerUser }; // Export the registerUser function
