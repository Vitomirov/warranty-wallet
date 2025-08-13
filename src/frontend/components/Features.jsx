import React, { useState } from "react";

const Features = () => {
  // State to manage which card is currently active/open
  const [activeFeature, setActiveFeature] = useState(null);

  // Data for the features
  const featuresData = [
    {
      id: "feature-1",
      title: "Centralized Management",
      icon: "bi bi-arrow-down-left",
      description:
        "Say goodbye to lost receipts and scattered documents. Warranty Wallet keeps all your warranties in one secure location, accessible anytime, anywhere.",
    },
    {
      id: "feature-2",
      title: "Predefined Email Template",
      icon: "bi bi-envelope-paper-fill",
      description:
        "Quickly report issues with your products using our predefined email template. Just describe your issue, and the app will handle the rest, sending the email directly to the seller for you.",
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

  // Function to toggle the active feature card
  const toggleFeature = (featureId) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };

  return (
    <section
      id="features"
      className="features-section min-vh-100 d-flex flex-column justify-content-center"
    >
      <div className="conent-layout help">
        <div className="text-center text-md-start mb-5 help">
          <h1 className=" display-4 text-center">FEATURES</h1>
        </div>

        <div className="features-card-container">
          {/* Map through the features data to render each card */}
          {featuresData.map((feature, index) => (
            <div
              key={feature.id}
              className={`individualFeature card p-0 rounded clickable-card 
                ${activeFeature === feature.id ? "active" : ""}`}
              onClick={() => toggleFeature(feature.id)}
              style={{
                "--i": index,
                "--total": featuresData.length,
              }}
            >
              <div className="p-4 d-flex align-items-center bg-gradient featureTitle rounded-top">
                <i className={`${feature.icon} h3 me-3`}></i>
                <h5 className="mb-0">{feature.title}</h5>
              </div>

              {/* The content is conditionally rendered */}
              {activeFeature === feature.id && (
                <div className="pt-2 ps-2">
                  <p className="lead paragraph-justify">
                    {feature.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
