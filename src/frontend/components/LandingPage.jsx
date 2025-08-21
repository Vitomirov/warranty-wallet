import React from "react";
import Navigation from "./Navigation";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import FAQ from "./FAQ";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";

console.log("Landing page is rendering");

const LandingPage = () => {
  return (
    <div className="global-container">
      <header>
        <Navigation />
      </header>

      <main>
        {/* The Hero section is now full-width */}
        <Hero className="help" />
        {/* Other sections use a consistent container for a centered layout */}
        <section className=" help">
          <About />
        </section>
        <section className="help">
          <Features />
        </section>
        <section className="help">
          <FAQ />
        </section>
      </main>

      <BackToTopButton />
    </div>
  );
};

export default LandingPage;
