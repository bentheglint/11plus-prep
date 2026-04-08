// ── Shared Motion Presets ──
// All presets respect prefers-reduced-motion automatically.
// Motion's useReducedMotion() hook + the MotionConfig provider handle this.

import { motion, AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react';

// ── Spring presets ──
const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 25 },
  smooth: { type: 'spring', stiffness: 200, damping: 20 },
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
};

// ── Animation variants ──
const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: springs.smooth,
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: springs.snappy,
};

const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

// ── Stagger container (parent wraps children with variants) ──
const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: springs.smooth,
};

// ── Interaction presets (spread onto motion elements) ──
const cardHover = {
  whileHover: { scale: 1.025, y: -2 },
  whileTap: { scale: 0.98 },
  transition: springs.snappy,
};

const buttonPress = {
  whileTap: { scale: 0.95 },
  transition: springs.snappy,
};

// ── View transition wrapper (for AnimatePresence in App.js) ──
const viewTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: 'easeOut' },
};

export {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
  springs,
  fadeInUp,
  scaleIn,
  slideInRight,
  staggerContainer,
  staggerItem,
  cardHover,
  buttonPress,
  viewTransition,
};
