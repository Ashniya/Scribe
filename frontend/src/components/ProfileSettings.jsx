import React, { useState } from 'react';
import { X, Camera, User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';

export default function ProfileSettings({ onClose, isDark }) {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: currentUser?.displayName?.split(' ')[0] || '',
        lastName: currentUser?.displayName?.split(' ')[1] || '',
        email: currentUser?.email || '',
        day: '',
        month: '',
        year: '',
        gender: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Update Firebase auth profile
            await updateProfile(currentUser, {
                displayName: `${formData.firstName} ${formData.lastName}`
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = () => {
        alert('Photo upload feature coming soon!');
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'
                }`}>
                <div className="flex h-[600px]">
                    {/* Left Sidebar */}
                    <div className={`w-64 p-6 border-r ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'account'
                                    ? 'bg-blue-50 text-blue-600'
                                    : isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Account Details</span>
                        </button>

                        <button
                            onClick={() => alert('Shipping Address - Coming soon!')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Shipping Address</span>
                        </button>

                        <button
                            onClick={() => alert('Payment Methods - Coming soon!')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span className="font-medium">Payment methods</span>
                        </button>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <div className={`flex items-center justify-between px-8 py-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Account Details
                            </h2>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full transition ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="flex gap-8">
                                {/* Profile Picture */}
                                <div className="flex-shrink-0">
                                    <div className={`relative w-32 h-32 rounded-2xl overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'
                                        }`}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <Camera className="w-8 h-8 text-white mb-2" />
                                            <button
                                                type="button"
                                                onClick={handlePhotoChange}
                                                className="text-white text-sm font-medium"
                                            >
                                                Click to change
                                                <br />
                                                photo
                                            </button>
                                        </div>
                                        {currentUser?.photoURL && (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="Profile"
                                                className="w-full h-full object-cover opacity-70"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="flex-1 space-y-4">
                                    {/* First Name */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${isDark
                                                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                }`}
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${isDark
                                                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                }`}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            E-Mail *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none ${isDark
                                                    ? 'bg-slate-800 border-slate-700 text-gray-500'
                                                    : 'bg-gray-100 border-gray-300 text-gray-500'
                                                } cursor-not-allowed`}
                                        />
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Date of Birth (Optional)
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <select
                                                name="day"
                                                value={formData.day}
                                                onChange={handleChange}
                                                className={`px-4 py-2.5 rounded-lg border outline-none transition ${isDark
                                                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                    }`}
                                            >
                                                <option value="">Day</option>
                                                {days.map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>

                                            <select
                                                name="month"
                                                value={formData.month}
                                                onChange={handleChange}
                                                className={`px-4 py-2.5 rounded-lg border outline-none transition ${isDark
                                                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                    }`}
                                            >
                                                <option value="">Month</option>
                                                {months.map((month, idx) => (
                                                    <option key={month} value={idx + 1}>{month}</option>
                                                ))}
                                            </select>

                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                className={`px-4 py-2.5 rounded-lg border outline-none transition ${isDark
                                                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                    }`}
                                            >
                                                <option value="">Year</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Gender (Optional)
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${isDark
                                                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                                }`}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className={`px-8 py-4 border-t flex justify-end ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                            {success && (
                                <span className="text-green-600 font-medium mr-4 flex items-center">
                                    ✓ Profile updated successfully!
                                </span>
                            )}
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
