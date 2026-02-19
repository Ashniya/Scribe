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
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public route */}
              <Route path="/" element={<Landing />} />

              {/* About page */}
              <Route path="/about" element={<About />} />

              {/* Login route - only when NOT logged in */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />

              {/* Forgot Password */}
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

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