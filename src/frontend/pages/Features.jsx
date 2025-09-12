import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  popUpAndFadeIn,
  slideInFromBottom,
} from "../animations/Animations";

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
    <motion.section
      id="features"
      className="global-container d-flex justify-content-center align-items-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="content-layout w-100">
        <h1 className="display-4 text-center mb-5">FEATURES</h1>

        <div className="row g-5 justify-content-center">
          {featuresData.map((feature, index) => (
            <React.Fragment key={feature.id}>
              {/* Card for md/lg: normal */}
              <motion.div
                className="col-md-10 col-lg-6 d-none d-md-flex justify-content-center mb-4"
                variants={itemVariants}
              >
                <motion.div
                  className="feature-card h-100 pb-3"
                  variants={popUpAndFadeIn}
                >
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <i className={`${feature.icon} display-4 mb-3`} />
                    <h5 className="card-title">{feature.title}</h5>
                    <p className="card-text text-justify feature-description mt-2">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Mobile card: center with flex outside grid */}
              <motion.div
                className="d-flex d-md-none justify-content-center mb-3  w-100"
                variants={slideInFromBottom}
                custom={index * 0.1}
              >
                <motion.div
                  className="feature-card h-100 pb-3 bg-transparent border"
                  style={{ cursor: "pointer", width: "90%" }}
                  onClick={() => setSelectedFeature(feature)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="card-body text-center d-flex flex-column justify-content-start">
                    <i className={`${feature.icon} display-4 mb-3`} />
                    <h5 className="card-title">{feature.title}</h5>
                  </div>
                </motion.div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modal for mobile */}
      <Modal
        show={!!selectedFeature}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
        as={motion.div} // motion modal for subtle pop-up
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
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
    </motion.section>
  );
};

export default Features;
