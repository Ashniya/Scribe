
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import React from 'react';
// import Landing from './pages/Landing';
// import LoginPage from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import { ThemeProvider } from './context/ThemeContext';

// import { AuthProvider } from './context/AuthContext';
// import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// import About from './pages/About';

// function App() {
//   return (
//     <ThemeProvider>
//       <Router>

//         <AuthProvider>
//           <Routes>
//             {/* Public route - accessible to everyone */}
//             <Route path="/" element={<Landing />} />
            
//             {/* Login route - only accessible when NOT logged in */}
//             <Route 
//               path="/login" 
//               element={
//                 <PublicOnlyRoute>
//                   <LoginPage />
//                 </PublicOnlyRoute>
//               } 
//             />
            
//             {/* Protected route - only accessible when logged in */}
//             <Route 
//               path="/dashboard" 
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               } 
//             />
            
//             {/* 404 - Not found */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </AuthProvider>

//         <Routes>
//           <Route path="/" element={<Landing />} />
//                     <Route path="/about" element={<About />} />
//         </Routes>

//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;










// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Landing from "./pages/Landing";
// import LoginPage from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import About from "./pages/About";

// import { ThemeProvider } from "./context/ThemeContext";
// import { AuthProvider } from "./context/AuthContext";
// import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* Public routes */}
//             <Route path="/" element={<Landing />} />
//             <Route path="/about" element={<About />} />

//             {/* Login only if NOT authenticated */}
//             <Route
//               path="/login"
//               element={
//                 <PublicOnlyRoute>
//                   <LoginPage />
//                 </PublicOnlyRoute>
//               }
//             />

//             {/* Protected route */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Fallback */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;














import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public route - accessible to everyone */}
            <Route path="/" element={<Landing />} />
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
            
            
            {/* Protected route - only accessible when logged in */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
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