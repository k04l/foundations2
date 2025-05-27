// src/features/auth/components/ResendVerification.jsx
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

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

export const ResendVerification = () => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setStatus('sending');
      const response = await fetch('/api/v1/auth/resend-verification', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('sent');
        // Start cooldown timer (60 seconds)
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const data = await response.json();
        setStatus('error');
        setError(data.message || 'Failed to resend verification email');
      }
    } catch (err) {
      setStatus('error');
      setError('Unable to resend verification email. Please try again later.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 p-6 rounded-lg">
      {status === 'idle' && (
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            Haven't received the verification email?
          </p>
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {cooldown > 0 
              ? `Resend available in ${cooldown}s` 
              : 'Resend Verification Email'
            }
          </button>
        </div>
      )}

      {status === 'sending' && (
        <Alert className="bg-blue-50 border-blue-200">
          <MailIcon />
          <AlertTitle className="text-blue-700">Sending...</AlertTitle>
          <AlertDescription className="text-blue-600">
            Sending verification email...
          </AlertDescription>
        </Alert>
      )}

      {status === 'sent' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckIcon />
          <AlertTitle className="text-green-700">Email Sent!</AlertTitle>
          <AlertDescription className="text-green-600">
            Please check your email for the verification link.
            {cooldown > 0 && ` You can request another email in ${cooldown} seconds.`}
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertIcon />
          <AlertTitle className="text-red-700">Error</AlertTitle>
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};