"use client";

import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface VideoItem {
  src: string;
}

interface ReelsVideoStackProps {
  /** Liste de vidéos (ordre = ordre de défilement). */
  videos: VideoItem[];
  /** MotionValue [0,1] couvrant la zone de cycling (sans la queue de hold). */
  progress: MotionValue<number>;
}

/**
 * Pile de vidéos plein écran style Instagram Reels.
 *
 * Pour chaque vidéo i, on calcule trois fenêtres dans la progression globale :
 *   - [(i-1)/N , i/N]    : entrée (la vidéo monte du bas)
 *   - [i/N    , (i+1)/N] : pleine visibilité
 *   - [(i+1)/N, (i+2)/N] : sortie (translation vers le haut + fade)
 *
 * Avec une zone de "settle" centrale de 80% (10% de transition de chaque côté),
 * la vidéo reste fixe et lisible la plupart du temps — seules les bordures
 * animent y/opacity. Évite l'impression de défilement constant.
 *
 * Côté lecture : seule la vidéo active + ses voisines immédiates ont
 * preload="auto" et play() ; les autres sont en pause/preload="none" pour
 * tenir le budget réseau (~3 vidéos résidentes en peak).
 */
export function ReelsVideoStack({ videos, progress }: ReelsVideoStackProps) {
  const N = videos.length;
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Index actif dérivé de la progression
  useMotionValueEvent(progress, "change", (p) => {
    if (N === 0) return;
    const idx = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
    setActive(idx);
  });

  // Gestion play/pause/preload selon l'index actif
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === active;
      const isNeighbour = Math.abs(i - active) === 1;
      const wantsPreload = isActive || isNeighbour;

      // Toggle preload via attribute (la prop React ne se met pas toujours à jour)
      const desired = wantsPreload ? "auto" : "none";
      if (el.getAttribute("preload") !== desired) {
        el.setAttribute("preload", desired);
      }

      if (isActive) {
        el.play().catch(() => {
          // Politique d'autoplay : ignore silencieusement
        });
      } else {
        el.pause();
        if (!isNeighbour) {
          // Vidéo lointaine : remettre à zéro pour qu'elle reparte propre au retour
          try {
            el.currentTime = 0;
          } catch {
            /* readyState peut bloquer le set, on s'en fiche */
          }
        }
      }
    });
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {videos.map((video, i) => (
        <ReelLayer
          key={i}
          index={i}
          total={N}
          progress={progress}
          src={video.src}
          videoRef={(el) => {
            refs.current[i] = el;
          }}
          isActive={i === active}
        />
      ))}
    </div>
  );
}

/* ─────────── Couche unitaire pour une vidéo ────────────────────────────
   Subscribe à `progress` via useTransform pour appliquer y / opacity.
   Découpée en sous-composant pour respecter la règle des hooks (un
   useTransform par couche, pas dans une boucle).
   ──────────────────────────────────────────────────────────────────── */
interface ReelLayerProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  src: string;
  videoRef: (el: HTMLVideoElement | null) => void;
  isActive: boolean;
}

function ReelLayer({
  index,
  total,
  progress,
  src,
  videoRef,
  isActive,
}: ReelLayerProps) {
  const slot = 1 / total;
  // Bornes du slot de cette vidéo
  const start = index * slot;
  const end = (index + 1) * slot;
  // Zone de transition à chaque bord (10% du slot)
  const trIn = start + 0.1 * slot;
  const trOut = end - 0.1 * slot;

  // y : commence à 100% (sous l'écran) → 0% en pleine visibilité → -100% (au-dessus)
  const y = useTransform(
    progress,
    [start, trIn, trOut, end],
    ["100%", "0%", "0%", "-100%"],
  );
  // opacity : 0 → 1 sur la zone d'entrée, 1 → 0 sur la sortie
  const opacity = useTransform(
    progress,
    [start, trIn, trOut, end],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      style={{ y, opacity, zIndex: isActive ? 2 : 1 }}
      className="absolute inset-0"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
      {/* Léger gradient pour lisibilité d'un overlay éventuel */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
    </motion.div>
  );
}
