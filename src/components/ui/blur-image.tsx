"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";

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
  const [errored, setErrored] = useState(false);

  /* Repli sur erreur. Sans `onError`, une URL morte (404) laissait le skeleton
     shimmer À VIE (audit Mission 2 : 4 images produit figées en Boutique). On
     retire le skeleton et on affiche un fond neutre au ratio du conteneur. */
  if (errored) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-[var(--hover-bg)] text-[var(--text-muted)] ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={22} aria-hidden />
      </div>
    );
  }

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
        onError={() => setErrored(true)}
        className={`absolute inset-0 w-full h-full object-cover blur-up ${loaded ? "loaded" : ""} ${className}`}
      />
    </>
  );
}
