// frontend/src/pages/Search.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, UserPlus, UserCheck, Loader, BookOpen } from 'lucide-react';
import { searchUsers, searchBlogs, followUser, unfollowUser } from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';

export default function Search() {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [blogResults, setBlogResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';

  useEffect(() => {
    setActiveTab('all');
    if (searchQuery.length >= 2) {
      const timer = setTimeout(() => handleSearch(), 400);
      return () => clearTimeout(timer);
    } else {
      setUserResults([]);
      setBlogResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const [userData, blogData] = await Promise.all([
        searchUsers(searchQuery).catch(() => ({ users: [] })),
        searchBlogs(searchQuery).catch(() => ({ data: [] }))
      ]);
      setUserResults(userData.users || []);
      setBlogResults(blogData.data || blogData.blogs || []);
    } catch (err) {
      console.error('Search error:', err);
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
      setFollowingIds(prev => { const s = new Set(prev); s.delete(userId); return s; });
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  const hasResults = userResults.length > 0 || blogResults.length > 0;

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} pb-20`}>
        <div className="mx-auto w-full md:w-8/12 lg:w-7/12 xl:w-6/12 px-4 pt-8">

          {/* Header */}
          <h1 className={`text-3xl font-serif font-bold mb-6 ${textPrimary}`}>
            Search
          </h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search people and stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-scribe-green focus:border-transparent text-base transition
                ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            />
            {loading && (
              <Loader className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-scribe-green animate-spin" />
            )}
          </div>


          {/* Tabs - only show when results exist */}
          {hasResults && (
            <div className={`flex gap-6 mb-6 border-b ${borderColor}`}>
              {[
                { key: 'all', label: 'All' },
                { key: 'people', label: `People (${userResults.length})` },
                { key: 'stories', label: `Stories (${blogResults.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 px-1 text-sm font-medium transition border-b-2 -mb-px ${activeTab === tab.key
                    ? `border-scribe-green ${textPrimary}`
                    : `border-transparent ${textSecondary} hover:${textPrimary}`
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {loading && !hasResults ? (
            <div className="text-center py-16">
              <Loader className="w-10 h-10 mx-auto mb-3 text-scribe-green animate-spin" />
              <p className={textSecondary}>Searching...</p>
            </div>

          ) : hasResults ? (
            <div className="space-y-10">
              {/* People */}
              {(activeTab === 'all' || activeTab === 'people') && (
                userResults.length > 0 ? (
                  <div>
                    {activeTab === 'all' && (
                      <h2 className={`text-base font-semibold uppercase tracking-wider mb-4 ${textSecondary}`}>People</h2>
                    )}
                    <div className="space-y-3">
                      {userResults.map(user => (
                        <UserCard
                          key={user._id || user.id}
                          user={user}
                          isFollowing={followingIds.has(user._id || user.id)}
                          onFollow={() => handleFollow(user._id || user.id)}
                          onUnfollow={() => handleUnfollow(user._id || user.id)}
                          onViewProfile={() => navigate(`/profile/${user.username}`)}
                          isDark={isDark}
                        />
                      ))}
                    </div>
                  </div>
                ) : (activeTab === 'people') && (
                  <div className="text-center py-12">
                    <p className={textSecondary}>No people found matching "{searchQuery}"</p>
                  </div>
                )
              )}

              {/* Stories */}
              {(activeTab === 'all' || activeTab === 'stories') && (
                blogResults.length > 0 ? (
                  <div>
                    {activeTab === 'all' && (
                      <h2 className={`text-base font-semibold uppercase tracking-wider mb-4 ${textSecondary}`}>Stories</h2>
                    )}
                    <div className="space-y-6">
                      {blogResults.map(blog => (
                        <BlogCard
                          key={blog._id}
                          blog={blog}
                          isDark={isDark}
                          textPrimary={textPrimary}
                          textSecondary={textSecondary}
                        />
                      ))}
                    </div>
                  </div>
                ) : (activeTab === 'stories') && (
                  <div className="text-center py-12">
                    <p className={textSecondary}>No stories found matching "{searchQuery}"</p>
                  </div>
                )
              )}
            </div>


          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-16">
              <SearchIcon className={`w-12 h-12 mx-auto mb-3 ${textSecondary}`} />
              <p className={`text-lg font-medium mb-1 ${textPrimary}`}>No results found</p>
              <p className={textSecondary}>Try different keywords</p>
            </div>

          ) : (
            <div className="text-center py-16">
              <SearchIcon className={`w-12 h-12 mx-auto mb-3 ${textSecondary}`} />
              <p className={`${textSecondary}`}>Type at least 2 characters to search</p>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout >
  );
}

function UserCard({ user, isFollowing, onFollow, onUnfollow, onViewProfile, isDark }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition hover:shadow-sm cursor-pointer
      ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-100 hover:bg-gray-50'}`}
      onClick={onViewProfile}
    >
      <img
        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=89986d&color=fff`}
        alt={user.displayName}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.displayName}</h4>
        <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>@{user.username} · {user.followerCount || 0} followers</p>
        {user.bio && <p className={`text-sm truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.bio}</p>}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); isFollowing ? onUnfollow() : onFollow(); }}
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition ${isFollowing
          ? isDark ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          : 'bg-scribe-green text-white hover:bg-scribe-sage'
          }`}
      >
        {isFollowing ? <><UserCheck className="w-3.5 h-3.5" /> Following</> : <><UserPlus className="w-3.5 h-3.5" /> Follow</>}
      </button>
    </div>
  );
}

function BlogCard({ blog, isDark, textPrimary, textSecondary }) {
  return (
    <div className={`flex gap-4 pb-6 border-b ${isDark ? 'border-slate-800' : 'border-gray-100'} cursor-pointer group`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={blog.authorPhotoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.authorName || 'A')}`}
            alt={blog.authorName}
            className="w-5 h-5 rounded-full"
          />
          <span className={`text-sm font-medium ${textPrimary}`}>{blog.authorName}</span>
          {blog.category && <span className={`text-sm ${textSecondary}`}>in {blog.category}</span>}
        </div>
        <h3 className={`text-lg font-bold mb-1 group-hover:text-scribe-green transition ${textPrimary}`}>{blog.title}</h3>
        {blog.excerpt && <p className={`text-sm line-clamp-2 mb-2 ${textSecondary}`}>{blog.excerpt}</p>}
        <p className={`text-xs ${textSecondary}`}>
          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ''} · {blog.readTime || '?'} min read
        </p>
      </div>
      {blog.coverImage && (
        <img src={blog.coverImage} alt={blog.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
      )}
    </div>
  );
}