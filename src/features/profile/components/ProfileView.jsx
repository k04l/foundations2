// src/features/profile/components/ProfileView.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Loader } from '../../../components/ui/loader';
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
  User,
  AlertCircle,
  Camera
} from 'lucide-react';
import { useNavigation } from '../../auth/hooks/useNavigation';

const ProfileView = ({ userId }) => {
  // State management for profile data and loading states
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const { user: currentUser } = useAuth();
  const { navigate } = useNavigation();
  const { fetchProfile } = useProfile();

  // Default image for profiles without a picture
  const defaultProfileImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='w-full h-full text-gray-400'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        console.log('No userId provided, skipping profile load');
        return;
      }
  
      try {
        setLoading(true);
        const result = await fetchProfile(userId);
        console.log('Profile fetch result:', result);
  
        if (!result.success) {
          setError(result.error || 'Failed to load profile');
          return;
        }
  
        setProfileData(result.data);
        setError(null);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
  
    loadProfile();
  }, [userId, fetchProfile]);


  const ProfileImage = () => {

    if (profileData?.profilePicture?.url) {
        return (
          <img
            src={profileData.profilePicture.url}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            onError={(e) => {
              e.currentTarget.src = defaultProfileImage;
            }}
          />
        );
      }
      
      return (
        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="w-12 h-12 text-blue-400" />
        </div>
      );
    };

    // SpecializationsList component to display a list of specializations
    const SpecializationsList = ({ specializations }) => {
        if (!specializations) return null;
      
        let specArray = [];
        try {
          if (Array.isArray(specializations)) {
            // If it's already an array, use it
            specArray = specializations.flat();
          } else if (typeof specializations === 'string') {
            // If it's a string, try to parse it
            const parsed = JSON.parse(specializations);
            specArray = Array.isArray(parsed) ? parsed.flat() : [parsed];
          }
        } catch (e) {
          console.error('Error parsing specializations:', e);
          return null;
        }
      
        // Filter out empty or invalid entries
        specArray = specArray.filter(spec => spec && spec !== '[]');
      
        return (
          <div className="flex flex-wrap gap-2">
            {specArray.map((spec, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm"
              >
                {typeof spec === 'string' ? spec.trim() : JSON.stringify(spec)}
              </span>
            ))}
          </div>
        );
      };

    // Similarly for certifications
  const CertificationsList = ({ certifications }) => {
    if (!certifications?.name) return null;

    const certArray = Array.isArray(certifications?.name)
        ? certifications.name
        : [certifications.name].filter(Boolean);
    //   ? (typeof certifications === 'string'
    //       ? certifications.split(',')
    //       : Array.isArray(certifications)
    //         ? certifications
    //         : [])
    //   : [];
  
    return (
      <div className="flex flex-wrap gap-2">
        {certArray.map((cert, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm"
          >
            <Award className="w-4 h-4 mr-2" />
            {cert.trim()}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loader center />;
  }

  if (error) {
    return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  // Handle the case where no profile exists yet
    if (!profileData) {
        const isOwnProfile = currentUser?.id === userId;

        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="bg-gray-800 border border-blue-500/20">
                    <CardContent className="p-6">
                        <div className="text-center space-y-4">
                            <h2 className="text-xl font-semibold">  
                                {isOwnProfile ? 'Complete Your Profile' : 'Profile Not Found'}
                            </h2>

                            {isOwnProfile && (
                                <button
                                    onClick={() => navigate('/profile/edit')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Create Profile
                                </button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isOwnProfile = currentUser?.id === profileData.user;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="bg-gray-800 border border-blue-500/20">
                <CardHeader>
                    <div className="flex flex-col items-center md:flex-row md:justify-between md:items-start">
                        <div className="text-center md:text-left flex-1">
                            <ProfileImage />
                            <CardTitle className="text-2xl">{profileData.name || 'Joe Smith'}</CardTitle>
                            <CardTitle className="text-2xl">{profileData.professionalTitle || 'Professional Title'}</CardTitle>
                            <p className="text-gray-500">{profileData.company || 'Company'}</p>
                        </div>
                        {isOwnProfile && (
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="inline-flex items-center px-3 py-2 bg-blue-600 text-blue-100 rounded-lg hover:bg-blue-500"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-8 pt-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-100">
                                    {profileData.projectCount || 0}
                                </div>
                                <div className="text-sm text-blue-300">Projects</div>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-100">
                                    {profileData.connectionsCount || 0}
                                </div>
                                <div className="text-sm text-blue-300">Connections</div>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                                {/* Use the array length or 0 if not available */}
                                <div className="text-2xl font-bold text-blue-100">
                                {Array.isArray(profileData.certifications?.name) ? profileData.certifications.name.length : 0}
                                </div>
                                <div className="text-sm text-blue-300">Certifications</div>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-100">
                                    {profileData.yearsOfExperience || 0}
                                </div>
                                <div className="text-sm text-blue-300">Years</div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        {profileData.bio && (
                            <div>
                            <h2 className="text-lg font-semibold text-blue-100 mb-3">About</h2>
                            <p className="text-blue-300 leading-relaxed">{profileData.bio}</p>
                        </div>
                        )}

                        {/* Specializations and Certifications */}

                        {profileData.specializations && (
                            <div>
                                <h2 className="text-lg font-semibold text-blue-100 mb-3">Specializations</h2>
                                <SpecializationsList specializations={profileData.specializations} />
                            </div>
                        )}
                        {profileData.certifications && (
                            <div>
                                <h2 className="text-lg font-semibold text-blue-100 mb-3">Certifications</h2>
                                <CertificationsList certifications={profileData.certifications} />
                            </div>
                        )}


                        {/* Specializations Section
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

                        {/* Certifications Section
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
                        </div> */} 

                        {/* Contact Information */}
                        {(profileData.contactEmail || profileData.phoneNumber || profileData.linkedin || profileData.twitter) && (
                            
                        <div>
                        <h2 className="text-lg font-semibold text-blue-100 mb-3">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileData.contactEmail && (
                                <a
                                    href={`mailto:${profileData.contactEmail}`}
                                    className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    {profileData.contactEmail}
                                </a>
                            )}
                            
                            {profileData.phoneNumber && (
                            <div className="flex items-center text-blue-300">
                                <Phone className="w-4 h-4 mr-2" />
                                {profileData.phoneNumber}
                            </div>
                            )}
                            {profileData.linkedin && (
                            <a
                                href={profileData.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                            >
                                <Linkedin className="w-4 h-4 mr-2" />
                                LinkedIn Profile
                            </a>
                            )}
                            {profileData.twitter && (
                            <a
                                href={profileData.twitter}
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
                        )}
                    </div>
                    </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;