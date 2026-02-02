import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Editor from '../components/Editor';
import ProfileSettings from '../components/ProfileSettings';
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
  X
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser, signOut } = useAuth();
  const { isDark, setIsDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('for-you');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch all blogs for home feed
        const blogsRes = await fetch('http://localhost:5000/api/blogs');
        const blogsData = await blogsRes.json();
        if (blogsData.success) {
          setBlogs(blogsData.data);
        }

        // Fetch user's blogs and stats if logged in
        if (token) {
          const myBlogsRes = await fetch('http://localhost:5000/api/blogs/user/my-blogs', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const myBlogsData = await myBlogsRes.json();
          if (myBlogsData.success) {
            setMyBlogs(myBlogsData.data);
          }

          const statsRes = await fetch('http://localhost:5000/api/blogs/user/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showEditor]); // Refetch when returning from editor

  const staffPicks = [
    {
      id: 1,
      title: 'Why Americans Fortify Their Lives—And the Public Places That Heal the Divide',
      author: 'A Brother\'s Sister',
      image: 'https://i.pravatar.cc/150?img=4',
      time: '5d ago'
    },
    {
      id: 2,
      title: 'Amazon Thinks I\'m Russian: The Quiet Occupation of My Keyboard',
      author: 'Barack Obama',
      image: 'https://i.pravatar.cc/150?img=5',
      time: 'Jan 21'
    },
    {
      id: 3,
      title: 'A Wake-Up Call for Every American',
      author: 'User Name',
      image: 'https://i.pravatar.cc/150?img=6',
      time: 'Jan 25'
    }
  ];

  // Render content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'library':
        return (
          <div className="text-center py-20">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Library</h2>
            <p className={`text-gray-500`}>Saved articles and reading lists will appear here</p>
          </div>
        );
      case 'profile':
        return (
          <div className="text-center py-20">
            <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Profile</h2>
            <p className={`text-gray-500 mb-4`}>{currentUser?.displayName || 'Writer'}</p>
            <p className={`text-gray-500`}>Profile customization coming soon</p>
          </div>
        );
      case 'stories':
        return (
          <div className="max-w-4xl mx-auto py-12">
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stories</h2>
            {myBlogs.length === 0 ? (
              <div className="text-center py-20">
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
              <div className="space-y-6">
                {myBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className={`p-6 rounded-xl border cursor-pointer hover:shadow-lg transition ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                      }`}
                    onClick={() => alert(`Opening: ${blog.title}\n\nFull article view coming soon!`)}
                  >
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {blog.title}
                    </h3>
                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {blog.excerpt}
                    </p>
                    <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{blog.readTime} min read</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {blog.likes.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'stats':
        return (
          <div className="max-w-4xl mx-auto py-12">
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, label: 'Stories', value: stats.totalPosts },
                { icon: Eye, label: 'Views', value: stats.totalViews },
                { icon: Heart, label: 'Likes', value: stats.totalLikes },
                { icon: Users, label: 'Followers', value: stats.followers }
              ].map((stat) => (
                <div key={stat.label} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <stat.icon className={`w-8 h-8 mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'following':
        return (
          <div className="text-center py-20">
            <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Following</h2>
            <p className={`text-gray-500`}>Writers and publications you follow will appear here</p>
          </div>
        );
      case 'favorites':
        return (
          <div className="text-center py-20">
            <Heart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Favorites</h2>
            <p className={`text-gray-500`}>Articles you've liked will appear here</p>
          </div>
        );
      case 'collections':
        return (
          <div className="text-center py-20">
            <Bookmark className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Collections</h2>
            <p className={`text-gray-500`}>Your saved collections will appear here</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="text-center py-20">
            <Bell className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h2>
            <p className={`text-gray-500`}>No new notifications</p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto py-12">
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentUser?.email}
                </p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Theme</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current theme: {isDark ? 'Dark' : 'Light'}
                </p>
              </div>
            </div>
          </div>
        );
      default: // home
        return null; // Show default feed
    }
  };

  // Show Editor if Write button clicked
  if (showEditor) {
    return <Editor onClose={() => setShowEditor(false)} isDark={isDark} />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-900' : 'bg-white'} transition-colors duration-300`}>
      <div className="flex">
        {/* Sidebar - Responsive to Theme */}
        <aside className={`w-64 min-h-screen flex flex-col fixed top-0 left-0 border-r transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } z-40 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
          }`}>
          {/* Logo */}
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Feather className={`w-7 h-7 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              <h1 className={`text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Scribe</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-0 py-6">
            <NavItem icon={Home} label="Home" active={activeSection === 'home'} onClick={() => setActiveSection('home')} isDark={isDark} />
            <NavItem icon={BookOpen} label="Library" active={activeSection === 'library'} onClick={() => setActiveSection('library')} isDark={isDark} />
            <NavItem icon={Users} label="Profile" active={activeSection === 'profile'} onClick={() => setActiveSection('profile')} isDark={isDark} />
            <NavItem icon={PenTool} label="Stories" active={activeSection === 'stories'} onClick={() => setActiveSection('stories')} isDark={isDark} />
            <NavItem icon={BarChart3} label="Stats" active={activeSection === 'stats'} onClick={() => setActiveSection('stats')} isDark={isDark} />

            <div className={`h-px my-6 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>

            <NavItem icon={TrendingUp} label="Following" active={activeSection === 'following'} onClick={() => setActiveSection('following')} isDark={isDark} />
            <NavItem icon={Heart} label="Favorites" active={activeSection === 'favorites'} onClick={() => setActiveSection('favorites')} isDark={isDark} />
            <NavItem icon={Bookmark} label="Collections" active={activeSection === 'collections'} onClick={() => setActiveSection('collections')} isDark={isDark} />
            <NavItem icon={Bell} label="Notifications" active={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} isDark={isDark} />
            <NavItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} isDark={isDark} />
          </nav>

          {/* User Info & Logout */}
          <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentUser?.displayName || 'Writer'}
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
                {/* Left Side - Hamburger + Search */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Hamburger Menu */}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                    aria-label="Toggle sidebar"
                  >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>

                  {/* Search */}
                  <div className="flex-1 max-w-2xl">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && console.log('Searching for:', searchQuery)}
                        className={`w-full pl-10 pr-4 py-2 rounded-full border transition ${isDark
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-slate-600'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-300'
                          } focus:outline-none`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 ml-4">
                  {/* Write Button */}
                  <button
                    onClick={() => setShowEditor(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-medium rounded-full hover:shadow-lg transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Write
                  </button>

                  {/* Lamp Theme Toggle */}
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className="relative w-14 h-16 flex flex-col items-center group"
                    aria-label="Toggle theme"
                  >
                    {/* Wire/Cord */}
                    <div className={`w-0.5 h-5 transition-colors duration-300 ${isDark ? 'bg-gray-400' : 'bg-gray-800'}`}></div>

                    {/* Lamp Container */}
                    <div className="relative">
                      {/* Light Rays (visible only when ON) */}
                      {!isDark && (
                        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-20 h-24 overflow-visible pointer-events-none">
                          {/* Center ray */}
                          <div
                            className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2 animate-pulse"
                            style={{ animationDuration: '2s' }}
                          ></div>

                          {/* Left rays */}
                          <div
                            className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-20 animate-pulse"
                            style={{ animationDuration: '2.2s' }}
                          ></div>
                          <div
                            className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 -rotate-25 animate-pulse"
                            style={{ animationDuration: '2.5s' }}
                          ></div>

                          {/* Right rays */}
                          <div
                            className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-20 animate-pulse"
                            style={{ animationDuration: '2.3s' }}
                          ></div>
                          <div
                            className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 rotate-25 animate-pulse"
                            style={{ animationDuration: '2.6s' }}
                          ></div>
                        </div>
                      )}

                      {/* Lamp Shade - Smaller for top bar */}
                      <svg width="40" height="34" viewBox="0 0 40 34" className="relative drop-shadow-lg">
                        {/* Top connector */}
                        <rect x="17" y="0" width="5" height="3" fill={isDark ? "#374151" : "#1f2937"} rx="1" />

                        {/* Main dome shade */}
                        <path
                          d="M 10 4 L 30 4 L 33 11 Q 33 13, 31 13 L 8 13 Q 6 13, 6 11 Z"
                          fill={isDark ? "#374151" : "#1f2937"}
                          stroke={isDark ? "#1f2937" : "#111827"}
                          strokeWidth="1"
                          className="transition-all duration-500"
                        />

                        {/* Bottom rim */}
                        <ellipse
                          cx="19.5"
                          cy="13"
                          rx="12"
                          ry="1.5"
                          fill={isDark ? "#1f2937" : "#111827"}
                          opacity="0.8"
                        />

                        {/* Light bulb - visible when ON */}
                        {!isDark && (
                          <>
                            {/* Bulb glow */}
                            <circle
                              cx="19.5"
                              cy="17"
                              r="3.5"
                              fill="#fef3c7"
                              opacity="0.9"
                              className="animate-pulse"
                            />
                            {/* Bulb */}
                            <circle
                              cx="19.5"
                              cy="17"
                              r="2.5"
                              fill="url(#bulbGradientTopBar)"
                            />
                            {/* Bulb highlight */}
                            <circle
                              cx="18.8"
                              cy="16.3"
                              r="1"
                              fill="#fffbeb"
                            />
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

                    {/* Tooltip */}
                    <span className={`absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isDark ? 'Turn on' : 'Turn off'}
                    </span>
                  </button>

                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">
                    {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Show section-specific content or default Home feed */}
            {renderSectionContent() || (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Feed */}
                <div className="lg:col-span-2">
                  {/* Tabs */}
                  <div className={`flex gap-6 mb-8 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setActiveTab('for-you')}
                      className={`pb-3 px-1 font-medium transition ${activeTab === 'for-you'
                        ? `border-b ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
                        : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      For you
                    </button>
                    <button
                      onClick={() => setActiveTab('following')}
                      className={`pb-3 px-1 font-medium transition ${activeTab === 'following'
                        ? `border-b ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
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
                    ) : (
                      blogs.map((blog) => (
                        <ArticleCard key={blog._id} article={{
                          id: blog._id,
                          title: blog.title,
                          excerpt: blog.excerpt,
                          author: blog.authorName,
                          authorImage: 'https://i.pravatar.cc/150?img=' + (blog.authorName.charCodeAt(0) % 10),
                          category: blog.category,
                          image: blog.coverImage,
                          readTime: `${blog.readTime} min read`,
                          date: new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          claps: blog.likes.length,
                          comments: 0,
                          views: blog.views
                        }} isDark={isDark} />
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">
                  {/* Stats Card */}
                  <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stats</h3>
                    <div className="space-y-3">
                      <StatRow icon={BookOpen} label="Posts" value={stats.totalPosts} isDark={isDark} />
                      <StatRow icon={Eye} label="Views" value={stats.totalViews.toLocaleString()} isDark={isDark} />
                      <StatRow icon={Heart} label="Likes" value={stats.totalLikes.toLocaleString()} isDark={isDark} />
                      <StatRow icon={Users} label="Followers" value={stats.followers} isDark={isDark} />
                    </div>
                  </div>

                  {/* Staff Picks */}
                  <div>
                    <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Staff Picks</h3>
                    <div className="space-y-4">
                      {staffPicks.map((pick) => (
                        <StaffPickCard key={pick.id} pick={pick} isDark={isDark} />
                      ))}
                    </div>
                    <button className={`mt-4 text-sm font-medium flex items-center gap-1 ${isDark ? 'text-scribe-mint hover:text-scribe-sage' : 'text-scribe-green hover:text-scribe-sage'}`}>
                      See the full list
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Topics */}
                  <div>
                    <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recommended topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Self Improvement', 'Productivity', 'Writing', 'Technology', 'Health'].map((topic) => (
                        <button
                          key={topic}
                          onClick={() => alert(`Filtering by topic: ${topic}\n\nTopic filtering coming soon!`)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition ${isDark
                            ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Components
function NavItem({ icon: Icon, label, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3 transition ${active
        ? 'text-gray-900'
        : 'text-gray-600 hover:text-gray-900'
        }`}
    >
      <Icon className="w-6 h-6" strokeWidth={1.5} />
      <span className="font-normal text-base flex-1 text-left">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function ArticleCard({ article, isDark }) {
  const handleArticleClick = () => {
    console.log('Opening article:', article.title);
    alert(`Opening: ${article.title}\n\nArticle details page coming soon!`);
  };

  return (
    <div
      onClick={handleArticleClick}
      className={`group cursor-pointer border-b pb-8 ${isDark ? 'border-slate-700' : 'border-gray-200'} hover:opacity-80 transition`}
    >
      <div className="flex gap-6">
        <div className="flex-1">
          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={article.authorImage}
              alt={article.author}
              className="w-6 h-6 rounded-full"
            />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {article.author}
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>in</span>
            <span className="text-sm font-medium text-scribe-green">{article.category}</span>
          </div>

          {/* Title */}
          <h2 className={`text-xl font-bold mb-2 line-clamp-2 group-hover:text-scribe-green transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className={`text-base mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {article.claps.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {article.comments}
            </span>
            <button className="ml-auto">
              <Bookmark className={`w-5 h-5 ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`} />
            </button>
          </div>
        </div>

        {/* Image */}
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
          />
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

function StaffPickCard({ pick, isDark }) {
  const handleClick = () => {
    alert(`Opening staff pick: ${pick.title}\n\nBy ${pick.author}\nFull article coming soon!`);
  };

  return (
    <div onClick={handleClick} className="flex gap-3 cursor-pointer group hover:opacity-80 transition">
      <img
        src={pick.image}
        alt={pick.author}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium mb-1 line-clamp-2 group-hover:text-scribe-green transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {pick.title}
        </h4>
        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          <span>{pick.author}</span>
          <span>·</span>
          <span>{pick.time}</span>
        </div>
      </div>
    </div>
  );
}
