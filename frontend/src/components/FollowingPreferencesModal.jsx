import React, { useState } from 'react';
import { X, Bell, BellOff } from 'lucide-react';

export default function FollowingPreferencesModal({ author, isDark, onClose, onSave }) {
    const [emailNotifications, setEmailNotifications] = useState('on');
    const [isUnfollowing, setIsUnfollowing] = useState(false);

    const handleSave = () => {
        onSave({ emailNotifications, isUnfollowing });
        onClose();
    };

    const handleUnfollow = () => {
        setIsUnfollowing(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-8">
                    {/* Author Avatar */}
                    <div className="flex justify-center mb-6">
                        {author.photoURL ? (
                            <img
                                src={author.photoURL}
                                alt={author.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-scribe-green/20"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-bold text-2xl border-4 border-scribe-green/20">
                                {author.name?.[0]?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Following preferences for {author.name}
                    </h2>

                    {/* Subtitle */}
                    <p className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        You are now following this writer.
                    </p>

                    {/* Feedback message */}
                    <p className={`text-sm text-center mb-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Feedback helps improve your reading experience. You can also:
                    </p>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {/* Email notifications on */}
                        <label
                            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition ${emailNotifications === 'on'
                                    ? isDark ? 'bg-slate-700 border-2 border-scribe-green' : 'bg-gray-50 border-2 border-scribe-green'
                                    : isDark ? 'bg-slate-900 border-2 border-slate-700' : 'bg-white border-2 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="notifications"
                                    value="on"
                                    checked={emailNotifications === 'on'}
                                    onChange={(e) => setEmailNotifications(e.target.value)}
                                    className="w-5 h-5 text-scribe-green focus:ring-scribe-green"
                                />
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Email notifications on
                                </span>
                            </div>
                            <Bell className={`w-5 h-5 ${emailNotifications === 'on' ? 'text-scribe-green' : isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        </label>

                        {/* Email notifications off */}
                        <label
                            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition ${emailNotifications === 'off'
                                    ? isDark ? 'bg-slate-700 border-2 border-scribe-green' : 'bg-gray-50 border-2 border-scribe-green'
                                    : isDark ? 'bg-slate-900 border-2 border-slate-700' : 'bg-white border-2 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="notifications"
                                    value="off"
                                    checked={emailNotifications === 'off'}
                                    onChange={(e) => setEmailNotifications(e.target.value)}
                                    className="w-5 h-5 text-scribe-green focus:ring-scribe-green"
                                />
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Email notifications off
                                </span>
                            </div>
                            <BellOff className={`w-5 h-5 ${emailNotifications === 'off' ? 'text-scribe-green' : isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        </label>

                        {/* Unfollow */}
                        <label
                            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition ${isUnfollowing
                                    ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
                                    : isDark ? 'bg-slate-900 border-2 border-slate-700' : 'bg-white border-2 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="notifications"
                                    value="unfollow"
                                    checked={isUnfollowing}
                                    onChange={handleUnfollow}
                                    className="w-5 h-5 text-red-500 focus:ring-red-500"
                                />
                                <span className={`font-medium ${isUnfollowing ? 'text-red-500' : isDark ? 'text-red-400' : 'text-red-500'}`}>
                                    Unfollow
                                </span>
                            </div>
                            <BellOff className={`w-5 h-5 ${isUnfollowing ? 'text-red-500' : 'text-red-400'}`} />
                        </label>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full py-3 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
