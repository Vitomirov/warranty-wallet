import React from 'react';

const Features = () => {
  return (
    <section className="features-section min-vh-100">
      <div id="features" className="container-fluid">
        <div className="col-lg-12 col-md- text-center text-md-start"
          style={{
            paddingTop: '6%',
            paddingBottom: '6%',
         }}>
                    {/* First Row */}
          <div className="row d-flex justify-content-evenly gy-5"
          style={{paddingTop: '2%'}}
          >
            <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
              <span className="hover-text">
                Say goodbye to lost receipts and scattered documents.
                Warranty Wallet keeps all your warranties in one secure location,
                accessible anytime, anywhere.
              </span>
              <div className='bg-gradient featureTitle d-flex row align-items-center justify-content-center rounded'>
                <i className="bi bi-arrow-down-left h3 d-flex justify-content-center pt-1"></i>
                <h5 className="text-center rounded">Centralized Management</h5>
              </div>
            </div>
          <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
            <span className="hover-text">
                Quickly report issues with your products using our predefined email template.
                Just describe your issue, and the app will handle the rest,
                sending the email directly to the seller for you.
            </span>
            <div className='bg-gradient featureTitle d-flex row align-items-center justify-content-center rounded'>
              <i className="bi bi-envelope-paper-fill h3 d-flex justify-content-center pt-1"></i>
              <h5 className="text-center rounded">Predefined Email Template</h5>
            </div>
          </div>
         </div>

        {/*Section Title*/}
            <div className="row col-md-12 d-flex align-items-center">
              <h1 className="title display-4 text-center">FEATURES</h1>
        </div>
        
          {/* Second Row */}
        <div className="row d-flex justify-content-evenly gy-3">
          <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
            <div className='bg-gradient featureTitle d-flex row align-items-center justify-content-center rounded'>
              <i className="bi bi-upload h3 d-flex justify-content-center pt-1"></i>
              <h5 className="text-center">Easy Warranty Uploads</h5>
            </div>
            <span className="hover-text rounded">
                Upload warranty details effortlessly by filling out a simple form
                with uploading an image of your receipt. The app will do the rest.
            </span>
          </div>
          <div className="individualFeature col-md-6 col-lg-4 p-4 d-flex flex-column justify-content-evenly rounded">
            <div className='bg-gradient featureTitle d-flex row align-items-center justify-content-center rounded'>
              <i className="bi bi-person-fill-check h3 d-flex justify-content-center pt-1"></i>
              <h5 className="text-center">User-Friendly Dashboard</h5>
            </div>
            <span className="hover-text rounded">
                Access all your warranties at a glance with a clean, intuitive dashboard.
                Filter, search, and review details in just a few clicks.
            </span>
          </div>
        </div>
        </div>

      </div>
    </section>
  );
};

export default Features;