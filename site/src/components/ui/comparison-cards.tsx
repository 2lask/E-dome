"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  const [percent, setPercent] = useState(5);
  const [dragging, setDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [autoPlayed, setAutoPlayed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const move = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    requestAnimationFrame(() => setPercent(Math.max(2, Math.min(98, p))));
  }, []);

  // Autoplay: slider bouge tout seul au chargement
  useEffect(() => {
    if (autoPlayed) return;
    const start = Date.now();
    const duration = 4000;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = (elapsed % (duration * 2)) / duration;
      const p = progress <= 1 ? progress * 95 : (2 - progress) * 95;
      setPercent(Math.max(2, Math.min(95, p)));
      if (elapsed < duration * 2 && !isHovering && !dragging) {
        autoRef.current = setTimeout(animate, 16);
      } else {
        setAutoPlayed(true);
      }
    };
    autoRef.current = setTimeout(animate, 500);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [autoPlayed, isHovering, dragging]);

  // Hover: la souris contrôle le slider
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    setAutoPlayed(true);
    if (autoRef.current) clearTimeout(autoRef.current);
    const rect = ref.current.getBoundingClientRect();
    const p = ((e.clientX - rect.left) / rect.width) * 100;
    requestAnimationFrame(() => setPercent(Math.max(2, Math.min(98, p))));
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] select-none"
      style={{ cursor: "col-resize" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setIsHovering(true); setAutoPlayed(true); if (autoRef.current) clearTimeout(autoRef.current); }}
      onMouseLeave={() => { setIsHovering(false); setDragging(false); }}
      onTouchMove={(e) => { setAutoPlayed(true); move(e.touches[0].clientX); }}
    >
      <div className="relative" style={{ minHeight: 480 }}>

        {/* FOND — "Sans E-Dome" (toujours là derrière) */}
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

        {/* DESSUS — "Avec E-Dome" (révélé par le slider depuis la droite) */}
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

        {/* BARRE SLIDER */}
        <div className="absolute top-0 bottom-0 z-30" style={{ left: `${percent}%` }}>
          <div className="absolute inset-0 w-[2px] -translate-x-px bg-gradient-to-b from-transparent via-[#C4956A] to-transparent" />
          <div className="absolute top-0 bottom-0 w-24 -left-24 bg-gradient-to-r from-transparent to-[#C4956A]/10" />
          <div className="absolute top-0 bottom-0 w-24 left-0 bg-gradient-to-l from-transparent to-[#C4956A]/5" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#C4956A] shadow-[0_0_24px_rgba(196,149,106,0.6)] flex items-center justify-center z-40">
            <GripVertical className="w-4 h-4 text-[#080808]" />
          </div>
        </div>
      </div>

      <div className="text-center py-3 bg-white/[0.02] border-t border-white/[0.06]">
        <p className="text-xs text-white/30">← Survolez ou glissez pour comparer →</p>
      </div>
    </div>
  );
}
