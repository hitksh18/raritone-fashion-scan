
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    stylePreference: '',
    gender: ''
  });

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={24} className="text-gray-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{profile.name || 'User Profile'}</h1>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="stylePreference">Style Preference</Label>
              <select
                id="stylePreference"
                value={profile.stylePreference}
                onChange={(e) => setProfile({...profile, stylePreference: e.target.value})}
                disabled={!isEditing}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Style</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Classic">Classic</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={profile.gender}
                onChange={(e) => setProfile({...profile, gender: e.target.value})}
                disabled={!isEditing}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex space-x-4">
              <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Button
              onClick={logout}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
