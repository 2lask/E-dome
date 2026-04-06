"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-8"
        >
          Les fondateurs
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-16"
        >
          Deux{" "}
          <em
            className="not-italic text-white/60"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            visions,
          </em>
          <br className="hidden md:block" />
          {" "}une{" "}
          <em
            className="not-italic text-white/60"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            ambition.
          </em>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="liquid-glass rounded-3xl p-8 md:p-10 mb-8">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-6">
                L&apos;origine
              </p>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                L&apos;idée d&apos;E-Dome est née en Suisse, d&apos;une frustration partagée :
                pourquoi faut-il 10 plateformes différentes pour investir dans
                l&apos;immobilier à l&apos;international ? Entre les portails d&apos;annonces,
                les réseaux d&apos;agents, les formations dispersées et les systèmes
                de parrainage artisanaux — rien n&apos;était connecté.
              </p>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                Léo et son co-fondateur ont décidé de créer l&apos;outil qu&apos;ils
                auraient voulu avoir : une plateforme unique où chaque acteur de
                l&apos;immobilier — hôte, investisseur, formateur, apporteur
                d&apos;affaires, agence — trouve tout ce dont il a besoin, de la
                recherche de biens jusqu&apos;au suivi de ses commissions.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Le nom « E-Dome » symbolise un dôme digital qui englobe tout
                l&apos;écosystème immobilier sous un même toit, sans frontières
                géographiques.
              </p>
            </div>
          </motion.div>

          {/* Founder cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-6"
          >
            {/* Léo */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #C4956A, #d4a832)", color: "#000" }}
                >
                  LM
                </div>
                <div>
                  <h3 className="text-white text-lg font-semibold">Léo Martin</h3>
                  <p className="text-white/40 text-sm">Co-fondateur & Vision produit</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Passionné d&apos;immobilier et de technologie, Léo porte la vision
                globale de la plateforme. C&apos;est lui qui a imaginé l&apos;architecture
                multi-rôle et le système d&apos;apporteurs d&apos;affaires intégré.
                Son objectif : rendre l&apos;investissement immobilier international
                accessible à tous, pas seulement aux professionnels.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">Vision</span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">Produit</span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">Stratégie</span>
              </div>
            </div>

            {/* Co-fondateur */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #666, #999)", color: "#000" }}
                >
                  CF
                </div>
                <div>
                  <h3 className="text-white text-lg font-semibold">Co-fondateur</h3>
                  <p className="text-white/40 text-sm">Co-fondateur & Développement</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Partenaire de la première heure, il apporte son expertise
                complémentaire au projet. Ensemble, ils forment un duo qui combine
                vision entrepreneuriale et exécution terrain pour bâtir un
                écosystème immobilier sans précédent.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">Business</span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">Réseau</span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">Expansion</span>
              </div>
            </div>

            {/* Membre fondateur badge */}
            <div className="liquid-glass rounded-2xl p-5 text-center">
              <p
                className="text-lg font-semibold mb-1"
                style={{
                  background: "linear-gradient(135deg, #d4a832, #f5d679)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Membres Fondateurs #1 & #2
              </p>
              <p className="text-white/40 text-xs">
                Les tout premiers bâtisseurs de l&apos;écosystème E-Dome
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
