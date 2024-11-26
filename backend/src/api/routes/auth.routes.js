//auth.routes.js
import express from 'express';
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