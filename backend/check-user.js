// backend/check-user.js

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';

// Define a minimal user schema to avoid loading the full model
const UserSchema = new mongoose.Schema({
    email: String,
    isEmailVerified: Boolean,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    name: String,
    password: { type: String, select: false }
});

const User = mongoose.model('User', UserSchema);

async function checkUser() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Find a user with password field explicitly selected
        const user = await User.findOne({ email: 'cmharmon89@gmail.com' }).select('+password');
        
        if (!user) {
            console.log('No user found with this email');
            return;
        }

        console.log('User found:', {
            email: user.email,
            name: user.name,
            isVerified: user.isEmailVerified,
            hasPassword: !!user.password,
            passwordLength: user?.password?.length,
            // hasVerificationToken: !!user.emailVerificationToken,
            // verificationExpire: user.emailVerificationExpire,
            // verificationToken: user.emailVerificationToken // This helps us debug the verification
        });

        // Test password match
        const testPassword = 'Password123!';
        const passwordMatch = await bcryptjs.compare(testPassword, user.password);

        console.log('Password test:', {
            hashedPasswordInDB: user.password,
            testPasswordMatches: passwordMatch
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

checkUser();