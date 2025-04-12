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
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
