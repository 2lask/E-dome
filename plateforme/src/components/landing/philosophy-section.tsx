"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Suisse{" "}
          <em
            className="not-italic text-white/40"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            x
          </em>{" "}
          Monde
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
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-8">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Couverture internationale
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Lausanne, Genève, Zurich, Verbier — mais aussi Nice, Marrakech,
                Dubai, Phuket, Lisbonne, Santorin. E-Dome connecte les marchés
                immobiliers les plus dynamiques du monde. Chaque bien est présenté
                avec ses rendements, son analyse financière et sa projection sur 5
                et 10 ans.
              </p>
            </div>

            <div className="w-full h-px bg-white/10 my-6" />

            <div className="mb-8">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Multi-devises
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                CHF, EUR, USD, GBP, AED, MAD, THB — les prix s&apos;affichent dans
                la devise de votre choix. Que vous investissiez depuis Neuchâtel
                dans un riad à Marrakech ou depuis Genève dans un penthouse à Dubai,
                tout est transparent.
              </p>
            </div>

            <div className="w-full h-px bg-white/10 my-6" />

            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Multilingue
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Interface disponible en français, anglais et thaï. Pensée pour
                les investisseurs suisses qui opèrent à l&apos;international, avec
                des contenus adaptés à chaque marché local.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
