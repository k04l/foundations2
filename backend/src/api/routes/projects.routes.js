// src/api/routes/projects.routes.js

import express from 'express';
const router = express.Router();

// GET /api/projects - Fetch all projects
router.get('/', (req, res) => {
  // Replace this with actual logic to fetch projects from your database
  res.status(200).json({ projects: [] }); // Placeholder response
});

// POST /api/projects - Create a new project (optional)
router.post('/', (req, res) => {
  // Replace this with actual logic to save a project
  res.status(200).json({ message: 'Project saved' });
});

export default router;