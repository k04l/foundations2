// src/features/profile/components/ProfileEdit.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AlertCircle, Save, Upload, X, Crop } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { useProfile } from '../hooks/useProfile';
import { ProfileFormData } from '../types/profile.types';

// Define interfaces for state
interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ProfilePictureData {
    url?: string;
    name?: string;
}

const ProfileEdit: React.FC = () => {
    const { user } = useAuth();
    const { navigate } = useNavigation();
    const { updateProfile, fetchProfile } = useProfile();

    // Form state management
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        professionalTitle: '',
        company: '',
        yearsOfExperience: 0,
        specializations: [],
        certifications: { name: [] },
        bio: '',
        contactEmail: '',
        phoneNumber: '',
        linkedin: '',
        twitter: ''
    });

    // UI state management
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string>('');
    const [saveProgress, setSaveProgress] = useState<number>(0);

    // Image handling state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    // Fetch existing profile data
    useEffect(() => {
        const loadProfile = async () => {
            if (user?.id) {
                try {
                    const result = await fetchProfile(user.id);
                    if (result.success && result.data) {
                        // Update form data
                        setFormData(prevData => ({
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
                            setImagePreview(imageUrl);
                        }
                    }
                } catch (err) {
                    console.error('Error loading profile:', err);
                    setError('Failed to load profile data');
                }
            }
        };
        
        loadProfile();
    }, [user, fetchProfile]);

    // Handle image drop
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
                setError(`Error processing image: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    }, []);

    // Configure dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxSize: 10485760, // 10MB
        multiple: false
    });

    // Handle crop complete
    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Create a function to process the cropped image
    const processCroppedImage = async (): Promise<File | null> => {
        if (!imagePreview || !croppedAreaPixels) return null;

        try {
            const canvas = document.createElement('canvas');
            const image = new Image();
            image.src = imagePreview;

            await new Promise((resolve) => {
                image.onload = resolve;
            });

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

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

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to create blob'));
                }, 'image/jpeg', 0.95);
            });

            return new File([blob], 'profile-image.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now(),
            });
        } catch (error) {
            console.error('Error processing image:', error);
            return null;
        }
    };

    // Enhanced form submission with proper error handling
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault
        setStatus('submitting');
        setError('');

        try {
            // First process the form data into the correct format
            const processedData = {
                ...formData,
                specializations: typeof formData.specializations === 'string'
                    ? formData.specializations.split(',').map(s => s.trim()).filter(Boolean)
                    : formData.specializations,
                certifications: {
                    name: typeof formData.certifications === 'string' 
                        ? formData.certifications.split(',').map(s => s.trim()).filter(Boolean)
                        : formData.certifications.name 
                }
            };

            // Now create the FormData object with our processed data
            const formDataToSubmit = new FormData();

            // Add processsed fields to FormData
            Object.entries(processedData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (key === 'specializations' || key === 'certifications') {
                        // Convert arrays and objects to JSON strings
                        formDataToSubmit.append(key, JSON.stringify(value));
                    } else {
                        formDataToSubmit.append(key, String(value));
                    }
                }
            });

            // Handle image upload
            if (imageFile && croppedAreaPixels) {
                const processedImage = await processCroppedImage();
                if (processedImage) {
                    formDataToSubmit.append('profilePicture', processedImage);
                }
            }

            // Add user ID explicitly
            if (user?.id) {
                formDataToSubmit.append('user', user.id);
            }

            // Log the data being sent for debugging
            console.log('Submitting profile update with data:', {
                processedData,
                formDataEntries: Array.from(formDataToSubmit.entries())
            })

            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch('/api/v1/profiles', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSubmit
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                // Add a smsall delay before navigation
                setTimeout(() => {
                    if (user?.id) {
                        navigate(`/profile/${user.id}`);
                    }
                }, 500);
            } else {
                throw new Error(result.error || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => {
            // Handle number fields properly
            if (name === 'yearsOfExperience') {
                return { ...prev, [name]: value ==='' ? 0 : parseInt(value, 10) };
            }

            // Special handling for array fields
            if (name === 'specializations') {                
                return { ...prev, [name]: value.split(',').map(s => s.trim()) };
            }

            if (name === 'certifications') {
                return { 
                    ...prev, 
                    certifications: {
                        name: value.split(',').map(s => s.trim())
                    } 
                };
            }
        
            // Default handling for other fields
            return { ...prev, [name]: value };
        });

        if (error) setError('');
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
                                    <button
                                        type="button"
                                        onClick={() => setIsCropping(false)}
                                        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
                                    >
                                        <Crop className="w-4 h-4 mr-2 inline-block" />
                                        Confirm Crop
                                    </button>
                                </div>
                            ) : (
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors 
                                    ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500/20 hover:border-blue-500/50'}`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center">
                                        {imagePreview ? (
                                            <div className="relative w-32 h-32 mb-4">
                                                <img
                                                    src={imagePreview}
                                                    alt="Profile preview"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImagePreview(null);
                                                        setImageFile(null);
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

                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your first name"
                                        required
                                    />
                                </div>                     
                        
                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your last name"
                                        required
                                    />
                                </div>
                            
                            </div>
                        </div>

                        {/* Professional Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
                                Professional Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        Professional Title
                                    </label>
                                    <input
                                        type="text"
                                        name="professionalTitle"
                                        value={formData.professionalTitle}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Senior MEP Engineer"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        Company/Organization
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Engineering Solutions Inc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        Years of Experience
                                    </label>
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                        max="50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">
                                    Specializations/Areas of Expertise
                                </label>
                                <textarea
                                    name="specializations"
                                    value={typeof formData.specializations === 'string' 
                                        ? formData.specializations 
                                        : Array.isArray(formData.specializations)
                                            ? formData.specializations.join(', ')
                                            : ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="e.g., HVAC Design, Energy Modeling, Sustainable Design"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">
                                    Professional Certifications
                                </label>
                                <textarea
                                    name="certifications"
                                    value={typeof formData.certifications.name === 'string'
                                        ? formData.certifications.name
                                        : Array.isArray(formData.certifications.name)
                                            ? formData.certifications.name.join(', ')
                                            : ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="e.g., PE, LEED AP, CEM"
                                />
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
                                About
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">
                                    Professional Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Tell us about your professional journey and expertise..."
                                />
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        Twitter/X Profile
                                    </label>
                                    <input
                                        type="url"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="professional@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+1 (123) 456-7890"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="relative flex items-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {status === 'submitting' && (
                                    <div
                                        className="absolute inset-0 bg-blue-500 rounded-lg transition-all duration-300"
                                        style={{ width: `${saveProgress}%` }}
                                    />
                                )}
                                <span className="relative flex items-center">
                                    <Save className="w-4 h-4 mr-2" />
                                    {status === 'submitting' ? 'Saving...' : 'Save Profile'}
                                </span>
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileEdit;