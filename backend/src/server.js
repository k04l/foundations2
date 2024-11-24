// src/server.js
import app from './app.js';
import logger from './utils/logger.js';
import { config } from './config/env.js';

const startServer = async () => {
    try {
        const server = app.listen(config.port, () => {
            logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
        });

        // Set timeouts
        server.timeout = 5000; // 5 seconds
        server.keepAliveTimeout = 5000;

        // Handle server errors
        server.on('error', (error) => {
            logger.error('Server error:', error);
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${config.port} is in use`);
                process.exit(1);
            }
        });

        return server;
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
};

// Handle termination
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    server?.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

// Start the server
const server = await startServer();

export default server;