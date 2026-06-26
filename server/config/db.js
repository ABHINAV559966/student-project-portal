const mongoose = require('mongoose');
const inMemoryStore = require('../storage/inMemoryStore');

let useInMemory = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    console.log('⚠️  No valid MongoDB URI found. Using in-memory storage.');
    useInMemory = true;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    useInMemory = false;
  } catch (error) {
    console.error(`⚠️  MongoDB connection failed: ${error.message}`);
    console.log('🔄 Falling back to in-memory storage...');
    useInMemory = true;
  }
};

const isUsingInMemory = () => useInMemory;

module.exports = { connectDB, isUsingInMemory, inMemoryStore };
