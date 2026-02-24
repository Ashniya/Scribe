import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import Search from './pages/Search';
import ProfileTest from './pages/ProfileTest';
import Contact from './pages/Contact';
import ArticlePage from './pages/ArticlePage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import LoginPromptModal from './components/LoginPromptModal';

// Maps /dashboard/:section URL param to Dashboard initialSection
const VALID_SECTIONS = ['library', 'profile', 'stories', 'stats', 'following', 'favorites', 'collections', 'notifications', 'settings', 'search'];
function DashboardSectionRouter() {
  const { section } = useParams();
  const validSection = VALID_SECTIONS.includes(section) ? section : 'home';
  return <Dashboard initialSection={validSection} />;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Login/Auth routes - only when NOT logged in */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Dashboard - home feed */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Messages Routes */}
              <Route
                path="/dashboard/messages"
                element={
                  <ProtectedRoute>
                    <Dashboard initialSection="messages" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/messages/:conversationId"
                element={
                  <ProtectedRoute>
                    <Dashboard initialSection="messages" />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard section routes (following, favorites, collections, etc.) */}
              <Route
                path="/dashboard/:section"
                element={
                  <ProtectedRoute>
                    <DashboardSectionRouter />
                  </ProtectedRoute>
                }
              />

              {/* Your own profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* User profiles - @username format (your version) */}
              <Route
                path="/@:username"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Friend's /profile/:username format - keep for compatibility */}
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Article Page - simple ID-based route (primary) */}
              <Route
                path="/article/:id"
                element={
                  <ProtectedRoute>
                    <ArticlePage />
                  </ProtectedRoute>
                }
              />

              {/* Article Page - Substack-style URLs (kept for compatibility) */}
              <Route
                path="/@:username/:slug"
                element={
                  <ProtectedRoute>
                    <ArticlePage />
                  </ProtectedRoute>
                }
              />

              {/* Stats */}
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                }
              />

              {/* Search / Explore */}
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                }
              />

              {/* Profile Test */}
              <Route
                path="/profile-test"
                element={
                  <ProtectedRoute>
                    <ProfileTest />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
