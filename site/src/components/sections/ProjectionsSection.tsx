"use client";

import { motion, useInView } from "framer-motion";
import { Fragment, useRef } from "react";
import {
  Rocket,
  TrendingUp,
  Target,
  Shield,
  Lock,
  UserCheck,
  CreditCard,
  FileText,
  Sprout,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const investmentPhases = [
  {
    title: "Phase Seed",
    amount: "500 000\u20AC",
    description: "MVP + marché pilote",
    subtitle: null,
    icon: Rocket,
    phaseIcon: Sprout,
    gradient: "from-emerald-400/30 to-[#ffe0c2]/30",
    glowColor: "bg-emerald-400/10",
    iconBg: "bg-emerald-400/10",
    iconColor: "text-emerald-400",
    step: 1,
  },
  {
    title: "Série A",
    amount: "3-5M\u20AC",
    description: "Expansion géographique + équipe",
    subtitle: "Année 2",
    icon: TrendingUp,
    phaseIcon: Rocket,
    gradient: "from-[#ffe0c2]/30 to-[#ffdfb5]/30",
    glowColor: "bg-[#ffe0c2]/10",
    iconBg: "bg-[#ffe0c2]/10",
    iconColor: "text-[#ffe0c2]",
    step: 2,
  },
  {
    title: "Valorisation Année 3",
    amount: "80-120M\u20AC",
    description: "Objectif de valorisation",
    subtitle: null,
    icon: Target,
    phaseIcon: Crown,
    gradient: "from-[#ffdfb5]/30 to-amber-400/30",
    glowColor: "bg-amber-400/10",
    iconBg: "bg-amber-400/10",
    iconColor: "text-amber-400",
    step: 3,
  },
];

const complianceBadges = [
  {
    icon: Shield,
    title: "Intermédiaire Technologique",
    subtitle: "Positionnement juridique pur",
  },
  {
    icon: Lock,
    title: "RGPD & LPD",
    subtitle: "Protection des données conforme",
  },
  {
    icon: UserCheck,
    title: "KYC Vérifié",
    subtitle: "Vérification d\u2019identité pour les flux financiers",
  },
  {
    icon: CreditCard,
    title: "PCI-DSS",
    subtitle: "Paiements certifiés sécurisés via Stripe",
  },
  {
    icon: FileText,
    title: "Traçabilité",
    subtitle: "Commissions automatiques et historique complet",
  },
];

/* ------------------------------------------------------------------ */
/*  Growth Curve SVG                                                   */
/* ------------------------------------------------------------------ */

function GrowthCurve() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-16"
    >
      <svg
        ref={ref}
        viewBox="0 0 800 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto w-full max-w-3xl"
        aria-label="Growth curve from Seed to Year 3"
      >
        {/* Grid lines */}
        <line x1="0" y1="180" x2="800" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="0" y1="130" x2="800" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="6 4" />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="800" y2="0">
            <stop offset="0%" stopColor="#ffdfb5" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#ffe0c2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="400" y1="0" x2="400" y2="200">
            <stop offset="0%" stopColor="#ffe0c2" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffe0c2" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill under curve */}
        <motion.path
          d="M80 160 C200 155, 350 140, 400 120 C450 100, 550 60, 720 25 L720 180 L80 180 Z"
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5 }}
        />

        {/* Main curve */}
        <motion.path
          d="M80 160 C200 155, 350 140, 400 120 C450 100, 550 60, 720 25"
          stroke="url(#curveGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.8, delay: 0.3, ease: "easeOut" }}
        />

        {/* Seed dot */}
        <motion.circle
          cx="80" cy="160" r="8"
          fill="#191919" stroke="#ffdfb5" strokeWidth="2.5"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.5, type: "spring" }}
        />
        <text x="80" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="sans-serif">
          Seed
        </text>
        <text x="80" y="148" textAnchor="middle" fill="#ffdfb5" fontSize="10" fontWeight="600" fontFamily="sans-serif">
          500K&euro;
        </text>

        {/* Serie A dot */}
        <motion.circle
          cx="400" cy="120" r="8"
          fill="#191919" stroke="#ffe0c2" strokeWidth="2.5"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 1.0, type: "spring" }}
        />
        <text x="400" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="sans-serif">
          Série A
        </text>
        <text x="400" y="108" textAnchor="middle" fill="#ffe0c2" fontSize="10" fontWeight="600" fontFamily="sans-serif">
          3-5M&euro;
        </text>

        {/* Year 3 dot */}
        <motion.circle
          cx="720" cy="25" r="10"
          fill="#191919" stroke="#f59e0b" strokeWidth="2.5"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 1.6, type: "spring" }}
        />
        <text x="720" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="sans-serif">
          Année 3
        </text>
        <text x="720" y="15" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600" fontFamily="sans-serif">
          80-120M&euro;
        </text>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stair connector between cards                                      */
/* ------------------------------------------------------------------ */

function StairConnector({ index }: { index: number }) {
  if (index >= investmentPhases.length - 1) return null;
  return (
    <div className="hidden sm:flex items-center justify-center -mx-3 z-10">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
        className="flex flex-col items-center gap-1"
      >
        {/* Ascending stair visual */}
        <div className="flex items-end gap-[2px]">
          <div className="w-2 h-3 rounded-sm bg-gradient-to-t from-[#ffe0c2]/40 to-[#ffe0c2]/20" />
          <div className="w-2 h-5 rounded-sm bg-gradient-to-t from-[#ffe0c2]/50 to-[#ffdfb5]/30" />
          <div className="w-2 h-7 rounded-sm bg-gradient-to-t from-[#ffdfb5]/60 to-[#ffdfb5]/40" />
        </div>
        <svg width="40" height="12" viewBox="0 0 40 12" className="text-[#ffe0c2]/50">
          <path d="M0 6 L30 6 M24 2 L30 6 L24 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ProjectionsSection() {
  return (
    <section
      id="projections"
      className="relative bg-[#111111] py-24 px-4 md:px-8"
    >
      {/* Ascending diagonal lines suggesting growth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -35deg,
            transparent,
            transparent 60px,
            rgba(255,224,194,0.4) 60px,
            rgba(255,224,194,0.4) 61px
          )`,
        }}
      />

      {/* Small grid reference numbers in margin areas */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={`grid-ref-l-${i}`}
            className="absolute left-3 text-[8px] font-mono text-white/[0.05]"
            style={{ top: `${15 + i * 15}%` }}
          >
            {String.fromCharCode(65 + i)}{i + 1}
          </span>
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={`grid-ref-r-${i}`}
            className="absolute right-3 text-[8px] font-mono text-white/[0.05]"
            style={{ top: `${15 + i * 15}%` }}
          >
            {String.fromCharCode(65 + i)}{i + 7}
          </span>
        ))}
      </div>

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-[#ffdfb5]/5 blur-[120px]" />
        <div className="absolute top-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-[#ffe0c2]/5 blur-[100px]" />
      </div>

      {/* Rising building/tower SVG with scaleY animation */}
      <motion.svg
        className="pointer-events-none absolute left-4 bottom-12 origin-bottom opacity-[0.05]"
        width="40"
        height="200"
        viewBox="0 0 40 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Tower body */}
        <rect x="5" y="10" width="30" height="185" stroke="white" strokeWidth="0.7" />
        {/* Antenna / spire */}
        <line x1="20" y1="0" x2="20" y2="10" stroke="white" strokeWidth="0.6" />
        <line x1="16" y1="10" x2="24" y2="10" stroke="white" strokeWidth="0.5" />
        {/* Floor lines */}
        <line x1="5" y1="30" x2="35" y2="30" stroke="white" strokeWidth="0.3" />
        <line x1="5" y1="50" x2="35" y2="50" stroke="white" strokeWidth="0.3" />
        <line x1="5" y1="70" x2="35" y2="70" stroke="white" strokeWidth="0.3" />
        <line x1="5" y1="90" x2="35" y2="90" stroke="white" strokeWidth="0.3" />
        <line x1="5" y1="110" x2="35" y2="110" stroke="white" strokeWidth="0.3" />
        <line x1="5" y1="130" x2="35" y2="130" stroke="white" strokeWidth="0.3" />
        <line x1="5" y1="150" x2="35" y2="150" stroke="white" strokeWidth="0.3" />
        <line x1="5" y1="170" x2="35" y2="170" stroke="white" strokeWidth="0.3" />
        {/* Windows (blue accent) */}
        <rect x="9" y="14" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="14" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="9" y="34" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="34" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="9" y="54" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="54" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="9" y="74" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="74" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="9" y="94" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="94" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="9" y="114" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="114" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="9" y="134" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="134" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="9" y="154" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        <rect x="23" y="154" width="8" height="12" stroke="#ffe0c2" strokeWidth="0.4" />
        {/* Entrance */}
        <rect x="13" y="178" width="14" height="17" stroke="white" strokeWidth="0.5" />
        <line x1="20" y1="178" x2="20" y2="195" stroke="white" strokeWidth="0.3" />
      </motion.svg>

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
            Projections &amp; Conformité
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Un projet structuré pour{" "}
            <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
              la croissance
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-2xl text-base text-white/40"
          >
            De l&apos;amorçage à la valorisation, chaque étape est planifiée
            pour maximiser le retour sur investissement.
          </motion.p>
        </motion.div>

        {/* Growth Curve SVG */}
        <GrowthCurve />

        {/* Part 1: Investment Phases */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-20 grid gap-0 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch"
        >
          {investmentPhases.map((phase, idx) => (
            <Fragment key={phase.title}>
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-[2px]",
                  `bg-gradient-to-br ${phase.gradient}`
                )}
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffe0c2]/20 via-transparent to-[#ffdfb5]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative h-full rounded-2xl bg-[#191919] p-8 text-center transition-all duration-300 hover:bg-[#191919]/90">
                  {/* Glow */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                      "h-24 w-40 rounded-full blur-3xl transition-all duration-500",
                      phase.glowColor,
                      "group-hover:h-32 group-hover:w-48"
                    )} />
                  </div>

                  {/* Step indicator */}
                  <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-white/30">
                    {phase.step}
                  </div>

                  <div className="relative">
                    {/* Phase icon (sprout / rocket / crown) */}
                    <motion.div
                      className={cn(
                        "mb-2 inline-flex rounded-full p-2",
                        phase.iconBg
                      )}
                      initial={{ rotate: -10 }}
                      whileInView={{ rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.15, type: "spring" }}
                    >
                      <phase.phaseIcon className={cn("h-5 w-5", phase.iconColor)} />
                    </motion.div>

                    {/* Main icon */}
                    <div className={cn("mb-5 inline-flex rounded-xl p-3", phase.iconBg)}>
                      <phase.icon className={cn("h-7 w-7", phase.iconColor)} />
                    </div>

                    <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-white/50">
                      {phase.title}
                    </p>

                    <motion.p
                      className="mb-3 bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl"
                      initial={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
                      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.15, duration: 0.7, ease: "easeOut" }}
                    >
                      {phase.amount}
                    </motion.p>

                    <p className="text-sm text-white/60">{phase.description}</p>

                    {phase.subtitle && (
                      <p className="mt-2 text-xs font-medium text-[#ffe0c2]/70">
                        {phase.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
              <StairConnector key={`connector-${idx}`} index={idx} />
            </Fragment>
          ))}
        </motion.div>

        {/* Part 2: Legal & Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#ffe0c2]/40" />
            <Shield className="h-5 w-5 text-[#ffe0c2]/60" />
            <h3 className="text-center text-xl font-bold text-white md:text-2xl">
              Conformité &amp; Sécurité
            </h3>
            <Shield className="h-5 w-5 text-[#ffdfb5]/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#ffdfb5]/40" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {complianceBadges.map((badge, idx) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.1,
                  duration: 0.5,
                  ease: "easeOut" as const,
                }}
                className={cn(
                  "group/badge relative flex items-center gap-3 rounded-xl border border-[#201e18] bg-[#191919] px-5 py-4 transition-all duration-300",
                  "hover:border-[#ffe0c2]/30 hover:shadow-[0_0_24px_-6px_rgba(255,224,194,0.2)]"
                )}
              >
                {/* Shield watermark */}
                <div className="pointer-events-none absolute top-1 right-1 opacity-0 transition-opacity duration-300 group-hover/badge:opacity-100">
                  <Shield className="h-3.5 w-3.5 text-[#ffe0c2]/20" />
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffe0c2]/15 to-[#ffdfb5]/15 ring-1 ring-white/5">
                  <badge.icon className="h-5 w-5 text-[#ffe0c2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {badge.title}
                  </p>
                  <p className="text-xs text-white/40">{badge.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
