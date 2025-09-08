import React, { useState } from "react";

function About() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMore = () => setIsOpen(!isOpen);

  return (
    <section
      id="about"
      className="global-container d-flex align-items-center justify-content-center"
    >
      <div className="content-layout w-100">
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          {/* Title */}
          <h2 className="display-4 text-center mb-4">About</h2>

          {/* First paragraph */}
          <p className="lead text-star paragraph-justify">
            Warranty Wallet is your ultimate tool for managing warranties with
            ease. We understand how frustrating it can be to keep track of
            receipts, expiration dates, and warranty details. That’s why we
            designed an app that simplifies the process, ensuring your valuable
            products are always protected.
          </p>

          {/* More button */}
          <div className="text-center my-4">
            <button
              className="btn btn-primary"
              type="button"
              onClick={toggleMore}
            >
              {isOpen ? "Less" : "More"}
            </button>
          </div>

          {/* Hidden paragraph */}
          {isOpen && (
            <div className="text-start paragraph-justify">
              <p className="fs-6">
                With <span className="fw-bold">Warranty Wallet</span>, you can
                securely store, organize, and access all your warranties in one
                place. Whether it’s a household appliance, an electronic gadget,
                or even your car, Warranty Wallet helps you stay informed about
                warranty terms and expiration dates so you never miss out on a
                claim.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;
