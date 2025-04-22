import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const toggleMenu = () => setIsOpen(!isOpen);

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
            <Code2 className="w-8 h-8 text-neon-mint" />
            <span className="text-xl font-bold">抱團Vibe</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#hackathons" className="hover:text-neon-mint transition-colors">
              Hackathons
            </a>
            <a href="#investors" className="hover:text-neon-mint transition-colors">
              Investors
            </a>
            <a href="#teams" className="hover:text-neon-mint transition-colors">
              Teams
            </a>
            <a href="#pricing" className="hover:text-neon-mint transition-colors">
              Pricing
            </a>
            <a href="#docs" className="hover:text-neon-mint transition-colors">
              Docs
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#login" className="hover:text-neon-mint transition-colors">
              Log In
            </a>
            <a href="#signup" className="btn btn-primary">
              Get Started
            </a>
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
            <a href="#hackathons" className="py-2 hover:text-neon-mint" onClick={toggleMenu}>
              Hackathons
            </a>
            <a href="#investors" className="py-2 hover:text-neon-mint" onClick={toggleMenu}>
              Investors
            </a>
            <a href="#teams" className="py-2 hover:text-neon-mint" onClick={toggleMenu}>
              Teams
            </a>
            <a href="#pricing" className="py-2 hover:text-neon-mint" onClick={toggleMenu}>
              Pricing
            </a>
            <a href="#docs" className="py-2 hover:text-neon-mint" onClick={toggleMenu}>
              Docs
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <a href="#login" className="py-2 text-center hover:text-neon-mint" onClick={toggleMenu}>
                Log In
              </a>
              <a href="#signup" className="btn btn-primary" onClick={toggleMenu}>
                Get Started
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;