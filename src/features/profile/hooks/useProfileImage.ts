// src/features/profile/hooks/useProfileImage.ts
import { useState, useCallback } from 'react';
import { Area } from '../types/profile.types';   

export const useProfileImage = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

    // Handle file drop
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                    setIsCropping(true);
                };
                reader.readAsDataURL(file);
                setImageFile(file);
            } catch (err) {
                throw new Error(`Error processing image: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    }, []);

    // Process cropped image
    const processCroppedImage = async (): Promise<File | null> => {
        if (!imagePreview || !croppedAreaPixels) return null;

        try {
          // Create a canvas to draw the cropped image
          const canvas = document.createElement('canvas');
          const image = new Image();
          
          // Handle both data URLs and regular URLs
          if (imagePreview.startsWith('data:')) {
            image.src = imagePreview;
          } else {
            // For regular URLs, we might need to handle CORS
            image.crossOrigin = 'anonymous';
            image.src = imagePreview;
          }
      
          // Wait for image to load
          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
          });
      
          // Set canvas dimensions to the cropped size
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;
      
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');
      
          // Draw the cropped portion
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );
      
          // Convert to blob with JPEG format and good quality
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
              },
              'image/jpeg',
              0.95
            );
          });
      
          // Create a File object
          return new File(
            [blob], 
            'profile-image.jpg',
            { 
              type: 'image/jpeg',
              lastModified: Date.now()
            }
          );
        } catch (error) {
          console.error('Error processing image:', error);
          return null;
        }
    };

    // Handle crop completion
    const onCropComplete = useCallback((croppedArea: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    return {
        imageFile,
        imagePreview,
        isCropping,
        crop,
        zoom,
        croppedPreview,
        croppedAreaPixels,
        setImageFile,
        setImagePreview,
        setCroppedPreview,
        setIsCropping,
        setCrop,
        setZoom,
        onDrop,
        onCropComplete,
        processCroppedImage
    };
};