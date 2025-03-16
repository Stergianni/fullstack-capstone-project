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
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').not().isEmpty().withMessage('First name is required'),
  body('lastName').not().isEmpty().withMessage('Last name is required'),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error('Validation errors: ', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    const db = await connectToDatabase();
    // Task 2: Access MongoDB collection
    const collection = db.collection('users');

    // Task 3: Check for existing email ID
    const existingEmail = await collection.findOne({ email });

    if (existingEmail) {
      logger.info(`User already exists with email: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Task 4: Save user details in the database
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const newUser = await collection.insertOne({
      email,
      firstName,
      lastName,
      password: hash,
      createdAt: new Date(),
    });

    // Task 5: Create JWT authentication with user._id as payload
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    logger.info('User registered successfully');
    res.json({ authtoken, email });
  } catch (e) {
    logger.error('Error registering user:', e);
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;
