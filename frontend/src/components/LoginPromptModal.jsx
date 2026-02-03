import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Feather, Sparkles } from 'lucide-react';

export default function LoginPromptModal({ isOpen, onClose, isDark }) {
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const fullText = "Start your writing journey with Scribe";

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setShowText(false);
      setDisplayedText('');
      setShowButton(false);

      // Start text animation
      const textTimer = setTimeout(() => {
        setShowText(true);
      }, 300);

      return () => clearTimeout(textTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showText && displayedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    } else if (displayedText.length === fullText.length && displayedText.length > 0) {
      setTimeout(() => setShowButton(true), 200);
    }
  }, [showText, displayedText, fullText]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Triangular Modal */}
      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        <div className="relative">
          {/* Triangle Shape using clip-path */}
          <div
            className={`relative p-12 pb-16 rounded-3xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-scribe-cream'
              }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-8 right-8 p-2 rounded-full transition-colors ${isDark
                ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                : 'hover:bg-white/60 text-gray-600 hover:text-gray-900'
                }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center pt-8">
              {/* Cute Icon with Animation */}


              {/* Animated Text */}
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 min-h-[100px] flex items-center justify-center px-4 ${isDark ? 'text-white' : 'text-gray-800'
                }`}>
                <span>
                  {displayedText}
                  {showText && displayedText.length < fullText.length && (
                    <span className="animate-blink ml-1">|</span>
                  )}
                </span>
              </h2>

              <p className={`mb-8 px-6 transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0'
                } ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Join our community of writers and share your stories with the world.
              </p>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className={`px-10 py-4 bg-gradient-to-r from-scribe-green to-scribe-sage text-white text-lg font-semibold rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${showButton ? 'animate-fadeInUp' : 'opacity-0'
                  }`}
              >
                Login to Continue
              </button>

              {/* Additional Link */}
              <p className={`mt-6 text-sm transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0'
                } ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <button
                  onClick={handleSignup}
                  className="text-scribe-green font-semibold hover:text-scribe-sage transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}