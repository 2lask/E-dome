"use client";

import { motion } from "framer-motion";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function AboutSection() {
  const { t } = useLandingLang();

  return (
    <section className="bg-white pt-20 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden relative">
      {/* Subtle warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,149,106,0.06)_0%,_transparent_70%)]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-10 font-medium">
            {t("about.label")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2 className="text-3xl md:text-6xl lg:text-7xl text-gray-900 leading-[1.1] tracking-tight mb-10 md:mb-12">
            {t("about.title1")} {t("about.title2")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {t("about.p1")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {t("about.p2")}
            </p>
          </motion.div>
        </div>

        {/* Roles - visual strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-gray-400 text-sm mb-8">
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
