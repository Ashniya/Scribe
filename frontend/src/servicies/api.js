import { auth } from '../config/firebase.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiCall = async (endpoint, options = {}) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get fresh token
    const token = await user.getIdToken(true); // true = force refresh

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};