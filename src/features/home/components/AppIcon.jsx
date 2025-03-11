// src/features/home/components/AppIcon.jsx
import React from 'react';

export const AppIcon = ({ icon: Icon, label, badge, onClick, className }) => (
  <div className={`group relative ${className}`} onClick={onClick}>
    <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
      <Icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
      <span className="text-sm text-blue-100 block text-center">{label}</span>
      {badge && (
        <span className="absolute top-0 right-0 bg-blue-500 text-xs px-2 py-1 rounded-full text-blue-100">
          {badge}
        </span>
      )}
    </div>
    {label === 'Design Engineer Tools' && (
      <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-blue-300 text-sm p-2 rounded-md -mt-2 left-1/2 transform -translate-x-1/2 translate-y-full">
        Compare equipment options for MEP designs
      </div>
    )}
  </div>
);

export default AppIcon;