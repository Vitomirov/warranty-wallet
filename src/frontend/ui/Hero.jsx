import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import Button from "./Button";
import { motion } from "framer-motion";
import {
  containerVariants,
  createSlideUpVariant,
  popUpAndFadeIn,
} from "../animations/Animations"; // adjust path

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center text-center bg-gradient-light">
      <motion.div
        className="w-100 content-layout"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="row d-flex justify-content-center">
          <div className="col-12">
            {/* Title */}
            <motion.h1
              className="mb-3 display-5 title"
              variants={createSlideUpVariant(0.2)}
            >
              Warranty Wallet
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              className="mb-4 fs-5"
              variants={createSlideUpVariant(0.4)}
            >
              All warranties in one place.
            </motion.h2>

            {/* Buttons */}
            <motion.div
              className="button d-flex justify-content-center gap-3"
              variants={popUpAndFadeIn}
              initial="hidden"
              animate="visible"
            >
              {!user && (
                <>
                  <Link to="/login">
                    <Button variant="primary">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="secondary">Sign Up</Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
