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
            <div className="flex flex-col gap-2 mt-4">
              <a href="mailto:contact@edome.world" className="inline-flex items-center gap-2 text-white/30 text-xs hover:text-white/60 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                contact@edome.world
              </a>
              <a href="https://wa.me/66910687928" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#25D366]/60 text-xs hover:text-[#25D366] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Léonard — +66 91 068 79 28
              </a>
              <a href="https://wa.me/41762832444" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#25D366]/60 text-xs hover:text-[#25D366] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Jean-Pierre — +41 76 283 24 44
              </a>
            </div>
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
          <Link href="#inscriptions" className="liquid-glass rounded-full px-5 py-2.5 text-white/40 text-xs hover:text-[#C4956A]/70 hover:bg-white/5 transition-all border border-[#C4956A]/8">
            Accéder à la démo
          </Link>
        </div>
      </div>
    </footer>
  );
}
