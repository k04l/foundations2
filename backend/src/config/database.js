// src/config/database.js
import mongoose from 'mongoose';
import { config } from './env.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(config.mongoUri);

    // Create indexes in development
    if (config.nodeEnv === 'development') {
      await conn.connection.db.command({ ping: 1 });
    }

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB Connection Error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.error('MongoDB Disconnected');
});

// If Node process ends, close the Mongoose connection
process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB Connection Closed through app termination'); 
      process.exit(0);
    } catch (err) {
        logger.error(`Error closing MongoDB connection: ${err}`);
        process.exit(1);
    }
}); 