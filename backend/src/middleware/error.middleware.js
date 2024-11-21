// src/middleware/error.middleware.js

// Middleware for handling 404 errors - Not Found errors
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware for handling all other errors
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
