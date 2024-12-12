// src/features/home/components/UserDropdown.jsx
import React, { useState } from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { navigate } = useNavigation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center px-4 py-2 text-blue-100 hover:bg-blue-800/50 rounded-lg transition-colors"
      >
        <Settings size={20} className="mr-2" />
        <ChevronDown size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl py-1 z-10 border border-blue-500/20">
          <button onClick={() => navigate('/dashboard')} className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/50">
            Dashboard
          </button>
          <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/50">
            Profile
          </button>
          <div className="border-t border-blue-500/20"></div>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-blue-800/50">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;