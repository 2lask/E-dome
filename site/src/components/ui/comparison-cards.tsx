"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, GripVertical } from "lucide-react";

const without = [
  "Commissions de 14 à 25% sur chaque transaction",
  "Visibilité uniquement via publicité payante",
  "Relation client captée par les plateformes",
  "Outils fragmentés et déconnectés",
  "Bouche-à-oreille non traçable ni rémunéré",
  "Données dispersées, aucune vue d'ensemble",
];

const withEdome = [
  "Commissions nettement inférieures au marché",
  "Visibilité organique gratuite et illimitée",
  "Relation directe avec vos clients",
  "Écosystème unifié tout-en-un",
  "Apporteurs rémunérés automatiquement",
  "Analytics centralisés en temps réel",
];

export function ComparisonCards() {
  const [sliderPercent, setSliderPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      requestAnimationFrame(() => {
        setSliderPercent(Math.max(5, Math.min(95, percent)));
      });
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] select-none"
      style={{ cursor: isDragging ? "grabbing" : "col-resize" }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Container with both panels */}
      <div className="relative min-h-[480px] md:min-h-[420px]">

        {/* LEFT: Sans E-Dome (visible based on slider) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#120808] to-[#0a0606]"
          style={{ clipPath: `inset(0 ${100 - sliderPercent}% 0 0)` }}
        >
          <div className="p-8 md:p-12 pr-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
              <X className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Sans E-Dome</span>
            </div>
            <ul className="space-y-5">
              {without.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </span>
                  <span className="text-white/55 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Avec E-Dome (always full, behind left) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080d08] to-[#060a06]">
          <div className="p-8 md:p-12 pl-16">
            <div className="flex justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-8">
                <Check className="w-3.5 h-3.5 text-[#C4956A]" />
                <span className="text-xs font-semibold text-[#C4956A] uppercase tracking-wider">Avec E-Dome</span>
              </div>
            </div>
            <ul className="space-y-5">
              {withEdome.map((item, i) => (
                <li key={i} className="flex items-start gap-3 justify-end text-right">
                  <span className="text-white/70 leading-relaxed">{item}</span>
                  <span className="w-7 h-7 rounded-full bg-[#C4956A]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#C4956A]" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SLIDER LINE */}
        <motion.div
          className="absolute top-0 bottom-0 z-30 w-px"
          style={{ left: `${sliderPercent}%` }}
        >
          {/* Glow line */}
          <div className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-[#C4956A] to-transparent" />

          {/* Left glow */}
          <div className="absolute top-0 bottom-0 w-24 -left-24 bg-gradient-to-r from-transparent to-[#C4956A]/10 [mask-image:radial-gradient(80px_at_right,white,transparent)]" />

          {/* Right glow */}
          <div className="absolute top-0 bottom-0 w-24 left-0 bg-gradient-to-l from-transparent to-[#C4956A]/5 [mask-image:radial-gradient(60px_at_left,white,transparent)]" />

          {/* Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C4956A] shadow-[0_0_20px_rgba(196,149,106,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing z-40"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <GripVertical className="w-4 h-4 text-[#080808]" />
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="text-center py-3 bg-white/[0.02] border-t border-white/[0.06]">
        <p className="text-xs text-white/30">Glissez pour comparer</p>
      </div>
    </div>
  );
}
