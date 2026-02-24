import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { auth } from '../config/firebase.js';
import { createSlug } from '../utils/slug';
import { getFollowing } from '../utils/api';
import Editor from '../components/Editor';
import ArticleView from '../components/ArticleView';
import ProfileSettings from '../components/ProfileSettings';
import SettingsPage from '../components/Settingspage';

import LoginPromptModal from '../components/LoginPromptModal';
import FollowingPreferencesModal from '../components/FollowingPreferencesModal';
import Onboarding from '../components/Onboarding';
import ProfileContent from '../components/ProfileContent';
import StatsContent from '../components/StatsContent';
import SearchContent from '../components/SearchContent';
import MessagesContent from '../components/MessagesContent';
import { saveBlog, getBlogById } from '../utils/api';
import { getOrCreateConversation } from '../utils/messageapi';
import {
  Home,
  PenTool,
  BookOpen,
  TrendingUp,
  Heart,
  Bookmark,
  Settings,
  LogOut,
  Search,
  Eye,
  MessageSquare,
  Users,
  Bell,
  Edit3,
  BarChart3,
  Feather,
  ChevronRight,
  Menu,
  X,
  User,
  MoreVertical,
  UserPlus,
  VolumeX,
  Flag,
  Trash2,
  FileText,
  Sun,
  Moon,
  LogIn
} from 'lucide-react';

// ─── Animations ───────────────────────────────────────────────────────────────
const animStyles = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideInLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes folderOpen {
  from { opacity: 0; transform: scaleY(0.9) translateY(-8px); }
  to   { opacity: 1; transform: scaleY(1) translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.anim-fade-slide  { animation: fadeSlideIn 0.42s cubic-bezier(.16,1,.3,1) both; }
.anim-slide-left  { animation: fadeSlideInLeft 0.38s cubic-bezier(.16,1,.3,1) both; }
.anim-folder-open { animation: folderOpen 0.28s cubic-bezier(.16,1,.3,1) both; transform-origin: top; }
.anim-scale-in    { animation: scaleIn 0.35s cubic-bezier(.16,1,.3,1) both; }

/* Invisible until scroll-triggered */
.reveal-box { opacity: 0; transform: translateY(24px); transition: opacity 0.55s cubic-bezier(.16,1,.3,1), transform 0.55s cubic-bezier(.16,1,.3,1); }
.reveal-box.visible { opacity: 1; transform: translateY(0); }

/* Hover lift card */
.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.15); }
`;
if (typeof document !== 'undefined' && !document.getElementById('scribe-anims')) {
  const s = document.createElement('style');
  s.id = 'scribe-anims';
  s.textContent = animStyles;
  document.head.appendChild(s);
}


export default function Dashboard({ initialSection = 'home' }) {
  const { currentUser, mongoUser, signOut } = useAuth();
  const { isDark, setIsDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('for-you');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(location.state?.section || initialSection);
  const [initialConversationId, setInitialConversationId] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingLoading, setFollowingLoading] = useState(false);

  // Section → URL mapping
  const sectionToUrl = {
    home: '/dashboard',
    library: '/dashboard/library',
    profile: '/dashboard/profile',
    stories: '/dashboard/stories',
    stats: '/dashboard/stats',
    following: '/dashboard/following',
    favorites: '/dashboard/favorites',
    collections: '/dashboard/collections',
    notifications: '/dashboard/notifications',
    messages: '/dashboard/messages',
    settings: '/dashboard/settings',
    search: '/dashboard/search'
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    const url = sectionToUrl[section] || '/dashboard';
    // Use pushState instead of navigate to avoid remounting the Dashboard component
    window.history.pushState({}, '', url);
  };

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/dashboard') {
        setActiveSection('home');
      } else if (path.startsWith('/dashboard/')) {
        const section = path.replace('/dashboard/', '');
        const validSections = Object.keys(sectionToUrl);
        if (validSections.includes(section)) {
          setActiveSection(section);
        } else {
          setActiveSection('home');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Handle conversation ID from state (when clicking Message button)
    if (location.state?.conversationId) {
      setActiveSection('messages');
      setInitialConversationId(location.state.conversationId);
      // Clear state to prevent re-triggering
      window.history.replaceState({}, document.title);
    } else if (location.state?.section) {
      setActiveSection(location.state.section);
    } else if (initialSection) {
      setActiveSection(initialSection);
    }

    if (location.state?.startChatWith) {
      // Handle start chat request from profile page
      const targetUser = location.state.startChatWith;
      if (targetUser?._id) {
        handleMessageUser(targetUser._id);
        // Clear state to prevent re-triggering on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, initialSection]);

  // Fetch following users when that section is active
  useEffect(() => {
    if (activeSection === 'following' && mongoUser?.username) {
      setFollowingLoading(true);
      getFollowing(mongoUser.username)
        .then(res => {
          if (res.success) {
            setFollowingUsers(res.users || res.data || []);
          }
        })
        .catch(err => console.error('Failed to fetch following:', err))
        .finally(() => setFollowingLoading(false));
    }
  }, [activeSection, mongoUser?.username]);

  const [showEditor, setShowEditor] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0
  });
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [staffPicks, setStaffPicks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingAuthor, setFollowingAuthor] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Get the correct avatar URL - prioritize MongoDB user data
  const getAvatarUrl = () => {
    return mongoUser?.photoURL || currentUser?.photoURL || null;
  };

  // Get display name
  const getDisplayName = () => {
    return mongoUser?.displayName || currentUser?.displayName || 'Writer';
  };

  // Get initials for fallback avatar
  const getInitials = () => {
    const name = getDisplayName();
    return name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?';
  };

  // Check onboarding status when user loads
  useEffect(() => {
    if (currentUser) {
      const completed = localStorage.getItem('onboardingComplete');
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, [currentUser]);

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

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(true);
  };

  const handleLike = async (blogId) => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const userIdStr = mongoUser?._id ? String(mongoUser._id) : null;

        setBlogs(prev => prev.map(b =>
          b._id === blogId
            ? {
              ...b,
              likes: data.data.isLiked
                ? [...(b.likes || []), userIdStr].filter((v, i, a) => v && String(a.indexOf(v)) === String(i))
                : (b.likes || []).filter(id => String(id) !== userIdStr),
              likescount: data.data.likes,
              claps: data.data.likes // Ensure count stays in sync
            }
            : b
        ));

        // CRITICAL: Update selectedArticle so the modal reflects the new state immediately
        if (selectedArticle && selectedArticle._id === blogId) {
          setSelectedArticle(prev => ({
            ...prev,
            likes: data.data.isLiked
              ? [...(prev.likes || []), userIdStr].filter((v, i, a) => v && String(a.indexOf(v)) === String(i))
              : (prev.likes || []).filter(id => String(id) !== userIdStr),
            likescount: data.data.likes,
            claps: data.data.likes // Sync claps field used in ArticleView
          }));
        }
        loadStats();
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/blogs/user/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const [savedBlogs, setSavedBlogs] = useState(() => {
    // Initialize from mongoUser.savedPosts (server-side) or fall back to localStorage
    if (mongoUser?.savedPosts?.length) {
      return mongoUser.savedPosts.map(id => id.toString());
    }
    try { return JSON.parse(localStorage.getItem('savedBlogs') || '[]'); } catch { return []; }
  });

  // Sync savedBlogs from server when mongoUser loads asynchronously
  useEffect(() => {
    if (mongoUser?.savedPosts?.length) {
      const serverSaved = mongoUser.savedPosts.map(id => id.toString());
      setSavedBlogs(serverSaved);
      localStorage.setItem('savedBlogs', JSON.stringify(serverSaved));
    }
  }, [mongoUser?.savedPosts]);

  const handleSave = async (blogId) => {
    try {
      const res = await saveBlog(blogId);
      if (res.success) {
        setSavedBlogs(prev => {
          const updated = res.data.isSaved
            ? [...prev, blogId]
            : prev.filter(id => id !== blogId);
          localStorage.setItem('savedBlogs', JSON.stringify(updated));
          return updated;
        });

        if (selectedArticle && selectedArticle._id === blogId) {
          setSelectedArticle(prev => ({
            ...prev,
            isSaved: res.data.isSaved
          }));
        }
        // Refresh local user stats after a save
        loadStats();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.filter(b => b._id !== blogId));
        setMyBlogs(prev => prev.filter(b => b._id !== blogId));
        alert('Story deleted successfully!');
      } else {
        alert('Failed to delete story: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  const handleEdit = (blog) => {
    console.log('handleEdit called with blog:', blog);
    setEditingBlog(blog);
    setSelectedArticle(null); // Clear viewing state to show editor
    setShowEditor(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await fetch('http://localhost:5000/api/blogs');
        const blogsData = await blogsRes.json();
        if (blogsData.success) {
          setBlogs(blogsData.data);
        }

        const token = await getToken();
        if (token) {
          const myBlogsRes = await fetch('http://localhost:5000/api/blogs/user/my-blogs', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const myBlogsData = await myBlogsRes.json();
          if (myBlogsData.success) {
            setMyBlogs(myBlogsData.data);
          }

          await loadStats();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showEditor, currentUser]);

  useEffect(() => {
    if (blogs.length > 0) {
      const topPicks = [...blogs]
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 3)
        .map(blog => ({
          id: blog._id,
          title: blog.title,
          author: blog.authorName,
          authorUsername: blog.authorId?.username, // New field for routing
          image: blog.authorId?.photoURL || blog.authorPhotoURL || null,
          time: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          blog: blog
        }));
      setStaffPicks(topPicks);
    }
  }, [blogs]);

  const handleMessageUser = async (userId) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const res = await getOrCreateConversation(userId);
      if (res.success) {
        // Navigate with state instead of URL param
        navigate('/dashboard', {
          state: {
            section: 'messages',
            conversationId: res.data._id
          },
          replace: true  // Replace history so back button works nicely
        });
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Could not start conversation. Please try again.');
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'library':
        return <LibrarySection blogs={blogs} isDark={isDark} onArticleClick={(blog) => {
          if (!currentUser) {
            setShowLoginPrompt(true);
          } else {
            setSelectedArticle(blog);
          }
        }} />;
      case 'profile':
        return <ProfileContent onMessage={handleMessageUser} />;
      case 'messages':
        return <MessagesContent initialConversationId={initialConversationId} />;
      case 'stories':
        return (
          <div className="max-w-4xl mx-auto py-12">
            <h2 className={`text-3xl font-bold mb-8 anim-fade-slide ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stories</h2>
            {myBlogs.length === 0 ? (
              <div className="text-center py-20 anim-fade-slide">
                <PenTool className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-gray-500 mb-6`}>You haven't published any stories yet</p>
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-6 py-3 bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-medium rounded-full hover:shadow-lg transition"
                >
                  Write your first story
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {myBlogs.map((blog, idx) => (
                  <div
                    key={blog._id}
                    className={`p-6 rounded-xl border hover:shadow-lg transition-all duration-300 anim-fade-slide ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0" onClick={() => setSelectedArticle(blog)} style={{ cursor: 'pointer' }}>
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${isDark ? 'bg-slate-700 text-scribe-mint' : 'bg-green-50 text-scribe-green'
                          }`}>{blog.category || 'General'}</span>
                        <h3 className={`text-xl font-bold mb-1 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {blog.title}
                        </h3>
                        <p className={`mb-3 text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {blog.excerpt}
                        </p>
                        <div className={`flex flex-wrap items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>{blog.readTime} min read</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {blog.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {blog.likes?.length || 0}
                          </span>
                        </div>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this story? This cannot be undone.')) {
                            await handleDelete(blog._id);
                          }
                        }}
                        title="Delete story"
                        className={`flex-shrink-0 p-2 rounded-lg transition-colors group ${isDark
                          ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'stats':
        return <StatsContent />;
      case 'search':
        return <SearchContent
          initialQuery={searchQuery}
          onArticleClick={async (blogId) => {
            const found = blogs.find(b => b._id === blogId);
            if (found) {
              setSelectedArticle(found);
            } else {
              try {
                const res = await getBlogById(blogId);
                if (res.success) {
                  setSelectedArticle(res.data);
                }
              } catch (err) {
                console.error('Failed to load article:', err);
              }
            }
          }}
        />;
      case 'following':
        return (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="w-6 h-6 inline mr-2 text-scribe-green" />
              Following
            </h2>
            {followingLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-scribe-green"></div>
              </div>
            ) : followingUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You're not following anyone yet</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Follow writers to see their content here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {followingUsers.map(user => (
                  <div
                    key={user._id}
                    onClick={() => navigate(`/@${user.username}`)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:shadow-md transition ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold">
                        {user.displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.displayName}
                      </h3>
                      <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className={`text-xs mt-1 line-clamp-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'favorites': {
        const likedBlogs = blogs.filter(b => b.likes?.includes(mongoUser?._id));
        return (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Heart className="w-6 h-6 inline mr-2 text-red-500" />
              Favorites
            </h2>
            {likedBlogs.length === 0 ? (
              <div className="text-center py-16">
                <Heart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No liked articles yet</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Click the ❤️ on articles you enjoy
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {likedBlogs.map((blog) => (
                  <ArticleCard
                    key={blog._id}
                    article={{
                      id: blog._id,
                      title: blog.title,
                      excerpt: blog.excerpt,
                      author: blog.authorName,
                      authorId: blog.authorId?._id || blog.authorId,
                      authorUsername: blog.authorId?.username,
                      authorImage: blog.authorId?.photoURL || blog.authorPhotoURL || null,
                      category: blog.category,
                      image: blog.coverImage,
                      readTime: `${blog.readTime} min read`,
                      date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      claps: blog.likes?.length || 0,
                      comments: blog.commentscount || 0,
                      views: blog.views,
                      isLiked: true,
                      isSaved: savedBlogs.includes(blog._id),
                      authorEmail: blog.authorEmail
                    }}
                    isDark={isDark}
                    onProtectedAction={handleProtectedAction}
                    onLike={() => handleLike(blog._id)}
                    onSave={() => handleSave(blog._id)}
                    onArticleClick={() => setSelectedArticle(blog)}
                    onFollowAuthor={setFollowingAuthor}
                    currentUser={currentUser}
                    onDelete={handleDelete}
                    onEdit={() => handleEdit(blog)}
                    setShowLoginPrompt={setShowLoginPrompt}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }
      case 'collections': {
        const collectionBlogs = blogs.filter(b => savedBlogs.includes(b._id));
        return (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Bookmark className="w-6 h-6 inline mr-2 text-scribe-green" />
              Collections
            </h2>
            {collectionBlogs.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No saved articles yet</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Click the 🔖 bookmark on articles to save them
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {collectionBlogs.map((blog) => (
                  <ArticleCard
                    key={blog._id}
                    article={{
                      id: blog._id,
                      title: blog.title,
                      excerpt: blog.excerpt,
                      author: blog.authorName,
                      authorId: blog.authorId?._id || blog.authorId,
                      authorUsername: blog.authorId?.username,
                      authorImage: blog.authorId?.photoURL || blog.authorPhotoURL || null,
                      category: blog.category,
                      image: blog.coverImage,
                      readTime: `${blog.readTime} min read`,
                      date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      claps: blog.likes?.length || 0,
                      comments: blog.commentscount || 0,
                      views: blog.views,
                      isLiked: blog.likes?.includes(mongoUser?._id),
                      isSaved: true,
                      authorEmail: blog.authorEmail
                    }}
                    isDark={isDark}
                    onProtectedAction={handleProtectedAction}
                    onLike={() => handleLike(blog._id)}
                    onSave={() => handleSave(blog._id)}
                    onArticleClick={() => setSelectedArticle(blog)}
                    onFollowAuthor={setFollowingAuthor}
                    currentUser={currentUser}
                    onDelete={handleDelete}
                    setShowLoginPrompt={setShowLoginPrompt}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }
      case 'notifications':
        return (
          <div className="text-center py-20">
            <Bell className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h2>
            <p className={`text-gray-500`}>No new notifications</p>
          </div>
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  if (showEditor) {
    return (
      <Editor
        onClose={() => {
          setShowEditor(false);
          setEditingBlog(null);
        }}
        isDark={isDark}
        editData={editingBlog}
      />
    );
  }

  if (selectedArticle) {
    return (
      <ArticleView
        article={selectedArticle}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onClose={() => setSelectedArticle(null)}
        onLike={() => handleLike(selectedArticle._id)}
        onSave={() => handleSave(selectedArticle._id)}
        isLiked={Boolean((mongoUser?._id || currentUser?._id) && selectedArticle.likes?.map(String).includes(String(mongoUser?._id || currentUser?._id)))}
        isSaved={savedBlogs.includes(selectedArticle._id)}
        currentUser={currentUser}
        onEdit={(blog) => handleEdit(blog || selectedArticle)}
        onDelete={(id) => {
          handleDelete(id || selectedArticle._id);
          setSelectedArticle(null);
        }}
      />
    );
  }

  if (showOnboarding) {
    return (
      <Onboarding
        isDark={isDark}
        onComplete={(selectedTopics) => {
          console.log('User selected topics:', selectedTopics);
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <>
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        isDark={isDark}
      />

      {followingAuthor && (
        <FollowingPreferencesModal
          author={followingAuthor}
          isDark={isDark}
          onClose={() => setFollowingAuthor(null)}
          onSave={(preferences) => {
            if (preferences.isUnfollowing) {
              alert(`Unfollowed ${followingAuthor.name}`);
            } else {
              alert(`Following ${followingAuthor.name} with email notifications ${preferences.emailNotifications}`);
            }
            setFollowingAuthor(null);
          }}
        />
      )}

      <div
        className={`min-h-screen ${isDark ? 'dark bg-slate-900' : 'bg-white'} transition-colors duration-300 ${showLoginPrompt ? 'blur-sm pointer-events-none' : ''}`}
        onClick={() => {
          if (!currentUser) {
            setShowLoginPrompt(true);
          }
        }}
      >
        <div className="flex">
          {/* Sidebar */}
          <aside className={`w-64 min-h-screen flex flex-col fixed top-0 left-0 border-r transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
            {/* Logo */}
            <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Feather className={`w-7 h-7 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                <h1 className={`text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Scribe</h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-0 py-6">
              <NavItem icon={Home} label="Home" active={activeSection === 'home'} onClick={() => handleSectionChange('home')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={BookOpen} label="Library" active={activeSection === 'library'} onClick={() => handleSectionChange('library')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={Users} label="Profile" active={activeSection === 'profile'} onClick={() => handleSectionChange('profile')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={PenTool} label="Stories" active={activeSection === 'stories'} onClick={() => handleSectionChange('stories')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={BarChart3} label="Stats" active={activeSection === 'stats'} onClick={() => handleSectionChange('stats')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />

              <div className={`h-px my-6 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>

              <NavItem icon={TrendingUp} label="Following" active={activeSection === 'following'} onClick={() => handleSectionChange('following')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={Heart} label="Favorites" active={activeSection === 'favorites'} onClick={() => handleSectionChange('favorites')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={Bookmark} label="Collections" active={activeSection === 'collections'} onClick={() => handleSectionChange('collections')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={Bell} label="Notifications" active={activeSection === 'notifications'} onClick={() => handleSectionChange('notifications')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={MessageSquare} label="Messages" active={activeSection === 'messages'} onClick={() => handleSectionChange('messages')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
              <NavItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => handleSectionChange('settings')} isDark={isDark} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
            </nav>

            {/* User Info & Logout */}
            <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3 px-2">
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()}
                    alt={getDisplayName()}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {getDisplayName()}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full transition text-sm font-medium border ${isDark ? 'border-slate-600 text-gray-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            {/* Top Bar */}
            <div className={`sticky top-0 z-10 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                      aria-label="Toggle sidebar"
                    >
                      {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="flex-1 max-w-2xl">
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSectionChange('search');
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2 rounded-full border transition ${isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-slate-600'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-300'
                            } focus:outline-none`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <button
                      onClick={() => handleProtectedAction(() => setShowEditor(true))}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-medium rounded-full hover:shadow-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                      Write
                    </button>

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
                      <span className={`absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isDark ? 'Turn on' : 'Turn off'}
                      </span>
                    </button>

                    {currentUser ? (
                      <div className="relative">
                        <button
                          onClick={() => setShowProfileMenu(!showProfileMenu)}
                          className="w-8 h-8 rounded-full hover:ring-2 ring-scribe-sage transition-all focus:outline-none overflow-hidden"
                        >
                          {getAvatarUrl() ? (
                            <img
                              src={getAvatarUrl()}
                              alt={getDisplayName()}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-scribe-green font-bold text-lg">${getInitials()}</div>`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials()}
                            </div>
                          )}
                        </button>

                        {showProfileMenu && (
                          <div className={`absolute right-0 top-full mt-2 w-48 py-2 rounded-xl shadow-xl border transform origin-top-right transition-all animate-fadeIn ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                              <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {getDisplayName()}
                              </p>
                              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {currentUser?.email}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setShowProfileMenu(false);
                                handleProtectedAction(() => handleSectionChange('profile'));
                              }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </button>
                            <button
                              onClick={() => {
                                setShowProfileMenu(false);
                                handleProtectedAction(() => handleSectionChange('settings'));
                              }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </button>
                            <div className={`h-px my-1 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}></div>
                            <button
                              onClick={() => {
                                setShowProfileMenu(false);
                                handleLogout();
                              }}
                              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <LogOut className="w-4 h-4" />
                              Log Out
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:ring-2 ring-scribe-green transition"
                      >
                        <User className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area - keeping all the feed logic from original */}
            <div className="max-w-7xl mx-auto px-8 py-8">
              {renderSectionContent() || (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Feed content here - shortened for brevity, use your original feed code */}
                  <div className="lg:col-span-2">
                    <div className={`flex gap-6 mb-8 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                      <button
                        onClick={() => setActiveTab('for-you')}
                        className={`pb-3 px-1 font-medium transition ${activeTab === 'for-you'
                          ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                          : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        For you
                      </button>
                      <button
                        onClick={() => setActiveTab('featured')}
                        className={`pb-3 px-1 font-medium transition ${activeTab === 'featured'
                          ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                          : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        Featured
                      </button>
                      <button
                        onClick={() => setActiveTab('following')}
                        className={`pb-3 px-1 font-medium transition ${activeTab === 'following'
                          ? `border-b-2 ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                          : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        Following
                      </button>
                    </div>

                    {/* Articles */}
                    <div className="space-y-8">
                      {loading ? (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Loading articles...
                        </div>
                      ) : blogs.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          No articles yet. Be the first to publish!
                        </div>
                      ) : (() => {
                        // Filter by category first
                        let filteredBlogs = categoryFilter
                          ? blogs.filter(b => b.category === categoryFilter)
                          : blogs;

                        // Filter by Search Query
                        if (searchQuery) {
                          filteredBlogs = filteredBlogs.filter(b =>
                            (b.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (b.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                          );
                        }

                        // Then filter by active tab
                        if (activeTab === 'featured') {
                          // Sort by views and likes for featured
                          filteredBlogs = [...filteredBlogs].sort((a, b) => {
                            const scoreA = (a.views || 0) + (a.likes?.length || 0) * 10;
                            const scoreB = (b.views || 0) + (b.likes?.length || 0) * 10;
                            return scoreB - scoreA;
                          });
                        } else if (activeTab === 'following') {
                          // For now, show empty state for following
                          return (
                            <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                              <p className="text-lg mb-2">Follow authors to see their stories here</p>
                              <p className="text-sm">Click the three dots on any article and select "Follow author"</p>
                            </div>
                          );
                        }
                        // 'for-you' shows all (default)

                        return filteredBlogs.length === 0 ? (
                          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <p className="mb-2">No articles found in "{categoryFilter}"</p>
                            <button
                              onClick={() => setCategoryFilter(null)}
                              className="text-scribe-green hover:text-scribe-sage text-sm underline"
                            >
                              Show all articles
                            </button>
                          </div>
                        ) : (
                          <>
                            {categoryFilter && (
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Showing {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} in <strong className={isDark ? 'text-white' : 'text-gray-900'}>{categoryFilter}</strong>
                              </div>
                            )}
                            {filteredBlogs.map((blog) => (
                              <ArticleCard key={blog._id} article={{
                                _id: blog._id,
                                id: blog._id,
                                title: blog.title,
                                excerpt: blog.excerpt,
                                author: blog.authorName, // Display Name
                                authorId: blog.authorId?._id || blog.authorId, // User ID
                                authorUsername: blog.authorId?.username, // Add Username for linking
                                authorImage: blog.authorPhotoURL || currentUser?.photoURL || null,
                                authorEmail: blog.authorEmail,
                                category: blog.category,
                                image: blog.coverImage,
                                readTime: `${blog.readTime} min read`,
                                date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                claps: blog.likes?.length || blog.likescount || 0,
                                comments: blog.commentscount || 0,
                                views: blog.views,
                                isLiked: mongoUser?._id && blog.likes?.map(id => String(id)).includes(String(mongoUser._id)),
                                isSaved: savedBlogs.includes(blog._id)
                              }} isDark={isDark} onProtectedAction={handleProtectedAction} onLike={() => handleLike(blog._id)} onSave={() => handleSave(blog._id)} onArticleClick={() => {
                                // Navigate to article page using simple ID route
                                navigate(`/article/${blog._id}`);
                              }} onFollowAuthor={setFollowingAuthor} currentUser={currentUser} onDelete={handleDelete} onEdit={() => handleEdit(blog)} setShowLoginPrompt={setShowLoginPrompt} />
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  {/* Right Column - Sidebar */}
                  <div className="space-y-8">
                    {/* Stats Card */}
                    {currentUser && (
                      <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                        <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stats</h3>
                        <div className="space-y-3">
                          <StatRow icon={BookOpen} label="Posts" value={stats.totalPosts} isDark={isDark} />
                          <StatRow icon={Eye} label="Views" value={stats.totalViews.toLocaleString()} isDark={isDark} />
                          <StatRow icon={Heart} label="Likes" value={stats.totalLikes.toLocaleString()} isDark={isDark} />
                          <StatRow icon={Users} label="Followers" value={stats.followers} isDark={isDark} />
                        </div>
                      </div>
                    )}

                    {/* Staff Picks */}
                    <div>
                      <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Staff Picks</h3>
                      <div className="space-y-4">
                        {staffPicks.length > 0 ? (
                          staffPicks.map((pick) => (
                            <StaffPickCard key={pick.id} pick={pick} isDark={isDark} onArticleClick={setSelectedArticle} currentUser={currentUser} setShowLoginPrompt={setShowLoginPrompt} />
                          ))
                        ) : (
                          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            No staff picks yet. Like articles to see them featured here!
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Topics */}
                    <div>
                      <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recommended topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {['General', 'Technology', 'Health', 'Writing', 'Productivity'].map((topic) => (
                          <button
                            key={topic}
                            onClick={() => setCategoryFilter(categoryFilter === topic ? null : topic)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${categoryFilter === topic
                              ? 'bg-gradient-to-r from-scribe-green to-scribe-sage text-white'
                              : isDark
                                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                      {categoryFilter && (
                        <button
                          onClick={() => setCategoryFilter(null)}
                          className={`mt-3 text-xs ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          Clear filter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// Components
function NavItem({ icon: Icon, label, active, badge, onClick, isDark, iconOnly, currentUser, setShowLoginPrompt }) {
  if (iconOnly) {
    return (
      <button
        onClick={onClick}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 group relative ${active
          ? isDark ? 'text-white bg-slate-800 scale-105' : 'text-gray-900 bg-gray-100 scale-105'
          : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-800 hover:scale-110' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:scale-110'
          }`}
        title={label}
      >
        <Icon className="w-6 h-6" strokeWidth={1.5} />
        {badge && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        if (!currentUser && label !== 'Home' && label !== 'Library') {
          e.preventDefault();
          setShowLoginPrompt(true);
          return;
        }
        onClick();
      }}
      className={`w-full flex items-center gap-4 px-6 py-3 relative group transition-all duration-200 overflow-hidden ${active
        ? isDark ? 'text-white' : 'text-gray-900'
        : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
        }`}
    >
      {/* Active indicator bar */}
      {active && (
        <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-300 ${isDark ? 'bg-emerald-400' : 'bg-scribe-green'
          } anim-scale-in`} />
      )}
      {/* Hover background */}
      <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isDark ? 'bg-slate-800' : 'bg-gray-50'
        } ${active ? 'opacity-100' : ''}`} />
      <Icon className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.5} />
      <span className="font-normal text-base flex-1 text-left relative z-10">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full relative z-10">
          {badge}
        </span>
      )}
    </button>
  );
}

function ArticleCard({ article, isDark, onProtectedAction, onLike, onSave, onArticleClick, onFollowAuthor, currentUser, onDelete, onEdit, setShowLoginPrompt }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleArticleClick = () => {
    if (article.authorUsername) {
      // Only if we don't have Link handling it (e.g. key accessibility)
      // But below we remove onClick from container
    }
    if (onArticleClick) {
      onArticleClick();
    }
  };

  // Generate initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    onProtectedAction(() => {
      switch (action) {
        case 'follow-author':
          if (onFollowAuthor) {
            onFollowAuthor({
              name: article.author,
              photoURL: article.authorImage
            });
          }
          break;
        case 'follow-publication':
          alert(`Following ${article.category}`);
          break;
        case 'mute-author':
          alert(`Muted ${article.author}`);
          break;
        case 'mute-publication':
          alert(`Muted ${article.category}`);
          break;
        case 'report':
          alert('Report submitted. Thank you for helping keep our community safe.');
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            if (onDelete) {
              onDelete(article.id);
            }
          }
          return; // Don't wrap delete in protectedAction - user is already the author
      }
    });
  };

  const articleUrl = `/article/${article.id}`;
  const authorUrl = article.authorUsername ? `/@${article.authorUsername}` : null;

  const AuthorComponent = authorUrl ? Link : 'div';
  const ArticleComponent = Link;

  return (
    <div
      onClick={() => {
        if (!currentUser) {
          setShowLoginPrompt(true);
        }
      }}
      className={`group cursor-pointer border-b pb-8 anim-fade-slide hover-lift ${isDark ? 'border-slate-700' : 'border-gray-100'
        }`}
    >
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1 min-w-0">
          {/* Author + Menu */}
          <div className="flex items-center justify-between mb-2">
            <AuthorComponent
              to={currentUser ? authorUrl : "#"}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
              onClick={(e) => {
                if (!currentUser) {
                  e.preventDefault();
                  setShowLoginPrompt(true);
                } else if (!authorUrl) {
                  handleArticleClick();
                }
              }}
            >
              {article.authorImage ? (
                <img
                  src={article.authorImage}
                  alt={article.author}
                  className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-slate-600"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0`}
                style={{ display: article.authorImage ? 'none' : 'flex' }}
              >
                {getInitials(article.author)}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} hover:underline`}>
                  {article.author}
                </span>
                <span className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>in</span>
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{article.category}</span>
              </div>
            </AuthorComponent>
          </div>

          {/* Title - Clickable Link */}
          <ArticleComponent
            to={currentUser ? articleUrl : "#"}
            className="block cursor-pointer"
            onClick={(e) => {
              if (!currentUser) {
                e.preventDefault();
                setShowLoginPrompt(true);
              } else if (!articleUrl) {
                handleArticleClick();
              }
            }}
          >
            <h2 className={`text-xl md:text-2xl font-bold font-serif mb-1 line-clamp-2 group-hover:underline decoration-glide transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {article.title.replace(/^#+\s*|^\*+|\*+$/g, '')}
            </h2>

            {/* Excerpt */}
            <p className={`text-base font-sans mb-3 line-clamp-2 hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {article.excerpt.replace(/^#+\s*|^\*+|\*+$/g, '')}
            </p>
          </ArticleComponent>

          {/* Meta */}
          <div className="flex items-center justify-between pt-2">
            <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>{article.date}</span>

              <button
                onClick={(e) => { e.stopPropagation(); onProtectedAction(() => onLike && onLike()); }}
                className={`flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200 transition ${article.isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{(article.claps || 0).toLocaleString()}</span>
              </button>

              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{article.comments || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onProtectedAction(() => onSave && onSave()); }}
                className={`transition-colors p-1 ${article.isSaved ? 'text-scribe-green' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              >
                <Bookmark className={`w-5 h-5 ${article.isSaved ? 'fill-scribe-green text-scribe-green' : ''}`} />
              </button>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className={`transition ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 py-1 anim-folder-open" onClick={(e) => e.stopPropagation()}>
                    {currentUser && (article.authorEmail === currentUser.email) ? (
                      <>
                        <button
                          onClick={() => {
                            console.log('Edit story button clicked in ArticleView');
                            setShowMenu(false);
                            if (onEdit) {
                              console.log('Calling onEdit prop from ArticleView');
                              onEdit();
                            } else {
                              console.warn('onEdit prop is missing in ArticleView');
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit story
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                            if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
                              if (onDelete) onDelete(article._id);
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete story
                        </button>
                      </>
                    ) : null}
                    {currentUser && article.authorEmail !== currentUser.email && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction('mute-author'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">Mute author</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction('report'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">Report</button>
                      </>
                    )}
                    {!currentUser && (
                      <button onClick={(e) => { e.stopPropagation(); handleMenuAction('report'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">Report</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        {article.image && (
          <ArticleComponent
            to={currentUser ? articleUrl : "#"}
            className="cursor-pointer"
            onClick={(e) => {
              if (!currentUser) {
                e.preventDefault();
                setShowLoginPrompt(true);
              } else if (!articleUrl) {
                handleArticleClick();
              }
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-[112px] h-[112px] sm:w-[160px] sm:h-[107px] object-cover flex-shrink-0 ml-4 sm:ml-8 rounded-lg"
            />
          </ArticleComponent>
        )}
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value, isDark }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      </div>
      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

function StaffPickCard({ pick, isDark, onArticleClick, currentUser, setShowLoginPrompt }) {
  const handleClick = () => {
    if (onArticleClick && pick.blog && !pick.authorUsername) {
      onArticleClick(pick.blog);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const articleUrl = `/article/${pick.id}`;
  const authorUrl = pick.authorUsername ? `/@${pick.authorUsername}` : null;

  const AuthorComponent = authorUrl ? Link : 'div';
  const ArticleComponent = Link;

  return (
    <div onClick={(!articleUrl && !authorUrl) ? handleClick : undefined} className="flex gap-3 cursor-pointer group hover:opacity-80 transition relative">
      <AuthorComponent
        to={currentUser ? authorUrl : "#"}
        className="block flex-shrink-0"
        onClick={(e) => {
          if (!currentUser) {
            e.preventDefault();
            setShowLoginPrompt(true);
          } else if (!authorUrl) {
            handleClick();
          }
        }}
      >
        {pick.image ? (
          <img
            src={pick.image}
            alt={pick.author}
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
            {getInitials(pick.author)}
          </div>
        )}
      </AuthorComponent>
      <div className="flex-1 min-w-0">
        <ArticleComponent
          to={currentUser ? articleUrl : "#"}
          className="block"
          onClick={(e) => {
            if (!currentUser) {
              e.preventDefault();
              setShowLoginPrompt(true);
            } else if (!articleUrl) {
              handleClick();
            }
          }}
        >
          <h4 className={`text-sm font-medium mb-1 line-clamp-2 group-hover:text-scribe-green transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {pick.title}
          </h4>
        </ArticleComponent>
        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          <AuthorComponent
            to={currentUser ? authorUrl : "#"}
            className="hover:underline"
            onClick={(e) => {
              if (!currentUser) {
                e.preventDefault();
                setShowLoginPrompt(true);
              } else if (!authorUrl) {
                handleClick();
              }
            }}
          >
            <span>{pick.author}</span>
          </AuthorComponent>
          <span>·</span>
          <span>{pick.time}</span>
        </div>
      </div>
    </div>
  );
}


// ─── LibrarySection ────────────────────────────────────────────────────────────
const CATEGORY_META = {
  Technology: { emoji: '💻', color: 'from-blue-500 to-indigo-500', accent: 'bg-blue-500' },
  Culture: { emoji: '🎨', color: 'from-pink-500 to-rose-400', accent: 'bg-pink-500' },
  Health: { emoji: '🌿', color: 'from-green-500 to-emerald-400', accent: 'bg-emerald-500' },
  Science: { emoji: '🔬', color: 'from-purple-500 to-violet-500', accent: 'bg-purple-500' },
  Travel: { emoji: '✈️', color: 'from-sky-400 to-cyan-400', accent: 'bg-sky-400' },
  Food: { emoji: '🍜', color: 'from-orange-400 to-amber-400', accent: 'bg-orange-400' },
  Productivity: { emoji: '⚡', color: 'from-yellow-400 to-lime-400', accent: 'bg-yellow-400' },
  Writing: { emoji: '✍️', color: 'from-teal-400 to-cyan-400', accent: 'bg-teal-400' },
  General: { emoji: '📄', color: 'from-gray-400 to-gray-500', accent: 'bg-gray-400' },
};

function useRevealOnScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function CategoryFolder({ category, blogs, isDark, onArticleClick }) {
  const [open, setOpen] = useState(false);
  const ref = useRevealOnScroll();
  const meta = CATEGORY_META[category] || { emoji: '📁', color: 'from-scribe-sage to-scribe-mint', accent: 'bg-scribe-green' };

  return (
    <div ref={ref} className={`reveal-box rounded-2xl border overflow-hidden hover-lift ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-200 group ${isDark ? 'hover:bg-slate-700/60' : 'hover:bg-gray-50'}`}
      >
        <div className={`w-[52px] h-[52px] rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${open ? 'scale-95' : ''}`}>
          {meta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{category}</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {blogs.length} {blogs.length === 1 ? 'article' : 'articles'}
          </p>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'} ${open ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Blog list */}
      {open && (
        <div className={`border-t anim-folder-open ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
          {blogs.map((blog, i) => (
            <button
              key={blog._id}
              onClick={() => onArticleClick(blog)}
              className={`w-full flex gap-4 px-5 py-3.5 text-left group/row transition-all duration-200 border-b last:border-b-0 relative ${isDark ? 'border-slate-700/50 hover:bg-slate-700/40' : 'border-gray-50 hover:bg-gray-50/80'}`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Left hover accent */}
              <span className={`absolute left-0 top-0 bottom-0 w-0 group-hover/row:w-[3px] transition-all duration-200 rounded-r-full ${meta.accent}`} />
              {blog.coverImage ? (
                <img src={blog.coverImage} alt={blog.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0 transition-transform duration-200 group-hover/row:scale-105" />
              ) : (
                <div className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>{meta.emoji}</div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm line-clamp-1 group-hover/row:text-scribe-green transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h4>
                <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{blog.excerpt}</p>
                <div className={`flex items-center gap-2 mt-1.5 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className="font-medium">{blog.authorName}</span><span>·</span><span>{blog.readTime} min read</span>
                </div>
              </div>
              <svg className={`w-4 h-4 flex-shrink-0 self-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 -translate-x-1 group-hover/row:translate-x-0 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LibrarySection({ blogs, isDark, onArticleClick }) {
  const grouped = {};
  blogs.forEach(blog => {
    const cat = blog.category || 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(blog);
  });
  const categories = Object.keys(grouped).sort();
  const headerRef = useRevealOnScroll();

  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 anim-fade-slide">
        <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Library is empty</h2>
        <p className="text-gray-500">No published blogs yet. Start writing to fill your library!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div ref={headerRef} className="mb-8 reveal-box">
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>📚 Library</h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {blogs.length} article{blogs.length !== 1 ? 's' : ''} across {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </p>
      </div>
      <div className="space-y-4">
        {categories.map(cat => (
          <CategoryFolder key={cat} category={cat} blogs={grouped[cat]} isDark={isDark} onArticleClick={onArticleClick} />
        ))}
      </div>
    </div>
  );
}

