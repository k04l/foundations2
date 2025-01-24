// src/api/controllers/profile.controller.js
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { AppError } from '../../middleware/error.middleware.js';
import Profile from '../../models/profile.model.js';
import User from '../../models/user.model.js';
import logger from '../../utils/logger.js';
// import cloudinary from '../../config/cloudinary.js';
// import { promisify } from 'util';
import mongoose from 'mongoose';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid'; 
import { processSpecializations, processCertifications } from '../../utils/dataProcessing.js';

// Get directory name of current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// Configure upload paths
const UPLOAD_CONFIG = {
    // Store uploads in the root level 'uploads' folder
    uploadsDir: path.join(projectRoot, 'uploads'),
    profilePicsDir: path.join(projectRoot, 'uploads', 'profiles'),
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    fileNameLength: 100 // Maximum filename length
};

// Helper function to ensure upload directories exist
const ensureUploadDirs = async () => {
    try {
        // Create both directories if they don't exist
        await fs.mkdir(UPLOAD_CONFIG.uploadsDir, { recursive: true });
        await fs.mkdir(UPLOAD_CONFIG.profilePicsDir, { recursive: true });
        console.log('Upload directories confirmed:', {
            uploads: UPLOAD_CONFIG.uploadsDir,
            profiles: UPLOAD_CONFIG.profilePicsDir
        });
    } catch (error) {
        console.error('Error creating upload directories:', error);
        throw error;
    }
};

await ensureUploadDirs().catch(error => {
    console.error('Failed to create upload directories:', error);
});

/**
 * Get profile by user ID
 * @route GET /api/v1/profiles/:userId
 * @access Public
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching profile for user:', userId);
    
    let profile = await Profile.findOne({ user: userId });
    console.log('Profile found:', profile);
    
    // If no profile exists, return a default structure
    // This helps the frontend handle new profiles consistently
    if (!profile) {
        // Instead of immediately creating a profile with missing required fields,
        // return a template that matches our frontend expectations
        return res.status(200).json({
            success: true,
            data: {
                user: userId,
                firstName: '',
                lastName: '',
                professionalTitle: '',
                company: '',
                yearsOfExperience: 0,
                specializations: [],
                certifications: { name: [] },
                bio: '',
                contactEmail: '',
                phoneNumber: '',
                linkedin: '',
                twitter: '',
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
    let tempFilePath = null;

    try {
        logger.debug('Profile update started:', {
            userId: req.user.id,
            hasFiles: !!req.files,
            contentType: req.headers['content-type']
        });

        // Create a copy of the profile data
        const profileData = { ...req.body };
        
        // Log the raw request data for debugging
        logger.debug('Raw request data:', {
            body: req.body,
            filesKeys: req.files ? Object.keys(req.files) : []
        });

        // Basic validation
        if (!profileData.firstName || !profileData.lastName) {
            throw new AppError('First name and last name are required', 400);
        }

        // Ensure user ID is set
        profileData.user = req.user.id;

        // Parse any JSON strings in the form data
        for (const [key, value] of Object.entries(profileData)) {
            if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                try {
                    profileData[key] = JSON.parse(value);
                } catch (e) {
                    logger.warn(`Failed to parse JSON for field ${key}:`, e);
                }
            }
        }

        // Handle profile picture
        if (req.files?.profilePicture) {
            const file = req.files.profilePicture;
            tempFilePath = file.tempFilePath;

            try {
                logger.debug('Processing profile picture:', {
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.mimetype
                });

               const imageResult = await handleProfilePicture(file);
               profileData.profilePicture = imageResult;

               // Clean up old profile picture if it exists
               const existingProfile = await Profile.findOne({ user: req.user.id });
               if (existingProfile?.profilePicture?.url) {
                   const oldFilePath = path.join(UPLOAD_CONFIG.profilePicsDir, 
                       path.basename(existingProfile.profilePicture.url));
                   if (existsSync(oldFilePath)) {
                       await fs.unlink(oldFilePath);
                       logger.debug('Old profile picture removed:', oldFilePath);    
                   }
               }

            } catch (imageError) {
                logger.error('Profile picture processing failed:', imageError);
                throw imageError;
            }
        }

        logger.debug('Processed profile data:', profileData);

        // // Process arrays and objects
        // try {
        //     if (typeof profileData.specializations === 'string') {
        //         profileData.specializations = JSON.parse(profileData.specializations);
        //     }
        //     if (typeof profileData.certifications === 'string') {
        //         profileData.certifications = JSON.parse(profileData.certifications);
        //     }
        // } catch (parseError) {
        //     logger.error('Error parsing form data:', parseError);
        //     throw new AppError('Invalid form data format', 400);
        // }

        // // Remove fields that shouldn't be directly updated
        // delete profileData._id;
        // delete profileData.__v;

        // logger.debug('Updating profile with data:', profileData);

        // Update or create the profile
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

        logger.info('Profile updated successfully:', {
            userId: req.user.id,
            profileId: profile._id
        });


        res.status(200).json({
            success: true,
            data: profile
        });
        
    } catch (err) {
        // Clean up temp file if it exists and there was an error
        if (tempFilePath && existsSync(tempFilePath)) {
            try {
                await fs.unlink(tempFilePath);
                logger.debug('Cleaned up temp file:', tempFilePath);
            } catch (cleanupError) {
                logger.error('Error cleaning up temp file:', cleanupError);
            }
        }

        logger.error('Profile update error:', {
            error: err.message,
            stack: err.stack
        });
        
        next(new AppError(err.message || 'Error updating profile', 500));
    }
};
  
    //   // Handle profile picture
    //   if (req.files?.profilePicture) {
    //     console.log('Processing profile picture:', req.files.profilePicture);

    //     // Handle  single file or array of files
    //     const file = req.files.profilePicture;
        
    //     // Create uploads directory if it doesn't exist
    //     const uploadPath = path.join(__dirname, '../../uploads/profiles');
    //     await fs.mkdir(uploadPath, { recursive: true });

    //     const fileName = `${Date.now()}-${file.name}`;
    //     const filePath = path.join(uploadPath, fileName);

    const handleProfilePicture = async (file) => {
        if (!file) {
            logger.error('No file provided for profile picture');
            throw new AppError('No file provided', 400);
        }
      
        // Validate file type
        if (!UPLOAD_CONFIG.allowedTypes.includes(file.mimetype)) {
            logger.error(`Invalid file type: ${file.mimetype}`);
            throw new AppError('Only JPG, PNG and GIF files are allowed', 400);
        }

        // Validate file size
        if (file.size > UPLOAD_CONFIG.maxFileSize) {
            logger.error(`File too large: ${file.size} bytes`);
            throw new AppError('File size must be less than 10MB', 400);
        }
      
        try {
            // Log the attempt
            logger.debug('Processing profile picture:', {
                originalName: file.name,
                size: file.size,
                type: file.mimetype,
                tempPath: file.tempFilePath
            });

            // Create a unique filename
            const fileExtension = path.extname(file.name).toLowerCase();
            const timestamp = Date.now();
            const uniqueId = uuidv4().slice(0, 8);
            const filename = `${timestamp}-${uniqueId}${fileExtension}`;
    
            // Construct file path
            const filePath = path.join(UPLOAD_CONFIG.profilePicsDir, filename);

            // Log file path details
            logger.debug('File path details:', {
                filename,
                fullPath: filePath,
                profilePicsDir: UPLOAD_CONFIG.profilePicsDir
            });
        
      
          // Ensure directory exists
          await fs.mkdir(path.dirname(filePath), { recursive: true });
      
          // Move file
          await new Promise((resolve, reject) => {
            file.mv(filePath, (err) => {
                if (err) {
                    logger.error('File move failed:', {
                        error: err.message,
                        tempPath: file.tempFilePath,
                        destinationPath: filePath
                    });
                    reject(new AppError('Failed to save file', 500));
                }
                logger.debug('File saved successfully:', { path: filePath });
                resolve();
            });
        });

          // Verify file was saved
          const exists = await fs.access(filePath).then(() => true).catch(() => false);
          if (!exists) {
            throw new AppError('File was not saved correctly', 500);
          }
      
          // Return the profile picture data
            const pictureData = {
                url: `/uploads/profiles/${filename}`,
                name: file.name,
                size: file.size,
                type: file.mimetype
            };

            logger.debug('Profile picture processed successfully:', pictureData);
            return pictureData;

        } catch (error) {
            logger.error('File processing error:', {
                error: error.message,
                stack: error.stack,
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.mimetype
                }
            });
          throw error instanceof AppError ? error : new AppError('Failed to process profile picture', 500);
        }
        };


  
        // Ensure upload directory exists
        // await fs.promises.mkdir(uploadPath, { recursive: true });
        
        // Move file
    //     await file.mv(filePath);
  
    //     profileData.profilePicture = {
    //       url: `/uploads/profiles/${fileName}`,
    //       name: file.name
    //     };
    //   }

    //   // Remove unwanted fields that shouldn't be updated directly
    //   delete profileData._id;
    //   delete profileData.__v;
    // //   delete profileData.user;
  
    //   // Update the profile
    //   const profile = await Profile.findOneAndUpdate(
    //     { user: req.user.id },
    //     profileData,
    //     { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    //   );
  
    //   // Also update the user's name
    //   if (profileData.firstName && profileData.lastName) {
    //     await User.findByIdAndUpdate(req.user.id, {
    //       name: `${profileData.firstName} ${profileData.lastName}`
    //     });
    //   }

    //   logger.info('Profile updated successfully:', {
    //     user: req.user.id,
    //     profileId: profile._id
    //   })
  
//       res.status(200).json({
//         success: true,
//         data: profile
//       });
//     } catch (err) {
//         logger.error('Error updating profile:', err);
//       next(new AppError(err.message || 'Error updating profile', 500));
//     }
//   };

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