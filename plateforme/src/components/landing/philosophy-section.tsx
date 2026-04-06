"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      {/* Architectural background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=30')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Suisse{" "}
          <em className="not-italic text-white/40" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>x</em>{" "}
          International
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <video
              className="w-full h-full object-cover"
              muted autoPlay loop playsInline preload="auto"
              src="/videos/reel-4.mp4"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-8">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Lancement prévu</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                E-Dome sera lancé simultanément en <strong className="text-white">Suisse</strong> et
                en <strong className="text-white">Thaïlande</strong>, deux marchés aux dynamiques
                complémentaires. La Suisse pour sa stabilité, sa rigueur et son
                pouvoir d&apos;achat. La Thaïlande pour son marché locatif en plein
                essor et sa communauté d&apos;expatriés investisseurs.
              </p>
            </div>
            <div className="w-full h-px bg-white/10 my-6" />
            <div className="mb-8">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Multi-devises & multilingue</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                7 devises (CHF, EUR, USD, GBP, AED, MAD, THB) et 3 langues
                (français, anglais, thaï). Les prix s&apos;affichent dans votre devise,
                les contenus s&apos;adaptent à votre marché. Que vous soyez à
                Neuchâtel, Bangkok, Marrakech ou Dubai — tout est transparent.
              </p>
            </div>
            <div className="w-full h-px bg-white/10 my-6" />
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Expansion progressive</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Après le lancement Suisse-Thaïlande, expansion vers la France,
                le Maroc, les Émirats, le Portugal, la Grèce et l&apos;Espagne.
                Chaque marché s&apos;ouvre avec des partenaires locaux et des
                contenus adaptés.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
