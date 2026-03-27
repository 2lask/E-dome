"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Check, GripVertical } from "lucide-react";

const without = [
  "Commissions \u00e9lev\u00e9es sur chaque transaction",
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
  const [percent, setPercent] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const startTime = useRef(Date.now());

  const move = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.max(5, Math.min(95, p)));
  }, []);

  // Autoplay en boucle infinie sauf quand on drag
  useEffect(() => {
    const animate = () => {
      if (dragging) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const elapsed = (Date.now() - startTime.current) / 1000;
      // Oscillation douce entre 15% et 85%
      const p = 50 + Math.sin(elapsed * 0.5) * 35;
      setPercent(p);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [dragging]);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] select-none"
      style={{ cursor: dragging ? "grabbing" : "default" }}
      onMouseMove={(e) => dragging && move(e.clientX)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => dragging && move(e.touches[0].clientX)}
      onTouchEnd={() => setDragging(false)}
    >
      <div className="relative" style={{ minHeight: 480 }}>

        {/* FOND — "Sans E-Dome" à gauche */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#120808] to-[#0a0505]">
          <div className="p-8 md:p-12 max-w-[50%]">
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
                  <span className="text-white/55 leading-relaxed text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DESSUS — "Avec E-Dome" à droite, révélé par clip */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#080d08] to-[#050a05]"
          style={{ clipPath: `inset(0 0 0 ${percent}%)` }}
        >
          <div className="p-8 md:p-12 ml-auto max-w-[50%]">
            <div className="flex justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-8">
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider">Avec E-Dome</span>
              </div>
            </div>
            <ul className="space-y-5">
              {withEdome.map((item, i) => (
                <li key={i} className="flex items-start gap-3 flex-row-reverse text-right">
                  <span className="w-7 h-7 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                  </span>
                  <span className="text-white/70 leading-relaxed text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BARRE SLIDER */}
        <div className="absolute top-0 bottom-0 z-30" style={{ left: `${percent}%` }}>
          <div className="absolute inset-0 w-[2px] -translate-x-px bg-gradient-to-b from-transparent via-[#10B981] to-transparent" />
          <div className="absolute top-0 bottom-0 w-20 -left-20 bg-gradient-to-r from-transparent to-[#10B981]/8" />
          <div className="absolute top-0 bottom-0 w-20 left-0 bg-gradient-to-l from-transparent to-[#10B981]/5" />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#10B981] shadow-[0_0_24px_rgba(16,185,129,0.6)] flex items-center justify-center z-40 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            onMouseDown={() => setDragging(true)}
            onTouchStart={() => setDragging(true)}
          >
            <GripVertical className="w-4 h-4 text-[#080808]" />
          </div>
        </div>
      </div>

    </div>
  );
}
