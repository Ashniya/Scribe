import React, { useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Feather, Users, Target, Heart, Sparkles, BookOpen, PenTool, Linkedin, TrendingUp, Award, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { isDark } = useContext(ThemeContext);
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    // Hero animations
    gsap.fromTo(
      heroRef.current.querySelectorAll('.fade-in'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
      }
    );

    // Story section animations
    gsap.fromTo(
      storyRef.current.querySelectorAll('.scale-in'),
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 70%',
        },
      }
    );

    // Values section animations
    gsap.fromTo(
      valuesRef.current.querySelectorAll('.slide-in-right'),
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: valuesRef.current,
          start: 'top 70%',
        },
      }
    );

    // Team section animations
    gsap.fromTo(
      teamRef.current.querySelectorAll('.team-card'),
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: teamRef.current,
          start: 'top 70%',
        },
      }
    );

    // Reverse scroll effect for sidebar
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        const mainHeight = mainRef.current.scrollHeight;
        const sidebarHeight = sidebarRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate reverse position
        const maxScroll = mainHeight - viewportHeight;
        const sidebarMaxScroll = sidebarHeight - viewportHeight;
        const scrollRatio = scrollTop / maxScroll;
        const sidebarScroll = sidebarMaxScroll * (1 - scrollRatio);
        
        sidebarRef.current.style.transform = `translateY(-${sidebarScroll}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
    {
      name: 'Member Name 1',
      role: 'Lead Developer',
      linkedin: 'https://linkedin.com/in/username',
    },
    {
      name: 'Member Name 2',
      role: 'Full Stack Developer',
      linkedin: 'https://linkedin.com/in/username',
    },
    {
      name: 'Member Name 3',
      role: 'Frontend Developer',
      linkedin: 'https://linkedin.com/in/username',
    },
    {
      name: 'Member Name 4',
      role: 'Backend Developer',
      linkedin: 'https://linkedin.com/in/username',
    },
  ];

  return (
    <div className="min-h-screen bg-scribe-cream dark:bg-slate-900">
      <Navbar showNavbar={true} />

      <div className="flex pt-24">
        {/* Left Content Area (3/4) */}
        <main ref={mainRef} className="w-full lg:w-3/4">
          {/* Hero Section */}
          <section ref={heroRef} className="min-h-[60vh] flex items-center justify-center py-20 bg-scribe-cream dark:bg-slate-900 relative overflow-hidden">
            {/* Floating Icons */}
            <div className="absolute top-10 right-10 animate-float opacity-20 dark:opacity-10">
              <BookOpen size={80} className="text-scribe-green dark:text-scribe-sage" />
            </div>
            <div className="absolute bottom-20 left-10 animate-float-slow opacity-20 dark:opacity-10">
              <PenTool size={60} className="text-scribe-sage dark:text-scribe-mint" />
            </div>

            <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
              <h1 className="fade-in text-6xl md:text-7xl font-bold mb-8 text-gray-800 dark:text-white">
                About <span className="text-scribe-green dark:text-scribe-sage">Us</span>
              </h1>
              <p className="fade-in text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                We're building a platform where every writer finds their voice and every story finds its audience.
              </p>
              <p className="fade-in text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                Scribe is more than just a blogging platform—it's a creative sanctuary designed for writers, thinkers, and storytellers who believe in the power of words.
              </p>
            </div>
          </section>

          {/* Story Section */}
          <section ref={storyRef} className="py-24 bg-white dark:bg-slate-800 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-20">
                <h2 className="scale-in text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                  Our Story
                </h2>
              </div>

              <div className="space-y-16">
                <div className="scale-in flex items-start space-x-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-scribe-green dark:bg-scribe-sage flex items-center justify-center">
                    <Target size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">The Beginning</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      Scribe was born from a simple idea: what if there was a place where writers could focus purely on their craft, without the noise and complexity of modern blogging platforms?
                    </p>
                  </div>
                </div>

                <div className="scale-in flex items-start space-x-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-scribe-sage dark:bg-scribe-mint flex items-center justify-center">
                    <Heart size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Our Philosophy</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      We believe every person has a story worth sharing. Our mission is to provide the tools, community, and inspiration to help those stories reach the world.
                    </p>
                  </div>
                </div>

                <div className="scale-in flex items-start space-x-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-scribe-mint dark:bg-scribe-green flex items-center justify-center">
                    <Sparkles size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Looking Forward</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      We're constantly evolving, listening to our community, and building features that matter. Join us on this journey to revolutionize digital storytelling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section ref={valuesRef} className="py-24 bg-scribe-sage/10 dark:bg-slate-900 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-20">
                <h2 className="slide-in-right text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                  Our Values
                </h2>
                <p className="slide-in-right text-xl text-gray-600 dark:text-gray-300">
                  The principles that guide everything we do
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {[
                  { title: 'Simplicity', desc: 'Clean, intuitive design that gets out of your way', icon: '✨' },
                  { title: 'Community', desc: 'Building meaningful connections between writers and readers', icon: '🤝' },
                  { title: 'Quality', desc: 'Tools and features that enhance your writing experience', icon: '⚡' },
                  { title: 'Freedom', desc: 'Your content, your voice, your way—no compromises', icon: '🎯' },
                ].map((value, i) => (
                  <div
                    key={i}
                    className="slide-in-right p-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-scribe-mint/20 dark:hover:bg-slate-700 transition-all duration-300 border-2 border-transparent hover:border-scribe-sage/30"
                  >
                    <div className="text-6xl mb-6">{value.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section ref={teamRef} className="py-24 bg-white dark:bg-slate-800 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                  Meet Our Team
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  The passionate developers behind Scribe
                </p>
              </div>

              {/* Team Members Grid - 4 boxes vertically aligned */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="team-card bg-gradient-to-br from-scribe-cream to-white dark:from-slate-700 dark:to-slate-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group text-center"
                  >
                    {/* Photo Placeholder */}
                    <div className="mb-6 flex justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-scribe-green to-scribe-mint dark:from-scribe-sage dark:to-scribe-mint flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                        {/* Add your photo here with: <img src="path" alt={member.name} className="w-full h-full object-cover" /> */}
                        <Users size={48} className="text-white" />
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-scribe-green dark:group-hover:text-scribe-sage transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{member.role}</p>
                      
                      {/* LinkedIn Link */}
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-scribe-green/10 dark:bg-scribe-mint/10 text-scribe-green dark:text-scribe-mint hover:bg-scribe-green hover:text-white dark:hover:bg-scribe-mint dark:hover:text-scribe-green transition-all duration-300 group/link"
                      >
                        <Linkedin size={16} className="group-hover/link:scale-110 transition-transform duration-300" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-scribe-cream dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">© 2026 Scribe. Where every word finds its place.</p>
            </div>
          </footer>
        </main>

        {/* Right Sidebar (1/4) - Scrolls in REVERSE */}
        <aside className="hidden lg:block lg:w-1/4 bg-gradient-to-b from-scribe-green via-scribe-sage to-scribe-mint dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 fixed right-0 top-24 h-[calc(100vh-6rem)] overflow-hidden">
          <div ref={sidebarRef} className="p-10 space-y-20">
            {/* Decorative Floating Elements at top */}
            <div className="relative h-40 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-12 h-12 rounded-full bg-white/10 animate-float-slow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>

            {/* Why Choose Us */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white text-center mb-10">Why Choose Scribe?</h3>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Lightning Fast</h4>
                  <p className="text-white/70 text-base leading-relaxed">Optimized performance for seamless writing experience</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Award Winning</h4>
                  <p className="text-white/70 text-base leading-relaxed">Recognized for excellence in user interface design</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Growing Community</h4>
                  <p className="text-white/70 text-base leading-relaxed">Join thousands of passionate writers worldwide</p>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <Target size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">Our Mission</h3>
              <p className="text-white/80 text-center text-base leading-relaxed">
                To democratize storytelling and give every writer the tools they need to succeed in sharing their unique voice with the world.
              </p>
            </div>

            {/* Stats Section */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white text-center mb-10">Our Impact</h3>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl font-bold text-white mb-3">10K+</div>
                <div className="text-white/80 text-base">Active Writers</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl font-bold text-white mb-3">50K+</div>
                <div className="text-white/80 text-base">Stories Published</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl font-bold text-white mb-3">1M+</div>
                <div className="text-white/80 text-base">Monthly Readers</div>
              </div>
            </div>

            {/* Animated Writing Document */}
            <div className="py-10">
              <div className="flex justify-center">
                <svg width="220" height="260" viewBox="0 0 220 260" className="drop-shadow-2xl">
                  {/* Document */}
                  <rect x="30" y="15" width="160" height="230" fill="white" fillOpacity="0.95" rx="10" />
                  
                  {/* Header */}
                  <rect x="30" y="15" width="160" height="45" fill={isDark ? "#9CAB84" : "#89986d"} fillOpacity="0.3" rx="10"/>
                  <circle cx="50" cy="37" r="6" fill="white" opacity="0.7"/>
                  <circle cx="68" cy="37" r="6" fill="white" opacity="0.7"/>
                  <circle cx="86" cy="37" r="6" fill="white" opacity="0.7"/>
                  
                  {/* Animated Lines */}
                  <g className="typing-animation">
                    <line x1="50" y1="85" x2="50" y2="85" stroke={isDark ? "#9CAB84" : "#89986d"} strokeWidth="3" strokeLinecap="round">
                      <animate attributeName="x2" from="50" to="170" dur="2.5s" fill="freeze" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="115" x2="50" y2="115" stroke={isDark ? "#9CAB84" : "#89986d"} strokeWidth="3" strokeLinecap="round">
                      <animate attributeName="x2" from="50" to="180" dur="2.5s" begin="0.6s" fill="freeze" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="145" x2="50" y2="145" stroke={isDark ? "#C5D89D" : "#9cab84"} strokeWidth="3" strokeLinecap="round">
                      <animate attributeName="x2" from="50" to="150" dur="2.5s" begin="1.2s" fill="freeze" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="175" x2="50" y2="175" stroke={isDark ? "#C5D89D" : "#9cab84"} strokeWidth="3" strokeLinecap="round">
                      <animate attributeName="x2" from="50" to="175" dur="2.5s" begin="1.8s" fill="freeze" repeatCount="indefinite"/>
                    </line>
                    
                    {/* Cursor */}
                    <rect x="50" y="202" width="3" height="20" fill={isDark ? "#9CAB84" : "#89986d"}>
                      <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
                      <animate attributeName="x" from="50" to="130" dur="2.5s" begin="2.4s" fill="freeze" repeatCount="indefinite"/>
                    </rect>
                    <line x1="50" y1="212" x2="50" y2="212" stroke={isDark ? "#9CAB84" : "#89986d"} strokeWidth="3" strokeLinecap="round">
                      <animate attributeName="x2" from="50" to="130" dur="2.5s" begin="2.4s" fill="freeze" repeatCount="indefinite"/>
                    </line>
                  </g>
                  
                  {/* Decorative Corner */}
                  <circle cx="175" cy="225" r="12" fill="white" opacity="0.4"/>
                  <circle cx="158" cy="210" r="8" fill="white" opacity="0.4"/>
                </svg>
              </div>
              
              <p className="text-white/70 text-center text-base mt-6 italic font-medium">
                "Where words come to life"
              </p>
            </div>

            {/* Logo Section at bottom */}
            <div className="relative pb-10">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-full bg-white/20 animate-pulse-glow">
                  <Feather size={56} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default About;