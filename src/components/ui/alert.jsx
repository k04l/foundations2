// src/components/ui/alert.jsx
import React from 'react';

// The base Alert component
export const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseClasses = "relative w-full rounded-lg border p-4";
  const variantClasses = {
    default: "bg-gray-700 border-blue-500/20 text-blue-100",
    destructive: "border-red-500/50 text-red-300 bg-red-900/20"
  };
  
  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;
  
  return (
    <div
      ref={ref}
      role="alert"
      className={finalClassName}
      {...props}
    />
  );
});

Alert.displayName = "Alert";

// The AlertTitle component for the heading
export const AlertTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={`mb-1 font-medium leading-none tracking-tight ${className || ''}`}
      {...props}
    />
  );
});

AlertTitle.displayName = "AlertTitle";

// The AlertDescription component for the content
export const AlertDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`text-sm opacity-90 ${className || ''}`}
      {...props}
    />
  );
});

AlertDescription.displayName = "AlertDescription";