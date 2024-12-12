// src/features/home/components/AppIcon.jsx
import React from 'react';

export const AppIcon = ({ icon: Icon, label, badge, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-6 bg-gray-900/70 rounded-xl border border-blue-500/20 hover:border-blue-400/40 shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer backdrop-blur-md group"
  >
    <div className="relative">
      <Icon size={32} className="text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
      {badge && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-blue-100 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
    <span className="text-sm font-medium text-blue-100">{label}</span>
  </div>
);

export default AppIcon;