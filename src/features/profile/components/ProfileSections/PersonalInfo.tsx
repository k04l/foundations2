// components/ProfileSections/PersonalInfo.tsx
import { HTMLInputTypeAttribute } from 'react';
import { ProfileFormData } from '../../types/profile.types';
import React from 'react';
import { SectionProps } from '../../types/profile.types';
import { X, Award } from 'lucide-react';

interface InputFieldProps {
  label: string;
  name: string;
  type: HTMLInputTypeAttribute;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

const InputField = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder,
  required 
}: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-blue-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

interface PersonalInfoProps {
  formData: ProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalInfo = ({ formData, handleChange }: PersonalInfoProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
      Personal Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="First Name"
        name="firstName"
        type="text"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Enter your first name"
        required
      />
      <InputField
        label="Last Name"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Enter your last name"
        required
      />
    </div>
  </div>
);

// Similar components for Professional Info, About, Contact Info sections