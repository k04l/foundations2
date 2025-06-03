//auth.routes.js
import express from 'express';
import User from '../../models/user.model.js';
import { 
    register,
    login, 
    verifyEmail, 
    refreshToken, 
    verifyToken
} from '../controllers/auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
//import { protect } from '../middleware/auth.middleware.js';
import { resendVerification, resetPasswordRequest, resetPassword, changePassword } from '../controllers/auth.controller.js';
import { verify } from 'crypto';
import passport from '../../config/passport.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import crypto from 'crypto';

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

// Development-only route for deleting test users
if (config.nodeEnv === 'development') {
    router.delete('/delete-test-user/:email', async (req, res) => {
        try {
            const result = await User.deleteOne({ email: req.params.email });
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            res.json({
                success: true,
                message: `User deleted: ${result.deletedCount} document(s) removed`
            });
        } catch (error) {
            console.error('Delete test user error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });
}

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

router.get('/verify-token', protect, verifyToken);

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

// Google OAuth routes
router.get(
  '/google',
  (req, res, next) => {
    const state = crypto.randomBytes(32).toString('hex');
    req.session.oauthState = state;
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: state
    })(req, res, next);
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    // Redirect to frontend with token
    res.redirect(`${config.clientUrl}/auth/google/success?token=${token}`);
  }
);

export default router;