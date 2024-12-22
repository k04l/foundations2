// src/models/profile.model.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  // Reference to the user this profile belongs to
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Professional Information
  professionalTitle: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true,
    maxlength: [100, 'Professional title cannot be more than 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    max: [70, 'Years of experience cannot exceed 70']
  },
  
  // Skills and Expertise
  specializations: [{
    type: String,
    trim: true
  }],
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: Date,
    expiryDate: Date,
    issuingBody: String
  }],

  // Detailed Information
  bio: {
    type: String,
    trim: true,
    maxlength: [2000, 'Bio cannot be more than 2000 characters']
  },

  // Contact Information
  contactEmail: {
    type: String,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email'
    ]
  },
  phoneNumber: {
    type: String,
    trim: true
  },

  // Social Media Links
  socialLinks: {
    linkedin: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || v.startsWith('https://linkedin.com/') || v.startsWith('https://www.linkedin.com/');
        },
        message: 'Please provide a valid LinkedIn URL'
      }
    },
    twitter: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || v.startsWith('https://twitter.com/') || v.startsWith('https://x.com/');
        },
        message: 'Please provide a valid Twitter/X URL'
      }
    }
  },

  // Profile Picture
  profilePicture: {
    url: String,
    publicId: String  // For cloud storage reference (e.g., Cloudinary)
  },

  // Profile Completion and Privacy
  completionStatus: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isPublic: {
    type: Boolean,
    default: true
  },

  // Metrics
  viewCount: {
    type: Number,
    default: 0
  },
  projectCount: {
    type: Number,
    default: 0
  },
  connectionsCount: {
    type: Number,
    default: 0
  },

  // Timestamps for tracking
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to update lastUpdated timestamp
profileSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Method to calculate profile completion percentage
profileSchema.methods.calculateCompletionStatus = function() {
  const requiredFields = [
    'professionalTitle',
    'company',
    'yearsOfExperience',
    'specializations',
    'bio',
    'profilePicture'
  ];

  const completedFields = requiredFields.filter(field => {
    const value = this[field];
    return value && (
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'object' && value.url) ||
      (typeof value === 'string' && value.trim().length > 0) ||
      (typeof value === 'number' && value > 0)
    );
  });

  this.completionStatus = Math.round((completedFields.length / requiredFields.length) * 100);
  return this.completionStatus;
};

// Virtual populate for associated projects (if you implement project functionality later)
profileSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'profile'
});

export default mongoose.model('Profile', profileSchema);