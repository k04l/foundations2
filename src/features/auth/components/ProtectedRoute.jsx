// src/features/auth/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '..//hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};