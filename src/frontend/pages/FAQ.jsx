import React, { useState } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../animations/Animations"; // smooth fade/slide animations

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

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
  ];

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section id="faq" className="py-5 mb-5">
      <div className="container">
        <h2 className="display-4 text-center mb-2">FAQ</h2>

        <div className="row justify-content-center">
          <div className="col-lg-12">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-3 rounded-4 border shadow-sm"
                style={{
                  backgroundColor: "transparent",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                }}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <button
                  className="faq-btn btn text-start w-100 p-4 d-flex justify-content-between align-items-center mb-2"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={activeQuestion === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="fw-semibold">{faq.question}</span>
                  <span className="ms-2">
                    {activeQuestion === index ? "−" : "+"}
                  </span>
                </button>

                {/* Animated answer */}
                <motion.div
                  id={`faq-answer-${index}`}
                  className="px-4 pb-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={
                    activeQuestion === index
                      ? { opacity: 1, height: "auto" }
                      : { opacity: 0, height: 0 }
                  }
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="text-muted">{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
