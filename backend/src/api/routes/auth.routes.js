//auth.routes.js
import express from 'express';
import User from '../../models/user.model.js';
import { 
    register,
    login, 
    verifyEmail, 
    refreshToken 
} from '../controllers/auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
//import { protect } from '../middleware/auth.middleware.js';
import { resendVerification, resetPasswordRequest, resetPassword, changePassword } from '../controllers/auth.controller.js';

const router = express.Router();

// Debug middleware specific to auth routes
router.use((req, res, next) => {
    console.log('Auth Route Received:', {
        path: req.path,
        method: req.method,
        headers: req.headers,
        body: req.body,
        bodyKeys: Object.keys(req.body)
    });
    next();
});

// Add this route temporarily for debugging
router.get('/check-user/:email', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email }).select('+password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        hasPassword: !!user.password,
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.post('/register', (req, res, next) => {
    console.log('Register endpoint hit:', {
        body: req.body,
        hasBody: !!req.body,
        bodyKeys: Object.keys(req.body)
    });
    register(req, res, next);
});
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);
router.post('/resend-verification', protect, resendVerification);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', protect, changePassword);

export default router;