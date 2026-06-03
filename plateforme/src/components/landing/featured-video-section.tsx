"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function FeaturedVideoSection() {
  const { t } = useLandingLang();

  return (
    <section className="bg-[#FAFAF8] py-20 md:py-32 px-6 overflow-hidden relative">
      {/* Architectural SVG decoration */}
      <svg
        className="absolute top-12 right-12 opacity-[0.04] pointer-events-none hidden md:block"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
      >
        <rect x="10" y="10" width="100" height="100" stroke="#1e9df1" strokeWidth="1" />
        <rect x="30" y="30" width="60" height="60" stroke="#1e9df1" strokeWidth="1" />
        <line x1="10" y1="10" x2="30" y2="30" stroke="#1e9df1" strokeWidth="1" />
        <line x1="110" y1="10" x2="90" y2="30" stroke="#1e9df1" strokeWidth="1" />
        <line x1="10" y1="110" x2="30" y2="90" stroke="#1e9df1" strokeWidth="1" />
        <line x1="110" y1="110" x2="90" y2="90" stroke="#1e9df1" strokeWidth="1" />
      </svg>

      <div className="max-w-[600px] mx-auto">
        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="aspect-video relative">
            <video
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              src="/videos/plateforme-bg.mp4"
            />
          </div>
        </motion.div>

        {/* Text block below video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 md:mt-14 max-w-[600px] mx-auto text-center"
        >
          <p
            className="text-[#1e9df1] text-xs tracking-widest uppercase mb-4 font-medium"
            style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
          >
            {t("featured.label")}
          </p>

          <p className="text-[#1a1a1a]/60 text-sm md:text-base leading-relaxed mb-4">
            {t("featured.desc")}
          </p>

          <p className="text-[#1a1a1a]/50 text-xs leading-relaxed mb-8">
            {t("featured.disclaimer")}
          </p>

          <Link href="#inscriptions">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 bg-[#1e9df1] text-[#1a1a1a] text-sm font-bold px-7 py-3.5 rounded-xl hover:bg-[#1e9df1] transition-colors cursor-pointer shadow-md shadow-[#1e9df1]/20"
            >
              {t("featured.cta")}
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
