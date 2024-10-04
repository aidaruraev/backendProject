// src/routes/userRoutes.js
const express = require('express'); // Import express
const router = express.Router(); // Create a router instance
const { registerUser } = require('../controllers/userController'); // Import registerUser function

// User Registration Route
router.post('/register', registerUser);

module.exports = router; // Export the router
