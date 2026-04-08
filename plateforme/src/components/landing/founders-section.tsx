"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArchBackground } from "@/components/landing/arch-background";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(196,149,106,0.04)_0%,_transparent_70%)]" />
      <ArchBackground variant="building" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-4 font-medium">
            Les fondateurs
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6">
            Nés du{" "}
            <em className="not-italic text-[#C4956A]/70" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
              terrain.
            </em>
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            E-Dome n&apos;est pas né dans un bureau. Il est né de l&apos;expérience
            concrète de deux entrepreneurs qui ont vécu les limites du secteur
            immobilier de l&apos;intérieur.
          </p>
        </motion.div>

        {/* Origin story - full width */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl p-6 md:p-8 border-2 border-[#C4956A]/20" style={{ background: "rgba(196, 149, 106, 0.05)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#C4956A] text-2xl font-bold">01</span>
                <div className="h-px flex-1 bg-[#C4956A]/20" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-3">Le déclic</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Léonard réalise ses premières transactions en tant qu&apos;apporteur
                d&apos;affaires, de bouche à oreille. Il met en relation acheteurs et
                vendeurs dans son réseau. Très vite, un constat s&apos;impose : aucun
                outil ne centralise ce rôle. L&apos;apporteur n&apos;a pas sa place dans
                l&apos;écosystème digital existant.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl p-6 md:p-8 border-2 border-white/10" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white/60 text-2xl font-bold">02</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-3">Le constat</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Plus il avance, plus le problème se révèle : chaque acteur travaille
                en silo. Pas de réseau social dédié. Les outils sont dispersés.
                Les commissions restent opaques. Les formations sont déconnectées
                du terrain. Il manque un lieu qui rassemble tout, où chaque
                professionnel est visible et rémunéré à sa juste valeur.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl p-6 md:p-8 border-2 border-[#C4956A]/20" style={{ background: "rgba(196, 149, 106, 0.05)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#C4956A] text-2xl font-bold">03</span>
                <div className="h-px flex-1 bg-[#C4956A]/20" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-3">La décision</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Il en parle à Jean-Pierre, son partenaire de longue date. Ensemble,
                ils décident de construire ce qui n&apos;existe pas : un écosystème
                complet, pensé par des gens du terrain, pour des gens du terrain.
                E-Dome — un dôme digital qui réunit tout l&apos;immobilier sous un
                même toit — était né.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Founder profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Léonard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-3xl p-8 md:p-10 border-2 border-[#C4956A]/25 hover:border-[#C4956A]/40 transition-colors"
            style={{ background: "rgba(196, 149, 106, 0.06)" }}
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #C4956A, #d4a832)", color: "#000" }}>
                LA
              </div>
              <div>
                <h3 className="text-white text-2xl font-semibold">Léonard Ansermet</h3>
                <p className="text-[#C4956A] text-sm font-medium">Fondateur & CEO</p>
              </div>
            </div>

            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
              À l&apos;origine du concept E-Dome. Ses premières expériences
              d&apos;apporteur d&apos;affaires lui ont révélé le manque criant
              d&apos;un espace social et centralisé dans l&apos;immobilier. Il conçoit
              l&apos;architecture complète de la plateforme, le modèle de commissions
              intégré et la stratégie de lancement. Il porte la vision produit
              et dessine chaque détail de l&apos;expérience utilisateur.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-4 py-2 rounded-full bg-[#C4956A]/15 text-[#C4956A] border border-[#C4956A]/20 font-medium">Vision produit</span>
              <span className="text-xs px-4 py-2 rounded-full bg-[#C4956A]/15 text-[#C4956A] border border-[#C4956A]/20 font-medium">UX / UI</span>
              <span className="text-xs px-4 py-2 rounded-full bg-[#C4956A]/15 text-[#C4956A] border border-[#C4956A]/20 font-medium">Stratégie</span>
            </div>
          </motion.div>

          {/* Jean-Pierre */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-3xl p-8 md:p-10 border-2 border-white/10 hover:border-white/20 transition-colors"
            style={{ background: "rgba(255, 255, 255, 0.03)" }}
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #8a7a6a, #b8a898)", color: "#000" }}>
                JG
              </div>
              <div>
                <h3 className="text-white text-2xl font-semibold">Jean-Pierre Medard Garza</h3>
                <p className="text-white/50 text-sm font-medium">Co-fondateur & COO</p>
              </div>
            </div>

            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
              Titulaire d&apos;un CFC d&apos;employé de commerce avec maturité
              professionnelle, Jean-Pierre apporte sa rigueur et sa vision
              opérationnelle au projet. Il structure le développement business,
              pilote les partenariats avec les acteurs du secteur et construit
              les fondations commerciales de l&apos;écosystème. Chaque décision
              passe par son filtre : est-ce que ça sert la croissance durable ?
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-4 py-2 rounded-full bg-white/5 text-white/60 border border-white/10 font-medium">Business Dev</span>
              <span className="text-xs px-4 py-2 rounded-full bg-white/5 text-white/60 border border-white/10 font-medium">Opérations</span>
              <span className="text-xs px-4 py-2 rounded-full bg-white/5 text-white/60 border border-white/10 font-medium">Partenariats</span>
            </div>
          </motion.div>
        </div>

        {/* Founding badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="rounded-2xl px-10 py-6 border-2 border-[#C4956A]/20 text-center" style={{ background: "rgba(196, 149, 106, 0.06)" }}>
            <p className="text-2xl font-semibold mb-1"
              style={{ background: "linear-gradient(135deg, #C4956A, #f5d679)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Membres Fondateurs
            </p>
            <p className="text-white/50 text-sm mb-5">Les architectes de l&apos;écosystème E-Dome</p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="text-[#C4956A] text-lg font-semibold">#1</p>
                <p className="text-white/50 text-sm">Léonard A.</p>
              </div>
              <div className="w-px h-10 bg-[#C4956A]/20" />
              <div className="text-center">
                <p className="text-white/60 text-lg font-semibold">#2</p>
                <p className="text-white/50 text-sm">Jean-Pierre M.G.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
