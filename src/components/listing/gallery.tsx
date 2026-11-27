"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Expand, LayoutGrid, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Galerie d'un bien + visionneuse plein écran ─────────────────────────────

   En tête de fiche, à la manière d'Airbnb :
   · 1 photo  : une seule grande photo, plein cadre ;
   · 2 photos : deux moitiés ;
   · 3-4      : une grande + les autres empilées à droite ;
   · 5 et +   : une grande + quatre vignettes, « Afficher les N photos ».
   Sur téléphone : la première photo seule, avec son compteur.
   Un clic ouvre la visionneuse : flèches, clavier (← → Échap), glissé au
   doigt, vignettes, focus piégé et rendu au bouton d'origine.
   Rendue dans un portail : les seules <img> de la section sont les photos. */

const noopSubscribe = () => () => {};
const photoLabel = (n: number) => `${n} photo${n > 1 ? "s" : ""}`;

export function Gallery({ images, title, hasVideo = false }: { images: string[]; title: string; hasVideo?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;
  const lastTrigger = useRef<HTMLElement | null>(null);

  const show = (i: number, el: HTMLElement) => { lastTrigger.current = el; setOpen(i); };
  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => lastTrigger.current?.focus());
  }, []);

  if (n === 0) return null;
  const tiles = images.slice(0, 5);
  const t = tiles.length;

  /* Disposition de la mosaïque (bureau). */
  const gridCls =
    t === 1 ? "md:grid-cols-1"
    : t === 2 ? "md:grid-cols-2"
    : t === 3 ? "md:grid-cols-[2fr_1fr] md:grid-rows-2"
    : t === 4 ? "md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2"
    : "md:grid-cols-4 md:grid-rows-2";
  const tileCls = (i: number) => {
    if (i === 0) return t >= 3 ? (t === 5 ? "md:col-span-2 md:row-span-2" : "md:row-span-2") : "";
    if (t === 4 && i === 3) return "md:col-span-2";
    return "";
  };

  return (
    <>
      <div
        className={cn(
          "group/gal relative grid grid-cols-1 gap-2 overflow-hidden rounded-[22px] md:rounded-[28px]",
          "h-[min(68vw,380px)] md:h-[min(62vh,540px)]",
          gridCls,
        )}
      >
        {tiles.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={(e) => show(i, e.currentTarget)}
            aria-label={`Agrandir la photo ${i + 1} sur ${n}`}
            className={cn(
              "group/tile relative min-h-0 overflow-hidden bg-subtle outline-none",
              "focus-visible:z-10 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-laiton",
              i > 0 && "hidden md:block",
              tileCls(i),
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={i === 0 ? title : `${title} — photo ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover/tile:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover/tile:scale-100"
            />
            {/* Voile au survol : les autres tuiles s'assombrissent légèrement. */}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover/gal:opacity-20 group-hover/tile:!opacity-0" />
            {i === 0 && (
              <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
            )}
          </button>
        ))}

        {/* Repères posés sur la photo */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 md:inset-x-4 md:bottom-4">
          <div className="flex flex-wrap gap-2">
            {hasVideo && (
              <a
                href="#video"
                className="pointer-events-auto inline-flex h-11 items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-4 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <PlayCircle className="h-4 w-4" aria-hidden /> Visite vidéo
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => show(0, e.currentTarget)}
            className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-white/92 px-4 text-[13px] font-semibold text-[#15130f] shadow-[0_8px_30px_-8px_rgb(0_0_0/0.5)] backdrop-blur transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:scale-100"
          >
            {n > 1 ? <LayoutGrid className="h-4 w-4" aria-hidden /> : <Expand className="h-4 w-4" aria-hidden />}
            {n > 1 ? <>Afficher les {n} photos</> : <>Plein écran<span className="sr-only"> · {photoLabel(n)}</span></>}
          </button>
        </div>
        {n > 1 && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[12px] font-medium tabular-nums text-white backdrop-blur md:hidden">
            1 / {n}
          </span>
        )}
      </div>

      <Lightbox images={images} title={title} index={open} setIndex={setOpen} onClose={close} />
    </>
  );
}

function Lightbox({
  images, title, index, setIndex, onClose,
}: {
  images: string[];
  title: string;
  index: number | null;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onClose: () => void;
}) {
  const n = images.length;
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [dir, setDir] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  /* Vrai côté navigateur seulement : le portail ne se rend pas au serveur. */
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const go = useCallback((d: number) => {
    setDir(d);
    setIndex((i) => (i === null ? i : (i + d + n) % n));
  }, [n, setIndex]);

  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        /* Focus piégé dans la visionneuse. */
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [isOpen, go, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo ${index + 1} sur ${n}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.22 }}
          className="fixed inset-0 z-[80] flex flex-col bg-[#070605]/95 text-white backdrop-blur-xl"
          onTouchStart={(e) => setTouchX(e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            const x = e.changedTouches[0]?.clientX;
            if (touchX !== null && x !== undefined && Math.abs(x - touchX) > 50 && n > 1) go(x < touchX ? 1 : -1);
            setTouchX(null);
          }}
        >
          {/* En-tête */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
            <p className="min-w-0 truncate text-[14px] font-medium text-white/85">{title}</p>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] tabular-nums" aria-live="polite">{index + 1} / {n}</span>
              <button
                ref={closeRef}
                type="button"
                aria-label="Fermer la visionneuse"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>

          {/* Photo */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <AnimatePresence initial={false} mode="popLayout" custom={dir}>
              <motion.img
                key={index}
                src={images[index]}
                alt={`${title} — photo ${index + 1} sur ${n}`}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60, scale: 0.98 }}
                transition={{ duration: reduce ? 0.01 : 0.32, ease: [0.2, 0.7, 0.2, 1] }}
                className="max-h-full max-w-full select-none rounded-xl object-contain shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
                draggable={false}
              />
            </AnimatePresence>
            {n > 1 && (
              <>
                <button type="button" aria-label="Photo précédente" onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-6">
                  <ChevronLeft className="h-6 w-6" aria-hidden />
                </button>
                <button type="button" aria-label="Photo suivante" onClick={() => go(1)}
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6">
                  <ChevronRight className="h-6 w-6" aria-hidden />
                </button>
              </>
            )}
          </div>

          {/* Vignettes */}
          {n > 1 ? (
            <div className="no-scrollbar mx-auto flex max-w-full gap-2 overflow-x-auto px-4 py-4">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  aria-label={`Afficher la photo ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                    i === index ? "opacity-100 ring-2 ring-[#e3b85c]" : "opacity-45 hover:opacity-80",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-[12.5px] text-white/55">Échap pour fermer</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
