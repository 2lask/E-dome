"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutSection } from "@/components/landing/about-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturedVideoSection } from "@/components/landing/featured-video-section";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { ServicesSection } from "@/components/landing/services-section";
import { FoundersSection } from "@/components/landing/founders-section";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { FooterSection } from "@/components/landing/footer-section";
import { LandingLanguageProvider, useLandingLang } from "@/components/landing/landing-i18n";

function AnimatedText({ text, delay = 200 }: { text: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-[transform,opacity] duration-500"
          style={{
            transform: visible ? "translateX(0)" : "translateX(-18px)",
            opacity: visible ? 1 : 0,
            transitionDelay: `${i * 30}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

function CountUp({ target, suffix = "", delay = 1600, duration = 1500 }: { target: number; suffix?: string; delay?: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return (
    <span style={{ opacity: started ? 1 : 0, transition: "opacity 300ms ease" }}>
      {count}{suffix}
    </span>
  );
}

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
  const [subVisible, setSubVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [tagVisible, setTagVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSubVisible(true), 800);
    const t2 = setTimeout(() => setBtnVisible(true), 1200);
    const t3 = setTimeout(() => setTagVisible(true), 1400);
    const t4 = setTimeout(() => setStatsVisible(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

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
      <section className="min-h-screen overflow-hidden relative flex flex-col">
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
        {/* Light overlay instead of dark gradient */}
        <div className="absolute inset-0 bg-white/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />

        {/* Navbar */}
        <nav className="relative z-20 px-4 sm:px-6 py-6">
          <div className="liquid-glass-light rounded-2xl max-w-6xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between">
            <span className="text-gray-900 font-semibold text-2xl tracking-tight">
              E-<span className="text-[#C4956A]">Dome</span>
            </span>
            <div className="hidden md:flex items-center gap-8">
              <a href="#vision" className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.vision")}</a>
              <a href="#fonctionnalites" className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.features")}</a>
              <a href="#fondateurs" className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.founders")}</a>
              <a href="#roadmap" className="text-gray-500 hover:text-[#C4956A] text-sm font-medium transition-colors">{t("nav.roadmap")}</a>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 overflow-hidden">
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
            <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[#b8856a] transition-colors">
              {t("hero.demo")}
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center px-6 sm:px-10">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div>
              <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.25em] uppercase mb-4 font-semibold"
                style={{ opacity: subVisible ? 1 : 0, transition: "opacity 800ms ease" }}>
                {t("hero.label")}
              </p>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-gray-900 leading-[1.1] mb-6"
                style={{ letterSpacing: "-0.04em" }}
              >
                <AnimatedText text={t("hero.title1")} delay={200} />
                <br />
                <span className="text-[#C4956A]"><AnimatedText text={t("hero.title2")} delay={400} /></span>
              </h1>

              <p
                className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-light"
                style={{
                  opacity: subVisible ? 1 : 0,
                  transition: "opacity 1000ms ease",
                }}
              >
                {t("hero.subtitle")}
              </p>

              {/* Early member perks */}
              <div
                className="flex flex-wrap gap-2 mb-6"
                style={{
                  opacity: subVisible ? 1 : 0,
                  transition: "opacity 1200ms ease",
                }}
              >
                <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] sm:text-xs font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {lang === "th" ? "แบดจ์ผู้ก่อตั้ง" : lang === "en" ? "Founder badge" : "Badge fondateur"}
                </div>
                <span className="text-gray-300">·</span>
                <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] sm:text-xs font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {lang === "th" ? "เข้าถึงก่อนใคร" : lang === "en" ? "Early access" : "Accès anticipé"}
                </div>
                <span className="text-gray-300">·</span>
                <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] sm:text-xs font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {lang === "th" ? "การมองเห็นสำคัญ" : lang === "en" ? "Priority visibility" : "Visibilité prioritaire"}
                </div>
                <span className="text-gray-300 hidden sm:inline">·</span>
                <div className="hidden sm:flex items-center gap-1.5 text-emerald-600 text-[10px] sm:text-xs font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {lang === "th" ? "สิทธิพิเศษ" : lang === "en" ? "Exclusive perks" : "Avantages exclusifs"}
                </div>
              </div>

              <div
                className="flex flex-wrap items-center gap-3"
                style={{
                  opacity: btnVisible ? 1 : 0,
                  transition: "opacity 1000ms ease",
                }}
              >
                <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-[#b8856a] transition-colors flex items-center gap-2 shadow-lg shadow-[#C4956A]/20">
                  {t("hero.cta")} <ArrowRight size={16} />
                </Link>
                <a href="#vision" className="rounded-lg px-6 py-3 text-gray-700 text-sm font-medium border border-gray-300 bg-white/80 hover:bg-white hover:border-gray-400 transition-colors">
                  {t("hero.learn")}
                </a>
              </div>

            </div>

            {/* Right - CTA */}
            <div className="hidden lg:flex lg:justify-end lg:items-center">
              <Link
                href="#inscriptions"
                className="bg-[#C4956A] text-white rounded-2xl px-8 py-4 text-lg sm:text-xl font-semibold hover:bg-[#b8856a] transition-colors flex items-center gap-3 shadow-xl shadow-[#C4956A]/25"
                style={{
                  opacity: tagVisible ? 1 : 0,
                  transition: "opacity 1000ms ease",
                }}
              >
                {t("hero.mockup")} <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

      </section>

      <div id="vision"><AboutSection /></div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-4xl mx-auto" />
      <FeaturedVideoSection />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-4xl mx-auto" />
      <div id="probleme"><ProblemSection /></div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-4xl mx-auto" />
      <div id="fonctionnalites"><ServicesSection /></div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-4xl mx-auto" />
      <PhilosophySection />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-4xl mx-auto" />
      <div id="fondateurs"><FoundersSection /></div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-4xl mx-auto" />
      <div id="roadmap"><RoadmapSection /></div>
      <FooterSection />
    </div>
  );
}
