"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { getVideoMetadata } from "@/lib/video-metadata";
import { MEDIA_MAX_HEIGHT, clampAspect } from "./aspect";

export type MediaProps = { src: string; muted: boolean; onToggleMute: () => void };

export function VideoPlayer({ src, muted, onToggleMute }: MediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  /* Aspect ratio : on tente d'abord la map statique (VIDEO_RATIOS via
     getVideoMetadata) pour que le container ait le BON ratio des le 1er
     render, avant meme que la balise <video> soit montee. Sinon fallback
     9:16 (portrait) car 89% des clips du feed sont verticaux (Reels-like).
     onLoadedMetadata reste branche en filet de securite pour les URLs
     inconnues (blob: du composer, mocks futurs). */
  const initialAspect = useMemo(() => {
    const meta = getVideoMetadata(src);
    return clampAspect(meta ? meta.ratio : 9 / 16);
  }, [src]);
  const [aspectRatio, setAspectRatio] = useState<number>(initialAspect);
  /* mounted : controle le rendering DU <video> tag lui-meme. Tant que pas
     mounted, on affiche un poster sombre + bouton Play. Le <video> n'est
     mis dans le DOM qu'apres intersection (vrai lazy load).
     Vu que les MP4 font 1-16MB, on evite ainsi de monter 27 <video> tags
     simultanement (chaque tag charge metadata + premieres frames). */
  const [mounted, setMounted] = useState(false);
  const ratioRef = useRef(0);

  /* Observer cree UNE seule fois (deps []) : le recreer a chaque fois que
     `mounted` change faisait perdre le prochain tick d'intersection en cas
     de scroll rapide (le nouvel observer n'a pas le temps de rapporter son
     premier ratio avant que la video soit deja hors champ) -> la lecture
     ne se declenchait jamais, contrairement a un feed type Instagram/TikTok.
     rootMargin precharge le <video> un demi-ecran a l'avance (mount des 10%
     visible) pour laisser le temps au buffer reseau avant le seuil de
     lecture a 60%. */
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        ratioRef.current = entry.intersectionRatio;
        if (entry.intersectionRatio >= 0.1) setMounted(true);
        const v = videoRef.current;
        if (!v) return;
        if (entry.intersectionRatio >= 0.6) {
          v.play().then(() => setPaused(false)).catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.1, 0.3, 0.5, 0.6, 0.8], rootMargin: "50% 0px" }
    );
    obs.observe(c);
    return () => obs.disconnect();
  }, []);

  /* Des que le <video> vient d'etre monte, on tente la lecture tout de
     suite sur le dernier ratio connu (ratioRef) au lieu d'attendre le
     prochain callback de l'observer -- sinon meme delai/race qu'avant
     en cas de scroll rapide. */
  useEffect(() => {
    if (!mounted) return;
    const v = videoRef.current;
    if (v && ratioRef.current >= 0.6) {
      v.play().then(() => setPaused(false)).catch(() => {});
    }
  }, [mounted]);

  const togglePlay = () => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPaused(false)).catch(() => {});
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden"
      style={{ aspectRatio, maxHeight: MEDIA_MAX_HEIGHT }}
    >
      {/* Le <video> n'est rendu QUE quand mounted=true. Avant : poster noir. */}
      {mounted ? (
        <video
          ref={videoRef}
          src={src}
          muted={muted}
          loop
          playsInline
          preload="auto"
          autoPlay
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth > 0 && v.videoHeight > 0) {
              setAspectRatio(clampAspect(v.videoWidth / v.videoHeight));
            }
          }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100);
          }}
        />
      ) : (
        /* Poster : fond noir + Play discret. Aucun reseau utilise. */
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
          aria-label="Charger et lire la vidéo"
        >
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </button>
      )}
      {paused && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/25"
          aria-label="Lire la vidéo"
        >
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
            <Play className="w-7 h-7 text-white fill-white" />
          </div>
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center hover:bg-black/75 transition-colors z-10"
        aria-label={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15">
        <div className="h-full bg-[var(--primary)]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* BlurImage — image avec skeleton + blur-up + onLoad propre.
   Affiche un fond shimmer le temps du chargement, puis l'image
   apparaît avec un léger déflou. Combiné avec object-cover sur
   un container à aspect ratio fixe (tuile galerie). */
