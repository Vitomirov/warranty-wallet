import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function About() {
  return (
    <section className="about-section">
      <div id="about" className="container-fluid vh-100 d-flex align-items-center">
        <div className="row w-100">
          {/* Column for the "About" title */}
          <div className="col-lg-3 d-flex justify-content-center align-items-center">
            <h1 className="display-1 mt-3 fw-bold text-uppercase about-title">About</h1>
          </div>

          {/* Column for the text content */}
          <div className="col-lg-8 p-4">
            <p className="lead p-4">
              <span className="fw-bold">Warranty Wallet</span> is your ultimate tool for managing warranties with ease.
              We understand how frustrating it can be to keep track of receipts, expiration dates,
              and warranty details. That’s why we designed an app that simplifies the process,
              ensuring your valuable products are always protected.
            </p>

            {/* Main Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="moreButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </button>
              <ul className="dropdown-menu p-3 border-0" aria-labelledby="moreButton">
                <li>
                  <p>
                    With <span className="fw-bold">Warranty Wallet</span>, you can securely store, organize, and access
                    all your warranties in one place. Whether it’s a household appliance, an electronic
                    gadget, or even your car, Warranty Wallet helps you stay informed about warranty
                    terms and expiration dates so you never miss out on a claim.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
