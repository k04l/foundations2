// src/api/controllers/profile.controller.js
import { AppError } from '../../middleware/error.middleware.js';
import Profile from '../../models/profile.model.js';
import logger from '../../utils/logger.js';
import cloudinary from '../../config/cloudinary.js';
import { promisify } from 'util';

/**
 * Get profile by user ID
 * @route GET /api/v1/profiles/:userId
 * @access Public
 */
export const getProfile = async (req, res, next) => {
  try {
    logger.debug('Fetching profile for user:', req.params.userId);
    
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'name email');

    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    // Increment view count if viewer is not the profile owner
    if (req.user?.id !== req.params.userId) {
      profile.viewCount += 1;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    logger.error('Error fetching profile:', err);
    next(new AppError('Error fetching profile', 500));
  }
};

/**
 * Create or update profile
 * @route PUT /api/v1/profiles
 * @access Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    logger.debug('Updating profile for user:', req.user.id);

    // Handle profile picture upload if included
    let profilePictureData = {};
    if (req.files?.profilePicture) {
      const file = req.files.profilePicture;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'profile-pictures',
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face'
      });

      profilePictureData = {
        url: result.secure_url,
        publicId: result.public_id
      };

      // Delete old profile picture if exists
      const existingProfile = await Profile.findOne({ user: req.user.id });
      if (existingProfile?.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(existingProfile.profilePicture.publicId);
      }
    }

    // Prepare profile data
    const profileData = {
      ...req.body,
      user: req.user.id,
      ...(Object.keys(profilePictureData).length && { profilePicture: profilePictureData })
    };

    // Parse arrays from form data
    if (typeof profileData.specializations === 'string') {
      profileData.specializations = profileData.specializations.split(',').map(s => s.trim());
    }
    if (typeof profileData.certifications === 'string') {
      profileData.certifications = JSON.parse(profileData.certifications);
    }

    // Update or create profile
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      profileData,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    // Calculate completion status
    profile.calculateCompletionStatus();
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    logger.error('Error updating profile:', err);
    next(new AppError(err.message || 'Error updating profile', 500));
  }
};

/**
 * Delete profile picture
 * @route DELETE /api/v1/profiles/picture
 * @access Private
 */
export const deleteProfilePicture = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    if (profile.profilePicture?.publicId) {
      await cloudinary.uploader.destroy(profile.profilePicture.publicId);
    }

    profile.profilePicture = undefined;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully'
    });
  } catch (err) {
    logger.error('Error deleting profile picture:', err);
    next(new AppError('Error deleting profile picture', 500));
  }
};

/**
 * Get profile completion status
 * @route GET /api/v1/profiles/completion
 * @access Private
 */
export const getCompletionStatus = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: { completionStatus: 0 }
      });
    }

    const completionStatus = profile.calculateCompletionStatus();
    
    res.status(200).json({
      success: true,
      data: { completionStatus }
    });
  } catch (err) {
    logger.error('Error getting completion status:', err);
    next(new AppError('Error getting completion status', 500));
  }
};

/**
 * Update profile privacy settings
 * @route PATCH /api/v1/profiles/privacy
 * @access Private
 */
export const updatePrivacy = async (req, res, next) => {
  try {
    const { isPublic } = req.body;

    if (typeof isPublic !== 'boolean') {
      return next(new AppError('Invalid privacy setting', 400));
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { isPublic },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    logger.error('Error updating privacy settings:', err);
    next(new AppError('Error updating privacy settings', 500));
  }
};

/**
 * Get multiple profiles with filtering and pagination
 * @route GET /api/v1/profiles
 * @access Public
 */
export const getProfiles = async (req, res, next) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isPublic: true };
    
    // Apply filters
    if (req.query.specialization) {
      query.specializations = { $in: req.query.specialization.split(',') };
    }
    if (req.query.certification) {
      query['certifications.name'] = { $in: req.query.certification.split(',') };
    }
    if (req.query.company) {
      query.company = { $regex: req.query.company, $options: 'i' };
    }

    // Execute query
    const profiles = await Profile.find(query)
      .populate('user', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ viewCount: -1 });

    // Get total count
    const total = await Profile.countDocuments(query);

    res.status(200).json({
      success: true,
      data: profiles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Error fetching profiles:', err);
    next(new AppError('Error fetching profiles', 500));
  }
};