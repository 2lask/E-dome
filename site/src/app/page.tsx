"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Home as HomeIcon, Users, Handshake } from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";
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
import {
  VillaElevationScene,
  CityBlockPlanScene,
} from "@/components/ui/large-architectural-scenes";
import { CityPanorama } from "@/components/ui/architectural-separators";
import { ReferralTrackingMockup } from "@/components/ui/platform-visuals";
import { ReferralLinksMockup } from "@/components/ui/referral-links-mockup";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";
import DispersingBuilding from "@/components/ui/dispersing-building";

import { GlareCard } from "@/components/ui/glare-card";
import { PulseBeams } from "@/components/ui/pulse-beams";
import FeaturedCrmDemoSection from "@/components/ui/featured-crm-demo-section";
import {
  CitySkylinesIllustration,
} from "@/components/ui/architectural-illustrations";
import {
  WaveTransition,
  DiagonalWipeTransition,
  ParticleFieldTransition,
  ArchitecturalBlueprintTransition,
} from "@/components/ui/dramatic-transitions";

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

const pulseBeamsData = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["0%", "0%", "200%"], x2: ["0%", "0%", "180%"], y1: ["80%", "0%", "0%"], y2: ["100%", "20%", "20%"] },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" as const, ease: "linear", repeatDelay: 2, delay: 0.5 },
    },
    connectionPoints: [{ cx: 6.5, cy: 398.5, r: 6 }, { cx: 269, cy: 220.5, r: 6 }],
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["20%", "100%", "100%"], x2: ["0%", "90%", "90%"], y1: ["80%", "80%", "-20%"], y2: ["100%", "100%", "0%"] },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" as const, ease: "linear", repeatDelay: 2, delay: 1 },
    },
    connectionPoints: [{ cx: 851, cy: 34, r: 6.5 }, { cx: 568, cy: 200, r: 6 }],
  },
  {
    path: "M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["20%", "100%", "100%"], x2: ["0%", "90%", "90%"], y1: ["80%", "80%", "-20%"], y2: ["100%", "100%", "0%"] },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" as const, ease: "linear", repeatDelay: 2, delay: 1.5 },
    },
    connectionPoints: [{ cx: 142, cy: 427, r: 6.5 }, { cx: 425.5, cy: 274, r: 6 }],
  },
];

export default function Home() {
  return (
    <main className="bg-[#111111]">
      {/* ================================================================
       * 1. SHADER HERO (WebGL animated background)
       * ================================================================*/}
      <AnimatedShaderHero
        badge="La Plateforme Immobili\u00e8re Nouvelle G\u00e9n\u00e9ration"
        headline={{
          line1: "L\u2019\u00e9cosyst\u00e8me qui connecte",
          line2: "l\u2019immobilier mondial.",
        }}
        subtitle="R\u00e9seau social \u00b7 Marketplace \u00b7 Apporteurs d\u2019affaires \u00b7 Formations \u00b7 Services \u2014 enfin r\u00e9unis dans un seul \u00e9cosyst\u00e8me global."
        primaryCta={{ text: "Rejoindre les Membres Fondateurs", href: "#qualification" }}
        secondaryCta={{ text: "D\u00e9couvrir le projet", href: "#problem" }}
      />

      {/* ================================================================
       * 1b. HERO SECTION (content details)
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

      {/* ── wave transition ── */}
      <WaveTransition />

      {/* ================================================================
       * 3. LA SOLUTION
       * ================================================================*/}
      <ScrollReveal>
        <SolutionSection />
      </ScrollReveal>

      {/* ── 3D Building ── */}
      <ScrollReveal>
        <div className="relative py-12">
          <Building3DScene className="mx-auto max-w-5xl" />
        </div>
      </ScrollReveal>

      {/* ── diagonal transition ── */}
      <DiagonalWipeTransition direction="left-to-right" />

      {/* ── CRM Demo Section (composant featured) ── */}
      <ScrollReveal>
        <div className="py-24 px-6 md:px-12">
          <FeaturedCrmDemoSection />
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

      {/* ── Glare Cards — visuels interactifs ── */}
      <ScrollReveal>
        <div className="py-24 px-6 md:px-12">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
            <GlareCard className="flex flex-col items-center justify-center p-8">
              <p className="text-2xl font-bold text-white mb-2">Marketplace</p>
              <p className="text-sm text-white/50 text-center">Achetez, vendez et louez en toute confiance</p>
            </GlareCard>
            <GlareCard className="flex flex-col items-center justify-center p-8">
              <p className="text-2xl font-bold text-white mb-2">R&eacute;seau Social</p>
              <p className="text-sm text-white/50 text-center">Connectez-vous avec tous les acteurs</p>
            </GlareCard>
            <GlareCard className="flex flex-col items-center justify-center p-8">
              <p className="text-2xl font-bold text-white mb-2">Formations</p>
              <p className="text-sm text-white/50 text-center">Montez en comp&eacute;tences avec les experts</p>
            </GlareCard>
          </div>
        </div>
      </ScrollReveal>

      {/* ── architectural scene ── */}
      <ScaleReveal>
        <CityBlockPlanScene className="py-10" />
      </ScaleReveal>

      {/* ── transition ── */}
      <SectionTransition variant="glass-divider" />

      {/* ================================================================
       * 5. VALIDATION MARCH&Eacute;
       * ================================================================*/}
      <ScrollReveal>
        <MarketSection />
      </ScrollReveal>

      {/* ── Dashboard mockup ── */}
      <ScrollReveal>
        <div className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/30 mb-8">
              Aper&ccedil;u du tableau de bord E-Dome
            </p>
            <DashboardMockup />
          </div>
        </div>
      </ScrollReveal>

      {/* ── dispersing building ── */}
      <DispersingBuilding className="w-full py-16" />

      {/* ── transition ── */}
      <SectionTransition variant="dot-grid" />

      {/* ================================================================
       * 6. APPORTEURS
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

            {/* Right — referral mockups + liens + cards */}
            <div className="grid grid-cols-1 gap-6">
              <ReferralTrackingMockup />
              <ReferralLinksMockup />
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

      {/* ── diagonal transition (reverse) ── */}
      <DiagonalWipeTransition direction="right-to-left" />

      {/* ── city skyline illustration ── */}
      <ScrollReveal>
        <CitySkylinesIllustration className="py-8 px-6 max-w-6xl mx-auto" />
      </ScrollReveal>

      {/* ── city panorama ── */}
      <ScrollReveal>
        <CityPanorama />
      </ScrollReveal>

      {/* ── Pulse Beams — connexion visuelle ── */}
      <PulseBeams
        beams={pulseBeamsData}
        gradientColors={{ start: "#ffe0c2", middle: "#ffdfb5", end: "#ffe0c2" }}
        className="!h-[500px] bg-[#111111]"
        baseColor="#201e18"
        accentColor="#ffe0c2"
      >
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Un &eacute;cosyst&egrave;me{" "}
            <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
              connect&eacute;.
            </span>
          </h3>
          <p className="text-white/50 max-w-md mx-auto">
            Chaque acteur est reli&eacute; aux autres. Chaque action cr&eacute;e de la valeur.
          </p>
        </div>
      </PulseBeams>

      {/* ── transition ── */}
      <SectionTransition variant="architectural-horizon" />

      {/* ================================================================
       * 7. PROGRAMME FONDATEURS
       * ================================================================*/}
      <ScrollReveal>
        <QualificationSection />
      </ScrollReveal>

      {/* ── particle field ── */}
      <ParticleFieldTransition count={40} />

      {/* ── transition ── */}
      <SectionTransition variant="perspective-lines" />

      {/* ================================================================
       * 8. FAQ
       * ================================================================*/}
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      {/* ── blueprint transition ── */}
      <ArchitecturalBlueprintTransition />

      {/* ================================================================
       * 9. FOOTER
       * ================================================================*/}
      <FooterSection />
    </main>
  );
}
