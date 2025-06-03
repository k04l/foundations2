// src/app.js
import 'dotenv/config';
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
import session from 'express-session';
import passport from './config/passport.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define your paths
const UPLOAD_PATHS = {
  base: path.resolve(__dirname, '../uploads'),
  profiles: path.resolve(__dirname, '../uploads/profiles')
};

const uploadPath = path.join(__dirname, '../uploads');
console.log('Serving static files from:', uploadPath);



// Add more robust directory creation with error handling
const ensureUploadDirs = async () => {
  try {
    // Create permanent upload directories
    await fs.mkdir(UPLOAD_PATHS.base, { recursive: true });
    await fs.mkdir(UPLOAD_PATHS.profiles, { recursive: true });

    //Create temp directory for file processing
    const tmpDir = path.join(__dirname, '../tmp');
    await fs.mkdir(tmpDir, { recursive: true });

    console.log('Upload directories created/verified:', {
      ...UPLOAD_PATHS,
      temp: tmpDir
    });
  } catch (error) {
    console.error('Failed to create upload directories:', error);
    // Don't throw - we want the server to start even if this fails but we should log it prominently
    console.warn('WARNING: File uploads may not work correctly');
  }
 };

 await ensureUploadDirs();

// Modify your static file serving to use existsSync from fs (not fs/promises)
import { existsSync } from 'fs';

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
      'content-type': req.headers['content-type'],
      'origin': req.headers.origin
    }
  });
  next();
});

// CORS configuration
app.use(cors({
  origin: config.corsOrigin.split(',').map(origin => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
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
app.use('/uploads', express.static(uploadPath, {
  setHeaders: (res, path) => {
    // Set proper CORS headers for images
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    // Set proper content type
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
    // Add cache control for better performance
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

app.use('/uploads', (req, res, next) => {
  const fullPath = path.join(UPLOAD_PATHS.base, req.path);
  const exists = existsSync(fullPath);
  
  console.log('Static file request:', {
    requestPath: req.path,
    fullPath,
    exists,
    mimeType: req.get('Accept')
  });
  
  if (!exists) {
    console.warn(`File not found: ${fullPath}`);
  }
  
  next();
});

const fileUploadOptions = {
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../tmp/'),
  createParentPath: true,
  debug: config.nodeEnv === 'development',
  uploadTimeout: 60000,
  limits: {
      fileSize: 1024 * 1024 * 10, // 10 MB
      files: 1 // Single file upload
  },
  abortOnLimit: true,
  preserveExtension: true,
  safeFileNames: true,
  // Add more detailed error handling
  uploadStarted: (fileInfo) => {
    console.log('Upload started:', fileInfo.name);
},
uploadFinished: (fileInfo) => {
    console.log('Upload finished:', fileInfo.name);
}
};
  
  // uploadDir: UPLOAD_PATHS.profiles, // Use our configured path
  // parseNested: true,
  // Add error handling
  
  
  // onUploadComplete: (fileInfo) => {
  //     logger.info('File upload completed:', fileInfo);
  // },
  // onUploadError: (err) => {
  //     logger.error('File upload error:', err);
  // }
// };

app.use(fileUpload(fileUploadOptions));

// Add this before the file upload middleware to ensure proper body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Consolidated static file serving
app.use('/uploads', express.static(uploadPath, {
  setHeaders: (res, path) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
      
      // Content type based on file extension
      const ext = path.split('.').pop()?.toLowerCase();
      const mimeTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif'
      };
      if (ext && ext in mimeTypes) {
          res.setHeader('Content-Type', mimeTypes[ext]);
      }
      
      // Cache control for better performance
      res.setHeader('Cache-Control', 'public, max-age=31536000');
  },
  // Better error handling for missing files
  fallthrough: false
}));

// Request logging
app.use(logRequest);

// Session middleware (must be before passport and routes)
app.use(
  session({
    secret: config.sessionSecret || config.session_secret || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax', // 'none' if using HTTPS
      secure: false,   // true if using HTTPS
    }
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

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