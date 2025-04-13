/**
 * MongoDB Connection Configuration
 * 
 * This file handles the connection to MongoDB using Mongoose.
 */

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables or use a default for development
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mansa-marbles';
    
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // In development mode, we'll just log the error and return null
    // In production, we'll exit the process
    if (process.env.NODE_ENV === 'production') {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1); // Exit with failure in production
    } else {
      console.warn(`MongoDB connection failed: ${error.message}`);
      console.warn('Running in development mode without database functionality');
      return null; // Return null in development
    }
  }
};

module.exports = connectDB;
