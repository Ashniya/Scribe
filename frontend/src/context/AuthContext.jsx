import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Create Auth Context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
	throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign out function
  const signOut = async () => {
	try {
	  await firebaseSignOut(auth);
	  console.log('User signed out successfully');
	} catch (error) {
	  console.error('Error signing out:', error);
	  throw error;
	}
  };

  useEffect(() => {
	// Listen for auth state changes
	const unsubscribe = onAuthStateChanged(auth, (user) => {
	  setCurrentUser(user);
	  setLoading(false);
	  
	  if (user) {
		console.log('User is signed in:', {
		  uid: user.uid,
		  email: user.email,
		  displayName: user.displayName
		});
	  } else {
		console.log('User is signed out');
	  }
	});

	// Cleanup subscription on unmount
	return unsubscribe;
  }, []);

  const value = {
	currentUser,
	loading,
	signOut
  };

  return (
	<AuthContext.Provider value={value}>
	  {!loading && children}
	</AuthContext.Provider>
  );
};
