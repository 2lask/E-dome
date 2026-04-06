"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Clock, ArrowLeftRight, Brain } from "lucide-react";

const stats = [
  {
    icon: ArrowLeftRight,
    value: "12",
    unit: "plateformes",
    description: "Un investisseur utilise en moyenne 12 outils différents pour gérer son activité immobilière.",
    source: "McKinsey, PropTech Survey 2024",
  },
  {
    icon: Clock,
    value: "40%",
    unit: "du temps perdu",
    description: "Les professionnels de l'immobilier perdent jusqu'à 40% de leur temps en tâches administratives et navigation entre outils.",
    source: "NAR Technology Report 2024",
  },
  {
    icon: Brain,
    value: "23 min",
    unit: "pour se recentrer",
    description: "Chaque changement de contexte (passer d'une app à une autre) nécessite en moyenne 23 minutes pour retrouver sa concentration.",
    source: "UC Irvine, Gloria Mark Research",
  },
  {
    icon: AlertTriangle,
    value: "67%",
    unit: "d'abandon",
    description: "67% des prospects abandonnent un parcours d'achat immobilier en ligne quand ils doivent changer de plateforme en cours de route.",
    source: "JLL Digital Buyer Journey 2024",
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      {/* Blueprint background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=30')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Le problème</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8">
            L&apos;immobilier est{" "}
            <em className="not-italic text-white/60" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
              fragmenté.
            </em>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-3xl leading-relaxed">
            Pour chercher un bien, vous allez sur Immoscout. Pour réserver, sur Airbnb.
            Pour vous former, sur Udemy. Pour trouver un photographe, sur un autre site.
            Pour suivre vos commissions, un tableur Excel.
            Chaque étape vous renvoie vers une plateforme différente —
            et à chaque transition, vous perdez du temps, de l&apos;attention et des opportunités.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                className="liquid-glass rounded-3xl p-6 md:p-8 border border-red-500/10 hover:border-red-500/20 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-full p-2.5 bg-red-500/10 shrink-0">
                    <Icon size={18} className="text-red-400/70" />
                  </div>
                  <div>
                    <p className="text-white text-3xl md:text-4xl font-semibold tracking-tight">
                      {stat.value}
                      <span className="text-white/30 text-lg ml-2 font-normal">{stat.unit}</span>
                    </p>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-3">{stat.description}</p>
                <p className="text-white/20 text-xs italic">{stat.source}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Solution teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="liquid-glass rounded-full inline-flex items-center gap-3 px-8 py-4 border border-emerald-500/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-white/70 text-sm">
              E-Dome réunit tout en un seul endroit.{" "}
              <span className="text-white font-medium">Zéro friction, zéro dispersion.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
