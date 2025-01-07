// src/api/routes/profile.routes.js
import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
// import fileUpload from 'express-fileupload';
import {
  getProfile,
  updateProfile,
  deleteProfilePicture,
  getCompletionStatus,
  updatePrivacy,
  getProfiles
} from '../controllers/profile.controller.js';

const router = express.Router();

// Debug middleware for profile routes
router.use((req, res, next) => {
    console.log('Profile Route Debug:', {
        method: req.method,
        path: req.path,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body,
        userId: req.user?.id,
        headers: req.headers
    });
    next();
});

// Test route that doesn't require authentication
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Profile routes are working',
        baseUrl: req.baseUrl,
        path: req.path 
    });
});

// Debug endpoint for testing
router.get('/debug', (req, res) => {
    res.json({ 
        message: 'Profile routes are accessable',
        authenticated: !!req.user,
        userId: req.user?.id,
        headers: req.headers
     });
});

// Set up file upload middleware
// const uploadMiddleware = fileUpload({
//   useTempFiles: true,
//   tempFileDir: '/tmp/',
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   abortOnLimit: true,
//   safeFileNames: true,
//   preserveExtension: 4
// });

// Public routes (unauthenticated)
router.get('/', getProfiles);

// Protected routes (require authentication)
router.use(protect);


router.route('/:userId').get(getProfile);

router.route('/')
    .post(updateProfile)
    .put(updateProfile);

router.route('/picture')
    .delete(deleteProfilePicture);

router.route('/completion')
    .get(getCompletionStatus);

router.route('/privacy')
    .patch(updatePrivacy);

// Debug endpoint to check route registration
router.get('/debug', (req, res) => {
  res.json({ 
    message: 'Profile routes are working',
    userContext: {
        id: req.user?.id,
        isAuthenticated: !!req.user
    } 

  });
});

export default router;