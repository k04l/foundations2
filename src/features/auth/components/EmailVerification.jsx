// src/features/auth/components/EmailVerification.jsx
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
// import { Mail, AlertCircle, Check } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export const EmailVerification = () => {
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const { navigate } = useNavigation();
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
          setStatus('error');
          setError('No verification token found');
          return;
        }

        const response = await fetch(`/api/v1/auth/verify-email/${token}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setStatus('success');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          const data = await response.json();
          setStatus('error');
          setError(data.message || 'Verification failed');
        }
      } catch (err) {
        setStatus('error');
        setError('Unable to verify email. Please try again later.');
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 rounded-lg shadow-sm bg-white">
      {status === 'verifying' && (
        <Alert className="bg-blue-50 border-blue-200">
          <MailIcon />
          <AlertTitle className="text-blue-700">Verifying your email</AlertTitle>
          <AlertDescription className="text-blue-600">
            Please wait while we verify your email address...
          </AlertDescription>
        </Alert>
      )}

      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckIcon />
          <AlertTitle className="text-green-700">Email Verified!</AlertTitle>
          <AlertDescription className="text-green-600">
            Your email has been verified successfully. Redirecting to login...
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertIcon />
          <AlertTitle className="text-red-700">Verification Failed</AlertTitle>
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};