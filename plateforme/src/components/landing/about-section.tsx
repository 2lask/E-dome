"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="bg-black pt-32 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-8"
        >
          Notre vision
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-12"
        >
          Un{" "}
          <em
            className="not-italic text-white/60"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            écosystème
          </em>{" "}
          pour
          <br className="hidden md:block" />
          {" "}ceux qui{" "}
          <em
            className="not-italic text-white/60"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            investissent, créent et bâtissent.
          </em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            E-Dome est né d&apos;un constat simple : l&apos;immobilier international est
            fragmenté. Pour investir, il faut jongler entre des dizaines de plateformes,
            d&apos;agents, de formations et de réseaux. Nous avons décidé de tout réunir
            en un seul endroit.
          </p>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Notre plateforme combine un réseau social spécialisé, une marketplace
            immobilière, un système de formation certifiante, un programme d&apos;apporteurs
            d&apos;affaires et des outils d&apos;analyse — le tout accessible depuis la Suisse
            vers le monde entier. De Lausanne à Dubai, de Marrakech à Phuket.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
