// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware.js';
import User from '../models/user.model.js';
import { config } from '../config/env.js';

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header or cookies
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Attach user to request object
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new AppError('User not found', 401));
      }

      req.user = user;
      next();
    } catch (err) {
      return next(new AppError('Invalid token or token expired', 401));
    }
  } catch (err) {
    next(new AppError('Error authenticating user', 500));
  }
};

/**
 * Middleware to restrict access based on user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not found', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
