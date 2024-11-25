import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="container my-5"> {/* Adds spacing and centers content */}
      <header className="text-center mb-4">
        <h1 className="display-4">Warranty Wallet</h1>
      </header>
      <p className="lead text-justify">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Tempora obcaecati suscipit sint! Consectetur ut optio deserunt hic temporibus, 
        rerum aspernatur exercitationem magni impedit doloremque pariatur similique et
        ab vitae nostrum.
      </p>
      <p className="text-muted">
        Warranty Wallet is a simple and efficient tool designed to help you manage all your product warranties 
        in one place. Track warranty periods, upload receipts, and stay informed with ease.
          </p>
          <br />
          <Link to="/" className="btn btn-secondary">Back</Link>

      </div>
      
  );
}

export default About;
