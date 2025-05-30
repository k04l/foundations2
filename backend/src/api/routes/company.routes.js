// backend/src/api/routes/company.routes.js
import express from 'express';
import { getCompanies, upsertCompany, deleteCompany } from '../controllers/company.controller.js';

const router = express.Router();

router.get('/', getCompanies);
router.post('/', upsertCompany);
router.delete('/:id', deleteCompany);

// Individuals
router.post('/:id/individuals', (req, res, next) => import('../controllers/company.controller.js').then(m => m.addIndividual(req, res, next)));
router.put('/:id/individuals/:personId', (req, res, next) => import('../controllers/company.controller.js').then(m => m.editIndividual(req, res, next)));
router.delete('/:id/individuals/:personId', (req, res, next) => import('../controllers/company.controller.js').then(m => m.deleteIndividual(req, res, next)));
// Projects
router.post('/:id/projects', (req, res, next) => import('../controllers/company.controller.js').then(m => m.addProject(req, res, next)));
router.put('/:id/projects/:projectId', (req, res, next) => import('../controllers/company.controller.js').then(m => m.editProject(req, res, next)));
router.delete('/:id/projects/:projectId', (req, res, next) => import('../controllers/company.controller.js').then(m => m.deleteProject(req, res, next)));
// Assign/remove people to/from projects
router.post('/:id/projects/:projectId/people', (req, res, next) => import('../controllers/company.controller.js').then(m => m.togglePersonOnProject(req, res, next)));

export default router;
