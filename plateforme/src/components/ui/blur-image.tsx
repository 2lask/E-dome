"use client";

import React, { useState } from "react";

/* BlurImage — image avec skeleton shimmer + blur-up + lazy loading.
   Affiche un fond shimmer pendant le chargement, puis l'image apparaît
   avec un léger déflou. À utiliser dans un parent à position relative
   (typiquement un container à aspect-ratio fixe).

   Les classes .skeleton et .blur-up/.loaded sont définies dans globals.css. */

interface BlurImageProps {
  src: string;
  alt?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  className?: string;
  /** Forcer l'eager loading pour les images au-dessus de la ligne de flottaison. */
  eager?: boolean;
}

export function BlurImage({ src, alt = "", onLoad, className = "", eager = false }: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`absolute inset-0 w-full h-full object-cover blur-up ${loaded ? "loaded" : ""} ${className}`}
      />
    </>
  );
}
