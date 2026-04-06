"use client";

import Link from "next/link";
import { Globe } from "lucide-react";

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
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={22} className="text-white" />
              <span className="text-white font-semibold text-lg">E-Dome</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              L&apos;écosystème immobilier international. De la Suisse au monde entier.
            </p>
            <p className="text-white/30 text-xs">
              contact@edome.world
            </p>
          </div>

          {/* Explorer la démo */}
          <div>
            <p className="text-white/50 text-xs tracking-widest uppercase mb-4">
              Explorer la démo
            </p>
            <ul className="space-y-2.5">
              {demoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plateforme */}
          <div>
            <p className="text-white/50 text-xs tracking-widest uppercase mb-4">
              Plateforme
            </p>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div>
            <p className="text-white/50 text-xs tracking-widest uppercase mb-4">
              À propos
            </p>
            <ul className="space-y-2.5">
              <li><a href="#vision" className="text-white/40 text-sm hover:text-white transition-colors">Notre vision</a></li>
              <li><a href="#fonctionnalites" className="text-white/40 text-sm hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#fondateurs" className="text-white/40 text-sm hover:text-white transition-colors">Fondateurs</a></li>
              <li><a href="#roadmap" className="text-white/40 text-sm hover:text-white transition-colors">Roadmap</a></li>
              <li><Link href="/conditions" className="text-white/40 text-sm hover:text-white transition-colors">Conditions</Link></li>
              <li><Link href="/confidentialite" className="text-white/40 text-sm hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © 2026 E-Dome — Maquette de démonstration. Toutes les données sont fictives.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/feed"
              className="liquid-glass rounded-full px-5 py-2 text-white/60 text-xs hover:text-white hover:bg-white/5 transition-all"
            >
              Accéder à la démo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
