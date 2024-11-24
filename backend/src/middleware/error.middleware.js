// src/middleware/error.middleware.js

import logger from '../utils/logger.js';
import { config } from '../config/env.js';

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Main error handler
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
  });

  // Specific error handling
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new AppError(message, 400);
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    err = new AppError(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    err = new AppError(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    err = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    err = new AppError(message, 401);
  }

  if (config.nodeEnv === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production error response
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      logger.error('ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};