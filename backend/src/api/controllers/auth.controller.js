//auth.controller.js
import crypto from 'crypto';
import { AppError } from '../../middleware/error.middleware.js';
import User from '../../models/user.model.js';
import { sendEmail } from '../../utils/email.js';
import logger from '../../utils/logger.js';
import { config } from '../../config/env.js';

// Helper function to debug requests
const debugRequest = (req) => {
    console.log('Auth Controller Debug:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body,
        bodyKeys: Object.keys(req.body),
        hasBody: !!req.body
    });
};

// Helper function to send tokens in response
const sendTokenResponse  = async (user, statusCode, res) => {  
    try {
        const token = user.getSignedJwtToken();
        const refreshToken = user.getRefreshToken(); 
        
        await user.save(); // Save refresh token to the user document

        const options = {
            expires: new Date(Date.now() + config.jwtCookieExpire * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: config.nodeEnv === 'production'
        };

        return res
            .status(statusCode)
            .cookie('token', token, options)
            .json({
                success: true,
                token,
                refreshToken
            });
    } catch (error) {
        logger.error('Error in sendTokenResponse:', error);
        throw error;
    }
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        debugRequest(req);
  
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            console.log('Empty registration body detected');
            return next(new AppError('Request body is empty or malformed', 400));
        }

        const { firstName, lastName, email, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            logger.warn('Missing registration fields:', { 
                firstName: !!firstName, 
                lastName: !!lastName, 
                email: !!email, 
                hasPassword: !!password 
            });
            return next(new AppError('Please provide first name, last name, email and password', 400));
        }

        logger.info('Creating new user:', { email, name: `${firstName} ${lastName}` });

            // Create user
            const user = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password
            });

            // Generate email verification token
            const verificationToken = user.getEmailVerificationToken();
            await user.save();

            // Create verification url
            const verificationUrl = `${config.clientUrl}/api/v1/auth/verify-email/${verificationToken}`;
            logger.info('Verification token generated:', {
                token: verificationToken,
                url: verificationUrl
            });

            const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

            try {
                // Send verification email
                await sendEmail({
                    email: user.email,
                    subject: 'Email Verification',
                    message
                });

                logger.info('Verification email sent successfully');
                await sendTokenResponse(user, 201, res);
            } catch (error) {
                logger.error('Email sending error:', error);
                
                // Delete user if email send fails
                await User.findByIdAndDelete(user._id);

                return next(new AppError('Registration failed: Unable to send complete registration. Please try again later.', 500));
            }
 
    } catch (err) {
        logger.error('Registration error:', {
            error: err.message,
            stack: err.stack,
            body: req.body
        });
        next(new AppError(err.message || 'Error registering user', 500));
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
      debugRequest(req);
      
      const { email, password } = req.body;
  
      // Validate email & password
      if (!email || !password) {
        return next(new AppError('Please provide an email and password', 400));
      }
  
      // Check for user
      const user = await User.findOne({ email }).select('+password');
  
      logger.debug('Login attempt:', {
          email,
          userFound: !!user,
          hasPassword: user?.password ? 'yes' : 'no',
          isVerified: user?.isEmailVerified
      });
  
      if (!user) {
        return next(new AppError('Invalid credentials', 401));
      }
  
      logger.debug('Password comparison details:', {
          passwordLength: password.length,
          hashedPasswordLength: user.password?.length,
          userDetails: {
              id: user._id,
              email: user.email,
              createdAt: user.createdAt
          }
      });
  
      // Check if password matches
      const isMatch = await user.matchPassword(password);
  
      logger.debug('Password check:', {
          userEmail: user.email,
          passwordProvided: password ? 'yes' : 'no',
          hashedPasswordExists: user.password ? 'yes' : 'no',
          passwordMatches: isMatch,
      });
  
      if (!isMatch) {
          logger.debug('Password match failed:', {
              userEmail: user.email,
              providedPasswordLength: password.length
          });
          return next(new AppError('Invalid credentials', 401));
      }
  
      if (!user.isEmailVerified) {
          return next(new AppError('Please verify your email first', 401));
      }
  
      // Create refresh token
      const refreshToken = user.getRefreshToken();
      user.refreshToken = refreshToken;
      await user.save();
  
      logger.info('User logged in successfully:', { email: user.email });
      logger.debug('Login successful, generating tokens:', {
          userId: user._id,
          email: user.email,
          isVerified: user.isEmailVerified
      });
      
      await sendTokenResponse(user, 200, res);
    } catch (err) {
      logger.error('Login error:', err);
      next(new AppError('Error logging in', 500));
    }
  };

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
        logger.warn('Invalid or expired verification token:', token);
        return next(new AppError('Invalid of expired verification token', 400));
    }

    // Set email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    logger.info('Email verified successfully:', user.email );
    
    // Redirect to frontend or return success response
    if (req.accepts('html')) {
        // If accessed via browser, redirect to frontend
        res.redirect(`${config.corsOrigin}/login?verified=true`);
    } else {
        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    }
  } catch (err) {
    logger.error('Email verification error:', err);
    next(new AppError('Error verifying email', 500));
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
    try {
        debugRequest(req);

        const { refreshToken: token } = req.body;

        if (!token) {
            return next(new AppError('Please provide a refresh token', 400));
        }

        const user = await User.findOne({ refreshToken: token });

        if (!user) {
            return next(new AppError('Invalid refresh token', 401));
        }

        // Generate new tokens
        const newAccessToken = user.getSignedJwtToken();
        const newRefreshToken = user.generateRefreshToken();

        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save();

        logger.info('Token refreshed successfully:', { userId: user._id });
        res.status(200).json({
            success: true,
            token: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        logger.error('Token refresh error:', err);
        next(new AppError('Error refreshing token', 500));
    }
};
// @desc    Resend verification email
// @route   POST /api/v1/auth/resend-verification
// @access  Private
export const resendVerification = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (user.isEmailVerified) {
            return next(new AppError('Email already verified', 400));
        }

        // Generate new verification token
        const verificationToken = user.getEmailVerificationToken();
        await user.save();

        // Create verification url
        const verificationUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;
        const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification',
                message
            });

            res.status(200).json({
                success: true,
                message: 'Verification email sent'
            });
        } catch (error) {
            user.emailVerificationToken = undefined;
            user.emailVerificationExpire = undefined;
            await user.save();

            return next(new AppError('Email could not be sent', 500));
        }
    } catch (err) {
        next(new AppError('Error resending verification email', 500));
    }
};

// @desc    Reset password request
// @route   POST /api/v1/auth/reset-password-request
// @access  Public
export const resetPasswordRequest = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save();

        // Create reset url
        const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
        const message = `You requested a password reset. Please click on this link to reset your password: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message
            });

            res.status(200).json({
                success: true,
                message: 'Password reset email sent'
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return next(new AppError('Email could not be sent', 500));
        }
    } catch (err) {
        next(new AppError('Error requesting password reset', 500));
    }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Invalid or expired reset token', 400));
        }

        // Validate password
        if (!req.body.password || req.body.password.length < 6) {
            return next(new AppError('Password must be at least 6 characters', 400));
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (err) {
        next(new AppError('Error resetting password', 500));
    }
};

// @desc    Change password
// @route   POST /api/v1/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return next(new AppError('Current password is incorrect', 401));
        }

        // Validate new password
        if (!req.body.newPassword || req.body.newPassword.length < 6) {
            return next(new AppError('New password must be at least 6 characters', 400));
        }

        // Set new password
        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        next(new AppError('Error changing password', 500));
    }
};