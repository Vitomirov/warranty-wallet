"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import useHydrated from "@/hooks/useHydrated";

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

function FaqItem({ faq, index, isActive, onToggle }) {
  const ref = useRef(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="mb-3 rounded-4 border shadow-sm"
      style={{
        backgroundColor: "transparent",
        backdropFilter: "blur(6px)",
        cursor: "pointer",
      }}
      variants={itemVariants}
      initial="hidden"
      animate={hydrated && isInView ? "visible" : "hidden"}
    >
      <button
        type="button"
        className="faq-btn btn text-start w-100 p-4 d-flex justify-content-between align-items-center mb-2 montserrat fs-5"
        onClick={() => onToggle(index)}
        aria-expanded={isActive}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="fw-semibold">{faq.question}</span>
        <span className="ms-2">{isActive ? "−" : "+"}</span>
      </button>

      <motion.div
        id={`faq-answer-${index}`}
        className="px-4 pb-3 fs-4 text-muted"
        initial={{ opacity: 0, height: 0 }}
        animate={
          isActive ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }
        }
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p>{faq.answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQSection() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section id="faq" className="py-5 mb-5">
      <div className="container">
        <h2 className="display-4 text-center mb-4 montserrat">FAQ</h2>

        <div className="row justify-content-center">
          <div className="col-lg-12">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                index={index}
                isActive={activeQuestion === index}
                onToggle={toggleQuestion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
