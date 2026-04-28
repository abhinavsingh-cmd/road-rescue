import { motion } from "framer-motion";

export const springTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20
};

export const containerReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

export const itemReveal = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const gentleFloat = {
  y: [0, -12, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const premiumHover = {
  scale: 1.02,
  y: -5,
  transition: { duration: 0.3, ease: "easeOut" }
};

export const tapReaction = {
  scale: 0.96,
  transition: { duration: 0.1 }
};

export function PageMotion({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

// Added variants for staggered lists
export const staggerWrap = containerReveal;
export const staggerItem = itemReveal;
export const hoverLift = premiumHover;
export const floatAnimation = gentleFloat;
