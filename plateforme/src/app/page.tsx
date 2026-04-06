"use client";

import { useRef, useCallback, useEffect } from "react";
import { Globe, ArrowRight, Instagram, Twitter } from "lucide-react";
import { AboutSection } from "@/components/landing/about-section";
import { FeaturedVideoSection } from "@/components/landing/featured-video-section";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { ServicesSection } from "@/components/landing/services-section";

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
        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center">
              <Globe size={24} className="text-white" />
              <span className="text-white font-semibold text-lg ml-2">
                E-Dome
              </span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#services" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Pricing
                </a>
                <a href="#philosophy" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  About
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium cursor-pointer hidden sm:inline">
                Sign Up
              </span>
              <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%] md:-translate-y-[20%]">
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-10"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Know it then{" "}
            <em className="italic">all</em>
          </h1>

          {/* Email input */}
          <div className="max-w-xl w-full mb-6">
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-sm"
              />
              <button className="bg-white rounded-full p-3 text-black shrink-0 hover:bg-white/90 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-white text-sm leading-relaxed px-4 max-w-lg mb-6">
            Stay updated with the latest news and insights. Subscribe to our
            newsletter today and never miss out on exciting updates.
          </p>

          {/* Manifesto button */}
          <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Manifesto
          </button>
        </div>

        {/* Social icons footer */}
        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Instagram size={20} />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Twitter size={20} />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Globe size={20} />
          </button>
        </div>
      </section>

      {/* ═══ SECTION 2: ABOUT ═══ */}
      <div id="about">
        <AboutSection />
      </div>

      {/* ═══ SECTION 3: FEATURED VIDEO ═══ */}
      <FeaturedVideoSection />

      {/* ═══ SECTION 4: PHILOSOPHY ═══ */}
      <div id="philosophy">
        <PhilosophySection />
      </div>

      {/* ═══ SECTION 5: SERVICES ═══ */}
      <div id="services">
        <ServicesSection />
      </div>
    </div>
  );
}
