// src/features/auth/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '..//hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';
import { Loader } from '../../../components/ui/loader.tsx';
// import { useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Save the attempted URL
      localStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <Loader center />;
  }

  return isAuthenticated ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};