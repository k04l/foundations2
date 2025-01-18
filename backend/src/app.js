// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { logRequest } from './middleware/logger.middleware.js';
import { connectDB } from './config/database.js';
import routes from './api/routes/routes.js';
import mongoose from 'mongoose';
import fs from 'fs/promises';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads/profiles');
try {
  await fs.mkdir(uploadDir, { recursive: true });
} catch (err) {
  console.error('Error creating upload directory:', err);
}

// Connect to database
connectDB();

mongoose.connection.on('connected', async () => {
  const collections = await mongoose.connection.db.collections();
  console.log('Available collections', collections.map(c => c.collectionName));
});

app.use((req, res, next) => {
  console.log('\n=== New Request ===');
  console.log('Request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    baseUrl: req.baseUrl,
    headers: {
      authorization: req.headers.authorization,
      'content-type': req.headers['content-type']
    }
  });
  next();
});

// CORS configuration
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
  debug: process.env.NODE_ENV === 'development',
  uploadTimeout: 60000,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10 MB
  },
  abortOnLimit: true,
  uploadDir: path.join(__dirname, '../uploads/profiles') // Set upload directory
}));

// Request logging
app.use(logRequest);

// Debug middleware
app.use((req, res, next) => {
  console.log('App Debug:', {
    method: req.method,
    url: req.url,
    path: req.path,
    body: req.body,
    files: req.files
  });
  next();
});

// Mount API routes
app.use('/api/v1', (req, res, next) => {
  console.log('API Route hit:', {
    path: req.path,
    method: req.method
  });
  next();
}, routes);

// Add error logging middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;