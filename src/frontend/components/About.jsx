import React from "react";

function About() {
  return (
    <section className="about-section min-vh-100">
      <div id="about" className="container">
        <div className="row align-items-center"
          style={{ paddingTop: '6%' }}>
          {/* Column for the image */}
          <div className="col-md-5 d-flex justify-content-center">
            <img
              src="src/frontend/images/About.png"
              alt="About"
              style={{ maxHeight: '450px', width: 'auto', paddingTop: '32%' }}
            />
          </div>

          {/* Column for the text */}
          <div className="col-md-6">
            <p className="lead text-box">
              <span className="fw-bold">Warranty Wallet</span> is your ultimate tool for managing warranties with ease.
              We understand how frustrating it can be to keep track of receipts, expiration dates,
              and warranty details. That’s why we designed an app that simplifies the process,
              ensuring your valuable products are always protected.
            </p>
            <div className="mt-3 button pb-3">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="moreButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </button>
              <ul className="dropdown-menu col-md-5" aria-labelledby="moreButton">
                <li>
                  <p className="fs-5">
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
