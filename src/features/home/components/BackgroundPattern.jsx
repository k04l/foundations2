// src/features/home/components/BackgroundPattern.jsx
import React from 'react';

export const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Spiral-like gradient effect */}
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-overlay"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[80px] mix-blend-overlay"></div>
    
    {/* Gear-like patterns */}
    <div className="absolute top-20 right-20 w-32 h-32 border-2 border-blue-500/10 rounded-full"></div>
    <div className="absolute bottom-40 left-20 w-48 h-48 border border-blue-400/5 rounded-full"></div>
    
    {/* Subtle grid overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
    <div className="absolute inset-0 bg-[radial-gradient(#203060_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]"></div>
  </div>
);

export default BackgroundPattern;