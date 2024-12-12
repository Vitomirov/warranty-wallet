import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero container col-lg-12 col-md-8">
        <div className="row col-lg-12">
          {/* Left Content */}
          <div className="col-lg-6 col-md-4 col-sm-3 d-flex align-items-center">
            <div className="hero-left col-lg-12">
              <h2 className='justify-content-center'>Warranty Wallet</h2>
              <p className='justify-content-start ps-4'>All warranties in one place.</p>
              <div className="hero-links d-flex justify-content-start ps-5 gap-3">
                <Link to="/login" className="btn btn-primary btn-lg">Log In</Link>
                <Link to="/signup" className="btn btn-secondary btn-lg">Sign Up</Link>
              </div>
            </div>
          </div>
          {/* Right Content */}
          <div className="col-lg-6 col-md-3 col-sm-2 ">
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
