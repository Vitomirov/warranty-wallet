import React from "react";

function About() {
  return (
    <section className="about-section min-vh-100">
      <div id="about" className="container">
        <div className="row align-items-center">
          {/* Column for the text content */}
          <div className="pt-5 mt-5">
            <p className="lead pt-1 pb-5">
              
              <span className="fw-bold">Warranty Wallet</span> is your ultimate tool for managing warranties with ease.
              We understand how frustrating it can be to keep track of receipts, expiration dates,
              and warranty details. That’s why we designed an app that simplifies the process,
              ensuring your valuable products are always protected.
            </p>
          </div>

          {/* Main Dropdowns moved below the text content */}
          <div className="row mb-5 p-5 ">            
              <div className="button d-flex justify-content-between">
                <div>
                  <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    id="moreButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    More
                  </button>
                  <ul className="dropdown-menu col-lg-6 p-3" aria-labelledby="moreButton">
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

                 <div>
                  <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    id="evenMoreButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Even More
                  </button>
                  <ul className="dropdown-menu col-lg-6 p-3 text-end" aria-labelledby="evenMoreButton">
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
        <div className="row d-flex align-items-end">
              <h1 className="title-white display-1 text-center white">ABOUT</h1>
        </div>
      </div>
    </section>
  );
}

export default About;