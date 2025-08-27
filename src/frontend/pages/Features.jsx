import React from "react";

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

  return (
    <section
      id="features"
      className="global-container d-flex justify-content-center align-items-center"
    >
      <div className="row content-layout help">
        <h1 className="display-4 text-center">FEATURES</h1>

        <div className="row g-5 justify-content-center">
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              className="col-12 col-md-6 col-lg-3 d-flex justify-content-center"
            >
              {/* Bootstrap card */}
              <div className="feature-card h-100 pb-3">
                <div className="card-body text-center d-flex flex-column justify-content-start">
                  {/* Icon */}
                  <i className={`${feature.icon} display-4 mb-3`} />

                  {/* Title */}
                  <h5 className="card-title">{feature.title}</h5>

                  {/* Description (hidden by default, shown on hover with CSS) */}
                  <p className="card-text text-justify feature-description mt-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
