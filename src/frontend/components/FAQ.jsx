import React, { useState } from 'react';

const FAQ = () => {
  // State to manage which question is open
  const [openIndex, setOpenIndex] = useState(null);

  // Sample FAQ data
  const faqs = [
    {
      question: "How do I add a warranty?",
      answer: "To add a warranty, navigate to the New Warranty form, fill it out, and remember to upload the PDF of your warranty for safekeeping."
    },
    {
      question: "What can I use Warranty Wallet for?",
      answer: "Warranty Wallet helps you organize and manage warranties for electronics, appliances, furniture, vehicles, and more"
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption to ensure your warranty details and personal data remain safe and private."
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
      <div id='FAQ' className='container-fluid pt-3'>
        <div className="row py-5">
          
          {/* Image Section */}
          <div className='col-md-6 d-none d-md-flex text-center ms-4 mb-4 mb-md-0'>
            <img className="img-fluid"
              style={{ maxWidth: '55%', height: 'auto' }}
              src="src/frontend/images/FAQ.png"
              alt="FAQ-image" />
          </div>

          {/* Content Section */}
          <div className='col-lg-5 col-md-5 d-flex flex-column justify-content-start'
          style={{paddingTop: '8%'}}>
            <h2 className="title display-3 text-start mb-4">FAQ</h2>
            {faqs.map((faq, index) => (
              <div key={index} className='bg-gradient questionField p-2 m-1 rounded'>
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