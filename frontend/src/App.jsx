import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import About from './pages/About';
import LoginPromptModal from './components/LoginPromptModal'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public route - accessible to everyone */}
            <Route path="/" element={<Landing />} />

            {/* About page */}
            <Route path="/about" element={<About />} />

            {/* Login route - only accessible when NOT logged in */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />

            {/* Forgot Password route */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected route - only accessible when logged in */}
            <Route
              path="/dashboard"
              element={
                <Dashboard />
              }
            />

            {/* 404 - Not found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;