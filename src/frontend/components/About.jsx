import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function About() {
  return (
    <section className="about-section">
      <div id="about" className="container-fluid min-vh-100 d-flex align-items-center">
        <div className="row p-5">
          {/* Column for the "About" title */}
          <div className="col-lg-3 d-flex justify-content-center align-items-center pt-5">
            <h1 className="about-title display-2 fw-bolder ">ABOUT</h1>
          </div>

          {/* Column for the text content */}
          <div className="col-lg-8 pt-5">
            <p className="lead pt-5 pb-5">
              <span className="fw-bold">Warranty Wallet</span> is your ultimate tool for managing warranties with ease.
              We understand how frustrating it can be to keep track of receipts, expiration dates,
              and warranty details. That’s why we designed an app that simplifies the process,
              ensuring your valuable products are always protected.
            </p>

            {/* Main Dropdown */}
            <div className="button">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="moreButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </button>
              <ul className="dropdown-menu p-3 col-lg-6" aria-labelledby="moreButton">
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
