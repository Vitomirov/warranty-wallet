import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { slideInFromRight, popUpAndFadeIn } from "../animations/Animations";

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      id="about"
      className="about-section global-container py-5"
      ref={ref}
    >
      <div className="row w-100 align-items-start g-4">
        {/* Left column: title */}
        <div className="col-12 col-md-6">
          <motion.h1
            className="fw-bold pe-md-5 
                       display-5       /* Large screens */
                       display-6-md    /* Medium */
                       fs-3-sm" /* Small screens */
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Manage <br /> your warranties <br /> effortlessly
          </motion.h1>
        </div>

        {/* Right column: text */}
        <motion.div
          className="col-12 col-md-6"
          variants={slideInFromRight}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="lead position-relative">
            <motion.p
              className="mb-3 fs-5 fs-md-6 fs-sm-6"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.2 }}
            >
              Warranty Wallet is a smart, all-in-one app that helps you keep
              track of every product warranty you own. No more digging through
              drawers for receipts or forgetting expiration dates. Everything is
              organized and easily accessible from your device.
            </motion.p>

            <motion.p
              className="mb-3 fs-5 fs-md-6 fs-sm-6"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.4 }}
            >
              With just a few taps, you can add a new warranty, upload receipts,
              and set reminders for expiration dates. The app automatically
              calculates remaining warranty periods, so you’ll never miss a
              claim or replacement opportunity.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
