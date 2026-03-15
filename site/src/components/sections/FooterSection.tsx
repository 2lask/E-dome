"use client";

import { motion } from "framer-motion";
import { Globe, Mail, MapPin } from "lucide-react";

const platformLinks = ["Marketplace", "Réseau Social", "Apporteurs", "Formations", "Services"];
const resourceLinks = ["FAQ", "Programme Fondateurs", "Conditions", "Confidentialité"];

export default function FooterSection() {
  return (
    <footer className="relative bg-[#0a0a0a]/85 overflow-hidden pb-20">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffe0c2]/30 to-transparent" />

      <motion.div
        className="max-w-7xl mx-auto py-16 px-6 md:px-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#ffe0c2] to-[#ffdfb5] flex items-center justify-center">
                <span className="text-[#111111] font-bold text-base leading-none select-none">E</span>
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">E-Dome</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              La plateforme immobili&egrave;re de nouvelle g&eacute;n&eacute;ration.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg border border-[#201e18] bg-[#111111] flex items-center justify-center text-white/40 hover:text-[#ffe0c2] hover:border-[#ffe0c2]/30 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-[#201e18] bg-[#111111] flex items-center justify-center text-white/40 hover:text-[#ffe0c2] hover:border-[#ffe0c2]/30 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Plateforme */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Plateforme</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 text-sm hover:text-[#ffe0c2] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Ressources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Ressources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 text-sm hover:text-[#ffe0c2] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ffe0c2]/60" />
                contact@e-dome.ch
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#ffe0c2]/60" />
                Suisse
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5">
              <span className="h-2 w-2 rounded-full bg-[#ffe0c2] animate-pulse" />
              <span className="text-[#ffe0c2] text-xs font-medium">Programme Fondateurs ouvert</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative mt-12 pt-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">&copy; 2024&ndash;2026 E-Dome. Tous droits r&eacute;serv&eacute;s.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/30 text-xs hover:text-white/50 transition-colors">Mentions l&eacute;gales</a>
              <a href="#" className="text-white/30 text-xs hover:text-white/50 transition-colors">Confidentialit&eacute;</a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
