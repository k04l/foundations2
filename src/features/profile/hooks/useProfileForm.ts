// hooks/useProfileForm.ts
import { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { ProfileFormData } from '../types/profile.types';

// Helper type for our field names to ensure type safety
type ArrayFieldName = 'specializations' | 'certifications';

interface FormState {
    formData: ProfileFormData;
    inputState: {
        specializationsInput: string;
        certificationsInput: string;
    };
}

export const useProfileForm = (initialData: ProfileFormData) => {
    // Add debug logging for initial state
    console.debug('Initializing form with data:', initialData);

    // Consolidate all state into a single hook call at the top
    const [formState, setFormState] = useState<FormState>(() => {
        const initialState = {
            formData: {
                ...initialData,
                yearsOfExperience: initialData.yearsOfExperience ?? null,
                specializations: initialData.specializations || [],
                certifications: {
                    name: initialData.certifications?.name || []
                }
            },
            inputState: {
                specializationsInput: '',
                certificationsInput: ''
            }
        };
        console.debug('Initial form state:', initialState);
        return initialState;
    });


    // Add a setFormData function that works with our state structure
    const setFormData = useCallback((updater: (prev: ProfileFormData) => ProfileFormData) => {
        setFormState(prev => ({
            ...prev,
            formData: updater(prev.formData)
        }));
    }, []);

    // // Separate state for input fields to prevent value conflicts
    // const [inputState, setInputState] = useState<InputState>({
    //     specializationsInput: '',
    //     certificationsInput: ''
    // });


    // Type-safe input processor
    const processInput = useCallback((input: string): string[] => {
        return input
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);
    }, []);

    // Unified state update function
    const updateFormState = useCallback((
        updater: (prev: FormState) => FormState
    ) => {
        setFormState(prev => {
            const newState = updater(prev);
            console.debug('Form state update:', {
                previous: prev,
                new: newState
            });
            return newState;
        });
    }, []);

    // // Debounced function to handle array updates
    // const updateArrayField = useMemo(() => {
    //     const handler = (fieldName: ArrayFieldName, values: string[]) => {
    //         setFormData(prev => {
    //             if (fieldName === 'specializations') {
    //                 // For specializations, update the array directly
    //                 const updatedSpecializations = [...new Set([
    //                     ...prev.specializations,
    //                     ...values
    //                 ])];
    //                 return {
    //                     ...prev,
    //                     specializations: updatedSpecializations
    //                 };
    //             } else {
    //                 // For certifications, update the nested name array
    //                 const updatedCertifications = {
    //                     name: [...new Set([
    //                         ...(prev.certifications?.name || []),
    //                         ...values
    //                     ])]
    //                 };
    //                 return {
    //                     ...prev,
    //                     certifications: updatedCertifications
    //                 };
    //             }
    //         });

    //         // Clear the corresponding input
    //         setInputState(prev => ({
    //             ...prev,
    //             [`${fieldName}Input`]: ''
    //         }));
    //     };

    //     // Debounce the handler to prevent rapid updates
    //     return debounce(handler, 300);
    // }, []);

    // Improved change handler with type safety
    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        console.debug('handleChange triggered:', { 
            name, 
            value,
            currentFormState: formState // Log current state
        });

        if (name === 'yearsOfExperience') {
            // Handle empty field properly
            const numValue = value === '' ? null : Number(value);
            setFormState(prev => ({
                ...prev,
                formData: {
                    ...prev.formData,
                    yearsOfExperience: numValue
                }
            }));
            return;
        }

        // Handle specializations and certifications inputs
        if (name === 'specializationsInput' || name === 'certificationsInput') {
            console.debug('Special field detected:', name);
           
            setFormState(prev => {
                const newState = {
                    ...prev,
                    inputState: {
                        ...prev.inputState,
                        [name]: value
                    }
                };
                console.debug('New state after update:', newState);
                return newState;
            });

            // If value ends with comma, process it
            if (value.endsWith(',')) {
                const processedValue = value.slice(0, -1).trim();
                if (processedValue) {
                    updateFormState(prev => {
                        const newState = { ...prev };

                        if (name === 'specializationsInput') {
                            newState.formData.specializations = [
                                ...new Set([...prev.formData.specializations, processedValue])
                            ];
                            newState.inputState.specializationsInput = '';
                        } else {
                            newState.formData.certifications.name = [
                                ...new Set([...prev.formData.certifications.name, processedValue])
                            ];
                            newState.inputState.certificationsInput = '';
                        }
                        return newState;
                        
                    });
                }
            }
        } else {
            // Handle regular fields
            updateFormState(prev => ({
                ...prev,
                formData: {
                    ...prev.formData,
                    [name]: name === 'yearsOfExperience' 
                        ? (value === '' ? null : parseInt(value, 10))
                        : value
                }
            }));
        }
    }, []);

    // Delete handlers
    const handleDeleteSpecialization = useCallback((specToDelete: string) => {
        console.debug('Deleting specialization:', specToDelete);
        updateFormState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                specializations: prev.formData.specializations.filter(
                    spec => spec !== specToDelete
                )
            }
        }));
    }, []);

    const handleDeleteCertification = useCallback((certToDelete: string) => {
        console.debug('Deleting certification:', certToDelete);
        updateFormState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                certifications: {
                    name: prev.formData.certifications.name.filter(
                        cert => cert !== certToDelete
                    )
                }
            }
        }));
    }, []);

    // Get processed data for submission
    const getProcessedData = useCallback(() => {
        // Create a new object rather than mutating
        const processed: Partial<ProfileFormData> = {
            ...formState.formData,
            // Ensure yearsOfExperience is properly typed
            yearsOfExperience: formState.formData.yearsOfExperience ?? null,
            specializations: [...formState.formData.specializations],
            certifications: {
                name: [...formState.formData.certifications.name]
            }
        };
        
        // Process any remaining input values
        if (formState.inputState.specializationsInput.trim()) {
            const newSpecs = processInput(formState.inputState.specializationsInput);
            processed.specializations = [...new Set([
                ...(processed.specializations || []),
                ...newSpecs
            ])];
        }
        
        if (formState.inputState.certificationsInput.trim()) {
            const newCerts = processInput(formState.inputState.certificationsInput);
            processed.certifications = {
                name: [...new Set([
                    ...(processed.certifications?.name || []),
                    ...newCerts
                ])]
            };
        }

        // Create type-safe copy without input fields
        const { specializationsInput, certificationsInput, ...finalData } = processed;
        
        return finalData as ProfileFormData;
    }, [formState, processInput]);

    return {
        formData: formState.formData,
        inputState: formState.inputState,
        setFormData,
        handleChange,
        handleDeleteSpecialization,
        handleDeleteCertification,
        getProcessedData
    }
};
