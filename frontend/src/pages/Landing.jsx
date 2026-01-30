
// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { Feather, BookOpen, Share2, Sparkles, ArrowRight, PenTool } from 'lucide-react';
// import Navbar from '../components/Navbar';
// import { ThemeContext } from '../context/ThemeContext';

// gsap.registerPlugin(ScrollTrigger);

// const Landing = () => {
//   const { isDark } = useContext(ThemeContext);
//   const [showNavbar, setShowNavbar] = useState(false);
//   const [showHero, setShowHero] = useState(true);
//   const heroRef = useRef(null);
//   const welcomeRef = useRef(null);
//   const aboutRef = useRef(null);
//   const featuresRef = useRef(null);
//   const ctaRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       gsap.to(heroRef.current, {
//         opacity: 0,
//         y: -50,
//         duration: 1,
//         ease: 'power2.inOut',
//         onComplete: () => {
//           setShowHero(false);
//           setShowNavbar(true);

//           gsap.fromTo(welcomeRef.current,
//             { opacity: 0, y: 50 },
//             { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
//           );
//         },
//       });
//     }, 3500);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!showHero) {
//       // Animate About section
//       gsap.fromTo(
//         aboutRef.current.querySelectorAll('.fade-in'),
//         { opacity: 0, y: 60 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 1,
//           stagger: 0.2,
//           ease: 'power2.out',
//           scrollTrigger: {
//             trigger: aboutRef.current,
//             start: 'top 70%',
//           },
//         }
//       );

//       // Animate Features section
//       gsap.fromTo(
//         featuresRef.current.querySelectorAll('.fade-in'),
//         { opacity: 0, y: 60 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 1,
//           stagger: 0.15,
//           ease: 'power2.out',
//           scrollTrigger: {
//             trigger: featuresRef.current,
//             start: 'top 70%',
//           },
//         }
//       );

//       // Animate CTA section
//       gsap.fromTo(
//         ctaRef.current.querySelectorAll('.fade-in'),
//         { opacity: 0, scale: 0.9 },
//         {
//           opacity: 1,
//           scale: 1,
//           duration: 1,
//           stagger: 0.1,
//           ease: 'back.out(1.2)',
//           scrollTrigger: {
//             trigger: ctaRef.current,
//             start: 'top 70%',
//           },
//         }
//       );
//     }
//   }, [showHero]);

//   return (
//     <div className="min-h-screen bg-scribe-cream dark:bg-slate-900 transition-colors duration-500">
//       <Navbar showNavbar={showNavbar} />

//       {/* Hero Animation */}
//       {showHero && (
//         <div ref={heroRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-scribe-green via-scribe-sage to-scribe-mint">
//           <div className="text-center">
//             <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 animate-fadeInUp">Scribe</h1>
//             <p className="text-2xl md:text-3xl text-scribe-cream font-light tracking-widest animate-fadeInUp animation-delay-300">
//               Write. Share. Inspire.
//             </p>
//           </div>
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             {[...Array(20)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 100}%`,
//                   animationDelay: `${Math.random() * 3}s`,
//                   animationDuration: `${3 + Math.random() * 4}s`
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {!showHero && (
//         <>
//           {/* Welcome Section */}
//           <section className="min-h-screen relative flex items-center justify-center pt-32 pb-20 bg-scribe-cream dark:bg-slate-900 overflow-hidden">
//             {/* Paper Writing Animation */}
//             <div className="absolute top-1/4 left-1/4 pointer-events-none opacity-10 dark:opacity-5">
//               <div className="animate-float-slow">
//                 <svg width="200" height="250" viewBox="0 0 200 250" fill="none">
//                   <rect x="20" y="0" width="160" height="220" fill={isDark ? "#9CAB84" : "#89986d"} fillOpacity="0.2" rx="8" />
//                   <line x1="40" y1="40" x2="160" y2="40" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.4" strokeWidth="3" />
//                   <line x1="40" y1="70" x2="160" y2="70" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.4" strokeWidth="3" />
//                   <line x1="40" y1="100" x2="130" y2="100" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.4" strokeWidth="3" />
//                   <line x1="40" y1="130" x2="160" y2="130" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.4" strokeWidth="3" />
//                   <line x1="40" y1="160" x2="140" y2="160" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.4" strokeWidth="3" />
//                   <circle cx="170" cy="200" r="8" fill={isDark ? "#C5D89D" : "#9cab84"} opacity="0.6" />
//                   <path d="M 165 195 L 175 205 M 175 195 L 165 205" stroke="#f6f0d7" strokeWidth="2" />
//                 </svg>
//               </div>
//             </div>

//             {/* Bubble Animation - Left */}
//             <div className="absolute left-0 top-1/4 pointer-events-none">
//               {[...Array(5)].map((_, i) => (
//                 <div
//                   key={`bubble-left-${i}`}
//                   className="absolute w-20 h-20 rounded-full bg-scribe-mint/20 dark:bg-scribe-sage/10 animate-bubble"
//                   style={{
//                     left: `${-50 + Math.random() * 100}px`,
//                     top: `${i * 120}px`,
//                     animationDelay: `${i * 0.8}s`,
//                     animationDuration: `${6 + Math.random() * 4}s`
//                   }}
//                 />
//               ))}
//             </div>

//             {/* Bubble Animation - Right */}
//             <div className="absolute right-0 top-1/3 pointer-events-none">
//               {[...Array(5)].map((_, i) => (
//                 <div
//                   key={`bubble-right-${i}`}
//                   className="absolute w-16 h-16 rounded-full bg-scribe-sage/20 dark:bg-scribe-mint/10 animate-bubble"
//                   style={{
//                     right: `${-40 + Math.random() * 80}px`,
//                     top: `${i * 100}px`,
//                     animationDelay: `${i * 0.6}s`,
//                     animationDuration: `${5 + Math.random() * 3}s`
//                   }}
//                 />
//               ))}
//             </div>

//             <div ref={welcomeRef} className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-10">
//               <div className="mb-12 flex justify-center">
//                 <div className="p-6 rounded-full bg-scribe-sage/20 dark:bg-scribe-sage/10">
//                   <Feather size={64} className="text-scribe-green dark:text-scribe-sage" />
//                 </div>
//               </div>
//               <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-gray-800 dark:text-white leading-tight">
//                 Welcome to <span className="text-scribe-green dark:text-scribe-sage">Scribe</span>
//               </h2>
//               <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
//                 Your digital sanctuary for thoughts, stories, and ideas. Where every word matters and every story finds its audience.
//               </p>
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="group px-10 py-5 bg-gradient-to-r from-scribe-green to-scribe-sage text-white text-xl font-semibold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
//               >
//                 <PenTool size={24} />
//                 <span>Start Writing Today</span>
//                 <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
//               </button>
//             </div>
//           </section>

//           {/* About Section */}
//           <section ref={aboutRef} className="min-h-screen relative flex items-center justify-center py-32 bg-scribe-green dark:bg-slate-800 overflow-hidden">
//             <div className="absolute inset-0 pointer-events-none overflow-hidden">
//               <div className="absolute top-20 left-10 animate-float-slow">
//                 <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
//                   <rect x="10" y="0" width="100" height="130" fill={isDark ? "#1e293b" : "#F6F0D7"} fillOpacity="0.15" />
//                   <line x1="20" y1="20" x2="90" y2="20" stroke={isDark ? "#9CAB84" : "#F6F0D7"} strokeOpacity="0.3" strokeWidth="2" />
//                   <line x1="20" y1="35" x2="90" y2="35" stroke={isDark ? "#9CAB84" : "#F6F0D7"} strokeOpacity="0.3" strokeWidth="2" />
//                   <line x1="20" y1="50" x2="75" y2="50" stroke={isDark ? "#9CAB84" : "#F6F0D7"} strokeOpacity="0.3" strokeWidth="2" />
//                 </svg>
//               </div>
//               <div className="absolute bottom-32 right-20 animate-float-slow animation-delay-1000">
//                 <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
//                   <rect x="5" y="0" width="90" height="110" fill={isDark ? "#1e293b" : "#C5D89D"} fillOpacity="0.12" />
//                   <line x1="15" y1="25" x2="80" y2="25" stroke={isDark ? "#C5D89D" : "#C5D89D"} strokeOpacity="0.3" strokeWidth="2" />
//                   <line x1="15" y1="40" x2="80" y2="40" stroke={isDark ? "#C5D89D" : "#C5D89D"} strokeOpacity="0.3" strokeWidth="2" />
//                   <line x1="15" y1="55" x2="65" y2="55" stroke={isDark ? "#C5D89D" : "#C5D89D"} strokeOpacity="0.3" strokeWidth="2" />
//                 </svg>
//               </div>
//             </div>
//             <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
//               <div className="text-center mb-20 fade-in">
//                 <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-scribe-cream">What is Scribe?</h2>
//                 <p className="text-xl md:text-2xl text-scribe-cream/90 max-w-4xl mx-auto leading-relaxed">
//                   Scribe is more than a blogging platform. It's a creative ecosystem designed for writers, thinkers, and storytellers who want to make an impact.
//                 </p>
//               </div>
//               <div className="grid md:grid-cols-3 gap-10">
//                 <div className="fade-in bg-scribe-sage p-10 rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
//                   <Feather size={40} className="text-white mb-6" />
//                   <h3 className="text-3xl font-bold mb-4 text-white">Write Freely</h3>
//                   <p className="text-white/90 text-lg leading-relaxed">Express your thoughts with our intuitive editor. No distractions, just you and your words.</p>
//                 </div>
//                 <div className="fade-in bg-scribe-mint p-10 rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
//                   <Share2 size={40} className="text-white mb-6" />
//                   <h3 className="text-3xl font-bold mb-4 text-white">Share Widely</h3>
//                   <p className="text-white/90 text-lg leading-relaxed">Connect with readers worldwide. Your stories deserve to be heard.</p>
//                 </div>
//                 <div className="fade-in bg-scribe-sage p-10 rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
//                   <Sparkles size={40} className="text-white mb-6" />
//                   <h3 className="text-3xl font-bold mb-4 text-white">Inspire Others</h3>
//                   <p className="text-white/90 text-lg leading-relaxed">Join a community of passionate writers. Inspire and be inspired.</p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Features Section */}
//           <section ref={featuresRef} className="min-h-screen relative flex items-center justify-center py-32 bg-scribe-cream dark:bg-slate-900">
//             <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
//               <div className="text-center mb-20 fade-in">
//                 <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-800 dark:text-white">Powerful Features</h2>
//                 <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
//                   Everything you need to create, publish, and grow your blog.
//                 </p>
//               </div>
//               <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
//                 {[
//                   { icon: '🤖', title: 'AI Writing Assistant', desc: 'Get intelligent suggestions, improve your writing style, and overcome writer\'s block with our AI-powered assistant.' },
//                   { icon: '📊', title: 'Analytics Dashboard', desc: 'Track your progress, understand your audience, and see how much time you\'re investing in your craft.' },
//                   { icon: '✍️', title: 'Rich Text Editor', desc: 'Format your posts beautifully with our intuitive editor. Add images, code blocks, and more.' },
//                   { icon: '💬', title: 'Community Engagement', desc: 'Connect with other writers, receive feedback, and build your audience organically.' }
//                 ].map((feature, i) => (
//                   <div key={i} className="fade-in p-10 rounded-3xl bg-white dark:bg-slate-800 hover:bg-scribe-mint/20 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-scribe-sage/30">
//                     <div className="text-6xl mb-6">{feature.icon}</div>
//                     <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{feature.title}</h3>
//                     <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{feature.desc}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* CTA Section */}
//           <section ref={ctaRef} className="relative py-40 bg-gradient-to-br from-scribe-green via-scribe-sage to-scribe-mint overflow-hidden">
//             <div className="absolute inset-0 pointer-events-none">
//               {[...Array(15)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
//                   style={{
//                     left: `${Math.random() * 100}%`,
//                     top: `${Math.random() * 100}%`,
//                     animationDelay: `${Math.random() * 3}s`
//                   }}
//                 />
//               ))}
//             </div>
//             <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-10 relative">
//               <BookOpen size={80} className="mx-auto mb-10 text-white fade-in" />
//               <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white fade-in">
//                 Ready to Start Your Journey?
//               </h2>
//               <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed fade-in">
//                 Join thousands of writers who are already sharing their stories on Scribe.
//               </p>
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="fade-in group px-12 py-6 bg-white text-scribe-green text-xl font-bold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
//               >
//                 <span>Get Started for Free</span>
//                 <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
//               </button>
//             </div>
//           </section>

//           {/* Footer */}
//           <footer className="py-12 bg-scribe-cream dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
//             <div className="max-w-6xl mx-auto px-6 text-center">
//               <p className="text-gray-600 dark:text-gray-400">© 2026 Scribe. Where every word finds its place.</p>
//             </div>
//           </footer>
//         </>
//       )}
//     </div>
//   );
// };

// export default Landing;













import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Feather, BookOpen, Share2, Sparkles, ArrowRight, PenTool } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const { isDark } = useContext(ThemeContext);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [startTyping, setStartTyping] = useState(false);
  const heroRef = useRef(null);
  const welcomeRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to(heroRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          setShowHero(false);
          setShowNavbar(true);

          gsap.fromTo(welcomeRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
          );
        },
      });
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showHero) {
      // Animate About section
      gsap.fromTo(
        aboutRef.current.querySelectorAll('.fade-in'),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 70%',
            onEnter: () => setStartTyping(true), // Start typing when section enters viewport
          },
        }
      );

      // Animate Features section
      gsap.fromTo(
        featuresRef.current.querySelectorAll('.fade-in'),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 70%',
          },
        }
      );

      // Animate CTA section
      gsap.fromTo(
        ctaRef.current.querySelectorAll('.fade-in'),
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 70%',
          },
        }
      );
    }
  }, [showHero]);

  return (
    <div className="min-h-screen bg-scribe-cream dark:bg-slate-900 transition-colors duration-500">
      <Navbar showNavbar={showNavbar} />

      {/* Hero Animation */}
      {showHero && (
        <div ref={heroRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-scribe-green via-scribe-sage to-scribe-mint">
          <div className="text-center">
            <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 animate-fadeInUp">Scribe</h1>
            <p className="text-2xl md:text-3xl text-scribe-cream font-light tracking-widest animate-fadeInUp animation-delay-300">
              Write. Share. Inspire.
            </p>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {!showHero && (
        <>
          {/* Welcome Section */}
          <section className="min-h-screen relative flex items-center justify-center pt-32 pb-20 bg-scribe-cream dark:bg-slate-900 overflow-hidden">
            {/* Enhanced Paper Writing Animation - More visible in light mode */}
            <div className="absolute top-1/4 left-1/4 pointer-events-none opacity-30 dark:opacity-10 animate-float-slow">
              <svg width="200" height="250" viewBox="0 0 200 250" fill="none">
                <rect x="20" y="0" width="160" height="220" fill={isDark ? "#9CAB84" : "#89986d"} fillOpacity="0.4" rx="8" />
                <line x1="40" y1="40" x2="160" y2="40" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.6" strokeWidth="3" />
                <line x1="40" y1="70" x2="160" y2="70" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.6" strokeWidth="3" />
                <line x1="40" y1="100" x2="130" y2="100" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.6" strokeWidth="3" />
                <line x1="40" y1="130" x2="160" y2="130" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.6" strokeWidth="3" />
                <line x1="40" y1="160" x2="140" y2="160" stroke={isDark ? "#9CAB84" : "#89986d"} strokeOpacity="0.6" strokeWidth="3" />
                <circle cx="170" cy="200" r="8" fill={isDark ? "#C5D89D" : "#89986d"} opacity="0.7" />
                <path d="M 165 195 L 175 205 M 175 195 L 165 205" stroke="#f6f0d7" strokeWidth="2" />
              </svg>
            </div>

            {/* Enhanced Bubble Animation - More visible in light mode */}
            <div className="absolute left-0 top-1/4 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`bubble-left-${i}`}
                  className="absolute w-20 h-20 rounded-full bg-scribe-sage/40 dark:bg-scribe-sage/10 animate-bubble border-2 border-scribe-sage/30 dark:border-scribe-sage/5"
                  style={{
                    left: `${-50 + Math.random() * 100}px`,
                    top: `${i * 120}px`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${6 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            {/* Enhanced Bubble Animation - Right - More visible */}
            <div className="absolute right-0 top-1/3 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`bubble-right-${i}`}
                  className="absolute w-16 h-16 rounded-full bg-scribe-mint/50 dark:bg-scribe-mint/10 animate-bubble border-2 border-scribe-mint/40 dark:border-scribe-mint/5"
                  style={{
                    right: `${-40 + Math.random() * 80}px`,
                    top: `${i * 100}px`,
                    animationDelay: `${i * 0.6}s`,
                    animationDuration: `${5 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            <div ref={welcomeRef} className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-10">
              <div className="mb-12 flex justify-center animate-scaleIn">
                <div className="p-6 rounded-full bg-scribe-sage/30 dark:bg-scribe-sage/10 animate-pulse-glow shadow-lg">
                  <Feather size={64} className="text-scribe-green dark:text-scribe-sage" />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="text-gray-800 dark:text-white animate-slideInLeft">Welcome to </span>
                <span className="text-scribe-green dark:text-scribe-sage animate-slideInRight animation-delay-300">Scribe</span>
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed animate-fadeInUp animation-delay-500">
                Your digital sanctuary for thoughts, stories, and ideas. Where every word matters and every story finds its audience.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="animate-fadeInUp animation-delay-700 group px-10 py-5 bg-gradient-to-r from-scribe-green to-scribe-sage text-white text-xl font-semibold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <PenTool size={24} />
                <span>Start Writing Today</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </section>

          {/* About Section with Typing Animation */}
          <section ref={aboutRef} className="min-h-screen relative flex items-center justify-center py-32 bg-scribe-green dark:bg-slate-800 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 left-10 animate-float-slow opacity-20 dark:opacity-10">
                <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                  <rect x="10" y="0" width="100" height="130" fill={isDark ? "#1e293b" : "#F6F0D7"} fillOpacity="0.3" />
                  <line x1="20" y1="20" x2="90" y2="20" stroke={isDark ? "#9CAB84" : "#F6F0D7"} strokeOpacity="0.5" strokeWidth="2" />
                  <line x1="20" y1="35" x2="90" y2="35" stroke={isDark ? "#9CAB84" : "#F6F0D7"} strokeOpacity="0.5" strokeWidth="2" />
                  <line x1="20" y1="50" x2="75" y2="50" stroke={isDark ? "#9CAB84" : "#F6F0D7"} strokeOpacity="0.5" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute bottom-32 right-20 animate-float-slow animation-delay-1000 opacity-20 dark:opacity-10">
                <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
                  <rect x="5" y="0" width="90" height="110" fill={isDark ? "#1e293b" : "#C5D89D"} fillOpacity="0.3" />
                  <line x1="15" y1="25" x2="80" y2="25" stroke={isDark ? "#C5D89D" : "#C5D89D"} strokeOpacity="0.5" strokeWidth="2" />
                  <line x1="15" y1="40" x2="80" y2="40" stroke={isDark ? "#C5D89D" : "#C5D89D"} strokeOpacity="0.5" strokeWidth="2" />
                  <line x1="15" y1="55" x2="65" y2="55" stroke={isDark ? "#C5D89D" : "#C5D89D"} strokeOpacity="0.5" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
              <div className="text-center mb-20 fade-in">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-scribe-cream inline-block">
                  <span className={startTyping ? 'animate-typing border-scribe-cream' : 'opacity-0'}>What is Scribe?</span>
                </h2>
                <p className="text-xl md:text-2xl text-scribe-cream/90 max-w-4xl mx-auto leading-relaxed">
                  Scribe is more than a blogging platform. It's a creative ecosystem designed for writers, thinkers, and storytellers who want to make an impact.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                <div className="fade-in bg-scribe-sage p-10 rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <Feather size={40} className="text-white mb-6" />
                  <h3 className="text-3xl font-bold mb-4 text-white">Write Freely</h3>
                  <p className="text-white/90 text-lg leading-relaxed">Express your thoughts with our intuitive editor. No distractions, just you and your words.</p>
                </div>
                <div className="fade-in bg-scribe-mint p-10 rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <Share2 size={40} className="text-white mb-6" />
                  <h3 className="text-3xl font-bold mb-4 text-white">Share Widely</h3>
                  <p className="text-white/90 text-lg leading-relaxed">Connect with readers worldwide. Your stories deserve to be heard.</p>
                </div>
                <div className="fade-in bg-scribe-sage p-10 rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <Sparkles size={40} className="text-white mb-6" />
                  <h3 className="text-3xl font-bold mb-4 text-white">Inspire Others</h3>
                  <p className="text-white/90 text-lg leading-relaxed">Join a community of passionate writers. Inspire and be inspired.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section ref={featuresRef} className="min-h-screen relative flex items-center justify-center py-32 bg-scribe-cream dark:bg-slate-900">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
              <div className="text-center mb-20 fade-in">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-800 dark:text-white">Powerful Features</h2>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Everything you need to create, publish, and grow your blog.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                {[
                  { icon: '🤖', title: 'AI Writing Assistant', desc: 'Get intelligent suggestions, improve your writing style, and overcome writer\'s block with our AI-powered assistant.' },
                  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track your progress, understand your audience, and see how much time you\'re investing in your craft.' },
                  { icon: '✍️', title: 'Rich Text Editor', desc: 'Format your posts beautifully with our intuitive editor. Add images, code blocks, and more.' },
                  { icon: '💬', title: 'Community Engagement', desc: 'Connect with other writers, receive feedback, and build your audience organically.' }
                ].map((feature, i) => (
                  <div key={i} className="fade-in p-10 rounded-3xl bg-white dark:bg-slate-800 hover:bg-scribe-mint/20 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-scribe-sage/30">
                    <div className="text-6xl mb-6">{feature.icon}</div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section ref={ctaRef} className="relative py-40 bg-gradient-to-br from-scribe-green via-scribe-sage to-scribe-mint overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
            <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-10 relative">
              <BookOpen size={80} className="mx-auto mb-10 text-white fade-in" />
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white fade-in">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed fade-in">
                Join thousands of writers who are already sharing their stories on Scribe.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="fade-in group px-12 py-6 bg-white text-scribe-green text-xl font-bold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <span>Get Started for Free</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-scribe-cream dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">© 2026 Scribe. Where every word finds its place.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Landing;


