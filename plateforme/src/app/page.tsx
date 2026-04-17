"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AboutSection } from "@/components/landing/about-section";
import { FeaturedVideoSection } from "@/components/landing/featured-video-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { ServicesSection } from "@/components/landing/services-section";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { FoundersSection } from "@/components/landing/founders-section";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { FooterSection } from "@/components/landing/footer-section";
import { LandingLanguageProvider, useLandingLang } from "@/components/landing/landing-i18n";

export default function HomePage() {
  return (
    <LandingLanguageProvider>
      <HomePageContent />
    </LandingLanguageProvider>
  );
}

/* ───────────────────────── Gold Dot Divider ───────────────────────── */

function DotDivider() {
  return (
    <div className="flex items-center gap-4 max-w-xs mx-auto py-12">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C4956A]/15" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C4956A]/15" />
    </div>
  );
}

/* ───────────────────────── Fade-in wrapper ───────────────────────── */

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN CONTENT                                                      */
/* ═══════════════════════════════════════════════════════════════════ */

function HomePageContent() {
  const { lang, setLang, t } = useLandingLang();

  const perks = [
    lang === "th" ? "แบดจ์ผู้ก่อตั้ง" : lang === "en" ? "Founder badge" : "Badge fondateur",
    lang === "th" ? "เข้าถึงก่อนใคร" : lang === "en" ? "Early access" : "Accès anticipé",
    lang === "th" ? "การมองเห็นสำคัญ" : lang === "en" ? "Priority visibility" : "Visibilité prioritaire",
    lang === "th" ? "สิทธิพิเศษ" : lang === "en" ? "Exclusive perks" : "Avantages exclusifs",
  ];

  return (
    <div
      className="bg-[#FAFAF8] text-gray-900 antialiased"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-gray-900 font-semibold text-2xl tracking-tight">
            E-<span className="text-[#C4956A]">Dome</span>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#vision"
              className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors"
            >
              {t("nav.vision")}
            </a>
            <a
              href="#fonctionnalites"
              className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors"
            >
              {t("nav.features")}
            </a>
            <a
              href="#fondateurs"
              className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors"
            >
              {t("nav.founders")}
            </a>
            <a
              href="#roadmap"
              className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors"
            >
              {t("nav.roadmap")}
            </a>
          </div>

          {/* Right side: lang + CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 overflow-hidden">
              {(["fr", "en", "th"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs font-medium px-2.5 py-1.5 transition-colors uppercase ${
                    lang === l
                      ? "bg-[#C4956A] text-white"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="#inscriptions"
              className="hidden sm:inline-flex bg-[#C4956A] text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#b8856a] transition-colors"
            >
              {t("hero.demo")}
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden bg-gradient-to-b from-white via-[#FAFAF8] to-[#F5F3EF]">
        {/* Decorative architectural SVG */}
        <svg
          viewBox="0 0 400 300"
          fill="none"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-96 opacity-[0.06] text-[#C4956A] pointer-events-none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <rect x="50" y="100" width="120" height="150" />
          <rect x="190" y="130" width="160" height="120" />
          <line x1="30" y1="100" x2="190" y2="100" />
          <path d="M30 100 L110 40 L190 100" />
          <rect x="80" y="130" width="30" height="40" />
          <rect x="120" y="130" width="30" height="40" />
          <rect x="220" y="160" width="40" height="30" />
          <rect x="280" y="160" width="40" height="30" />
          <rect x="250" y="210" width="30" height="40" />
          <line x1="50" y1="250" x2="350" y2="250" />
        </svg>

        {/* Mirror SVG on left, even more subtle */}
        <svg
          viewBox="0 0 400 300"
          fill="none"
          className="absolute left-0 bottom-16 w-48 md:w-72 opacity-[0.03] text-[#C4956A] pointer-events-none rotate-6"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <rect x="80" y="80" width="100" height="120" />
          <path d="M60 80 L130 30 L200 80" />
          <rect x="100" y="110" width="25" height="35" />
          <rect x="140" y="110" width="25" height="35" />
          <line x1="60" y1="200" x2="300" y2="200" />
          <rect x="220" y="100" width="80" height="100" />
          <rect x="240" y="120" width="20" height="25" />
          <rect x="270" y="120" width="20" height="25" />
        </svg>

        <div className="max-w-4xl text-center relative z-10">
          <FadeIn>
            <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold">
              {t("hero.label")}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-gray-900 leading-[1.05] mb-6"
              style={{
                letterSpacing: "-0.04em",
                fontFamily: "'Instrument Serif', serif",
              }}
            >
              {t("hero.title1")}
              <br />
              <span className="text-[#C4956A]">{t("hero.title2")}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-gray-500 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              {t("hero.subtitle")}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-10">
              {perks.map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-emerald-600 text-xs">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-500">{p}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#inscriptions"
                className="bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all flex items-center gap-2 shadow-lg shadow-[#C4956A]/20"
              >
                {t("hero.cta")} <ArrowRight size={16} />
              </Link>
              <a
                href="#vision"
                className="rounded-xl px-8 py-3.5 text-gray-600 text-sm font-medium border border-gray-200 hover:border-[#C4956A]/40 hover:text-[#C4956A] transition-all bg-white"
              >
                {t("hero.learn")}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <DotDivider />

      {/* ═══ ABOUT / VISION ═══ */}
      <div id="vision">
        <AboutSection />
      </div>

      <DotDivider />

      {/* ═══ FEATURED VIDEO ═══ */}
      <FeaturedVideoSection />

      <DotDivider />

      {/* ═══ PROBLEM ═══ */}
      <div id="probleme">
        <ProblemSection />
      </div>

      <DotDivider />

      {/* ═══ SERVICES ═══ */}
      <div id="fonctionnalites">
        <ServicesSection />
      </div>

      <DotDivider />

      {/* ═══ PHILOSOPHY ═══ */}
      <PhilosophySection />

      <DotDivider />

      {/* ═══ FOUNDERS ═══ */}
      <div id="fondateurs">
        <FoundersSection />
      </div>

      <DotDivider />

      {/* ═══ ROADMAP ═══ */}
      <div id="roadmap">
        <RoadmapSection />
      </div>

      {/* ═══ FOOTER ═══ */}
      <FooterSection />
    </div>
  );
}
