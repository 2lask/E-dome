"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Network, UserCog, Eye, MessageCircle } from "lucide-react";
import { ArchBackground } from "@/components/landing/arch-background";
import { StaggerText } from "@/components/ui/stagger-text";
import { BlurFade } from "@/components/ui/blur-fade";
import GlowingBorder from "@/components/ui/glowing-border";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function PhilosophySection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const pillars = [
    {
      icon: Network,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-400/10",
      title: t("philosophy.p1_title"),
      description: t("philosophy.p1_desc"),
    },
    {
      icon: UserCog,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-400/10",
      title: t("philosophy.p2_title"),
      description: t("philosophy.p2_desc"),
    },
    {
      icon: Eye,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
      title: t("philosophy.p3_title"),
      description: t("philosophy.p3_desc"),
    },
    {
      icon: MessageCircle,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-400/10",
      title: t("philosophy.p4_title"),
      description: t("philosophy.p4_desc"),
    },
  ];

  return (
    <section ref={ref} className="bg-black py-16 md:py-28 lg:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      <ArchBackground variant="mixed" />

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-16 md:mb-24">
          <BlurFade delay={0} inView>
            <p className="text-[#C4956A]/50 text-sm tracking-widest uppercase mb-4">{t("philosophy.label")}</p>
          </BlurFade>
          <StaggerText
            text={`${t("philosophy.title1")} ${t("philosophy.title2")}`}
            direction="left"
            stagger={0.06}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-6"
          />
          <BlurFade delay={0.4} inView>
            <p className="text-white/45 text-base md:text-lg max-w-3xl leading-relaxed">
              {t("philosophy.desc")}
            </p>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              >
                <GlowingBorder>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`rounded-full p-2.5 ${pillar.iconBg}`}>
                        <Icon size={18} className={pillar.iconColor} />
                      </div>
                      <h3 className="text-white text-lg font-medium tracking-tight">{pillar.title}</h3>
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                </GlowingBorder>
              </motion.div>
            );
          })}
        </div>

        {/* Video showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="rounded-3xl overflow-hidden aspect-[4/5] md:aspect-video relative"
        >
          <video
            className="w-full h-full object-cover"
            muted autoPlay loop playsInline preload="auto"
            src="/videos/philosophy-bg.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Mobile: single block at bottom. Desktop: two blocks */}

          {/* Desktop only - top left title */}
          <div className="absolute top-0 left-0 p-8 lg:p-10 hidden md:block">
            <div className="rounded-2xl px-7 py-5" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)" }}>
              <p className="text-[#C4956A]/60 text-xs tracking-[0.2em] uppercase mb-2">{t("philosophy.video_label")}</p>
              <h3 className="text-white text-2xl lg:text-3xl font-semibold tracking-tight leading-tight mb-4">
                {t("philosophy.video_title1")}<br />
                <span className="text-[#C4956A]">{t("philosophy.video_title2")}</span>
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
                  <span key={tag.label} className={`text-[10px] px-3 py-1.5 rounded-full font-medium border ${
                    tag.gold
                      ? "text-[#C4956A] border-[#C4956A]/30 bg-[#C4956A]/10"
                      : "text-white/80 border-white/15 bg-white/5"
                  }`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop only - bottom right description */}
          <div className="absolute bottom-0 right-0 p-8 lg:p-10 hidden md:block">
            <div className="rounded-2xl px-7 py-5 max-w-md text-right" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)" }}>
              <div className="w-8 h-0.5 bg-[#C4956A]/50 mb-4 ml-auto" />
              <p className="text-white text-base leading-relaxed mb-3">
                {t("philosophy.video_desktop_p1")}
              </p>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {t("philosophy.video_desktop_p2")}
              </p>
              <a href="#inscriptions" className="inline-flex items-center gap-2 bg-[#C4956A] text-black text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#d4a57a] transition-colors ml-auto">
                {t("philosophy.video_cta")}
              </a>
            </div>
          </div>

          {/* Mobile only - single compact block at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
            <p className="text-[#C4956A]/60 text-[10px] tracking-[0.2em] uppercase mb-1">{t("philosophy.video_label")}</p>
            <h3 className="text-white text-lg font-semibold tracking-tight leading-tight mb-2">
              {t("philosophy.video_title1")} <span className="text-[#C4956A]">{t("philosophy.video_title2")}</span>
            </h3>
            <p className="text-white/70 text-xs leading-relaxed mb-3">
              {t("philosophy.video_mobile_desc")}
            </p>
            <a href="#inscriptions" className="inline-flex items-center gap-2 bg-[#C4956A] text-black text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#d4a57a] transition-colors">
              {t("philosophy.video_cta")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
