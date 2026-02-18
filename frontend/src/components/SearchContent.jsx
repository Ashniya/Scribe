import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, UserPlus, UserCheck, Loader, Heart, Bookmark, MessageSquare, MoreVertical, FileText } from 'lucide-react';
import { searchUsers, searchBlogs, followUser, unfollowUser } from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function SearchContent({ initialQuery = '', onArticleClick }) {
    const navigate = useNavigate();
    const { isDark } = useContext(ThemeContext);
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [userResults, setUserResults] = useState([]);
    const [blogResults, setBlogResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [followingIds, setFollowingIds] = useState(new Set());
    const [activeTab, setActiveTab] = useState('all'); // all, people, stories

    // Update internal state when prop changes
    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    // Debounce search
    useEffect(() => {
        setActiveTab('all'); // Reset tab when query changes
        if (searchQuery.length >= 2) {
            const timer = setTimeout(() => {
                handleSearch();
            }, 500); // Wait 500ms after user stops typing

            return () => clearTimeout(timer);
        } else {
            setUserResults([]);
            setBlogResults([]);
        }
    }, [searchQuery]);

    const handleSearch = async () => {
        if (searchQuery.length < 2) {
            setUserResults([]);
            setBlogResults([]);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Run searches in parallel
            const [userData, blogData] = await Promise.all([
                searchUsers(searchQuery).catch(err => {
                    console.error('User search error:', err);
                    return { users: [] };
                }),
                searchBlogs(searchQuery).catch(err => {
                    console.error('Blog search error:', err);
                    return { data: [] };
                })
            ]);


            setUserResults(userData.users || []);
            setBlogResults(blogData.data || []);

        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to complete search');
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            await followUser(userId);
            setFollowingIds(prev => new Set([...prev, userId]));
        } catch (err) {
            console.error('Follow error:', err);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await unfollowUser(userId);
            setFollowingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        } catch (err) {
            console.error('Unfollow error:', err);
        }
    };

    const handleViewProfile = (username) => {
        navigate(`/profile/${username}`);
    };

    const handleArticleClick = (blogId) => {
        if (onArticleClick) {
            onArticleClick(blogId);
        }
    };

    const hasResults = userResults.length > 0 || blogResults.length > 0;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} py-8`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">

                {/* Header */}




                {/* Tabs */}
                {hasResults && (
                    <div className={`flex gap-6 mb-8 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-3 px-1 font-medium transition ${activeTab === 'all'
                                ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                                : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveTab('people')}
                            className={`pb-3 px-1 font-medium transition ${activeTab === 'people'
                                ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                                : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            People ({userResults.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('stories')}
                            className={`pb-3 px-1 font-medium transition ${activeTab === 'stories'
                                ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                                : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Stories ({blogResults.length})
                        </button>
                    </div>
                )}

                {/* Results */}
                {/* Results */}
                <div>
                    {loading && !hasResults ? (
                        <div className="text-center py-12">
                            <Loader className="w-12 h-12 mx-auto mb-4 text-scribe-green animate-spin" />
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Searching...</p>
                        </div>
                    ) : !hasResults && searchQuery.length >= 2 && !loading ? (
                        <div className="text-center py-12">
                            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                No results found
                            </p>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Try completely different keywords
                            </p>
                        </div>
                    ) : !hasResults && searchQuery.length < 2 ? null : (
                        <div className="space-y-12">
                            {/* People Section */}
                            {(activeTab === 'all' || activeTab === 'people') && (
                                userResults.length > 0 ? (
                                    <div>
                                        {(activeTab === 'all') && <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>People</h3>}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {userResults.map((user) => (
                                                <UserCard
                                                    key={user._id || user.id}
                                                    user={user}
                                                    isFollowing={followingIds.has(user._id || user.id)}
                                                    onFollow={() => handleFollow(user._id || user.id)}
                                                    onUnfollow={() => handleUnfollow(user._id || user.id)}
                                                    onViewProfile={() => handleViewProfile(user.username)}
                                                    isDark={isDark}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (activeTab === 'people') && (
                                    <div className="text-center py-12">
                                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No people found matching "{searchQuery}"</p>
                                    </div>
                                )
                            )}

                            {/* Stories Section */}
                            {(activeTab === 'all' || activeTab === 'stories') && (
                                blogResults.length > 0 ? (
                                    <div>
                                        {(activeTab === 'all') && <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Stories</h3>}
                                        <div className="space-y-6">
                                            {blogResults.map((blog) => (
                                                <BlogResultCard
                                                    key={blog._id}
                                                    blog={blog}
                                                    isDark={isDark}
                                                    onClick={() => handleArticleClick(blog._id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (activeTab === 'stories') && (
                                    <div className="text-center py-12">
                                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No stories found matching "{searchQuery}"</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// User Card Component
function UserCard({ user, isFollowing, onFollow, onUnfollow, onViewProfile, isDark }) {
    return (
        <div className={`p-4 rounded-xl border transition hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3">
                <button onClick={onViewProfile} className="flex-shrink-0">
                    <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`}
                        alt={user.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </button>
                <div className="flex-1 min-w-0">
                    <button onClick={onViewProfile} className="text-left w-full truncate">
                        <h4 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.displayName}</h4>
                        <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>@{user.username}</p>
                    </button>
                </div>
                <div className="flex-shrink-0">
                    {isFollowing ? (
                        <button
                            onClick={onUnfollow}
                            className={`p-2 rounded-full transition ${isDark ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            title="Unfollow"
                        >
                            <UserCheck className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={onFollow}
                            className={`p-2 rounded-full transition ${isDark ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            title="Follow"
                        >
                            <UserPlus className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple Blog Result Card
function BlogResultCard({ blog, isDark, onClick }) {
    return (
        <div onClick={onClick} className={`flex gap-4 cursor-pointer group`}>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <img
                        src={blog.authorPhotoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.authorName)}`}
                        alt={blog.authorName}
                        className="w-5 h-5 rounded-full"
                    />
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{blog.authorName}</span>
                    <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>in {blog.category}</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 group-hover:underline decoration-glide ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {blog.title}
                </h3>
                <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {blog.excerpt}
                </p>
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(blog.publishedAt).toLocaleDateString()} · {blog.readTime} min read
                </div>
            </div>
            {blog.coverImage && (
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-24 h-24 sm:w-32 sm:h-24 object-cover rounded-lg flex-shrink-0"
                />
            )}
        </div>
    );
}
