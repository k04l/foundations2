// src/models/profile.model.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  // Reference to the user this profile belongs to
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    get: function() {
      return `${this.firstName} ${this.lastName}`;
    }
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
  specializations: {
    type: [String],
    default: []
  },
  certifications: {
    type: {
      name: {
        type: [String],
        default: []
      },
    },
    default: () => ({ name: [] })
  },

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
  },

  // Profile Picture
  profilePicture: {
    url: String,
    // publicId: String,  // For cloud storage reference (e.g., Cloudinary)
    name: String
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

// Middleware to clean up specializations
profileSchema.pre('save', function(next) {
  // Clean up specializations
  if (this.specializations) {
    try {
      // Convert all items to strings and flatten any nested arrays
      this.specializations = this.specializations
        .map(item => {
          if (typeof item === 'string') {
            try {
              // Try to parse if it's a JSON string
              const parsed = JSON.parse(item);
              return Array.isArray(parsed) ? parsed : [item];
            } catch {
              return [item];
            }
          }
          return Array.isArray(item) ? item : [item];
        })
        .flat()
        .filter(Boolean)
        .map(item => item.toString().trim());

      // Remove duplicates
      this.specializations = [...new Set(this.specializations)];
    } catch (error) {
      console.error('Error processing specializations:', error);
      this.specializations = [];
    }
  }

  // Clean up certifications
  if (this.certifications && Array.isArray(this.certifications.name)) {
    this.certifications.name = [...new Set(this.certifications.name
      .filter(Boolean)
      .map(cert => cert.toString().trim())
    )];
  }

  // Update lastUpdated timestamp
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
      (typeof value === 'object' && value.url) ||
      (typeof value === 'string' && value.trim().length > 0) ||
      (typeof value === 'number' && value > 0)
    );
  });

  this.completionStatus = Math.round((completedFields.length / requiredFields.length) * 100);
  return this.completionStatus;
};

// Virtual populate for associated projects (if you implement project functionality later)
// profileSchema.virtual('projects', {
//   ref: 'Project',
//   localField: '_id',
//   foreignField: 'profile'
// });

export default mongoose.model('Profile', profileSchema);