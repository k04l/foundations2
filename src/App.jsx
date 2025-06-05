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
import { DesignEngineerLanding } from './features/home/components/DesignEngineerLanding';
import { Home, Settings, User, LogOut, Bell, MessageCircle, Bitcoin } from 'lucide-react';
import ProfileView from './features/profile/components/ProfileView';
import ProfileEdit from './features/profile/components/ProfileEdit';
import { useNavigation } from './features/auth/hooks/useNavigation';
import { Loader } from './components/ui/loader';
import ErrorBoundary from './features/auth/components/ErrorBoundary';
import PropTypes from 'prop-types';
import { AppKitProvider } from './components/WalletProvider';
import { WalletConnectButtons } from './components/WalletConnectButtons';
import NetworkPage from './features/network/NetworkPage';
import CoursesPage from './features/network/CoursesPage';
import GoogleAuthSuccess from './features/auth/components/GoogleAuthSuccess';
import JobsPage from './features/network/JobsPage'; // Import the new JobsPage component
import ToolsPage from './features/tools/ToolsPage';
import ProjectPicturePage from './features/tools/ProjectPicturePage';
import { BrowserRouter } from 'react-router-dom';

// Separate Header component with dropdown functionality
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useNavigation();
  const { isAuthenticated, logout, user } = useAuth();

  // Mock data for notifications and messages
  const notifications = [
    { id: 1, message: 'New comment on your post', read: false },
    { id: 2, message: 'New follower', read: false },
  ];

  const messages = [
    { id: 1, from: 'John Doe', snippet: 'Hey, I found your profile...', read: false },
    { id: 2, from: 'Jane Smith', snippet: 'Your application has been received.', read: true },
  ];

  // Close dropdown when clicking outside - improves user experience
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.settings-dropdown')) {
        setDropdownOpen(false);
      }
      if (notificationsOpen && !event.target.closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
      if (messagesOpen && !event.target.closest('.messages-dropdown')) {
        setMessagesOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen, notificationsOpen, messagesOpen]);

  const handleProfileClick = () => {
    setDropdownOpen(false);
    // Always navigate to the profile, even if we don't have the user ID yet
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      // Handle the case where user data isn't available yet
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          navigate(`/profile/${parsedUser.id}`);
        } else {
          console.warn('No user ID found for profile navigation');
          navigate('/login');
        }
      } else {
        console.warn('No user data found for profile navigation');
        navigate('/login');
      }
      }
    };
  

    // Don't show header on homepage
    // if (currentPath !== '/') return null;

  // Profile navigation handler
  // const handleProfileNavigation = () => {
  //   setDropdownOpen(false);

  //   if (!user?.id) {
  //     console.warn('No user ID found for profile navigation');
  //     return;
  //   }

  //   // Log navigation attemp for debugging
  //   console.log('Attempting to navigate to profile:', user.id);

  //   // Use the correct profile path
  //   navigate(`/profile/${user.id}`);
  // }

    return (
      <header className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-blue-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Logo and Menu */}
          <div className="flex items-center w-full sm:w-auto justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-lg font-semibold"
              aria-label="Go to homepage"
            >
              <Home size={24} />
              <span className="hidden sm:inline font-semibold">Bernoullia</span>
            </button>
            {/* Mobile menu button */}
            <button className="sm:hidden ml-2 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
              <Settings size={22} />
            </button>
          </div>
          {/* Right: Icons and Wallets (desktop) */}
          <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
            {/* WalletConnectButtons with Bitcoin icon */}
            <span className="flex items-center gap-1">
              <Bitcoin className="text-yellow-400 w-5 h-5" aria-label="Bitcoin" />
              <WalletConnectButtons />
            </span>
            {/* Notifications */}
            {isAuthenticated && (
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 rounded-full hover:bg-blue-900 text-blue-300" aria-label="Notifications">
                <Bell className="w-6 h-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            )}
            {/* Messages */}
            {isAuthenticated && (
              <button onClick={() => setMessagesOpen(!messagesOpen)} className="relative p-2 rounded-full hover:bg-blue-900 text-blue-300" aria-label="Messages">
                <MessageCircle className="w-6 h-6" />
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold">
                    {messages.filter(m => !m.read).length}
                  </span>
                )}
              </button>
            )}
            {/* Settings/User Dropdown */}
            {isAuthenticated && (
              <div className="relative settings-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
                  aria-label="User menu"
                >
                  <Settings size={20} />
                  <span className="hidden md:inline">Settings</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-blue-500/20 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="py-1">
                      {/* Profile Link - View Mode */}
                      <button
                        onClick={handleProfileClick}
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
          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden absolute top-full left-0 w-full bg-gray-900/95 border-t border-blue-500/20 shadow-lg z-50 flex flex-col gap-2 p-4 animate-fade-in">
              <span className="flex items-center gap-2 mb-2">
                <Bitcoin className="text-yellow-400 w-5 h-5" aria-label="Bitcoin" />
                <WalletConnectButtons />
              </span>
              {isAuthenticated && (
                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 rounded-full hover:bg-blue-900 text-blue-300 w-full text-left" aria-label="Notifications">
                  <Bell className="w-6 h-6 inline mr-2" /> Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-2 right-4 w-2 h-2 bg-bernoullia-400 rounded-full"></span>
                  )}
                </button>
              )}
              {isAuthenticated && (
                <button onClick={() => setMessagesOpen(!messagesOpen)} className="relative p-2 rounded-full hover:bg-blue-900 text-blue-300 w-full text-left" aria-label="Messages">
                  <MessageCircle className="w-6 h-6 inline mr-2" /> Messages
                  {messages.filter(m => !m.read).length > 0 && (
                    <span className="absolute top-2 right-4 w-2 h-2 bg-bernoullia-400 rounded-full"></span>
                  )}
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => { setDropdownOpen(!dropdownOpen); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors w-full text-left"
                  aria-label="User menu"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>
    );
  };

// Main content area for the app

const AppRoutes = ({ currentPath, isAuthenticated, user, navigate }) => {
  // Handle profile routes first
  if (currentPath.startsWith('/profile/')) {
    // Edit route takes precedence
    if (currentPath === '/profile/edit') {
      return (
        <ProtectedRoute>
          <ProfileEdit />
        </ProtectedRoute>
      );
    }

    // Handle dynamic profile routes
    const userId = currentPath.split('/profile/')[1];
    if (userId) {
      return <ProfileView userId={userId} />;
    }
  }

  // Handle base profile route
  if (currentPath === '/profile') {
    if (!user?.id) {
      return <Loader center />;
    }
    navigate(`/profile/${user.id}`);
    return null;
  }

  // Handle standard routes
  switch (currentPath) {
    case '/':
      return <HomePage />;
    case '/design-engineer':
      return <DesignEngineerLanding />;
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
    case '/network':
      return <NetworkPage />;
    case '/courses':
      return <CoursesPage />;
    case '/auth/google/success':
      return <GoogleAuthSuccess />;
    case '/jobs': // New route for JobsPage
      return <JobsPage />;
    case '/tools':
      return <ToolsPage />;
    case '/tools/equipment-comparison':
      return <DesignEngineerLanding />;
    case '/tools/project-pictures':
      return <ProjectPicturePage />;
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

// Create a Footer
const Footer = () => (
  <footer className="bg-gray-900/80 border-t border-blue-500/20 mt-auto">
    <div className="container mx-auto px-4 py-4 text-center text-blue-300">
      © 2025 Bernoullia. All rights reserved.
    </div>
  </footer>
);

// Main app content area
const AppContent = () => {
  const { currentPath, navigate } = useNavigation();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (currentPath === '/login' || currentPath === '/register') {
        navigate('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, currentPath, navigate]);
 
  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader center />
      </div>
    );
  }

  // Special handling for homepage
  if (currentPath === '/') {
    return <HomePage />;
  }


  // First handle profile-related routes with special pattern matching
  // if (currentPath.startsWith('/profile/')) {
  //   // Handle edit route explicitly first
  //   if (currentPath === '/profile/edit') {
  //     return (
  //       <ProtectedRoute>
  //         <ProfileEdit />
  //       </ProtectedRoute>
  //     );
  //   }
    
  //   // Then handle dynamic profile routes
  //   const userId = currentPath.split('/profile/')[1];
  //   if (userId) {
  //     return <ProfileView userId={userId} />;
  //   }
  // }

      // Default to current user's profile if no ID is provided
      // if (user?.id) {
      //   navigate(`/profile/${user.id}`);
      //   return null;
      // }

      // If no user is logged in, redirect to login
    //   navigate('/login');
    //   return null;
    // }

  //   // Handle standard routes
  //   switch (currentPath) {
  //     case '/':
  //       return <HomePage />;
  //     case '/register':
  //       return !isAuthenticated ? <Register /> : null;
  //     case '/login':
  //       return !isAuthenticated ? <Login /> : null;
  //     case '/dashboard':
  //       return (
  //         <ProtectedRoute>
  //           <Dashboard />
  //         </ProtectedRoute>
  //       );
  //     case '/reset-password-request':
  //       return <RequestPasswordReset />;
  //     case '/reset-password':
  //       return <ResetPassword />;
  //     case '/verify-email':
  //       return (
  //         <div className="max-w-md mx-auto">
  //           <h1 className="text-2xl font-bold text-center mb-8 text-blue-100">
  //             Email Verification
  //           </h1>
  //           <EmailVerification />
  //           <ResendVerification />
  //         </div>
  //       );
  //     default:
  //       return (
  //         <div className="text-center py-12">
  //           <p className="text-blue-300 mb-4">Page not found</p>
  //           <button
  //             onClick={() => navigate('/')}
  //             className="text-blue-400 hover:text-blue-300 transition-colors"
  //           >
  //             Return to Home
  //           </button>
  //         </div>
  //       );
  //   }
  // };

  // Special handling for homepage to avoid wrapping it in the default layout
  if (currentPath === '/') {
    return <HomePage />;
  }

  // Default layout for all other pages
  return (
    <div className="min-h-screen bg-gray-900 text-blue-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AppRoutes currentPath={currentPath} isAuthenticated={isAuthenticated} user={user} navigate={navigate}/>
      </main>
      <Footer />
    </div>
  );
};

// Main app component
const App = () => {
  return (
    <ErrorBoundary>
      <AppKitProvider>
        {/* BrowserRouter must be INSIDE AppKitProvider for context to work with wallet adapters */}
        <BrowserRouter>
          <NavigationProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </NavigationProvider>
        </BrowserRouter>
      </AppKitProvider>
    </ErrorBoundary>
  );
};

AppRoutes.propTypes = {
  currentPath: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  navigate: PropTypes.func 
};

// Ensure the navigate function is available in the AppRoutes component
AppRoutes.contextTypes = {
  navigate: PropTypes.func
};

export default App;