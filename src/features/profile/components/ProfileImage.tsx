// src/features/profile/components/ProfileImage.tsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { User } from 'lucide-react';   
// import { Camera } from 'lucide-react';


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
  onError?: (error: any) => void;
//   setImageFile: (file: File | null) => void;
//   setImagePreview: (preview: string | null) => void;
//   setCroppedPreview: (preview: string | null) => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = React.memo(({ 
    profileData, 
    size = 'md'
}) => {
    // // Add state to track whether we're in upload mode or display mode
    // const [isUploadMode, setIsUploadMode] = useState(!profileData?.profilePicture?.url);
    
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>('');
    
    // Memoize size classes to prevent recalculation    
    const sizeClasses = useMemo(() => ({
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    }), []);

    // Combined URL handling into a single, more robust function
    const getImageUrl = useCallback((url: string | undefined): string => {
        if (!url) return '';

        if (url.startsWith('data:') || url.startsWith('blob:')) {
            return url;
        }

        const baseUrl = 'http://localhost:3000';
        const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${normalizedUrl}`;
    }, []);

    // Use effect with proper dependency tracking
    useEffect(() => {
        if (!profileData?.profilePicture?.url) {
            setImageSrc('');
            return;
        }

        try {
            const url = getImageUrl(profileData.profilePicture.url);
            setImageSrc(url);
            setImageError(false);
        } catch (err) {
            console.error('Error setting image URL:', err);
            setImageError(true);
        }
    }, [profileData?.profilePicture?.url, getImageUrl]);
    
    // Memoize error handler
    const handleImageError = useCallback(() => {
        console.error('Failed to load image:', imageSrc);
        setImageError(true);
    }, [imageSrc]);


    // // Add error boundaries and retry logic for image loading
    // const ImageWithFallback: React.FC<{src: string; alt: string}> = ({ src, alt }) => {
    //     const [error, setError] = useState(false);
    //     const [retries, setRetries] = useState(0);
    //     const maxRetries = 3;
      
    //     const handleError = () => {
    //       if (retries < maxRetries) {
    //         setRetries(prev => prev + 1);
    //         // Add exponential backoff
    //         setTimeout(() => {
    //           setError(false);
    //         }, Math.pow(2, retries) * 1000);
    //       } else {
    //         setError(true);
    //       }
    //     };
      
    //     if (error) {
    //       return <div className="fallback-image"><User className="w-full h-full" /></div>;
    //     }
      
    //     return (
    //       <img
    //         src={src}
    //         alt={alt}
    //         onError={handleError}
    //         className="w-full h-full object-cover"
    //       />
    //     );
    // };
      
    // // Effect to handle URL updates
    // useEffect(() => {
    //     if (profileData?.profilePicture?.url) {
    //         try {
    //             const url = getImageUrl(profileData.profilePicture.url);
    //             setImageSrc(url);
    //             setImageError(false);
    //         } catch (err) {
    //             console.error('Error setting image URL:', err);
    //             setImageError(true);
    //         }
    //     }
    // }, [profileData?.profilePicture?.url]);
    
    // // Debug logging for image source changes
    // useEffect(() => {
    //     if (imageSrc) {
    //         console.log('Image source:', imageSrc);
    //     }
    // }, [imageSrc]);
        
    // // Loading state
    // if (isLoading) {
    //     return (
    //         <div className="flex items-center justify-center">
    //             <div className={`${sizeClasses[size]} rounded-full bg-gray-700 animate-pulse`} />
    //         </div>
    //     );
    // }

    // // Error or no image state
    // if (imageError || !imageSrc) {
    //     return (
    //         <div className="flex items-center justify-center">
    //             <div className={`${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center`}>
    //                 <User className="w-1/2 h-1/2 text-blue-400" />
    //             </div>
    //         </div>
    //     );
    // }

    // Success state
    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-700`}>
                {(!imageSrc || imageError) ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <User className="w-1/2 h-1/2 text-blue-400" />
                    </div>
                ) : (
                    <img
                        src={imageSrc}
                        alt={`${profileData.firstName} ${profileData.lastName}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                )}
            </div>
        </div>
    );
});

ProfileImage.displayName = 'ProfileImage';

export default ProfileImage;