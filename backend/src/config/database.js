// src/config/database.js

import mongoose from 'mongoose';
import { config } from './env.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    // Set strict query handling to false
    mongoose.set('strictQuery', false);

    // Connect with enhanced options for Atlas
    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    // Create indexes in development
    if (config.nodeEnv === 'development') {
      await conn.connection.db.command({ ping: 1 });
      logger.debug('Development mode: Database ping successful');
    }

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Log database details in development
    if (config.nodeEnv === 'development') {
      logger.debug(`Database Name: ${conn.connection.name}`);
      logger.debug(`MongoDB Version: ${await conn.connection.db.admin().serverInfo().then(info => info.version)}`);
    }

    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

// Enhanced connection event handlers
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB Connection Error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.error('MongoDB Disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB Reconnected');
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB Connected');
});

// Monitor for specific Atlas events
mongoose.connection.on('reconnectFailed', () => {
  logger.error('MongoDB Reconnection Failed');
  process.exit(1);
});

// Handle process termination
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Don't exit the process here, just log it
});

export default connectDB;