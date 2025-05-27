import React, { useState } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { navigate } = useNavigation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setStatus('submitting');
    setError('');
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
        setFormData({ password: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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
            onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={e => setFormData(f => ({ ...f, confirmPassword: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-400/50 focus:outline-none focus:border-blue-400"
            required
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
}
