"use client";

import { motion } from "framer-motion";

export default function FooterSection() {
  return (
    <footer className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffe0c2]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto py-16 px-6 md:px-12">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Brand */}
          <motion.div
            className="inline-flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#ffe0c2] to-[#ffdfb5] flex items-center justify-center">
              <span className="text-[#111111] font-bold text-base leading-none select-none">
                E
              </span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Projet E-Dome
            </span>
          </motion.div>

          {/* Tagline */}
          <p className="text-white/40 text-sm">
            &Eacute;cosyst&egrave;me Immobilier Intelligent
          </p>
        </div>

        {/* Divider + Copyright */}
        <div className="relative mt-12 pt-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-white/30 text-sm text-center">
            &copy; 2024–2025 E-Dome — Tous droits r&eacute;serv&eacute;s
          </p>
        </div>
      </div>
    </footer>
  );
}
