// src/api/routes/routes.js

import express, { query } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
// import debugRoutes from './debug.routes.js';

// Import controllers (you'll need to create these)
// Commented out until you create the controllers
// import {
//   getAllItems,
//   getItemById,
//   createItem,
//   updateItem,
//   deleteItem
// } from '../controllers/items.controller.js';

const router = express.Router();

// Debug middleware for all routes
router.use((req, res, next) => {
  console.log('Route Debug:', {
    method: req.method,
    path: req.path,
    fullPath: req.originalUrl,
    baseUrl: req.baseUrl,
    params: req.params,
    query: req.query
  });
  next();
});

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
// router.use('/debug', debugRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Debug endpoint to see registered routes
router.get('/debug/routes', (req, res) => {
  const routes = [];
  
  // Collect routes from the router stack
  const addRoutes = (stack, prefix = '') => {
    stack.forEach(layer => {
      if (layer.route) {
        // Route handler
        routes.push({
          path: prefix + layer.route.path,
          methods: Object.keys(layer.route.methods)
        });
      } else if (layer.name === 'router') {
        // Nested router
        addRoutes(layer.handle.stack, prefix + layer.regexp.source.replace('\\/?(?=\\/|$)', ''));
      }
    });
  };

  addRoutes(router.stack);
  
  res.json({
    success: true,
    routes
  });
});

// Example routes - Uncomment and modify once you have controllers
// Items routes
// router
//   .route('/items')
//   .get((req, res) => {
//     // getAllItems
//     res.status(200).json({ message: 'Get all items' });
//   })
//   .post((req, res) => {
//     // createItem
//     res.status(201).json({ message: 'Create new item', data: req.body });
//   });

// router
//   .route('/items/:id')
//   .get((req, res) => {
//     // getItemById
//     res.status(200).json({ message: `Get item ${req.params.id}` });
//   })
//   .put((req, res) => {
//     // updateItem
//     res
//       .status(200)
//       .json({ message: `Update item ${req.params.id}`, data: req.body });
//   })
//   .delete((req, res) => {
//     // deleteItem
//     res.status(200).json({ message: `Delete item ${req.params.id}` });
//   });

// // Users routes example
// router
//   .route('/users')
//   .get((req, res) => {
//     res.status(200).json({ message: 'Get all users' });
//   })
//   .post((req, res) => {
//     res.status(201).json({ message: 'Create new user', data: req.body });
//   });

// router
//   .route('/users/:id')
//   .get((req, res) => {
//     res.status(200).json({ message: `Get user ${req.params.id}` });
//   })
//   .put((req, res) => {
//     res
//       .status(200)
//       .json({ message: `Update user ${req.params.id}`, data: req.body });
//   })
//   .delete((req, res) => {
//     res.status(200).json({ message: `Delete user ${req.params.id}` });
//   });

// Error handling for undefined routes
router.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default router;
