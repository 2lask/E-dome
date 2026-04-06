"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { AboutSection } from "@/components/landing/about-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturedVideoSection } from "@/components/landing/featured-video-section";
import { ServicesSection } from "@/components/landing/services-section";
import { FoundersSection } from "@/components/landing/founders-section";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { FooterSection } from "@/components/landing/footer-section";

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
          className="inline-block transition-all duration-500"
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

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [subVisible, setSubVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [tagVisible, setTagVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSubVisible(true), 800);
    const t2 = setTimeout(() => setBtnVisible(true), 1200);
    const t3 = setTimeout(() => setTagVisible(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="bg-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* ═══ HERO ═══ */}
      <section className="min-h-screen overflow-hidden relative flex flex-col">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted autoPlay loop playsInline preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Navbar */}
        <nav className="relative z-20 px-4 sm:px-6 py-6">
          <div className="liquid-glass rounded-xl max-w-6xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between">
            <span className="text-white font-semibold text-2xl tracking-tight">E-Dome</span>
            <div className="hidden md:flex items-center gap-8">
              <a href="#vision" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Vision</a>
              <a href="#fonctionnalites" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Fonctionnalités</a>
              <a href="#fondateurs" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Fondateurs</a>
              <a href="#roadmap" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Roadmap</a>
            </div>
            <Link href="/feed" className="bg-white text-black rounded-lg px-5 py-2 text-sm font-medium hover:bg-white/90 transition-colors">
              Voir la démo
            </Link>
          </div>
        </nav>

        {/* Hero content - two column */}
        <div className="relative z-10 flex-1 flex items-end px-6 sm:px-10 pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            {/* Left */}
            <div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white leading-[1.1] mb-6"
                style={{ letterSpacing: "-0.04em" }}
              >
                <AnimatedText text="L'immobilier" delay={200} />
                <br />
                <AnimatedText text="sous un même toit." delay={400} />
              </h1>

              <p
                className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-light"
                style={{
                  opacity: subVisible ? 1 : 0,
                  transition: "opacity 1000ms ease",
                }}
              >
                Réseau social, marketplace, formations, commissions, services —
                chaque acteur de l&apos;immobilier réuni en un seul endroit.
                Un profil unique qui s&apos;adapte à votre activité.
              </p>

              <div
                className="flex items-center gap-3"
                style={{
                  opacity: btnVisible ? 1 : 0,
                  transition: "opacity 1000ms ease",
                }}
              >
                <Link href="/feed" className="bg-white text-black rounded-lg px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
                  Explorer la maquette <ArrowRight size={16} />
                </Link>
                <a href="#vision" className="liquid-glass rounded-lg px-6 py-3 text-white text-sm font-medium border border-white/20 hover:bg-white/10 transition-colors">
                  En savoir plus
                </a>
              </div>
            </div>

            {/* Right - tag */}
            <div className="flex lg:justify-end lg:items-end">
              <div
                className="liquid-glass rounded-xl px-6 py-4 border border-white/20"
                style={{
                  opacity: tagVisible ? 1 : 0,
                  transition: "opacity 1000ms ease",
                }}
              >
                <p className="text-white text-lg sm:text-2xl font-light">
                  Social. Marketplace. Commissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div className="relative z-10 flex justify-center gap-4 pb-10">
          <button className="liquid-glass rounded-full p-3 text-white/50 hover:text-white hover:bg-white/5 transition-all" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </button>
          <button className="liquid-glass rounded-full p-3 text-white/50 hover:text-white hover:bg-white/5 transition-all" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </button>
          <button className="liquid-glass rounded-full p-3 text-white/50 hover:text-white hover:bg-white/5 transition-all" aria-label="Email"><Mail size={18} /></button>
        </div>
      </section>

      <div id="vision"><AboutSection /></div>
      <FeaturedVideoSection />
      <div id="probleme"><ProblemSection /></div>
      <div id="fonctionnalites"><ServicesSection /></div>
      <div id="fondateurs"><FoundersSection /></div>
      <div id="roadmap"><RoadmapSection /></div>
      <FooterSection />
    </div>
  );
}
