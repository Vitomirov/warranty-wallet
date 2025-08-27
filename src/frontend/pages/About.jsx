import React, { useState } from "react";

function About() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMore = () => setIsOpen(!isOpen);

  return (
    <section
      id="about"
      className="global-container d-flex align-items-center justify-content-center text-center"
    >
      <div className="help content-layout">
        <div className="d-flex justify-content-center">
          <div className="col-lg-7 col-md-8">
            <span className="fw-bold fs-3">Warranty Wallet</span>
            <p className="lead paragraph-justify">
              ...is your ultimate tool for managing warranties with ease. We
              understand how frustrating it can be to keep track of receipts,
              expiration dates, and warranty details. That’s why we designed an
              app that simplifies the process, ensuring your valuable products
              are always protected.
            </p>

            <div className="mt-3 pb-3">
              <button
                className="btn btn-primary"
                type="button"
                onClick={toggleMore}
              >
                {isOpen ? "Less" : "More"}
              </button>

              <div className={`more-content mt-2 ${isOpen ? "open" : ""}`}>
                <p className="fs-6">
                  With <span className="fw-bold">Warranty Wallet</span>, you can
                  securely store, organize, and access all your warranties in
                  one place. Whether it’s a household appliance, an electronic
                  gadget, or even your car, Warranty Wallet helps you stay
                  informed about warranty terms and expiration dates so you
                  never miss out on a claim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
