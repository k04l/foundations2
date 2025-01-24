// src/features/profile/components/ImageUploadSection.tsx
import React from 'react';
import { Upload, X, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { ProfileImage } from '../ProfileImage';
// import { SectionProps } from '../../types/profile.types';
import { FC } from 'react';

interface ImageUploadSectionProps {
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
    formData: any;
    getRootProps: any;
    getInputProps: any;
    isDragActive: boolean;
    setImageFile: (file: File | null) => void;
    setImagePreview: (preview: string | null) => void;
    setCroppedPreview: (preview: string | null) => void;
}

export const ImageUploadSection: FC<ImageUploadSectionProps> = ({
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
    // Function to handle image removal
    const handleImageRemoval = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setImageFile(null);
        setCroppedPreview(null);
        if (croppedPreview) {
            URL.revokeObjectURL(croppedPreview);
        }
    };

    // Determine which image to display
    const displayImage = croppedPreview || imagePreview || formData?.profilePicture?.url;

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
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors 
                ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500/20 hover:border-blue-500/50'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                    {(croppedPreview || imagePreview) ? (
                        <div className="relative w-32 h-32 mb-4">
                            <ProfileImage 
                                profileData={{
                                    profilePicture: {
                                        url: croppedPreview || imagePreview,
                                        name: 'preview'
                                    },
                                    firstName: formData.firstName,
                                    lastName: formData.lastName
                                }}
                                size="lg"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImagePreview(null);
                                    setImageFile(null);
                                    setCroppedPreview(null);
                                    if (croppedPreview) {
                                        URL.revokeObjectURL(croppedPreview);
                                    }
                                }}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Upload className="w-12 h-12 text-blue-500 mb-4" />
                    )}
                    <p className="text-blue-300 mb-2">
                        {isDragActive
                            ? 'Drop your image here...'
                            : 'Drag and drop your profile picture here, or click to select'}
                    </p>
                    <p className="text-sm text-blue-400">
                        Supports JPG, PNG and GIF up to 10MB
                    </p>
                </div>
            </div>
        )}
    </div>
);
};
