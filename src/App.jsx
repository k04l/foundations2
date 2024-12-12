// src/App.jsx
import { useState, useEffect } from 'react';
import { 
  NavigationProvider,
  EmailVerification,
  ResendVerification,
  Register,
  Login,
  ProtectedRoute,
  RequestPasswordReset,
  ResetPassword
} from './features/auth';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { useAuth } from './features/auth/hooks/useAuth';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { HomePage } from './features/home/components/HomePage';
import { Home } from 'lucide-react'; // Add this import for the home icon

const AppContent = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to render the header with navigation
  const renderHeader = () => {
    // Don't show the default header on the homepage
    if (currentPath === '/') return null;

    return (
      <header className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Home button */}
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Home size={24} />
                <span className="font-semibold">Bernoullia</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentPath === '/login' && (
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
                >
                  Create Account
                </button>
              )}
              {currentPath === '/register' && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Render different content based on current path
  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/register':
        return isAuthenticated ? navigate('/dashboard') : <Register />;
      case '/login':
        return isAuthenticated ? navigate('/dashboard') : <Login />;
      case '/dashboard':
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
      case '/verify-email':
        return (
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8 text-blue-100">
              Email Verification
            </h1>
            <EmailVerification />
            <ResendVerification />
          </div>
        );
      case '/reset-password-request':
        return <RequestPasswordReset />;
      case '/reset-password':
        return <ResetPassword />;
      default:
        // Redirect to home for unknown routes
        navigate('/');
        return null;
    }
  };

  // Don't wrap HomePage in the default layout
  if (currentPath === '/') {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100">
      {renderHeader()}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="bg-gray-900/80 border-t border-blue-500/20 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-blue-300">
          © 2024 Bernoullia. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

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