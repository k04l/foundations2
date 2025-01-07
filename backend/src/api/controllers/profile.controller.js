// src/api/controllers/profile.controller.js
import { AppError } from '../../middleware/error.middleware.js';
import Profile from '../../models/profile.model.js';
import logger from '../../utils/logger.js';
// import cloudinary from '../../config/cloudinary.js';
// import { promisify } from 'util';
import mongoose from 'mongoose';

/**
 * Get profile by user ID
 * @route GET /api/v1/profiles/:userId
 * @access Public
 */
export const getProfile = async (req, res, next) => {
  try {
    logger.debug('Fetching profile for user:', req.params.userId);

    console.log('GetProfile called:', {
        userId: req.params.userId,
        authenicatedUser: req.user?.id,
        headers: req.headers
    });
    
    const profile = await Profile.findOne({ user: req.params.userId });
    console.log('Profile found:', profile);
    
    // If no profile exists, return a default structure
    // This helps the frontend handle new profiles consistently
    if (!profile) {
        // If no profile exists, return a default structure
        return res.status(200).json({
            success: true,
            data: {
                user: req.params.userId,
                professionalTitle: '',
                company: '',
                yearsOfExperience: 0,
                specializations: [],
                certifications: [],
                bio: '',
                completionStatus: 0,
                isNew: true
            }
        });
    }

    res.status(200).json({
        success: true,
        data: profile
    });
} catch (err) {
    logger.error('Profile fetch error:', err);
    next(new AppError('Error fetching profile', 500));
}
};

    // // Increment view count if viewer is not the profile owner
    // if (req.user?.id !== req.params.userId) {
    //   profile.viewCount += 1;
    //   await profile.save();
    // }

/**
 * Create or update profile
 * @route PUT /api/v1/profiles
 * @access Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    logger.debug('Updating profile for user:', req.user.id);
    logger.debug('Profile update data:', req.body);
    console.log('UpdateProfile called:', {
        userId: req.user?.id,
        body: req.body,
        files: req.files,
        collections: await mongoose.connection.db.collections() // this will list all collections
    });

    // Verify user authentication
    if (!req.user?.id) {
        return next(new AppError('Authentication required', 401));
    }

    // Parse certifications properly
    let certifications = [];
    if (req.body.certifications) {
        certifications = Array.isArray(req.body.certifications) 
            ? req.body.certifications
            : typeof req.body.certifications === 'string'
                ? req.body.certifications.split(',').map(cert => cert.trim())
                : [];
    }

    // Handle profile picture upload if included
    let profilePictureData = {};
    if (req.files?.profilePicture) {
      const file = req.files.profilePicture;
      console.log('Processing profile picture:', file);

      profilePictureData = {
        url: file.tempFilePath, // TODO: implement proper file storage
        name: file.name
        };
    }

    // Prepare profile data
    const profileData = {
        ...req.body,
        certifications,
        user: req.user.id,
        ...(Object.keys(profilePictureData).length > 0 && { profilePicture: profilePictureData })
    };

    // Parse specializations if they come as a string
    if (typeof profileData.specializations === 'string') {
        profileData.specializations = profileData.specializations.split(',').map(s => s.trim());
    }

    console.log('Saving profile data:', profileData);

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

    console.log('Profile saved:', profile);

    // Parse arrays from form data
    // if (typeof profileData.specializations === 'string') {
    //     profileData.specializations = profileData.specializations.split(',').map(s => s.trim());
    // }
    // if (typeof profileData.certifications === 'string') {
    //     profileData.certifications = profileData.certifications.split(',').map(s => s.trim());
    // }

    //   // Upload to Cloudinary
    //   const result = await cloudinary.uploader.upload(file.tempFilePath, {
    //     folder: 'profile-pictures',
    //     width: 400,
    //     height: 400,
    //     crop: 'fill',
    //     gravity: 'face'
    //   });

    //   profilePictureData = {
    //     url: result.secure_url,
    //     publicId: result.public_id
    //   };

    //    // Update or create profile
    //     const profile = await Profile.findOneAndUpdate(
    //         { user: req.user.id },
    //         profileData,
    //         {
    //         new: true,
    //         upsert: true,
    //         runValidators: true,
    //         setDefaultsOnInsert: true
    //         }
    //     );

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (err) {
        console.error('Profile update error:', err);
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
        
            // if (profile.profilePicture?.publicId) {
            //     await cloudinary.uploader.destroy(profile.profilePicture.publicId);
            // }
        
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


            // Delete old profile picture if exists
            //   const existingProfile = await Profile.findOne({ user: req.user.id });
            //   if (existingProfile?.profilePicture?.publicId) {
            //     await cloudinary.uploader.destroy(existingProfile.profilePicture.publicId);
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
        
            const completionStatus = profile.completionStatus || 0;;
            
            res.status(200).json({
                success: true,
                data: { completionStatus }
            });
        } catch (err) {
            logger.error('Error getting completion status:', err);
            next(new AppError('Error getting completion status', 500));
        }
      }

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
         * Get all public profiles
         * @route GET /api/v1/profiles
         * @access Public
         */
        export const getProfiles = async (req, res, next) => {
            try {
                const profiles = await Profile.find({ isPublic: true })
                    .populate('user', 'name email');

                res.status(200).json({
                    success: true,
                    data: profiles
                });
            } catch (err) {
                logger.error('Error fetching profiles:', err);
                next(new AppError('Error fetching profiles', 500));
            }
        };



//     // Prepare profile data
//     const profileData = {
//       ...req.body,
//       user: req.user.id,
//       ...(Object.keys(profilePictureData).length && { profilePicture: profilePictureData })
//     };

//     // Parse arrays from form data
//     if (typeof profileData.specializations === 'string') {
//       profileData.specializations = profileData.specializations.split(',').map(s => s.trim());
//     }
//     if (typeof profileData.certifications === 'string') {
//       profileData.certifications = JSON.parse(profileData.certifications);
//     }


//     // Calculate completion status
//     profile.calculateCompletionStatus();
//     await profile.save();

//     res.status(200).json({
//       success: true,
//       data: profile
//     });
//   } catch (err) {
//     logger.error('Error updating profile:', err);
//     next(new AppError(err.message || 'Error updating profile', 500));
//   }
// };

// /**
//  * Delete profile picture
//  * @route DELETE /api/v1/profiles/picture
//  * @access Private
//  */
// export const deleteProfilePicture = async (req, res, next) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id });
    
//     if (!profile) {
//       return next(new AppError('Profile not found', 404));
//     }

//     if (profile.profilePicture?.publicId) {
//       await cloudinary.uploader.destroy(profile.profilePicture.publicId);
//     }

//     profile.profilePicture = undefined;
//     await profile.save();

//     res.status(200).json({
//       success: true,
//       message: 'Profile picture deleted successfully'
//     });
//   } catch (err) {
//     logger.error('Error deleting profile picture:', err);
//     next(new AppError('Error deleting profile picture', 500));
//   }
// };

// /**
//  * Get profile completion status
//  * @route GET /api/v1/profiles/completion
//  * @access Private
//  */
// export const getCompletionStatus = async (req, res, next) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id });
    
//     if (!profile) {
//       return res.status(200).json({
//         success: true,
//         data: { completionStatus: 0 }
//       });
//     }

//     const completionStatus = profile.calculateCompletionStatus();
    
//     res.status(200).json({
//       success: true,
//       data: { completionStatus }
//     });
//   } catch (err) {
//     logger.error('Error getting completion status:', err);
//     next(new AppError('Error getting completion status', 500));
//   }
// };

// /**
//  * Update profile privacy settings
//  * @route PATCH /api/v1/profiles/privacy
//  * @access Private
//  */
// export const updatePrivacy = async (req, res, next) => {
//   try {
//     const { isPublic } = req.body;

//     if (typeof isPublic !== 'boolean') {
//       return next(new AppError('Invalid privacy setting', 400));
//     }

//     const profile = await Profile.findOneAndUpdate(
//       { user: req.user.id },
//       { isPublic },
//       { new: true }
//     );

//     if (!profile) {
//       return next(new AppError('Profile not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: profile
//     });
//   } catch (err) {
//     logger.error('Error updating privacy settings:', err);
//     next(new AppError('Error updating privacy settings', 500));
//   }
// };

// /**
//  * Get multiple profiles with filtering and pagination
//  * @route GET /api/v1/profiles
//  * @access Public
//  */
// export const getProfiles = async (req, res, next) => {
//   try {
//     // Parse query parameters
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const skip = (page - 1) * limit;

//     // Build query
//     const query = { isPublic: true };
    
//     // Apply filters
//     if (req.query.specialization) {
//       query.specializations = { $in: req.query.specialization.split(',') };
//     }
//     if (req.query.certification) {
//       query['certifications.name'] = { $in: req.query.certification.split(',') };
//     }
//     if (req.query.company) {
//       query.company = { $regex: req.query.company, $options: 'i' };
//     }

//     // Execute query
//     const profiles = await Profile.find(query)
//       .populate('user', 'name')
//       .skip(skip)
//       .limit(limit)
//       .sort({ viewCount: -1 });

//     // Get total count
//     const total = await Profile.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: profiles,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (err) {
//     logger.error('Error fetching profiles:', err);
//     next(new AppError('Error fetching profiles', 500));
//   }
// };