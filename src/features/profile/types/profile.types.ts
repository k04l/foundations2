// src/features/profile/types/profile.types.ts

export interface Profile {
    _id?: string;
    user: string;
    firstname: string;
    lastName: string;
    professionalTitle: string;
    company: string;
    yearsOfExperience: number;
    specializations: string[];
    certifications: {
      name: string[];
    };
    bio: string;
    contactEmail?: string;
    phoneNumber?: string;
    linkedin?: string;
    twitter?: string;
    profilePicture?: {
      url: string;
      name: string;
    };
    completionStatus: number;
    isPublic: boolean;
    viewCount: number;
    projectCount: number;
    connectionsCount: number;
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ProfileFormData {
    user?: string;
    firstName: string;
    lastName: string;
    professionalTitle: string;
    company: string;
    yearsOfExperience: number;
    specializations: string[] | string; // Can be either array or string during editing
    certifications: {
        name: string[] | string; // Can be either array or string during editing;
    };
    bio: string;
    contactEmail?: string;
    phoneNumber?: string;
    linkedin?: string;
    twitter?: string;
    isNew?: boolean;
    // profilePicture: File;
    // isPublic?: boolean;
  }

  export interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
  }