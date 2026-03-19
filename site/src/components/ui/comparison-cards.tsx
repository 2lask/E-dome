"use client";

import { useState, useRef, useCallback } from "react";
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
  const [percent, setPercent] = useState(15);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    requestAnimationFrame(() => setPercent(Math.max(2, Math.min(98, p))));
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] select-none"
      style={{ cursor: dragging ? "grabbing" : "ew-resize" }}
      onMouseMove={(e) => dragging && move(e.clientX)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => dragging && move(e.touches[0].clientX)}
      onTouchEnd={() => setDragging(false)}
    >
      <div className="relative" style={{ minHeight: 460 }}>

        {/* COUCHE DU FOND — "Sans E-Dome" (toujours visible derrière) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#120808] to-[#0a0505]">
          <div className="p-8 md:p-12">
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

        {/* COUCHE DU DESSUS — "Avec E-Dome" (révélée par le slider depuis la droite) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#080d08] to-[#050a05]"
          style={{ clipPath: `inset(0 0 0 ${percent}%)` }}
        >
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-8">
              <Check className="w-3.5 h-3.5 text-[#C4956A]" />
              <span className="text-xs font-semibold text-[#C4956A] uppercase tracking-wider">Avec E-Dome</span>
            </div>
            <ul className="space-y-5">
              {withEdome.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#C4956A]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#C4956A]" />
                  </span>
                  <span className="text-white/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BARRE DU SLIDER */}
        <div
          className="absolute top-0 bottom-0 z-30"
          style={{ left: `${percent}%` }}
        >
          {/* Ligne lumineuse */}
          <div className="absolute inset-0 w-[2px] -translate-x-px bg-gradient-to-b from-transparent via-[#C4956A] to-transparent" />

          {/* Lueur gauche */}
          <div className="absolute top-0 bottom-0 w-20 -left-20 bg-gradient-to-r from-transparent to-[#C4956A]/10" />

          {/* Lueur droite */}
          <div className="absolute top-0 bottom-0 w-20 left-0 bg-gradient-to-l from-transparent to-[#C4956A]/5" />

          {/* Poignée */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#C4956A] shadow-[0_0_24px_rgba(196,149,106,0.6)] flex items-center justify-center cursor-grab active:cursor-grabbing z-40 hover:scale-110 transition-transform"
            onMouseDown={() => setDragging(true)}
            onTouchStart={() => setDragging(true)}
          >
            <GripVertical className="w-4 h-4 text-[#080808]" />
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center py-3 bg-white/[0.02] border-t border-white/[0.06]">
        <p className="text-xs text-white/30">← Glissez pour révéler →</p>
      </div>
    </div>
  );
}
