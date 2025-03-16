const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db'); // Database connection
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');

dotenv.config(); // Load environment variables

// Pino logger instance
const logger = pino();

// JWT secret key from .env
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', [
  // Validate the incoming request body
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error('Validation errors: ', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    logger.info(`Checking if user with email ${email} already exists...`);
    const db = await connectToDatabase();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      logger.info(`User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    logger.info('Hashing the password...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user object
    const newUser = {
      email,
      password: hashedPassword
    };

    // Insert the new user into the database
    logger.info('Inserting new user into database...');
    const result = await db.collection('users').insertOne(newUser);

    if (!result.acknowledged) {
      logger.error('Failed to insert new user into database');
      return res.status(500).json({ message: 'Failed to register user' });
    }

    // Generate JWT token
    logger.info('Generating JWT token...');
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    // Send success response with the JWT token
    logger.info('User registered successfully');
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
