// src/features/profile/components/ProfileSections/ProfessionalInfo.tsx
import React from 'react';
import { SectionProps } from '../../types/profile.types';
import { X, Award } from 'lucide-react';

interface ProfessionalInfoProps {
    formData: {
        professionalTitle: string;
        company: string;
        yearsOfExperience: number | null;
        specializations: string[];
        specializationsInput: string;
        certifications: {
            name: string[];
        };
        certificationsInput: string;
    };
    inputState: {  // Add separate inputState prop
        specializationsInput: string;
        certificationsInput: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleDeleteSpecialization: (spec: string) => void;
    handleDeleteCertification: (cert: string) => void;
}

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
    formData, 
    inputState,
    handleChange, 
    handleDeleteSpecialization,
    handleDeleteCertification
}) => {
    // Safely access the arrays with fallbacks
    const specializations = Array.isArray(formData.specializations) ? formData.specializations : [];
    const certifications = Array.isArray(formData.certifications?.name) ? formData.certifications.name : [];

    console.debug('Professional Info render:', {
        specializations,
        certifications,
        formDataSpec: formData.specializations,
        formDataCert: formData.certifications?.name
    });

    return (

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
                        value={formData.yearsOfExperience ?? ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="50"
                    />
                </div>
            </div>

            <div>
                {/* Specializations Section */}
                <label className="block text-sm font-medium text-blue-300 mb-2">
                    Specializations/Areas of Expertise
                </label>
                <textarea
                    name="specializationsInput"
                    value={inputState.specializationsInput || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Type specializations separated by commas..."
                />

                {/* Display current specializations */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {specializations.map((spec, index) => (
                        <div key={index} className="group relative inline-flex items-center px-3 py-1 bg-blue-500/20 rounded-full text-sm">
                            {spec}
                            <button
                                type="button"
                                onClick={() => handleDeleteSpecialization(spec)}
                                className="ml-2 p-1 rounded-full hover:bg-red-500/20"
                            >
                                <X className="w-3 h-3 text-red-400" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications Section */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-blue-300 mb-2">
                    Professional Certifications
                </label>
                <textarea
                    name="certificationsInput"
                    value={inputState.certificationsInput || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="e.g., PE, LEED AP, CEM"
                />

                {/* Display current certifications */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {certifications.map((cert, index) => (
                        <div key={index} className="group relative inline-flex items-center px-3 py-1 bg-blue-500/20 rounded-full text-sm">
                            <Award className="w-4 h-4 mr-2" />
                            {cert}
                            <button
                                type="button"
                                onClick={() => handleDeleteCertification(cert)}
                                className="ml-2 p-1 rounded-full hover:bg-red-500/20"
                            >
                                <X className="w-3 h-3 text-red-400" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    );
};
