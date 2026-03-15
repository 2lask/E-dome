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
    title: "Commissions \u00e9lev\u00e9es",
    description:
      "Les plateformes traditionnelles pr\u00e9l\u00e8vent des commissions significatives sur chaque transaction. Ajoutez la publicit\u00e9 obligatoire : une part majeure de votre CA dispara\u00eet.",
    icon: DollarSign,
  },
  {
    title: "D\u00e9pendance totale",
    description:
      "Z\u00e9ro contr\u00f4le sur la relation client. Algorithmes opaques, risque de suspension. Vos avis, votre client\u00e8le, vos donn\u00e9es : tout appartient \u00e0 des tiers.",
    icon: Lock,
  },
  {
    title: "March\u00e9 fragment\u00e9",
    description:
      "5\u2019000+ agences, 150\u2019000+ propri\u00e9taires, 250\u2019000+ biens en Suisse \u2014 tous sur des outils diff\u00e9rents, sans passerelle ni vision d\u2019ensemble.",
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
      className="relative bg-[#111111]/85 py-32 px-6 md:px-12 arch-bg-grid arch-bg-hatching"
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
              className="mb-6 inline-flex w-fit items-center rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-4 py-1.5 text-sm font-medium text-[#ffe0c2] backdrop-blur-sm"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffe0c2] animate-pulse" />
              Le Constat
            </motion.span>

            {/* Heading */}
            <motion.h2
              custom={1}
              variants={slideFromLeft}
              className="mb-10 text-3xl md:text-5xl font-bold tracking-tight text-white"
            >
              Un march&eacute; immobilier{" "}
              <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
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
                        "relative rounded-xl border border-[#201e18] bg-[#191919] p-6",
                        "hover:border-[#ffe0c2]/20 transition-colors duration-300"
                      )}
                    >
                      {/* Icon + Title row */}
                      <div className="relative z-10 mb-3 flex items-center gap-4">
                        <div className="inline-flex shrink-0 rounded-lg bg-[#ffe0c2]/10 p-3">
                          <Icon className="h-6 w-6 text-[#ffe0c2]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {problem.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="relative z-10 text-base md:text-lg leading-relaxed text-white/60">
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
              className="rounded-xl border border-[#201e18] bg-[#191919] p-6 md:p-8"
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">
                Marché actuel : outils dispersés
              </p>
              <MarketplaceMockup />
            </motion.div>

            {/* Blueprint Floor Plan visual */}
            <motion.div
              custom={1}
              variants={slideFromRight}
              className="rounded-xl border border-[#201e18] bg-[#191919] p-6 md:p-8"
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">
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
              className="overflow-hidden rounded-xl border border-[#201e18]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Before — Sans E-Dome */}
                <div className="relative border-b border-[#201e18] bg-[#191919] p-6 md:border-b-0 md:border-r md:border-[#201e18]">
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
                          className="flex items-center gap-3 text-sm leading-snug text-white/50"
                        >
                          <XCircle className="h-5 w-5 shrink-0 text-[rgba(220,100,80,0.8)]" />
                          {item.before}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* After — Avec E-Dome */}
                <div className="relative bg-[#191919] p-6">
                  {/* Subtle warm-green gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(180,160,100,0.06)] to-transparent" />
                  <div className="relative">
                    <span className="mb-5 inline-block rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ffe0c2]">
                      Avec E-Dome
                    </span>
                    <ul className="mt-4 space-y-3.5">
                      {comparison.map((item) => (
                        <li
                          key={item.after}
                          className="flex items-center gap-3 text-sm leading-snug text-white/70"
                        >
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#ffe0c2]" />
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
