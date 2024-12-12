// src/features/auth/components/Login.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';
import { Alert, AlertDescription } from './alert';

export const Login = () => {
  // State management for form fields and UI status
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  // Get authentication and navigation hooks
  const { login } = useAuth();
  const { navigate } = useNavigation();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      // Log attempt for debugging
      console.log('Attempting login with:', {
        email: formData.email,
        passwordLength: formData.password.length
      });

      // Use the AuthContext login function
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setStatus('success');
        // Add a small delay to ensure auth state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        setStatus('error');
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setStatus('error');
      setError(typeof err === 'string' ? err : 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {typeof error === 'object' ? JSON.stringify(error) : error}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-2" 
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                disabled={status === 'submitting'}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-2" 
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                disabled={status === 'submitting'}
              />
            </div>

            {/* Submit Button with Loading State */}
            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                         bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};