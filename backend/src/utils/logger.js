// src/utils/logger.js
import winston from 'winston';
import { config } from '../config/env.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
}

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

const transports = [
    // Console transport
    new winston.transports.Console(),

    // Error Log file
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }),

    // All logs file
    new winston.transports.File({ filename: 'logs/all.log' }),   

];

const logger = winston.createLogger({
    level: config.nodeEnv === 'development' ? 'debug' : 'warn',
    levels,
    format,
    transports
});

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'logs/combined.log' }),
//   ],
// });

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     })
//   );
// }

export default logger;
