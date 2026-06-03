"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeftRight, Clock, Brain, AlertTriangle } from "lucide-react";
import { useLandingLang } from "@/components/landing/landing-i18n";

/* ------------------------------------------------------------------ */
/*  CountUpStat – animated number that counts up when scrolled into view */
/* ------------------------------------------------------------------ */
function CountUpStat({
  target,
  suffix = "",
  inView,
}: {
  target: number;
  suffix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) setStarted(true);
  }, [inView, started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return (
    <>
      {started ? count : 0}
      {suffix}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Fade-up preset                                                     */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
};

/* ------------------------------------------------------------------ */
/*  Stats data                                                         */
/* ------------------------------------------------------------------ */
const statsConfig = [
  {
    icon: ArrowLeftRight,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    numValue: 12,
    numSuffix: "",
    valueKey: "problem.stat1_value",
    unitKey: "problem.stat1_unit",
    descKey: "problem.stat1_desc",
    sourceKey: "problem.stat1_source",
  },
  {
    icon: Clock,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    numValue: 40,
    numSuffix: "%",
    valueKey: "problem.stat2_value",
    unitKey: "problem.stat2_unit",
    descKey: "problem.stat2_desc",
    sourceKey: "problem.stat2_source",
  },
  {
    icon: Brain,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    numValue: 23,
    numSuffix: " min",
    valueKey: "problem.stat3_value",
    unitKey: "problem.stat3_unit",
    descKey: "problem.stat3_desc",
    sourceKey: "problem.stat3_source",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-red-400",
    iconBg: "bg-red-50",
    numValue: 67,
    numSuffix: "%",
    valueKey: "problem.stat4_value",
    unitKey: "problem.stat4_unit",
    descKey: "problem.stat4_desc",
    sourceKey: "problem.stat4_source",
  },
];

/* ------------------------------------------------------------------ */
/*  ProblemSection                                                     */
/* ------------------------------------------------------------------ */
export function ProblemSection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative bg-white py-24 md:py-40 px-6 overflow-hidden">
      {/* Decorative architectural SVG - minimal building on right */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] md:w-[360px] opacity-[0.05] pointer-events-none"
        viewBox="0 0 200 260"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <rect x="30" y="60" width="60" height="180" />
        <rect x="110" y="100" width="60" height="140" />
        <rect x="45" y="80" width="14" height="20" />
        <rect x="65" y="80" width="14" height="20" />
        <rect x="45" y="120" width="14" height="20" />
        <rect x="65" y="120" width="14" height="20" />
        <rect x="45" y="160" width="14" height="20" />
        <rect x="65" y="160" width="14" height="20" />
        <rect x="125" y="120" width="14" height="20" />
        <rect x="145" y="120" width="14" height="20" />
        <rect x="125" y="160" width="14" height="20" />
        <rect x="145" y="160" width="14" height="20" />
        <rect x="125" y="200" width="14" height="20" />
        <rect x="145" y="200" width="14" height="20" />
        <line x1="60" y1="60" x2="60" y2="40" />
        <line x1="55" y1="40" x2="65" y2="40" />
      </svg>

      <div className="relative max-w-6xl mx-auto">
        {/* Header block */}
        <div className="mb-16 md:mb-24">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-[#1e9df1] text-xs md:text-sm font-medium tracking-widest uppercase mb-6"
          >
            {t("problem.label")}
          </motion.p>

          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl text-gray-900 leading-[1.1] tracking-tight mb-8"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            {t("problem.title1")}{" "}
            <span className="italic text-[#1e9df1]">{t("problem.title2")}</span>
          </motion.h2>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#1a1a1a]/40 text-base md:text-lg max-w-[600px] leading-relaxed"
          >
            {t("problem.desc")}
          </motion.p>
        </div>

        {/* 2x2 stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {statsConfig.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.valueKey}
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8"
              >
                {/* Icon + number */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${stat.iconBg}`}>
                    <Icon size={18} className={stat.iconColor} />
                  </div>
                  <div>
                    <p className="text-gray-900 text-3xl md:text-4xl font-bold tracking-tight leading-none">
                      <CountUpStat target={stat.numValue} suffix={stat.numSuffix} inView={inView} />
                    </p>
                    <p className="text-[#1a1a1a]/50 text-sm mt-1">{t(stat.unitKey)}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#1a1a1a]/60 text-sm leading-relaxed mb-3">
                  {t(stat.descKey)}
                </p>

                {/* Source */}
                <p className="text-[#1a1a1a]/50 text-xs italic">
                  {t(stat.sourceKey)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Green pill */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-2xl md:rounded-full px-6 md:px-8 py-4 border-2 border-emerald-200 bg-emerald-50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-[#1a1a1a]/60 text-sm">
              {t("problem.pill")}{" "}
              <span className="text-emerald-600 font-medium">{t("problem.pill_bold")}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
