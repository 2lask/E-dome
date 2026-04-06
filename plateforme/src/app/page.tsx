"use client";

import { useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Instagram, Linkedin, Mail } from "lucide-react";
import { AboutSection } from "@/components/landing/about-section";
import { FeaturedVideoSection } from "@/components/landing/featured-video-section";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { ServicesSection } from "@/components/landing/services-section";
import { FoundersSection } from "@/components/landing/founders-section";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { FooterSection } from "@/components/landing/footer-section";

function animateOpacity(
  el: HTMLVideoElement,
  from: number,
  to: number,
  duration: number
) {
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    el.style.opacity = String(from + (to - from) * t);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onCanPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    animateOpacity(v, 0, 1, 500);
  }, []);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const remaining = v.duration - v.currentTime;
    if (remaining <= 0.55 && parseFloat(v.style.opacity || "1") > 0.1) {
      animateOpacity(v, parseFloat(v.style.opacity || "1"), 0, 500);
    }
  }, []);

  const onEnded = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.style.opacity = "0";
    setTimeout(() => {
      v.currentTime = 0;
      v.play();
      animateOpacity(v, 0, 1, 500);
    }, 100);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.style.opacity = "0";
  }, []);

  return (
    <div className="bg-black">
      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="min-h-screen overflow-hidden relative flex flex-col">
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          muted
          autoPlay
          playsInline
          preload="auto"
          onCanPlay={onCanPlay}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
          style={{ opacity: 0 }}
        />

        {/* Navbar */}
        <nav className="relative z-20 px-4 sm:px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Globe size={24} className="text-white" />
              <span className="text-white font-semibold text-lg ml-2">
                E-Dome
              </span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#vision" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Vision
                </a>
                <a href="#fonctionnalites" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Fonctionnalités
                </a>
                <a href="#fondateurs" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Fondateurs
                </a>
                <a href="#roadmap" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Roadmap
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/feed"
                className="liquid-glass rounded-full px-4 sm:px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Voir la démo
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[5%] md:-translate-y-[15%]">
          <p className="text-white/50 text-xs sm:text-sm tracking-widest uppercase mb-6">
            L&apos;écosystème immobilier international
          </p>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-6"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Invest{" "}
            <em className="italic text-white/60">smarter</em>
          </h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mb-10 px-4">
            Réseau social, marketplace, formations, commissions — tout l&apos;immobilier
            réuni dans une seule plateforme. De la Suisse au monde entier.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Link
              href="/feed"
              className="bg-white rounded-full px-8 py-3.5 text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              Explorer la maquette
              <ArrowRight size={18} />
            </Link>
            <a
              href="#vision"
              className="liquid-glass rounded-full px-8 py-3.5 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Découvrir le projet
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-4">
            <div className="text-center">
              <p className="text-white text-2xl sm:text-3xl font-semibold">5</p>
              <p className="text-white/40 text-xs mt-1">rôles utilisateur</p>
            </div>
            <div className="text-center">
              <p className="text-white text-2xl sm:text-3xl font-semibold">6+</p>
              <p className="text-white/40 text-xs mt-1">pays couverts</p>
            </div>
            <div className="text-center">
              <p className="text-white text-2xl sm:text-3xl font-semibold">30+</p>
              <p className="text-white/40 text-xs mt-1">pages fonctionnelles</p>
            </div>
          </div>
        </div>

        {/* Social icons footer */}
        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Instagram size={20} />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Linkedin size={20} />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Mail size={20} />
          </button>
        </div>
      </section>

      {/* ═══ SECTION 2: ABOUT / VISION ═══ */}
      <div id="vision">
        <AboutSection />
      </div>

      {/* ═══ SECTION 3: FEATURED VIDEO ═══ */}
      <FeaturedVideoSection />

      {/* ═══ SECTION 4: FONCTIONNALITÉS ═══ */}
      <div id="fonctionnalites">
        <ServicesSection />
      </div>

      {/* ═══ SECTION 5: INNOVATION x VISION ═══ */}
      <PhilosophySection />

      {/* ═══ SECTION 6: FONDATEURS ═══ */}
      <div id="fondateurs">
        <FoundersSection />
      </div>

      {/* ═══ SECTION 7: ROADMAP ═══ */}
      <div id="roadmap">
        <RoadmapSection />
      </div>

      {/* ═══ FOOTER ═══ */}
      <FooterSection />
    </div>
  );
}
