import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import floralImage from '../assets/hand_painted_floral_watercolour_design_2801.jpg';
import { auth } from '../config/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { registerUser } from '../utils/api';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Handle redirect result on mount (fallback from popup → redirect)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const token = await result.user.getIdToken();
          await fetch('http://localhost:5000/api/auth/me', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          navigate('/dashboard');
        }
      } catch (err) {
        // Ignore — no redirect was in progress
      }
    };
    handleRedirectResult();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('✅ User logged in');
        navigate('/dashboard');
      } else {
        // Signup
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update Firebase profile
        await updateProfile(userCredential.user, {
          displayName: formData.fullName
        });

        console.log('✅ Firebase user created:', userCredential.user.uid);

        // Register in MongoDB
        const mongoResponse = await registerUser({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: formData.fullName,
          photoURL: userCredential.user.photoURL
        });

        console.log('✅ MongoDB user created:', mongoResponse);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);

      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/Password authentication is not enabled. Please contact support.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials. Please check your email and password.');
          break;
        default:
          setError(error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    setError('');
    setLoading(true);

    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const mongoResponse = await fetch('http://localhost:5000/api/auth/me', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const mongoData = await mongoResponse.json();
      if (!mongoResponse.ok) throw new Error(mongoData.message || 'Failed to sync user');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);

      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        // Fallback: use redirect flow if popup was blocked
        try {
          await signInWithRedirect(auth, new GoogleAuthProvider());
          // Page will redirect; result handled in useEffect above
          return;
        } catch (redirectErr) {
          setError('Could not open Google sign-in. Please allow popups and try again.');
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window was closed. Please try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else {
        setError(error.message || 'Google sign-in failed. Please try again.');
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${floralImage})` }}
      />

      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="relative rounded-3xl overflow-hidden border-4 border-white/40 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="relative h-[300px] md:h-auto md:min-h-[700px] flex flex-col justify-end p-8 md:p-12 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/30 backdrop-blur-[2px]" />
              <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/40"></div>

              <div className="relative z-10">
                <p className="text-xs md:text-sm font-medium tracking-wider text-white/90 uppercase mb-3">
                  A WISE QUOTE
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 drop-shadow-lg">
                  Get<br />
                  Everything<br />
                  You Want
                </h1>
                <p className="text-sm md:text-base text-white/90 max-w-md drop-shadow-md">
                  You can get everything you want if you work hard,<br className="hidden md:block" />
                  trust the process, and stick to the plan.
                </p>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-gray-800 mt-2">
                    {isLogin
                      ? 'Enter your email and password to access your account'
                      : 'Sign up to get started with your account'
                    }
                  </p >
                </div >

                {
                  error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )
                }

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-800 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required={!isLogin}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your full name"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        minLength={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                    )}
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-gray-600 hover:text-black font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white font-semibold py-4 rounded-xl hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </span>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>

                  {/* Toggle Login/Signup */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {isLogin ? "Don't have an account? " : 'Already have an account? '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setError('');
                          setFormData({ fullName: '', email: '', password: '' });
                        }}
                        disabled={loading}
                        className="font-medium text-black hover:underline disabled:opacity-50"
                      >
                        {isLogin ? 'Sign Up' : 'Log in'}
                      </button>
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* SSO Button */}
                  <button
                    type="button"
                    onClick={() => handleSSOLogin('Google')}
                    disabled={loading}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 6.5c1.61 0 3.05.58 4.18 1.72l3.13-3.13C16.58 2.91 14.33 2 12 2 7.7 2 3.99 4.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.41 6.16-4.41z" />
                    </svg>
                    {loading ? 'Processing...' : (isLogin ? 'Sign In with Google' : 'Sign Up with Google')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
