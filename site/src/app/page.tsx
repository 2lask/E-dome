"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Home as HomeIcon, Users, Handshake } from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import ProfilesSection from "@/components/sections/ProfilesSection";
import MarketSection from "@/components/sections/MarketSection";
import QualificationSection from "@/components/sections/QualificationSection";
import FAQSection from "@/components/sections/FAQSection";
import FooterSection from "@/components/sections/FooterSection";
import { ScrollReveal, ScaleReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import {
  VillaElevationScene,
  CityBlockPlanScene,
} from "@/components/ui/large-architectural-scenes";
import { CityPanorama } from "@/components/ui/architectural-separators";
import { ReferralTrackingMockup } from "@/components/ui/platform-visuals";
import DispersingBuilding from "@/components/ui/dispersing-building";
import { LampContainer } from "@/components/ui/lamp";

/* 3D building — lazy-loaded */
const Building3DScene = dynamic(
  () => import("@/components/ui/building-3d").then((m) => m.Building3DScene),
  { ssr: false, loading: () => <div className="h-[400px]" /> }
);

const apporteurCards = [
  { icon: HomeIcon, title: "Apporter un bien ou mandat", desc: "Partagez des opportunit\u00e9s immobili\u00e8res depuis votre r\u00e9seau" },
  { icon: Users, title: "Amener un client qualifi\u00e9", desc: "Recommandez des acheteurs, vendeurs ou locataires" },
  { icon: Handshake, title: "Proposer un partenariat local", desc: "Connectez des professionnels compl\u00e9mentaires" },
];

export default function Home() {
  return (
    <main className="bg-[#111111]">
      {/* ================================================================
       * 1. HERO
       * ================================================================*/}
      <HeroSection />

      {/* ── transition ── */}
      <SectionTransition variant="architectural-horizon" />

      {/* ================================================================
       * 2. LE CONSTAT
       * ================================================================*/}
      <ScrollReveal>
        <ProblemSection />
      </ScrollReveal>

      {/* ── architectural scene ── */}
      <ScaleReveal>
        <VillaElevationScene className="py-10" />
      </ScaleReveal>

      {/* ── transition ── */}
      <SectionTransition variant="fade-line" />

      {/* ================================================================
       * 3. LA SOLUTION
       * ================================================================*/}
      <ScrollReveal>
        <SolutionSection />
      </ScrollReveal>

      {/* ── 3D Building (prominent placement) ── */}
      <ScrollReveal>
        <div className="relative py-12">
          <Building3DScene className="mx-auto max-w-5xl" />
        </div>
      </ScrollReveal>

      {/* ── transition ── */}
      <SectionTransition variant="perspective-lines" />

      {/* ================================================================
       * 4. LES PROFILS
       * ================================================================*/}
      <ScrollReveal>
        <ProfilesSection />
      </ScrollReveal>

      {/* ── architectural scene ── */}
      <ScaleReveal>
        <CityBlockPlanScene className="py-10" />
      </ScaleReveal>

      {/* ── transition ── */}
      <SectionTransition variant="glass-divider" />

      {/* ================================================================
       * 5. VALIDATION MARCHÉ
       * ================================================================*/}
      <ScrollReveal>
        <MarketSection />
      </ScrollReveal>

      {/* ── dispersing building ── */}
      <DispersingBuilding className="w-full py-16" />

      {/* ── transition ── */}
      <SectionTransition variant="dot-grid" />

      {/* ================================================================
       * 6. APPORTEURS — split layout: texte gauche / cards droite
       * ================================================================*/}
      <ScrollReveal>
        <section id="apporteurs" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — texte */}
            <div>
              <span className="inline-flex items-center rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-4 py-1.5 text-sm font-medium text-[#ffe0c2]">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffe0c2] animate-pulse" />
                Syst&egrave;me d&apos;apporteurs
              </span>
              <h2 className="mt-6 text-3xl md:text-5xl font-bold text-white tracking-tight">
                Le bouche-&agrave;-oreille<br />
                <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
                  devient un revenu.
                </span>
              </h2>
              <p className="mt-6 text-white/60 max-w-xl text-base md:text-lg leading-relaxed">
                Chaque professionnel peut devenir apporteur d&apos;affaires sur E-Dome.
                En partageant un lien tra&ccedil;able, il g&eacute;n&egrave;re une commission automatique
                sur chaque transaction r&eacute;ussie &mdash; sans aucun co&ucirc;t suppl&eacute;mentaire pour
                l&apos;h&ocirc;te ou le client final.
              </p>

              {/* 3-step vertical timeline */}
              <div className="mt-12 space-y-6">
                {[
                  { step: "1", title: "Activez votre lien", desc: "Depuis votre tableau de bord" },
                  { step: "2", title: "Partagez \u00e0 votre r\u00e9seau", desc: "Biens, clients, services" },
                  { step: "3", title: "Recevez votre commission", desc: "Automatiquement \u00e0 chaque conversion" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffe0c2]/20 to-[#ffdfb5]/10 border border-[#ffe0c2]/30 flex items-center justify-center text-[#ffe0c2] font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — referral tracking mockup + cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Referral tracking visual */}
              <ReferralTrackingMockup />

              {/* Apporteur cards */}
              {apporteurCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-xl border border-[#201e18] bg-[#191919] p-6 hover:border-[#ffe0c2]/30 transition-colors flex items-start gap-4">
                    <div className="rounded-lg bg-[#ffe0c2]/10 p-2.5 flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#ffe0c2]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{card.title}</p>
                      <p className="text-white/40 text-xs mt-1">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── transition ── */}
      <SectionTransition variant="fade-line" />

      {/* ── city panorama ── */}
      <ScrollReveal>
        <CityPanorama />
      </ScrollReveal>

      {/* ── transition ── */}
      <SectionTransition variant="architectural-horizon" />

      {/* ── lamp glow above Qualification ── */}
      <LampContainer>
        <div />
      </LampContainer>

      {/* ================================================================
       * 7. PROGRAMME FONDATEURS
       * ================================================================*/}
      <ScrollReveal>
        <QualificationSection />
      </ScrollReveal>

      {/* ── transition ── */}
      <SectionTransition variant="perspective-lines" />

      {/* ================================================================
       * 8. FAQ
       * ================================================================*/}
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      {/* ── transition ── */}
      <SectionTransition variant="glass-divider" />

      {/* ================================================================
       * 9. FOOTER
       * ================================================================*/}
      <FooterSection />
    </main>
  );
}
