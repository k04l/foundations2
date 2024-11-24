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

//     if (config.nodeEnv === 'production') {
//         options.secure = true;
//     }

//     res
//         .status(statusCode)
//         .cookie('token', token, options)
//         .json({
//             success: true,
//             token,
//             refreshToken
//         });
// };

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
            const verificationUrl = `${config.clientUrl}/verify-email/${verificationToken}`;
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
        // } catch (dbError) {
        //     logger.error('Database error during registration:', dbError);

        //     // Check for duplicate email
        //     if (dbError.code === 11000) {
        //         return next(new AppError('Email already registered', 400));
        //     } 

        //     throw dbError; // Re-throw for general error handling
        // }
    } catch (err) {
        logger.error('Registration error:', {
            error: err.message,
            stack: err.stack,
            body: req.body
        });
        next(new AppError(err.message || 'Error registering user', 500));
    }
};

        // // Create token
        // const token = user.getSignedJwtToken();
        // const refreshToken = user.generateRefreshToken();

        // user.refreshToken = refreshToken;
        // await user.save();

        //         sendTokenResponse(user, 201, res);
        //     } catch (err) {
        //     console.error('Registration error details:', {
        //     name: err.name,
        //     message: err.message,
        //     stack: err.stack,
        //     body: req.body
        //     });
        //     next(new AppError(err.message || 'Error registering user', 500));
        // }
        // };

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

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    if (!user.isEmailVerified) {
        return next(new AppError('Please verify your email first', 401));
    }

    // Create refresh token
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    logger.info('User logged in successfully:', { email: user.email });
    sendTokenResponse(user, 200, res);
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
      return next(new AppError('Invalid token', 400));
    }

    // Set email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    logger.info('Email verified successfully:', { email: user.email });
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
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

// // @desc    Refresh token
// // @route   POST /api/v1/auth/refresh-token
// // @access  Public
// export const refreshToken = async (req, res, next) => {
//   try {
//     debugRequest(req);
    
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return next(new AppError('Please provide a refresh token', 400));
//     }

//     const user = await User.findOne({ refreshToken });

//     if (!user) {
//       return next(new AppError('Invalid refresh token', 401));
//     }

//     // Generate new tokens
//     const token = user.getSignedJwtToken();
//     const newRefreshToken = user.generateRefreshToken();

//     user.refreshToken = newRefreshToken;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       token,
//       refreshToken: newRefreshToken
//     });
//   } catch (err) {
//     logger.error('Token refresh error:', err);
//     next(new AppError('Error refreshing token', 500));
//   }
// };



// // Helper function to send token response
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = user.getSignedJwtToken();
//   const refreshToken = user.refreshToken;

//   const options = {
//     expires: new Date(Date.now() + config.jwtCookieExpire * 24 * 60 * 60 * 1000),
//     httpOnly: true
//   };

//   if (config.nodeEnv === 'production') {
//     options.secure = true;
//   }

//   res
//     .status(statusCode)
//     .cookie('token', token, options)
//     .json({
//       success: true,
//       token,
//       refreshToken
//     });
// };