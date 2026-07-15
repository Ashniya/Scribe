import { auth } from '../config/firebase.js';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const parseErrorMessage = async (response) => {
  try {
    const text = await response.text();
    if (!text) return response.statusText || `HTTP ${response.status}`;
    try {
      const json = JSON.parse(text);
      return json?.error || json?.message || response.statusText || `HTTP ${response.status}`;
    } catch {
      return text;
    }
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
};

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
      const message = await parseErrorMessage(response);
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const publicApiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  return await response.json();
};