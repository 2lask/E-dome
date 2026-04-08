"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Loader2, Clock, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { ArchBackground } from "@/components/landing/arch-background";
import DotPattern from "@/components/ui/dot-pattern";

const phases = [
  {
    status: "done" as const,
    phase: "Phase 1",
    title: "Concevoir & prouver le concept",
    period: "",
    items: [
      "Maquette interactive complète (30+ pages)",
      "Réseau social immobilier (feed, stories, reels)",
      "Marketplace avec carte, filtres et calcul de rendement",
      "Dashboard adaptatif selon le profil métier",
      "Système de commissions pour apporteurs d'affaires",
      "Formations vidéo avec modules et certifications",
      "Messagerie, réservations, événements et services",
    ],
  },
  {
    status: "current" as const,
    phase: "Phase 2",
    title: "Valider le besoin & convaincre",
    period: "",
    items: [
      "Récolte de manifestations d'intérêt auprès des acteurs du secteur",
      "Démonstrations et retours terrain",
      "Recherche d'investisseurs et préparation de la levée de fonds",
      "Structuration juridique de la société",
      "Premiers partenariats stratégiques avec des agences et prestataires",
    ],
  },
  {
    status: "upcoming" as const,
    phase: "Phase 3",
    title: "Lever les fonds & recruter",
    period: "",
    items: [
      "Levée de fonds pour financer le développement",
      "Recrutement d'une équipe de développeurs",
      "Développement du site web et de l'application mobile (iOS & Android)",
      "Paiements sécurisés et système d'escrow",
      "Commissions automatisées et traçables",
      "Beta privée Suisse + Thaïlande",
    ],
  },
  {
    status: "upcoming" as const,
    phase: "Phase 4",
    title: "Lancer & s'étendre",
    period: "",
    items: [
      "Lancement public Suisse & Thaïlande",
      "Publication de l'app mobile sur les stores",
      "Expansion vers la France, le Maroc et les EAU",
      "Ouverture de l'API pour les intégrations tierces",
      "Programme ambassadeurs et apporteurs certifiés",
    ],
  },
];

const statusConfig = {
  done: { icon: Check, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-2 border-emerald-400/25", dot: "bg-emerald-400", label: "Terminé", cardBg: "rgba(16, 185, 129, 0.04)" },
  current: { icon: Loader2, color: "text-[#C4956A]", bg: "bg-[#C4956A]/10", border: "border-2 border-[#C4956A]/30", dot: "bg-[#C4956A]", label: "En cours", cardBg: "rgba(196, 149, 106, 0.06)" },
  upcoming: { icon: Clock, color: "text-white/35", bg: "bg-white/5", border: "border border-white/8", dot: "bg-white/20", label: "À venir", cardBg: "rgba(255, 255, 255, 0.02)" },
};

export function RoadmapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,149,106,0.05)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.03)_0%,_transparent_50%)]" />
      <ArchBackground variant="villa" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
          className="mb-16 md:mb-24">
          <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-4 font-medium">Roadmap</p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight mb-6">
            De l&apos;idée{" "}
            <span className="text-[#C4956A]">au lancement.</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-3xl leading-relaxed mb-3">
            Le concept est prouvé. La maquette est en ligne. Maintenant,
            chaque manifestation d&apos;intérêt que nous récoltons renforce
            la preuve que le marché a besoin d&apos;E-Dome — et c&apos;est
            cette traction qui nous permettra de{" "}
            <strong className="text-white">convaincre des investisseurs</strong>,
            lever les fonds nécessaires et constituer l&apos;équipe technique
            qui donnera vie à la plateforme finale.
          </p>
          <p className="text-white/45 text-sm md:text-base max-w-3xl leading-relaxed">
            Chaque personne qui manifeste son intérêt aujourd&apos;hui
            pose une pierre de ce qui deviendra demain la référence
            de l&apos;immobilier connecté.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {phases.map((phase, i) => {
            const config = statusConfig[phase.status];
            const Icon = config.icon;
            return (
              <motion.div key={phase.phase}
                initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                className={`rounded-3xl p-6 md:p-8 ${config.border} relative overflow-hidden`}
                style={{ background: config.cardBg }}>
                {phase.status === "current" && (
                  <DotPattern width={8} height={8} cr={0.4} className="fill-[#C4956A]/10" />
                )}
                {phase.status === "done" && (
                  <DotPattern width={8} height={8} cr={0.4} className="fill-emerald-400/8" />
                )}
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${config.bg}`}>
                      <Icon size={16} className={config.color} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{phase.phase}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <h3 className="relative z-10 text-white text-xl mb-4 tracking-tight">{phase.title}</h3>
                <ul className="relative z-10 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
                      <span className="text-white/40 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA + avantages early members */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7 }}
          className="rounded-3xl border-2 border-[#C4956A]/20 overflow-hidden relative"
          style={{ background: "rgba(196, 149, 106, 0.04)" }}>
          <DotPattern width={10} height={10} cr={0.4} className="fill-[#C4956A]/5" />

          <div className="relative z-10 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#C4956A]/10 border border-[#C4956A]/20 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#C4956A] animate-pulse" />
                <span className="text-[#C4956A] text-xs font-medium">Inscriptions ouvertes</span>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4 tracking-tight">
                Rejoignez les premiers membres.
                <br />
                <span className="text-[#C4956A]">Récoltez les premiers avantages.</span>
              </h3>
              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                Les premiers à manifester leur intérêt ne rejoignent pas
                simplement un projet — ils obtiennent une place privilégiée
                dans l&apos;écosystème E-Dome, avec des avantages exclusifs
                réservés aux membres fondateurs.
              </p>
            </div>

            {/* Avantages grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                {
                  emoji: "🏅",
                  title: "Badge Membre Fondateur",
                  desc: "Un badge permanent sur votre profil qui prouve que vous étiez là dès le début. Reconnaissance à vie dans l'écosystème.",
                },
                {
                  emoji: "🔑",
                  title: "Accès anticipé",
                  desc: "Configurez votre compte, votre profil et vos préférences avant le lancement public. Soyez opérationnel dès le jour J.",
                },
                {
                  emoji: "⭐",
                  title: "Visibilité prioritaire",
                  desc: "Votre profil mis en avant dans les résultats de recherche et les recommandations pendant les premiers mois.",
                },
                {
                  emoji: "🎤",
                  title: "Conférences exclusives",
                  desc: "Accès à des sessions privées pour découvrir les fonctionnalités, donner votre avis et influencer les priorités de développement.",
                },
                {
                  emoji: "🤝",
                  title: "Réseau fondateur",
                  desc: "Intégrez un groupe privé avec les autres premiers membres et les fondateurs. Échangez, collaborez, construisez ensemble.",
                },
                {
                  emoji: "🎁",
                  title: "Tarifs fondateurs",
                  desc: "Des conditions préférentielles sur les futures fonctionnalités premium, les formations et les outils de la plateforme.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-5 border border-[#C4956A]/10 hover:border-[#C4956A]/25 transition-colors" style={{ background: "rgba(0, 0, 0, 0.4)" }}>
                  <span className="text-2xl mb-3 block">{item.emoji}</span>
                  <h4 className="text-white text-sm font-semibold mb-2">{item.title}</h4>
                  <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:contact@edome.world?subject=Manifestation d'intérêt E-Dome"
                className="bg-[#C4956A] rounded-lg px-8 py-4 text-black text-sm font-semibold hover:bg-[#d4a57a] transition-colors flex items-center gap-2">
                Je manifeste mon intérêt <ArrowRight size={16} />
              </a>
              <Link href="/feed"
                className="rounded-lg px-8 py-4 text-white/70 text-sm font-medium hover:bg-white/5 transition-colors border border-white/10">
                Explorer la démo d&apos;abord
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
