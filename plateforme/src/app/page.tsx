"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
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

function DotDivider() {
  return (
    <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
    </div>
  );
}

function HomePageContent() {
  const { lang, setLang, t } = useLandingLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Hero text fade out on scroll
  const { scrollYProgress: heroFade } = useScroll({
    target: heroTextRef,
    offset: ["start start", "end start"],
  });
  const heroTextOpacity = useTransform(heroFade, [0, 0.3], [1, 0]);
  const heroTextY = useTransform(heroFade, [0, 0.3], [0, -100]);
  const videoScale = useTransform(heroFade, [0, 1], [1, 1.15]);

  // Force video play on mobile
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    const onInteraction = () => { v.play().catch(() => {}); };
    document.addEventListener("touchstart", onInteraction, { once: true });
    document.addEventListener("scroll", onInteraction, { once: true });
    return () => {
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("scroll", onInteraction);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ═══ STICKY VIDEO BACKGROUND ═══ */}
      {/* The video stays fixed. Hero text + About + Problem scroll OVER it */}
      <div className="relative">

        {/* Sticky video — stays at top while content scrolls over */}
        <div className="sticky top-0 h-screen -z-0 overflow-hidden">
          <motion.div style={{ scale: videoScale }} className="absolute inset-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted autoPlay loop playsInline preload="auto"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>

        {/* ═══ CONTENT SCROLLING OVER THE VIDEO ═══ */}
        <div className="relative z-10">

          {/* ── Navbar (fixed) ── */}
          <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl max-w-6xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between">
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
                <div className="flex items-center gap-0.5 rounded-lg border border-white/15 overflow-hidden">
                  {(["fr", "en", "th"] as const).map((l) => (
                    <button key={l} onClick={() => setLang(l)}
                      className={`text-xs font-medium px-2.5 py-1.5 transition-colors uppercase ${
                        lang === l ? "bg-[#C4956A] text-white" : "text-white/50 hover:text-white hover:bg-white/10"
                      }`}>{l}</button>
                  ))}
                </div>
                <Link href="#inscriptions" className="hidden sm:inline-flex bg-[#C4956A] text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#b8856a] transition-colors">
                  {t("hero.demo")}
                </Link>
              </div>
            </div>
          </nav>

          {/* ── Hero text (first screen, fades out on scroll) ── */}
          <div ref={heroTextRef} className="min-h-screen flex items-center justify-center px-6 pt-20">
            <motion.div style={{ opacity: heroTextOpacity, y: heroTextY }} className="max-w-4xl text-center">
              <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold animate-fade-in">
                {t("hero.label")}
              </p>
              <h1
                className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white leading-[1.05] mb-6 animate-fade-in"
                style={{ letterSpacing: "-0.04em", fontFamily: "'Instrument Serif', serif", animationDelay: "0.15s" }}
              >
                {t("hero.title1")}<br />
                <span className="text-[#C4956A]">{t("hero.title2")}</span>
              </h1>
              <p className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-light animate-fade-in" style={{ animationDelay: "0.3s" }}>
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8 animate-fade-in" style={{ animationDelay: "0.45s" }}>
                {[
                  { label: lang === "th" ? "แบดจ์ผู้ก่อตั้ง" : lang === "en" ? "Founder badge" : "Badge fondateur" },
                  { label: lang === "th" ? "เข้าถึงก่อนใคร" : lang === "en" ? "Early access" : "Accès anticipé" },
                  { label: lang === "th" ? "การมองเห็นสำคัญ" : lang === "en" ? "Priority visibility" : "Visibilité prioritaire" },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-1.5 text-emerald-400 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-white/60">{p.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all flex items-center gap-2 shadow-lg shadow-[#C4956A]/25">
                  {t("hero.cta")} <ArrowRight size={16} />
                </Link>
                <a href="#vision" className="rounded-xl px-8 py-3.5 text-white text-sm font-medium border border-white/20 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all">
                  {t("hero.learn")}
                </a>
              </div>
            </motion.div>
          </div>

          {/* ── About section scrolls OVER the video ── */}
          <div id="vision" className="min-h-screen flex items-center px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-8 md:p-14"
            >
              <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-6 font-medium">{t("about.label")}</p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-8"
                style={{ fontFamily: "'Instrument Serif', serif" }}>
                {t("about.title1")} <span className="text-[#C4956A]">{t("about.title2")}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <p className="text-white/70 text-base leading-relaxed">{t("about.p1")}</p>
                <p className="text-white/70 text-base leading-relaxed">{t("about.p2")}</p>
              </div>
              <p className="text-white/40 text-sm mb-4">{t("about.roles_label")}</p>
              <div className="flex flex-wrap gap-2">
                {["about.role_hote","about.role_agence","about.role_agent","about.role_investisseur","about.role_formateur","about.role_apporteur","about.role_photographe","about.role_courtier","about.role_notaire","about.role_architecte","about.role_promoteur","about.role_client"].map((key) => (
                  <span key={key} className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/70 bg-white/5">{t(key)}</span>
                ))}
                <span className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40">{t("about.more")}</span>
              </div>
            </motion.div>
          </div>

          {/* ── Problem section scrolls OVER the video ── */}
          <div id="probleme" className="min-h-screen flex items-center px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-8 md:p-14"
            >
              <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-6 font-medium">{t("problem.label")}</p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-8"
                style={{ fontFamily: "'Instrument Serif', serif" }}>
                {t("problem.title1")} <span className="text-[#C4956A]">{t("problem.title2")}</span>
              </h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">{t("problem.desc")}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { val: t("problem.stat1_value"), unit: t("problem.stat1_unit") },
                  { val: t("problem.stat2_value"), unit: t("problem.stat2_unit") },
                  { val: t("problem.stat3_value"), unit: t("problem.stat3_unit") },
                  { val: t("problem.stat4_value"), unit: t("problem.stat4_unit") },
                ].map((s) => (
                  <div key={s.val} className="text-center">
                    <p className="text-white text-3xl md:text-4xl font-semibold">{s.val}</p>
                    <p className="text-white/40 text-xs mt-1">{s.unit}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ═══ NORMAL SECTIONS (own backgrounds, after video) ═══ */}
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
