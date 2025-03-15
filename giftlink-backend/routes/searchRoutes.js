const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts with filters
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB using connectToDatabase
        const db = await connectToDatabase(); // Connect to the database
        const collection = db.collection("gifts"); // Access the "gifts" collection

        // Initialize the query object to hold the search criteria
        let query = {};

        // Task 2: Add the name filter to the query if the name parameter is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for case-insensitive partial match
        }

        // Task 3: Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category; // Filter by category
        }
        if (req.query.condition) {
            query.condition = req.query.condition; // Filter by condition (e.g., "new", "used")
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) }; // Filter by age (years), less than or equal to the value
        }

        // Task 4: Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray(); // Fetch all gifts matching the query

        // Return the filtered gifts as a JSON response
        res.json(gifts);
    } catch (e) {
        // If there is an error, pass it to the error handler
        next(e);
    }
});

module.exports = router;
