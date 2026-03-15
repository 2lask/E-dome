"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CompassRose } from "@/components/ui/architectural-separators";
import {
  Globe,
  Home,
  Monitor,
  TrendingUp,
  Link2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ease = [0.165, 0.84, 0.44, 1] as const;

/* ── Animated count-up hook ── */
function useCountUp(target: number, isInView: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView || done) return;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setValue(target * eased);
      if (step >= steps) {
        clearInterval(timer);
        setValue(target);
        setDone(true);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration, done]);

  return { value, done };
}

/* ── Stat card component ── */
function StatCounter({
  display: displayFinal,
  numericTarget,
  label,
  source,
  icon: Icon,
  index,
}: {
  display: string;
  numericTarget: number;
  label: string;
  source: string;
  icon: LucideIcon;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const { value, done } = useCountUp(numericTarget, isInView);

  const formatValue = () => {
    if (done) return displayFinal;
    if (displayFinal.startsWith("$")) {
      if (displayFinal.endsWith("B")) {
        return `$${value.toFixed(1)}B`;
      }
      if (displayFinal.endsWith("T")) {
        return `$${Math.round(value)}T`;
      }
    }
    if (displayFinal.endsWith("Mds")) {
      return `${Math.round(value)} Mds`;
    }
    if (displayFinal.endsWith("%")) {
      return `${Math.round(value)}%`;
    }
    return displayFinal;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease }}
      className="rounded-xl border border-[#201e18] bg-[#191919] p-6 text-center transition-colors duration-300 hover:border-[#ffe0c2]/20"
    >
      <div className="mb-4 inline-flex rounded-lg bg-[#ffe0c2]/10 p-2.5">
        <Icon className="h-5 w-5 text-[#ffe0c2]" />
      </div>
      <p className="text-3xl font-bold text-[#ffe0c2] md:text-4xl">
        {formatValue()}
      </p>
      <p className="mt-3 text-sm font-medium text-white md:text-base">
        {label}
      </p>
      <p className="mt-2 text-xs text-white/30">{source}</p>
    </motion.div>
  );
}

const stats = [
  {
    display: "$32.8B",
    numericTarget: 32.8,
    label: "Marché immobilier digital mondial d\u2019ici 2030",
    source: "Grand View Research, TCAC 13.7%",
    icon: Globe,
  },
  {
    display: "$193B",
    numericTarget: 193,
    label: "Marché location courte durée en 2029",
    source: "Statista, 2024",
    icon: Home,
  },
  {
    display: "15 Mds",
    numericTarget: 15,
    label: "Transactions immobilières Suisse par an (TAM)",
    source: "Office fédéral statistique",
    icon: Monitor,
  },
  {
    display: "60%",
    numericTarget: 60,
    label: "De la population suisse est locataire — record europ\u00e9en",
    source: "Office f\u00e9d\u00e9ral statistique, 2023",
    icon: TrendingUp,
  },
];

const trendChips = [
  { label: "Social commerce\u00a0: $992 Mds \u2192 $2.9T en 2030", icon: TrendingUp },
  { label: "Marketing d\u2019affiliation\u00a0: $17 Mds \u2192 $27.8 Mds en 2030", icon: Link2 },
  { label: "250\u2019000+ biens location CT en Suisse (+25% depuis 2020)", icon: Home },
];

export default function MarketSection() {
  return (
    <section
      id="market"
      className="relative overflow-hidden bg-[#111111] py-32 px-6 md:px-12 arch-bg-grid"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-[#ffe0c2]/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-[#ffdfb5]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* ── Left column: text + trends + statement ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-4 py-1.5 text-sm text-[#ffe0c2]">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffe0c2]" />
              Opportunit\u00e9 de March\u00e9
            </span>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Les chiffres{" "}
              <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
                parlent d&apos;eux-m&ecirc;mes.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Les tendances de fond valident le besoin. Les donn\u00e9es parlent
              d&apos;elles-m\u00eames.
            </p>

            {/* Trend chips */}
            <div className="mt-8 flex flex-wrap gap-2">
              {trendChips.map((chip, i) => (
                <motion.span
                  key={chip.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#201e18] bg-[#191919] px-3.5 py-1.5 text-xs text-white/50"
                >
                  <chip.icon className="h-3.5 w-3.5 text-[#ffe0c2]/60" />
                  {chip.label}
                </motion.span>
              ))}
            </div>

            {/* Bold closing statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="mt-10 rounded-xl border border-[#ffe0c2]/20 bg-[#191919] p-6"
            >
              <p className="text-lg font-semibold leading-relaxed text-white/80 md:text-xl">
                Aucune plateforme ne combine marketplace, réseau social, apporteurs, formations et services.{" "}
                <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
                  E-Dome est le premier à unifier ces 5 marchés.
                </span>
              </p>
            </motion.div>
          </motion.div>

          {/* ── Right column: 2x2 stat cards + CompassRose ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* 2x2 stat grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {stats.map((stat, i) => (
                <StatCounter key={stat.display} index={i} {...stat} />
              ))}
            </div>

            {/* Decorative CompassRose */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="mt-10 flex items-center justify-center"
            >
              <CompassRose />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
