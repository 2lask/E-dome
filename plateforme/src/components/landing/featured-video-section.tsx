"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function FeaturedVideoSection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="max-w-6xl mx-auto"
      >
        {/* Video container */}
        <div className="rounded-3xl overflow-hidden aspect-video relative">
          <video
            className="w-full h-full object-cover"
            muted autoPlay loop playsInline preload="metadata"
            src="/videos/plateforme-bg.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Desktop overlay - text on video */}
          <div className="absolute bottom-0 left-0 right-0 p-10 hidden md:block">
            <div className="flex items-end justify-between gap-6">
              <div className="liquid-glass rounded-2xl p-8 max-w-lg" style={{ background: "rgba(0, 0, 0, 0.55)" }}>
                <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">{t("featured.label")}</p>
                <p className="text-white text-base leading-relaxed mb-2 font-light">
                  {t("featured.desc")}
                </p>
                <p className="text-white/50 text-xs mt-3">
                  {t("featured.disclaimer")}
                </p>
              </div>
              <Link href="#inscriptions">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="liquid-glass rounded-full px-8 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span className="text-[#C4956A]">{t("featured.cta")}</span>
                  <ArrowRight size={16} className="text-[#C4956A]" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile - text below video */}
        <div className="md:hidden mt-5">
          <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">{t("featured.label")}</p>
          <p className="text-white/80 text-sm leading-relaxed mb-3">
            {t("featured.mobile_desc")}
          </p>
          <p className="text-white/30 text-xs mb-4">
            {t("featured.mobile_disclaimer")}
          </p>
          <Link href="#inscriptions" className="inline-flex items-center gap-2 bg-[#C4956A] text-black text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#d4a57a] transition-colors">
            {t("featured.cta")} <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
