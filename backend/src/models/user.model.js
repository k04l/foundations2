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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
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
    return await bcrypt.compare(enteredPassword, this.password);
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

export default mongoose.model('User', userSchema);
