// src/features/profile/hooks/useProfile.js

import { useState, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

/**
 * Custom hook for managing profile operations
 * Provides functionality for fetching and updating user profiles
 */
export const useProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// Helper function to get auth headers
const getHeaders = useCallback(() => {
  const token = localStorage.getItem('token');
  return {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }, []);

  /**
   * Updates the user's profile
   * @param {Object} profileData - The profile data to update
   * @returns {Promise<Object>} Result object with success status and data/error
   */
  // const updateProfile = useCallback(async (profileData) => {
  //   setLoading(true);
  //   setError(null);

  //   // Debug log to see if we have user data
  //   console.log('Current user data:', user);
  //   console.log('Update profile request starting with data:', profileData);

  //   try {
  //     const formData = new FormData();

  //     // Add user ID explicitly
  //     if (!user?.id) {  
  //       formData.append('userId', user.id);
  //     }
      
  //     // Handle form data construction
  //     Object.entries(profileData).forEach(([key, value]) => {
  //       if (!value) {
  //         console.log(`Skipping empty value for ${key}`);
  //         return; 
  //       }

  //       if (key === 'profilePicture' && value instanceof File) {
  //         console.log(`Adding profile picture to form data: ${value.name}`);
  //         formData.append(key, value);
  //       } else if (Array.isArray(value)) {
  //         // Handle arrays (like specializations)
  //         console.log(`Adding array for ${key}:`, value);
  //         formData.append(key, JSON.stringify(value));        
  //       } else if (typeof value === 'object' && value !== null) {
  //         // Handle nested objects (like certifications)
  //         console.log(`Adding object for ${key}:`, value);
  //         formData.append(key, JSON.stringify(value));
  //       } else {
  //         console.log(`Adding value for ${key}:`, value);
  //         formData.append(key, value.toString());
  //       }
  //     });

  //     // Log the complete request URL
  //     const requestUrl = '/api/v1/profiles';
  //     console.log('Making request to:', requestUrl);
  //     console.log('With headers:', getHeaders());

  //     // // Add user ID if available
  //     // if (user?.id) {
  //     //   formData.append('user', user.id);
  //     // }

  //     // // Log the FormData contents for debugging
  //     // for (let pair of formData.entries()) {
  //     //   console.log(pair[0] + ', ' + pair[1]);
  //     // }

  //     const response = await fetch(requestUrl, {
  //       method: 'PUT',
  //       body: formData,
  //       // Don't set Content-Type header for FormData
  //       credentials: 'include', // Include cookies
  //       headers: getHeaders()
  //     });

  //     // Log the response details
  //     console.log('Response status:', response.status);
  //     const responseData = await response.json();
  //     console.log('Response data:', responseData);

  //     if (!response.ok) {
  //       // const errorData = await response.json();
  //       throw new Error(responseData.message || 'Failed to update profile');
  //     }

  //     setLoading(false);
  //     return { success: true, data: responseData };
  //   } catch (err) {
  //     console.error('Profile update error details:', {
  //       message: err.message,
  //       stack: err.stack,
  //       user: user?.id
  //     });
  //     setError(err.message || 'Failed to update profile');
  //     setLoading(false);
  //     return { success: false, error: err.message };
  //   }
  // }, [user, getHeaders]);

  // Helper function to process form data
  const createFormData = (profileData) => {
    const formData = new FormData();

    console.log('Creating FormData with:', profileData);

    // Process each field
    Object.entries(profileData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // Handle file uploads (profile picture)
      if (key === 'profilePicture' && value instanceof File) {
        formData.append(key, value);
      } else if (key === 'specializations') {
        // Handle arrays (like specializations)
        const specs = Array.isArray(value)
          ? value
          : typeof value === 'string'
            ? value.split(',').map((s) => s.trim())
            : [];
        formData.append('specializations', JSON.stringify(specs));
      } else if (key === 'certifications') {
            // Handle certifications object
      const certs = {
        name: Array.isArray(value?.name) 
          ? value.name 
          : typeof value === 'string'
            ? [value]
            : []
      };
      formData.append('certifications', JSON.stringify(certs));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};


  /**
   * Fetches a user's profile
   * @param {string} [userId] - Optional user ID. If not provided, uses current user's ID
   * @returns {Promise<Object>} Result object with success status and data/error
   */
  const fetchProfile = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    console.log('Fetching profile for user:', userId || user?.id);

    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) {
        throw new Error('No user ID available for profile fetch');
      }

      const response = await fetch(`/api/v1/profiles/${targetUserId}`, {
        headers: getHeaders(),
        credentials: 'include' // Include cookies
      });

      const data = await response.json();
      console.log('Profile fetch response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // If no profile exists, return a default structure
      if (!data.data) {
        return {
          success: true,
          data: {
              user, targetUserId,
              professionalTitle: '',
              company: '',
              yearsOfExperience: 0,
              specializations: [],
              certifications: { name: [] },
              bio: '',
              completionStatus: 0,
              profilePicture: null,
              isNew: true
          }
        };
      }

      setLoading(false);
      return { success: true, data: data.data };
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Failed to fetch profile');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [user, getHeaders]);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure we have a user ID
      if (!user?.id) {
        throw new Error('No user ID available for profile update');
      }

      // Add user ID to profile data
      const dataWithUser = {
        ...profileData,
        user: user.id
      };

      // Create form data object
      const formData = createFormData(dataWithUser);

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0] + ', ' + pair[1]);
      }

      // Add form data construction logic...

      const response = await fetch('/api/v1/profiles', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
        headers: getHeaders()        
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const responseData = await response.json();
      setLoading(false);
      return { success: true, data: responseData.data };
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [user, getHeaders]);

  return {
    updateProfile,
    fetchProfile,
    loading,
    error
  };
};

// Also export as default for maximum compatibility
export default useProfile;