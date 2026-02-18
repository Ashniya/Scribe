


// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, X, User, LogOut } from 'lucide-react';
// import { ThemeContext } from '../context/ThemeContext';

// const Navbar = ({ isAuthenticated = false, userName = 'User', showNavbar = true }) => {
//   const { isDark, setIsDark } = useContext(ThemeContext);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [isSwinging, setIsSwinging] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleThemeToggle = () => {
//     setIsDark(!isDark);
//     setIsSwinging(true);
//     setTimeout(() => setIsSwinging(false), 1000);
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
//                 <Link to="/signup" className="px-7 py-3 rounded-full bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-white dark:text-white font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
//                   Get Started
//                 </Link>
//               </>
//             )}

//             {/* Flat Dome Lamp Toggle with Light Rays */}
//             <button 
//               onClick={handleThemeToggle}
//               className="relative w-20 h-28 flex flex-col items-center group"
//               aria-label="Toggle theme"
//             >
//               {/* Wire/Cord */}
//               <div className="w-0.5 h-10 bg-gray-800 dark:bg-gray-400 transition-colors duration-300"></div>

//               {/* Lamp Container with Swing Animation */}
//               <div className={`relative ${isSwinging ? 'animate-lamp-swing' : ''}`}>
//                 {/* Light Rays (visible only when ON) */}
//                 {!isDark && (
//                   <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-40 overflow-visible pointer-events-none">
//                     {/* Center ray */}
//                     <div 
//                       className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2 animate-pulse"
//                       style={{ animationDuration: '2s' }}
//                     ></div>

//                     {/* Left rays */}
//                     <div 
//                       className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-20"
//                       style={{ animationDuration: '2.2s' }}
//                     ></div>
//                     <div 
//                       className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 -rotate-35 animate-pulse"
//                       style={{ animationDuration: '2.5s' }}
//                     ></div>

//                     {/* Right rays */}
//                     <div 
//                       className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-20 animate-pulse"
//                       style={{ animationDuration: '2.3s' }}
//                     ></div>
//                     <div 
//                       className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 rotate-35 animate-pulse"
//                       style={{ animationDuration: '2.6s' }}
//                     ></div>
//                   </div>
//                 )}

//                 {/* Lamp Shade */}
//                 <svg width="60" height="50" viewBox="0 0 60 50" className="relative drop-shadow-lg">
//                   {/* Top connector */}
//                   <rect x="27" y="0" width="6" height="4" fill={isDark ? "#374151" : "#1f2937"} rx="1"/>

//                   {/* Main dome shade - flat industrial style */}
//                   <path
//                     d="M 15 6 L 45 6 L 50 18 Q 50 20, 48 20 L 12 20 Q 10 20, 10 18 Z"
//                     fill={isDark ? "#374151" : "#1f2937"}
//                     stroke={isDark ? "#1f2937" : "#111827"}
//                     strokeWidth="1"
//                     className="transition-all duration-500"
//                   />

//                   {/* Bottom rim highlight */}
//                   <ellipse 
//                     cx="30" 
//                     cy="20" 
//                     rx="19" 
//                     ry="2" 
//                     fill={isDark ? "#1f2937" : "#111827"}
//                     opacity="0.8"
//                   />

//                   {/* Light bulb - visible when ON */}
//                   {!isDark && (
//                     <>
//                       {/* Bulb glow */}
//                       <circle 
//                         cx="30" 
//                         cy="26" 
//                         r="6" 
//                         fill="#fef3c7" 
//                         opacity="0.9"
//                         className="animate-pulse"
//                       />
//                       {/* Bulb */}
//                       <circle 
//                         cx="30" 
//                         cy="26" 
//                         r="4" 
//                         fill="url(#bulbGradient)"
//                       />
//                       {/* Bulb highlight */}
//                       <circle 
//                         cx="29" 
//                         cy="25" 
//                         r="1.5" 
//                         fill="#fffbeb"
//                       />
//                     </>
//                   )}

//                   <defs>
//                     <radialGradient id="bulbGradient" cx="50%" cy="50%" r="50%">
//                       <stop offset="0%" stopColor="#fef3c7" />
//                       <stop offset="100%" stopColor="#fde68a" />
//                     </radialGradient>
//                   </defs>
//                 </svg>
//               </div>

//               {/* Tooltip */}
//               <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//                 {isDark ? 'Turn on' : 'Turn off'}
//               </span>
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex items-center space-x-4 md:hidden ml-auto">
//             {/* Mobile Lamp Toggle */}
//             <button 
//               onClick={handleThemeToggle}
//               className="relative w-16 h-24 flex flex-col items-center"
//               aria-label="Toggle theme"
//             >
//               <div className="w-0.5 h-8 bg-gray-800 dark:bg-gray-400"></div>
//               <div className={`relative ${isSwinging ? 'animate-lamp-swing' : ''}`}>
//                 {!isDark && (
//                   <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-24 h-32 overflow-visible pointer-events-none">
//                     <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2"></div>
//                     <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-25"></div>
//                     <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-25"></div>
//                   </div>
//                 )}

//                 <svg width="50" height="40" viewBox="0 0 50 40" className="relative">
//                   <rect x="22" y="0" width="6" height="3" fill={isDark ? "#374151" : "#1f2937"} rx="1"/>
//                   <path
//                     d="M 12 5 L 38 5 L 42 15 Q 42 17, 40 17 L 10 17 Q 8 17, 8 15 Z"
//                     fill={isDark ? "#374151" : "#1f2937"}
//                     stroke={isDark ? "#1f2937" : "#111827"}
//                     strokeWidth="1"
//                   />
//                   <ellipse cx="25" cy="17" rx="16" ry="1.5" fill={isDark ? "#1f2937" : "#111827"} opacity="0.8"/>

//                   {!isDark && (
//                     <>
//                       <circle cx="25" cy="22" r="5" fill="#fef3c7" opacity="0.9"/>
//                       <circle cx="25" cy="22" r="3" fill="url(#bulbGradientMobile)"/>
//                     </>
//                   )}

//                   <defs>
//                     <radialGradient id="bulbGradientMobile" cx="50%" cy="50%" r="50%">
//                       <stop offset="0%" stopColor="#fef3c7" />
//                       <stop offset="100%" stopColor="#fde68a" />
//                     </radialGradient>
//                   </defs>
//                 </svg>
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
//               <Link to="/signup" className="block px-4 py-2.5 text-center bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-white dark:text-white rounded-lg font-medium">
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


















import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ isAuthenticated = false, userName = 'User', userProfilePic = null, showNavbar = true }) => {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 1000);
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
                  {userProfilePic ? (
                    <img src={userProfilePic} alt={userName} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User size={20} className="text-scribe-green dark:text-scribe-mint" />
                  )}
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
                <Link to="/dashboard" className="px-7 py-3 rounded-full bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-white dark:text-white font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Get Started
                </Link>
              </>
            )}

            {/* Flat Dome Lamp Toggle with Light Rays */}
            <button
              onClick={handleThemeToggle}
              className="relative w-20 h-28 flex flex-col items-center group"
              aria-label="Toggle theme"
            >
              {/* Wire/Cord */}
              <div className="w-0.5 h-10 bg-gray-800 dark:bg-gray-400 transition-colors duration-300"></div>

              {/* Lamp Container with Swing Animation */}
              <div className={`relative ${isSwinging ? 'animate-lamp-swing' : ''}`}>
                {/* Light Rays (visible only when ON) */}
                {!isDark && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-40 overflow-visible pointer-events-none">
                    {/* Center ray */}
                    <div
                      className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2 animate-pulse"
                      style={{ animationDuration: '2s' }}
                    ></div>

                    {/* Left rays */}
                    <div
                      className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-20"
                      style={{ animationDuration: '2.2s' }}
                    ></div>
                    <div
                      className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 -rotate-35 animate-pulse"
                      style={{ animationDuration: '2.5s' }}
                    ></div>

                    {/* Right rays */}
                    <div
                      className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-20 animate-pulse"
                      style={{ animationDuration: '2.3s' }}
                    ></div>
                    <div
                      className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 rotate-35 animate-pulse"
                      style={{ animationDuration: '2.6s' }}
                    ></div>
                  </div>
                )}

                {/* Lamp Shade */}
                <svg width="60" height="50" viewBox="0 0 60 50" className="relative drop-shadow-lg">
                  {/* Top connector */}
                  <rect x="27" y="0" width="6" height="4" fill={isDark ? "#374151" : "#1f2937"} rx="1" />

                  {/* Main dome shade - flat industrial style */}
                  <path
                    d="M 15 6 L 45 6 L 50 18 Q 50 20, 48 20 L 12 20 Q 10 20, 10 18 Z"
                    fill={isDark ? "#374151" : "#1f2937"}
                    stroke={isDark ? "#1f2937" : "#111827"}
                    strokeWidth="1"
                    className="transition-all duration-500"
                  />

                  {/* Bottom rim highlight */}
                  <ellipse
                    cx="30"
                    cy="20"
                    rx="19"
                    ry="2"
                    fill={isDark ? "#1f2937" : "#111827"}
                    opacity="0.8"
                  />

                  {/* Light bulb - visible when ON */}
                  {!isDark && (
                    <>
                      {/* Bulb glow */}
                      <circle
                        cx="30"
                        cy="26"
                        r="6"
                        fill="#fef3c7"
                        opacity="0.9"
                        className="animate-pulse"
                      />
                      {/* Bulb */}
                      <circle
                        cx="30"
                        cy="26"
                        r="4"
                        fill="url(#bulbGradient)"
                      />
                      {/* Bulb highlight */}
                      <circle
                        cx="29"
                        cy="25"
                        r="1.5"
                        fill="#fffbeb"
                      />
                    </>
                  )}

                  <defs>
                    <radialGradient id="bulbGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fde68a" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Tooltip */}
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {isDark ? 'Turn on' : 'Turn off'}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden ml-auto">
            {/* Mobile Lamp Toggle */}
            <button
              onClick={handleThemeToggle}
              className="relative w-16 h-24 flex flex-col items-center"
              aria-label="Toggle theme"
            >
              <div className="w-0.5 h-8 bg-gray-800 dark:bg-gray-400"></div>
              <div className={`relative ${isSwinging ? 'animate-lamp-swing' : ''}`}>
                {!isDark && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-24 h-32 overflow-visible pointer-events-none">
                    <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2"></div>
                    <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-25"></div>
                    <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-25"></div>
                  </div>
                )}

                <svg width="50" height="40" viewBox="0 0 50 40" className="relative">
                  <rect x="22" y="0" width="6" height="3" fill={isDark ? "#374151" : "#1f2937"} rx="1" />
                  <path
                    d="M 12 5 L 38 5 L 42 15 Q 42 17, 40 17 L 10 17 Q 8 17, 8 15 Z"
                    fill={isDark ? "#374151" : "#1f2937"}
                    stroke={isDark ? "#1f2937" : "#111827"}
                    strokeWidth="1"
                  />
                  <ellipse cx="25" cy="17" rx="16" ry="1.5" fill={isDark ? "#1f2937" : "#111827"} opacity="0.8" />

                  {!isDark && (
                    <>
                      <circle cx="25" cy="22" r="5" fill="#fef3c7" opacity="0.9" />
                      <circle cx="25" cy="22" r="3" fill="url(#bulbGradientMobile)" />
                    </>
                  )}

                  <defs>
                    <radialGradient id="bulbGradientMobile" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fde68a" />
                    </radialGradient>
                  </defs>
                </svg>
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
                {userProfilePic ? (
                  <img src={userProfilePic} alt={userName} className="w-[18px] h-[18px] rounded-full object-cover" />
                ) : (
                  <User size={18} className="text-scribe-green dark:text-scribe-mint" />
                )}
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
              <Link to="/dashboard" className="block px-4 py-2.5 text-center bg-gradient-to-r from-scribe-green to-scribe-sage dark:from-scribe-mint dark:to-scribe-sage text-white dark:text-white rounded-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
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