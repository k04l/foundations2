// src/features/profile/utils/completion.js

export const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
  
    const fields = [
      {
        name: 'professionalTitle',
        weight: 15,
        isComplete: !!profile.professionalTitle?.trim()
      },
      {
        name: 'company',
        weight: 10,
        isComplete: !!profile.company?.trim()
      },
      {
        name: 'yearsOfExperience',
        weight: 10,
        isComplete: profile.yearsOfExperience > 0
      },
      {
        name: 'specializations',
        weight: 15,
        isComplete: Array.isArray(profile.specializations) && profile.specializations.length > 0
      },
      {
        name: 'certifications',
        weight: 10,
        isComplete: profile.certifications?.name?.length > 0
      },
      {
        name: 'bio',
        weight: 15,
        isComplete: !!profile.bio?.trim()
      },
      {
        name: 'profilePicture',
        weight: 10,
        isComplete: !!profile.profilePicture?.url
      },
      {
        name: 'contact',
        weight: 15,
        isComplete: !!(profile.contactEmail || profile.phoneNumber || profile.linkedin)
      }
    ];
  
    const completedWeight = fields.reduce((total, field) => {
      return total + (field.isComplete ? field.weight : 0);
    }, 0);
  
    return Math.round(completedWeight);
  };