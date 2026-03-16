"use client";

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
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import { ReferralTrackingMockup } from "@/components/ui/platform-visuals";
import { ReferralLinksMockup } from "@/components/ui/referral-links-mockup";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";
import FeaturedCrmDemoSection from "@/components/ui/featured-crm-demo-section";
import {
  WaveTransition,
  DiagonalWipeTransition,
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
    <main className="bg-[#FAF8F5]">

      {/* ── 1. HERO ── */}
      <HeroSection />

      <SectionTransition variant="architectural-horizon" />

      {/* ── 2. LE CONSTAT ── */}
      <ScrollReveal>
        <ProblemSection />
      </ScrollReveal>

      <WaveTransition />

      {/* ── 3. LA SOLUTION ── */}
      <ScrollReveal>
        <SolutionSection />
      </ScrollReveal>

      {/* ── 4. BUILDING 3D ── */}
      <ScrollReveal>
        <div className="relative py-24">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-[#8B6F47]/[0.06] blur-[120px]" />
          </div>
          <Building3DScene className="mx-auto max-w-6xl relative z-10" />
        </div>
      </ScrollReveal>

      <DiagonalWipeTransition direction="left-to-right" />

      {/* ── 5. OUTILS + DASHBOARD ── */}
      <ScrollReveal>
        <FeaturedCrmDemoSection />
      </ScrollReveal>

      <ScrollReveal>
        <div className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] mb-8">
              Tableau de bord E-Dome
            </p>
            <DashboardMockup />
          </div>
        </div>
      </ScrollReveal>

      <SectionTransition variant="glass-divider" />

      {/* ── 6. PROFILS ── */}
      <ScrollReveal>
        <ProfilesSection />
      </ScrollReveal>

      <SectionTransition variant="dot-grid" />

      {/* ── 7. APPORTEURS ── */}
      <ScrollReveal>
        <section id="apporteurs" className="relative py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#8B6F47]/20 bg-[#8B6F47]/5 px-4 py-1.5 text-sm font-medium text-[#8B6F47]">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#8B6F47] animate-pulse" />
                Apporteurs d&apos;affaires
              </span>
              <h2 className="mt-6 text-3xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                Recommandez.{" "}
                <span className="bg-gradient-to-r from-[#8B6F47] to-[#C4956A] bg-clip-text text-transparent">
                  Gagnez.
                </span>
              </h2>
              <p className="mt-6 text-[#555555] max-w-xl text-base md:text-lg leading-relaxed">
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B6F47]/15 to-[#C4956A]/10 border border-[#8B6F47]/25 flex items-center justify-center text-[#8B6F47] font-bold text-sm shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-[#1A1A1A] font-semibold text-sm">{item.title}</h3>
                      <p className="text-[#888888] text-xs mt-0.5">{item.desc}</p>
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
                  <div key={card.title} className="rounded-xl border border-[#8B6F47]/12 bg-white p-5 hover:border-[#8B6F47]/30 transition-colors duration-300 flex items-start gap-4 shadow-sm">
                    <div className="rounded-lg bg-[#8B6F47]/10 p-2.5 shrink-0">
                      <Icon className="h-5 w-5 text-[#8B6F47]" />
                    </div>
                    <div>
                      <p className="text-[#1A1A1A] font-medium text-sm">{card.title}</p>
                      <p className="text-[#888888] text-xs mt-1">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <DiagonalWipeTransition direction="right-to-left" />

      {/* ── 8. MARCH\u00c9 ── */}
      <ScrollReveal>
        <MarketSection />
      </ScrollReveal>

      <SectionTransition variant="architectural-horizon" />

      {/* ── 9. PROGRAMME FONDATEURS ── */}
      <ScrollReveal>
        <QualificationSection />
      </ScrollReveal>

      {/* ── 10. FAQ ── */}
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      {/* ── FOOTER ── */}
      <FooterSection />

      {/* ── STICKY CTA BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#8B6F47] to-[#C4956A] py-4 px-6 flex items-center justify-center gap-4 shadow-[0_-8px_32px_rgba(139,111,71,0.3)]">
        <span className="text-white text-sm md:text-base font-semibold hidden sm:inline">
          Rejoignez les 100 premiers fondateurs
        </span>
        <a
          href="#qualification"
          className="animate-cta-pulse inline-flex items-center px-8 py-3 bg-white text-[#8B6F47] text-sm md:text-base font-bold rounded-full hover:bg-[#FAF8F5] transition-colors"
        >
          Manifester mon int&eacute;r&ecirc;t &rarr;
        </a>
      </div>
    </main>
  );
}
