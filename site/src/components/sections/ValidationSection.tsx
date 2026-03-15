"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  CheckCircle,
  FileCheck,
  BarChart3,
  Code2,
  CreditCard,
  BookOpen,
  Globe,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

/* ── Circular Progress Ring ── */
function ProgressRing({
  percent,
  delay = 0,
}: {
  percent: number;
  delay?: number;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg
      className="absolute inset-0 m-auto h-28 w-28 -rotate-90 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
      viewBox="0 0 120 120"
    >
      {/* background circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="4"
        opacity="0.2"
      />
      {/* animated arc */}
      <motion.circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe0c2" />
          <stop offset="100%" stopColor="#ffdfb5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Animated Checkmark ── */
function AnimatedCheck({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe0c2] to-[#ffdfb5]"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: delay + 0.8,
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    >
      <motion.div
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 1.0, duration: 0.3 }}
      >
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}

/* ── Glow Pulse (fires once on viewport entry) ── */
function GlowPulse({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-2xl"
      initial={{ boxShadow: "0 0 0px 0px rgba(255,224,194,0)" }}
      whileInView={{
        boxShadow: [
          "0 0 0px 0px rgba(255,224,194,0)",
          "0 0 30px 6px rgba(255,224,194,0.35)",
          "0 0 0px 0px rgba(255,224,194,0)",
        ],
      }}
      viewport={{ once: true }}
      transition={{ delay: delay + 0.5, duration: 1.2, ease: "easeInOut" }}
    />
  );
}

const validationMetrics = [
  {
    value: "50+",
    label: "Entretiens terrain réalisés",
    subtitle: null,
    icon: MessageSquare,
    ringPercent: 75,
  },
  {
    value: "85%",
    label: "Taux de validation du problème",
    subtitle: null,
    icon: CheckCircle,
    ringPercent: 85,
  },
  {
    value: "30",
    label: "Lettres d\u2019engagement signées",
    subtitle: "Représentant 350+ biens",
    icon: FileCheck,
    ringPercent: 60,
  },
  {
    value: "800K-1.2M CHF",
    label: "GMV mensuel potentiel",
    subtitle: "Basé sur les engagements early adopters",
    icon: BarChart3,
    ringPercent: 90,
  },
];

const roadmapIcons = [Code2, CreditCard, BookOpen, Globe] as const;

const roadmapSteps = [
  {
    period: "Mois 1-4",
    title: "MVP",
    description:
      "Développement et lancement de la version minimale viable",
  },
  {
    period: "Mois 5-8",
    title: "Paiements & Apporteurs",
    description:
      "Intégration Stripe Connect, système d\u2019affiliation, dashboard",
  },
  {
    period: "Mois 9-12",
    title: "Formations & Événements",
    description:
      "Marketplace de formations, lives, séminaires, optimisation",
  },
  {
    period: "Année 2-3",
    title: "Expansion Internationale",
    description:
      "Scaling géographique, ML, API publique, 50K+ utilisateurs",
  },
];

/* ── Confidence Meter ── */
function ConfidenceMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mt-20 max-w-2xl rounded-2xl border border-[#201e18] bg-[#191919] p-8"
    >
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-white">Indice de confiance marché</h4>
        <motion.span
          className="text-2xl font-extrabold bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          85%
        </motion.span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/5">
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5]"
          initial={{ width: "0%" }}
          animate={inView ? { width: "85%" } : {}}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
        {/* Shimmer */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={inView ? { x: "200%" } : {}}
          transition={{ duration: 1.2, delay: 1.4, ease: "easeInOut" }}
        />
      </div>
      <p className="mt-3 text-xs text-white/40">
        Basé sur les entretiens, lettres d&apos;engagement et retours early adopters
      </p>
    </motion.div>
  );
}

/* ── Roadmap Node with ring animation ── */
function RoadmapNode({
  idx,
  icon: Icon,
  delay,
  size = "desktop",
}: {
  idx: number;
  icon: typeof Code2;
  delay: number;
  size?: "desktop" | "mobile";
}) {
  const dim = size === "desktop" ? "h-12 w-12" : "h-10 w-10";
  const iconDim = size === "desktop" ? "h-5 w-5" : "h-4 w-4";
  const ringSize = size === "desktop" ? 52 : 44;
  const r = ringSize / 2 - 3;
  const circ = 2 * Math.PI * r;

  return (
    <div className={cn("relative z-10 flex items-center justify-center", dim)}>
      {/* Outer ring animation */}
      <svg
        className="absolute inset-0"
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(-90deg)" }}
      >
        <motion.circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={r}
          fill="none"
          stroke="url(#nodeRingGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="nodeRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe0c2" />
            <stop offset="100%" stopColor="#ffdfb5" />
          </linearGradient>
        </defs>
      </svg>
      {/* Inner circle with icon */}
      <motion.div
        className={cn(
          "flex items-center justify-center rounded-full border-2 border-[#ffe0c2] bg-[#111111]",
          dim
        )}
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
      >
        <Icon className={cn(iconDim, "text-[#ffe0c2]")} />
      </motion.div>
    </div>
  );
}

export default function ValidationSection() {
  return (
    <section
      id="validation"
      className="relative bg-[#111111] py-24 px-4 md:px-8"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#ffe0c2]/5 blur-[150px]" />
      </div>

      {/* Construction crane SVG decoration */}
      <svg
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.04]"
        width="80"
        height="180"
        viewBox="0 0 80 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Vertical mast */}
        <line x1="30" y1="20" x2="30" y2="175" stroke="white" strokeWidth="0.8" />
        <line x1="38" y1="20" x2="38" y2="175" stroke="white" strokeWidth="0.8" />
        {/* Mast cross bracing */}
        <line x1="30" y1="30" x2="38" y2="45" stroke="white" strokeWidth="0.4" />
        <line x1="38" y1="30" x2="30" y2="45" stroke="white" strokeWidth="0.4" />
        <line x1="30" y1="50" x2="38" y2="65" stroke="white" strokeWidth="0.4" />
        <line x1="38" y1="50" x2="30" y2="65" stroke="white" strokeWidth="0.4" />
        <line x1="30" y1="70" x2="38" y2="85" stroke="white" strokeWidth="0.4" />
        <line x1="38" y1="70" x2="30" y2="85" stroke="white" strokeWidth="0.4" />
        <line x1="30" y1="90" x2="38" y2="105" stroke="white" strokeWidth="0.4" />
        <line x1="38" y1="90" x2="30" y2="105" stroke="white" strokeWidth="0.4" />
        <line x1="30" y1="110" x2="38" y2="125" stroke="white" strokeWidth="0.4" />
        <line x1="38" y1="110" x2="30" y2="125" stroke="white" strokeWidth="0.4" />
        <line x1="30" y1="130" x2="38" y2="145" stroke="white" strokeWidth="0.4" />
        <line x1="38" y1="130" x2="30" y2="145" stroke="white" strokeWidth="0.4" />
        <line x1="30" y1="150" x2="38" y2="165" stroke="white" strokeWidth="0.4" />
        <line x1="38" y1="150" x2="30" y2="165" stroke="white" strokeWidth="0.4" />
        {/* Horizontal jib (boom) */}
        <line x1="2" y1="20" x2="75" y2="20" stroke="white" strokeWidth="0.7" />
        {/* Counter-jib */}
        <line x1="2" y1="18" x2="2" y2="22" stroke="white" strokeWidth="0.5" />
        {/* Jib support cables */}
        <line x1="34" y1="5" x2="75" y2="20" stroke="white" strokeWidth="0.4" />
        <line x1="34" y1="5" x2="2" y2="20" stroke="white" strokeWidth="0.4" />
        {/* Top of mast peak */}
        <line x1="30" y1="5" x2="38" y2="5" stroke="white" strokeWidth="0.5" />
        <line x1="30" y1="5" x2="30" y2="20" stroke="white" strokeWidth="0.5" />
        <line x1="38" y1="5" x2="38" y2="20" stroke="white" strokeWidth="0.5" />
        {/* Hook cable */}
        <line x1="60" y1="20" x2="60" y2="55" stroke="white" strokeWidth="0.4" strokeDasharray="2 2" />
        {/* Hook */}
        <path d="M56 55 L64 55 L62 62 Q60 66 58 62 Z" stroke="#ffe0c2" strokeWidth="0.5" fill="none" />
        {/* Base */}
        <line x1="20" y1="175" x2="48" y2="175" stroke="white" strokeWidth="0.8" />
        <line x1="22" y1="175" x2="28" y2="178" stroke="white" strokeWidth="0.5" />
        <line x1="46" y1="175" x2="40" y2="178" stroke="white" strokeWidth="0.5" />
        {/* Counterweight */}
        <rect x="2" y="22" width="12" height="6" stroke="#ffe0c2" strokeWidth="0.4" fill="none" />
      </svg>

      <div className="relative z-10 mx-auto max-w-screen-xl">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/70 backdrop-blur-sm"
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffe0c2] animate-pulse" />
            Validation Terrain
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Validé par le marché.{" "}
            <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
              Avant même le lancement.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
          >
            Nos chiffres de pré-lancement démontrent un product-market fit fort
            et une demande réelle.
          </motion.p>
        </motion.div>

        {/* Validation Metrics */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {validationMetrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-[#201e18] bg-[#191919] p-6 text-center transition-all duration-300",
                "hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,224,194,0.2)]"
              )}
            >
              {/* Glow pulse on viewport entry */}
              <GlowPulse delay={idx * 0.15} />

              {/* Animated check badge */}
              <AnimatedCheck delay={idx * 0.15} />

              {/* Circular progress ring behind metric */}
              <ProgressRing percent={metric.ringPercent} delay={idx * 0.15} />

              {/* Glow behind number */}
              <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-8">
                <div className="h-16 w-32 rounded-full bg-[#ffe0c2]/10 blur-2xl transition-all group-hover:bg-[#ffe0c2]/20" />
              </div>

              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-[#ffe0c2]/10 p-3">
                  <metric.icon className="h-6 w-6 text-[#ffe0c2]" />
                </div>
                <p className="mb-2 bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                  {metric.value}
                </p>
                <p className="text-sm font-semibold text-white">
                  {metric.label}
                </p>
                {metric.subtitle && (
                  <p className="mt-1 text-xs text-white/40">
                    {metric.subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <h3 className="mb-12 text-center text-2xl font-bold text-white md:text-3xl">
            Roadmap
          </h3>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Connecting line background */}
              <div className="absolute top-6 left-0 right-0 h-[2px] bg-white/5" />
              {/* Animated progress fill */}
              <motion.div
                className="absolute top-6 left-0 h-[2px] bg-gradient-to-r from-[#ffe0c2] via-[#ffdfb5] to-[#ffe0c2]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              />

              <div className="relative grid grid-cols-4 gap-6">
                {roadmapSteps.map((step, idx) => {
                  const PhaseIcon = roadmapIcons[idx];
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: idx * 0.15,
                        duration: 0.5,
                        ease: "easeOut" as const,
                      }}
                      className="flex flex-col items-center text-center"
                    >
                      {/* Node with icon & ring animation */}
                      <div className="mb-6">
                        <RoadmapNode
                          idx={idx}
                          icon={PhaseIcon}
                          delay={idx * 0.2 + 0.3}
                          size="desktop"
                        />
                      </div>

                      <div className="rounded-xl border border-[#201e18] bg-[#191919] p-5">
                        {/* Phase icon */}
                        <div className="mb-2 mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffe0c2]/10">
                          <PhaseIcon className="h-4 w-4 text-[#ffe0c2]" />
                        </div>
                        <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-[#ffe0c2]">
                          {step.period}
                        </span>
                        <p className="mb-2 text-base font-bold text-white">
                          {step.title}
                        </p>
                        <p className="text-xs leading-relaxed text-white/50">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden">
            <div className="relative ml-6 pl-8">
              {/* Static background line */}
              <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-white/5" />
              {/* Animated progress fill */}
              <motion.div
                className="absolute top-0 left-0 w-[2px] bg-gradient-to-b from-[#ffe0c2] via-[#ffdfb5] to-[#ffe0c2]"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              />

              {roadmapSteps.map((step, idx) => {
                const PhaseIcon = roadmapIcons[idx];
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.5,
                      ease: "easeOut" as const,
                    }}
                    className="relative mb-8 last:mb-0"
                  >
                    {/* Node with icon & ring animation */}
                    <div className="absolute -left-[calc(2rem+5px)] top-0">
                      <RoadmapNode
                        idx={idx}
                        icon={PhaseIcon}
                        delay={idx * 0.2 + 0.3}
                        size="mobile"
                      />
                    </div>

                    <div className="rounded-xl border border-[#201e18] bg-[#191919] p-5">
                      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe0c2]/10">
                        <PhaseIcon className="h-3.5 w-3.5 text-[#ffe0c2]" />
                      </div>
                      <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-[#ffe0c2]">
                        {step.period}
                      </span>
                      <p className="mb-1 text-base font-bold text-white">
                        {step.title}
                      </p>
                      <p className="text-xs leading-relaxed text-white/50">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Confidence Meter */}
        <ConfidenceMeter />
      </div>
    </section>
  );
}
