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

// Custom body parser for debugging
// app.use((req, res, next) => {
//   if (req.method === 'POST') {
//       let data = '';
      
//       console.log('Starting request processing:', {
//           method: req.method,
//           url: req.url,
//           headers: req.headers
//       });

//       req.on('data', chunk => {
//           data += chunk;
//           console.log('Received chunk:', chunk.toString());
//       });

//       req.on('end', () => {
//           console.log('Finished receiving data:', data);
          
//           if (req.headers['content-type']?.includes('application/json')) {
//               try {
//                   req.body = JSON.parse(data);
//                   console.log('Parsed JSON body:', req.body);
//               } catch (e) {
//                   console.error('JSON parsing error:', e);
//                   req.body = {};
//               }
//           }
          
//           next();
//       });

//       req.on('error', (error) => {
//           console.error('Error processing request:', error);
//           next(error);
//       });
//   } else {
//       next();
//   }
// });

// // Pre-parsing debug middleware
// app.use((req, res, next) => {
//   let data = '';
//   req.setEncoding('utf8');
//   req.on('data', chunk => {
//       data += chunk;
//   });
//   req.on('end', () => {
//       console.log('Raw request body:', {
//           contentType: req.headers['content-type'],
//           contentLength: req.headers['content-length'],
//           rawData: data
//       });
//       next();
//   });
// });

// Basic Middleware Setup
// app.use(morgan('dev'));

// // Body parsing middleware
// app.use(express.json({
//   limit: '10kb',
//   verify: (req, res, buf) => {
//       req.rawBody = buf;
//       console.log('JSON Parser Debug:', {
//           contentType: req.headers['content-type'],
//           bodyLength: buf.length,
//           bodyContent: buf.toString()
//       });
//   }
// }));

// app.use(express.urlencoded({ 
//   extended: true,
//   limit: '10kb' 
// }));

// app.use(cookieParser());
// app.use(compression());
// app.use(mongoSanitize());
// app.use(logRequest);



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


// // Simple request logging
// app.use((req, res, next) => {
//   console.log('Request received:', {
//     method: req.method,
//     path: req.path,
//     contentType: req.headers['content-type'],
//     contentLength: req.headers['content-length'],
//     body: req.body,
//     bodyKeys: Object.keys(req.body),
//     rawBody: req.rawBody?.toString()
//   });
//   next();
// });

// // Add raw body buffer for verification
// app.use(express.json({
//   verify: (req, res, buf) => {
//     req.rawBody = buf;
//     console.log('Raw request body:', buf.toString());
//   }
// }));

// Middleware
// app.use(express.json({
//   verify: (req, res, buf) => {
//     console.log('Raw body verification:', {
//       contentType: req.headers['content-type'],
//       bodyLength: buf.length,
//       body: buf.toString()
//     });
//   }
// }));

// Add request logging middleware
// app.use((req, res, next) => {
//   const contentLength = req.headers['content-length'];
//   if (!contentLength && req.method === 'POST') {
//     console.warn('Warning: Content-Length header is missing');
//   }
  
//   console.log('Request Debug:', {
//     method: req.method,
//     path: req.path,
//     contentType: req.headers['content-type'],
//     contentLength,
//     bodyPresent: !!req.body,
//     bodyKeys: Object.keys(req.body)
//   });
  
//   next();
// });


// app.use(morgan('dev')); // Log requests to the console

// app.use((req, res, next) => {
//   console.log('Pre-parse debug:', {
//     path: req.path,
//     method: req.method,
//     contentType: req.headers['content-type'],
//     contentLength: req.headers['content-length']
//   });
//   next();
// });

// app.use(express.json()); // Body limit is 10

// app.use((req, res, next) => {
//   console.log('Post-parse debug:', {
//     path: req.path,
//     method: req.method,
//     bodyKeys: Object.keys(req.body),
//     hasBody: Boolean(req.body)
//   });
//   next();
// });

// app.use(express.urlencoded({ extended: true }));

// // Add body parsing debug middleware
// app.use((req, res, next) => {
//   const rawBody = req.body;
//   const contentType = req.headers['content-type'];
//   const contentLength = req.headers['content-length'];

//   console.log('=== Body Parsing Debug ===', {
//     timestamp: new Date().toISOString(),
//     path: req.path,
//     method: req.method,
//     contentType,
//     contentLength,
//     bodyKeys: Object.keys(rawBody),
//     rawBody,
//     hasBody: typeof rawBody !== 'undefined'
//   });

//   next();
// });

// // Security middleware
// app.use(cors({
//     origin: config.corsOrigin,
//     credentials: true
// }));
// app.use(helmet());
// app.use(compression()); // Compress all routes
// app.use(mongoSanitize());   // Data sanitization against NoSQL query injection
// app.use(logRequest); // Log requests

// // Health check route
// app.get('/health', (req, res) => { 
//     res.status(200).json({ status: 'OK', message: 'Server is healthy' });
// });

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'API is working' });
// });

// Routes
// app.use((req, res, next) => {
//   console.log('Pre-route middleware:', {
//     method: req.method,
//     path: req.path,
//     contentType: req.headers['content-type'],
//     hasBody: req._body,
//     bodyKeys: Object.keys(req.body)
//   });
//   next();
// });

// Add this after your middleware setup
// app.post('/test-body-parser', (req, res) => {
//   console.log('Test body parser:', {
//       body: req.body,
//       contentType: req.headers['content-type'],
//       contentLength: req.headers['content-length']
//   });
  
//   res.json({
//       received: req.body,
//       contentLength: req.headers['content-length'],
//       contentType: req.headers['content-type']
//   });
// });

app.use('/api/v1/auth', authRoutes);
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
