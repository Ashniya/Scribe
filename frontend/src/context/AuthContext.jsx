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
