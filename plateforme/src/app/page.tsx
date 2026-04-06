"use client";

import { useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Instagram, Linkedin, Mail } from "lucide-react";
import { AboutSection } from "@/components/landing/about-section";
import { ProblemSection } from "@/components/landing/problem-section";
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
      {/* ═══ HERO ═══ */}
      <section className="min-h-screen overflow-hidden relative flex flex-col">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          muted autoPlay playsInline preload="auto"
          onCanPlay={onCanPlay} onTimeUpdate={onTimeUpdate} onEnded={onEnded}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
          style={{ opacity: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* Navbar */}
        <nav className="relative z-20 px-4 sm:px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Globe size={24} className="text-[#C4956A]" />
              <span className="text-white font-semibold text-lg ml-2">E-Dome</span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#probleme" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">Le constat</a>
                <a href="#fonctionnalites" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">Fonctionnalités</a>
                <a href="#fondateurs" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">Fondateurs</a>
                <a href="#roadmap" className="text-white/70 hover:text-[#C4956A] text-sm font-medium transition-colors">Roadmap</a>
              </div>
            </div>
            <Link href="/feed" className="liquid-glass rounded-full px-4 sm:px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors border border-[#C4956A]/20">
              Voir la démo
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[5%] md:-translate-y-[12%]">
          <p className="text-[#C4956A]/70 text-xs sm:text-sm tracking-[0.3em] uppercase mb-8">
            L&apos;immobilier connecté, simplifié, unifié
          </p>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-6"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            One{" "}<em className="italic text-[#C4956A]/60">place</em>
          </h1>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mb-10 px-4">
            Réseau social, marketplace, formations, commissions, services —
            chaque acteur de l&apos;immobilier réuni sous un même toit.
            Un profil unique qui s&apos;adapte à votre activité.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <Link href="/feed" className="bg-[#C4956A] rounded-full px-8 py-3.5 text-black text-sm font-semibold hover:bg-[#d4a57a] transition-colors flex items-center gap-2">
              Explorer la maquette <ArrowRight size={18} />
            </Link>
            <a href="#probleme" className="liquid-glass rounded-full px-8 py-3.5 text-white/80 text-sm font-medium hover:bg-white/5 transition-colors border border-white/10">
              Pourquoi E-Dome ?
            </a>
          </div>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <button className="liquid-glass rounded-full p-4 text-white/60 hover:text-[#C4956A] hover:bg-white/5 transition-all"><Instagram size={20} /></button>
          <button className="liquid-glass rounded-full p-4 text-white/60 hover:text-[#C4956A] hover:bg-white/5 transition-all"><Linkedin size={20} /></button>
          <button className="liquid-glass rounded-full p-4 text-white/60 hover:text-[#C4956A] hover:bg-white/5 transition-all"><Mail size={20} /></button>
        </div>
      </section>

      <div id="vision"><AboutSection /></div>
      <FeaturedVideoSection />
      <div id="probleme"><ProblemSection /></div>
      <div id="fonctionnalites"><ServicesSection /></div>
      <PhilosophySection />
      <div id="fondateurs"><FoundersSection /></div>
      <div id="roadmap"><RoadmapSection /></div>
      <FooterSection />
    </div>
  );
}