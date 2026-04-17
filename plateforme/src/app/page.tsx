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

  useEffect(() => {
    const t1 = setTimeout(() => setSubVisible(true), 800);
    const t2 = setTimeout(() => setBtnVisible(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10">
          <div className="max-w-4xl mx-auto w-full text-center">
            <p
              className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold"
              style={{
                opacity: subVisible ? 1 : 0,
                transform: subVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 800ms ease, transform 800ms ease",
              }}
            >
              {t("hero.label")}
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.04em", fontFamily: "'Instrument Serif', 'Georgia', serif" }}
            >
              <AnimatedText text={t("hero.title1")} delay={200} />
              <br />
              <span className="text-[#C4956A]"><AnimatedText text={t("hero.title2")} delay={400} /></span>
            </h1>

            <p
              className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-light"
              style={{
                opacity: subVisible ? 1 : 0,
                transform: subVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 1000ms ease, transform 1000ms ease",
              }}
            >
              {t("hero.subtitle")}
            </p>

            {/* Early member perks */}
            <div
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8"
              style={{
                opacity: subVisible ? 1 : 0,
                transform: subVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 1200ms ease, transform 1200ms ease",
              }}
            >
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "แบดจ์ผู้ก่อตั้ง" : lang === "en" ? "Founder badge" : "Badge fondateur"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "เข้าถึงก่อนใคร" : lang === "en" ? "Early access" : "Accès anticipé"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "การมองเห็นสำคัญ" : lang === "en" ? "Priority visibility" : "Visibilité prioritaire"}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-white/70">{lang === "th" ? "สิทธิพิเศษ" : lang === "en" ? "Exclusive perks" : "Avantages exclusifs"}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap items-center justify-center gap-4"
              style={{
                opacity: btnVisible ? 1 : 0,
                transform: btnVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 1000ms ease, transform 1000ms ease",
              }}
            >
              <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all flex items-center gap-2 shadow-lg shadow-[#C4956A]/25 hover:shadow-xl hover:shadow-[#C4956A]/30 hover:scale-[1.02]">
                {t("hero.cta")} <ArrowRight size={16} />
              </Link>
              <a href="#vision" className="rounded-xl px-8 py-3.5 text-white text-sm font-medium border border-white/25 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-[1.02]">
                {t("hero.learn")}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

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
