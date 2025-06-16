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
  BarChart,
  Calculator
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
    <div className="w-full flex flex-col items-center bg-primary-900 min-h-screen">
      <header className="w-full flex justify-center bg-[#101624] border-b border-blue-800/40 shadow-sm fixed top-0 z-30">
        <div className="w-full max-w-md sm:max-w-2xl flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-100 drop-shadow-sm select-none whitespace-nowrap">
            BERNOULLIA
          </h1>
          <div className="flex gap-2 sm:gap-4 items-center">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <button
                  onClick={() => handleActionButton('signin')}
                  className="text-primary-100 text-xs sm:text-sm font-semibold px-2 py-1 sm:px-3 sm:py-2 rounded-md hover:bg-primary-800/60 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleActionButton('register')}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-md shadow-md transition-all duration-200 whitespace-nowrap border border-blue-400/30"
                >
                  Join Community
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 pb-8 mt-[72px]">
        <div className="text-center mb-16 w-full max-w-md sm:max-w-2xl mx-auto">
          <h2 className="text-primary-100 font-bold text-2xl sm:text-5xl max-w-full mx-auto mb-6 leading-tight break-words">
            The Digital Hub for MEP Engineers
          </h2>
          <p className="text-primary-200 text-center max-w-full mx-auto mb-8">
            Connect, learn, and grow with the first digital-first community for Mechanical, Electrical, and Plumbing engineers
          </p>
        </div>

        {/* Featured Tool Section */}
        <section className="mb-12 bg-gradient-to-r from-blue-600/20 to-blue-400/10 backdrop-blur-sm rounded-xl p-12 text-center border border-blue-500/20 hover:border-blue-400/40 transition-colors">
          <h3 className="text-3xl font-semibold text-blue-100 mb-6">
              <Calculator className="mr-2" /> Featured Tool: Equipment Comparison
          </h3>
          <p className="text-blue-300 mb-6">
            Compare AHUs, Chillers, Cooling Towers, Custom Equipment, and more with our Equipment Comparison tool
          </p>
          <button
            onClick={() => handleNavigation('/design-engineer')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500 transition-all duration-200 text-lg font-medium group transform hover:scale-105"
          >
            Try Now
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </section>

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-blue-100 mb-6 flex items-center">
            <div className="w-8 h-[2px] bg-blue-500 mr-3"></div>
            Learn & Grow
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
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
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
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