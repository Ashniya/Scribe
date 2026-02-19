<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
	onAuthStateChanged,
	signOut as firebaseSignOut,
	checkActionCode as firebaseCheckActionCode,
	applyActionCode as firebaseApplyActionCode
} from 'firebase/auth';
import { auth } from '../config/firebase.js';

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
		// Set a timeout to ensure loading doesn't hang indefinitely
		const timeoutId = setTimeout(() => {
			console.warn('Firebase auth initialization timeout - rendering app anyway');
			setLoading(false);
		}, 2000);

		try {
			// Listen for auth state changes
			const unsubscribe = onAuthStateChanged(
				auth,
				(user) => {
					clearTimeout(timeoutId);
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
				},
				(error) => {
					// Handle auth state observer errors
					console.error('Firebase auth error:', error);
					clearTimeout(timeoutId);
					setLoading(false);
				}
			);

			// Cleanup subscription on unmount
			return () => {
				clearTimeout(timeoutId);
				unsubscribe();
			};
		} catch (error) {
			console.error('Error setting up Firebase auth:', error);
			clearTimeout(timeoutId);
			setLoading(false);
		}
	}, []);

	const checkActionCode = async (code) => firebaseCheckActionCode(auth, code);
	const applyActionCode = async (code) => firebaseApplyActionCode(auth, code);

	const value = {
		currentUser,
		loading,
		signOut,
		checkActionCode,
		applyActionCode
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
=======
// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null); // separate MongoDB user data
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setMongoUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn('Firebase auth timeout - rendering anyway');
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeoutId);

      if (firebaseUser) {
        // Set Firebase user immediately so UI doesn't hang
        setCurrentUser(firebaseUser);

        try {
          // Get fresh token then sync with MongoDB
          await firebaseUser.getIdToken();
          const { getCurrentUser } = await import('../utils/api');
          const response = await getCurrentUser();

          if (response?.success && response?.data) {
            // Merge MongoDB data into currentUser
            // Prioritize MongoDB photoURL if it exists and isn't a default placeholder if we want, but usually MongoDB is the source of truth for profile edits.
            const mergedUser = { 
              ...firebaseUser, 
              ...response.data,
              photoURL: response.data.photoURL || firebaseUser.photoURL, // Explicitly prefer MongoDB photoURL
              displayName: response.data.displayName || firebaseUser.displayName
            };
            setCurrentUser(mergedUser);
            setMongoUser(response.data);
            console.log('✅ User synced with MongoDB:', response.data.email, '| photoURL:', mergedUser.photoURL);
          } else {
            console.warn('⚠️ MongoDB sync returned unexpected response:', response);
          }
        } catch (err) {
          console.error('❌ Error syncing with MongoDB:', err.message);
          // Keep Firebase user even if MongoDB sync fails
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setMongoUser(null);
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase auth error:', error);
      clearTimeout(timeoutId);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    mongoUser,      // expose mongoUser separately (has username, bio, etc.)
    setCurrentUser,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
>>>>>>> origin/feature/aditi
