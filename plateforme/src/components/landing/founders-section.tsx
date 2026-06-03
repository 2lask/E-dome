"use client";

import { motion } from "framer-motion";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function FoundersSection() {
  const { t } = useLandingLang();

  return (
    <section className="bg-white py-20 md:py-32 px-6 overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative">

        {/* ── Founders side by side (desktop) / stacked (mobile) ── */}
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24 mb-20 md:mb-28">

          {/* ── Leonard ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center"
          >
            <div className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
              <img
                src="/images/founders/leonard.jpg"
                alt="Leonard Ansermet"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[#1262b3] text-xs tracking-widest uppercase mb-2 font-medium">
              {t("founders.label_leo")}
            </p>
            <h3 className="text-[#1a1a1a] text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Leonard Ansermet
            </h3>
            <p className="text-gray-700 text-base leading-relaxed mb-4 max-w-md mx-auto">
              {t("founders.leo_p1")}
            </p>
            <p className="text-[#6b7280] text-sm leading-relaxed mb-6 max-w-md mx-auto">
              {t("founders.leo_p2")}
            </p>
            <div className="flex items-center gap-4 justify-center">
              <a
                href="https://wa.me/66910687928"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#1262b3]/10 border border-[#1262b3]/20 text-[#1262b3] text-xs font-medium hover:bg-[#1262b3]/20 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href="mailto:contact@edome.world"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#f3f4f6] border border-gray-200 text-[#4b5563] text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                contact@edome.world
              </a>
            </div>
          </motion.div>

          {/* ── Jean-Pierre ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 text-center"
          >
            <div className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
              <img
                src="/images/founders/jeanpierre.jpg"
                alt="Jean-Pierre Medard Garza"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[#1262b3] text-xs tracking-widest uppercase mb-2 font-medium">
              {t("founders.label_jp")}
            </p>
            <h3 className="text-[#1a1a1a] text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Jean-Pierre Medard Garza
            </h3>
            <p className="text-gray-700 text-base leading-relaxed mb-4 max-w-md mx-auto">
              {t("founders.jp_p1")}
            </p>
            <p className="text-[#6b7280] text-sm leading-relaxed mb-6 max-w-md mx-auto">
              {t("founders.jp_p2")}
            </p>
            <div className="flex items-center gap-4 justify-center">
              <a
                href="https://wa.me/41762832444"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#1262b3]/10 border border-[#1262b3]/20 text-[#1262b3] text-xs font-medium hover:bg-[#1262b3]/20 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href="mailto:contact@edome.world"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#f3f4f6] border border-gray-200 text-[#4b5563] text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                contact@edome.world
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Central quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-20 md:mb-28 px-4"
        >
          <div className="w-16 h-1 bg-[#1262b3] mx-auto mb-8 rounded-full" />
          <p
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-[#1a1a1a] leading-[1.3] tracking-tight italic max-w-[600px] mx-auto"
          >
            {t("founders.quote")}
          </p>
          <div className="w-16 h-1 bg-[#1262b3] mx-auto mt-8 rounded-full" />
        </motion.div>

        {/* ── Conviction & Engagement cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Conviction */}
            <div className="rounded-2xl p-8 md:p-8 bg-[#FAFAF8] border border-gray-200">
              <p className="text-[#1262b3] text-xs tracking-widest uppercase mb-4 font-medium">
                {t("founders.conviction_label")}
              </p>
              <p
                className="text-[#1a1a1a] text-xl md:text-2xl leading-[1.3] mb-6 tracking-tight"
              >
                {t("founders.conviction_title")}
              </p>
              <p className="text-[#4b5563] text-sm leading-relaxed">
                {t("founders.conviction_desc")}
              </p>
            </div>

            {/* Engagement */}
            <div className="rounded-2xl p-8 md:p-8 bg-[#FAFAF8] border border-gray-200">
              <p className="text-[#6b7280] text-xs tracking-widest uppercase mb-4 font-medium">
                {t("founders.engagement_label")}
              </p>
              <p
                className="text-[#1a1a1a] text-xl md:text-2xl leading-[1.3] mb-6 tracking-tight"
              >
                {t("founders.engagement_title")}
              </p>
              <p className="text-[#4b5563] text-sm leading-relaxed">
                {t("founders.engagement_desc")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Architectural SVG decoration ── */}
        <svg
          className="absolute -bottom-8 right-0 w-32 h-32 text-gray-200 opacity-40"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="60" width="40" height="50" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="60" y="40" width="30" height="70" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="15" y="70" width="10" height="14" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="35" y="70" width="10" height="14" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="65" y="50" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
          <rect x="78" y="50" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
          <polygon points="10,60 30,42 50,60" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <polygon points="60,40 75,25 90,40" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </section>
  );
}
