"use client";

import { useRef } from "react";
import { track } from "./track";

/* Vidéo de visite : la première lecture est comptée (« vidéo regardée »). */
export function TrackedVideo({ src, propertyId, poster }: { src: string; propertyId: string; poster?: string }) {
  const counted = useRef(false);
  return (
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className="aspect-video w-full rounded-2xl bg-black object-contain"
      onPlay={() => { if (!counted.current) { counted.current = true; track(propertyId, "video"); } }}
    />
  );
}
