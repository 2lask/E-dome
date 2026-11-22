"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Galerie d'un bien + visionneuse plein écran ─────────────────────────────
   Mosaïque (1 grande + 4 vignettes) ; un clic ouvre la visionneuse :
   flèches, clavier (← → Échap), glissé au doigt, compteur. */

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);
  const n = images.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, go]);

  if (n === 0) return null;
  const tiles = images.slice(0, 5);

  return (
    <>
      <div className={cn("grid gap-2", n >= 3 ? "grid-cols-4 grid-rows-2 md:h-[420px]" : n === 2 ? "grid-cols-2" : "grid-cols-1")}>
        {tiles.map((src, i) => (
          <button key={src + i} type="button" onClick={() => setOpen(i)} aria-label={`Agrandir la photo ${i + 1} sur ${n}`}
            className={cn("group relative overflow-hidden rounded-xl bg-subtle",
              n >= 3 && i === 0 ? "col-span-4 row-span-2 aspect-[4/3] md:col-span-2 md:aspect-auto" : n >= 3 ? "hidden md:block" : "aspect-[4/3]")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={i === 0 ? title : ""} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            {i === tiles.length - 1 && n > tiles.length && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[15px] font-semibold text-white">+{n - tiles.length} photo{n - tiles.length > 1 ? "s" : ""}</span>
            )}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setOpen(0)} className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-leman hover:underline">
        <Images className="h-4 w-4" aria-hidden /> Voir les {n} photo{n > 1 ? "s" : ""}
      </button>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`Photo ${open + 1} sur ${n}`} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => setTouchX(e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => { const x = e.changedTouches[0]?.clientX; if (touchX !== null && x !== undefined && Math.abs(x - touchX) > 50) go(x < touchX ? 1 : -1); setTouchX(null); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[open]} alt="" className="max-h-[88vh] max-w-[94vw] rounded-lg object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/12 px-3 py-1 text-[13px] tabular-nums text-white">{open + 1} / {n}</p>
          <button type="button" aria-label="Fermer" onClick={() => setOpen(null)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
          {n > 1 && (
            <>
              <button type="button" aria-label="Photo précédente" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
              <button type="button" aria-label="Photo suivante" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
            </>
          )}
        </div>
      )}
    </>
  );
}
