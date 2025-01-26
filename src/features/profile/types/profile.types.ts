// src/features/profile/types/profile.types.ts

export interface Profile {
  _id?: string;
  user: string;
  firstName: string;
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

export interface ProfileInputState {
  specializationsInput: string;
  certificationsInput: string;
}

export interface Certification {
name: string[];
}

export interface ProfilePictureData {
url?: string;
name?: string;
}

// Highlight: Separated base profile data from form-specific data
export interface ProfileBase {
_id?: string;
user: string;
firstName: string;  
lastName: string;
professionalTitle: string;
company: string;
yearsOfExperience: number | null;
specializations: string[];
certifications: Certification;
bio: string;
contactEmail?: string;
phoneNumber?: string;
linkedin?: string;
twitter?: string;
profilePicture?: ProfilePictureData;
}

export interface ProcessedProfileData extends Omit<ProfileFormData, 'specializationsInput' | 'certificationsInput'> {
specializations: string[];
certifications: {
  name: string[];
};
}

// Highlight: Profile extends base with metadata
export interface Profile extends ProfileBase {
completionStatus: number;
isPublic: boolean;
viewCount: number;
projectCount: number;
connectionsCount: number;
lastUpdated: Date;
createdAt: Date;
updatedAt: Date;
}

// Form data interface base profile and input state
export interface ProfileFormData extends ProfileBase, ProfileInputState {
  isNew?: boolean;
}

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SectionProps {
  formData: ProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDelete?: {
    handleDeleteSpecialization: (spec: string) => void;
    handleDeleteCertification: (cert: string) => void;
  };
}
