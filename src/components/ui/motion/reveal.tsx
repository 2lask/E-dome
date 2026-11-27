"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/* ── Révélation au défilement ────────────────────────────────────────────────
   Opacité + translation seulement, une seule fois, déclenchée un peu avant
   l'entrée à l'écran. Avec prefers-reduced-motion : aucune translation, un
   fondu quasi instantané. Utilisable depuis un composant serveur. */

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "header";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={reduce ? { duration: 0.01 } : { duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

/** Conteneur dont les enfants <RevealItem> apparaissent l'un après l'autre. */
export function RevealGroup({
  children,
  className,
  as = "div",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ol" | "ul" | "section";
  label?: string;
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} aria-label={label} variants={group} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: reduce ? { duration: 0.01 } : { duration: 0.7, ease: EASE } },
  };
  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}
