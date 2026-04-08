"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArchBackground } from "@/components/landing/arch-background";
import { ArrowRight, Lightbulb, Target, Handshake, PenTool, Globe, BarChart3 } from "lucide-react";
import Link from "next/link";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-44 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,149,106,0.03)_0%,_transparent_60%)]" />
      <ArchBackground variant="building" />

      <div className="max-w-6xl mx-auto relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-5 font-medium">Les visages derrière E-Dome</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.15] tracking-tight">
            Deux esprits.{" "}
            <span className="text-[#C4956A]">Une mission.</span>
          </h2>
        </motion.div>

        {/* Combined photo banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-20 border-2 border-[#C4956A]/10"
          style={{ background: "rgba(196, 149, 106, 0.03)" }}
        >
          <div className="grid grid-cols-2">
            {/* Léonard photo */}
            <div className="relative aspect-[3/4] md:aspect-[4/5]">
              <img src="/images/founders/leonard.jpg" alt="Léonard Ansermet" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
              <div className="absolute bottom-0 left-0 p-5 md:p-8">
                <p className="text-[#C4956A] text-[10px] md:text-xs tracking-widest uppercase mb-1">Fondateur</p>
                <h3 className="text-white text-lg md:text-2xl font-semibold">Léonard Ansermet</h3>
              </div>
            </div>
            {/* Jean-Pierre photo */}
            <div className="relative aspect-[3/4] md:aspect-[4/5]">
              <img src="/images/founders/jeanpierre.jpg" alt="Jean-Pierre Medard Garza" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
              <div className="absolute bottom-0 right-0 p-5 md:p-8 text-right">
                <p className="text-white/50 text-[10px] md:text-xs tracking-widest uppercase mb-1">Co-fondateur</p>
                <h3 className="text-white text-lg md:text-2xl font-semibold">Jean-Pierre M. Garza</h3>
              </div>
            </div>
          </div>
          {/* Center badge overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.8)", border: "2px solid rgba(196,149,106,0.4)" }}>
              <span className="text-[#C4956A] text-xl md:text-2xl font-bold" style={{ fontFamily: "'Instrument Serif', serif" }}>E-D</span>
            </div>
          </div>
        </motion.div>

        {/* Contributions grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mb-20"
        >
          <p className="text-white/40 text-sm mb-8">Ce que chacun apporte au projet</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Léonard contributions */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <img src="/images/founders/leonard.jpg" alt="" className="w-8 h-8 rounded-full object-cover border border-[#C4956A]/30" />
                <span className="text-[#C4956A] text-sm font-medium">Léonard</span>
              </div>
              {[
                { icon: Lightbulb, title: "Le concept fondateur", desc: "L'idée d'un écosystème unifié est née de son expérience terrain. Il a identifié le manque de connexion entre les acteurs et imaginé un modèle où chaque professionnel a sa place et son dashboard." },
                { icon: PenTool, title: "L'expérience utilisateur", desc: "Chaque page, chaque interaction, chaque parcours a été pensé par Léonard. Plus de 30 pages conçues pour que la plateforme soit aussi intuitive pour un agent que pour un photographe." },
                { icon: Target, title: "Le modèle de commissions", desc: "Il a architecturé le système qui rémunère chaque acteur de la chaîne : apporteurs, formateurs, hôtes — avec des liens traçables et un suivi en temps réel." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl p-5 border border-[#C4956A]/10 hover:border-[#C4956A]/25 transition-colors" style={{ background: "rgba(196, 149, 106, 0.04)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-lg p-2 bg-[#C4956A]/10">
                        <Icon size={16} className="text-[#C4956A]" />
                      </div>
                      <h4 className="text-white text-sm font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Jean-Pierre contributions */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <img src="/images/founders/jeanpierre.jpg" alt="" className="w-8 h-8 rounded-full object-cover border border-white/15" />
                <span className="text-white/70 text-sm font-medium">Jean-Pierre</span>
              </div>
              {[
                { icon: BarChart3, title: "La stratégie business", desc: "Jean-Pierre a structuré le modèle économique d'E-Dome, validé la viabilité financière du projet et défini les indicateurs clés qui guident chaque décision de développement." },
                { icon: Handshake, title: "Les partenariats terrain", desc: "C'est lui qui ouvre les portes. Il identifie et convainc les agences, les promoteurs, les prestataires de rejoindre l'écosystème. Chaque partenariat est pensé pour créer de la valeur des deux côtés." },
                { icon: Globe, title: "La vision internationale", desc: "La stratégie de lancement Suisse-Thaïlande, l'expansion vers de nouveaux marchés, l'adaptation aux réalités locales — Jean-Pierre pose les fondations d'un projet qui dépasse les frontières." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-colors" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-lg p-2 bg-white/5">
                        <Icon size={16} className="text-white/60" />
                      </div>
                      <h4 className="text-white text-sm font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Origin story - compact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-3xl p-8 md:p-12 mb-16 border border-[#C4956A]/10"
          style={{ background: "rgba(196, 149, 106, 0.03)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            <div>
              <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-4 font-medium">Comment tout a commencé</p>
              <p className="text-white/80 text-base leading-relaxed">
                Léonard réalisait ses premières transactions en tant qu&apos;apporteur
                d&apos;affaires, de bouche à oreille. Les deals se concluaient,
                mais les rares outils existants étaient rudimentaires, déconnectés
                les uns des autres. Il voyait un secteur entier où chaque acteur
                travaillait seul, sans réseau, sans visibilité, sans transparence
                sur les commissions.
              </p>
            </div>
            <div className="hidden md:block w-px h-full bg-[#C4956A]/15" />
            <div>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-4 font-medium">Ce qui a tout déclenché</p>
              <p className="text-white/80 text-base leading-relaxed">
                Quand il en a parlé à Jean-Pierre, la réponse a été claire :
                si ça n&apos;existe pas, on le construit nous-mêmes. Jean-Pierre a
                apporté la rigueur commerciale et la vision stratégique. Léonard
                a dessiné chaque page. E-Dome — un dôme digital qui réunit
                tout l&apos;immobilier sous un même toit — est né de cette
                complémentarité.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center"
        >
          <p
            className="text-2xl md:text-3xl text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            L&apos;immobilier de demain se construit{" "}
            <em className="italic text-[#C4956A]">maintenant.</em>
          </p>
          <p className="text-white/50 text-sm mb-8 max-w-xl mx-auto">
            Chaque acteur qui nous rejoint contribue à définir ce que sera
            la plateforme. Votre métier, vos besoins, votre expertise —
            c&apos;est ça qui fait E-Dome.
          </p>
          <Link href="/feed" className="inline-flex items-center gap-2 bg-[#C4956A] text-black rounded-lg px-8 py-4 text-sm font-semibold hover:bg-[#d4a57a] transition-colors">
            Découvrir E-Dome <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
