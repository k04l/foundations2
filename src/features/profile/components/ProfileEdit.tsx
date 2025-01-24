// src/features/profile/components/ProfileEdit.tsx
import React, { useState, useCallback, useEffect } from 'react';
// UI Components
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AlertCircle, Save, Upload, X, Crop, Award } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';

// Custom Components
import { ProfileImage } from './ProfileImage';
import { PersonalInfo } from './ProfileSections/PersonalInfo';
import { ProfessionalInfo } from './ProfileSections/ProfessionalInfo';
import { AboutSection } from './ProfileSections/AboutSection';
import { ContactInfo } from './ProfileSections/ContactInfo';
import { ImageUploadSection } from './ProfileSections/ImageUploadSection';
import { SubmitButton } from './ProfileSections';

// Hooks
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { useProfile } from '../hooks/useProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import { useProfileImage } from '../hooks/useProfileImage';

// Types
import { ProfileFormData, Area, ProfilePictureData } from '../types/profile.types';


// const processSpecializations = (specializations: any): string[] => {
//     if (!specializations) return [];

//     // If it's already an array, return it as is
//     if (Array.isArray(specializations) && specializations.every(item => typeof item === 'string')) {
//         return specializations;
//     }

//     // If it's an array of JSON strings, parse them
//     if (Array.isArray(specializations)) {
//         try {
//             //Flatten nested arrays and filter out empty values
//             return specializations
//             .map(item => {
//                 try {
//                     const parsed = JSON.parse(item);
//                     return Array.isArray(parsed) ? parsed : [item];
//                 } catch {
//                     return [item];
//                 }
//             })
//             .flat()
//             .filter(Boolean)
//             .map(item => item.trim());
//         } catch {
//             return [];
//         }
//     }

//     return [];
// };

const ProfileEdit: React.FC = () => {
    const { user } = useAuth();
    const { navigate } = useNavigation();
    const { updateProfile, fetchProfile } = useProfile();    

    // Use the image handling hook
    const imageHandling = useProfileImage();

    const initialFormData: ProfileFormData = {
        user: user?.id || '',
        firstName: '',
        lastName: '',
        professionalTitle: '',
        company: '',
        yearsOfExperience: 0,
        specializations: [],
        specializationsInput: '',
        certifications: { name: [] },
        certificationsInput: '',
        bio: '',
        contactEmail: '',
        phoneNumber: '',
        linkedin: '',
        twitter: ''
    };
    
    // Use it in your hook
    const formHandling = useProfileForm(initialFormData);

    // UI state management
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string>('');
    const [saveProgress, setSaveProgress] = useState<number>(0);

    // Image handling state
    // const [imageFile, setImageFile] = useState<File | null>(null);
    // const [imagePreview, setImagePreview] = useState<string | null>(null);
    // const [isCropping, setIsCropping] = useState(false);
    // const [crop, setCrop] = useState({ x: 0, y: 0 });
    // const [zoom, setZoom] = useState(1);
    // const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    // const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
    // const [croppedImageDisplay, setCroppedImageDisplay] = useState<string | null>(null);


    // Fetch existing profile data
    useEffect(() => {
        const loadProfile = async () => {
            if (user?.id) {
                try {
                    const result = await fetchProfile(user.id);
                    if (result.success && result.data) {
                        // Update form data
                        formHandling.setFormData(prevData => ({
                            ...prevData,
                            ...result.data,
                            specializations: Array.isArray(result.data.specializations)
                                ? result.data.specializations
                                : [],
                            certifications: {
                                name: Array.isArray(result.data.certifications?.name)
                                    ? result.data.certifications.name
                                    : []
                            }
                        }));

                        // Set profile picture preview if it exists
                        if (result.data.profilePicture?.url) {
                            // Check if the URL is valid
                            const imageUrl = result.data.profilePicture.url.startsWith('http')
                                ? result.data.profilePicture.url
                                : `${window.location.origin}${result.data.profilePicture.url}`;    
                            imageHandling.setImagePreview(imageUrl);
                        }
                    }
                } catch (err) {
                    console.error('Error loading profile:', err);
                    setError('Failed to load profile data');
                }
            }
        };
        
        loadProfile();
    }, [user, fetchProfile, formHandling.setFormData, imageHandling.setImagePreview]);

    // Add cleanup on component unmount
    useEffect(() => {
        return () => {
            if (imageHandling.croppedPreview) {
                URL.revokeObjectURL(imageHandling.croppedPreview);
            }
            if (imageHandling.imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imageHandling.imagePreview);
            }
        };
    }, [imageHandling.croppedPreview, imageHandling.imagePreview]);

    const handleCropComplete = async () => {
        try {
            if (!imageHandling.croppedAreaPixels || !imageHandling.imagePreview) {
                console.error('No crop area or image preview available');
                return;
            }
    
            // Clean up existing preview
            if (imageHandling.croppedPreview) {
                URL.revokeObjectURL(imageHandling.croppedPreview);
            }
    
            const processedImage = await imageHandling.processCroppedImage();
            if (processedImage) {
                const previewUrl = URL.createObjectURL(processedImage);
                imageHandling.setCroppedPreview(previewUrl);
                imageHandling.setImageFile(processedImage);
                imageHandling.setIsCropping(false);
            }
        } catch (error) {
            console.error('Error processing cropped image:', error);
            setError('Failed to process cropped image');
        } finally {
            imageHandling.setIsCropping(false);
        }
    };

    const processFormData = (data: ProfileFormData): ProcessedProfileData => {
        // Process specializations
        const specializations = [
            ...data.specializations,
            ...(data.specializationsInput
                .split(',')
                .map(s => s.trim())
                .filter(Boolean))
        ];
    
        // Process certifications
        const certifications = {
            name: [
                ...data.certifications.name,
                ...(data.certificationsInput
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean))
            ]
        };
    
        // Return cleaned data without the input fields
        return {
            ...data,
            specializations,
            certifications
        };        
    };

    // Configure dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: imageHandling.onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxSize: 10485760, // 10MB
        multiple: false
    });

    // // Handle crop completion
    // const processCroppedImage = async (
    //     imagePreview: string, 
    //     croppedAreaPixels: Area
    //   ): Promise<File | null> => {
    //     if (!imagePreview || !croppedAreaPixels) return null;
      
    //     try {
    //       // Create a canvas to draw the cropped image
    //       const canvas = document.createElement('canvas');
    //       const image = new Image();
          
    //       // Handle both data URLs and regular URLs
    //       if (imagePreview.startsWith('data:')) {
    //         image.src = imagePreview;
    //       } else {
    //         // For regular URLs, we might need to handle CORS
    //         image.crossOrigin = 'anonymous';
    //         image.src = imagePreview;
    //       }
      
    //       // Wait for image to load
    //       await new Promise((resolve, reject) => {
    //         image.onload = resolve;
    //         image.onerror = reject;
    //       });
      
    //       // Set canvas dimensions to the cropped size
    //       canvas.width = croppedAreaPixels.width;
    //       canvas.height = croppedAreaPixels.height;
      
    //       const ctx = canvas.getContext('2d');
    //       if (!ctx) throw new Error('Could not get canvas context');
      
    //       // Draw the cropped portion
    //       ctx.drawImage(
    //         image,
    //         croppedAreaPixels.x,
    //         croppedAreaPixels.y,
    //         croppedAreaPixels.width,
    //         croppedAreaPixels.height,
    //         0,
    //         0,
    //         croppedAreaPixels.width,
    //         croppedAreaPixels.height
    //       );
      
    //       // Convert to blob with JPEG format and good quality
    //       const blob = await new Promise<Blob>((resolve, reject) => {
    //         canvas.toBlob(
    //           (blob) => {
    //             if (blob) resolve(blob);
    //             else reject(new Error('Failed to create blob'));
    //           },
    //           'image/jpeg',
    //           0.95
    //         );
    //       });
      
    //       // Create a File object
    //       return new File(
    //         [blob], 
    //         'profile-image.jpg',
    //         { 
    //           type: 'image/jpeg',
    //           lastModified: Date.now()
    //         }
    //       );
    //     } catch (error) {
    //       console.error('Error processing image:', error);
    //       return null;
    //     }
    // };


  // Update the form submission handling
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {

        // Create FormData instance
        const formDataToSubmit = new FormData();

        // First, add all the regular form fields
        Object.entries(formHandling.formData).forEach(([key, value]) => {
            // Skip the image file as we'll handle it separately
            if (key === 'profilePicture') return;
            
            // Handle arrays and objects
            if (value !== null && value !== undefined) {
                if (Array.isArray(value) || typeof value === 'object') {
                    formDataToSubmit.append(key, JSON.stringify(value));
                } else {
                    formDataToSubmit.append(key, String(value));
                }
            }
        });

        // Handle image upload first - we keep this because it's part of the file handling
        if (imageHandling.imageFile && imageHandling.imageFile instanceof File) {
            formDataToSubmit.append('profilePicture', imageHandling.imageFile);
        }

        // Log form data for debugging
        console.log('Submitting profile update:', {
            formDataEntries: Array.from(formDataToSubmit.entries()).map(([key, value]) => {
                if (value instanceof File) {
                    return [key, `File: ${value.name} (${value.size} bytes)`];
                }
                return [key, value];
            })
        });


        // Log what we're about to send
        console.log('Making profile update request with FormData');
        const entries = Array.from(formDataToSubmit.entries());
        console.log('FormData contents:', entries);


        // // Log FormData contents for debugging  
        // for (let [key, value] of formDataToSubmit.entries()) {
        //     console.log(`FormData: ${key} =`, value);
        // }
    
        // // Process specializations
        // const currentSpecializations = processSpecializations(formData.specializations);
        // const newSpecializations = formData.specializationsInput
        //     .split(',')
        //     .map(s => s.trim())
        //     .filter(Boolean);
        
        // const allSpecializations = [...new Set([...currentSpecializations, ...newSpecializations])];
        // formDataToSubmit.append('specializations', JSON.stringify(allSpecializations));
        
        // // Process certifications
        // const currentCertifications = formData.certifications?.name || [];
        // const newCertifications = formData.certificationsInput
        //     .split(',')
        //     .map(s => s.trim())
        //     .filter(Boolean);
        
        // const allCertifications = {
        //     name: [...new Set([...currentCertifications, ...newCertifications])]
        // };
    
        // // Add processed data to FormData
        // formDataToSubmit.append('certifications', JSON.stringify(allCertifications));
    
        // // Add other fields
        // Object.entries(formData).forEach(([key, value]) => {
        //   if (!['specializationsInput', 'certificationsInput', 'specializations', 'certifications'].includes(key) &&
        //       value !== null && 
        //       value !== undefined) {
        //     formDataToSubmit.append(key, String(value));
        //   }
        // });

        // // Handle image upload
        // if (imageFile && croppedAreaPixels) {
        //     const processedImage = await processCroppedImage(imagePreview, croppedAreaPixels);
        //     if (processedImage) {
        //         formDataToSubmit.append('profilePicture', processedImage);
        //     }
        // }

        // Make API request
        const response = await fetch('/api/v1/profiles', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataToSubmit
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response:', responseText);
            throw new Error('Invalid server response');
        }

        if (!response.ok) {
            throw new Error(JSON.stringify({
                error: data.message || 'Failed to update profile',
                status: response.status,
                statusText: response.statusText
            }));
        }
        // // Add validation before submission
        // if (!processedData.firstName || !processedData.lastName) {
        //     throw new Error('Name fields are required');
        // }

        // Clone the response for reading text if needed
        // const responseClone = response.clone();

        //Success path
        setStatus('success');
        
        if (user?.id) {
            navigate(`/profile/${user.id}`);
        }
    } catch (err) {
        console.error('Profile update error:', err);
        setError(err instanceof Error ? err.message : 'Failed to update profile');
        setStatus('error');
    }
};

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800 border border-blue-500/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-100">
                        Edit Your Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Section */}
                        <ImageUploadSection 
                            {...imageHandling} 
                            getRootProps={getRootProps}
                            getInputProps={getInputProps}
                            isDragActive={isDragActive}
                            handleCropComplete={handleCropComplete}
                            formData={formHandling.formData}
                            setImageFile={imageHandling.setImageFile}
                            setImagePreview={imageHandling.setImagePreview}
                            setCroppedPreview={imageHandling.setCroppedPreview}   
                        />
                        
                        {/* Form Sections */}
                        <PersonalInfo 
                            formData={formHandling.formData} 
                            handleChange={formHandling.handleChange} 
                        />
                        <ProfessionalInfo 
                            formData={formHandling.formData}
                            handleChange={formHandling.handleChange}
                            handleDeleteSpecialization={formHandling.handleDeleteSpecialization}
                            handleDeleteCertification={formHandling.handleDeleteCertification}
                        />
                        <AboutSection 
                            formData={formHandling.formData}
                            handleChange={formHandling.handleChange}
                        />
                        <ContactInfo 
                            formData={formHandling.formData}
                            handleChange={formHandling.handleChange}
                        />

                        {/* Submit Button */}
                        <SubmitButton
                            status={status}
                            saveProgress={saveProgress}
                        />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileEdit;