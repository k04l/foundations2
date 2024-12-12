// src/features/home/components/HomePage.jsx
import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { 
  Grid, 
  ArrowRight, 
  Users, 
  BookOpen, 
  Wrench, 
  Briefcase, 
  Lightbulb, 
  MessageCircle, 
  BarChart 
} from 'lucide-react';
import { BackgroundPattern } from './BackgroundPattern';
import { AppIcon } from './AppIcon';
import { UserDropdown } from './UserDropdown';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigation();

  // Handler for navigation with authentication check
  const handleNavigation = (path) => {
    // If the path requires authentication and user isn't authenticated,
    // redirect to login first
    if (path.startsWith('/dashboard') && !isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  // Handler specifically for call-to-action buttons
  const handleActionButton = (type) => {
    if (type === 'signin') {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (type === 'register') {
      window.history.pushState({}, '', '/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative text-blue-100">
      <BackgroundPattern />
      
      <header className="bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-100">BERNOULLIA</h1>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <>
                  <button 
                    onClick={() => handleActionButton('signin')}
                    className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-800/50 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleActionButton('register')}
                    className="px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Join Community
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-100 mb-6">
            The Digital Hub for MEP Engineers
          </h2>
          <p className="text-xl text-blue-300">
            Connect, learn, and grow with the first digital-first community for Mechanical, Electrical, and Plumbing engineers
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-blue-100 mb-6 flex items-center">
            <div className="w-8 h-[2px] bg-blue-500 mr-3"></div>
            Learn & Grow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AppIcon 
              icon={BookOpen} 
              label="Courses" 
              onClick={() => handleNavigation('/courses')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
            <AppIcon 
              icon={BarChart} 
              label="Case Studies" 
              onClick={() => handleNavigation('/case-studies')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
            <AppIcon 
              icon={Grid} 
              label="Code Cards" 
              badge="New" 
              onClick={() => handleNavigation('/code-cards')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
            <AppIcon 
              icon={Wrench} 
              label="Tools" 
              onClick={() => handleNavigation('/tools')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-blue-100 mb-6 flex items-center">
            <div className="w-8 h-[2px] bg-blue-500 mr-3"></div>
            Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AppIcon 
              icon={Users} 
              label="Network" 
              onClick={() => handleNavigation('/network')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
            <AppIcon 
              icon={MessageCircle} 
              label="Discussions" 
              onClick={() => handleNavigation('/discussions')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
            <AppIcon 
              icon={Briefcase} 
              label="Job Board" 
              onClick={() => handleNavigation('/jobs')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
            <AppIcon 
              icon={Lightbulb} 
              label="Projects" 
              onClick={() => handleNavigation('/projects')}
              className="transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600/20 to-blue-400/10 backdrop-blur-sm rounded-xl p-12 text-center border border-blue-500/20 hover:border-blue-400/40 transition-colors">
          <h3 className="text-3xl font-semibold text-blue-100 mb-6">
            Ready to revolutionize MEP engineering?
          </h3>
          <button 
            onClick={() => handleNavigation(isAuthenticated ? '/dashboard' : '/register')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-all duration-200 text-lg font-medium group transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;