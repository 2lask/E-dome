"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { AboutSection } from "@/components/landing/about-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { ServicesSection } from "@/components/landing/services-section";
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

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Hero Panel – fades in/out as user scrolls through the sticky video hero   */
/* ──────────────────────────────────────────────────────────────────────────── */
function HeroPanel({
  scrollProgress,
  range,
  children,
}: {
  scrollProgress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(
    scrollProgress,
    [range[0], range[0] + 0.05, range[1] - 0.05, range[1]],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    scrollProgress,
    [range[0], range[0] + 0.05, range[1] - 0.05, range[1]],
    [60, 0, 0, -60],
  );

  return (
    <motion.div
      className="hero-panel"
      style={{ opacity, y }}
    >
      <div className="max-w-4xl text-center px-6">{children}</div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Dot divider                                                               */
/* ──────────────────────────────────────────────────────────────────────────── */
function DotDivider() {
  return (
    <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Main page content                                                         */
/* ──────────────────────────────────────────────────────────────────────────── */
function HomePageContent() {
  const { lang, setLang, t } = useLandingLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  /* Scroll progress through the 400 vh hero wrapper */
  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end end"],
  });

  /* Slow zoom on the video as user scrolls */
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Force video play on mobile
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    tryPlay();
    const onInteraction = () => {
      tryPlay();
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("scroll", onInteraction);
    };
    document.addEventListener("touchstart", onInteraction, { once: true });
    document.addEventListener("scroll", onInteraction, { once: true });
    return () => {
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("scroll", onInteraction);
    };
  }, []);

  return (
    <div className="bg-white" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  STICKY VIDEO HERO — 400 vh scroll space                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div ref={heroContainerRef} className="relative" style={{ height: "400vh" }}>
        {/* Sticky layer – pinned to viewport while scrolling */}
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Video with zoom */}
          <motion.div style={{ scale: videoScale }} className="absolute inset-0 w-full h-full">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4"
            />
          </motion.div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

          {/* ── Navbar ─────────────────────────────────────────────────── */}
          <nav className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-6 py-6">
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl max-w-6xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between">
              <span className="text-white font-semibold text-2xl tracking-tight">
                E-<span className="text-[#C4956A]">Dome</span>
              </span>
              <div className="hidden md:flex items-center gap-8">
                <a href="#vision" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.vision")}</a>
                <a href="#fonctionnalites" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.features")}</a>
                <a href="#fondateurs" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.founders")}</a>
                <a href="#roadmap" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.roadmap")}</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg border border-white/20 overflow-hidden">
                  {(["fr", "en", "th"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`text-xs font-medium px-2.5 py-1.5 transition-colors uppercase ${
                        lang === l
                          ? "bg-[#C4956A] text-white"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <Link href="#inscriptions" className="hidden sm:inline-flex bg-[#C4956A] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[#b8856a] transition-colors">
                  {t("hero.demo")}
                </Link>
              </div>
            </div>
          </nav>

          {/* ── Panel 1 (0-25 %) — Main hero ──────────────────────────── */}
          <HeroPanel scrollProgress={scrollYProgress} range={[0, 0.25]}>
            <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold">
              {t("hero.label")}
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.04em", fontFamily: "'Instrument Serif', 'Georgia', serif" }}
            >
              {t("hero.title1")}
              <br />
              <span className="text-[#C4956A]">{t("hero.title2")}</span>
            </h1>
            <p className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all flex items-center gap-2 shadow-lg shadow-[#C4956A]/25 hover:shadow-xl hover:shadow-[#C4956A]/30 hover:scale-[1.02]">
                {t("hero.cta")} <ArrowRight size={16} />
              </Link>
              <a href="#vision" className="rounded-xl px-8 py-3.5 text-white text-sm font-medium border border-white/25 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-[1.02]">
                {t("hero.learn")}
              </a>
            </div>
          </HeroPanel>

          {/* ── Panel 2 (25-50 %) — Vision teaser ─────────────────────── */}
          <HeroPanel scrollProgress={scrollYProgress} range={[0.25, 0.5]}>
            <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold">
              {t("about.label")}
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white leading-[1.1] mb-8"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Instrument Serif', 'Georgia', serif" }}
            >
              {t("about.title1")}{" "}
              <span className="text-[#C4956A]">{t("about.title2")}</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10 font-light">
              {t("about.p1").substring(0, 180)}...
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { key: "about.role_hote" },
                { key: "about.role_agent" },
                { key: "about.role_investisseur" },
                { key: "about.role_formateur" },
                { key: "about.role_apporteur" },
                { key: "about.role_photographe" },
                { key: "about.role_courtier" },
              ].map((r) => (
                <span key={r.key} className="text-xs px-4 py-2 rounded-full border border-white/20 text-white/80 bg-white/10 backdrop-blur-sm font-medium">
                  {t(r.key)}
                </span>
              ))}
              <span className="text-xs px-4 py-2 rounded-full border border-white/20 text-white/50 bg-white/5 font-medium">
                {t("about.more")}
              </span>
            </div>
          </HeroPanel>

          {/* ── Panel 3 (50-75 %) — Problem teaser ────────────────────── */}
          <HeroPanel scrollProgress={scrollYProgress} range={[0.5, 0.75]}>
            <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold">
              {t("problem.label")}
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white leading-[1.1] mb-8"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Instrument Serif', 'Georgia', serif" }}
            >
              {t("problem.title1")}{" "}
              <span className="text-[#C4956A]">{t("problem.title2")}</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-white text-5xl sm:text-6xl font-semibold tracking-tight">{t("problem.stat1_value")}</p>
                <p className="text-white/50 text-sm mt-1">{t("problem.stat1_unit")}</p>
              </div>
              <div className="w-px bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-white text-5xl sm:text-6xl font-semibold tracking-tight">{t("problem.stat2_value")}</p>
                <p className="text-white/50 text-sm mt-1">{t("problem.stat2_unit")}</p>
              </div>
              <div className="w-px bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-white text-5xl sm:text-6xl font-semibold tracking-tight">{t("problem.stat3_value")}</p>
                <p className="text-white/50 text-sm mt-1">{t("problem.stat3_unit")}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
              {t("problem.desc").substring(0, 200)}...
            </p>
          </HeroPanel>

          {/* ── Panel 4 (75-100 %) — CTA ──────────────────────────────── */}
          <HeroPanel scrollProgress={scrollYProgress} range={[0.75, 1]}>
            <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold">
              {lang === "th" ? "\u0e23\u0e48\u0e27\u0e21\u0e40\u0e1b\u0e47\u0e19\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e19\u0e36\u0e48\u0e07" : lang === "en" ? "Join the movement" : "Rejoignez l'aventure"}
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white leading-[1.1] mb-8"
              style={{ letterSpacing: "-0.03em", fontFamily: "'Instrument Serif', 'Georgia', serif" }}
            >
              {t("roadmap.cta_title1")}
              <br />
              <span className="text-[#C4956A]">{t("roadmap.cta_title2")}</span>
            </h2>
            {/* Early member perks */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mb-10">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e41\u0e1a\u0e14\u0e08\u0e4c\u0e1c\u0e39\u0e49\u0e01\u0e48\u0e2d\u0e15\u0e31\u0e49\u0e07" : lang === "en" ? "Founder badge" : "Badge fondateur"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e40\u0e02\u0e49\u0e32\u0e16\u0e36\u0e07\u0e01\u0e48\u0e2d\u0e19\u0e43\u0e04\u0e23" : lang === "en" ? "Early access" : "Acc\u00e8s anticip\u00e9"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e01\u0e32\u0e23\u0e21\u0e2d\u0e07\u0e40\u0e2b\u0e47\u0e19\u0e2a\u0e33\u0e04\u0e31\u0e0d" : lang === "en" ? "Priority visibility" : "Visibilit\u00e9 prioritaire"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e1e\u0e34\u0e40\u0e28\u0e29" : lang === "en" ? "Exclusive perks" : "Avantages exclusifs"}</span>
              </div>
            </div>
            <Link href="#inscriptions" className="inline-flex items-center gap-2 bg-[#C4956A] text-white rounded-xl px-10 py-4 text-base font-semibold hover:bg-[#b8856a] transition-all shadow-lg shadow-[#C4956A]/25 hover:shadow-xl hover:shadow-[#C4956A]/30 hover:scale-[1.02]">
              {t("hero.cta")} <ArrowRight size={18} />
            </Link>
          </HeroPanel>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  NORMAL SECTIONS — appear after the sticky hero scrolls away      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <div id="vision"><AboutSection /></div>
      <DotDivider />
      <div id="probleme"><ProblemSection /></div>
      <DotDivider />
      <div id="fonctionnalites"><ServicesSection /></div>
      <DotDivider />
      <PhilosophySection />
      <DotDivider />
      <div id="fondateurs"><FoundersSection /></div>
      <DotDivider />
      <div id="roadmap"><RoadmapSection /></div>
      <FooterSection />
    </div>
  );
}
