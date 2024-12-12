import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';

export const Dashboard = () => {
    const { logout } = useAuth();
    const { navigate } = useNavigation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Your Dashboard
            </h1>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
            </button>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">
                    Getting Started
                </h2>
                <p className="text-blue-600">
                    You're now logged in! this is your protected dashboard area.
                </p>
                </div>
    
                {/* Sample Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2">Recent Activity</h3>
                    <p className="text-gray-600">No recent activity to display</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2">Quick Stats</h3>
                    <p className="text-gray-600">No stats available yet</p>
                </div>
            
    
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                What's Next?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Complete Your Profile
                </button>
                <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Explore Features
                </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };