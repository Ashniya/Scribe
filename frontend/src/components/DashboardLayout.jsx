import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Editor from './Editor';
import LoginPromptModal from './LoginPromptModal';
import SearchModal from './SearchModal';
import {
    Search,
    Menu,
    X,
    Edit3,
    User,
    Settings,
    LogOut
} from 'lucide-react';

export default function DashboardLayout({ children }) {
    const { isDark, setIsDark } = useContext(ThemeContext);
    const { currentUser, signOut } = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProtectedAction = (action) => {
        if (!currentUser) {
            setShowLoginPrompt(true);
            return;
        }
        action();
    };

    if (showEditor) {
        return <Editor onClose={() => setShowEditor(false)} isDark={isDark} />;
    }

    return (
        <>
            <LoginPromptModal
                isOpen={showLoginPrompt}
                onClose={() => setShowLoginPrompt(false)}
                isDark={isDark}
            />

            <div className={`min-h-screen ${isDark ? 'dark bg-slate-900' : 'bg-white'} transition-colors duration-300 ${showLoginPrompt ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="flex">
                    {/* Sidebar */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        isDark={isDark}
                        onLogout={handleLogout}
                    />

                    {/* Main Content */}
                    <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-20 lg:ml-64' : 'ml-0'}`}>
                        {/* Top Bar */}
                        <div className={`sticky top-0 z-30 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <div className="max-w-7xl mx-auto px-4 py-4">
                                <div className="flex items-center justify-between">
                                    {/* Left Side - Search */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-1 max-w-2xl relative">
                                            <div
                                                className="relative cursor-text"
                                                onClick={() => setSearchModalOpen(true)}
                                            >
                                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                                <input
                                                    type="text"
                                                    placeholder="Search"
                                                    readOnly
                                                    className={`w-full pl-10 pr-4 py-2 rounded-full border transition cursor-pointer ${isDark
                                                        ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-slate-600'
                                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-300'
                                                        } focus:outline-none`}
                                                />
                                            </div>
                                            <SearchModal
                                                isOpen={searchModalOpen}
                                                onClose={() => setSearchModalOpen(false)}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Side Actions */}
                                    <div className="flex items-center gap-3 ml-4">
                                        <button
                                            onClick={() => handleProtectedAction(() => setShowEditor(true))}
                                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-medium rounded-full hover:shadow-lg transition"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Write
                                        </button>

                                        {/* Theme Toggle (Lamp) */}
                                        <button
                                            onClick={() => setIsDark(!isDark)}
                                            className="relative w-14 h-16 flex flex-col items-center group"
                                            aria-label="Toggle theme"
                                        >
                                            <div className={`w-0.5 h-5 transition-colors duration-300 ${isDark ? 'bg-gray-400' : 'bg-gray-800'}`}></div>
                                            <div className="relative">
                                                {!isDark && (
                                                    <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-20 h-24 overflow-visible pointer-events-none">
                                                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2 animate-pulse" style={{ animationDuration: '2s' }}></div>
                                                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-20 animate-pulse" style={{ animationDuration: '2.2s' }}></div>
                                                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 -rotate-25 animate-pulse" style={{ animationDuration: '2.5s' }}></div>
                                                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-20 animate-pulse" style={{ animationDuration: '2.3s' }}></div>
                                                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 rotate-25 animate-pulse" style={{ animationDuration: '2.6s' }}></div>
                                                    </div>
                                                )}
                                                <svg width="40" height="34" viewBox="0 0 40 34" className="relative drop-shadow-lg">
                                                    <rect x="17" y="0" width="5" height="3" fill={isDark ? "#374151" : "#1f2937"} rx="1" />
                                                    <path d="M 10 4 L 30 4 L 33 11 Q 33 13, 31 13 L 8 13 Q 6 13, 6 11 Z" fill={isDark ? "#374151" : "#1f2937"} stroke={isDark ? "#1f2937" : "#111827"} strokeWidth="1" className="transition-all duration-500" />
                                                    <ellipse cx="19.5" cy="13" rx="12" ry="1.5" fill={isDark ? "#1f2937" : "#111827"} opacity="0.8" />
                                                    {!isDark && (
                                                        <>
                                                            <circle cx="19.5" cy="17" r="3.5" fill="#fef3c7" opacity="0.9" className="animate-pulse" />
                                                            <circle cx="19.5" cy="17" r="2.5" fill="url(#bulbGradientTopBar)" />
                                                            <circle cx="18.8" cy="16.3" r="1" fill="#fffbeb" />
                                                        </>
                                                    )}
                                                    <defs>
                                                        <radialGradient id="bulbGradientTopBar" cx="50%" cy="50%" r="50%">
                                                            <stop offset="0%" stopColor="#fef3c7" />
                                                            <stop offset="100%" stopColor="#fde68a" />
                                                        </radialGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </button>

                                        {/* User Avatar */}
                                        {currentUser ? (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:ring-2 ring-scribe-sage transition-all focus:outline-none"
                                                >
                                                    {currentUser?.photoURL ? (
                                                        <img
                                                            src={currentUser.photoURL}
                                                            alt={currentUser?.displayName || 'User'}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">${currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}</div>`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">
                                                            {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                </button>

                                                {showProfileMenu && (
                                                    <div className={`absolute right-0 top-full mt-2 w-48 py-2 rounded-xl shadow-xl border transform origin-top-right transition-all animate-fadeIn ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                                                        <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                                            <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser?.displayName || 'Writer'}</p>
                                                            <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{currentUser?.email}</p>
                                                        </div>
                                                        <button onClick={() => { setShowProfileMenu(false); navigate('/profile'); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                            <User className="w-4 h-4" /> Profile
                                                        </button>
                                                        <button onClick={() => { setShowProfileMenu(false); navigate('/dashboard', { state: { section: 'settings' } }); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                            <Settings className="w-4 h-4" /> Settings
                                                        </button>
                                                        <div className={`h-px my-1 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}></div>
                                                        <button onClick={() => { setShowProfileMenu(false); handleLogout(); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}>
                                                            <LogOut className="w-4 h-4" /> Log Out
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <button onClick={() => navigate('/login')} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:ring-2 ring-scribe-green transition">
                                                <User className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Render children */}
                        <div className={`transition-opacity duration-300`}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
