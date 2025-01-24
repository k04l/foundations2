// src/features/profile/components/ProfileSections/AboutSection.tsx

import React from 'react';
import { SectionProps } from '../../types/profile.types';
import { X, Award } from 'lucide-react';

export const AboutSection = ({ formData, handleChange, handleDelete }: SectionProps) => (
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
)