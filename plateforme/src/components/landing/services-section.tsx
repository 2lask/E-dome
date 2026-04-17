"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Home, Users, GraduationCap, Handshake, Radio, Briefcase } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function ServicesSection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      tag: t("services.f1_tag"),
      title: t("services.f1_title"),
      description: t("services.f1_desc"),
      icon: Users,
      media: { type: "video" as const, src: "/videos/social-feed.mp4", poster: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=70" },
    },
    {
      tag: t("services.f2_tag"),
      title: t("services.f2_title"),
      description: t("services.f2_desc"),
      icon: Home,
      media: { type: "video" as const, src: "/videos/marketplace.mp4", startTime: 5, poster: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70" },
    },
    {
      tag: t("services.f3_tag"),
      title: t("services.f3_title"),
      description: t("services.f3_desc"),
      icon: GraduationCap,
      media: { type: "video" as const, src: "/videos/formation.mp4", poster: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70" },
    },
    {
      tag: t("services.f4_tag"),
      title: t("services.f4_title"),
      description: t("services.f4_desc"),
      icon: Handshake,
      media: { type: "video" as const, src: "/videos/commissions.mp4", poster: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=70" },
    },
    {
      tag: t("services.f5_tag"),
      title: t("services.f5_title"),
      description: t("services.f5_desc"),
      icon: Radio,
      media: { type: "video" as const, src: "/videos/live-events.mp4", poster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=70" },
    },
    {
      tag: t("services.f6_tag"),
      title: t("services.f6_title"),
      description: t("services.f6_desc"),
      icon: Briefcase,
      media: { type: "video" as const, src: "/videos/services.mp4", startTime: 5, poster: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70" },
    },
  ];

  return (
    <section ref={ref} className="bg-white py-28 md:py-40 px-6 overflow-hidden relative">
      {/* Decorative architectural window/floor plan corner */}
      <svg
        className="absolute left-6 bottom-24 w-32 md:w-44 opacity-[0.04] text-[#C4956A]/20 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Window outline with mullions */}
        <rect x="10" y="10" width="80" height="80" rx="2" />
        <rect x="15" y="15" width="70" height="70" rx="1" />
        <line x1="50" y1="15" x2="50" y2="85" />
        <line x1="15" y1="50" x2="85" y2="50" />
        {/* Arched top detail */}
        <path d="M15 40 Q50 8 85 40" />
        {/* Corner brackets */}
        <line x1="5" y1="5" x2="5" y2="25" />
        <line x1="5" y1="5" x2="25" y2="5" />
        <line x1="95" y1="5" x2="95" y2="25" />
        <line x1="95" y1="5" x2="75" y2="5" />
        <line x1="5" y1="95" x2="5" y2="75" />
        <line x1="5" y1="95" x2="25" y2="95" />
        <line x1="95" y1="95" x2="95" y2="75" />
        <line x1="95" y1="95" x2="75" y2="95" />
      </svg>

      <div className="max-w-6xl mx-auto relative">
        <div className="flex items-start md:items-center justify-between mb-12 md:mb-16 flex-col md:flex-row gap-4">
          <div>
            <BlurFade delay={0.1} inView>
              <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-3">{t("services.label")}</p>
            </BlurFade>
            <h2 className="text-3xl md:text-5xl text-gray-900 tracking-tight">
              <VerticalCutReveal splitBy="words" staggerDuration={0.12} staggerFrom="first">
                {t("services.title1")} {t("services.title2")}
              </VerticalCutReveal>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.tag}
                initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden group border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="aspect-video overflow-hidden relative">
                  {feature.media.type === "video" ? (
                    <video
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      autoPlay muted loop playsInline preload="metadata"
                      src={feature.media.src}
                      data-start-time={feature.media.startTime || 0}
                      onLoadedMetadata={(e) => {
                        const st = feature.media.startTime;
                        if (st) e.currentTarget.currentTime = st;
                      }}
                    />
                  ) : (
                    <img
                      src={feature.media.src}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-full p-2 bg-[#C4956A]/10">
                        <Icon size={14} className="text-[#C4956A]" />
                      </div>
                      <p className="uppercase tracking-widest text-[#C4956A] text-xs md:text-[10px]">{feature.tag}</p>
                    </div>
                    <div className="rounded-full p-1.5 bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={14} className="text-[#C4956A]" />
                    </div>
                  </div>
                  <h3 className="text-gray-900 text-lg mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
