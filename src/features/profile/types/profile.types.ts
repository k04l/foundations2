// src/features/profile/types/profile.types.ts

export interface Profile {
    _id?: string;
    user: string;
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
  
  export interface ProfileUpdateData {
    professionalTitle?: string;
    company?: string;
    yearsOfExperience?: number;
    specializations?: string[];
    certifications?: string[];
    bio?: string;
    contactEmail?: string;
    phoneNumber?: string;
    linkedin?: string;
    twitter?: string;
    profilePicture?: File;
    isPublic?: boolean;
  }