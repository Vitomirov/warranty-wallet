import React from 'react';
import Navigation from './Navigation'; // Keep Navigation as it is
import { Link } from 'react-router-dom';
import Footer from './Footer'; // Import Footer

function Home() {
  return (
    <>
      <Navigation /> {/* Using Navigation component */}
      
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <h2>Welcome to Warranty Wallet</h2>
            <p>Keep track of your product warranties effortlessly. Sign up to manage your warranties and never lose an important document again.</p>
          </div>
          <div className="hero-right">
            <Link to="/login" className="btn btn-primary">Log In</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
