"use client";

import { motion } from "framer-motion";
import { useLandingLang } from "@/components/landing/landing-i18n";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
};

const roles = [
  { key: "about.role_hote", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { key: "about.role_agence", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { key: "about.role_agent", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  { key: "about.role_investisseur", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { key: "about.role_formateur", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  { key: "about.role_apporteur", bg: "bg-[#C4956A]/10", text: "text-[#C4956A]", border: "border-[#C4956A]/20" },
  { key: "about.role_photographe", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  { key: "about.role_courtier", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  { key: "about.role_notaire", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  { key: "about.role_architecte", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  { key: "about.role_promoteur", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  { key: "about.role_client", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
];

export function AboutSection() {
  const { t } = useLandingLang();

  return (
    <section className="relative bg-[#FAFAF8] py-24 md:py-40 px-6 overflow-hidden">
      {/* Decorative architectural SVG - minimal house outline */}
      <svg
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[280px] md:w-[420px] opacity-[0.05] pointer-events-none"
        viewBox="0 0 200 220"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <polyline points="20,120 100,40 180,120" />
        <rect x="40" y="120" width="120" height="80" />
        <rect x="70" y="140" width="25" height="30" />
        <rect x="110" y="140" width="25" height="30" />
        <rect x="85" y="165" width="30" height="35" />
        <line x1="100" y1="40" x2="100" y2="20" />
        <polyline points="60,80 60,50 80,50" />
      </svg>

      <div className="relative max-w-6xl mx-auto">
        {/* Label */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="text-[#C4956A] text-xs md:text-sm font-medium tracking-widest uppercase mb-8"
        >
          {t("about.label")}
        </motion.p>

        {/* Heading */}
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl text-gray-900 leading-[1.1] tracking-tight mb-14 md:mb-20"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          {t("about.title1")}{" "}
          <span className="italic text-[#C4956A]">{t("about.title2")}</span>
        </motion.h2>

        {/* Two-column paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-base md:text-lg leading-relaxed"
          >
            {t("about.p1")}
          </motion.p>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-600 text-base md:text-lg leading-relaxed"
          >
            {t("about.p2")}
          </motion.p>
        </div>

        {/* Role tags */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
            {t("about.roles_label")}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {roles.map((role) => (
              <span
                key={role.key}
                className={`text-xs font-medium px-4 py-2 rounded-full border ${role.bg} ${role.text} ${role.border} transition-shadow hover:shadow-sm cursor-default`}
              >
                {t(role.key)}
              </span>
            ))}
            <span className="text-xs font-medium px-4 py-2 rounded-full border border-gray-200 text-gray-400 bg-gray-50">
              {t("about.more")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
