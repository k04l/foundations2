// App.jsx
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
import { Home, Settings, User, LogOut } from 'lucide-react';
import ProfileView from './features/profile/components/ProfileView';
import ProfileEdit from './features/profile/components/ProfileEdit';
import { useNavigation } from './features/auth/hooks/useNavigation';

// Separate Header component with dropdown functionality
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { navigate } = useNavigation();
  const { isAuthenticated, logout, user } = useAuth();
  const { currentPath } = useNavigation();

  // Close dropdown when clicking outside - improves user experience
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.settings-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  // Don't show header on homepage
  if (currentPath === '/') return null;

  // Profile navigation handler
  const handleProfileNavigation = () => {
    setDropdownOpen(false);

    if (!user?.id) {
      console.warn('No user ID found for profile navigation');
      return;
    }

    // Log navigation attemp for debugging
    console.log('Attempting to navigate to profile:', user.id);

    // Use the correct profile path
    navigate(`/profile/${user.id}`);
  }

  return (
    <header className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Home size={24} />
              <span className="font-semibold">Bernoullia</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Show Create Account button on login page */}
            {currentPath === '/login' && !isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
              >
                Create Account
              </button>
            )}
            {/* Show Sign In button on register page */}
            {currentPath === '/register' && !isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
            {/* Settings dropdown for authenticated users */}
            {isAuthenticated && (
              <div className="relative settings-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-blue-500/20 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="py-1">
                      {/* Profile Link - View Mode */}
                      <button
                        onClick={handleProfileNavigation}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-300 hover:bg-gray-700"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </button>

                      {/* Logout Option */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-300 hover:bg-gray-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const AppContent = () => {
  const { currentPath, navigate } = useNavigation();
  const { isAuthenticated } = useAuth();

  // Handle authenticated route redirects
  useEffect(() => {
    if (isAuthenticated) {
      if (currentPath === '/login' || currentPath === '/register') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, currentPath, navigate]);

  // Render different content based on current path
  const renderContent = () => {
    console.log('Current path:', currentPath); // Helpful for debugging

    // First handle profile-related routes with special pattern matching
    if (currentPath.startsWith('/profile/')) {
      // Handle edit route explicitly first
      if (currentPath === '/profile/edit') {
        return (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        );
      }
      
      // Then handle dynamic profile routes
      const userId = currentPath.split('/profile/')[1];
      if (userId) {
        return <ProfileView userId={userId} />;
      }

      // Default to current user's profile if no ID is provided
      if (user?.id) {
        navigate(`/profile/${user.id}`);
        return null;
      }

      // If no user is logged in, redirect to login
      navigate('/login');
      return null;
    }

    // Handle standard routes
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/register':
        return !isAuthenticated ? <Register /> : null;
      case '/login':
        return !isAuthenticated ? <Login /> : null;
      case '/dashboard':
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
      case '/reset-password-request':
        return <RequestPasswordReset />;
      case '/reset-password':
        return <ResetPassword />;
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
      default:
        return (
          <div className="text-center py-12">
            <p className="text-blue-300 mb-4">Page not found</p>
            <button
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Return to Home
            </button>
          </div>
        );
    }
  };

  // Special handling for homepage to avoid wrapping it in the default layout
  if (currentPath === '/') {
    return renderContent();
  }

  // Default layout for all other pages
  return (
    <div className="min-h-screen bg-gray-900 text-blue-100">
      <Header />
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