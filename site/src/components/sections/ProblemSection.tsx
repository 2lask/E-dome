"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Lock,
  Layers,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BlueprintFloorPlan } from "@/components/ui/architectural-separators";
import { MarketplaceMockup } from "@/components/ui/platform-visuals";

const ease = [0.165, 0.84, 0.44, 1] as const;

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease,
    },
  }),
};

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease,
    },
  }),
};

const problems = [
  {
    title: "Commissions élevées",
    description:
      "Les plateformes traditionnelles prélèvent des commissions significatives sur chaque transaction. Ajoutez la publicité obligatoire : une part majeure de votre CA disparaît.",
    icon: DollarSign,
  },
  {
    title: "Dépendance totale",
    description:
      "Zéro contrôle sur la relation client. Algorithmes opaques, risque de suspension. Vos avis, votre clientèle, vos données : tout appartient à des tiers.",
    icon: Lock,
  },
  {
    title: "Marché fragmenté",
    description:
      "5’000+ agences, 150’000+ propriétaires, 250’000+ biens en Suisse — tous sur des outils différents, sans passerelle ni vision d’ensemble.",
    icon: Layers,
  },
];

const comparison = [
  {
    before: "Revenus grignotés par les commissions",
    after: "Revenus optimisés, commissions réduites",
  },
  {
    before: "Publicité payante obligatoire",
    after: "Visibilité organique gratuite",
  },
  {
    before: "Relation client captée par des tiers",
    after: "Relation directe, données propriétaires",
  },
  {
    before: "Outils multiples et fragmentés",
    after: "Écosystème unifié tout-en-un",
  },
  {
    before: "Données dispersées, aucune vue d'ensemble",
    after: "Analytics centralisés en temps réel",
  },
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative bg-[#FAF8F5]/90 py-32 px-6 md:px-12 arch-bg-grid arch-bg-hatching"
    >
      {/* Diagonal hatching pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 18px,
            rgba(255,255,255,0.5) 18px,
            rgba(255,255,255,0.5) 19px
          )`,
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Two-column split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* ── Left Column ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.span
              custom={0}
              variants={slideFromLeft}
              className="mb-6 inline-flex w-fit items-center rounded-full border border-[#8B6F47]/20 bg-[#8B6F47]/5 px-4 py-1.5 text-sm font-medium text-[#8B6F47] backdrop-blur-sm"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#8B6F47] animate-pulse" />
              Le Constat
            </motion.span>

            {/* Heading */}
            <motion.h2
              custom={1}
              variants={slideFromLeft}
              className="mb-10 text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]"
            >
              Un march&eacute; immobilier{" "}
              <span className="bg-gradient-to-r from-[#8B6F47] to-[#C4956A] bg-clip-text text-transparent">
                qui freine ses acteurs.
              </span>
            </motion.h2>

            {/* Problem Cards */}
            <div className="flex flex-col gap-4">
              {problems.map((problem, idx) => {
                const Icon = problem.icon;
                return (
                  <motion.div
                    key={problem.title}
                    custom={idx + 2}
                    variants={slideFromLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                  >
                    <CardSpotlight
                      radius={300}
                      color="rgba(255,224,194,0.08)"
                      className={cn(
                        "relative rounded-xl border border-[#8B6F47]/12 bg-white p-6",
                        "hover:border-[#8B6F47]/20 transition-colors duration-300"
                      )}
                    >
                      {/* Icon + Title row */}
                      <div className="relative z-10 mb-3 flex items-center gap-4">
                        <div className="inline-flex shrink-0 rounded-lg bg-[#8B6F47]/10 p-3">
                          <Icon className="h-6 w-6 text-[#8B6F47]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1A1A1A]">
                          {problem.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="relative z-10 text-base md:text-lg leading-relaxed text-[#555555]">
                        {problem.description}
                      </p>
                    </CardSpotlight>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Right Column ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-8"
          >
            {/* Marketplace Mockup — fragmented market visual */}
            <motion.div
              custom={0}
              variants={slideFromRight}
              className="rounded-xl border border-[#8B6F47]/12 bg-white p-6 md:p-8 transition-colors duration-300 hover:border-[#8B6F47]/20"
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#888888]">
                Marché actuel : outils dispersés
              </p>
              <MarketplaceMockup />
            </motion.div>

            {/* Blueprint Floor Plan visual */}
            <motion.div
              custom={1}
              variants={slideFromRight}
              className="rounded-xl border border-[#8B6F47]/12 bg-white p-6 md:p-8 transition-colors duration-300 hover:border-[#8B6F47]/20"
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#888888]">
                Architecture du marché actuel
              </p>
              <div className="w-full overflow-hidden">
                <BlueprintFloorPlan />
              </div>
            </motion.div>

            {/* Before / After Comparison */}
            <motion.div
              custom={2}
              variants={slideFromRight}
              className="overflow-hidden rounded-xl border border-[#8B6F47]/12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Before — Sans E-Dome */}
                <div className="relative border-b border-[#8B6F47]/12 bg-white p-6 md:border-b-0 md:border-r md:border-[#8B6F47]/12">
                  {/* Subtle warm-red gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(180,80,60,0.06)] to-transparent" />
                  <div className="relative">
                    <span className="mb-5 inline-block rounded-full border border-[rgba(180,80,60,0.2)] bg-[rgba(180,80,60,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[rgba(220,140,120,0.9)]">
                      Sans E-Dome
                    </span>
                    <ul className="mt-4 space-y-3.5">
                      {comparison.map((item) => (
                        <li
                          key={item.before}
                          className="flex items-center gap-3 text-sm leading-snug text-[#888888]"
                        >
                          <XCircle className="h-5 w-5 shrink-0 text-[rgba(220,100,80,0.8)]" />
                          {item.before}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* After — Avec E-Dome */}
                <div className="relative bg-white p-6">
                  {/* Subtle warm-green gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(180,160,100,0.06)] to-transparent" />
                  <div className="relative">
                    <span className="mb-5 inline-block rounded-full border border-[#8B6F47]/20 bg-[#8B6F47]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">
                      Avec E-Dome
                    </span>
                    <ul className="mt-4 space-y-3.5">
                      {comparison.map((item) => (
                        <li
                          key={item.after}
                          className="flex items-center gap-3 text-sm leading-snug text-[#333333]"
                        >
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#8B6F47]" />
                          {item.after}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
