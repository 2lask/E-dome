"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Loader2, Clock } from "lucide-react";

const phases = [
  {
    status: "done" as const,
    phase: "Phase 1",
    title: "Maquette interactive",
    period: "Q1 2026",
    items: [
      "30+ pages fonctionnelles",
      "Réseau social complet (feed, stories, reels)",
      "Marketplace avec carte MapLibre",
      "Dashboard multi-rôle (5 vues)",
      "Système d'apporteurs d'affaires",
      "Formations vidéo avec modules",
      "Messagerie, réservations, événements",
      "PWA installable sur mobile",
    ],
  },
  {
    status: "current" as const,
    phase: "Phase 2",
    title: "Validation & Levée de fonds",
    period: "Q2 2026",
    items: [
      "Présentation aux investisseurs",
      "Tests utilisateurs (beta fermée)",
      "Itérations UX/UI sur retours",
      "Structuration juridique (Suisse)",
      "Partenariats stratégiques immobiliers",
    ],
  },
  {
    status: "upcoming" as const,
    phase: "Phase 3",
    title: "Développement production",
    period: "Q3-Q4 2026",
    items: [
      "Backend & base de données",
      "Authentification & gestion des rôles",
      "Paiements sécurisés (Stripe)",
      "Upload photos/vidéos réels",
      "Système de commissions automatisé",
      "Lancement beta publique Suisse",
    ],
  },
  {
    status: "upcoming" as const,
    phase: "Phase 4",
    title: "Expansion internationale",
    period: "2027",
    items: [
      "Ouverture France, Maroc, EAU",
      "Partenariats agences locales",
      "App mobile native (iOS/Android)",
      "API pour intégrations tierces",
    ],
  },
];

const statusConfig = {
  done: { icon: Check, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", label: "Terminé" },
  current: { icon: Loader2, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", label: "En cours" },
  upcoming: { icon: Clock, color: "text-white/30", bg: "bg-white/5", border: "border-white/10", label: "À venir" },
};

export function RoadmapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
            Roadmap
          </p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight mb-6">
            Où en{" "}
            <em
              className="not-italic text-white/60"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
            >
              sommes-nous ?
            </em>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed">
            E-Dome est actuellement en phase de maquette interactive. Ce que vous
            voyez ici est une démonstration fonctionnelle de toutes les
            fonctionnalités prévues, avec des données fictives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phase, i) => {
            const config = statusConfig[phase.status];
            const Icon = config.icon;
            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`liquid-glass rounded-3xl p-6 md:p-8 border ${config.border}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${config.bg}`}>
                      <Icon size={16} className={config.color} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{phase.phase}</p>
                      <p className="text-white/30 text-xs">{phase.period}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>

                <h3 className="text-white text-xl mb-4 tracking-tight">
                  {phase.title}
                </h3>

                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        phase.status === "done" ? "bg-emerald-400" :
                        phase.status === "current" ? "bg-amber-400" : "bg-white/20"
                      }`} />
                      <span className="text-white/50 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
