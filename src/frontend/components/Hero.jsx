import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-lg-6 col-md-7 col-12">
            <div className="hero-left">
              <h2>Warranty Wallet</h2>
              <p>All warranties in one place.</p>
              <div className="hero-links d-flex gap-3">
                <Link to="/login" className="btn btn-primary">Log In</Link>
                <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
              </div>
            </div>
          </div>
          {/* Right Content (Optional placeholder for future use) */}
          <div className="col-lg-6 d-none d-lg-block"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
