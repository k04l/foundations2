// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { logRequest } from './middleware/logger.middleware.js';
import { connectDB } from './config/database.js';
import routes from './api/routes/routes.js';
//import logger from './utils/logger.js';
import authRoutes from './api/routes/auth.routes.js';

const app = express();

// Connect to database
connectDB();

// CORS configuration first
app.use(cors({
  origin: config.corsOrigin || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(morgan('dev'));
app.use(helmet());

// Body parsing middleware
app.use(express.json({
  limit: '10kb',
  verify: (req, res, buf) => {
      // Store the raw buffer
      req.rawBody = buf;
      
      console.log('Request Debug:', {
          method: req.method,
          path: req.url,
          headers: req.headers,
          body: buf.toString(),
      });
  }
}));


// Regular parsers after our debug middleware
// app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use(logRequest);

// Debug middleware - after body parsing
app.use((req, res, next) => {
  if (req.method === 'POST') {
      console.log('Processed Request:', {
          method: req.method,
          path: req.url,
          headers: req.headers,
          parsedBody: req.body,
          bodyKeys: Object.keys(req.body)
      });
  }
  next();
});

// Test endpoint
app.post('/test', (req, res) => {
  res.json({
      message: 'Test endpoint',
      receivedHeaders: req.headers,
      receivedBody: req.body,
      bodyKeys: Object.keys(req.body)
  });
});



app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
