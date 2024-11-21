// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { logRequest } from './middleware/logger.middleware.js';
import { connectDB } from './config/database.js';
import routes from './api/routes/routes.js';
import logger from './utils/logger.js';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(compression()); // Compress all routes
app.use(morgan('dev')); // Log requests to the console
app.use(express.json({ limit: '10kb' })); // Body limit is 10
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());   // Data sanitization against NoSQL query injection
app.use(logRequest); // Log requests

// Health check route
app.get('/health', (req, res) => { 
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// const PORT = config.port || 3001;

// app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
// }).on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     logger.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
//     // Try the next port
//     server.listen(PORT + 1);
//   } else {
//     logger.error(`An error occurred: ${err.message}`);
//   }
// });

export default app;
