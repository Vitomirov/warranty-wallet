import React from 'react';

const Features = () => {
  return (
    <section className="features-section">
      <div id="features" className="container-fluid vh-100 pt-5">
        <div className="row justify-content-evenly mt-5">
          {/* First Row */}
          <div className="individualFeature col-md-6 col-lg-4 mb-4 pt-3 d-flex flex-column justify-content-between">
            <div className="p-3">
              <h5>Centralized Warranty Management</h5>
              <span className="hover-text">
                Say goodbye to lost receipts and scattered documents. Warranty Wallet keeps all your warranties in one secure location, accessible anytime, anywhere.
              </span>
            </div>
          </div>
          <div className="individualFeature col-md-6 col-lg-4 mb-4 pt-3 d-flex flex-column justify-content-between">
            <div className="p-3">
              <h5>Predefined Email Templates</h5>
              <p>
              Quickly report issues with your products using our predefined email templates. Just describe your issue, and the app will handle the rest, sending the email directly to the seller for you.
              </p>
            </div>
          </div>
        </div>
        <div className="row justify-content-evenly">
          {/* Second Row */}
          <div className="individualFeature col-md-6 col-lg-4 mb-4 d-flex flex-column justify-content-evenly">
            <div className="p-3">
              <h4>Easy Warranty Uploads</h4>
              <p>
                Upload warranty details effortlessly by filling out a simple form or uploading an image of your receipt. The app organizes everything for you.
              </p>
            </div>
          </div>
          <div className="individualFeature col-md-6 col-lg-4 mb-4 d-flex flex-column justify-content-between">
            <div className="p-3">
              <h4>User-Friendly Dashboard</h4>
              <p>
                Access all your warranties at a glance with a clean, intuitive dashboard. Filter, search, and review details in just a few clicks.
              </p>
            </div>
          </div>
        </div>
        <h1 className="features-title display-2 text-center">FEATURES</h1>
      </div>
    </section>
  );
};

export default Features;