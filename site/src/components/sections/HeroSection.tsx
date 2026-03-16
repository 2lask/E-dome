"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Globe, Users, TrendingUp, Link } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.165, 0.84, 0.44, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease },
  }),
};

const badges = [
  { icon: Globe, title: "International" },
  { icon: Users, title: "Multi-rôles" },
  { icon: TrendingUp, title: "Visibilité organique" },
  { icon: Link, title: "Écosystème complet" },
];

export default function HeroSection() {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle = 0;
    let animationId: number;
    const animate = () => {
      angle = (angle + 0.8) % 360;
      if (borderRef.current) {
        borderRef.current.style.background = `conic-gradient(from ${angle}deg, #8B6F47, #C4956A, #8B6F47)`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FAF8F5]/90">
      {/* Thin vertical lines with measurement ticks on both sides */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Left vertical line */}
        <div className="absolute left-[8%] top-0 bottom-0 w-px bg-white/[0.05]" />
        {/* Left tick marks every 80px */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={`ltick-${i}`} className="absolute left-[8%] w-2 h-px bg-white/[0.06]" style={{ top: `${i * 80}px`, transform: 'translateX(-50%)' }} />
        ))}
        {/* Right vertical line */}
        <div className="absolute right-[8%] top-0 bottom-0 w-px bg-white/[0.05]" />
        {/* Right tick marks every 80px */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={`rtick-${i}`} className="absolute right-[8%] w-2 h-px bg-white/[0.06]" style={{ top: `${i * 80}px`, transform: 'translateX(50%)' }} />
        ))}
        {/* Coordinate labels */}
        <span className="absolute top-4 left-[8%] ml-3 text-[9px] font-mono text-[#1A1A1A]/[0.06] tracking-wider">{"N 46°59'"}</span>
        <span className="absolute top-4 right-[8%] mr-3 text-[9px] font-mono text-[#1A1A1A]/[0.06] tracking-wider text-right">{"E 6°56'"}</span>
      </div>

      {/* Animated architectural grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,224,194,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,224,194,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Smaller inner grid for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,223,181,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,223,181,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Background gradients — kept subtle to respect 60% dark */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#8B6F47]/[0.06] blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#C4956A]/[0.05] blur-[120px]" />
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_center,transparent_20%,#111111_70%)]" />
      </div>

      {/* Floating architectural SVG decorations - left side */}
      <motion.svg
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ delay: 1, duration: 1.2, ease }}
        className="pointer-events-none absolute left-6 top-1/4 hidden lg:block"
        width="60"
        height="300"
        viewBox="0 0 60 300"
        fill="none"
      >
        <line x1="30" y1="0" x2="30" y2="80" stroke="url(#leftGrad1)" strokeWidth="0.5" />
        <rect x="20" y="80" width="20" height="20" stroke="url(#leftGrad1)" strokeWidth="0.5" fill="none" />
        <line x1="30" y1="100" x2="30" y2="160" stroke="url(#leftGrad1)" strokeWidth="0.5" />
        <circle cx="30" cy="170" r="4" stroke="url(#leftGrad1)" strokeWidth="0.5" fill="none" />
        <line x1="30" y1="174" x2="30" y2="220" stroke="url(#leftGrad1)" strokeWidth="0.5" />
        <rect x="22" y="220" width="16" height="16" stroke="url(#leftGrad1)" strokeWidth="0.5" fill="none" rx="2" />
        <line x1="30" y1="236" x2="30" y2="300" stroke="url(#leftGrad1)" strokeWidth="0.5" />
        <defs>
          <linearGradient id="leftGrad1" x1="30" y1="0" x2="30" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B6F47" stopOpacity="0" />
            <stop offset="0.3" stopColor="#8B6F47" />
            <stop offset="0.7" stopColor="#C4956A" />
            <stop offset="1" stopColor="#C4956A" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Floating architectural SVG decorations - right side */}
      <motion.svg
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ delay: 1.2, duration: 1.2, ease }}
        className="pointer-events-none absolute right-6 top-1/3 hidden lg:block"
        width="60"
        height="260"
        viewBox="0 0 60 260"
        fill="none"
      >
        <line x1="30" y1="0" x2="30" y2="60" stroke="url(#rightGrad1)" strokeWidth="0.5" />
        <polygon points="30,60 38,76 22,76" stroke="url(#rightGrad1)" strokeWidth="0.5" fill="none" />
        <line x1="30" y1="76" x2="30" y2="130" stroke="url(#rightGrad1)" strokeWidth="0.5" />
        <rect x="23" y="130" width="14" height="14" stroke="url(#rightGrad1)" strokeWidth="0.5" fill="none" transform="rotate(45 30 137)" />
        <line x1="30" y1="147" x2="30" y2="200" stroke="url(#rightGrad1)" strokeWidth="0.5" />
        <circle cx="30" cy="208" r="5" stroke="url(#rightGrad1)" strokeWidth="0.5" fill="none" />
        <line x1="30" y1="213" x2="30" y2="260" stroke="url(#rightGrad1)" strokeWidth="0.5" />
        <defs>
          <linearGradient id="rightGrad1" x1="30" y1="0" x2="30" y2="260" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C4956A" stopOpacity="0" />
            <stop offset="0.3" stopColor="#C4956A" />
            <stop offset="0.7" stopColor="#8B6F47" />
            <stop offset="1" stopColor="#8B6F47" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center md:px-12">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <span className="inline-flex items-center rounded-full border border-[#8B6F47]/20 bg-[#8B6F47]/5 px-5 py-2 text-sm font-medium text-[#8B6F47] backdrop-blur-sm">
            <span className="mr-2.5 inline-block h-1.5 w-1.5 rounded-full bg-[#8B6F47] animate-pulse" />
            La Plateforme Immobili&egrave;re Nouvelle G&eacute;n&eacute;ration
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-4 font-bold tracking-tight text-[#1A1A1A] text-4xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.95]"
        >
          <span className="block">L&apos;&eacute;cosyst&egrave;me qui connecte</span>
          <span className="block">tous les acteurs</span>
          <span className="mt-2 block bg-gradient-to-r from-[#8B6F47] to-[#C4956A] bg-clip-text text-transparent">
            de l&apos;immobilier mondial.
          </span>
        </motion.h1>

        {/* Decorative line under heading */}
        <motion.div
          custom={1.5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8B6F47]/40" />
          <div className="h-1 w-1 rounded-full bg-[#8B6F47]/50" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C4956A]/40" />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12 max-w-2xl text-base leading-relaxed text-[#555555] md:text-lg md:leading-relaxed"
        >
          R&eacute;seau social &middot; Marketplace &middot; Apporteurs d&apos;affaires &middot; Formations &middot; Services&nbsp;&mdash; enfin r&eacute;unis dans un seul &eacute;cosyst&egrave;me global.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-4 flex flex-col items-center gap-4 sm:flex-row"
        >
          {/* Primary CTA with spinning gradient border */}
          <a href="#qualification" className="group relative rounded-full p-[2px]">
            <div
              ref={borderRef}
              className="absolute inset-0 rounded-full opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "conic-gradient(from 0deg, #8B6F47, #C4956A, #8B6F47)",
              }}
            />
            <span className="relative z-10 inline-flex items-center rounded-full bg-gradient-to-r from-[#8B6F47] to-[#C4956A] px-8 py-3 text-sm font-semibold text-[#1A1A1A] transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-[#8B6F47]/20">
              Rejoindre les Membres Fondateurs &rarr;
            </span>
          </a>

          {/* Secondary CTA */}
          <a
            href="#problem"
            className="inline-flex items-center rounded-full border border-[#8B6F47]/30 bg-transparent px-8 py-3 text-sm font-semibold text-[#8B6F47] transition-all duration-300 hover:border-[#8B6F47]/50 hover:bg-[#8B6F47]/5"
          >
            D&eacute;couvrir le projet &darr;
          </a>
        </motion.div>

        {/* Trust line below CTA */}
        <motion.p
          custom={3.5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-16 text-sm text-[#888888]"
        >
          Sans engagement &middot; Gratuit &middot; Confidentiel
        </motion.p>

        {/* Badge Cards */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                custom={5 + idx}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="group relative rounded-xl border border-[#8B6F47]/12 bg-white p-5 transition-all duration-300 hover:border-[#8B6F47]/20"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-lg bg-[#8B6F47]/10 p-2">
                    <Icon className="h-5 w-5 text-[#8B6F47]" />
                  </div>
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    {badge.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#problem"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-1.5 text-[#AAAAAA] transition-colors duration-300 hover:text-[#888888]"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase">D&eacute;couvrir</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}
