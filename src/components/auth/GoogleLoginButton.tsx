import React from 'react';

interface GoogleLoginButtonProps {
  label?: string;
  className?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  label = 'Sign in with Google',
  className = '',
}) => {
  const handleGoogleLogin = () => {
    // Always prompt for account selection
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google?prompt=select_account`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className={`w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4 ${className}`}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
        <g>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.7 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.18 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/>
          <path fill="#FBBC05" d="M9.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C-1.13 17.13-1.13 30.87 1.69 37.91l7.98-6.2z"/>
          <path fill="#EA4335" d="M24 46c6.7 0 12.68-2.7 17.04-7.41l-7.18-5.59c-2.01 1.35-4.6 2.15-7.86 2.15-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </g>
      </svg>
      {label}
    </button>
  );
};

export default GoogleLoginButton;
