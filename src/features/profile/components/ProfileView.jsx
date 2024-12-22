// src/features/profile/components/ProfileView.jsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  Award, 
  Linkedin,
  Mail, 
  Phone, 
  Twitter,
  Edit,
  Loader,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '../../auth/hooks/useNavigation';

const ProfileView = ({ userId }) => {
  // State management for profile data and loading states
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get authentication and navigation contexts
  const { user } = useAuth();
  const { navigate } = useNavigation();

  // Fetch profile data when component mounts or userId changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate profile data for development
        setProfile({
          id: userId,
          name: 'John Doe',
          professionalTitle: 'Senior MEP Engineer',
          company: 'Engineering Solutions Inc.',
          yearsOfExperience: 8,
          specializations: 'HVAC Design, Energy Modeling, Sustainable Design',
          certifications: 'PE, LEED AP, CEM',
          bio: 'Experienced MEP engineer specializing in sustainable building design and energy-efficient systems. Passionate about creating environmentally conscious solutions that meet both client needs and environmental standards.',
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          contactEmail: 'john.doe@example.com',
          phoneNumber: '+1 (123) 456-7890',
          profilePicture: '/api/placeholder/150/150', // Placeholder image
          projectCount: 24,
          connectionsCount: 156
        });
        setError(null);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Check if this is the user's own profile
  const isOwnProfile = user?.id === profile?.id;

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Not found state UI
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-blue-300 mb-4">Profile not found</div>
        <button
          onClick={() => navigate('/')}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header with Edit Button */}
      <div className="relative">
        {isOwnProfile && (
          <button
            onClick={() => navigate('/profile/edit')}
            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-blue-600
                     text-blue-100 rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Main Profile Card */}
      <Card className="bg-gray-800 border border-blue-500/20">
        <CardHeader className="pb-0">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/20">
                <img
                  src={profile.profilePicture}
                  alt={`${profile.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-blue-100 mb-2">
                {profile.name}
              </h1>
              <div className="text-xl text-blue-300 mb-4">
                {profile.professionalTitle}
              </div>
              <div className="flex items-center space-x-6 text-blue-400">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {profile.company}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {profile.yearsOfExperience} years experience
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-8 pt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-100">{profile.projectCount}</div>
                <div className="text-sm text-blue-300">Projects</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-100">{profile.connectionsCount}</div>
                <div className="text-sm text-blue-300">Connections</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-100">{profile.certifications.split(',').length}</div>
                <div className="text-sm text-blue-300">Certifications</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-100">{profile.yearsOfExperience}</div>
                <div className="text-sm text-blue-300">Years</div>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h2 className="text-lg font-semibold text-blue-100 mb-3">About</h2>
              <p className="text-blue-300 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Specializations Section */}
            <div>
              <h2 className="text-lg font-semibold text-blue-100 mb-3">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.split(',').map((specialization, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm"
                  >
                    {specialization.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div>
              <h2 className="text-lg font-semibold text-blue-100 mb-3">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.split(',').map((certification, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    {certification.trim()}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-blue-100 mb-3">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.contactEmail}
                </a>
                {profile.phoneNumber && (
                  <div className="flex items-center text-blue-300">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.phoneNumber}
                  </div>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn Profile
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;