import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const Features = () => {
  const featuresData = [
    {
      id: "feature-1",
      title: "Centralized Management",
      icon: "bi bi-arrow-down-left",
      description:
        "Say goodbye to lost receipts and scattered documents. Warranty Wallet keeps all your warranties in one place and makes managing them effortless.",
    },
    {
      id: "feature-2",
      title: "Predefined Email Template",
      icon: "bi bi-envelope-paper-fill",
      description:
        "Quickly report product issues using our ready-to-send email template. The app will handle the sending automatically.",
    },
    {
      id: "feature-3",
      title: "Easy Warranty Uploads",
      icon: "bi bi-upload",
      description:
        "Upload warranty details effortlessly by filling out a simple form with uploading an image of your receipt. The app will do the rest.",
    },
    {
      id: "feature-4",
      title: "User-Friendly Dashboard",
      icon: "bi bi-person-fill-check",
      description:
        "Access all your warranties at a glance with a clean, intuitive dashboard. Filter, search, and review details in just a few clicks.",
    },
  ];

  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleClose = () => setSelectedFeature(null);

  return (
    <section
      id="features"
      className="global-container d-flex justify-content-center align-items-center"
    >
      <div className="row content-layout help">
        <h1 className="display-4 text-center">FEATURES</h1>

        <div className="row g-5 justify-content-center">
          {featuresData.map((feature) => (
            <React.Fragment key={feature.id}>
              {/* Card for md/lg: normal */}
              <div className="col-md-6 col-lg-3 d-none d-md-flex justify-content-center mb-4">
                <div className="feature-card h-100 pb-3">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <i className={`${feature.icon} display-4 mb-3`} />
                    <h5 className="card-title">{feature.title}</h5>
                    <p className="card-text text-justify feature-description mt-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile card: center with flex outside grid */}
              <div className="d-flex d-md-none justify-content-center mb-3 ms-5">
                <div
                  className="feature-card h-100 pb-3 bg-transparent border"
                  style={{ cursor: "pointer", width: "90%" }}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <div className="card-body text-center d-flex flex-column justify-content-start">
                    <i className={`${feature.icon} display-4 mb-3`} />
                    <h5 className="card-title">{feature.title}</h5>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modal for mobile */}
      <Modal show={!!selectedFeature} onHide={handleClose} centered>
        {selectedFeature && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedFeature.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{selectedFeature.description}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </section>
  );
};

export default Features;
