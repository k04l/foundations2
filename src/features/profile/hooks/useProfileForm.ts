// hooks/useProfileForm.ts
import { useState, useCallback } from 'react';
import { ProfileFormData } from '../types/profile.types';

export const useProfileForm = (initialData: ProfileFormData) => {
    const [formData, setFormData] = useState<ProfileFormData>(initialData);
    
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        setFormData(prev => {
            // Handle specializations
            if (name === 'specializations') {
                // Split by comma and get the last item
                const items = value.split(',');
                const lastItem = items[items.length - 1].trim();
                
                // Only add new item if it ends with comma and isn't empty
                if (value.endsWith(',') && lastItem !== '') {
                    // Remove duplicates and empty values
                    const newSpecializations = [...new Set([...prev.specializations, lastItem])]
                        .filter(Boolean);
                    
                    return {
                        ...prev,
                        specializationsInput: '', // Clear input after adding
                        specializations: newSpecializations
                    };
                }
                
                // Just update the input field
                return {
                    ...prev,
                    specializationsInput: value
                };
            }
    
            // Handle certifications
            if (name === 'certifications') {
                const items = value.split(',');
                const lastItem = items[items.length - 1].trim();
    
                if (value.endsWith(',') && lastItem !== '') {
                    const newCertifications = {
                        name: [...new Set([...prev.certifications.name, lastItem])]
                            .filter(Boolean)
                    };
    
                    return {
                        ...prev,
                        certificationsInput: '', // Clear input after adding
                        certifications: newCertifications
                    };
                }
    
                return {
                    ...prev,
                    certificationsInput: value
                };
            }
    
            // Handle other fields normally
            return {
                ...prev,
                [name]: name === 'yearsOfExperience' 
                    ? value === '' ? 0 : parseInt(value, 10)
                    : value
            };
        });
    }, []);

    const handleDeleteSpecialization = useCallback((specToDelete: string) => {
        setFormData(prev => ({
            ...prev,
            specializations: prev.specializations.filter(spec => spec !== specToDelete)
          }));
    }, []);

    const handleDeleteCertification = useCallback((certToDelete: string) => {
        setFormData(prev => ({
            ...prev,
            certifications: {
            name: prev.certifications.name.filter(cert => cert !== certToDelete)
            }
        }));
    }, []);

    return {
        formData,
        setFormData,
        handleChange,
        handleDeleteSpecialization,
        handleDeleteCertification
    };
};