/**
 * Mansa's Marbles - Main Server File
 * 
 * This file sets up the Express server and connects to MongoDB.
 */

// Import required packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');

// Import database connection
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000; // Changed from 3000 to avoid conflicts

// Middleware
app.use(helmet()); // Set security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Serve node_modules for client-side imports
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start the server
if (process.env.NODE_ENV === 'production') {
  // In production, we require MongoDB connection
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} to view the application`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
} else {
  // In development, we can start without MongoDB
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
    console.log(`MongoDB connection is optional in development mode`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
  });
  
  // Try to connect to MongoDB but don't fail if it's not available
  connectDB().then(() => {
    console.log('MongoDB connected successfully in development mode');
  }).catch(err => {
    console.warn('MongoDB connection failed in development mode:', err.message);
    console.warn('Continuing without database functionality');
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, we might want to exit the process and let a process manager restart it
  // process.exit(1);
});
