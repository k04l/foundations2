// src/features/profile/components/ImageUploadSection.tsx
import React from 'react';
import { Upload, X, Crop, Camera } from 'lucide-react';
import Cropper from 'react-easy-crop';
// import { Area } from 'react-easy-crop/types';
import { ProfileImage } from '../ProfileImage';
// import { SectionProps } from '../../types/profile.types';
// import { FC } from 'react';

// Define more specific types for the crop area
interface CropArea {
    x: number;
    y: number;
}

// Define the profile picture type
interface ProfilePicture {
    url: string;
    name: string;
}

// Define form data type
interface FormData {
    firstName: string;
    lastName: string;
    profilePicture?: ProfilePicture;
}

// Props for root and input from react-dropzone
interface DropzoneProps {
    getRootProps: () => any;
    getInputProps: () => any;
    isDragActive: boolean;
}

interface ImageUploadSectionProps extends DropzoneProps {
    imagePreview: string | null;
    isCropping: boolean;
    crop: { x: number; y: number };
    zoom: number;
    onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
    setCrop: (crop: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
    setIsCropping: (isCropping: boolean) => void;
    handleCropComplete: () => void;
    croppedPreview: string | null;
    formData: {
        firstName: string;
        lastName: string;
        profilePicture?: {
            url: string;
            name: string;
        };
    };
    getRootProps: any;
    getInputProps: any;
    isDragActive: boolean;
    setImageFile: (file: File | null) => void;
    setImagePreview: (preview: string | null) => void;
    setCroppedPreview: (preview: string | null) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    imagePreview,
    isCropping,
    crop,
    zoom,
    onCropComplete,
    setCrop,
    setZoom,
    setIsCropping,
    handleCropComplete,
    croppedPreview,
    formData,
    getRootProps,
    getInputProps,
    isDragActive,
    setImageFile,
    setImagePreview,
    setCroppedPreview
}) => {
    // Get the current image URL, with proper type handling
    const currentImageUrl = React.useMemo(() => 
        croppedPreview || imagePreview || formData?.profilePicture?.url || '', 
        [croppedPreview, imagePreview, formData?.profilePicture?.url]
    );

    // Handle image removal with cleanup
    const handleImageRemoval =  React.useCallback(async (e: React.MouseEvent) => {
            // Ensure all event propagation is stopped
            e.preventDefault();
            e.stopPropagation();

        try {
            // First, store all the URLs we need to revoke
            const urlsToRevoke = [
                croppedPreview,
                imagePreview?.startsWith('blob:') ? imagePreview : null
            ].filter((url): url is string => Boolean(url));

            // Then reset all state
            setImageFile(null);
            setCroppedPreview(null);
            setImagePreview(null);

            // Clean up URLs
            urlsToRevoke.forEach(url => {
                try {
                    URL.revokeObjectURL(url);
                } catch (err) {
                    console.error('Error revoking URL:', err);
                }
            });
        } catch (err) {
            console.error('Error removing image:', err);
        }
    }, [croppedPreview, imagePreview, setImageFile, setCroppedPreview, setImagePreview]);

    // // Get the current image URL, with proper type handling
    // const currentImageUrl = croppedPreview || imagePreview || formData?.profilePicture?.url || '';

    return (

    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
            Profile Picture
        </h3>

        {isCropping && imagePreview ? (
            <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
                <Cropper
                    image={imagePreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setIsCropping(false)}
                        className="px-4 py-2 bg-red-600 text-red-100 rounded-lg hover:bg-red-500 transition-colors"
                    >
                        <X className="w-4 h-4 mr-2 inline-block" />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCropComplete}
                        className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        <Crop className="w-4 h-4 mr-2 inline-block" />
                        Confirm Crop
                    </button>
                </div>
            </div>
        ) : (
            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
                    ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500/20 hover:border-blue-500/50'} 
                    transition-colors`}
            >
                <input {...getInputProps()} />

                {currentImageUrl ? (
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <ProfileImage 
                                    profileData={{
                                        profilePicture: {
                                            url: currentImageUrl,
                                            name: 'preview'
                                        },
                                        firstName: formData.firstName,
                                        lastName: formData.lastName
                                    }}
                                    size="lg"
                                />
                                
                                <button
                                    type="button"
                                    onClick={handleImageRemoval}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white 
                                             hover:bg-red-600 transition-colors z-10"
                                    aria-label="Remove profile picture"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full 
                                              opacity-0 group-hover:opacity-100 transition-opacity
                                              flex flex-col items-center justify-center">
                                    <Camera className="w-8 h-8 text-white mb-2" />
                                    <span className="text-white text-sm">Click to change</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-blue-500 mb-4" />
                    <p className="text-blue-300 mb-2">
                        {isDragActive 
                            ? 'Drop your image here...' 
                            : 'Drag and drop your profile picture here, or click to select'}
                    </p>
                    <p className="text-sm text-blue-400">
                        Supports JPG, PNG and GIF up to 10MB
                    </p>
                </div>
            )}
        </div>
    )}
    
    {/* Error message display for image loading/processing errors
    <div role="alert" aria-live="polite" className="min-h-[1.5rem]">
        {error && (
            <p className="text-red-400 text-sm mt-2">
                {error}
            </p>
        )}
    </div>
</div> */}

</div>
);
}

export default ImageUploadSection;