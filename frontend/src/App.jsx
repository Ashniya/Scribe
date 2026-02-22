// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import Search from './pages/Search';
import ProfileTest from './pages/ProfileTest';
import Contact from './pages/Contact';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import ArticlePage from './pages/ArticlePage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />

            {/* Login - only when NOT logged in */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />

            {/* Dashboard - home feed only */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Messages Route */}
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

            {/* Your own profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* User Profile */}
            <Route
              path="/@:username"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Article Page */}
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
    </ThemeProvider>
  );
}

export default App;