// src/features/profile/utils/validation.js

export const validateProfileData = (data) => {
    const errors = {};
  
    // Professional Title validation
    if (!data.professionalTitle?.trim()) {
      errors.professionalTitle = 'Professional title is required';
    } else if (data.professionalTitle.length > 100) {
      errors.professionalTitle = 'Professional title must be less than 100 characters';
    }
  
    // Years of Experience validation
    if (data.yearsOfExperience) {
      const years = Number(data.yearsOfExperience);
      if (isNaN(years) || years < 0 || years > 70) {
        errors.yearsOfExperience = 'Years of experience must be between 0 and 70';
      }
    }
  
    // Bio validation
    if (data.bio && data.bio.length > 2000) {
      errors.bio = 'Bio must be less than 2000 characters';
    }
  
    // LinkedIn URL validation
    if (data.linkedin && !data.linkedin.match(/^https:\/\/(www\.)?linkedin\.com\//)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
  
    // Twitter URL validation
    if (data.twitter && !data.twitter.match(/^https:\/\/(www\.)?(twitter\.com|x\.com)\//)) {
      errors.twitter = 'Please enter a valid Twitter/X URL';
    }
  
    // Email validation
    if (data.contactEmail && !data.contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
  
    // Phone validation (basic)
    if (data.phoneNumber && !data.phoneNumber.match(/^[+]?[\d\s-()]{10,}$/)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };