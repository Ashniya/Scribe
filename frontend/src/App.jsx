// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import React from 'react';
// import Landing from './pages/Landing';
// import { ThemeProvider } from './context/ThemeContext';

// function App() {
//   return (
//     <ThemeProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Landing />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;





import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Landing from './pages/Landing';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;