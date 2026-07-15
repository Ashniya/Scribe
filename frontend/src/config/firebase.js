import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config
const isConfigValid = firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your-api-key-here' &&
  firebaseConfig.authDomain &&
  firebaseConfig.authDomain !== 'your-project-id.firebaseapp.com';

if (!isConfigValid) {
  console.error(
    '❌ Firebase configuration is missing or invalid!\n\n' +
    'Please update your .env file with actual Firebase credentials.\n' +
    'Get your credentials from: https://console.firebase.google.com/\n\n' +
    'Required variables:\n' +
    '- VITE_FIREBASE_API_KEY\n' +
    '- VITE_FIREBASE_AUTH_DOMAIN\n' +
    '- VITE_FIREBASE_PROJECT_ID\n' +
    '- VITE_FIREBASE_STORAGE_BUCKET\n' +
    '- VITE_FIREBASE_MESSAGING_SENDER_ID\n' +
    '- VITE_FIREBASE_APP_ID\n' +
    '- VITE_FIREBASE_MEASUREMENT_ID'
  );
}

// Initialize Firebase
let app;
let analytics;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { auth, db };
