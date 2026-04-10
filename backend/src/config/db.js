import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDb = async () => {
  try {
    await mongoose.connect(env.mongodbUri, {
      autoIndex: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.warn('MongoDB connection failed. Continuing in local-only mode (No DB persistency).', error.message);
  }
};

