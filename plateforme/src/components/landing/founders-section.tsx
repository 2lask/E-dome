"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      {/* Luxury interior background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=30')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

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
          <em className="not-italic text-white/60" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
            parcours,
          </em>
          <br className="hidden md:block" />
          {" "}une{" "}
          <em className="not-italic text-white/60" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
            conviction.
          </em>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="liquid-glass rounded-3xl p-8 md:p-10 mb-8 border border-white/5">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-6">L&apos;histoire</p>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                Léonard et Jean-Pierre se sont rencontrés à travers leurs parcours
                complémentaires dans l&apos;immobilier et l&apos;entrepreneuriat. Un constat
                commun les a rapprochés : dans un secteur qui brasse des milliards,
                aucune plateforme ne propose une expérience véritablement unifiée.
              </p>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                L&apos;un venait du terrain — les visites, les négociations, la
                compréhension fine des besoins des acteurs de l&apos;immobilier.
                L&apos;autre apportait une vision stratégique et opérationnelle,
                avec l&apos;ambition de structurer un modèle économique où chaque
                intervenant est rémunéré à sa juste valeur.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                E-Dome est le fruit de cette rencontre : un écosystème où le
                photographe, le notaire, l&apos;agent, le formateur et l&apos;investisseur
                coexistent dans un même environnement — connectés, rémunérés,
                efficaces. Le nom « E-Dome » incarne cette idée d&apos;un dôme digital
                qui protège et réunit tout l&apos;écosystème immobilier.
              </p>
            </div>

            {/* Video reel */}
            <div className="rounded-3xl overflow-hidden aspect-video">
              <video
                className="w-full h-full object-cover"
                muted autoPlay loop playsInline preload="auto"
                src="/videos/reel-2.mp4"
              />
            </div>
          </motion.div>

          {/* Founder cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-6"
          >
            {/* Léonard */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-[#C4956A]/10 hover:border-[#C4956A]/20 transition-colors">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #C4956A, #d4a832)", color: "#000" }}
                >
                  LA
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold">Léonard Ansermet</h3>
                  <p className="text-[#C4956A]/70 text-sm">Fondateur & CEO</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Visionnaire à l&apos;origine du concept E-Dome, Léonard a conçu
                l&apos;architecture complète de la plateforme : le système multi-rôle
                à 13 profils interchangeables, le modèle de commissions intégré
                et la stratégie de lancement Suisse-Thaïlande. Il porte la vision
                produit et l&apos;ambition de démocratiser l&apos;accès à l&apos;immobilier
                international.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#C4956A]/10 text-[#C4956A]/80 border border-[#C4956A]/10">Vision produit</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#C4956A]/10 text-[#C4956A]/80 border border-[#C4956A]/10">Stratégie</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#C4956A]/10 text-[#C4956A]/80 border border-[#C4956A]/10">UX/UI</span>
              </div>
            </div>

            {/* Jean-Pierre */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #555, #888)", color: "#fff" }}
                >
                  JG
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold">Jean-Pierre Medard Garza</h3>
                  <p className="text-white/40 text-sm">Co-fondateur & COO</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Stratège opérationnel et entrepreneur aguerri, Jean-Pierre
                structure le développement business d&apos;E-Dome. Son expertise en
                gestion d&apos;entreprise et son réseau international sont essentiels
                pour nouer les partenariats avec les agences, promoteurs et
                prestataires de services sur chaque nouveau marché.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/5">Business Dev</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/5">Opérations</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/5">Partenariats</span>
              </div>
            </div>

            {/* Founding badge */}
            <div className="liquid-glass rounded-2xl p-6 text-center border border-[#C4956A]/10">
              <p
                className="text-xl font-semibold mb-2"
                style={{
                  background: "linear-gradient(135deg, #d4a832, #f5d679)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Membres Fondateurs
              </p>
              <p className="text-white/40 text-sm mb-4">
                Les architectes de l&apos;écosystème E-Dome
              </p>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-white/70 text-sm font-medium">#1</p>
                  <p className="text-white/30 text-xs">Léonard A.</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-white/70 text-sm font-medium">#2</p>
                  <p className="text-white/30 text-xs">Jean-Pierre M.G.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
