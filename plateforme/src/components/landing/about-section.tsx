"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextEffect } from "@/components/ui/text-effect";
import { StaggerText } from "@/components/ui/stagger-text";
import { ArchBackground } from "@/components/landing/arch-background";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function AboutSection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black pt-20 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,149,106,0.04)_0%,_transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      <ArchBackground variant="villa" />

      <div className="max-w-6xl mx-auto relative">
        <TextEffect per="char" preset="blur" delay={0.1} trigger={inView}
          className="text-[#C4956A] text-sm tracking-widest uppercase mb-8 font-medium">
          {t("about.label")}
        </TextEffect>

        <StaggerText
          text={`${t("about.title1")} ${t("about.title2")}`}
          direction="bottom"
          stagger={0.04}
          className="text-3xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8 md:mb-12"
        />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-10 md:mb-16">
          <BlurFade delay={0.4} inView><p className="text-white/80 text-base md:text-lg leading-relaxed">
            {t("about.p1")}
          </p></BlurFade>
          <BlurFade delay={0.6} inView><p className="text-white/80 text-base md:text-lg leading-relaxed">
            {t("about.p2")}
          </p></BlurFade>
        </motion.div>

        {/* Roles - visual strip */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5 }}>
          <p className="text-white/50 text-sm mb-6">
            {t("about.roles_label")}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "about.role_hote", color: "text-amber-400/80 border-amber-400/20" },
              { key: "about.role_agence", color: "text-blue-400/80 border-blue-400/20" },
              { key: "about.role_agent", color: "text-cyan-400/80 border-cyan-400/20" },
              { key: "about.role_investisseur", color: "text-emerald-400/80 border-emerald-400/20" },
              { key: "about.role_formateur", color: "text-purple-400/80 border-purple-400/20" },
              { key: "about.role_apporteur", color: "text-[#C4956A] border-[#C4956A]/25" },
              { key: "about.role_photographe", color: "text-pink-400/80 border-pink-400/20" },
              { key: "about.role_courtier", color: "text-teal-400/80 border-teal-400/20" },
              { key: "about.role_notaire", color: "text-indigo-400/80 border-indigo-400/20" },
              { key: "about.role_architecte", color: "text-orange-400/80 border-orange-400/20" },
              { key: "about.role_promoteur", color: "text-rose-400/80 border-rose-400/20" },
              { key: "about.role_client", color: "text-sky-400/80 border-sky-400/20" },
            ].map((r) => (
              <span key={r.key} className={`text-xs px-4 py-2 rounded-full border ${r.color} transition-colors cursor-default`}>
                {t(r.key)}
              </span>
            ))}
            <span className="text-xs px-4 py-2 rounded-full border border-white/15 text-white/70">
              {t("about.more")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
