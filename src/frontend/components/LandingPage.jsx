import React from 'react';
import Navigation from './Navigation';
import Hero from './Hero';
import About from './About';
import Features from './Features';
import FAQ from './FAQ'; 
import Footer from './Footer'
import BackToTopButton from './BackToTopButton'; 

console.log("Landing page is rendering")


const LandingPage = () => {
  return (
    <>
      <Navigation />
      <Hero />
      <About />
      <Features />
      <BackToTopButton />
      <FAQ />
      <Footer />
    </>
  );
};

export default LandingPage;