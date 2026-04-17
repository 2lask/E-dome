"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

function DotDivider() {
  return (
    <div className="flex items-center gap-4 max-w-xs mx-auto py-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20" />
    </div>
  );
}

function HomePageContent() {
  const { lang, setLang, t } = useLandingLang();
  const videoRef = useRef<HTMLVideoElement>(null);

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

      {/* ═══ VIDEO WALLPAPER — fixed behind everything ═══ */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted autoPlay loop playsInline preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ═══ ALL CONTENT scrolls over the video ═══ */}
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

        {/* ── Section 1: Hero ── */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-4xl text-center">
            <p className="text-[#C4956A] text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-semibold">
              {t("hero.label")}
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.04em", fontFamily: "'Instrument Serif', serif" }}
            >
              {t("hero.title1")}<br />
              <span className="text-[#C4956A]">{t("hero.title2")}</span>
            </h1>
            <p className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8">
              {[
                lang === "th" ? "แบดจ์ผู้ก่อตั้ง" : lang === "en" ? "Founder badge" : "Badge fondateur",
                lang === "th" ? "เข้าถึงก่อนใคร" : lang === "en" ? "Early access" : "Accès anticipé",
                lang === "th" ? "การมองเห็นสำคัญ" : lang === "en" ? "Priority visibility" : "Visibilité prioritaire",
              ].map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-white/60">{p}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="#inscriptions" className="bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all flex items-center gap-2 shadow-lg shadow-[#C4956A]/25">
                {t("hero.cta")} <ArrowRight size={16} />
              </Link>
              <a href="#vision" className="rounded-xl px-8 py-3.5 text-white text-sm font-medium border border-white/20 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all">
                {t("hero.learn")}
              </a>
            </div>
          </div>
        </section>

        <DotDivider />

        {/* ── Section 2: Vision ── */}
        <section id="vision" className="min-h-screen flex items-center px-6 py-20">
          <div className="max-w-5xl mx-auto backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 md:p-14">
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
          </div>
        </section>

        <DotDivider />

        {/* ── Section 3: Problem ── */}
        <section id="probleme" className="min-h-screen flex items-center px-6 py-20">
          <div className="max-w-5xl mx-auto backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 md:p-14">
            <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-6 font-medium">{t("problem.label")}</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-8"
              style={{ fontFamily: "'Instrument Serif', serif" }}>
              {t("problem.title1")} <span className="text-[#C4956A]">{t("problem.title2")}</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">{t("problem.desc")}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { val: t("problem.stat1_value"), unit: t("problem.stat1_unit"), desc: t("problem.stat1_desc"), source: t("problem.stat1_source") },
                { val: t("problem.stat2_value"), unit: t("problem.stat2_unit"), desc: t("problem.stat2_desc"), source: t("problem.stat2_source") },
                { val: t("problem.stat3_value"), unit: t("problem.stat3_unit"), desc: t("problem.stat3_desc"), source: t("problem.stat3_source") },
                { val: t("problem.stat4_value"), unit: t("problem.stat4_unit"), desc: t("problem.stat4_desc"), source: t("problem.stat4_source") },
              ].map((s) => (
                <div key={s.val}>
                  <p className="text-white text-3xl md:text-4xl font-semibold tracking-tight">{s.val}</p>
                  <p className="text-white/40 text-xs mt-1 mb-2">{s.unit}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
                  <p className="text-white/25 text-[10px] mt-1 italic">{s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DotDivider />

        {/* ── Section 4: Services ── */}
        <div id="fonctionnalites">
          <ServicesSection />
        </div>

        <DotDivider />

        {/* ── Section 5: Philosophy ── */}
        <PhilosophySection />

        <DotDivider />

        {/* ── Section 6: Founders ── */}
        <div id="fondateurs">
          <FoundersSection />
        </div>

        <DotDivider />

        {/* ── Section 7: Roadmap ── */}
        <div id="roadmap">
          <RoadmapSection />
        </div>

        {/* ── Footer ── */}
        <FooterSection />
      </div>
    </div>
  );
}
