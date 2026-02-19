import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    getMyProfile,
    getUserProfile,
    updateProfile,
    uploadAvatar,
    uploadCoverImage,
    followUser,
    unfollowUser,
    subscribeUser,
    unsubscribeUser,
    getUserActivity
} from '../utils/api';
import { auth } from '../config/firebase'; // Import auth directly for direct signOut
import {
    MapPin,
    Briefcase,
    Link as LinkIcon,
    Twitter,
    Github,
    Linkedin,
    MoreHorizontal,
    Calendar,
    Edit3,
    Image as ImageIcon,
    UserPlus,
    UserCheck,
    MessageCircle,
    Bell,
    BellOff
} from 'lucide-react';

export default function ProfileContent() {
    const { currentUser, setCurrentUser } = useAuth();
    // Use params if available, otherwise default to current user
    const { username } = useParams();
    const navigate = useNavigate();
    const { isDark } = useContext(ThemeContext);

    // State
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('activity');
    const [isEditing, setIsEditing] = useState(false);
    const [myPosts, setMyPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [activity, setActivity] = useState([]);

    const isOwnProfile = !username || (currentUser && currentUser.username === username);

    // Form states
    const [formData, setFormData] = useState({
        displayName: '',
        username: '',
        bio: '',
        location: '',
        occupation: '',
        twitter: '',
        github: '',
        linkedin: '',
        website: ''
    });

    useEffect(() => {
        loadProfile();
    }, [username, currentUser]); // Reload when username param changes or user logs in

    useEffect(() => {
        if (profile && currentUser && !isOwnProfile) {
            setIsFollowing(profile.followers?.includes(currentUser._id) || currentUser.following?.includes(profile._id));
            setIsSubscribed(profile.subscribers?.includes(currentUser._id) || currentUser.subscribedTo?.includes(profile._id));
        }
        if (profile) {
            fetchActivity();
        }
    }, [profile, currentUser]);

    const fetchActivity = async () => {
        try {
            if (profile?._id) {
                const res = await getUserActivity(profile._id);
                if (res.success) {
                    setActivity(res.data);
                }
            }
        } catch (err) {
            console.error('Error fetching activity:', err);
        }
    };

    const loadProfile = async () => {
        setLoading(true);
        setError('');
        try {
            let data;
            if (isOwnProfile) {
                if (!currentUser) return; // Wait for auth
                data = await getMyProfile();
            } else {
                data = await getUserProfile(username);
            }

            if (!data.success) throw new Error(data.error || 'Failed to load profile');

            setProfile(data.user);

            // Only populate form if it's own profile
            if (isOwnProfile) {
                setFormData({
                    displayName: data.user.displayName || '',
                    username: data.user.username || '',
                    bio: data.user.bio || '',
                    location: data.user.location || '',
                    occupation: data.user.occupation || '',
                    twitter: data.user.socialLinks?.twitter || '',
                    github: data.user.socialLinks?.github || '',
                    linkedin: data.user.socialLinks?.linkedin || '',
                    website: data.user.socialLinks?.website || ''
                });
                fetchMyPosts(); // Fetch posts for self
            } else {
                // Fetch posts for other user (TODO: Add API for this)
                // For now, clear posts
                setMyPosts([]);
            }

        } catch (err) {
            console.error('Load profile error:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await fetch('http://localhost:5000/api/blogs/user/my-blogs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setMyPosts(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = {
                displayName: formData.displayName,
                username: formData.username,
                bio: formData.bio,
                location: formData.location,
                occupation: formData.occupation,
                socialLinks: {
                    twitter: formData.twitter,
                    github: formData.github,
                    linkedin: formData.linkedin,
                    website: formData.website
                }
            };
            const data = await updateProfile(updateData);
            setProfile(data.user);
            // Update global context to reflect changes immediately
            if (currentUser) {
                setCurrentUser({ ...currentUser, ...data.user });
            }
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await uploadAvatar(file);
            setProfile({ ...profile, avatar: data.avatar });
            // Update global context to reflect new avatar immediately
            if (currentUser) {
                setCurrentUser({ ...currentUser, photoURL: data.avatar });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await uploadCoverImage(file);
            setProfile({ ...profile, coverImage: data.coverImage });
        } catch (err) {
            console.error(err);
        }
    };

    const handleFollowToggle = async () => {
        if (!currentUser) return; // TODO: Show login prompt

        try {
            if (isFollowing) {
                await unfollowUser(profile._id);
                setIsFollowing(false);
                setProfile(prev => ({ ...prev, followerCount: prev.followerCount - 1 }));

                // Update global current user state
                setCurrentUser(prev => ({
                    ...prev,
                    following: prev.following.filter(id => id !== profile._id),
                    followingCount: (prev.followingCount || 1) - 1
                }));
            } else {
                await followUser(profile._id);
                setIsFollowing(true);
                setProfile(prev => ({ ...prev, followerCount: prev.followerCount + 1 }));

                // Update global current user state
                setCurrentUser(prev => ({
                    ...prev,
                    following: [...(prev.following || []), profile._id],
                    followingCount: (prev.followingCount || 0) + 1
                }));
            }
        } catch (err) {
            console.error('Follow toggle error:', err);
        }
    };

    const handleSubscribeToggle = async () => {
        if (!currentUser) return; // TODO: Show login prompt

        try {
            if (isSubscribed) {
                await unsubscribeUser(profile._id);
                setIsSubscribed(false);
                setProfile(prev => ({ ...prev, subscriberCount: Math.max(0, (prev.subscriberCount || 1) - 1) }));

                // Update global user state
                setCurrentUser(prev => ({
                    ...prev,
                    subscribedTo: prev.subscribedTo?.filter(id => id !== profile._id),
                    subscribedToCount: Math.max(0, (prev.subscribedToCount || 1) - 1)
                }));
            } else {
                await subscribeUser(profile._id);
                setIsSubscribed(true);
                setProfile(prev => ({ ...prev, subscriberCount: (prev.subscriberCount || 0) + 1 }));

                // Update global user state
                setCurrentUser(prev => ({
                    ...prev,
                    subscribedTo: [...(prev.subscribedTo || []), profile._id],
                    subscribedToCount: (prev.subscribedToCount || 0) + 1
                }));
            }
        } catch (err) {
            console.error('Subscribe toggle error:', err);
        }
    };

    const handleMessage = () => {
        // Placeholder for message functionality
        console.log('Open chat with', profile.username);
    };

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scribe-green"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
                <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">!</span>
                    </div>
                    <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {error === 'User not found. Please complete registration.' ? 'Account Setup Incomplete' : 'Profile Unavailable'}
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {error}
                    </p>
                    <button
                        onClick={() => {
                            // If it's a sync issue, signing out allows them to try again or login to a working account
                            auth.signOut();
                            navigate('/login');
                        }}
                        className="px-6 py-2 bg-scribe-green text-white rounded-full hover:bg-scribe-sage transition"
                    >
                        Sign Out & Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* 
                User requested 10% Sidebar, 90% Main. 
                Inside Main: 30% Empty | 30% Content | 30% Empty. 
                This effective means content is 1/3 of the main area.
                We use w-1/3 or max-w-lg to achieve this "small info" look.
            */}
            <div className="mx-auto w-full md:w-5/12 lg:w-4/12 xl:w-1/3 transition-all duration-300">

                {/* Cover Image - Reduced height */}
                <div className="relative w-full h-32 md:h-40 group rounded-b-xl overflow-hidden mb-8">
                    <div
                        className={`w-full h-full bg-cover bg-center ${!profile.coverImage && 'bg-gradient-to-r from-scribe-green to-scribe-sage'}`}
                        style={profile.coverImage ? { backgroundImage: `url(${profile.coverImage})` } : {}}
                    >
                        {!profile.coverImage && (
                            <div className="w-full h-full flex items-center justify-center text-white/50">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                        )}
                    </div>

                    {/* Cover Upload Overlay - Only for own profile */}
                    {isOwnProfile && (
                        <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                            <div className="bg-black/50 text-white px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm text-xs">
                                <ImageIcon className="w-3 h-3" />
                                <span>Change</span>
                            </div>
                        </label>
                    )}
                </div>

                <div className="px-4">
                    {/* Profile Header - Compact */}
                    <div className="relative -mt-16 mb-4 flex flex-col items-center text-center">
                        {/* Avatar - Smaller */}
                        <div className="relative group shrink-0 mb-3">
                            <img
                                src={profile.avatar || profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`}
                                alt={profile.displayName}
                                className={`w-20 h-20 rounded-full border-4 object-cover ${isDark ? 'border-slate-900' : 'border-white'} shadow-md`}
                            />
                            {isOwnProfile && (
                                <label className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                                    <ImageIcon className="w-5 h-5 text-white" />
                                </label>
                            )}
                        </div>

                        {/* Name and Handle - Smaller fonts */}
                        <div className="mb-3">
                            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {profile.displayName}
                            </h1>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                @{profile.username}
                            </p>
                        </div>

                        {/* Actions - Contextual */}
                        <div className="flex items-center gap-2 mb-4">
                            {isOwnProfile ? (
                                <>
                                    <button className="px-4 py-1.5 bg-gradient-to-r from-scribe-green to-scribe-sage text-white text-sm font-medium rounded-full hover:shadow-md transition">
                                        Create
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`px-4 py-1.5 border text-sm font-medium rounded-full transition flex items-center gap-1.5 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleFollowToggle}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition flex items-center gap-1.5 ${isFollowing
                                            ? `border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                                            : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                                            }`}
                                    >
                                        {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                    <button
                                        onClick={handleSubscribeToggle}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition flex items-center gap-1.5 ${isSubscribed
                                            ? `border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                                            : 'bg-scribe-green text-white hover:bg-scribe-sage'
                                            }`}
                                    >
                                        {isSubscribed ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                    </button>
                                    <button
                                        onClick={handleMessage}
                                        className={`px-4 py-1.5 border text-sm font-medium rounded-full transition flex items-center gap-1.5 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Message
                                    </button>
                                </>
                            )}
                            <button className={`p-1.5 rounded-full border ${isDark ? 'border-gray-600 text-gray-400 hover:bg-slate-800' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Bio and Edit Form */}
                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className={`mb-6 p-4 rounded-xl border text-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <div className="grid grid-cols-1 gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Display Name"
                                    value={formData.displayName}
                                    onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                    className={`p-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className={`p-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className={`p-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Occupation"
                                    value={formData.occupation}
                                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                    className={`p-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                />
                            </div>
                            <textarea
                                placeholder="Bio"
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className={`w-full p-2 rounded border mb-3 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                rows="3"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="submit" disabled={loading} className="px-3 py-1.5 bg-scribe-green text-white rounded text-xs hover:bg-scribe-sage transition">
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-6 text-center">
                            {profile.bio && (
                                <p className={`text-sm mb-3 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                                    {profile.bio}
                                </p>
                            )}

                            <div className={`flex flex-wrap justify-center gap-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {profile.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.occupation && (
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-3 h-3" />
                                        <span>{profile.occupation}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Joined {new Date(profile.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className={`mt-2 flex items-center justify-center gap-4 text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <span>{profile.followerCount || 0} <span className="font-normal text-gray-500">followers</span></span>
                                <span>{profile.subscriberCount || 0} <span className="font-normal text-gray-500">subscribers</span></span>
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-center gap-3 mt-3">
                                {profile.socialLinks?.twitter && (
                                    <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                )}
                                {profile.socialLinks?.github && (
                                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                        <Github className="w-4 h-4" />
                                    </a>
                                )}
                                {profile.socialLinks?.linkedin && (
                                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                                {profile.socialLinks?.website && (
                                    <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                        <LinkIcon className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className={`flex items-center justify-center gap-6 border-b mb-6 overflow-x-auto ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        {['Activity', 'Posts', 'Likes', 'Reads'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`pb-2 px-1 text-sm font-medium transition whitespace-nowrap ${activeTab === tab.toLowerCase()
                                    ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                                    : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {tab}
                                {tab === 'Reads' && isOwnProfile && ' (12)'}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-4 pb-20">
                        {activeTab === 'activity' && (
                            <div className="space-y-4">
                                {/* Activity Input - Only for own profile */}
                                {isOwnProfile && (
                                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                        <img
                                            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.displayName}`}
                                            className="w-8 h-8 rounded-full"
                                            alt="Avatar"
                                        />
                                        <input
                                            type="text"
                                            placeholder="What's on your mind?"
                                            className={`flex-1 bg-transparent border-none text-sm focus:ring-0 ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                                        />
                                    </div>
                                )}

                                {activity.length > 0 ? (
                                    activity.map((item, index) => (
                                        <div key={index} className={`p-4 rounded-lg border ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                                            <div className="flex gap-2 mb-2">
                                                <div className="w-6 h-6 rounded-full bg-scribe-green text-white flex items-center justify-center text-[10px]">
                                                    {profile.displayName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        {item.type === 'post' ? 'Posted' : 'Commented'} <span className="text-gray-400">· {new Date(item.createdAt).toLocaleDateString()}</span>
                                                    </p>
                                                    {item.type === 'comment' && item.data.blogId && (
                                                        <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                            on <span className="font-medium">{item.data.blogId.title}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`mb-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {item.type === 'post' ? item.data.title : item.data.content}
                                            </p>
                                            {item.type === 'post' && (
                                                <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    <span className="flex items-center gap-1"><span className="text-red-500">♥</span> {item.data.likescount || 0}</span>
                                                    <span>💬 {item.data.commentscount || 0}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className={`text-center py-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        No recent activity.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'posts' && (
                            <div>
                                {myPosts.length > 0 ? (
                                    myPosts.map(post => (
                                        <div key={post._id} className={`p-4 rounded-lg border mb-3 cursor-pointer hover:shadow-md transition ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                                            <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                                            <p className={`mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{post.excerpt}</p>
                                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {new Date(post.publishedAt).toLocaleDateString()} · {post.readTime} min read
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={`text-center py-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        No posts yet.
                                    </div>
                                )}
                            </div>
                        )}

                        {(activeTab === 'likes' || activeTab === 'reads') && (
                            <div className={`text-center py-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                No {activeTab} yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
