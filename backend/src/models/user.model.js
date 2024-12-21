// // src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    console.log('Pre-save hook triggered:', {
        isPasswordModified: this.isModified('password'),
        passwordLength: this.password?.length
    });

    if (!this.isModified('password')) {
        next();
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        console.log('Password hashing:', {
            originalLength: this.password?.length,
            hashedLength: hashedPassword.length
        });
        this.password = hashedPassword;
        next();
    } catch (err) {
        console.error('Password hashing error:', err);
        next(err);
    }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
    );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        console.log('matchPassword debug:', {
            hasStoredPassword: !!this.password,
            storedPasswordLength: this.password?.length,
            enteredPasswordLength: enteredPassword?.length
        });
        
        if (!this.password || !enteredPassword) {
            console.error('Password comparison failed: Missing password data');
            return false;
        }

        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        console.log('Password comparison result:', isMatch);
        
        return isMatch;
    } catch (err) {
        console.error('Password match error:', err);
        return false;
    }
};

// Generate refresh token
userSchema.methods.getRefreshToken = function() {
    const refreshToken = jwt.sign(
        { id: this._id },
        config.refreshTokenSecret,
        { expiresIn: config.refreshTokenExpire }
    );
    
    // Store the refresh token in the user document
    this.refreshToken = refreshToken;
    return refreshToken;
};

// Generate and hash email verification token
userSchema.methods.getEmailVerificationToken = function() {
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to emailVerificationToken field
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    // Set expire
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    return verificationToken;
};

userSchema.methods.createPasswordResetToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire to 24 hours
    this.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;

    return resetToken;
}

export default mongoose.model('User', userSchema);
