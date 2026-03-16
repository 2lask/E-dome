"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Award,
  Rocket,
  Headphones,
  GraduationCap,
  Users,
  Percent,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  CraneConstruction,
  ArchitecturalCrossSection,
} from "@/components/ui/architectural-separators";
import { TrainingMockup } from "@/components/ui/platform-visuals";

/* ── Animation constants ─────────────────────────────── */
const EASE = [0.165, 0.84, 0.44, 1] as const;

const revealVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: EASE },
  }),
};

/* ── Data ────────────────────────────────────────────── */
const benefits: { icon: LucideIcon; title: string; line: string }[] = [
  {
    icon: Award,
    title: "Badge Fondateur permanent",
    line: "Un marqueur de confiance visible sur votre profil, pour toujours.",
  },
  {
    icon: Rocket,
    title: "Accès bêta anticipé",
    line: "Explorez et testez chaque nouvelle fonctionnalité avant le grand public.",
  },
  {
    icon: Headphones,
    title: "Support dédié",
    line: "Une ligne directe avec notre équipe : réponses prioritaires à chaque étape.",
  },
  {
    icon: GraduationCap,
    title: "Formations offertes",
    line: "Webinars exclusifs et sessions de coaching individuel inclus dans le programme.",
  },
  {
    icon: Users,
    title: "Réseau exclusif",
    line: "Rejoignez un cercle de 100 fondateurs triés sur le volet, prêts à collaborer.",
  },
  {
    icon: Percent,
    title: "Conditions apporteurs renforcées",
    line: "Des avantages financiers concrets dès le premier jour du lancement.",
  },
  {
    icon: MessageSquare,
    title: "Voix dans les décisions produit",
    line: "Accédez à la roadmap en avant-première et influencez les prochaines étapes.",
  },
];

const steps = [
  { label: "Manifestez votre intérêt" },
  { label: "Analyse de votre profil" },
  { label: "Échange de présentation" },
  { label: "Accès anticipé au lancement" },
];

/* ── Component ───────────────────────────────────────── */
export default function QualificationSection() {
  return (
    <section
      id="qualification"
      className="relative py-32 px-6 md:px-12 bg-[#FAF8F5]/90 overflow-hidden arch-bg-grid arch-bg-crosshatch"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#8B6F47]/5 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ═══════════════════════════════════════════
            BLOCK 1 — Split layout
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* ── LEFT COLUMN: benefits ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.span
              custom={0}
              variants={revealVariant}
              className="mb-6 inline-flex self-start items-center rounded-full border border-[#8B6F47]/20 bg-[#8B6F47]/5 px-4 py-1.5 text-sm font-medium text-[#8B6F47]"
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#8B6F47] animate-pulse" />
              Programme Membres Fondateurs
            </motion.span>

            {/* Heading */}
            <motion.h2
              custom={1}
              variants={revealVariant}
              className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mb-6"
            >
              Construisez{" "}
              <span className="bg-gradient-to-r from-[#8B6F47] to-[#C4956A] bg-clip-text text-transparent">
                l&apos;immobilier de demain.
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              custom={2}
              variants={revealVariant}
              className="text-[#555555] text-base md:text-lg max-w-xl leading-relaxed mb-10"
            >
              100 fondateurs s&eacute;lectionn&eacute;s construisent la plateforme
              de l&apos;int&eacute;rieur. Acc&egrave;s anticip&eacute;, conditions pr&eacute;f&eacute;rentielles permanentes.
            </motion.p>

            {/* 7 Benefit cards — 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={i}
                    custom={i + 3}
                    variants={revealVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="group rounded-xl border border-[#8B6F47]/12 bg-white p-6 transition-all duration-300 hover:border-[#8B6F47]/20 hover:shadow-[0_0_24px_-8px_rgba(255,224,194,0.12)]"
                  >
                    <div className="mb-4 rounded-xl bg-gradient-to-br from-[#8B6F47]/10 to-[#C4956A]/5 p-3 w-fit">
                      <Icon className="h-7 w-7 text-[#8B6F47]" />
                    </div>
                    <h4 className="text-base font-bold text-[#1A1A1A] leading-snug mb-2">
                      {b.title}
                    </h4>
                    <p className="text-sm text-[#888888] leading-relaxed">
                      {b.line}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: architectural visuals + training mockup ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col items-center justify-center gap-12"
          >
            <motion.div
              custom={1}
              variants={revealVariant}
              className="w-full max-w-md"
            >
              <CraneConstruction />
            </motion.div>

            <motion.div
              custom={2}
              variants={revealVariant}
              className="w-full max-w-md"
            >
              <TrainingMockup />
            </motion.div>

            <motion.div
              custom={3}
              variants={revealVariant}
              className="w-full max-w-md"
            >
              <ArchitecturalCrossSection />
            </motion.div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            BLOCK 2 — Full-width CTA + trust + process
        ═══════════════════════════════════════════ */}

        {/* ── Main CTA ── */}
        <motion.div
          className="text-center mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div
            custom={0}
            variants={revealVariant}
            className="relative inline-block"
          >
            {/* Glow behind button */}
            <div className="absolute -inset-6 bg-gradient-to-r from-[#8B6F47]/20 to-[#C4956A]/20 rounded-3xl blur-2xl animate-pulse" />

            <a
              href="#form"
              className="relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#8B6F47] to-[#C4956A] px-8 py-4 text-lg md:text-xl font-semibold text-[#1A1A1A] shadow-[0_0_48px_rgba(255,224,194,0.3)] hover:shadow-[0_0_72px_rgba(255,224,194,0.45)] transition-shadow duration-300"
            >
              Je rejoins les Membres Fondateurs
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            custom={1}
            variants={revealVariant}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8"
          >
            {["Sans engagement", "Aucun paiement", "Confidentiel"].map(
              (badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-sm text-[#888888]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#8B6F47]" />
                  {badge}
                </span>
              )
            )}
          </motion.div>
        </motion.div>

        {/* ── 4-Step Process ── */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h3
            custom={0}
            variants={revealVariant}
            className="text-2xl md:text-3xl font-bold text-[#1A1A1A] text-center mb-16"
          >
            Comment rejoindre le programme
          </motion.h3>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {/* Desktop horizontal connector line */}
            <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#8B6F47]/30 via-[#8B6F47]/20 to-[#C4956A]/30 rounded-full" />

            {/* Mobile vertical connector line */}
            <div className="md:hidden absolute top-0 bottom-0 left-5 w-px bg-gradient-to-b from-[#8B6F47]/30 via-[#8B6F47]/20 to-[#C4956A]/30 rounded-full" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i + 1}
                variants={revealVariant}
                className="relative flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-0 md:text-center"
              >
                <div className="relative z-10 w-10 h-10 rounded-full bg-white border border-[#8B6F47]/30 flex items-center justify-center shrink-0 md:mb-4 text-lg font-bold text-[#8B6F47]">
                  {i + 1}
                </div>
                <span className="text-sm font-semibold text-[#555555]">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
