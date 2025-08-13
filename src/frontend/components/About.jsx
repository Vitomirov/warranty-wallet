import React from "react";

function About() {
  return (
    <section
      id="about"
      className="about-section vh-100 d-flex align-items-center text-center help"
    >
      <div className="row conent-layout w-100 help">
        {/* Column for the image, aligned to the left */}
        <div className="col-lg-5 col-md-6 d-flex justify-content-start align-items-center">
          <img
            className="img-fluid"
            src="/About.png"
            alt="About"
            style={{ maxHeight: "400px", width: "auto" }}
          />
        </div>
        {/* Column for the text, aligned to the right */}
        <div className="col-lg-7 col-md-6 d-flex flex-column justify-content-center paragraph-justify help">
          <span className="fw-bold fs-3">Warranty Wallet</span>{" "}
          <p className="lead">
            ...is your ultimate tool for managing warranties with ease. We
            understand how frustrating it can be to keep track of receipts,
            expiration dates, and warranty details. That’s why we designed an
            app that simplifies the process, ensuring your valuable products are
            always protected.
          </p>
          <div className="mt-3 button pb-3">
            <button
              className="btn btn-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseContent"
              aria-expanded="false"
              aria-controls="collapseContent"
            >
              More
            </button>
            <div className="collapse" id="collapseContent">
              <div className="card card-body mt-2">
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
