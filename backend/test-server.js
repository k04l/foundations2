import express from 'express';

const app = express();

// Basic raw body parser
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log('\n=== Incoming Request ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Test endpoint
app.post('/test', (req, res) => {
    res.json({
        message: 'Request received',
        headers: req.headers,
        body: req.body
    });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});