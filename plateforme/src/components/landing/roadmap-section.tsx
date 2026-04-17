"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Loader2, Clock, ArrowRight, Users, Award, KeyRound, Star, Mic, Handshake, Gift } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextEffect } from "@/components/ui/text-effect";
import { StaggerText } from "@/components/ui/stagger-text";
import Link from "next/link";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function RoadmapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLandingLang();

  const phases = [
    {
      status: "done" as const,
      phase: "Phase 1",
      title: t("roadmap.phase1_title"),
      period: "",
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
      period: "",
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
      period: "",
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
      period: "",
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
    done: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-2 border-emerald-200", dot: "bg-emerald-500", label: t("roadmap.status_done") },
    current: { icon: Loader2, color: "text-[#C4956A]", bg: "bg-[#C4956A]/10", border: "border-2 border-[#C4956A]/30", dot: "bg-[#C4956A]", label: t("roadmap.status_current") },
    upcoming: { icon: Clock, color: "text-gray-400", bg: "bg-gray-100", border: "border border-gray-200", dot: "bg-gray-300", label: t("roadmap.status_upcoming") },
  };

  return (
    <section ref={ref} className="bg-[#FAFAFA] py-16 md:py-40 px-6 overflow-hidden relative">

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-10 md:mb-24">
          <TextEffect per="char" preset="blur" delay={0} trigger={inView}
            className="text-[#C4956A] text-sm tracking-widest uppercase mb-4 font-medium">
            {t("roadmap.label")}
          </TextEffect>
          <StaggerText
            text={`${t("roadmap.title1")} ${t("roadmap.title2")}`}
            direction="right"
            stagger={0.05}
            className="text-4xl md:text-6xl text-gray-900 tracking-tight mb-6"
          />
          <BlurFade delay={0.3} inView><p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed mb-3">
            {t("roadmap.desc")}
          </p>
          <p className="text-gray-400 text-sm md:text-base max-w-3xl leading-relaxed">
            {t("roadmap.desc2")}
          </p></BlurFade>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {phases.map((phase, i) => {
            const config = statusConfig[phase.status];
            const Icon = config.icon;
            return (
              <motion.div key={phase.phase}
                initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                className={`rounded-3xl p-6 md:p-8 ${config.border} bg-white shadow-sm relative overflow-hidden`}>
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${config.bg}`}>
                      <Icon size={16} className={config.color} />
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-medium">{phase.phase}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <h3 className="relative z-10 text-gray-900 text-xl mb-4 tracking-tight">{phase.title}</h3>
                <ul className="relative z-10 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
                      <span className="text-gray-500 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA + avantages early members */}
        <motion.div id="inscriptions" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7 }}
          className="rounded-3xl border-2 border-[#C4956A]/20 overflow-hidden relative bg-white shadow-lg">

          <div className="relative z-10 p-5 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-emerald-50 border border-emerald-200 mb-5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-600 text-xs font-medium">{t("roadmap.inscriptions_label")}</span>
              </div>
              <h3 className="text-gray-900 text-2xl md:text-3xl font-semibold mb-4 tracking-tight">
                {t("roadmap.cta_title1")}
                <br />
                <span className="text-[#C4956A]">{t("roadmap.cta_title2")}</span>
              </h3>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-2">
                {t("roadmap.cta_subtitle")}
              </p>
              <p className="text-gray-400 text-xs max-w-xl mx-auto">
                {t("roadmap.cta_disclaimer")}
              </p>
            </div>

            {/* Avantages grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                {
                  icon: Award,
                  iconColor: "text-[#C4956A]",
                  title: t("roadmap.benefit1_title"),
                  desc: t("roadmap.benefit1_desc"),
                },
                {
                  icon: KeyRound,
                  iconColor: "text-emerald-500",
                  title: t("roadmap.benefit2_title"),
                  desc: t("roadmap.benefit2_desc"),
                },
                {
                  icon: Star,
                  iconColor: "text-amber-500",
                  title: t("roadmap.benefit3_title"),
                  desc: t("roadmap.benefit3_desc"),
                },
                {
                  icon: Mic,
                  iconColor: "text-purple-500",
                  title: t("roadmap.benefit4_title"),
                  desc: t("roadmap.benefit4_desc"),
                },
                {
                  icon: Handshake,
                  iconColor: "text-cyan-500",
                  title: t("roadmap.benefit5_title"),
                  desc: t("roadmap.benefit5_desc"),
                },
                {
                  icon: Gift,
                  iconColor: "text-rose-500",
                  title: t("roadmap.benefit6_title"),
                  desc: t("roadmap.benefit6_desc"),
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                <div key={item.title} className="rounded-2xl p-5 bg-white border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                    <ItemIcon size={20} className={item.iconColor} />
                  </div>
                  <h4 className="text-gray-900 text-sm font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/acces"
                className="w-full sm:w-auto bg-[#C4956A] rounded-lg px-8 py-4 text-white text-sm font-semibold hover:bg-[#b5866b] transition-colors flex items-center justify-center gap-2">
                {t("roadmap.cta1")} <ArrowRight size={16} />
              </Link>
              <Link href="/acces"
                className="w-full sm:w-auto rounded-lg px-8 py-4 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center">
                {t("roadmap.cta2")}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
