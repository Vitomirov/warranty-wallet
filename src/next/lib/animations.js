// Shared animation variants (ported from src/frontend/animations/Animations.js)

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

export const slideInFromRight = {
  hidden: { x: 80, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 20,
      mass: 0.9,
    },
  },
  exit: { x: 80, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

export const slideInFromBottom = {
  hidden: { y: 80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] },
  },
  exit: { y: 80, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.2 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

export const createSlideUpVariant = (delay = 0) => ({
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 1, 0.5, 1],
    },
  },
});

export const popUpAndFadeIn = {
  hidden: { opacity: 0, scale: 0.95, y: 25 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 18,
      mass: 1,
    },
  },
};
