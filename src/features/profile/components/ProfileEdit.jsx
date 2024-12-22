// src/features/profile/components/ProfileEdit.jsx

import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AlertCircle, Save, Upload, X, Crop, Move } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';

const ProfileEdit = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  // Form state management
  const [formData, setFormData] = useState({
    professionalTitle: '',
    company: '',
    yearsOfExperience: '',
    specializations: '',
    certifications: '',
    bio: '',
    linkedin: '',
    twitter: '',
    contactEmail: '',
    phoneNumber: ''
  });

  // UI state management
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [saveProgress, setSaveProgress] = useState(0);

  // Image handling state
  const [imageFile, setImageFile] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Event Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // Handle image drop
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        // Compress image before preview
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        });
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setIsCropping(true);
        };
        reader.readAsDataURL(compressedFile);
        setImageFile(compressedFile);
      } catch (err) {
        setError('Error processing image: ' + err.message);
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
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create final cropped image
  const createFinalImage = async () => {
    try {
      const canvas = document.createElement('canvas');
      const image = new Image();
      image.src = imagePreview;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      // Set canvas dimensions to cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext('2d');
      
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
      const croppedImage = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });

      return croppedImage;
    } catch (err) {
      throw new Error('Error creating final image: ' + err.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setSaveProgress(0);
    
    try {
      // Create FormData for submission
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Process image if exists
      if (imageFile && croppedAreaPixels) {
        const finalImage = await createFinalImage();
        submitData.append('profilePicture', finalImage, 'profile.jpg');
      }

      // TODO: Replace with actual API call
      const mockApiCall = async () => {
        await new Promise(resolve => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setSaveProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 200);
        });
      };

      await mockApiCall();
      setStatus('success');
      // After successful save, redirect to profile view
      navigate(`/profile/${user.id}`);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gray-800 border border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-100">Edit Your Profile</CardTitle>
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
                    className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-blue-100 rounded-lg
                             hover:bg-blue-500 transition-colors"
                  >
                    <Crop className="w-4 h-4 mr-2 inline-block" />
                    Confirm Crop
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                            transition-colors ${
                              isDragActive
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-blue-500/20 hover:border-blue-500/50'
                            }`}
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
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white
                                   hover:bg-red-600 transition-colors"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior MEP Engineer"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={formData.specializations}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                           text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="e.g., HVAC Design, Energy Modeling, Sustainable Design"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  Professional Certifications
                </label>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                           text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
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
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                           text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>
            </div>

             {/* Submit Button with Progress */}
             <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="relative flex items-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg
                         hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
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