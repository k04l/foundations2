// src/features/profile/components/ProfileImage.tsx

import React, { useEffect, useState } from 'react';
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
//   setImageFile: (file: File | null) => void;
//   setImagePreview: (preview: string | null) => void;
//   setCroppedPreview: (preview: string | null) => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ profileData, size = 'md' }) => {
    
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>('');
    
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
      };

    // Combined URL handling into a single, more robust function
    const getImageUrl = (url: string | undefined): string => {
        if (!url) {
            console.log('No URL provided to getImageUrl');
            return '';
        }
        
        // Handle data URLs and blobs
        if (url.startsWith('data:') || url.startsWith('blob:')) {
            console.log('Using direct URL:', url.substring(0,50) + '...');
            return url;
        }
        
        // Handle relative URLs by prepending the API base URL
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        // Ensure url has leading slash and combine with base URL
        const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
        const fullUrl = `${baseUrl}${normalizedUrl}`;
        console.log('Constructed URL:', fullUrl);
        return fullUrl;
    };

    

    // Add error boundaries and retry logic for image loading
    const ImageWithFallback: React.FC<{src: string; alt: string}> = ({ src, alt }) => {
        const [error, setError] = useState(false);
        const [retries, setRetries] = useState(0);
        const maxRetries = 3;
      
        const handleError = () => {
          if (retries < maxRetries) {
            setRetries(prev => prev + 1);
            // Add exponential backoff
            setTimeout(() => {
              setError(false);
            }, Math.pow(2, retries) * 1000);
          } else {
            setError(true);
          }
        };
      
        if (error) {
          return <div className="fallback-image"><User className="w-full h-full" /></div>;
        }
      
        return (
          <img
            src={src}
            alt={alt}
            onError={handleError}
            className="w-full h-full object-cover"
          />
        );
    };
      
    // Effect to handle URL updates
    useEffect(() => {
        if (profileData?.profilePicture?.url) {
            try {
                const url = getImageUrl(profileData.profilePicture.url);
                setImageSrc(url);
                setImageError(false);
            } catch (err) {
                console.error('Error setting image URL:', err);
                setImageError(true);
            }
        }
    }, [profileData?.profilePicture?.url]);
    
    // Debug logging for image source changes
    useEffect(() => {
        if (imageSrc) {
            console.log('Image source:', imageSrc);
        }
    }, [imageSrc]);
        
    return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
        {(!imageSrc || imageError) ? (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <User className="w-1/2 h-1/2 text-blue-400" />
            </div>
        ) : (
            <img
                src={imageSrc}
                alt={`${profileData.firstName} ${profileData.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                    console.error('Failed to load image:', imageSrc);
                    setImageError(true);
                }}
            />
        )}
    </div>
    );
}

export default ProfileImage;