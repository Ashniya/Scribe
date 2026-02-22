import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import {
    User, Bell, Lock, Palette, Shield, CreditCard,
    Check, Eye, EyeOff, Mail, AtSign, FileText, Trash2, LogOut, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage({ onClose }) {
    const { currentUser, signOut } = useAuth();
    const { isDark, setIsDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Auth State for Re-authentication
    const [showReauthModal, setShowReauthModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'email' | 'password' | 'delete'
    const [passwordForAuth, setPasswordForAuth] = useState('');

    // Messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Account Form State
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [username, setUsername] = useState(
        currentUser?.email?.split('@')[0] || ''
    );
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState(currentUser?.email || '');

    // Edit Modes
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification Settings
    const [notifications, setNotifications] = useState({
        newFollower: true,
        newComment: true,
        newLike: false,
        weeklyDigest: true,
        productUpdates: false,
    });

    // Publishing Settings
    const [publishing, setPublishing] = useState({
        defaultPublic: true,
        allowComments: true,
        showInRecommendations: true,
    });

    const tabs = [
        { id: 'account', label: 'Account' },
        { id: 'publishing', label: 'Publishing' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'security', label: 'Security and apps' },
    ];

    const showSuccess = (msg) => {
        setSuccess(msg);
        setError('');
        setTimeout(() => setSuccess(''), 3000);
    };

    const showError = (msg) => {
        setError(msg);
        setSuccess('');
    };

    // --- Authentication Helpers ---
    const handleReauth = async () => {
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, passwordForAuth);
            await reauthenticateWithCredential(auth.currentUser, credential);
            setShowReauthModal(false);
            setPasswordForAuth('');

            // Execute pending action
            if (pendingAction === 'email') await performUpdateEmail();
            else if (pendingAction === 'password') await performUpdatePassword();
            else if (pendingAction === 'delete') await performDeleteAccount();

            setPendingAction(null);
        } catch (err) {
            setError('Incorrect password. Please try again.');
        }
    };

    // --- Account Actions ---
    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName.trim()
            });
            showSuccess('Profile updated successfully!');
            setIsEditingUsername(false);
        } catch (err) {
            showError('Failed to update profile. ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleInitiateUpdateEmail = () => {
        setPendingAction('email');
        setShowReauthModal(true);
    };

    const performUpdateEmail = async () => {
        setSaving(true);
        try {
            console.log('Initiating email update for:', email);
            await verifyBeforeUpdateEmail(auth.currentUser, email);
            console.log('Verification email sent successfully');
            showSuccess('Verification email sent! Click the link in your inbox to update.');
            setIsEditingEmail(false);
        } catch (err) {
            console.error('Error updating email:', err);
            if (err.code === 'auth/requires-recent-login') {
                console.log('Recent login required');
                setShowReauthModal(true);
            } else if (err.code === 'auth/operation-not-allowed') {
                console.log('Operation not allowed');
                showError('Email update not enabled. Please check Firebase console.');
            } else {
                showError('Failed to send verification. ' + err.message);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            setPendingAction('delete');
            setShowReauthModal(true);
        }
    };

    const performDeleteAccount = async () => {
        try {
            await auth.currentUser.delete();
            navigate('/');
        } catch (err) {
            showError('Failed to delete account. ' + err.message);
        }
    };


    // --- Styling Classes ---
    const base = isDark ? 'text-white' : 'text-gray-900';
    const muted = isDark ? 'text-gray-400' : 'text-gray-500';
    const border = isDark ? 'border-slate-800' : 'border-gray-200';
    const inputClass = isDark
        ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-600 focus:border-slate-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400';
    const buttonBase = "px-4 py-2 rounded-full text-sm font-medium transition disabled:opacity-50";

    const renderTabContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div className="space-y-10 max-w-3xl">
                        {/* Email Section */}
                        <div className="space-y-4">
                            <h3 className={`text-lg font-bold ${base}`}>Email address</h3>
                            <div className="flex items-center justify-between">
                                {isEditingEmail ? (
                                    <div className="flex-1 max-w-md flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`flex-1 px-3 py-2 rounded-lg border outline-none text-sm ${inputClass}`}
                                        />
                                        <button
                                            onClick={handleInitiateUpdateEmail}
                                            disabled={saving}
                                            className={`${buttonBase} bg-green-600 text-white hover:bg-green-700`}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditingEmail(false)}
                                            className={`${buttonBase} border ${border} hover:bg-gray-100 dark:hover:bg-slate-800`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <p className={`${muted}`}>{currentUser?.email}</p>
                                        <button
                                            onClick={() => setIsEditingEmail(true)}
                                            className={`${muted} hover:${base} text-sm`}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Username/Profile Section */}
                        <div className="space-y-4">
                            <h3 className={`text-lg font-bold ${base}`}>Profile information</h3>
                            <div className="flex flex-col gap-4">
                                {isEditingUsername ? (
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className={`block text-xs mb-1 ${muted}`}>Display Name</label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className={`w-full px-3 py-2 rounded-lg border outline-none text-sm ${inputClass}`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs mb-1 ${muted}`}>Short Bio</label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                rows={3}
                                                className={`w-full px-3 py-2 rounded-lg border outline-none text-sm resize-none ${inputClass}`}
                                            />
                                            <p className={`text-xs mt-1 ${muted}`}>{bio.length}/160</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUpdateProfile}
                                                disabled={saving}
                                                className={`${buttonBase} bg-green-600 text-white hover:bg-green-700`}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditingUsername(false)}
                                                className={`${buttonBase} border ${border} hover:bg-gray-100 dark:hover:bg-slate-800`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <p className={`${base} font-medium`}>{currentUser?.displayName || 'No display name'}</p>
                                            <p className={`text-sm ${muted}`}>{bio || 'No bio set'}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditingUsername(true)}
                                            className={`${muted} hover:${base} text-sm`}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div className="space-y-4">
                            <h3 className={`text-lg font-bold ${base}`}>Profile picture</h3>
                            <div className="flex items-center justify-between">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white text-2xl font-bold">
                                    {(currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase()}
                                </div>
                                <button className={`${muted} hover:${base} text-sm`}>
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-10 border-t border-red-200 dark:border-red-900/30 space-y-6">
                            <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`${base} font-medium`}>Delete account</p>
                                        <p className={`text-sm ${muted}`}>Permanently delete your account and all content.</p>
                                    </div>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 transition`}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`${base} font-medium`}>Log Out</p>
                                        <p className={`text-sm ${muted}`}>Sign out of your account on this device.</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className={`px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600 transition`}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'publishing':
                return (
                    <div className="space-y-8 max-w-3xl">
                        <h3 className={`text-lg font-bold ${base}`}>Publishing settings</h3>
                        <p className={muted}>Manage how your stories are published.</p>
                        {/* Add publishing specific toggles here similar to previous implementation if needed */}
                        <div className={`p-6 rounded-lg border ${border} border-dashed text-center ${muted}`}>
                            Publishing settings coming soon
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-8 max-w-3xl">
                        <h3 className={`text-lg font-bold ${base}`}>Email notifications</h3>
                        <p className={muted}>Control what emails you receive.</p>
                        <div className={`p-6 rounded-lg border ${border} border-dashed text-center ${muted}`}>
                            Notification settings coming soon
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-8 max-w-3xl">
                        <h3 className={`text-lg font-bold ${base}`}>Security and apps</h3>
                        <p className={muted}>Manage your password and connected apps.</p>
                        <div className={`p-6 rounded-lg border ${border} border-dashed text-center ${muted}`}>
                            Security settings coming soon
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (

        <div className={`flex flex-col gap-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-serif font-bold">Settings</h1>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                        aria-label="Close settings"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Horizontal Navigation */}
                <div className={`flex items-center gap-8 border-b ${border} overflow-x-auto no-scrollbar`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id
                                ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                                : `${muted} hover:${base}`
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="py-4">
                {renderTabContent()}
            </div>

            {/* Re-auth Modal */}
            {showReauthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <h3 className={`text-xl font-bold mb-4 ${base}`}>Confirm your password</h3>
                        <p className={`text-sm mb-4 ${muted}`}>For your security, please confirm your password to continue.</p>

                        <input
                            type="password"
                            value={passwordForAuth}
                            onChange={(e) => setPasswordForAuth(e.target.value)}
                            placeholder="Current Password"
                            className={`w-full px-4 py-3 rounded-lg border outline-none mb-4 ${inputClass}`}
                        />

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowReauthModal(false);
                                    setPendingAction(null);
                                    setPasswordForAuth('');
                                    setError('');
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${muted} hover:${base}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReauth}
                                className="px-6 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {success && (
                <div className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg animate-fadeIn flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400" />
                    {success}
                </div>
            )}
        </div>
    );
}

// Add these styles to your CSS or use Tailwind config
// .no-scrollbar::-webkit-scrollbar { display: none; }
// .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
