import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import MatchMaking from '../components/MatchMaking';
import TeamGallery from '../components/TeamGallery';

const HomePage = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TeamGallery />
      <HowItWorks />
    </div>
  );
};

export default HomePage; 