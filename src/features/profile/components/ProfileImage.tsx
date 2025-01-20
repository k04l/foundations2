// src/features/profile/components/ProfileImage.tsx

import React from 'react';
import { User } from 'lucide-react';

interface ProfileImageProps {
  profileData: {
    profilePicture?: {
      url: string;
      name: string;
    };
    firstName?: string;
    lastName?: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ profileData, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
    // Helper function to construct the proper image URL
  const getImageUrl = (url: string) => {
    // Check if the path is already absolute
    if (!url) return '';
    // Check if URL is absolute or needs to be prefixed with API base
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
  };

//     if (url.startsWith('http')) {
//       return url;
//     }
//     // Handle relative paths by prepending the API base URL
//     return `http://localhost:3000${url}`;
//   };

  if (!profileData?.profilePicture?.url) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center`}>
        <User className="w-1/2 h-1/2 text-blue-400" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
      <img
        src={getImageUrl(profileData.profilePicture.url)}
        alt={`${profileData.firstName} ${profileData.lastName}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'/%3E%3Ccircle cx=\'12\' cy=\'7\' r=\'4\'/%3E%3C/svg%3E';
        //   console.error('Failed to load profile image:', profileData.profilePicture?.url);
        }}
      />
    </div>
  );
};

export default ProfileImage;