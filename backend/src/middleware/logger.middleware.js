import logger from '../utils/logger.js';

export const logRequest = (req, res, next) => {
  logger.http(
    `${req.method} ${req.originalUrl} - IP: ${req.ip} - User Agent: ${
      req.headers['user-agent']
    }`
  );
  next();
};