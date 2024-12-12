// src/App.jsx
import { useState, useEffect } from 'react';
import { 
  NavigationProvider,
  EmailVerification,
  ResendVerification,
  Register,
  Login,
  ProtectedRoute
} from './features/auth';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { useAuth } from './features/auth/hooks/useAuth';
import { Dashboard } from './features/dashboard/components/Dashboard';

// Separate component for main application content that needs access to auth context
const AppContent = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isAuthenticated, logout } = useAuth();

  // Handle browser navigation events
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Navigation helper function
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Handle logout properly with auth context
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Render different content based on current path
  const renderContent = () => {
    switch (currentPath) {
      case '/register':
        return <Register />;
      case '/login':
        // Check authentication state and redirect if needed
        if (isAuthenticated) {
          navigate('/dashboard');
          return null;
        }
        return <Login />;
      case '/dashboard':
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
      case '/verify-email':
        return (
          <>
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Email Verification
            </h1>
            <EmailVerification />
            <ResendVerification />
          </>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome to Foundations
            </h1>
            <p className="text-gray-600 mb-4">
              Please login or create an account to continue.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/register');
                  setCurrentPath('/register');
                }} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register
              </button> 
              <button
                onClick={() => navigate('/login')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              > 
                Login
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 
              onClick={() => navigate('/')}
              className="text-xl font-semibold text-gray-800 cursor-pointer"
            >
              Foundations
            </h1>
          
            {currentPath === '/dashboard' && (
              <button
                onClick={handleLogout}
                className="text-xl font-semibold text-gray-800 cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          © 2024 Foundations. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Main App component that provides context
const App = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;