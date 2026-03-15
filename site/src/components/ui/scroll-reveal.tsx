'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// ──────────────────────────────────────────────
// Shared animation constants
// ──────────────────────────────────────────────
const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

// ──────────────────────────────────────────────
// ScrollReveal — translateY/X entrance
// ──────────────────────────────────────────────
interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

const OFFSET = 60;

const directionMap = {
  up:    { y:  OFFSET, x: 0 },
  down:  { y: -OFFSET, x: 0 },
  left:  { x:  OFFSET, y: 0 },
  right: { x: -OFFSET, y: 0 },
} as const;

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: directionMap[direction].y,
        x: directionMap[direction].x,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT_QUART }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// StaggerReveal — staggered children (grids / lists)
// ──────────────────────────────────────────────
interface StaggerRevealProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: OFFSET },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: EASE_OUT_QUART },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// ScaleReveal — scale 0.9 → 1
// ──────────────────────────────────────────────
export function ScaleReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.0, delay, ease: EASE_OUT_QUART }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// LineReveal — horizontal line-draw effect
// ──────────────────────────────────────────────
export function LineReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.2, delay, ease: EASE_OUT_QUART }}
      style={{ transformOrigin: 'left' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// ParallaxSection — differential scroll speed
// ──────────────────────────────────────────────
interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className,
}: ParallaxSectionProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      style={{ willChange: 'transform' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
