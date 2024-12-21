// src/features/auth/components/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { Alert, AlertDescription } from './alert';
import { ArrowLeft, Shield, Check } from 'lucide-react';


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
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      setStatus('idle');
      return;
    }

    try {
      const response = await fetch(`/api/v1/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        // Clear form data for security
        setFormData({ password: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setStatus('idle');
    }
  };

  // Success view
  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-900/70 rounded-xl border border-blue-500/20 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-blue-100 mb-4">Password Reset Successful</h2>
        <p className="text-blue-300 mb-6">
          Your password has been successfully reset. You can now login with your new password.
        </p>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  // Form view
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900/70 rounded-xl border border-blue-500/20 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-blue-100 mb-4">Set New Password</h2>
      <p className="text-blue-300 mb-6">
        Please enter your new password below.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
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
      </form>
    </div>
  );
};