"use client";

import React, { useRef } from "react";

interface HolographicCardProps {
  /** N° d'inscription affiché en grand */
  memberNumber?: string;
  /** Label au-dessus du numéro */
  topLabel?: string;
  /** Label en bas à gauche */
  bottomLeft?: string;
  /** Mention en bas à droite (ex. "EXP. 2026") */
  bottomRight?: string;
  /** Nom de marque en haut à gauche */
  brand?: string;
  className?: string;
}

/**
 * HolographicCard — carte premium "Membre Fondateur" avec effet 3D
 * tilt suivant le curseur + reflet holographique radial gold qui se
 * déplace sur la surface. Esthétique carte de crédit luxe (ratio
 * 1.586:1, dark gradient, accents gold #1e9df1).
 */
export function HolographicCard({
  memberNumber = "N° 001 / 100",
  topLabel = "MEMBRE FONDATEUR",
  bottomLeft = "CARTE PREMIUM",
  bottomRight = "EXP. 2026",
  brand = "E-DOME",
  className,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 7;
    const rotateY = ((centerX - x) / centerX) * 7;

    card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    card.style.setProperty("--x", "50%");
    card.style.setProperty("--y", "50%");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`holographic-card${className ? ` ${className}` : ""}`}
    >
      {/* Bordure conique gold */}
      <div className="holo-frame" />

      {/* Grain subtil */}
      <div className="holo-grain" />

      {/* Reflet holographique qui suit le curseur */}
      <div className="holo-shine" />

      {/* Contenu */}
      <div className="holo-content">
        <div className="holo-top">
          <span className="holo-brand">{brand}</span>
          <span className="holo-seal" aria-hidden="true">✦</span>
        </div>

        <div className="holo-middle">
          <p className="holo-label">{topLabel}</p>
          <p className="holo-number">{memberNumber}</p>
        </div>

        <div className="holo-bottom">
          <span className="holo-tier">{bottomLeft}</span>
          <span className="holo-exp">{bottomRight}</span>
        </div>
      </div>
    </div>
  );
}

export default HolographicCard;
