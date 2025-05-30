// src/api/routes/projects.routes.js

import express from 'express';
import Company from '../../models/company.model.js';

console.log('projects.routes.js loaded (top of file)');

const router = express.Router();

router.use((req, res, next) => {
  console.log('projects.routes.js router middleware:', req.method, req.path);
  next();
});

// GET /api/projects - Fetch all projects from all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    // Flatten all projects from all companies
    const projects = companies.flatMap(c => c.projects.map(p => ({ ...p.toObject(), companyId: c.id })));
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - Save or update a project (by companyId and project id)
router.post('/', async (req, res) => {
  console.log('POST /api/v1/projects hit', { body: req.body }); // DEBUG LOG
  try {
    const { companyId, ...project } = req.body;
    if (!companyId) return res.status(400).json({ error: 'companyId required' });
    const company = await Company.findOne({ id: companyId });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const idx = company.projects.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      company.projects[idx] = { ...company.projects[idx].toObject(), ...project };
    } else {
      company.projects.push(project);
    }
    await company.save();
    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// Test route to confirm the router is loaded and mounted
router.get('/test', (req, res) => {
  res.json({ message: 'projects.routes.js is working!' });
});

export default router;