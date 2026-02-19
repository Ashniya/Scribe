import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader, User } from 'lucide-react';
import { searchUsers } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const inputRef = useRef(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                try {
                    const data = await searchUsers(query);
                    setResults(data.users || []);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectUser = (username) => {
        navigate(`/profile/${username}`);
        onClose();
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all ${isDark ? 'bg-slate-900 ring-1 ring-slate-700' : 'bg-white'}`}>

                {/* Search Header */}
                <div className={`flex items-center p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                    <Search className={`w-5 h-5 mr-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search writers..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={`flex-1 bg-transparent border-none focus:ring-0 text-lg ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                    />
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader className="w-6 h-6 animate-spin text-scribe-green" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                People
                            </div>
                            {results.map(user => (
                                <div
                                    key={user._id || user.id}
                                    onClick={() => handleSelectUser(user.username)}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}
                                >
                                    <img
                                        src={user.photoURL || user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                        alt={user.displayName}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {user.displayName}
                                        </h4>
                                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            @{user.username} • {user.followerCount || 0} followers
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.length >= 2 ? (
                        <div className="py-8 text-center px-4">
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No writers found for "{query}"
                            </p>
                        </div>
                    ) : (
                        <div className="py-12 text-center px-4">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${isDark ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-400'}`}>
                                <Search className="w-6 h-6" />
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Search for friends, writers, and creators on Scribe.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
