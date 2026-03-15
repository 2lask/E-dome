"use client";

import dynamic from "next/dynamic";
import { Home as HomeIcon, Users, Handshake } from "lucide-react";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import ProfilesSection from "@/components/sections/ProfilesSection";
import MarketSection from "@/components/sections/MarketSection";
import QualificationSection from "@/components/sections/QualificationSection";
import FAQSection from "@/components/sections/FAQSection";
import FooterSection from "@/components/sections/FooterSection";
import { ScrollReveal, ScaleReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import { VillaElevationScene } from "@/components/ui/large-architectural-scenes";
import { CityPanorama } from "@/components/ui/architectural-separators";
import { ReferralTrackingMockup } from "@/components/ui/platform-visuals";
import { ReferralLinksMockup } from "@/components/ui/referral-links-mockup";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";
import DispersingBuilding from "@/components/ui/dispersing-building";
import { GlareCard } from "@/components/ui/glare-card";
import FeaturedCrmDemoSection from "@/components/ui/featured-crm-demo-section";
import {
  WaveTransition,
  DiagonalWipeTransition,
  ArchitecturalBlueprintTransition,
} from "@/components/ui/dramatic-transitions";

const Building3DScene = dynamic(
  () => import("@/components/ui/building-3d").then((m) => m.Building3DScene),
  { ssr: false, loading: () => <div className="h-[400px]" /> }
);

const apporteurCards = [
  { icon: HomeIcon, title: "Apporter un bien", desc: "Partagez des opportunit\u00e9s depuis votre r\u00e9seau" },
  { icon: Users, title: "Amener un client", desc: "Recommandez acheteurs, vendeurs ou locataires" },
  { icon: Handshake, title: "Cr\u00e9er un partenariat", desc: "Connectez des professionnels compl\u00e9mentaires" },
];

export default function Home() {
  return (
    <main className="bg-[#111111]">
      {/* ── 1. HERO ── */}
      <AnimatedShaderHero
        badge="Plateforme Immobili\u00e8re Nouvelle G\u00e9n\u00e9ration"
        headline={{
          line1: "L\u2019\u00e9cosyst\u00e8me qui connecte",
          line2: "l\u2019immobilier mondial.",
        }}
        subtitle="Marketplace \u00b7 R\u00e9seau social \u00b7 Apporteurs d\u2019affaires \u00b7 Formations \u00b7 Services \u2014 r\u00e9unis pour la premi\u00e8re fois."
        primaryCta={{ text: "Devenir Membre Fondateur", href: "#qualification" }}
        secondaryCta={{ text: "D\u00e9couvrir le projet", href: "#problem" }}
      />

      <SectionTransition variant="architectural-horizon" />

      {/* ── 2. LE CONSTAT ── */}
      <ScrollReveal>
        <ProblemSection />
      </ScrollReveal>

      <ScaleReveal>
        <VillaElevationScene className="py-10" />
      </ScaleReveal>

      <WaveTransition />

      {/* ── 3. LA SOLUTION ── */}
      <ScrollReveal>
        <SolutionSection />
      </ScrollReveal>

      <ScrollReveal>
        <div className="relative py-24">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-[#ffe0c2]/[0.04] blur-[120px]" />
          </div>
          <Building3DScene className="mx-auto max-w-6xl relative z-10" />
        </div>
      </ScrollReveal>

      <DiagonalWipeTransition direction="left-to-right" />

      {/* ── 4. OUTILS ── */}
      <ScrollReveal>
        <div className="py-24 px-6 md:px-12">
          <FeaturedCrmDemoSection />
        </div>
      </ScrollReveal>

      <SectionTransition variant="perspective-lines" />

      {/* ── 5. PROFILS ── */}
      <ScrollReveal>
        <ProfilesSection />
      </ScrollReveal>

      {/* ── 6. GLARE CARDS ── */}
      <ScrollReveal>
        <div className="py-24 px-6 md:px-12">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/30 mb-10">
            Ce qui nous rend unique
          </p>
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
            <GlareCard className="flex flex-col items-start justify-end p-8">
              <p className="text-4xl font-bold text-white mb-1">5</p>
              <p className="text-sm font-semibold text-white/80 mb-2">march&eacute;s unifi&eacute;s</p>
              <p className="text-xs text-white/40">Aucun concurrent ne combine ces 5 verticales.</p>
            </GlareCard>
            <GlareCard className="flex flex-col items-start justify-end p-8">
              <p className="text-4xl font-bold text-white mb-1">0 CHF</p>
              <p className="text-sm font-semibold text-white/80 mb-2">de publicit&eacute;</p>
              <p className="text-xs text-white/40">Visibilit&eacute; organique via le r&eacute;seau social int&eacute;gr&eacute;.</p>
            </GlareCard>
            <GlareCard className="flex flex-col items-start justify-end p-8">
              <p className="text-4xl font-bold text-white mb-1">100</p>
              <p className="text-sm font-semibold text-white/80 mb-2">fondateurs</p>
              <p className="text-xs text-white/40">Places limit&eacute;es. Conditions exclusives &agrave; vie.</p>
            </GlareCard>
          </div>
        </div>
      </ScrollReveal>

      <SectionTransition variant="glass-divider" />

      {/* ── 7. MARCH\u00c9 ── */}
      <ScrollReveal>
        <MarketSection />
      </ScrollReveal>

      <ScrollReveal>
        <div className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/30 mb-8">
              Tableau de bord E-Dome
            </p>
            <DashboardMockup />
          </div>
        </div>
      </ScrollReveal>

      <DispersingBuilding className="w-full py-24" />
      <SectionTransition variant="dot-grid" />

      {/* ── 8. APPORTEURS ── */}
      <ScrollReveal>
        <section id="apporteurs" className="relative py-32 px-6 md:px-12 arch-bg-grid">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-4 py-1.5 text-sm font-medium text-[#ffe0c2]">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffe0c2] animate-pulse" />
                Apporteurs d&apos;affaires
              </span>
              <h2 className="mt-6 text-3xl md:text-5xl font-bold text-white tracking-tight">
                Recommandez.{" "}
                <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
                  Gagnez.
                </span>
              </h2>
              <p className="mt-6 text-white/60 max-w-xl text-base md:text-lg leading-relaxed">
                Partagez un lien tra&ccedil;able. Chaque transaction g&eacute;n&eacute;r&eacute;e
                vous rapporte une commission automatique &mdash; sans frais pour le client.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  { step: "1", title: "Activez votre lien", desc: "Depuis votre tableau de bord" },
                  { step: "2", title: "Partagez", desc: "Biens, clients ou services" },
                  { step: "3", title: "Encaissez", desc: "Commission automatique \u00e0 chaque conversion" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffe0c2]/20 to-[#ffdfb5]/10 border border-[#ffe0c2]/30 flex items-center justify-center text-[#ffe0c2] font-bold text-sm shrink-0">
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

            <div className="space-y-4">
              <ReferralTrackingMockup />
              <ReferralLinksMockup />
              {apporteurCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-xl border border-[#201e18] bg-[#191919] p-5 hover:border-[#ffe0c2]/30 transition-colors flex items-start gap-4">
                    <div className="rounded-lg bg-[#ffe0c2]/10 p-2.5 shrink-0">
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

      <DiagonalWipeTransition direction="right-to-left" />

      <ScrollReveal>
        <CityPanorama />
      </ScrollReveal>

      <SectionTransition variant="architectural-horizon" />

      {/* ── 9. PROGRAMME FONDATEURS ── */}
      <ScrollReveal>
        <QualificationSection />
      </ScrollReveal>

      <SectionTransition variant="perspective-lines" />

      {/* ── 10. FAQ ── */}
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      <ArchitecturalBlueprintTransition />

      {/* ── FOOTER ── */}
      <FooterSection />

      {/* ── STICKY CTA BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] py-4 px-6 flex items-center justify-center gap-4 shadow-[0_-8px_32px_rgba(255,224,194,0.3)]">
        <span className="text-[#111111] text-sm md:text-base font-semibold hidden sm:inline">
          Rejoignez les 100 premiers fondateurs
        </span>
        <a
          href="#qualification"
          className="animate-cta-pulse inline-flex items-center px-8 py-3 bg-[#111111] text-[#ffe0c2] text-sm md:text-base font-bold rounded-full hover:bg-[#191919] transition-colors"
        >
          Manifester mon int&eacute;r&ecirc;t &rarr;
        </a>
      </div>
    </main>
  );
}
