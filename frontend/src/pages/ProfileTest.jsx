// frontend/src/pages/ProfileTest.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getMyProfile, 
  updateProfile, 
  uploadAvatar, 
  uploadCoverImage,
  searchUsers,
  getSuggestedUsers 
} from '../utils/api';

export default function ProfileTest() {
  const { currentUser, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Form states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    location: '',
    occupation: '',
    twitter: '',
    github: '',
    linkedin: '',
    website: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // Load profile once the auth state is ready
  useEffect(() => {
    if (!currentUser) return; // wait for auth to be available
    loadProfile();
    loadSuggestedUsers();
  }, [currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyProfile();
      console.log('✅ Profile loaded:', data);
      setProfile(data.user);
      
      // Populate form
      setFormData({
        displayName: data.user.displayName || '',
        username: data.user.username || '',
        bio: data.user.bio || '',
        location: data.user.location || '',
        occupation: data.user.occupation || '',
        twitter: data.user.socialLinks?.twitter || '',
        github: data.user.socialLinks?.github || '',
        linkedin: data.user.socialLinks?.linkedin || '',
        website: data.user.socialLinks?.website || ''
      });
      
      setMessage('✅ Profile loaded successfully!');
    } catch (err) {
      console.error('❌ Load profile error:', err);
      setError('Failed to load profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedUsers = async () => {
    try {
      const data = await getSuggestedUsers(5);
      setSuggestedUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load suggested users:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const updateData = {
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        occupation: formData.occupation,
        socialLinks: {
          twitter: formData.twitter,
          github: formData.github,
          linkedin: formData.linkedin,
          website: formData.website
        }
      };
      
      const data = await updateProfile(updateData);
      console.log('✅ Profile updated:', data);
      setProfile(data.user);
      setMessage('✅ Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('❌ Update error:', err);
      setError('Failed to update: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const data = await uploadAvatar(file);
      console.log('✅ Avatar uploaded:', data);
      setProfile({ ...profile, avatar: data.avatar });
      setMessage('✅ Avatar uploaded successfully!');
    } catch (err) {
      console.error('❌ Avatar upload error:', err);
      setError('Failed to upload avatar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const data = await uploadCoverImage(file);
      console.log('✅ Cover uploaded:', data);
      setProfile({ ...profile, coverImage: data.coverImage });
      setMessage('✅ Cover image uploaded successfully!');
    } catch (err) {
      console.error('❌ Cover upload error:', err);
      setError('Failed to upload cover: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      const data = await searchUsers(searchQuery);
      console.log('🔍 Search results:', data);
      setSearchResults(data.users || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  if (!profile) {
    // If user is not authenticated, prompt to sign in
    if (!currentUser) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p>Please sign in to view your profile.</p>
          </div>
        </div>
      );
    }

    // Show loading spinner or error if present
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>{error ? `Error: ${error}` : 'Loading profile...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Profile Test Page</h1>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Profile Display */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          {/* Cover Image */}
          <div 
            className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative"
            style={profile.coverImage ? { backgroundImage: `url(${profile.coverImage})`, backgroundSize: 'cover' } : {}}
          >
            <label className="absolute bottom-4 right-4 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={loading}
              />
              <div className="bg-white px-4 py-2 rounded shadow hover:bg-gray-100">
                📷 Upload Cover
              </div>
            </label>
          </div>
          
          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-start gap-6 -mt-20">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={profile.avatar || profile.photoURL || 'https://ui-avatars.com/api/?name=User'}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    📷
                  </div>
                </label>
              </div>
              
              {/* Info */}
              <div className="flex-1 mt-16">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                    <p className="text-gray-600">@{profile.username}</p>
                    {profile.bio && <p className="mt-2 text-gray-700">{profile.bio}</p>}
                    {profile.location && <p className="text-sm text-gray-500 mt-1">📍 {profile.location}</p>}
                    {profile.occupation && <p className="text-sm text-gray-500">💼 {profile.occupation}</p>}
                  </div>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
                
                {/* Stats */}
                <div className="flex gap-6 mt-4 text-sm">
                  <div>
                    <span className="font-bold">{profile.totalPosts || 0}</span> Posts
                  </div>
                  <div>
                    <span className="font-bold">{profile.followerCount || 0}</span> Followers
                  </div>
                  <div>
                    <span className="font-bold">{profile.followingCount || 0}</span> Following
                  </div>
                  <div>
                    <span className="font-bold">{profile.totalViews || 0}</span> Views
                  </div>
                </div>

                {/* Social Links */}
                {(profile.socialLinks?.twitter || profile.socialLinks?.github || profile.socialLinks?.linkedin || profile.socialLinks?.website) && (
                  <div className="flex gap-4 mt-4">
                    {profile.socialLinks.twitter && (
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Twitter
                      </a>
                    )}
                    {profile.socialLinks.github && (
                      <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
                        GitHub
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editMode && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Social Links</h4>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                    placeholder="Twitter URL"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({...formData, github: e.target.value})}
                    placeholder="GitHub URL"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    placeholder="LinkedIn URL"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="Website URL"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Users */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Search Users</h3>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or name..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Search
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{searchResults.length} results found</p>
              {searchResults.map(user => (
                <div key={user._id} className="border rounded p-3 flex items-center gap-3">
                  <img 
                    src={user.avatar || user.photoURL} 
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested Users */}
        {suggestedUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Suggested Users</h3>
            <div className="space-y-2">
              {suggestedUsers.map(user => (
                <div key={user._id} className="border rounded p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar || user.photoURL} 
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1 border rounded hover:bg-gray-50">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold mb-2">Debug Info</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ currentUser, profile }, null, 2)}
          </pre>
        </div>

      </div>
    </div>
  );
}