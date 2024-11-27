// components/FAQ.jsx
import React from 'react';

const FAQ = () => {
  return (
  <section id='FAQ' className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div>
        <h4>Q: What can I use Warranty Wallet for?</h4>
        <p>A: Warranty Wallet is perfect for organizing and managing warranties
          for electronics, appliances, furniture, vehicles, and more.
          If it comes with a warranty, you can track it with our app!</p>
      </div>
      <div>
        <h4>Q: Is my data secure?</h4>
        <p>A: Absolutely. We use industry-standard encryption to ensure your warranty
          details and personal data remain safe and private.</p>
      </div>
      <div>
        <h4>Q: How do I add a warranty?</h4>
        <p>A: Adding a warranty is easy! Simply fill out the required fields like product
          name, purchase date, and warranty expiration. You can also upload an image of
          the receipt for future reference.</p>
      </div>
      <div>
        <h4>Q: How many warranties can I store in the app?</h4>
        <p>A: The sky’s the limit! Warranty Wallet allows you to add and
          manage an unlimited number of warranties, so you’ll never run out of space.</p>
      </div>
    </section>
  );
};

export default FAQ;