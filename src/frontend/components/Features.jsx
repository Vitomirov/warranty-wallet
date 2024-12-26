import React from 'react';

const Features = () => {
  return (
    <section className="features-section">
      <div id="features" className="container-fluid min-vh-100">

          {/* First Row */}
          <div className="row d-flex justify-content-evenly pt-5 gy-5">
            <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
              <span className="hover-text">
                Say goodbye to lost receipts and scattered documents. Warranty Wallet keeps all your warranties in one secure location, accessible anytime, anywhere.
              </span>
              <div className='featureTitle d-flex row align-items-center justify-content-center rounded'>
                <i className="bi bi-arrow-down-left h3 d-flex justify-content-center"></i>
                <h5 className="text-center rounded">Centralized Warranty Management</h5>
              </div>
            </div>
          <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
            <span className="hover-text">
              Quickly report issues with your products using our predefined email templates. Just describe your issue, and the app will handle the rest, sending the email directly to the seller for you.
            </span>
            <div className='featureTitle d-flex row align-items-center justify-content-center rounded'>
              <i className="bi bi-envelope-paper-fill h3 d-flex justify-content-center "></i>
              <h5 className="text-center rounded">Predefined Email Templates</h5>
            </div>
          </div>
         </div>

        {/*Section Title*/}
            <div className="row d-flex align-items-center mb-1">
              <h1 className="features-title display-1 text-center ">FEATURES</h1>
        </div>
        
          {/* Second Row */}
        <div className="row d-flex justify-content-evenly pt-2 gy-3">
          <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
            <div className='featureTitle d-flex row align-items-center justify-content-center rounded'>
              <i className="bi bi-upload h3 d-flex justify-content-center"></i>
              <h5 className="text-center">Easy Warranty Uploads</h5>
            </div>
            <span className="hover-text rounded">
              Upload warranty details effortlessly by filling out a simple form or uploading an image of your receipt. The app organizes everything for you.
            </span>
          </div>
          <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
            <div className='featureTitle d-flex row align-items-center justify-content-center rounded'>
              <i className="bi bi-person-fill-check h3 d-flex justify-content-center"></i>
              <h5 className="text-center">User-Friendly Dashboard</h5>
            </div>
            <span className="hover-text rounded">
              Access all your warranties at a glance with a clean, intuitive dashboard. Filter, search, and review details in just a few clicks.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;