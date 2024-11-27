// components/Features.jsx
import React from 'react';

const Features = () => {
  return (
    <section id='features' className="features-section">
      <h2>Features</h2>
      <ol>
        <li>
          <h4>Centralized Warranty Management</h4>
          <p>Say goodbye to lost receipts and scattered documents.
            Warranty Wallet keeps all your warranties in one secure location,
            accessible anytime, anywhere.</p>
        </li>
        <li>
          <h4>Expiration Date Alerts</h4>
          <p>Never miss an important date again.
            Our app sends timely reminders for upcoming warranty expirations,
            giving you ample time to take action.</p>
        </li>
        <li>
          <h4>Easy Warranty Uploads</h4>
          <p>Upload warranty details effortlessly by filling out a simple form
            or uploading an image of your receipt. The app organizes everything for you.</p>
        </li>
        <li>
          <h4>User-Friendly Dashboard</h4>
          <p>Access all your warranties at a glance with a clean, intuitive dashboard.
            Filter, search, and review details in just a few clicks.</p>
        </li>

      </ol>
    </section>
  );
};

export default Features;