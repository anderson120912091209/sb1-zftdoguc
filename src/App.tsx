import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-deep-space">
      <div className="cosmic-grid min-h-screen fixed inset-0 opacity-30" />
      <div className="relative">
        <div className="fixed inset-0 bg-gradient-to-b from-deep-space via-deep-space/50 to-deep-space pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-cosmic-purple/10 via-stellar-blue/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <Features />
          <HowItWorks />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;