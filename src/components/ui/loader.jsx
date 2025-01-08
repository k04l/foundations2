// src/components/ui/loader.jsx
import React from 'react';

export const Loader = ({ size = 'medium', className = '', center = false }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = center ? 'flex justify-center items-center min-h-[400px]' : '';

  return (
    <div className={containerClasses}>
      <div className={`relative ${className}`}>
        <div
          className={`
            animate-spin
            rounded-full
            border-2
            border-blue-500
            border-t-transparent
            ${sizeClasses[size] || sizeClasses.medium}
          `}
        />
      </div>
    </div>
  );
};

// Loading overlay for use in forms and other interactive elements
export const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
    <Loader size="large" className="text-blue-500" />
  </div>
);

export default Loader;