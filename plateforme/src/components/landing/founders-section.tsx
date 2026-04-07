"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArchBackground } from "@/components/landing/arch-background";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(196,149,106,0.03)_0%,_transparent_70%)]" />
      <ArchBackground variant="building" />
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

      <div className="max-w-6xl mx-auto relative">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-[#C4956A]/50 text-sm tracking-widest uppercase mb-8">Les fondateurs</motion.p>

        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-16">
          Deux{" "}
          <em className="not-italic text-[#C4956A]/50" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>parcours,</em>
          <br className="hidden md:block" />
          {" "}une{" "}
          <em className="not-italic text-[#C4956A]/50" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>conviction.</em>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Story */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="liquid-glass rounded-3xl p-8 md:p-10 border border-[#C4956A]/8">
              <p className="text-[#C4956A]/40 text-xs tracking-widest uppercase mb-6">L&apos;histoire</p>

              <p className="text-white/75 text-base md:text-lg leading-relaxed mb-6">
                Tout a commencé par le terrain. Léonard réalisait ses premières
                transactions immobilières en tant qu&apos;apporteur d&apos;affaires, de
                bouche à oreille, en mettant en relation des acheteurs avec des
                vendeurs dans son réseau. Rapidement, un constat s&apos;est imposé :
                il n&apos;existait aucun outil qui centralisait ce rôle, aucun
                écosystème où l&apos;apporteur avait sa place aux côtés de l&apos;agent,
                du notaire ou du photographe.
              </p>

              <p className="text-white/75 text-base md:text-lg leading-relaxed mb-6">
                Plus il avançait dans le métier, plus il mesurait l&apos;ampleur du
                problème : chaque acteur de l&apos;immobilier travaille en silo.
                Le social et le networking sont absents. Les outils sont dispersés.
                Les commissions sont opaques. Les formations sont déconnectées
                du terrain. Il manquait un lieu qui rassemble tout — un espace
                où l&apos;information circule, où les opportunités se partagent, où
                chaque professionnel est visible et rémunéré à sa juste valeur.
              </p>

              <p className="text-white/55 text-base leading-relaxed mb-6">
                Il en parle à Jean-Pierre, son partenaire de toujours. Ensemble,
                ils décident de construire ce qui n&apos;existe pas encore : un
                écosystème complet, pensé par des gens du terrain, pour des gens
                du terrain. Jean-Pierre, fort de sa formation en commerce et de
                son sens de la rigueur opérationnelle, structure le projet côté
                business et partenariats pendant que Léonard dessine chaque détail
                de l&apos;expérience utilisateur.
              </p>

              <p className="text-white/40 text-sm leading-relaxed">
                E-Dome — un dôme digital qui protège et réunit tout
                l&apos;écosystème immobilier sous un même toit — est né de cette
                complémentarité : la vision produit de l&apos;un, la rigueur
                opérationnelle de l&apos;autre.
              </p>
            </div>
          </motion.div>

          {/* Founder cards */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-6">
            {/* Léonard */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-[#C4956A]/12 hover:border-[#C4956A]/25 transition-colors">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #C4956A, #d4a832)", color: "#000" }}>
                  LA
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold">Léonard Ansermet</h3>
                  <p className="text-[#C4956A]/60 text-sm">Fondateur & CEO</p>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-5">
                À l&apos;origine du concept E-Dome. Ses premières expériences
                d&apos;apporteur d&apos;affaires lui ont révélé le manque criant
                d&apos;un espace social et centralisé dans l&apos;immobilier. Il conçoit
                l&apos;architecture de la plateforme, le modèle de commissions
                intégré et la stratégie de lancement internationale. Il porte la
                vision produit et l&apos;expérience utilisateur de chaque page.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#C4956A]/10 text-[#C4956A]/70 border border-[#C4956A]/10">Vision produit</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#C4956A]/10 text-[#C4956A]/70 border border-[#C4956A]/10">UX/UI</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#C4956A]/10 text-[#C4956A]/70 border border-[#C4956A]/10">Stratégie</span>
              </div>
            </div>

            {/* Jean-Pierre */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/5 hover:border-[#C4956A]/15 transition-colors">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #8a7a6a, #b8a898)", color: "#000" }}>
                  JG
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold">Jean-Pierre Medard Garza</h3>
                  <p className="text-white/40 text-sm">Co-fondateur & COO</p>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-5">
                Titulaire d&apos;un CFC d&apos;employé de commerce avec maturité
                professionnelle, Jean-Pierre apporte sa rigueur et sa vision
                opérationnelle au projet. Il structure le développement business,
                pilote les partenariats avec les acteurs du secteur et s&apos;assure
                que chaque décision sert la croissance durable de l&apos;écosystème.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/45 border border-white/5">Business Dev</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/45 border border-white/5">Opérations</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/45 border border-white/5">Partenariats</span>
              </div>
            </div>

            {/* Founding badge */}
            <div className="liquid-glass rounded-2xl p-6 text-center border border-[#C4956A]/10">
              <p className="text-xl font-semibold mb-2"
                style={{ background: "linear-gradient(135deg, #C4956A, #f5d679)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Membres Fondateurs
              </p>
              <p className="text-white/35 text-sm mb-4">Les architectes de l&apos;écosystème E-Dome</p>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-[#C4956A]/70 text-sm font-medium">#1</p>
                  <p className="text-white/25 text-xs">Léonard A.</p>
                </div>
                <div className="w-px h-8 bg-[#C4956A]/15" />
                <div className="text-center">
                  <p className="text-[#C4956A]/70 text-sm font-medium">#2</p>
                  <p className="text-white/25 text-xs">Jean-Pierre M.G.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
