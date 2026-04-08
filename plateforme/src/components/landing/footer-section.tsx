"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { VillaLuxuryDrawing } from "@/components/landing/drawings/villa-luxury";
import { ChaletAlpineDrawing } from "@/components/landing/drawings/chalet-alpine";

const demoLinks = [
  { label: "Feed social", href: "/feed" },
  { label: "Marketplace", href: "/explorer" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Formations", href: "/formations" },
  { label: "Live & Replays", href: "/live" },
  { label: "Messages", href: "/messages" },
];

const platformLinks = [
  { label: "Apporteurs", href: "/apporteurs" },
  { label: "Réservations", href: "/reservations" },
  { label: "Statistiques", href: "/statistiques" },
  { label: "Événements", href: "/evenements" },
  { label: "Services", href: "/services" },
  { label: "Investisseurs", href: "/investisseurs" },
];

export function FooterSection() {
  return (
    <footer className="bg-black border-t border-[#C4956A]/8 pt-16 pb-8 px-6 relative overflow-hidden">
      {/* Architectural drawings background */}
      <div className="hidden md:block absolute left-[-15%] top-[-10%] w-[70%] md:w-[50%] text-white/[0.04] pointer-events-none">
        <VillaLuxuryDrawing />
      </div>
      <div className="hidden md:block absolute right-[-10%] bottom-[-15%] w-[60%] md:w-[40%] text-white/[0.04] pointer-events-none">
        <ChaletAlpineDrawing />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={22} className="text-[#C4956A]" />
              <span className="text-white font-semibold text-lg">E-Dome</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-4">
              L&apos;écosystème immobilier international.
              De la Suisse au monde entier.
            </p>
            <p className="text-white/20 text-xs">contact@edome.world</p>
          </div>

          <div>
            <p className="text-[#C4956A]/40 text-xs tracking-widest uppercase mb-4">Explorer la démo</p>
            <ul className="space-y-2.5">
              {demoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#C4956A]/40 text-xs tracking-widest uppercase mb-4">Plateforme</p>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#C4956A]/40 text-xs tracking-widest uppercase mb-4">À propos</p>
            <ul className="space-y-2.5">
              <li><a href="#vision" className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">Notre vision</a></li>
              <li><a href="#fonctionnalites" className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">Fonctionnalités</a></li>
              <li><a href="#fondateurs" className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">Fondateurs</a></li>
              <li><a href="#roadmap" className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">Roadmap</a></li>
              <li><Link href="/conditions" className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">Conditions</Link></li>
              <li><Link href="/confidentialite" className="text-white/30 text-sm hover:text-[#C4956A]/70 transition-colors py-1.5 inline-block">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-white/15 text-xs">© 2026 E-Dome — Maquette de visualisation. Toutes les données sont fictives et servent à illustrer les fonctionnalités.</p>
          <Link href="/acces" className="liquid-glass rounded-full px-5 py-2 text-white/40 text-xs hover:text-[#C4956A]/70 hover:bg-white/5 transition-all border border-[#C4956A]/8">
            Accéder à la démo
          </Link>
        </div>
      </div>
    </footer>
  );
}
