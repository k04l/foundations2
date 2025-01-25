// hooks/useProfileForm.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { debounce } from 'lodash';
import { ProfileFormData } from '../types/profile.types';

export const useProfileForm = (initialData: ProfileFormData) => {
    const [formData, setFormData] = useState<ProfileFormData>({
        ...initialData,
        specializationsInput: '',
        certificationsInput: '',
        specializations: initialData.specializations || [],
        certifications: {
            name: initialData.certifications?.name || []
        }
        // yearsOfExperience: initialData.yearsOfExperience ?? null  // Note: Allow empty string
      });

    // Separate state for input fields to prevent value conflicts
    const [inputState, setInputState] = useState({
        specializationsInput: '',
        certificationsInput: ''
    });


    // Memoize the processing functions to prevent recreation on every render
    const processInput = useMemo(() => {
        return (input: string): string[] => {
            return input
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);
        };
    }, []);

    // Debounced function to handle array updates
    const updateArrayField = useMemo(() => 
        debounce((fieldName: 'specializations' | 'certifications', values: string[]) => {
            setFormData(prev => {
                if (fieldName === 'specializations') {
                    return {
                        ...prev,
                        specializations: [...new Set([...prev.specializations, ...values])]
                    };
                } else {
                    return {
                        ...prev,
                        certifications: {
                            name: [...new Set([...prev.certifications.name, ...values])]
                        }
                    };
                }
            });
            // Clear the corresponding input
            setInputState(prev => ({
                ...prev,
                [`${fieldName}Input`]: ''
            }));
        }, 300), // 300ms debounce
        []
    );

    // Improved change handler with type safety
    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Handle specializations and certifications inputs
        if (name === 'specializationsInput' || name === 'certificationsInput') {
            setInputState(prev => ({ ...prev, [name]: value }));

            // Process if comma or enter is detected
            if (value.endsWith(',') || value.endsWith('\n')) {
                const processedValue = value.replace(/[,\n]$/, '');
                const newItems = processInput(processedValue);
                
                if (newItems.length > 0) {
                    updateArrayField(
                        name === 'specializationsInput' ? 'specializations' : 'certifications',
                        newItems
                    );
                }
            }
            return;
        }

        // Special handling for years of experience
    if (name === 'yearsOfExperience') {
        // If the value is empty, set to null
        if (value === '') {
            setFormData(prev => ({ ...prev, [name]: null }));
            return;
        }
        // Only update if it's a valid number
        const num = parseInt(value, 10);
        if (!isNaN(num)) {
            setFormData(prev => ({ ...prev, [name]: num }));
        }
        return;
    }

    // Handle all other fields normally
    setFormData(prev => ({ ...prev, [name]: value }));
}, [processInput, updateArrayField]);

    // Delete handlers with improved type safety
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

    // Cleanup effect
    useEffect(() => {
        return () => {
            updateArrayField.cancel();
        };
    }, [updateArrayField]);

    return {
        formData,
        setFormData,
        inputState,
        handleChange,
        handleDeleteSpecialization,
        handleDeleteCertification
    };
};