import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Code2, User, LogOut, Settings, Map } from 'lucide-react';
import { useAuth } from '../context/auth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Close profile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to handle scrolling to a section
  const scrollToSection = (sectionId: string) => {
    // Close mobile menu if open
    if (isOpen) {
      setIsOpen(false);
    }
    
    // If we're on the homepage, scroll to the section
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on a different page, navigate to the homepage with the section hash
      navigate('/', { state: { scrollToSection: sectionId } });
    }
  };

  // Check for scrollToSection in location state when coming from another page
  useEffect(() => {
    if (location.state && (location.state as any).scrollToSection) {
      const sectionId = (location.state as any).scrollToSection;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small delay to ensure the page has loaded
    }
  }, [location.state]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-blue/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-custom mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Code2 className="w-8 h-8 text-neon-mint" />
            </Link>
            <Link to="/" className="text-xl font-bold">抱團Vibe</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hackathons')} 
              className="hover:text-neon-mint transition-colors"
            >
              活動 Events
            </button>
            <Link 
              to="/taiwan-map" 
              className="hover:text-neon-mint transition-colors flex items-center"
            >
              <Map className="w-4 h-4 mr-1" />
              地圖 Map
            </Link>
            <button 
              onClick={() => scrollToSection('matchmaking')} 
              className="hover:text-neon-mint transition-colors"
            >
              找隊友 Matchmaking
            </button>
            <button 
              onClick={() => scrollToSection('docs')} 
              className="hover:text-neon-mint transition-colors"
            >
              資源 Resources
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative profile-menu-container">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 hover:text-neon-mint transition-colors"
                >
                  <span>{profile?.display_name || user.email?.split('@')[0]}</span>
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cosmic-purple/30 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-blue/95 backdrop-blur-lg shadow-lg rounded-md py-1 z-50">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 hover:bg-cosmic-purple/20"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Edit Profile</span>
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-cosmic-purple/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth/login" className="hover:text-neon-mint transition-colors">
                  Log In
                </Link>
                <Link to="/auth/signup" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-dark-blue/95 backdrop-blur-lg shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection('hackathons')} 
              className="py-2 text-left hover:text-neon-mint"
            >
              活動 Events
            </button>
            <Link 
              to="/taiwan-map" 
              className="py-2 text-left hover:text-neon-mint flex items-center"
              onClick={toggleMenu}
            >
              <Map className="w-4 h-4 mr-1" />
              地圖 Map
            </Link>
            <button 
              onClick={() => scrollToSection('matchmaking')} 
              className="py-2 text-left hover:text-neon-mint"
            >
              找隊友 Matchmaking
            </button>
            <button 
              onClick={() => scrollToSection('docs')} 
              className="py-2 text-left hover:text-neon-mint"
            >
              Docs
            </button>
            <div className="pt-4 flex flex-col space-y-3">
              {user ? (
                <>
                  <Link to="/profile" className="py-2 text-center hover:text-neon-mint" onClick={toggleMenu}>
                    <Settings className="w-4 h-4 mr-2 inline-block" />
                    <span>Edit Profile</span>
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className="py-2 text-center hover:text-neon-mint w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2 inline-block" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" className="py-2 text-center hover:text-neon-mint" onClick={toggleMenu}>
                    Log In
                  </Link>
                  <Link to="/auth/signup" className="btn btn-primary" onClick={toggleMenu}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;