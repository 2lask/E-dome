"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextEffect } from "@/components/ui/text-effect";
import { StaggerText } from "@/components/ui/stagger-text";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function AboutSection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-white pt-20 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden relative">
      {/* Subtle warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,149,106,0.06)_0%,_transparent_70%)]" />

      {/* Decorative architectural silhouette */}
      <svg
        className="absolute right-6 top-24 w-32 md:w-48 opacity-[0.04] text-[#C4956A]/20 pointer-events-none"
        viewBox="0 0 120 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple house/building outline */}
        <rect x="10" y="50" width="100" height="80" rx="2" />
        <line x1="10" y1="80" x2="110" y2="80" />
        <polygon points="60,10 10,50 110,50" />
        <rect x="25" y="58" width="18" height="16" rx="1" />
        <rect x="77" y="58" width="18" height="16" rx="1" />
        <rect x="25" y="88" width="18" height="16" rx="1" />
        <rect x="77" y="88" width="18" height="16" rx="1" />
        <rect x="46" y="100" width="28" height="30" rx="1" />
        <line x1="60" y1="100" x2="60" y2="130" />
        <circle cx="60" cy="28" r="3" />
        <line x1="10" y1="50" x2="10" y2="130" />
        <line x1="110" y1="50" x2="110" y2="130" />
      </svg>

      <div className="max-w-6xl mx-auto relative">
        <TextEffect per="char" preset="blur" delay={0.1} trigger={inView}
          className="text-[#C4956A] text-sm tracking-widest uppercase mb-8 font-medium">
          {t("about.label")}
        </TextEffect>

        <StaggerText
          text={`${t("about.title1")} ${t("about.title2")}`}
          direction="bottom"
          stagger={0.04}
          className="text-3xl md:text-6xl lg:text-7xl text-gray-900 leading-[1.1] tracking-tight mb-8 md:mb-12"
        />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-10 md:mb-16">
          <BlurFade delay={0.4} inView><p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {t("about.p1")}
          </p></BlurFade>
          <BlurFade delay={0.6} inView><p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {t("about.p2")}
          </p></BlurFade>
        </motion.div>

        {/* Roles - visual strip */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5 }}>
          <p className="text-gray-400 text-sm mb-6">
            {t("about.roles_label")}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "about.role_hote", color: "text-amber-600 border-amber-200 bg-amber-50" },
              { key: "about.role_agence", color: "text-blue-600 border-blue-200 bg-blue-50" },
              { key: "about.role_agent", color: "text-cyan-600 border-cyan-200 bg-cyan-50" },
              { key: "about.role_investisseur", color: "text-emerald-600 border-emerald-200 bg-emerald-50" },
              { key: "about.role_formateur", color: "text-purple-600 border-purple-200 bg-purple-50" },
              { key: "about.role_apporteur", color: "text-[#C4956A] border-[#C4956A]/20 bg-[#C4956A]/5" },
              { key: "about.role_photographe", color: "text-pink-600 border-pink-200 bg-pink-50" },
              { key: "about.role_courtier", color: "text-teal-600 border-teal-200 bg-teal-50" },
              { key: "about.role_notaire", color: "text-indigo-600 border-indigo-200 bg-indigo-50" },
              { key: "about.role_architecte", color: "text-orange-600 border-orange-200 bg-orange-50" },
              { key: "about.role_promoteur", color: "text-rose-600 border-rose-200 bg-rose-50" },
              { key: "about.role_client", color: "text-sky-600 border-sky-200 bg-sky-50" },
            ].map((r) => (
              <span key={r.key} className={`text-xs px-4 py-2 rounded-full border ${r.color} transition-colors cursor-default font-medium`}>
                {t(r.key)}
              </span>
            ))}
            <span className="text-xs px-4 py-2 rounded-full border border-gray-200 text-gray-500 bg-gray-50 font-medium">
              {t("about.more")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
