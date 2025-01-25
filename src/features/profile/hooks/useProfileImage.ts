// src/features/profile/hooks/useProfileImage.ts
import { useState, useCallback, useEffect } from 'react';
import { Area } from '../types/profile.types';  

interface UseProfileImageReturn {
    imageFile: File | null;
    imagePreview: string | null;
    isCropping: boolean;
    crop: { x: number; y: number };
    zoom: number;
    croppedPreview: string | null;
    error: string | null;
    setImageFile: (file: File | null) => void;
    setImagePreview: (preview: string | null) => void;
    setCroppedPreview: (preview: string | null) => void;
    setIsCropping: (cropping: boolean) => void;
    setCrop: (crop: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
    onDrop: (acceptedFiles: File[]) => Promise<void>;
    processCroppedImage: () => Promise<File | null>;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    resetImage: () => void;
}

export const useProfileImage = (): UseProfileImageReturn => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Clean up URLs when component unmounts or when new images are loaded
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            if (croppedPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(croppedPreview);
            }
        };
    }, [imagePreview, croppedPreview]);

    // Reset all state
    const resetImage = useCallback(() => {
        setImageFile(null);
        if (imagePreview?.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        if (croppedPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(croppedPreview);
        }
        setCroppedPreview(null);
        setIsCropping(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setError(null);
    }, [imagePreview, croppedPreview]);

    // Handle file drop
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        try {
            const file = acceptedFiles[0];
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }

            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File size must be less than 10MB');
            }

            // Clean up old URLs
            resetImage();

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setIsCropping(true);
            };
            reader.onerror = () => {
                throw new Error('Error reading file');
            };
            reader.readAsDataURL(file);
            
            setImageFile(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error processing image');
            resetImage();
        }
    }, [resetImage]);

    // Process cropped image
    const processCroppedImage = useCallback(async (): Promise<File | null> => {
        if (!imagePreview || !croppedAreaPixels) {
            setError('No image to process');
            return null;
        }

        try {
            // Create canvas and load image
            const canvas = document.createElement('canvas');
            const image = new Image();
            
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
                image.src = imagePreview;
                if (imagePreview.startsWith('http')) {
                    image.crossOrigin = 'anonymous';
                }
            });

            // Set canvas dimensions
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // Draw cropped image
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

            // Convert to blob
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

            return new File(
                [blob],
                'profile-image.jpg',
                { type: 'image/jpeg', lastModified: Date.now() }
            );
        } catch (error) {
            setError('Error processing image. Please try again.');
            console.error('Error processing image:', error);
            return null;
        }
    }, [imagePreview, croppedAreaPixels]);

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
        error,
        setImageFile,
        setImagePreview,
        setCroppedPreview,
        setIsCropping,
        setCrop,
        setZoom,
        onDrop,
        processCroppedImage,
        onCropComplete,
        resetImage
    };
};