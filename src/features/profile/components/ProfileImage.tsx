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
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ profileData }) => {
  // Construct the full URL for the profile picture
  const getImageUrl = (relativePath: string) => {
    // Check if the path is already absolute
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    // Handle relative paths by prepending the API base URL
    return `http://localhost:3000${relativePath}`;
  };

  if (!profileData?.profilePicture?.url) {
    return (
      <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
        <User className="w-12 h-12 text-blue-400" />
      </div>
    );
  }

  return (
    <div className="w-24 h-24 rounded-full overflow-hidden">
      <img
        src={getImageUrl(profileData.profilePicture.url)}
        alt={`${profileData.firstName} ${profileData.lastName}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'/%3E%3Ccircle cx=\'12\' cy=\'7\' r=\'4\'/%3E%3C/svg%3E';
          console.error('Failed to load profile image:', profileData.profilePicture?.url);
        }}
      />
    </div>
  );
};

export default ProfileImage;