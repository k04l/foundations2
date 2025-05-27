import React, { ForwardedRef, HTMLAttributes } from 'react';

export type AlertVariant = 'default' | 'destructive';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: AlertVariant;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = 'relative w-full rounded-lg border p-4';
    const variantClasses: Record<AlertVariant, string> = {
      default: 'bg-gray-700 border-blue-500/20 text-blue-100',
      destructive: 'border-red-500/50 text-red-300 bg-red-900/20',
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
  }
);
Alert.displayName = 'Alert';

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}
export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={`mb-1 font-medium leading-none tracking-tight ${className || ''}`}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`text-sm opacity-90 ${className || ''}`}
      {...props}
    />
  )
);
AlertDescription.displayName = 'AlertDescription';
