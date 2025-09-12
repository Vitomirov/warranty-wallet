import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { slideInFromRight, popUpAndFadeIn } from "../animations/Animations";

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="about" className="about-section global-container" ref={ref}>
      <div className="content-layout about-content w-100 d-flex flex-column flex-md-row align-items-start gap-6">
        {/* Left column: title */}
        <div className="col-12 col-md-6">
          <motion.h2
            className="title"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Manage your warranties effortlessly
          </motion.h2>
        </div>

        {/* Right column: text */}
        <motion.div
          className="col-12 col-md-6"
          variants={slideInFromRight}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* subtle background accent */}
          <motion.div />

          <motion.div className="position-relative z-2">
            <motion.p
              className="lead mb-3"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.2 }}
            >
              Warranty Wallet is a smart, all-in-one app that helps you keep
              track of every product warranty you own. No more digging through
              drawers for receipts or forgetting expiration dates. Everything is
              organized and easily accessible from your device.
            </motion.p>

            <motion.p
              className="mb-3"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.4 }}
            >
              With just a few taps, you can add a new warranty, upload receipts,
              and set reminders for expiration dates. The app automatically
              calculates remaining warranty periods, so you’ll never miss a
              claim or replacement opportunity.
            </motion.p>

            <motion.p
              className=" mb-3"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.6 }}
            >
              Warranty Wallet supports all kinds of products—electronics,
              appliances, gadgets, even vehicles. Its intuitive dashboard lets
              you see all active warranties at a glance and quickly search or
              filter by product, purchase date, or expiration.
            </motion.p>

            <motion.p
              className=" mb-3"
              variants={popUpAndFadeIn}
              transition={{ delay: 0.8 }}
            >
              Secure, easy to use, and designed to save you time, Warranty
              Wallet ensures peace of mind by keeping your purchases protected.
              Focus on enjoying your products while the app handles the rest.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
