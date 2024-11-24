//auth.routes.js
import express from 'express';
// import bodyParser from 'body-parser';
import { 
    register,
    login, 
    verifyEmail, 
    refreshToken 
} from '../controllers/auth.controller.js';

// import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Parse JSON bodies for spcified routes
// const jsonParser = bodyParser.json();

// router.use((req, res, next) => {
//     console.log('=== Auth Route Debug ===', {
//         path: req.path,
//         method: req.method,
//         body: req.body,
//         contentType: req.headers['content-type']
//     });
//     next();
// });

// router.post('/register', jsonParser, (req, res, next) => {
//     if (!req.body || Object.keys(req.body).length === 0) {
//         console.log('Empty body in route handler', {
//             headers: req.headers,
//             rawBody: req.rawBody
//         });
//         return res.status(400).json({
//             status: 'error',
//             message: 'No request body received'
//         });
//     }
//     register(req, res, next);
// });
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

// Test endpoint to echo request data
// router.post('/test', (req, res) => {
//     res.json({
//         headers: req.headers,
//         body: req.body,
//         rawBody: req.rawBody?.toString()
//     });
// });

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

export default router;