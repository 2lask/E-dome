"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Clock, ArrowRight, Award, KeyRound, Star, Mic, Handshake, Gift } from "lucide-react";
import Link from "next/link";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function RoadmapSection() {
  const { t } = useLandingLang();

  const phases = [
    {
      status: "done" as const,
      phase: "Phase 1",
      title: t("roadmap.phase1_title"),
      items: [
        t("roadmap.phase1_item1"),
        t("roadmap.phase1_item2"),
        t("roadmap.phase1_item3"),
        t("roadmap.phase1_item4"),
        t("roadmap.phase1_item5"),
        t("roadmap.phase1_item6"),
        t("roadmap.phase1_item7"),
      ],
    },
    {
      status: "current" as const,
      phase: "Phase 2",
      title: t("roadmap.phase2_title"),
      items: [
        t("roadmap.phase2_item1"),
        t("roadmap.phase2_item2"),
        t("roadmap.phase2_item3"),
        t("roadmap.phase2_item4"),
        t("roadmap.phase2_item5"),
      ],
    },
    {
      status: "upcoming" as const,
      phase: "Phase 3",
      title: t("roadmap.phase3_title"),
      items: [
        t("roadmap.phase3_item1"),
        t("roadmap.phase3_item2"),
        t("roadmap.phase3_item3"),
        t("roadmap.phase3_item4"),
        t("roadmap.phase3_item5"),
        t("roadmap.phase3_item6"),
      ],
    },
    {
      status: "upcoming" as const,
      phase: "Phase 4",
      title: t("roadmap.phase4_title"),
      items: [
        t("roadmap.phase4_item1"),
        t("roadmap.phase4_item2"),
        t("roadmap.phase4_item3"),
        t("roadmap.phase4_item4"),
        t("roadmap.phase4_item5"),
      ],
    },
  ];

  const statusConfig = {
    done: {
      icon: Check,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-2 border-emerald-300",
      dot: "bg-emerald-500",
      label: t("roadmap.status_done"),
    },
    current: {
      icon: Loader2,
      color: "text-[#1e9df1]",
      bg: "bg-[#1e9df1]/10",
      border: "border-2 border-[#1e9df1]/40",
      dot: "bg-[#1e9df1]",
      label: t("roadmap.status_current"),
    },
    upcoming: {
      icon: Clock,
      color: "text-[#1a1a1a]/50",
      bg: "bg-gray-100",
      border: "border border-gray-200",
      dot: "bg-gray-300",
      label: t("roadmap.status_upcoming"),
    },
  };

  return (
    <section className="bg-[#FAFAF8] py-20 md:py-32 px-6 overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative">

        {/* ── Header ── */}
        <div className="mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#1e9df1] text-sm tracking-widest uppercase mb-5 font-medium">
              {t("roadmap.label")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2
              className="text-4xl md:text-6xl text-gray-900 tracking-tight mb-8"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {t("roadmap.title1")} {t("roadmap.title2")}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[#1a1a1a]/60 text-base md:text-lg max-w-[600px] leading-relaxed mb-3">
              {t("roadmap.desc")}
            </p>
            <p className="text-[#1a1a1a]/50 text-sm md:text-base max-w-[600px] leading-relaxed">
              {t("roadmap.desc2")}
            </p>
          </motion.div>
        </div>

        {/* ── Phase cards 2x2 grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {phases.map((phase, i) => {
            const config = statusConfig[phase.status];
            const Icon = config.icon;
            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`rounded-2xl p-6 md:p-8 ${config.border} bg-white shadow-sm relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${config.bg}`}>
                      <Icon size={16} className={config.color} />
                    </div>
                    <p className="text-gray-900 text-sm font-medium">{phase.phase}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.color} font-medium`}>
                    {config.label}
                  </span>
                </div>
                <h3
                  className="text-gray-900 text-xl mb-4 tracking-tight"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {phase.title}
                </h3>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
                      <span className="text-[#1a1a1a]/40 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* ── CTA block: Inscriptions ouvertes ── */}
        <motion.div
          id="inscriptions"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-3xl border-2 border-[#1e9df1]/20 overflow-hidden relative bg-white shadow-lg"
        >
          <div className="p-6 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-emerald-50 border border-emerald-200 mb-5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-600 text-xs font-medium">
                  {t("roadmap.inscriptions_label")}
                </span>
              </div>
              <h3
                className="text-gray-900 text-2xl md:text-3xl font-bold mb-4 tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t("roadmap.cta_title1")}
                <br />
                <span className="text-[#1e9df1]">{t("roadmap.cta_title2")}</span>
              </h3>
              <p className="text-[#1a1a1a]/40 text-sm md:text-base leading-relaxed max-w-[600px] mx-auto mb-2">
                {t("roadmap.cta_subtitle")}
              </p>
              <p className="text-[#1a1a1a]/50 text-xs max-w-xl mx-auto">
                {t("roadmap.cta_disclaimer")}
              </p>
            </div>

            {/* Benefit cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Award, iconColor: "text-[#1e9df1]", title: t("roadmap.benefit1_title"), desc: t("roadmap.benefit1_desc") },
                { icon: KeyRound, iconColor: "text-emerald-500", title: t("roadmap.benefit2_title"), desc: t("roadmap.benefit2_desc") },
                { icon: Star, iconColor: "text-amber-500", title: t("roadmap.benefit3_title"), desc: t("roadmap.benefit3_desc") },
                { icon: Mic, iconColor: "text-purple-500", title: t("roadmap.benefit4_title"), desc: t("roadmap.benefit4_desc") },
                { icon: Handshake, iconColor: "text-cyan-500", title: t("roadmap.benefit5_title"), desc: t("roadmap.benefit5_desc") },
                { icon: Gift, iconColor: "text-rose-500", title: t("roadmap.benefit6_title"), desc: t("roadmap.benefit6_desc") },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl p-5 bg-[#FAFAF8] border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
                      <ItemIcon size={20} className={item.iconColor} />
                    </div>
                    <h4 className="text-gray-900 text-sm font-bold mb-2">{item.title}</h4>
                    <p className="text-[#1a1a1a]/40 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/acces"
                className="w-full sm:w-auto bg-[#1e9df1] rounded-lg px-8 py-4 text-[#1a1a1a] text-sm font-bold hover:bg-[#1e9df1] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {t("roadmap.cta1")} <ArrowRight size={16} />
              </Link>
              <Link
                href="/acces"
                className="w-full sm:w-auto rounded-lg px-8 py-4 text-[#1a1a1a]/60 text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center"
              >
                {t("roadmap.cta2")}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Architectural SVG decoration ── */}
        <svg
          className="absolute -top-4 left-0 w-28 h-28 text-[#1a1a1a]/70 opacity-30"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    </section>
  );
}
