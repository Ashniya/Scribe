

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Landing from './pages/Landing';
import { ThemeProvider } from './context/ThemeContext';
import About from './pages/About';
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
                    <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;