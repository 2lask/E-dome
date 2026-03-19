"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const without = [
  "Commissions de 14 à 25% sur chaque transaction",
  "Visibilité uniquement via publicité payante",
  "Relation client captée par les plateformes",
  "Outils fragmentés et déconnectés",
  "Bouche-à-oreille non traçable ni rémunéré",
  "Données dispersées, aucune vue d'ensemble",
];

const withEdome = [
  "Commissions nettement inférieures au marché",
  "Visibilité organique gratuite et illimitée",
  "Relation directe avec vos clients",
  "Écosystème unifié tout-en-un",
  "Apporteurs rémunérés automatiquement",
  "Analytics centralisés en temps réel",
];

export function ComparisonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 max-w-[1000px] mx-auto">
      {/* SANS E-DOME */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative p-10 md:p-12 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none bg-gradient-to-br from-[#0d0808] to-[#0a0606] border border-white/[0.06] md:border-r-0"
      >
        {/* Glow red subtle */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/[0.04] rounded-full blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
            <X className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Sans E-Dome</span>
          </div>

          <ul className="space-y-5">
            {without.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 text-red-400" />
                </span>
                <span className="text-white/55 leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* AVEC E-DOME */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        className="relative p-10 md:p-12 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none bg-gradient-to-br from-[#080d08] to-[#060a06] border border-white/[0.06] border-t-0 md:border-t md:border-l-0"
      >
        {/* Glow gold subtle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4956A]/[0.06] rounded-full blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-8">
            <Check className="w-3.5 h-3.5 text-[#C4956A]" />
            <span className="text-xs font-semibold text-[#C4956A] uppercase tracking-wider">Avec E-Dome</span>
          </div>

          <ul className="space-y-5">
            {withEdome.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-[#C4956A]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#C4956A]" />
                </span>
                <span className="text-white/70 leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
