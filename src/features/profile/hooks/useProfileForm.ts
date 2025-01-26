// hooks/useProfileForm.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { debounce } from 'lodash';
import { ProfileFormData } from '../types/profile.types';

// Helper type for our field names to ensure type safety
type ArrayFieldName = 'specializations' | 'certifications';

export const useProfileForm = (initialData: ProfileFormData) => {
    // Define explicit types for our state
    const [formData, setFormData] = useState<ProfileFormData>({
        ...initialData,
        specializationsInput: '',
        certificationsInput: '',
        // Ensure arrays are properly initialized
        specializations: Array.isArray(initialData.specializations) 
            ? initialData.specializations 
            : [],
        certifications: {
            name: Array.isArray(initialData.certifications?.name)
                ? initialData.certifications.name
                : []
        }
        // yearsOfExperience: initialData.yearsOfExperience ?? null  // Note: Allow empty string
      });

    // Separate state for input fields to prevent value conflicts
    const [inputState, setInputState] = useState<{
        specializationsInput: string,
        certificationsInput: string
    }>({
        specializationsInput: '',
        certificationsInput: ''
    });


    // Type-safe input processor
    const processInput = useMemo(() => {
        return (input: string): string[] => {
            return input
                .split(',')
                .map((item: string) => item.trim())
                .filter((item: string): item is string => 
                    typeof item === 'string' && item.length > 0
                );
        };
    }, []);

    // Debounced function to handle array updates
    const updateArrayField = useMemo(() => {
        const handler = (fieldName: ArrayFieldName, values: string[]) => {
            setFormData(prev => {
                if (fieldName === 'specializations') {
                    // For specializations, update the array directly
                    const updatedSpecializations = [...new Set([
                        ...prev.specializations,
                        ...values
                    ])];
                    return {
                        ...prev,
                        specializations: updatedSpecializations
                    };
                } else {
                    // For certifications, update the nested name array
                    const updatedCertifications = {
                        name: [...new Set([
                            ...(prev.certifications?.name || []),
                            ...values
                        ])]
                    };
                    return {
                        ...prev,
                        certifications: updatedCertifications
                    };
                }
            });

            // Clear the corresponding input
            setInputState(prev => ({
                ...prev,
                [`${fieldName}Input`]: ''
            }));
        };

        // Debounce the handler to prevent rapid updates
        return debounce(handler, 300);
    }, []);

    // Improved change handler with type safety
    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Add some debugging to help track state changes
        console.debug('Form change:', { name, value });

        // Handle specializations and certifications inputs
        if (name === 'specializationsInput' || name === 'certificationsInput') {
            // Immediately update input state
            setInputState(prev => ({
                ...prev,
                [name]: value
            }));

            // If the value ends with comma or enter, process it
        if (value.endsWith(',') || value.endsWith('\n')) {
            const fieldName = name === 'specializationsInput' 
                ? 'specializations' 
                : 'certifications';
            const processedValue = value.replace(/[,\n]$/, '').trim();
            
            if (processedValue) {
                const newItems = processInput(processedValue);
                updateArrayField(fieldName, newItems);

                // Log update for debugging
                console.log('Array field update:', {
                    fieldName,
                    processedValue,
                    newItems
                });
            }
        }
        return;
    }

        // Special handling for years of experience
    if (name === 'yearsOfExperience') {
        // If the value is empty, set to null
        if (value === '') {
            setFormData(prev => ({ ...prev, [name]: 0 }));
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