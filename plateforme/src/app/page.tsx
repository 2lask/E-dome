"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AboutSection } from "@/components/landing/about-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturedVideoSection } from "@/components/landing/featured-video-section";
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

function HomePageContent() {
  const { lang, setLang, t } = useLandingLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroTextY = useTransform(heroScroll, [0, 0.5], [0, -80]);
  const heroTextOpacity = useTransform(heroScroll, [0, 0.4], [1, 0]);

  // Force video play on mobile (some browsers block autoplay until interaction)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    tryPlay();
    const onInteraction = () => { tryPlay(); document.removeEventListener("touchstart", onInteraction); document.removeEventListener("scroll", onInteraction); };
    document.addEventListener("touchstart", onInteraction, { once: true });
    document.addEventListener("scroll", onInteraction, { once: true });
    return () => { document.removeEventListener("touchstart", onInteraction); document.removeEventListener("scroll", onInteraction); };
  }, []);

  return (
    <div className="bg-white" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="min-h-screen overflow-hidden relative flex flex-col">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 w-full h-full">
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
        {/* Subtle dark gradient overlay - video stays visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />

        {/* Navbar */}
        <nav className="relative z-20 px-4 sm:px-6 py-6">
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
            <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[#b8856a] transition-colors">
              {t("hero.demo")}
            </Link>
          </div>
        </nav>

        {/* Hero content - centered */}
        <motion.div style={{ y: heroTextY, opacity: heroTextOpacity }} className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10">
          <div className="max-w-4xl mx-auto w-full text-center">
            <p
              className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold animate-fade-in"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              {t("hero.label")}
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white leading-[1.05] mb-6 animate-fade-in"
              style={{ letterSpacing: "-0.04em", fontFamily: "'Instrument Serif', 'Georgia', serif", animationDelay: "0.2s", animationFillMode: "both" }}
            >
              {t("hero.title1")}
              <br />
              <span className="text-[#C4956A]">{t("hero.title2")}</span>
            </h1>

            <p
              className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-light animate-fade-in"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              {t("hero.subtitle")}
            </p>

            {/* Early member perks */}
            <div
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 animate-fade-in"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
            >
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e41\u0e1a\u0e14\u0e08\u0e4c\u0e1c\u0e39\u0e49\u0e01\u0e48\u0e2d\u0e15\u0e31\u0e49\u0e07" : lang === "en" ? "Founder badge" : "Badge fondateur"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e40\u0e02\u0e49\u0e32\u0e16\u0e36\u0e07\u0e01\u0e48\u0e2d\u0e19\u0e43\u0e04\u0e23" : lang === "en" ? "Early access" : "Acc\u00e8s anticip\u00e9"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e01\u0e32\u0e23\u0e21\u0e2d\u0e07\u0e40\u0e2b\u0e47\u0e19\u0e2a\u0e33\u0e04\u0e31\u0e0d" : lang === "en" ? "Priority visibility" : "Visibilit\u00e9 prioritaire"}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e1e\u0e34\u0e40\u0e28\u0e29" : lang === "en" ? "Exclusive perks" : "Avantages exclusifs"}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.8s", animationFillMode: "both" }}
            >
              <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all flex items-center gap-2 shadow-lg shadow-[#C4956A]/25 hover:shadow-xl hover:shadow-[#C4956A]/30 hover:scale-[1.02]">
                {t("hero.cta")} <ArrowRight size={16} />
              </Link>
              <a href="#vision" className="rounded-xl px-8 py-3.5 text-white text-sm font-medium border border-white/25 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-[1.02]">
                {t("hero.learn")}
              </a>
            </div>
          </div>
        </motion.div>

      </section>

      <div id="vision"><AboutSection /></div>
      <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
      </div>
      <FeaturedVideoSection />
      <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
      </div>
      <div id="probleme"><ProblemSection /></div>
      <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
      </div>
      <div id="fonctionnalites"><ServicesSection /></div>
      <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
      </div>
      <PhilosophySection />
      <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
      </div>
      <div id="fondateurs"><FoundersSection /></div>
      <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
      </div>
      <div id="roadmap"><RoadmapSection /></div>
      <FooterSection />
    </div>
  );
}
