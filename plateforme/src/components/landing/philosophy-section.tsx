"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

      <div className="max-w-6xl mx-auto relative">
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24">
          Suisse{" "}
          <em className="not-italic text-[#C4956A]/40" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>x</em>{" "}
          International
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl overflow-hidden aspect-[4/3]">
            <video className="w-full h-full object-cover" muted autoPlay loop playsInline preload="auto"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-[#C4956A]/40 text-xs tracking-widest uppercase mb-4">Lancement prévu</p>
              <p className="text-white/65 text-base md:text-lg leading-relaxed">
                E-Dome sera lancé en <strong className="text-white">Suisse</strong> et
                en <strong className="text-white">Thaïlande</strong> simultanément —
                deux marchés aux dynamiques complémentaires. La Suisse pour sa
                stabilité et sa rigueur. La Thaïlande pour son marché locatif en
                plein essor et sa communauté internationale d&apos;investisseurs.
              </p>
            </div>
            <div className="w-full h-px bg-[#C4956A]/10 my-6" />
            <div className="mb-8">
              <p className="text-[#C4956A]/40 text-xs tracking-widest uppercase mb-4">Multi-devises & multilingue</p>
              <p className="text-white/65 text-base md:text-lg leading-relaxed">
                CHF, EUR, USD, GBP, AED, MAD, THB — les prix s&apos;affichent
                dans votre devise. Interface en français, anglais et thaï.
                Tout est pensé pour l&apos;investisseur qui opère sans frontières.
              </p>
            </div>
            <div className="w-full h-px bg-[#C4956A]/10 my-6" />
            <div>
              <p className="text-[#C4956A]/40 text-xs tracking-widest uppercase mb-4">Expansion progressive</p>
              <p className="text-white/65 text-base md:text-lg leading-relaxed">
                Après le lancement initial : France, Maroc, Émirats, Portugal,
                Grèce, Espagne. Chaque marché s&apos;ouvre avec des partenaires
                locaux et des contenus adaptés aux réalités du terrain.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
