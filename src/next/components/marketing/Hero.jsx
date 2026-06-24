"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import {
  containerVariants,
  createSlideUpVariant,
  popUpAndFadeIn,
} from "@/lib/animations";

export default function Hero() {
  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center text-center">
      <motion.div
        className="w-100 content-layout"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="row d-flex justify-content-center">
          <div className="col-12">
            <motion.h1
              className="mb-3 title"
              variants={createSlideUpVariant(0.2)}
            >
              Never lose a warranty again
            </motion.h1>

            <motion.small
              className="mb-5 fs-5"
              variants={createSlideUpVariant(0.4)}
            >
              No more digging through drawers for receipts or forgetting
              expiration dates.
            </motion.small>

            <motion.div
              className="button d-flex justify-content-center gap-5 mt-5"
              variants={popUpAndFadeIn}
              initial="hidden"
              animate="visible"
            >
              <Link href="/login">
                <Button variant="hero-primary">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="hero-secondary">Sign Up</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
