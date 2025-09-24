import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { slideInFromRight, popUpAndFadeIn } from "../animations/Animations";
import "../styles/pages/_about.scss";

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
            className="pe-md-5 
             display-3
             display-6-md
             fs-3-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Simplify Your
            <br />
            Warranties
            <br />
            Forever.
          </motion.h1>
        </div>

        {/* Right column: text */}
        <motion.div
          className="col-12 col-md-6"
          variants={slideInFromRight}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="lead position-relative pt-1">
            <motion.h2
              className="mb-3 fs-3 fs-md-5 fs-sm-5"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.2 }}
            >
              Stop searching for receipts and start protecting your purchases
              with ease.
            </motion.h2>

            <motion.p
              className="mb-2 fs-5 fs-md-6 fs-sm-6"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.4 }}
            >
              Warranty Wallet is the smart, seamless way to manage every product
              warranty you own. We've eliminated the hassle of paper trails and
              forgotten deadlines. With a few quick taps, you can digitally
              store receipts, track expiration dates, and get timely reminders.
              Your purchases are valuable—let's make sure they're always
              protected.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
