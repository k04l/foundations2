// src/features/profile/components/Profile.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/alert';

const Profile = () => {
  const [formData, setFormData] = useState({
    professionalTitle: '',
    company: '',
    yearsOfExperience: '',
    specializations: '',
    certifications: '',
    bio: '',
    linkedin: '',
    twitter: '',
    contactEmail: '',
    phoneNumber: ''
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gray-800 border border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-100">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Professional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="professionalTitle"
                    value={formData.professionalTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior MEP Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Engineering Solutions Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  Specializations/Areas of Expertise
                </label>
                <textarea
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                           text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="e.g., HVAC Design, Energy Modeling, Sustainable Design"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  Professional Certifications
                </label>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                           text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="e.g., PE, LEED AP, CEM"
                />
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
                About
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                           text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Tell us about your professional journey and expertise..."
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100 border-b border-blue-500/20 pb-2">
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Twitter/X Profile
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="professional@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-blue-500/20 rounded-md 
                             text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center px-4 py-2 bg-blue-600 text-blue-100 rounded-lg
                         hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {status === 'submitting' ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;