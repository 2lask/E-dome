"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import styles from "./marketing.module.css";

/* ── Frise verticale des étapes ──────────────────────────────────────────────
   Un rail central qui se remplit au défilement (scaleY), des étapes qui
   alternent de part et d'autre sur grand écran et s'alignent à gauche sur
   téléphone. Les icônes arrivent déjà rendues depuis le Server Component. */

export type TimelineStep = { icon: React.ReactNode; t: string; d: string };

export function StepsTimeline({ steps }: { steps: TimelineStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      {/* Rail */}
      <span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-border md:left-1/2 md:-ml-px" />
      <motion.span
        aria-hidden
        style={{ scaleY: reduce ? 1 : fill }}
        className="absolute bottom-6 left-[21px] top-6 w-px origin-top bg-gradient-to-b from-[#e3b85c] via-[#d9a441] to-[#2daa9c] shadow-[0_0_12px_rgb(227_184_92/0.6)] md:left-1/2 md:-ml-px"
      />

      {steps.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <li key={s.t} className="relative grid grid-cols-[44px_1fr] gap-5 pb-8 last:pb-0 md:grid-cols-[1fr_44px_1fr] md:gap-8 md:pb-12">
            {/* Pastille */}
            <span className="relative z-10 col-start-1 row-start-1 flex h-11 w-11 items-center justify-center md:col-start-2">
              <span aria-hidden className={`absolute inset-0 rounded-full bg-laiton/25 ${styles.ping}`} style={{ animationDelay: `${i * 0.4}s` }} />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-laiton-border bg-background font-mono text-[12.5px] font-semibold text-laiton shadow-[0_0_0_4px_var(--background)]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </span>

            <motion.div
              initial={reduce ? false : { opacity: 0, x: right ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              className={`col-start-2 row-start-1 ${right ? "md:col-start-3" : "md:col-start-1 md:text-right"}`}
            >
              <div className={`group relative overflow-hidden rounded-3xl border bg-card p-5 transition-colors hover:border-laiton-border sm:p-6 ${right ? "" : "md:ml-auto"} max-w-md`}>
                <div aria-hidden className={`pointer-events-none absolute -top-16 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--laiton)_22%,transparent),transparent)] opacity-60 transition-opacity group-hover:opacity-100 ${right ? "-right-12" : "-left-12 md:left-auto md:-right-12"}`} />
                <div className={`relative flex items-center gap-3 ${right ? "" : "md:flex-row-reverse"}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-laiton-border bg-laiton-soft text-laiton">{s.icon}</span>
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">Étape {i + 1}</span>
                </div>
                <h3 className="relative mt-4 text-[18px] font-semibold tracking-[-0.02em]">{s.t}</h3>
                <p className="relative mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
