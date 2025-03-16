const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino'); // Import Pino logger
dotenv.config();

const logger = pino(); // Create a Pino logger instance

// Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Register Endpoint
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingEmail = await collection.findOne({ email: req.body.email });

        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password);
            if (!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong password' });
            }

            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            const userName = theUser.firstName;
            const userEmail = theUser.email;

            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// Update Endpoint
router.put(
    '/update',
    // Task 1: Validate input using express-validator
    [
        body('firstName').isString().withMessage('First name must be a string'),
        body('lastName').isString().withMessage('Last name must be a string'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        // Task 2: Validate the input using `validationResult`
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Task 3: Check if email is present in headers
            const email = req.headers.email;
            if (!email) {
                logger.error('Email not found in the request headers');
                return res.status(400).json({ error: "Email not found in the request headers" });
            }

            // Task 4: Connect to MongoDB
            const db = await connectToDatabase();
            const collection = db.collection("users");

            // Task 5: Find user credentials in the database
            const existingUser = await collection.findOne({ email });
            if (!existingUser) {
                logger.error('User not found');
                return res.status(404).json({ error: 'User not found' });
            }

            // Task 6: Update user credentials in the database
            existingUser.updatedAt = new Date();
            if (req.body.firstName) existingUser.firstName = req.body.firstName;
            if (req.body.lastName) existingUser.lastName = req.body.lastName;
            if (req.body.password) {
                const salt = await bcryptjs.genSalt(10);
                const hash = await bcryptjs.hash(req.body.password, salt);
                existingUser.password = hash;
            }

            const updatedUser = await collection.findOneAndUpdate(
                { email },
                { $set: existingUser },
                { returnDocument: 'after' }
            );

            // Task 7: Create JWT with updated user._id as payload
            const payload = {
                user: {
                    id: updatedUser.value._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User profile updated successfully');
            return res.json({ authtoken });
        } catch (e) {
            logger.error(e);
            return res.status(500).send('Internal server error');
        }
    }
);

module.exports = router;
