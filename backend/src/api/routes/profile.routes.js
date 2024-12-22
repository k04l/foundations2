// src/api/routes/profile.routes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfilePicture,
  getCompletionStatus,
  updatePrivacy,
  getProfiles
} from '../controllers/profile.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import fileUpload from 'express-fileupload';

const router = express.Router();

// Set up file upload middleware
const uploadMiddleware = fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: 4
});

// Public routes
router.get('/profiles', getProfiles);
router.get('/profiles/:userId', getProfile);

// Protected routes (require authentication)
router.use(protect);
router.put('/profiles', uploadMiddleware, updateProfile);
router.delete('/profiles/picture', deleteProfilePicture);
router.get('/profiles/completion', getCompletionStatus);
router.patch('/profiles/privacy', updatePrivacy);

export default router;