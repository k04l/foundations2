// src/api/routes/debug.routes.js
import express from 'express';

const router = express.Router();

router.get('/routes', (req, res) => {
  // Get all registered routes
  const routes = [];
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  
  res.json({
    success: true,
    routes
  });
});

export default router;