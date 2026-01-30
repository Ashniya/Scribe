
// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Moon, Sun, Menu, X, User, LogOut } from 'lucide-react';
// import { ThemeContext } from '../context/ThemeContext';

// const Navbar = ({ isAuthenticated = false, userName = 'User', showNavbar = true }) => {
//   const { isDark, setIsDark } = useContext(ThemeContext);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   if (!showNavbar) return null;

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm'}`}>
//       <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
//         <div className="flex justify-between items-center h-24">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3 group">
//             <span className="text-3xl font-bold bg-linear-to-r from-scribe-green via-scribe-sage to-scribe-mint bg-clip-text text-transparent">Scribe</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-10">
//             <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-scribe-green dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">About Us</Link>
//             <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-scribe-green dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">Contact</Link>

//             {isAuthenticated ? (
//               <>
//                 <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-scribe-cream dark:bg-slate-800">
//                   <User size={20} />
//                   <span className="font-medium text-lg">{userName}</span>
//                 </div>
//                 <button onClick={() => navigate('/')} className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-scribe-green text-white hover:bg-scribe-sage transition-all duration-300 font-medium text-lg">
//                   <LogOut size={20} />
//                   <span>Logout</span>
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-scribe-green dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">Log In</Link>
//                 <Link to="/signup" className="px-7 py-3 rounded-full bg-linear-to-r from-scribe-green to-scribe-sage text-white font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">Get Started</Link>
//               </>
//             )}

//             <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-full bg-scribe-cream dark:bg-slate-800 hover:scale-110 transition-all duration-300">
//               {isDark ? <Sun size={22} className="text-yellow-500" /> : <Moon size={22} className="text-gray-700" />}
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex items-center space-x-4 md:hidden">
//             <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-scribe-cream dark:bg-slate-800">
//               {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
//             </button>
//             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg">
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
//         <div className="px-4 pt-2 pb-6 space-y-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg">
//           <Link to="/about" className="block px-4 py-2.5 rounded-lg hover:bg-scribe-cream dark:hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
//           <Link to="/contact" className="block px-4 py-2.5 rounded-lg hover:bg-scribe-cream dark:hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
//           {isAuthenticated ? (
//             <>
//               <div className="flex items-center space-x-2 px-4 py-2.5 bg-scribe-cream dark:bg-slate-800 rounded-lg">
//                 <User size={18} />
//                 <span>{userName}</span>
//               </div>
//               <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-scribe-green text-white rounded-lg">
//                 <LogOut size={18} />
//                 <span>Logout</span>
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="block px-4 py-2.5 rounded-lg hover:bg-scribe-cream dark:hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
//               <Link to="/signup" className="block px-4 py-2.5 text-center bg-linear-to-r from-scribe-green to-scribe-sage text-white rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, User, LogOut } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ isAuthenticated = false, userName = 'User', showNavbar = true }) => {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  if (!showNavbar) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-scribe-cream/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-scribe-cream/80 dark:bg-slate-900/80 backdrop-blur-sm'}`}>
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Far Left */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <span className="text-3xl font-bold bg-gradient-to-r from-scribe-green via-[#7a8861] to-scribe-sage bg-clip-text text-transparent">
              Scribe
            </span>
          </Link>

          {/* Desktop Menu - Far Right */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link to="/about" className="text-scribe-green dark:text-scribe-mint hover:text-scribe-sage dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
              About Us
            </Link>
            <Link to="/contact" className="text-scribe-green dark:text-scribe-mint hover:text-scribe-sage dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-slate-800 border border-scribe-sage/30 dark:border-scribe-mint/30">
                  <User size={20} className="text-scribe-green dark:text-scribe-mint" />
                  <span className="font-medium text-lg text-scribe-green dark:text-scribe-mint">{userName}</span>
                </div>
                <button onClick={() => navigate('/')} className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-scribe-green dark:bg-scribe-mint text-scribe-cream dark:text-scribe-green hover:bg-scribe-sage dark:hover:bg-scribe-sage transition-all duration-300 font-medium text-lg">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-scribe-green dark:text-scribe-mint hover:text-scribe-sage dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
                  Log In
                </Link>
                <Link to="/signup" className="px-7 py-3 rounded-full bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-scribe-cream dark:text-scribe-green font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Get Started
                </Link>
              </>
            )}

            {/* Beautiful Theme Toggle */}
            <button 
              onClick={handleThemeToggle}
              className="relative w-16 h-8 rounded-full bg-gradient-to-r from-scribe-sage to-scribe-mint dark:from-slate-700 dark:to-slate-600 p-1 transition-all duration-300 hover:shadow-lg group"
            >
              <div className={`absolute w-6 h-6 rounded-full bg-white dark:bg-scribe-mint shadow-md transform transition-all duration-300 flex items-center justify-center ${isDark ? 'translate-x-8' : 'translate-x-0'}`}>
                {isDark ? (
                  <Moon size={14} className="text-scribe-green" />
                ) : (
                  <Sun size={14} className="text-scribe-green" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <Sun size={12} className={`transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-0'} text-white`} />
                <Moon size={12} className={`transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-30'} text-white`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden ml-auto">
            <button 
              onClick={handleThemeToggle}
              className="relative w-14 h-7 rounded-full bg-gradient-to-r from-scribe-sage to-scribe-mint dark:from-slate-700 dark:to-slate-600 p-1 transition-all duration-300"
            >
              <div className={`w-5 h-5 rounded-full bg-white dark:bg-scribe-mint shadow-md transform transition-all duration-300 flex items-center justify-center ${isDark ? 'translate-x-7' : 'translate-x-0'}`}>
                {isDark ? (
                  <Moon size={12} className="text-scribe-green" />
                ) : (
                  <Sun size={12} className="text-scribe-green" />
                )}
              </div>
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-scribe-green dark:text-scribe-mint">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-3 bg-scribe-cream/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg">
          <Link to="/about" className="block px-4 py-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 text-scribe-green dark:text-scribe-mint" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="block px-4 py-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 text-scribe-green dark:text-scribe-mint" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-white/60 dark:bg-slate-800 rounded-lg border border-scribe-sage/30 dark:border-scribe-mint/30">
                <User size={18} className="text-scribe-green dark:text-scribe-mint" />
                <span className="text-scribe-green dark:text-scribe-mint">{userName}</span>
              </div>
              <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-scribe-green dark:bg-scribe-mint text-scribe-cream dark:text-scribe-green rounded-lg">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 text-scribe-green dark:text-scribe-mint" onClick={() => setIsMobileMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/signup" className="block px-4 py-2.5 text-center bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-scribe-cream dark:text-scribe-green rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;








// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Moon, Sun, Menu, X, User, LogOut } from 'lucide-react';
// import { ThemeContext } from '../context/ThemeContext';

// const Navbar = ({ isAuthenticated = false, userName = 'User', showNavbar = true }) => {
//   const { isDark, setIsDark } = useContext(ThemeContext);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   if (!showNavbar) return null;

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm'}`}>
//       <div className="w-full px-6 sm:px-8 lg:px-12">
//         <div className="flex justify-between items-center h-24">
//           {/* Logo - Far Left */}
//           <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
//             <span className="text-3xl font-bold bg-gradient-to-r from-scribe-green via-scribe-sage to-scribe-mint bg-clip-text text-transparent">
//               Scribe
//             </span>
//           </Link>

//           {/* Desktop Menu - Far Right */}
//           <div className="hidden md:flex items-center space-x-8 ml-auto">
//             <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-scribe-green dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
//               About Us
//             </Link>
//             <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-scribe-green dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
//               Contact
//             </Link>

//             {isAuthenticated ? (
//               <>
//                 <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-scribe-cream dark:bg-slate-800">
//                   <User size={20} />
//                   <span className="font-medium text-lg">{userName}</span>
//                 </div>
//                 <button onClick={() => navigate('/')} className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-scribe-green text-white hover:bg-scribe-sage transition-all duration-300 font-medium text-lg">
//                   <LogOut size={20} />
//                   <span>Logout</span>
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-scribe-green dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
//                   Log In
//                 </Link>
//                 <Link to="/signup" className="px-7 py-3 rounded-full bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
//                   Get Started
//                 </Link>
//               </>
//             )}

//             <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-full bg-scribe-cream dark:bg-slate-800 hover:scale-110 transition-all duration-300">
//               {isDark ? <Sun size={22} className="text-yellow-500" /> : <Moon size={22} className="text-gray-700" />}
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex items-center space-x-4 md:hidden ml-auto">
//             <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-scribe-cream dark:bg-slate-800">
//               {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
//             </button>
//             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-gray-700 dark:text-gray-300">
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
//         <div className="px-4 pt-2 pb-6 space-y-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg">
//           <Link to="/about" className="block px-4 py-2.5 rounded-lg hover:bg-scribe-cream dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
//             About Us
//           </Link>
//           <Link to="/contact" className="block px-4 py-2.5 rounded-lg hover:bg-scribe-cream dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
//             Contact
//           </Link>
//           {isAuthenticated ? (
//             <>
//               <div className="flex items-center space-x-2 px-4 py-2.5 bg-scribe-cream dark:bg-slate-800 rounded-lg">
//                 <User size={18} />
//                 <span>{userName}</span>
//               </div>
//               <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-scribe-green text-white rounded-lg">
//                 <LogOut size={18} />
//                 <span>Logout</span>
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="block px-4 py-2.5 rounded-lg hover:bg-scribe-cream dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
//                 Log In
//               </Link>
//               <Link to="/signup" className="block px-4 py-2.5 text-center bg-gradient-to-r from-scribe-green to-scribe-sage text-white rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
//                 Get Started
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;









// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Moon, Sun, Menu, X, User, LogOut } from 'lucide-react';
// import { ThemeContext } from '../context/ThemeContext';

// const Navbar = ({ isAuthenticated = false, userName = 'User', showNavbar = true }) => {
//   const { isDark, setIsDark } = useContext(ThemeContext);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleThemeToggle = () => {
//     setIsDark(!isDark);
//   };

//   if (!showNavbar) return null;

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-scribe-cream/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-scribe-cream/80 dark:bg-slate-900/80 backdrop-blur-sm'}`}>
//       <div className="w-full px-6 sm:px-8 lg:px-12">
//         <div className="flex justify-between items-center h-24">
//           {/* Logo - Far Left */}
//           <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
//             <span className="text-3xl font-bold bg-gradient-to-r from-scribe-green via-[#7a8861] to-scribe-sage bg-clip-text text-transparent">
//               Scribe
//             </span>
//           </Link>

//           {/* Desktop Menu - Far Right */}
//           <div className="hidden md:flex items-center space-x-8 ml-auto">
//             <Link to="/about" className="text-scribe-green dark:text-scribe-mint hover:text-scribe-sage dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
//               About Us
//             </Link>
//             <Link to="/contact" className="text-scribe-green dark:text-scribe-mint hover:text-scribe-sage dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
//               Contact
//             </Link>

//             {isAuthenticated ? (
//               <>
//                 <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-slate-800 border border-scribe-sage/30 dark:border-scribe-mint/30">
//                   <User size={20} className="text-scribe-green dark:text-scribe-mint" />
//                   <span className="font-medium text-lg text-scribe-green dark:text-scribe-mint">{userName}</span>
//                 </div>
//                 <button onClick={() => navigate('/')} className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-scribe-green dark:bg-scribe-mint text-scribe-cream dark:text-scribe-green hover:bg-scribe-sage dark:hover:bg-scribe-sage transition-all duration-300 font-medium text-lg">
//                   <LogOut size={20} />
//                   <span>Logout</span>
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="text-scribe-green dark:text-scribe-mint hover:text-scribe-sage dark:hover:text-scribe-sage transition-colors duration-300 font-medium text-lg">
//                   Log In
//                 </Link>
//                 <Link to="/signup" className="px-7 py-3 rounded-full bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-scribe-cream dark:text-scribe-green font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
//                   Get Started
//                 </Link>
//               </>
//             )}

//             {/* Beautiful Theme Toggle */}
//             <button 
//               onClick={handleThemeToggle}
//               className="relative w-16 h-8 rounded-full bg-gradient-to-r from-scribe-sage to-scribe-mint dark:from-slate-700 dark:to-slate-600 p-1 transition-all duration-300 hover:shadow-lg group"
//             >
//               <div className={`absolute w-6 h-6 rounded-full bg-white dark:bg-scribe-mint shadow-md transform transition-all duration-300 flex items-center justify-center ${isDark ? 'translate-x-8' : 'translate-x-0'}`}>
//                 {isDark ? (
//                   <Moon size={14} className="text-scribe-green" />
//                 ) : (
//                   <Sun size={14} className="text-scribe-green" />
//                 )}
//               </div>
//               <div className="absolute inset-0 flex items-center justify-between px-2">
//                 <Sun size={12} className={`transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-0'} text-white`} />
//                 <Moon size={12} className={`transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-30'} text-white`} />
//               </div>
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex items-center space-x-4 md:hidden ml-auto">
//             <button 
//               onClick={handleThemeToggle}
//               className="relative w-14 h-7 rounded-full bg-gradient-to-r from-scribe-sage to-scribe-mint dark:from-slate-700 dark:to-slate-600 p-1 transition-all duration-300"
//             >
//               <div className={`w-5 h-5 rounded-full bg-white dark:bg-scribe-mint shadow-md transform transition-all duration-300 flex items-center justify-center ${isDark ? 'translate-x-7' : 'translate-x-0'}`}>
//                 {isDark ? (
//                   <Moon size={12} className="text-scribe-green" />
//                 ) : (
//                   <Sun size={12} className="text-scribe-green" />
//                 )}
//               </div>
//             </button>
//             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-scribe-green dark:text-scribe-mint">
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
//         <div className="px-4 pt-2 pb-6 space-y-3 bg-scribe-cream/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg">
//           <Link to="/about" className="block px-4 py-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 text-scribe-green dark:text-scribe-mint" onClick={() => setIsMobileMenuOpen(false)}>
//             About Us
//           </Link>
//           <Link to="/contact" className="block px-4 py-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 text-scribe-green dark:text-scribe-mint" onClick={() => setIsMobileMenuOpen(false)}>
//             Contact
//           </Link>
//           {isAuthenticated ? (
//             <>
//               <div className="flex items-center space-x-2 px-4 py-2.5 bg-white/60 dark:bg-slate-800 rounded-lg border border-scribe-sage/30 dark:border-scribe-mint/30">
//                 <User size={18} className="text-scribe-green dark:text-scribe-mint" />
//                 <span className="text-scribe-green dark:text-scribe-mint">{userName}</span>
//               </div>
//               <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-scribe-green dark:bg-scribe-mint text-scribe-cream dark:text-scribe-green rounded-lg">
//                 <LogOut size={18} />
//                 <span>Logout</span>
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="block px-4 py-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 text-scribe-green dark:text-scribe-mint" onClick={() => setIsMobileMenuOpen(false)}>
//                 Log In
//               </Link>
//               <Link to="/signup" className="block px-4 py-2.5 text-center bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-scribe-cream dark:text-scribe-green rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
//                 Get Started
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;