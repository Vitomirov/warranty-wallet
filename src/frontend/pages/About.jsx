import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { containerVariants, itemVariants } from "../animations/Animations";

function About() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const toggleMore = () => setIsOpen(!isOpen);

  return (
    <section
      id="about"
      className="global-container d-flex justify-content-center align-items-center"
      ref={ref}
    >
      <div className="content-layout w-100">
        <motion.div
          className="col-12 col-md-10 col-lg-6 ps-2"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Title */}
          <motion.h2 className="display-4 mb-4" variants={itemVariants}>
            About
          </motion.h2>

          {/* First paragraph */}
          <motion.p
            className="lead text-start paragraph-justify w-100"
            variants={itemVariants}
          >
            Warranty Wallet is your ultimate tool for managing warranties with
            ease. We understand how frustrating it can be to keep track of
            receipts, expiration dates, and warranty details. That’s why we
            designed an app that simplifies the process, ensuring your valuable
            products are always protected.
          </motion.p>

          {/* More button */}
          <motion.div className="my-4" variants={itemVariants}>
            <button className="btn" type="button" onClick={toggleMore}>
              {isOpen ? "Less" : "More"}
            </button>
          </motion.div>

          {/* Hidden paragraph */}
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="more-content"
                className="text-start paragraph-justify"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                style={{ overflow: "hidden" }}
              >
                <p className="fs-6 mt-2">
                  With <span className="fw-bold">Warranty Wallet</span>, you can
                  securely store, organize, and access all your warranties in
                  one place. Whether it’s a household appliance, an electronic
                  gadget, or even your car, Warranty Wallet helps you stay
                  informed about warranty terms and expiration dates so you
                  never miss out on a claim.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
