import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.1,
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.04,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const floatingAnimation = {
  y: ['-2%', '2%'],
  transition: {
    y: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

export const pulseAnimation = {
  scale: [1, 1.03, 1],
  transition: {
    scale: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const blobAnimation = {
  initial: {
    scale: 0.8,
    opacity: 0,
    filter: 'blur(20px)',
  },
  animate: {
    scale: [0.8, 1.2, 1],
    opacity: [0, 0.3, 0.2],
    filter: 'blur(40px)',
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

export const shimmer = {
  initial: {
    backgroundPosition: '-500px 0',
  },
  animate: {
    backgroundPosition: '500px 0',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  },
};