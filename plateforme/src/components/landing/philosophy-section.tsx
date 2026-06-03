"use client";

import { motion } from "framer-motion";
import { Network, UserCog, Eye, MessageCircle } from "lucide-react";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function PhilosophySection() {
  const { t } = useLandingLang();

  const pillars = [
    {
      icon: Network,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50",
      title: t("philosophy.p1_title"),
      description: t("philosophy.p1_desc"),
    },
    {
      icon: UserCog,
      iconColor: "text-amber-600",
      iconBg: "bg-[#f3f4f6]",
      title: t("philosophy.p2_title"),
      description: t("philosophy.p2_desc"),
    },
    {
      icon: Eye,
      iconColor: "text-[#1262b3]",
      iconBg: "bg-[#f3f4f6]",
      title: t("philosophy.p3_title"),
      description: t("philosophy.p3_desc"),
    },
    {
      icon: MessageCircle,
      iconColor: "text-purple-600",
      iconBg: "bg-[#f3f4f6]",
      title: t("philosophy.p4_title"),
      description: t("philosophy.p4_desc"),
    },
  ];

  return (
    <section className="bg-[#FAFAF8] py-24 md:py-36 px-20 overflow-hidden relative">
      {/* Architectural SVG decorations */}
      <svg
        className="absolute top-20 right-16 opacity-[0.04] pointer-events-none hidden lg:block"
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
      >
        <circle cx="70" cy="70" r="65" stroke="#1262b3" strokeWidth="1" />
        <circle cx="70" cy="70" r="45" stroke="#1262b3" strokeWidth="1" />
        <circle cx="70" cy="70" r="25" stroke="#1262b3" strokeWidth="1" />
        <line x1="70" y1="5" x2="70" y2="135" stroke="#1262b3" strokeWidth="0.5" />
        <line x1="5" y1="70" x2="135" y2="70" stroke="#1262b3" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute bottom-32 left-10 opacity-[0.04] pointer-events-none hidden lg:block"
        width="60"
        height="120"
        viewBox="0 0 60 120"
        fill="none"
      >
        <rect x="5" y="5" width="50" height="50" stroke="#1262b3" strokeWidth="1" />
        <rect x="15" y="65" width="30" height="50" stroke="#1262b3" strokeWidth="1" />
        <line x1="30" y1="55" x2="30" y2="65" stroke="#1262b3" strokeWidth="1" />
      </svg>

      <div className="grid-12 grid grid-cols-12 gap-8 relative">
        <div className="col-span-12">
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#1262b3] text-xs tracking-widest uppercase mb-4 font-medium">
              {t("philosophy.label")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2
              className="text-3xl md:text-5xl lg:text-6xl text-[#1a1a1a] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
            >
              {t("philosophy.title1")}{" "}
              <span className="text-[#1262b3]">{t("philosophy.title2")}</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[#6b7280] text-base max-w-[600px] leading-relaxed">
              {t("philosophy.desc")}
            </p>
          </motion.div>
        </div>

        {/* Pillar cards - 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="bg-white chamfer border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`chamfer-lg p-2 ${pillar.iconBg}`}>
                      <Icon size={18} className={pillar.iconColor} />
                    </div>
                    <h3
                      className="text-[#1a1a1a] text-lg font-medium tracking-tight"
                      style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
                    >
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-[#6b7280] text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Video showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="chamfer-lg overflow-hidden shadow-2xl relative"
        >
          <div className="aspect-[4/5] md:aspect-video relative">
            <video
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              src="/videos/philosophy-bg.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-black/10 to-white/5" />

            {/* Desktop overlay cards */}
            <div className="absolute top-0 left-0 p-8 lg:p-10 hidden md:block">
              <div className="chamfer px-8 py-6 bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg">
                <p className="text-[#1262b3] text-xs tracking-widest uppercase mb-2 font-medium">
                  {t("philosophy.video_label")}
                </p>
                <h3
                  className="text-[#1a1a1a] text-2xl lg:text-3xl tracking-tight leading-tight mb-4"
                  style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
                >
                  {t("philosophy.video_title1")}
                  <br />
                  <span className="text-[#1262b3] italic">{t("philosophy.video_title2")}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: t("philosophy.tag_recherche"), gold: false },
                    { label: t("philosophy.tag_publication"), gold: false },
                    { label: t("philosophy.tag_reservation"), gold: false },
                    { label: t("philosophy.tag_formation"), gold: true },
                    { label: t("philosophy.tag_recommandation"), gold: true },
                    { label: t("philosophy.tag_remuneration"), gold: true },
                  ].map((tag) => (
                    <span
                      key={tag.label}
                      className={`text-[10px] px-4 py-2 chamfer-lg font-medium border ${
                        tag.gold
                          ? "text-[#1262b3] border-[#1262b3]/30 bg-[#1262b3]/10"
                          : "text-[#4b5563] border-gray-200 bg-white/60"
                      }`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop overlay - bottom right */}
            <div className="absolute bottom-0 right-0 p-8 lg:p-10 hidden md:block">
              <div className="chamfer px-8 py-6 max-w-md text-right bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg">
                <div className="w-8 h-0.5 bg-[#1262b3] mb-4 ml-auto" />
                <p className="text-[#1a1a1a] text-base leading-relaxed mb-4">
                  {t("philosophy.video_desktop_p1")}
                </p>
                <p className="text-[#6b7280] text-sm leading-relaxed mb-4">
                  {t("philosophy.video_desktop_p2")}
                </p>
                <a
                  href="#inscriptions"
                  className="inline-flex items-center gap-2 bg-[#1262b3] text-white text-sm font-bold px-6 py-4 chamfer-sm hover:bg-[#1262b3] transition-colors ml-auto shadow-md shadow-[#1262b3]/20"
                >
                  {t("philosophy.video_cta")}
                </a>
              </div>
            </div>
          </div>

          {/* Mobile - text below video */}
          <div className="md:hidden bg-white p-6">
            <p className="text-[#1262b3] text-[10px] tracking-widest uppercase mb-2 font-medium">
              {t("philosophy.video_label")}
            </p>
            <h3
              className="text-[#1a1a1a] text-xl tracking-tight leading-tight mb-4"
              style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
            >
              {t("philosophy.video_title1")}{" "}
              <span className="text-[#1262b3] italic">{t("philosophy.video_title2")}</span>
            </h3>
            <p className="text-[#6b7280] text-sm leading-relaxed mb-4">
              {t("philosophy.video_mobile_desc")}
            </p>
            <a
              href="#inscriptions"
              className="inline-flex items-center gap-2 bg-[#1262b3] text-white text-sm font-bold px-6 py-4 chamfer-sm hover:bg-[#1262b3] transition-colors shadow-md shadow-[#1262b3]/20"
            >
              {t("philosophy.video_cta")}
            </a>
          </div>
        </motion.div>
        </div>      </div>
    </section>
  );
}
