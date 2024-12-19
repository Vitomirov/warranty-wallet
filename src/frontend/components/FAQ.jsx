import React, { useState } from 'react';

const FAQ = () => {
  // State to manage which question is open
  const [openIndex, setOpenIndex] = useState(null);

  // Sample FAQ data
  const faqs = [
    {
      question: "What can I use Warranty Wallet for?",
      answer: "Warranty Wallet is perfect for organizing and managing warranties for electronics, appliances, furniture, vehicles, and more. If it comes with a warranty, you can track it with our app!"
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption to ensure your warranty details and personal data remain safe and private."
    },
    {
      question: "How do I add a warranty?",
      answer: "Adding a warranty is easy! Simply fill out the required fields like product name, purchase date, and warranty expiration. You can also upload an image of the receipt for future reference."
    },
    {
      question: "How many warranties can I store in the app?",
      answer: "The sky’s the limit! Warranty Wallet allows you to add and manage an unlimited number of warranties, so you’ll never run out of space."
    }
  ];

  // Function to toggle the answer visibility
  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div id='FAQ' className='container-fluid'>
        <div className="row py-5">
          
          {/* First column for the image */}
          <div className='col-lg-6 col-md-6 text-center mb-4 mb-md-0'>
            <img className="img-fluid" style={{ maxWidth: '50%', height: 'auto' }} src="src/frontend/images/FAQ1.png" alt="FAQ-image" />
          </div>

          {/* Second column for the FAQ */}
          <div className='col-lg-5 col-md-5 d-flex pt-5 flex-column justify-content-start'>
            <h2 className="text-start">FAQ</h2>
            {faqs.map((faq, index) => (
              <div key={index} className='questionField p-2 m-1 border rounded'>
                <h5 onClick={() => toggleAnswer(index)} style={{ cursor: 'pointer' }}>
                  Q: {faq.question}
                </h5>
                {openIndex === index && (
                  <p>A: {faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;