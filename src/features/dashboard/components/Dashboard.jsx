// src/features/dashboard/components/Dashboard.jsx

import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { 
  // Changed 'Tool' to 'Wrench' which is the correct icon name
  BarChart2 as BarChart, 
  Users, 
  BookOpen, 
  Wrench,
  Bell, 
  Calendar, 
  LogOut,
  UserCircle,
  Compass
} from 'lucide-react';

export const Dashboard = () => {
  // Preserve existing authentication and navigation
  const { navigate } = useNavigation();
  
  // Sample data - in a real app, this would come from your backend
  const recentActivity = [
    { type: 'course', title: 'HVAC Design Fundamentals', date: '2024-12-10' },
    { type: 'discussion', title: 'Energy Code Updates 2024', date: '2024-12-09' },
    { type: 'project', title: 'Hospital MEP System Design', date: '2024-12-08' }
  ];

  const upcomingEvents = [
    { title: 'MEP Coordination Meeting', date: '2024-12-15', time: '10:00 AM' },
    { title: 'BIM Training Session', date: '2024-12-18', time: '2:00 PM' }
  ];

  const handleCompleteProfile = () => {
    const { navigate } = useNavigation();
    navigate('/profile');
  };

  const handleExploreFeatures = () => {
    navigate('/features');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section with Logout */}
      <div className="bg-gray-900 shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-100">
            Welcome to Your Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-800 text-blue-300">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 text-blue-300">
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-gray-800 rounded-lg p-4 border border-blue-500/20">
          <h2 className="text-lg font-semibold text-blue-100 mb-2">
            Getting Started
          </h2>
          <p className="text-blue-300">
            Welcome to your enhanced MEP engineering dashboard. Let's help you make the most of your professional platform.
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800 border border-blue-500/20">
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-900/50 p-3 mr-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-300">Learning Progress</p>
              <p className="text-2xl font-bold text-blue-100">3 Courses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-blue-500/20">
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-900/50 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-300">Network</p>
              <p className="text-2xl font-bold text-blue-100">28 Connections</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-blue-500/20">
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-900/50 p-3 mr-4">
              <Wrench className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-300">Tools Used</p>
              <p className="text-2xl font-bold text-blue-100">5 Tools</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <Card className="bg-gray-800 border border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-100">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  {activity.type === 'course' && <BookOpen className="h-5 w-5 text-blue-400 mr-3" />}
                  {activity.type === 'discussion' && <Users className="h-5 w-5 text-blue-400 mr-3" />}
                  {activity.type === 'project' && <Wrench className="h-5 w-5 text-blue-400 mr-3" />}
                  <div>
                    <p className="text-sm font-medium text-blue-100">{activity.title}</p>
                    <p className="text-xs text-blue-300">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gray-800 border border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-100">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Calendar className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-100">{event.title}</p>
                    <p className="text-xs text-blue-300">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What's Next Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-blue-500/20">
        <h2 className="text-lg font-semibold text-blue-100 mb-4">
          What's Next?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleCompleteProfile}
            className="flex items-center justify-center p-4 bg-gray-700 border border-blue-500/20 rounded-lg hover:bg-gray-600 transition-colors text-blue-100"
          >
            <UserCircle className="h-5 w-5 mr-2" />
            Complete Your Profile
          </button>
          <button 
            onClick={handleExploreFeatures}
            className="flex items-center justify-center p-4 bg-gray-700 border border-blue-500/20 rounded-lg hover:bg-gray-600 transition-colors text-blue-100"
          >
            <Compass className="h-5 w-5 mr-2" />
            Explore Features
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;