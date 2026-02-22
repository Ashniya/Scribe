import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    PenTool,
    BookOpen,
    TrendingUp,
    Heart,
    Bookmark,
    Settings,
    LogOut,
    Bell,
    BarChart2,
    Feather,
    Users,
    MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, isDark, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path === '/profile' && location.pathname.startsWith('/profile')) return true;
        return false;
    };

    // Helper for navigation or internal dashboard section switching
    // For now, simpler to just map everything to routes if possible, 
    // but Dashboard.jsx uses internal state for sections.
    // We will accept a prop for 'activeSection' if we want to keep that hybrid approach, 
    // OR we migrate everything to routes. 
    // For this refactor, let's keep it simple: generic NavItem.
    // BUT the Dashboard.jsx relies on 'setActiveSection'.
    // To make this reusable for Profile page (which is a route), we might need to handle clicks differently.

    // Strategy: The Sidebar should probably just navigate or trigger a callback.
    // Since Dashboard uses internal state, we can pass a 'onNavigate' prop.
    // If 'onNavigate' is provided, use it. Else, navigate to route.

    // Actually, the Plan said "Sidebar... Should handle navigation for items".
    // Profile.jsx will use this Sidebar. When on Profile, clicking "Home" should go to /dashboard.
    // When on Dashboard, clicking "Home" should set activeSection='home' (or just go to /dashboard which resets it).
    // Let's standardise: Clicking nav items goes to Routes/Urls or triggers the callback.

    // Let's assume for now:
    // Home -> /dashboard
    // Profile -> /profile
    // Others -> /dashboard?tab=... or just stay on dashboard and let dashboard handle it?

    // To support the existing Dashboard behavior (internal state) AND separate Profile page:
    // We can pass `currentSection` and `onSectionChange`.
    // If we are NOT on /dashboard, clicking a dashboard-only link should navigate to /dashboard first.

    const handleNavClick = (section, route) => {
        if (route) {
            navigate(route);
        } else {
            // It's a dashboard section
            if (location.pathname !== '/dashboard') {
                navigate('/dashboard', { state: { section } });
            } else {
                // We are on dashboard, if parent provided a handler, call it?
                // But extracting Sidebar means we need a way to communicate back to Dashboard component 
                // if it's rendered inside it?
                // Actually, if we use a Layout, the Sidebar is in the Layout. 
                // Dashboard is a child. 
                // This implies we might need to move "activeSection" state UP to Context or use URL params.

                // Simpler approach for this task:
                // Make Sidebar purely navigation based or hybrid.
                // Let's us URL params for Dashboard sections? e.g. /dashboard?section=library
                // This is a cleaner refactor but might be too big.

                // Alternative: The Sidebar is imported by DashboardLayout.
                // DashboardLayout wraps Profile and Dashboard.
                // On Profile: Sidebar works.
                // On Dashboard: Sidebar works.

                // Let's use a Custom Event or Context? No, too complex.
                // Let's use React Router state or Search Params. 
                // Dashboard.jsx can listen to location.state or search params.
                navigate('/dashboard', { state: { section } });
            }
        }
    };

    return (
        <aside className={`min-h-screen flex flex-col fixed top-0 left-0 border-r transition-all duration-300 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            w-20 lg:w-64 
            z-40 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
            }`}>
            {/* Logo */}
            <div className={`h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <Feather className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                    <h1 className={`hidden lg:block text-2xl font-serif font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Scribe</h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 flex flex-col gap-1 px-2 lg:px-0">
                <NavItem
                    icon={Home}
                    label="Home"
                    active={location.pathname === '/dashboard' && (!location.state?.section || location.state?.section === 'home')}
                    onClick={() => handleNavClick('home', '/dashboard')}
                    isDark={isDark}
                />
                <NavItem
                    icon={BookOpen}
                    label="Library"
                    active={location.state?.section === 'library'}
                    onClick={() => handleNavClick('library')}
                    isDark={isDark}
                />
                <NavItem
                    icon={Users}
                    label="Profile"
                    active={location.pathname.startsWith('/profile')}
                    onClick={() => handleNavClick(null, '/profile')}
                    isDark={isDark}
                />
                <NavItem
                    icon={MessageSquare}
                    label="Messages"
                    active={location.state?.section === 'messages'}
                    onClick={() => handleNavClick('messages')}
                    isDark={isDark}
                />
                <NavItem
                    icon={PenTool}
                    label="Stories"
                    active={location.state?.section === 'stories'}
                    onClick={() => handleNavClick('stories')}
                    isDark={isDark}
                />


                <div className={`h-px my-4 mx-4 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>

                <NavItem
                    icon={TrendingUp}
                    label="Following"
                    active={location.state?.section === 'following'}
                    onClick={() => handleNavClick('following')}
                    isDark={isDark}
                />
                <NavItem
                    icon={Heart}
                    label="Favorites"
                    active={location.state?.section === 'favorites'}
                    onClick={() => handleNavClick('favorites')}
                    isDark={isDark}
                />
                <NavItem
                    icon={Bookmark}
                    label="Collections"
                    active={location.state?.section === 'collections'}
                    onClick={() => handleNavClick('collections')}
                    isDark={isDark}
                />
                <NavItem
                    icon={Bell}
                    label="Notifications"
                    active={location.state?.section === 'notifications'}
                    onClick={() => handleNavClick('notifications')}
                    isDark={isDark}
                />
                <NavItem
                    icon={BarChart2} // Using BarChart2 as per instruction snippet
                    label="Stats"
                    active={location.pathname === '/stats'} // Assuming this new Stats is a direct route
                    onClick={() => handleNavClick(null, '/stats')} // Navigate directly to /stats
                    isDark={isDark}
                />
                <NavItem
                    icon={Settings}
                    label="Settings"
                    active={location.state?.section === 'settings'}
                    onClick={() => handleNavClick('settings')}
                    isDark={isDark}
                />
            </nav>

            {/* User Info & Logout */}
            <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                {currentUser ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
                            </div>
                            <div className="hidden lg:block flex-1 min-w-0">
                                <h3 className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {currentUser?.displayName || 'Writer'}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className={`w-full flex items-center justify-center gap-2 lg:px-3 py-2 rounded-lg lg:rounded-full transition text-sm font-medium border ${isDark ? 'border-slate-600 text-gray-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden lg:block">Log Out</span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className={`w-full flex items-center justify-center gap-2 px-0 lg:px-3 py-2 rounded-lg lg:rounded-full transition text-sm font-medium bg-gradient-to-r from-scribe-green to-scribe-sage text-white hover:shadow-md`}
                        title="Log In"
                    >
                        <LogOut className="w-4 h-4 rotate-180" />
                        <span className="hidden lg:block">Log In</span>
                    </button>
                )}
            </div>
        </aside>
    );
}

function NavItem({ icon: Icon, label, active, badge, onClick, isDark }) {
    return (
        <button
            onClick={onClick}
            title={label}
            className={`w-full flex items-center justify-center lg:justify-start gap-4 px-0 lg:px-6 py-3 transition rounded-lg lg:rounded-none ${active
                ? isDark ? 'text-white bg-slate-800/50 lg:border-r-2 border-scribe-green' : 'text-gray-900 bg-gray-50 lg:border-r-2 border-scribe-green'
                : isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
        >
            <Icon className="w-5 h-5" strokeWidth={1.5} />
            <span className="hidden lg:block font-normal text-sm flex-1 text-left">{label}</span>
            {badge && (
                <span className="hidden lg:block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {badge}
                </span>
            )}
        </button>
    );
}
