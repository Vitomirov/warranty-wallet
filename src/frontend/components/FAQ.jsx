import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I add a warranty?",
      answer:
        "To add a warranty, navigate to the New Warranty form and upload the PDF of your warranty.",
    },
    {
      question: "What can I use Warranty Wallet for?",
      answer:
        "Warranty Wallet helps you organize and manage warranties for electronics, appliances, furniture, vehicles, and more.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use industry-standard encryption to keep your warranty details safe.",
    },
    {
      question: "How many warranties can I store in the app?",
      answer: "You can add and manage an unlimited number of warranties.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="FAQ" className="min-vh-75 d-flex justify-content-center py-5">
      <div className="content-layout w-100">
        <h2 className="display-4 text-center mb-5">FAQ</h2>

        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="accordion-item shadow-sm mb-3 rounded-3"
            >
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    activeIndex === index ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${
                  activeIndex === index ? "show" : ""
                }`}
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
