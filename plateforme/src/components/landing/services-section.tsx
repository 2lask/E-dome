"use client";

import { motion } from "framer-motion";
import { Users, Home, GraduationCap, Handshake, Radio, Briefcase } from "lucide-react";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function ServicesSection() {
  const { t } = useLandingLang();

  const features = [
    {
      tag: t("services.f1_tag"),
      title: t("services.f1_title"),
      description: t("services.f1_desc"),
      icon: Users,
      video: "/videos/social-feed.mp4",
      poster: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=70",
    },
    {
      tag: t("services.f2_tag"),
      title: t("services.f2_title"),
      description: t("services.f2_desc"),
      icon: Home,
      video: "/videos/marketplace.mp4",
      startTime: 5,
      poster: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70",
    },
    {
      tag: t("services.f3_tag"),
      title: t("services.f3_title"),
      description: t("services.f3_desc"),
      icon: GraduationCap,
      video: "/videos/formation.mp4",
      poster: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70",
    },
    {
      tag: t("services.f4_tag"),
      title: t("services.f4_title"),
      description: t("services.f4_desc"),
      icon: Handshake,
      video: "/videos/commissions.mp4",
      poster: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=70",
    },
    {
      tag: t("services.f5_tag"),
      title: t("services.f5_title"),
      description: t("services.f5_desc"),
      icon: Radio,
      video: "/videos/live-events.mp4",
      poster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=70",
    },
    {
      tag: t("services.f6_tag"),
      title: t("services.f6_title"),
      description: t("services.f6_desc"),
      icon: Briefcase,
      video: "/videos/services.mp4",
      startTime: 5,
      poster: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70",
    },
  ];

  return (
    <section className="bg-white py-24 md:py-36 px-6 overflow-hidden relative">
      {/* Architectural SVG decorations */}
      <svg
        className="absolute top-16 left-8 opacity-[0.04] pointer-events-none hidden lg:block"
        width="80"
        height="160"
        viewBox="0 0 80 160"
        fill="none"
      >
        <circle cx="40" cy="40" r="30" stroke="#C4956A" strokeWidth="1" />
        <circle cx="40" cy="40" r="15" stroke="#C4956A" strokeWidth="1" />
        <line x1="40" y1="70" x2="40" y2="160" stroke="#C4956A" strokeWidth="1" />
        <line x1="10" y1="40" x2="0" y2="40" stroke="#C4956A" strokeWidth="1" />
        <line x1="70" y1="40" x2="80" y2="40" stroke="#C4956A" strokeWidth="1" />
      </svg>
      <svg
        className="absolute bottom-20 right-10 opacity-[0.04] pointer-events-none hidden lg:block"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
      >
        <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" stroke="#C4956A" strokeWidth="1" fill="none" />
        <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" stroke="#C4956A" strokeWidth="1" fill="none" />
      </svg>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#C4956A] text-xs tracking-[0.2em] uppercase mb-4 font-medium">
              {t("services.label")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2
              className="text-3xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight"
              style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
            >
              {t("services.title1")}{" "}
              <span className="text-[#C4956A]">{t("services.title2")}</span>
            </h2>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.tag}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Video thumbnail */}
                <div className="aspect-video overflow-hidden relative">
                  <video
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    src={feature.video}
                    poster={feature.poster}
                    onLoadedMetadata={(e) => {
                      if (feature.startTime) {
                        e.currentTarget.currentTime = feature.startTime;
                      }
                    }}
                  />
                </div>

                {/* Card content */}
                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="rounded-full p-2 bg-[#C4956A]/10">
                      <Icon size={14} className="text-[#C4956A]" />
                    </div>
                    <p className="uppercase tracking-widest text-[#C4956A] text-[10px] font-medium">
                      {feature.tag}
                    </p>
                  </div>
                  <h3 className="text-gray-900 text-lg font-medium tracking-tight mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
