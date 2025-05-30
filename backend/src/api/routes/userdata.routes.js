import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import {
  getUserProjects,
  upsertUserProject,
  deleteUserProject
} from '../controllers/userdata.controller.js';

const router = express.Router();

router.use(protect);

// Projects
router.get('/projects', getUserProjects);
router.post('/projects', upsertUserProject);
router.delete('/projects/:projectId', deleteUserProject);

// TODO: Add similar routes for people

export default router;
