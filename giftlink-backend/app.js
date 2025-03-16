/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");

const app = express();
app.use("*", cors()); // Enable CORS for all routes
const port = 3060;

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    pinoLogger.info('Connected to DB');
  })
  .catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json()); // Parse JSON request bodies

// Import the routes
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use the routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes); // Add the auth routes

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// Test route
app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
