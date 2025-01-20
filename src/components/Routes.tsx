// src/components/Routes.tsx

import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigation } from '../features/auth/hooks/useNavigation';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

// Import components individually to avoid path resolution issues
import ProfileEdit from '../features/profile/components/ProfileEdit';
import ProfileView from '../features/profile/components/ProfileView';
import Dashboard from '../features/dashboard/components/Dashboard';
import { HomePage } from '../features/home/components/HomePage';
import { Login } from '../features/auth/components/Login';
import { Register } from '../features/auth/components/Register';

// Import other components as needed

interface RoutesProps {
    currentPath: string;
}

export const Routes: React.FC<RoutesProps> = ({ currentPath }) => {
    const { isAuthenticated, user } = useAuth();
    const { navigate } = useNavigation();

     // Handle profile routes
     if (currentPath.startsWith('/profile/')) {
        // Handle edit route
        if (currentPath === '/profile/edit') {
            return (
                <ProtectedRoute>
                    <ProfileEdit />
                </ProtectedRoute>
            );
        }

        // Handle view route
        const userId = currentPath.split('/profile/')[1];
        if (userId) {
            return <ProfileView userId={userId} />;
        }

        // Handle base profile route
        if (currentPath === '/profile' && user?.id) {
            navigate(`/profile/${user.id}`);
            return null;
        }
    }

    // Handle other routes using switch
    switch (currentPath) {
        case '/':
            return <HomePage />;
            
        case '/login':
            return !isAuthenticated ? <Login /> : null;
            
        case '/register':
            return !isAuthenticated ? <Register /> : null;
            
        case '/dashboard':
            return (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            );
            
        default:
            return (
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-blue-100 mb-4">
                        Page Not Found
                    </h1>
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

export default Routes;