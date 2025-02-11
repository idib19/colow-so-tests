import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

export const connectDB = async (): Promise<void> => {
  try {
    // Only connect if we're not already connected
    if (mongoose.connection.readyState === 0) {
      console.log('Attempting to connect to MongoDB...'); // Debug log
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 10
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      });
      console.log('MongoDB connected successfully');
      
      // Add connection event listeners
      mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
    } else {
      console.log('MongoDB already connected, state:', mongoose.connection.readyState);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};