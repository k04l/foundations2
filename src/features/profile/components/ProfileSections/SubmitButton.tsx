// src/features/profile/components/SubmitButton.tsx
import React from 'react';
import { Save } from 'lucide-react';
import { SectionProps } from '../../types/profile.types';
import { X, Award } from 'lucide-react';

interface SubmitButtonProps {
    status: 'idle' | 'submitting' | 'success' | 'error';
    saveProgress: number;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ status, saveProgress }) => (
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
);