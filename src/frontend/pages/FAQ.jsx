import React, { useState } from "react";

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const faqs = [
    {
      question: "How do I add a warranty?",
      answer:
        "To add a warranty, navigate to the New Warranty form and upload the PDF of your warranty. You can also manually input key details like the product name, purchase date, and expiration date.",
    },
    {
      question: "What can I use Warranty Wallet for?",
      answer:
        "Warranty Wallet helps you organize and manage warranties for electronics, appliances, furniture, vehicles, and more. It's designed to be a single, secure place for all your important documents, preventing them from being lost.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, your data is absolutely secure. We use industry-standard encryption protocols and secure cloud storage to protect all your personal information and uploaded files.",
    },
    {
      question: "How many warranties can I store in the app?",
      answer:
        "You can add and manage an unlimited number of warranties. Our service is designed to scale with your needs, from a few documents to hundreds.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can permanently delete your account from the Profile settings page. This action will also delete all of your uploaded warranties and associated data. This action is irreversible.",
    },
  ];

  return (
    <section
      id="faq"
      className="min-vh-75 d-flex justify-content-center py-5 help"
    >
      <div className="content-layout w-100 help">
        <h2 className="display-4 text-center mb-5">FAQ</h2>

        <div className="row justify-content-center g-0">
          {/* Left Column: Questions List */}
          <div className="col-md-5">
            <div className="list-group list-group-flush border rounded-3 p-3 h-100">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    activeQuestion === index ? "active fw-bold" : ""
                  }`}
                  onClick={() => setActiveQuestion(index)}
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Answer Panel */}
          <div className="col-md-7 ps-md-4 mt-3 mt-md-0">
            <div className="card shadow-sm rounded-3 p-4 h-100">
              <p className="lead">{faqs[activeQuestion].answer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
