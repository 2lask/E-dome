"use client";
import React, { useState } from "react";
import {  } from "lucide-react";
import { MEDIA_MAX_HEIGHT, clampAspect } from "./aspect";


export function BlurImage({
  src,
  alt = "",
  onLoad,
}: {
  src: string;
  alt?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`absolute inset-0 w-full h-full object-cover blur-up ${loaded ? "loaded" : ""}`}
      />
    </>
  );
}

export function ImageView({ src }: { src: string }) {
  // Aspect ratio natif lu à onLoad, clampé identique aux vidéos.
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  return (
    <div
      className="relative bg-[var(--hover-bg)] rounded-2xl overflow-hidden"
      style={{ aspectRatio, maxHeight: MEDIA_MAX_HEIGHT }}
    >
      <BlurImage
        src={src}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setAspectRatio(clampAspect(img.naturalWidth / img.naturalHeight));
          }
        }}
      />
    </div>
  );
}

/* MediaGallery — rendu Twitter/X façon galerie selon la longueur :
   1 image : aspect ratio natif (ImageView).
   2 images : 2 colonnes 1:1.
   3 images : 1 grande à gauche (occupe les 2 lignes) + 2 petites à droite empilées.
   4 images : grille 2x2 carrée.
   ≥5 : limite à 4 visibles avec un overlay "+N" sur la dernière. */
