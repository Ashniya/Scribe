// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { ThemeContext } from '../context/ThemeContext';
// import Editor from '../components/Editor';
// import ProfileSettings from '../components/ProfileSettings';

// import {
//   Home,
//   PenTool,
//   BookOpen,
//   TrendingUp,
//   Heart,
//   Bookmark,
//   Settings,
//   LogOut,
//   Search,
//   Eye,
//   MessageSquare,
//   Users,
//   Bell,
//   Edit3,
//   BarChart3,
//   Feather,
//   ChevronRight,
//   Menu,
//   X
// } from 'lucide-react';

// export default function Dashboard() {
//   const { currentUser, signOut } = useAuth();
//   const { isDark, setIsDark } = useContext(ThemeContext);
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('for-you');
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeSection, setActiveSection] = useState('home');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showEditor, setShowEditor] = useState(false);
//   const [showProfileSettings, setShowProfileSettings] = useState(false);
//   const [blogs, setBlogs] = useState([]);
//   const [myBlogs, setMyBlogs] = useState([]);
//   const [stats, setStats] = useState({
//     totalPosts: 0,
//     totalViews: 0,
//     totalLikes: 0,
//     followers: 0
//   });
//   const [loading, setLoading] = useState(true);


//   const handleLogout = async () => {
//     try {
//       await signOut();
//       navigate('/');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Fetch data from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         // Fetch all blogs for home feed
//         const blogsRes = await fetch('http://localhost:5000/api/blogs');
//         const blogsData = await blogsRes.json();
//         if (blogsData.success) {
//           setBlogs(blogsData.data);
//         }

//         // Fetch user's blogs and stats if logged in
//         if (token) {
//           const myBlogsRes = await fetch('http://localhost:5000/api/blogs/user/my-blogs', {
//             headers: { 'Authorization': `Bearer ${token}` }
//           });
//           const myBlogsData = await myBlogsRes.json();
//           if (myBlogsData.success) {
//             setMyBlogs(myBlogsData.data);
//           }

//           const statsRes = await fetch('http://localhost:5000/api/blogs/user/stats', {
//             headers: { 'Authorization': `Bearer ${token}` }
//           });
//           const statsData = await statsRes.json();
//           if (statsData.success) {
//             setStats(statsData.data);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [showEditor]); // Refetch when returning from editor

//   const staffPicks = [
//     {
//       id: 1,
//       title: 'Why Americans Fortify Their Lives—And the Public Places That Heal the Divide',
//       author: 'A Brother\'s Sister',
//       image: 'https://i.pravatar.cc/150?img=4',
//       time: '5d ago'
//     },
//     {
//       id: 2,
//       title: 'Amazon Thinks I\'m Russian: The Quiet Occupation of My Keyboard',
//       author: 'Barack Obama',
//       image: 'https://i.pravatar.cc/150?img=5',
//       time: 'Jan 21'
//     },
//     {
//       id: 3,
//       title: 'A Wake-Up Call for Every American',
//       author: 'User Name',
//       image: 'https://i.pravatar.cc/150?img=6',
//       time: 'Jan 25'
//     }
//   ];

//   // Render content based on active section
//   const renderSectionContent = () => {
//     switch (activeSection) {
//       case 'library':
//         return (
//           <div className="text-center py-20">
//             <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//             <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Library</h2>
//             <p className={`text-gray-500`}>Saved articles and reading lists will appear here</p>
//           </div>
//         );
//       case 'profile':
//         return (
//           <div className="text-center py-20">
//             <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//             <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Profile</h2>
//             <p className={`text-gray-500 mb-4`}>{currentUser?.displayName || 'Writer'}</p>
//             <p className={`text-gray-500`}>Profile customization coming soon</p>
//           </div>
//         );
//       case 'stories':
//         return (
//           <div className="max-w-4xl mx-auto py-12">
//             <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stories</h2>
//             {myBlogs.length === 0 ? (
//               <div className="text-center py-20">
//                 <PenTool className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//                 <p className={`text-gray-500 mb-6`}>You haven't published any stories yet</p>
//                 <button
//                   onClick={() => setShowEditor(true)}
//                   className="px-6 py-3 bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-medium rounded-full hover:shadow-lg transition"
//                 >
//                   Write your first story
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {myBlogs.map((blog) => (
//                   <div
//                     key={blog._id}
//                     className={`p-6 rounded-xl border cursor-pointer hover:shadow-lg transition ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
//                       }`}
//                     onClick={() => alert(`Opening: ${blog.title}\n\nFull article view coming soon!`)}
//                   >
//                     <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                       {blog.title}
//                     </h3>
//                     <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//                       {blog.excerpt}
//                     </p>
//                     <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
//                       <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
//                       <span>·</span>
//                       <span>{blog.readTime} min read</span>
//                       <span>·</span>
//                       <span className="flex items-center gap-1">
//                         <Eye className="w-4 h-4" />
//                         {blog.views}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Heart className="w-4 h-4" />
//                         {blog.likes.length}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         );
//       case 'stats':
//         return (
//           <div className="max-w-4xl mx-auto py-12">
//             <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stats</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {[
//                 { icon: BookOpen, label: 'Stories', value: stats.totalPosts },
//                 { icon: Eye, label: 'Views', value: stats.totalViews },
//                 { icon: Heart, label: 'Likes', value: stats.totalLikes },
//                 { icon: Users, label: 'Followers', value: stats.followers }
//               ].map((stat) => (
//                 <div key={stat.label} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
//                   <stat.icon className={`w-8 h-8 mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
//                   <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
//                   <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case 'following':
//         return (
//           <div className="text-center py-20">
//             <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//             <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Following</h2>
//             <p className={`text-gray-500`}>Writers and publications you follow will appear here</p>
//           </div>
//         );
//       case 'favorites':
//         return (
//           <div className="text-center py-20">
//             <Heart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//             <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Favorites</h2>
//             <p className={`text-gray-500`}>Articles you've liked will appear here</p>
//           </div>
//         );
//       case 'collections':
//         return (
//           <div className="text-center py-20">
//             <Bookmark className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//             <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Collections</h2>
//             <p className={`text-gray-500`}>Your saved collections will appear here</p>
//           </div>
//         );
//       case 'notifications':
//         return (
//           <div className="text-center py-20">
//             <Bell className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//             <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h2>
//             <p className={`text-gray-500`}>No new notifications</p>
//           </div>
//         );
//       case 'settings':
//         return (
//           <div className="max-w-2xl mx-auto py-12">
//             <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
//             <div className="space-y-4">
//               <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
//                 <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account</h3>
//                 <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//                   {currentUser?.email}
//                 </p>
//               </div>
//               <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
//                 <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Theme</h3>
//                 <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//                   Current theme: {isDark ? 'Dark' : 'Light'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       default: // home
//         return null; // Show default feed
//     }
//   };

//   // Show Editor if Write button clicked
//   if (showEditor) {
//     return <Editor onClose={() => setShowEditor(false)} isDark={isDark} />;
//   }

//   return (
//     <div className={`min-h-screen ${isDark ? 'dark bg-slate-900' : 'bg-white'} transition-colors duration-300`}>
//       <div className="flex">
//         {/* Sidebar - Responsive to Theme */}
//         <aside className={`w-64 min-h-screen flex flex-col fixed top-0 left-0 border-r transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } z-40 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
//           }`}>
//           {/* Logo */}
//           <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
//             <div className="flex items-center gap-2">
//               <Feather className={`w-7 h-7 ${isDark ? 'text-white' : 'text-gray-900'}`} />
//               <h1 className={`text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Scribe</h1>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-0 py-6">
//             <NavItem icon={Home} label="Home" active={activeSection === 'home'} onClick={() => setActiveSection('home')} isDark={isDark} />
//             <NavItem icon={BookOpen} label="Library" active={activeSection === 'library'} onClick={() => setActiveSection('library')} isDark={isDark} />
//             <NavItem icon={Users} label="Profile" active={activeSection === 'profile'} onClick={() => setActiveSection('profile')} isDark={isDark} />
//             <NavItem icon={PenTool} label="Stories" active={activeSection === 'stories'} onClick={() => setActiveSection('stories')} isDark={isDark} />
//             <NavItem icon={BarChart3} label="Stats" active={activeSection === 'stats'} onClick={() => setActiveSection('stats')} isDark={isDark} />

//             <div className={`h-px my-6 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>

//             <NavItem icon={TrendingUp} label="Following" active={activeSection === 'following'} onClick={() => setActiveSection('following')} isDark={isDark} />
//             <NavItem icon={Heart} label="Favorites" active={activeSection === 'favorites'} onClick={() => setActiveSection('favorites')} isDark={isDark} />
//             <NavItem icon={Bookmark} label="Collections" active={activeSection === 'collections'} onClick={() => setActiveSection('collections')} isDark={isDark} />
//             <NavItem icon={Bell} label="Notifications" active={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} isDark={isDark} />
//             <NavItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} isDark={isDark} />
//           </nav>

//           {/* User Info & Logout */}
//           <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
//             <div className="flex items-center gap-3 mb-3 px-2">
//               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">
//                 {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                   {currentUser?.displayName || 'Writer'}
//                 </h3>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full transition text-sm font-medium border ${isDark ? 'border-slate-600 text-gray-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
//             >
//               <LogOut className="w-4 h-4" />
//               <span>Log Out</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
//           {/* Top Bar */}
//           <div className={`sticky top-0 z-10 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//             <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
//               <div className="flex items-center justify-between">
//                 {/* Left Side - Hamburger + Search */}
//                 <div className="flex items-center gap-4 flex-1">
//                   {/* Hamburger Menu */}
//                   <button
//                     onClick={() => setSidebarOpen(!sidebarOpen)}
//                     className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
//                     aria-label="Toggle sidebar"
//                   >
//                     {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//                   </button>

//                   {/* Search */}
//                   <div className="flex-1 max-w-2xl">
//                     <div className="relative">
//                       <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
//                       <input
//                         type="text"
//                         placeholder="Search"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         onKeyDown={(e) => e.key === 'Enter' && console.log('Searching for:', searchQuery)}
//                         className={`w-full pl-10 pr-4 py-2 rounded-full border transition ${isDark
//                           ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-slate-600'
//                           : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-300'
//                           } focus:outline-none`}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Side Actions */}
//                 <div className="flex items-center gap-3 ml-4">
//                   {/* Write Button */}
//                   <button
//                     onClick={() => setShowEditor(true)}
//                     className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-medium rounded-full hover:shadow-lg transition"
//                   >
//                     <Edit3 className="w-4 h-4" />
//                     Write
//                   </button>

//                   {/* Lamp Theme Toggle */}
//                   <button
//                     onClick={() => setIsDark(!isDark)}
//                     className="relative w-14 h-16 flex flex-col items-center group"
//                     aria-label="Toggle theme"
//                   >
//                     {/* Wire/Cord */}
//                     <div className={`w-0.5 h-5 transition-colors duration-300 ${isDark ? 'bg-gray-400' : 'bg-gray-800'}`}></div>

//                     {/* Lamp Container */}
//                     <div className="relative">
//                       {/* Light Rays (visible only when ON) */}
//                       {!isDark && (
//                         <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-20 h-24 overflow-visible pointer-events-none">
//                           {/* Center ray */}
//                           <div
//                             className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2 animate-pulse"
//                             style={{ animationDuration: '2s' }}
//                           ></div>

//                           {/* Left rays */}
//                           <div
//                             className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-20 animate-pulse"
//                             style={{ animationDuration: '2.2s' }}
//                           ></div>
//                           <div
//                             className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 -rotate-25 animate-pulse"
//                             style={{ animationDuration: '2.5s' }}
//                           ></div>

//                           {/* Right rays */}
//                           <div
//                             className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-20 animate-pulse"
//                             style={{ animationDuration: '2.3s' }}
//                           ></div>
//                           <div
//                             className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 rotate-25 animate-pulse"
//                             style={{ animationDuration: '2.6s' }}
//                           ></div>
//                         </div>
//                       )}

//                       {/* Lamp Shade - Smaller for top bar */}
//                       <svg width="40" height="34" viewBox="0 0 40 34" className="relative drop-shadow-lg">
//                         {/* Top connector */}
//                         <rect x="17" y="0" width="5" height="3" fill={isDark ? "#374151" : "#1f2937"} rx="1" />

//                         {/* Main dome shade */}
//                         <path
//                           d="M 10 4 L 30 4 L 33 11 Q 33 13, 31 13 L 8 13 Q 6 13, 6 11 Z"
//                           fill={isDark ? "#374151" : "#1f2937"}
//                           stroke={isDark ? "#1f2937" : "#111827"}
//                           strokeWidth="1"
//                           className="transition-all duration-500"
//                         />

//                         {/* Bottom rim */}
//                         <ellipse
//                           cx="19.5"
//                           cy="13"
//                           rx="12"
//                           ry="1.5"
//                           fill={isDark ? "#1f2937" : "#111827"}
//                           opacity="0.8"
//                         />

//                         {/* Light bulb - visible when ON */}
//                         {!isDark && (
//                           <>
//                             {/* Bulb glow */}
//                             <circle
//                               cx="19.5"
//                               cy="17"
//                               r="3.5"
//                               fill="#fef3c7"
//                               opacity="0.9"
//                               className="animate-pulse"
//                             />
//                             {/* Bulb */}
//                             <circle
//                               cx="19.5"
//                               cy="17"
//                               r="2.5"
//                               fill="url(#bulbGradientTopBar)"
//                             />
//                             {/* Bulb highlight */}
//                             <circle
//                               cx="18.8"
//                               cy="16.3"
//                               r="1"
//                               fill="#fffbeb"
//                             />
//                           </>
//                         )}

//                         <defs>
//                           <radialGradient id="bulbGradientTopBar" cx="50%" cy="50%" r="50%">
//                             <stop offset="0%" stopColor="#fef3c7" />
//                             <stop offset="100%" stopColor="#fde68a" />
//                           </radialGradient>
//                         </defs>
//                       </svg>
//                     </div>

//                     {/* Tooltip */}
//                     <span className={`absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//                       {isDark ? 'Turn on' : 'Turn off'}
//                     </span>
//                   </button>

//                   {/* User Avatar */}
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm">
//                     {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="max-w-7xl mx-auto px-8 py-8">
//             {/* Show section-specific content or default Home feed */}
//             {renderSectionContent() || (
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Left Column - Main Feed */}
//                 <div className="lg:col-span-2">
//                   {/* Tabs */}
//                   <div className={`flex gap-6 mb-8 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
//                     <button
//                       onClick={() => setActiveTab('for-you')}
//                       className={`pb-3 px-1 font-medium transition ${activeTab === 'for-you'
//                         ? `border-b ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
//                         : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                     >
//                       For you
//                     </button>
//                     <button
//                       onClick={() => setActiveTab('following')}
//                       className={`pb-3 px-1 font-medium transition ${activeTab === 'following'
//                         ? `border-b ${isDark ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`
//                         : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                     >
//                       Following
//                     </button>
//                   </div>

//                   {/* Articles */}
//                   <div className="space-y-8">
//                     {loading ? (
//                       <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//                         Loading articles...
//                       </div>
//                     ) : blogs.length === 0 ? (
//                       <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//                         No articles yet. Be the first to publish!
//                       </div>
//                     ) : (
//                       blogs.map((blog) => (
//                         <ArticleCard key={blog._id} article={{
//                           id: blog._id,
//                           title: blog.title,
//                           excerpt: blog.excerpt,
//                           author: blog.authorName,
//                           authorImage: 'https://i.pravatar.cc/150?img=' + (blog.authorName.charCodeAt(0) % 10),
//                           category: blog.category,
//                           image: blog.coverImage,
//                           readTime: `${blog.readTime} min read`,
//                           date: new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//                           claps: blog.likes.length,
//                           comments: 0,
//                           views: blog.views
//                         }} isDark={isDark} />
//                       ))
//                     )}
//                   </div>
//                 </div>

//                 {/* Right Column - Sidebar */}
//                 <div className="space-y-8">
//                   {/* Stats Card */}
//                   <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
//                     <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Stats</h3>
//                     <div className="space-y-3">
//                       <StatRow icon={BookOpen} label="Posts" value={stats.totalPosts} isDark={isDark} />
//                       <StatRow icon={Eye} label="Views" value={stats.totalViews.toLocaleString()} isDark={isDark} />
//                       <StatRow icon={Heart} label="Likes" value={stats.totalLikes.toLocaleString()} isDark={isDark} />
//                       <StatRow icon={Users} label="Followers" value={stats.followers} isDark={isDark} />
//                     </div>
//                   </div>

//                   {/* Staff Picks */}
//                   <div>
//                     <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Staff Picks</h3>
//                     <div className="space-y-4">
//                       {staffPicks.map((pick) => (
//                         <StaffPickCard key={pick.id} pick={pick} isDark={isDark} />
//                       ))}
//                     </div>
//                     <button className={`mt-4 text-sm font-medium flex items-center gap-1 ${isDark ? 'text-scribe-mint hover:text-scribe-sage' : 'text-scribe-green hover:text-scribe-sage'}`}>
//                       See the full list
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>

//                   {/* Topics */}
//                   <div>
//                     <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recommended topics</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {['Self Improvement', 'Productivity', 'Writing', 'Technology', 'Health'].map((topic) => (
//                         <button
//                           key={topic}
//                           onClick={() => alert(`Filtering by topic: ${topic}\n\nTopic filtering coming soon!`)}
//                           className={`px-4 py-2 rounded-full text-sm font-medium transition ${isDark
//                             ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                         >
//                           {topic}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// // Components
// function NavItem({ icon: Icon, label, active, badge, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center gap-4 px-6 py-3 transition ${active
//         ? 'text-gray-900'
//         : 'text-gray-600 hover:text-gray-900'
//         }`}
//     >
//       <Icon className="w-6 h-6" strokeWidth={1.5} />
//       <span className="font-normal text-base flex-1 text-left">{label}</span>
//       {badge && (
//         <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
//           {badge}
//         </span>
//       )}
//     </button>
//   );
// }

// function ArticleCard({ article, isDark }) {
//   const handleArticleClick = () => {
//     console.log('Opening article:', article.title);
//     alert(`Opening: ${article.title}\n\nArticle details page coming soon!`);
//   };

//   return (
//     <div
//       onClick={handleArticleClick}
//       className={`group cursor-pointer border-b pb-8 ${isDark ? 'border-slate-700' : 'border-gray-200'} hover:opacity-80 transition`}
//     >
//       <div className="flex gap-6">
//         <div className="flex-1">
//           {/* Author */}
//           <div className="flex items-center gap-2 mb-3">
//             <img
//               src={article.authorImage}
//               alt={article.author}
//               className="w-6 h-6 rounded-full"
//             />
//             <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
//               {article.author}
//             </span>
//             <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>in</span>
//             <span className="text-sm font-medium text-scribe-green">{article.category}</span>
//           </div>

//           {/* Title */}
//           <h2 className={`text-xl font-bold mb-2 line-clamp-2 group-hover:text-scribe-green transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
//             {article.title}
//           </h2>

//           {/* Excerpt */}
//           <p className={`text-base mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//             {article.excerpt}
//           </p>

//           {/* Meta */}
//           <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
//             <span>{article.date}</span>
//             <span>·</span>
//             <span>{article.readTime}</span>
//             <span>·</span>
//             <span className="flex items-center gap-1">
//               <Heart className="w-4 h-4" />
//               {article.claps.toLocaleString()}
//             </span>
//             <span className="flex items-center gap-1">
//               <MessageSquare className="w-4 h-4" />
//               {article.comments}
//             </span>
//             <button className="ml-auto">
//               <Bookmark className={`w-5 h-5 ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`} />
//             </button>
//           </div>
//         </div>

//         {/* Image */}
//         {article.image && (
//           <img
//             src={article.image}
//             alt={article.title}
//             className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function StatRow({ icon: Icon, label, value, isDark }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <Icon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
//         <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
//       </div>
//       <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</span>
//     </div>
//   );
// }

// function StaffPickCard({ pick, isDark }) {
//   const handleClick = () => {
//     alert(`Opening staff pick: ${pick.title}\n\nBy ${pick.author}\nFull article coming soon!`);
//   };

//   return (
//     <div onClick={handleClick} className="flex gap-3 cursor-pointer group hover:opacity-80 transition">
//       <img
//         src={pick.image}
//         alt={pick.author}
//         className="w-8 h-8 rounded-full flex-shrink-0"
//       />
//       <div className="flex-1 min-w-0">
//         <h4 className={`text-sm font-medium mb-1 line-clamp-2 group-hover:text-scribe-green transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
//           {pick.title}
//         </h4>
//         <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
//           <span>{pick.author}</span>
//           <span>·</span>
//           <span>{pick.time}</span>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { auth } from '../config/firebase.js';
import { API_URL } from '../servicies/api.js';
import Editor from '../components/Editor';
import ArticleView from '../components/ArticleView';
import ProfileSettings from '../components/ProfileSettings';
import SettingsPage from '../components/Settingspage';
import LoginPromptModal from '../components/LoginPromptModal';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../components/Toast';
import FloatingReaction from '../components/FloatingReaction';
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

export default function Dashboard() {
  const { currentUser, signOut } = useAuth();
  const { isDark, setIsDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [likingId, setLikingId] = useState(null); // tracks which heart is animating
  const [likeReaction, setLikeReaction] = useState(false);
  const [saveReaction, setSaveReaction] = useState(false);
  const [activeTab, setActiveTab] = useState('for-you');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [followingAuthor, setFollowingAuthor] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

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
      localStorage.removeItem('token'); // Clear token
      navigate('/login'); // Navigate to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to check if user is authenticated before allowing actions
  const handleProtectedAction = (action) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    action();
  };

  // Helper to get Firebase token
  const getToken = async () => {
    if (!currentUser) return null;
    return await currentUser.getIdToken(true);
  };

  // Like handler for blog cards
  const handleLike = async (blogId) => {
    try {
      const token = await getToken();
      if (!token) { setShowLoginPrompt(true); return; }
      setLikingId(blogId); // trigger heart-pop
      setTimeout(() => setLikingId(null), 500);
      const res = await fetch(`${API_URL}/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.map(b =>
          b._id === blogId
            ? {
              ...b, likes: data.data.isLiked
                ? [...(b.likes || []), currentUser?.uid]
                : (b.likes || []).filter(id => id !== currentUser?.uid),
              likescount: data.data.likes
            }
            : b
        ));
        toast(data.data.isLiked ? '❤️ Liked!' : 'Like removed', data.data.isLiked ? 'like' : 'info');
        if (data.data.isLiked) {
          setLikeReaction(v => !v); // flip to retrigger animation
        }
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // Saved/bookmarked blogs — keyed by user UID so each account has its own list
  const savedKey = currentUser ? `savedBlogs_${currentUser.uid}` : 'savedBlogs_guest';
  const [savedBlogs, setSavedBlogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(savedKey) || '[]'); } catch { return []; }
  });

  // Re-load saved list when the logged-in user changes (e.g. after sign-in/out)
  useEffect(() => {
    try { setSavedBlogs(JSON.parse(localStorage.getItem(savedKey) || '[]')); } catch { setSavedBlogs([]); }
  }, [currentUser?.uid]);

  const handleSave = (blogId) => {
    setSavedBlogs(prev => {
      const updated = prev.includes(blogId)
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId];
      localStorage.setItem(savedKey, JSON.stringify(updated));
      if (!prev.includes(blogId)) {
        setSaveReaction(v => !v); // only fire popup when saving (not unsaving)
      }
      return updated;
    });
  };

  const handleDelete = async (blogId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.filter(b => b._id !== blogId));
        setMyBlogs(prev => prev.filter(b => b._id !== blogId));
        toast('Story deleted successfully', 'delete');
      } else {
        toast('Failed to delete: ' + (data.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast('Failed to delete story. Please try again.', 'error');
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all blogs for home feed (public, no token needed)
        const blogsRes = await fetch(`${API_URL}/api/blogs`);
        const blogsData = await blogsRes.json();
        if (blogsData.success) {
          setBlogs(blogsData.data);
        }

        // Fetch user's blogs and stats if logged in
        const token = await getToken();
        if (token) {
          const myBlogsRes = await fetch(`${API_URL}/api/blogs/user/my-blogs`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const myBlogsData = await myBlogsRes.json();
          if (myBlogsData.success) {
            setMyBlogs(myBlogsData.data);
          }

          const statsRes = await fetch(`${API_URL}/api/blogs/user/stats`, {
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

  // Populate staff picks from top liked blogs
  useEffect(() => {
    if (blogs.length > 0) {
      const topPicks = [...blogs]
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 3)
        .map(blog => ({
          id: blog._id,
          title: blog.title,
          author: blog.authorName,
          image: blog.authorPhotoURL || null,
          time: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          blog: blog // Store full blog object for click handling
        }));
      setStaffPicks(topPicks);
    }
  }, [blogs]);

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
                    className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                  >
                    {/* Blog header with title and action buttons */}
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedArticle(blog)}
                      >
                        <h3 className={`text-2xl font-bold mb-2 hover:underline ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {blog.title}
                        </h3>
                        <p className={`mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                      {/* Owner-only action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setShowEditor(true);
                          }}
                          title="Edit story"
                          className={`p-2 rounded-lg transition ${isDark
                            ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this story? This cannot be undone.')) {
                              handleDelete(blog._id);
                            }
                          }}
                          title="Delete story"
                          className={`p-2 rounded-lg transition ${isDark
                            ? 'text-red-400 hover:text-red-300 hover:bg-slate-700'
                            : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                            }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
      case 'liked': {
        const likedBlogs = blogs.filter(b => b.likes?.includes(currentUser?.uid));
        return (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Heart className="w-6 h-6 inline mr-2 text-red-500" />
              Liked Posts
            </h2>
            {likedBlogs.length === 0 ? (
              <div className="text-center py-16">
                <Heart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No liked posts yet</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Click the ❤️ on articles you enjoy
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {likedBlogs.map((blog) => (
                  <ArticleCard key={blog._id} article={{
                    id: blog._id,
                    title: blog.title,
                    excerpt: blog.excerpt,
                    author: blog.authorName,
                    authorImage: blog.authorPhotoURL || null,
                    category: blog.category,
                    image: blog.coverImage,
                    readTime: `${blog.readTime} min read`,
                    date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    claps: blog.likes?.length || 0,
                    comments: blog.commentscount || 0,
                    views: blog.views,
                    isLiked: true,
                    isSaved: savedBlogs.includes(blog._id)
                  }} isDark={isDark} onProtectedAction={handleProtectedAction} onLike={() => handleLike(blog._id)} onSave={() => handleSave(blog._id)} onArticleClick={() => setSelectedArticle(blog)} onFollowAuthor={setFollowingAuthor} currentUser={currentUser} onDelete={handleDelete} />
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
                  <ArticleCard key={blog._id} article={{
                    id: blog._id,
                    title: blog.title,
                    excerpt: blog.excerpt,
                    author: blog.authorName,
                    authorImage: blog.authorPhotoURL || null,
                    category: blog.category,
                    image: blog.coverImage,
                    readTime: `${blog.readTime} min read`,
                    date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    claps: blog.likes?.length || 0,
                    comments: blog.commentscount || 0,
                    views: blog.views,
                    isLiked: blog.likes?.includes(currentUser?.uid),
                    isSaved: true
                  }} isDark={isDark} onProtectedAction={handleProtectedAction} onLike={() => handleLike(blog._id)} onSave={() => handleSave(blog._id)} onArticleClick={() => setSelectedArticle(blog)} onFollowAuthor={setFollowingAuthor} currentUser={currentUser} onDelete={handleDelete} />
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
        return <SettingsPage onClose={() => setActiveSection('home')} />;
      default: // home
        return null; // Show default feed
    }
  };

  // Show Article View if an article is selected
  if (selectedArticle) {
    return (
      <ArticleView
        article={selectedArticle}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onClose={() => setSelectedArticle(null)}
        onLike={() => handleLike(selectedArticle._id)}
        onSave={() => handleSave(selectedArticle._id)}
        isLiked={selectedArticle.likes?.includes(currentUser?.uid)}
        isSaved={savedBlogs.includes(selectedArticle._id)}
        currentUser={currentUser}
        onEdit={(blog) => {
          setSelectedArticle(null);
          setEditingBlog(blog);
          setShowEditor(true);
        }}
        onDelete={(blogId) => {
          handleDelete(blogId);
          setSelectedArticle(null);
        }}
      />
    );
  }

  // Show Editor if Write button clicked or Edit button clicked
  if (showEditor) {
    return (
      <Editor
        onClose={() => {
          setShowEditor(false);
          setEditingBlog(null);
        }}
        isDark={isDark}
        editBlog={editingBlog}
      />
    );
  }

  // Show onboarding for first-time users
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

      <div className={`min-h-screen ${isDark ? 'dark bg-slate-900' : 'bg-white'} transition-colors duration-300 ${showLoginPrompt ? 'blur-sm pointer-events-none' : ''
        }`}>
        <div className="flex">
          {/* Sidebar - Responsive to Theme */}
          {/* Sidebar - Medium Style Rail */}
          {/* Sidebar - Original */}
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
              <NavItem icon={Heart} label="Liked Posts" active={activeSection === 'liked'} onClick={() => setActiveSection('liked')} isDark={isDark} />
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
                      onClick={() => handleProtectedAction(() => setShowEditor(true))}
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

                    {/* User Avatar with Logout Dropdown */}
                    {currentUser ? (
                      <div className="relative">
                        <button
                          onClick={() => setShowProfileMenu(!showProfileMenu)}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm hover:ring-2 ring-scribe-sage transition-all focus:outline-none"
                        >
                          {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
                        </button>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                          <div className={`absolute right-0 top-full mt-2 w-48 py-2 rounded-xl shadow-xl border transform origin-top-right transition-all animate-fadeIn ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                            }`}>
                            <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                              <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {currentUser?.displayName || 'Writer'}
                              </p>
                              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {currentUser?.email}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setShowProfileMenu(false);
                                handleProtectedAction(() => setActiveSection('profile'));
                              }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </button>

                            <button
                              onClick={() => {
                                setShowProfileMenu(false);
                                handleProtectedAction(() => setActiveSection('settings'));
                              }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                                }`}
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
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
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
            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-8 py-8">
              {/* Show section-specific content or default Home feed */}
              {renderSectionContent() || (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Main Feed */}
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
                        <div className="space-y-8">
                          {[1, 2, 3].map(i => <SkeletonCard key={i} isDark={isDark} />)}
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
                            {filteredBlogs.map((blog, idx) => (
                              <ArticleCard key={blog._id} staggerIndex={idx} likingId={likingId} article={{
                                id: blog._id,
                                title: blog.title,
                                excerpt: blog.excerpt,
                                author: blog.authorName,
                                authorImage: blog.authorPhotoURL || currentUser?.photoURL || null,
                                authorEmail: blog.authorEmail,
                                category: blog.category,
                                image: blog.coverImage,
                                readTime: `${blog.readTime} min read`,
                                date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                claps: blog.likes?.length || blog.likescount || 0,
                                comments: blog.commentscount || 0,
                                views: blog.views,
                                isLiked: blog.likes?.includes(currentUser?.uid),
                                isSaved: savedBlogs.includes(blog._id)
                              }} isDark={isDark} onProtectedAction={handleProtectedAction} onLike={() => handleLike(blog._id)} onSave={() => handleSave(blog._id)} onArticleClick={() => setSelectedArticle(blog)} onFollowAuthor={setFollowingAuthor} currentUser={currentUser} onDelete={handleDelete} />
                            ))}
                          </>
                        );
                      })()}
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
                        {staffPicks.length > 0 ? (
                          staffPicks.map((pick) => (
                            <StaffPickCard key={pick.id} pick={pick} isDark={isDark} onArticleClick={setSelectedArticle} />
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
          </main >
        </div >
      </div >

      {/* Floating Reaction Popups */}
      <FloatingReaction type="like" active={likeReaction} />
      <FloatingReaction type="save" active={saveReaction} />
    </>
  );
}

// Components
function NavItem({ icon: Icon, label, active, badge, onClick, isDark, iconOnly }) {
  if (iconOnly) {
    return (
      <button
        onClick={onClick}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition group relative ${active
          ? isDark ? 'text-white bg-slate-800' : 'text-gray-900 bg-gray-100'
          : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        title={label}
      >
        <Icon className="w-6 h-6" strokeWidth={1.5} />
        {badge && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3 transition ${active
        ? isDark ? 'text-white' : 'text-gray-900'
        : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
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

// Category → color chip mapping
const CATEGORY_COLORS = {
  General: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Technology: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Writing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Productivity: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Art: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Science: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
};

function ArticleCard({ article, isDark, onProtectedAction, onLike, onSave, onArticleClick, onFollowAuthor, currentUser, onDelete, staggerIndex = 0, likingId }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleArticleClick = () => {
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
          break;
      }
    });
  };

  const staggerClass = [`stagger-1`, `stagger-2`, `stagger-3`, `stagger-4`, `stagger-5`, `stagger-6`][Math.min(staggerIndex, 5)];
  const tagColor = CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
  const isHeartPopping = likingId === article.id;

  return (
    <div
      className={`animate-card-rise ${staggerClass} card-hover group cursor-pointer rounded-2xl p-5 mb-4
        border transition-all
        ${isDark
          ? 'glass-card border-slate-700/50'
          : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
        }`}
    >
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 min-w-0">
          {/* Author row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2" onClick={handleArticleClick}>
              {/* Gradient Avatar Ring */}
              <div className="p-[2px] rounded-full bg-gradient-to-br from-scribe-green via-scribe-sage to-scribe-mint flex-shrink-0">
                {article.authorImage ? (
                  <img
                    src={article.authorImage}
                    alt={article.author}
                    className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-slate-900"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0`}
                  style={{ display: article.authorImage ? 'none' : 'flex' }}
                >
                  {getInitials(article.author)}
                </div>
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{article.author}</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>in</span>
              {/* Category chip */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColor}`}>{article.category}</span>
            </div>
          </div>

          {/* Title */}
          <h2
            onClick={handleArticleClick}
            className={`text-xl md:text-2xl font-bold font-serif mb-1 line-clamp-2 group-hover:text-scribe-green transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {article.title.replace(/^#+\s*|^\*+|\*+$/g, '')}
          </h2>

          {/* Excerpt */}
          <p
            onClick={handleArticleClick}
            className={`text-sm mb-3 line-clamp-2 hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {article.excerpt.replace(/^#+\s*|^\*+|\*+$/g, '')}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-1">
            <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <span>{article.date}</span>
              <span>{article.readTime}</span>
              {/* Like button with heart-pop */}
              <button
                onClick={(e) => { e.stopPropagation(); onProtectedAction(() => onLike && onLike()); }}
                className={`flex items-center gap-1 transition ${article.isLiked ? 'text-red-500' : isDark ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-200
                    ${isHeartPopping ? 'animate-heart-pop' : ''}
                    ${article.isLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`}
                />
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
                className={`transition-all p-1 ${article.isSaved ? 'text-scribe-green scale-110' : 'text-gray-400 hover:text-scribe-green dark:text-gray-500 dark:hover:text-scribe-sage'}`}
              >
                <Bookmark className={`w-4 h-4 ${article.isSaved ? 'fill-scribe-green' : ''}`} />
              </button>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className={`transition ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 z-20 w-48 rounded-xl shadow-2xl border py-1 animate-fadeIn"
                    style={{ background: isDark ? 'rgba(30,41,59,0.95)' : 'white', borderColor: isDark ? '#334155' : '#e5e7eb' }}
                    onClick={(e) => e.stopPropagation()}>
                    {currentUser && article.authorEmail === currentUser.email ? (
                      <button onClick={(e) => { e.stopPropagation(); handleMenuAction('delete'); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete story</button>
                    ) : (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction('mute-author'); }} className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700/60' : 'text-gray-700 hover:bg-gray-50'}`}>Mute author</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction('report'); }} className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700/60' : 'text-gray-700 hover:bg-gray-50'}`}>Report</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {article.image && (
          <img
            onClick={handleArticleClick}
            src={article.image}
            alt={article.title}
            className="w-24 h-24 sm:w-36 sm:h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
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

function StaffPickCard({ pick, isDark, onArticleClick }) {
  const handleClick = () => {
    if (onArticleClick && pick.blog) {
      onArticleClick(pick.blog);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div onClick={handleClick} className="flex gap-3 cursor-pointer group hover:opacity-80 transition">
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