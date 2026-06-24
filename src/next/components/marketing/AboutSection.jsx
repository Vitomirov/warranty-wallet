"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { slideInFromRight, popUpAndFadeIn } from "@/lib/animations";
import useHydrated from "@/hooks/useHydrated";

export default function AboutSection() {
  const ref = useRef(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldAnimate = hydrated && isInView;

  return (
    <section
      id="about"
      className="about-section global-container py-5"
      ref={ref}
    >
      <div className="row w-100 align-items-start g-4">
        <div className="col-12 col-md-6">
          <motion.h1
            className="pe-md-5 
             display-3
             display-6-md
             fs-3-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={shouldAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
          >
            Simplify Your
            <br />
            Warranties
            <br />
            Forever.
          </motion.h1>
        </div>

        <motion.div
          className="col-12 col-md-6"
          variants={slideInFromRight}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.div className="lead position-relative pt-1">
            <motion.h2
              className="mb-3 fs-3 fs-md-5 fs-sm-5"
              variants={popUpAndFadeIn}
              initial="hidden"
              animate={shouldAnimate ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
            >
              Stop searching for receipts and start protecting your purchases
              with ease.
            </motion.h2>

            <motion.p
              className="mb-2 fs-5 fs-md-6 fs-sm-6"
              variants={popUpAndFadeIn}
              initial="hidden"
              animate={shouldAnimate ? "visible" : "hidden"}
              transition={{ delay: 0.4 }}
            >
              Warranty Wallet is the smart, seamless way to manage every product
              warranty you own. We&apos;ve eliminated the hassle of paper trails
              and forgotten deadlines. With a few quick taps, you can digitally
              store receipts, track expiration dates, and get timely reminders.
              Your purchases are valuable—let&apos;s make sure they&apos;re
              always protected.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
