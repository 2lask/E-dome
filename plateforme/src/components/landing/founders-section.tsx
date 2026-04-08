"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArchBackground } from "@/components/landing/arch-background";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(196,149,106,0.04)_0%,_transparent_70%)]" />
      <ArchBackground variant="building" />

      <div className="max-w-5xl mx-auto relative">

        {/* Big quote / statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-28"
        >
          <div className="w-12 h-1 bg-[#C4956A] mb-8" />
          <blockquote
            className="text-3xl md:text-5xl lg:text-6xl text-white leading-[1.15] tracking-tight mb-8"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            &ldquo;On a cherché la plateforme{" "}
            <em className="italic text-[#C4956A]/70">qui réunit tout.</em>
            <br />
            Elle n&apos;existait pas.{" "}
            <em className="italic text-[#C4956A]/70">Alors on l&apos;a construite.</em>&rdquo;
          </blockquote>
          <p className="text-white/40 text-sm">
            — Léonard Ansermet & Jean-Pierre Medard Garza
          </p>
        </motion.div>

        {/* Story flow */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#C4956A]/40 via-white/10 to-[#C4956A]/40" />

          {/* Chapter 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative pl-16 md:pl-20 mb-16"
          >
            <div className="absolute left-4 md:left-6 top-1 w-4 h-4 rounded-full bg-[#C4956A] border-4 border-black" />
            <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">Le point de départ</p>
            <p className="text-white text-base md:text-lg leading-relaxed">
              Léonard fait ses premières armes dans l&apos;immobilier comme apporteur
              d&apos;affaires. Pas d&apos;agence, pas de structure — juste du bouche à
              oreille, des mises en relation et des transactions qui se concluent
              grâce à la confiance. Ça fonctionne, mais un problème revient sans
              cesse : il n&apos;existe aucun outil pensé pour ce rôle. L&apos;apporteur
              est invisible dans l&apos;écosystème digital.
            </p>
          </motion.div>

          {/* Chapter 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="relative pl-16 md:pl-20 mb-16"
          >
            <div className="absolute left-4 md:left-6 top-1 w-4 h-4 rounded-full bg-white/30 border-4 border-black" />
            <p className="text-white/50 text-xs tracking-widest uppercase mb-3 font-medium">Le vrai problème</p>
            <p className="text-white text-base md:text-lg leading-relaxed">
              En creusant, le problème s&apos;élargit. Ce n&apos;est pas que l&apos;apporteur
              — c&apos;est tout le secteur. L&apos;agent publie sur un portail, communique
              sur un autre, gère ses réservations ailleurs et suit ses revenus sur
              un tableur. Le photographe, le notaire, le formateur — chacun
              travaille en silo. Aucun réseau social ne connecte ces métiers.
              Les commissions sont opaques. Les formations sont déconnectées
              de la réalité du terrain.
            </p>
          </motion.div>

          {/* Chapter 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative pl-16 md:pl-20 mb-20"
          >
            <div className="absolute left-4 md:left-6 top-1 w-4 h-4 rounded-full bg-[#C4956A] border-4 border-black" />
            <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">La naissance d&apos;E-Dome</p>
            <p className="text-white text-base md:text-lg leading-relaxed">
              Léonard en parle à Jean-Pierre. La réponse est immédiate : construisons-le.
              Jean-Pierre, formé en commerce et rodé à la gestion opérationnelle,
              structure le projet. Léonard conçoit l&apos;expérience, dessine chaque
              page, imagine le modèle de commissions. Un dôme digital qui protège
              et réunit tout l&apos;écosystème immobilier — c&apos;est E-Dome.
            </p>
          </motion.div>
        </div>

        {/* Founders cards - horizontal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-3xl overflow-hidden border-2 border-[#C4956A]/20 mb-10"
          style={{ background: "rgba(196, 149, 106, 0.1)" }}
        >
          {/* Léonard */}
          <div className="p-8 md:p-10" style={{ background: "rgba(0,0,0,0.85)" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: "linear-gradient(135deg, #C4956A, #d4a832)", color: "#000" }}>
                LA
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Léonard Ansermet</h3>
                <p className="text-[#C4956A] text-xs font-medium">Fondateur · Vision produit · UX</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Conçoit l&apos;architecture de la plateforme, le système multi-rôle,
              le modèle de commissions et la stratégie de lancement. Porte la
              vision produit et dessine chaque détail de l&apos;expérience.
            </p>
          </div>

          {/* Jean-Pierre */}
          <div className="p-8 md:p-10" style={{ background: "rgba(0,0,0,0.9)" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: "linear-gradient(135deg, #8a7a6a, #b8a898)", color: "#000" }}>
                JG
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Jean-Pierre Medard Garza</h3>
                <p className="text-white/50 text-xs font-medium">Co-fondateur · CFC Commerce · Maturité pro</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Structure le développement business, pilote les partenariats
              avec les acteurs du secteur et bâtit les fondations commerciales
              pour une croissance durable de l&apos;écosystème.
            </p>
          </div>
        </motion.div>

        {/* Badge + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#C4956A]/20 flex items-center justify-center">
              <span className="text-[#C4956A] text-xs font-bold">#1</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/60 text-xs font-bold">#2</span>
            </div>
            <p className="text-white/40 text-sm">
              Membres fondateurs de l&apos;écosystème E-Dome
            </p>
          </div>
          <Link href="/feed" className="bg-[#C4956A] text-black rounded-lg px-6 py-3 text-sm font-semibold hover:bg-[#d4a57a] transition-colors flex items-center gap-2">
            Découvrir la plateforme <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
