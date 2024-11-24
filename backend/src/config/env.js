// src/config/env.js
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// import { log } from 'console';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database
    mongoUri: process.env.MONGODB_URI,

    // JWT configuration
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    jwtCookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',

    // Client configuration
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    
    // Email configuration
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    mailFromName: process.env.MAIL_FROM_NAME || 'Foundations',
    
    // Ensure all required variables are present
    validate() {
        const required = {
            JWT_SECRET: this.jwtSecret,
            REFRESH_TOKEN_SECRET: this.refreshTokenSecret,
            MONGODB_URI: this.mongoUri,
            MAIL_USER: this.mailUser,
            MAIL_PASSWORD: this.mailPassword
        };

        const missing = Object.entries(required)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missing.length > 0) {
          throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        
        // for (const field of required) {
        //     if (!this[field]) {
        //         throw new Error(`Required configuration field missing: ${field}`);
        //     }
        // }
    }
};

// Validate configuration on load
try {
  config.validate();
} catch (error) {
  console.error('Configuration error:', error.message);
  process.exit(1);
}


// Get the equivalent of __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Load environment variables from .env file
// dotenv.config({ path: join(__dirname, '../../.env') });

// export const config = {
//   port: process.env.PORT || 3000,
//   nodeEnv: process.env.NODE_ENV || 'development',
//   mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database',
//   jwtSecret: process.env.JWT_SECRET,
//   jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 30,
//   jwtExpire: process.env.JWT_EXPIRE || '30d',
//   corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
//   logLevel: process.env.LOG_LEVEL || 'debug',
//   logDirectory: process.env.LOG_DIRECTORY || 'logs',
//   mailHost: process.env.MAIL_HOST,
//   mailPort: process.env.MAIL_PORT,
//   mailUsername: process.env.MAIL_USERNAME,
//   mailPassword: process.env.MAIL_PASSWORD,
//   mailFromAddress: process.env.MAIL_FROM_ADDRESS,
//   mailFromName: process.env.MAIL_FROM_NAME,
// };
