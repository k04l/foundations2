// src/features/auth/components/RequestPasswordReset.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';
import { Alert, AlertDescription } from './alert';
import { ArrowLeft } from 'lucide-react';

// Component for requesting password reset
export const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { navigate } = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/v1/auth/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setStatus('idle');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-900/70 rounded-xl border border-blue-500/20 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-blue-100 mb-4">Check Your Email</h2>
        <p className="text-blue-300 mb-6">
          If an account exists for {email}, you'll receive a password reset link shortly.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900/70 rounded-xl border border-blue-500/20 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-blue-100 mb-4">Reset Password</h2>
      <p className="text-blue-300 mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-blue-400"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Login
        </button>
      </form>
    </div>
  );
};

// Component for setting new password
export const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { navigate } = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setStatus('submitting');
    setError('');

    // Get token from URL
    const token = new URLSearchParams(window.location.search).get('token');

    try {
      const response = await fetch(`/api/v1/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setStatus('idle');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-900/70 rounded-xl border border-blue-500/20 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-blue-100 mb-4">Password Reset Successful</h2>
        <p className="text-blue-300 mb-6">
          Your password has been successfully reset. You can now login with your new password.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900/70 rounded-xl border border-blue-500/20 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-blue-100 mb-4">Set New Password</h2>
      <p className="text-blue-300 mb-6">
        Please enter your new password below.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-blue-400"
        >
          {status === 'submitting' ? 'Resetting...' : 'Reset Password'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Login
        </button>
      </form>
    </div>
  );
};