// components/LandingPage.jsx
import React from 'react';
import Navigation from './Navigation';
import Hero from './Hero'; // Import the Hero component
import About from './About';
import Features from './Features'; // New component for features
import FAQ from './FAQ'; // New component for FAQs
import Footer from './Footer'


const LandingPage = () => {
  return (
    <>
      <Navigation />
      <Hero />
      <About />
      <Features />
      <FAQ />
      <Footer />
    </>
  );
};

export default LandingPage;