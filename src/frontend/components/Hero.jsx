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
              <p className='d-flex justify-content-center'>All warranties in one place.</p>
              <div className="hero-links d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-primary btn-lg">Log In</Link>
                <Link to="/signup" className="btn btn-secondary btn-lg">Sign Up</Link>
              </div>
            </div>
          </div>
          {/* Right Content */}
          <div className="col-lg-6 col-md-3 col-sm-1 ">
            <div className="hero-right">
              <img className="img-fluid d-none d-lg-block" src="src/frontend/images/LendingPage.png" alt="LendingPage"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
