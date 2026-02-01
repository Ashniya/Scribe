import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Name:</span>{' '}
              <span className="text-gray-900">
                {currentUser?.displayName || 'No name set'}
              </span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Email:</span>{' '}
              <span className="text-gray-900">{currentUser?.email}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">User ID:</span>{' '}
              <span className="text-gray-600 text-sm font-mono">{currentUser?.uid}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Email Verified:</span>{' '}
              <span className={currentUser?.emailVerified ? 'text-green-600' : 'text-orange-600'}>
                {currentUser?.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Account Created:</span>{' '}
              <span className="text-gray-900">
                {currentUser?.metadata?.creationTime}
              </span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Last Sign In:</span>{' '}
              <span className="text-gray-900">
                {currentUser?.metadata?.lastSignInTime}
              </span>
            </div>
          </div>
        </div>

        {/* Add your dashboard content here */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Projects</h3>
            <p className="text-gray-600">Your projects will appear here</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Activity</h3>
            <p className="text-gray-600">Recent activity will appear here</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Stats</h3>
            <p className="text-gray-600">Your stats will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
