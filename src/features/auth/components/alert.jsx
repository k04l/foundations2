import * as React from "react";
import PropTypes from "prop-types";

// We create a map of variant styles for easier maintenance and reuse
const variantStyles = {
  default: "bg-white text-gray-900 border-gray-200",
  destructive: "border-red-500/50 text-red-600 bg-red-50 dark:border-red-500 dark:text-red-500 dark:bg-red-900/10",
  success: "border-green-500/50 text-green-600 bg-green-50 dark:border-green-500 dark:text-green-500 dark:bg-green-900/10",
  warning: "border-yellow-500/50 text-yellow-600 bg-yellow-50 dark:border-yellow-500 dark:text-yellow-500 dark:bg-yellow-900/10",
  info: "border-blue-500/50 text-blue-600 bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:bg-blue-900/10"
};

const Alert = React.forwardRef(({ 
  className = "",
  variant = "default",
  children, 
   ...props 
}, ref) => {
  // Get the styles for the specified variant, falling back to default if not found 
  const variantStyle = variantStyles[variant] || variantStyles.default;

  return (
    <div
      ref={ref}
      role="alert"
      className={`
          relative w-full rounded-lg border p-4 
          [&>svg+div]:translate-y-[-3px] 
          [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground 
          [&>svg~*]:pl-7 ${variantStyle} ${className}
          ${variantStyles[variant] || variantStyles.default} 
          ${className || ''}
        `}
      {...props}
    >
      {/* {icon && React.cloneElement(icon, { 
        className: "h-4 w-4",
        "aria-hidden": true
      })} */}
      {children}
    </div>
  )
});

Alert.displayName = "Alert";

Alert.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([Object.keys(variantStyles)]),
  children: PropTypes.node
};

const AlertTitle = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => (
  <h5
    ref={ref}
    className={`
      mb-1 font-medium leading-none tracking-tight 
      ${className || ''}
    `}
    {...props}
  >
    {children}
  </h5>
));

AlertTitle.displayName = "AlertTitle";

AlertTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}; 

const AlertDescription = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={`
      text-sm [&_p]:leading-relaxed 
      ${className || ''}
    `}
    {...props}
  >
    {children}
  </div>
));

AlertDescription.displayName = "AlertDescription";

AlertDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export { Alert, AlertTitle, AlertDescription };