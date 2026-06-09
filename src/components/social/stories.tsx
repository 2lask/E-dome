"use client";

import * as React from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLockBodyScroll } from "@/lib/hooks/use-lock-body-scroll";

/* ─── Stories E-Dome ──────────────────────────────────────────────────────
   Composants Instagram-like utilisés à deux endroits :

   1. <StoriesBar> — bandeau horizontal en haut du /feed. Avatars ronds
      avec anneau coloré dégradé si non-vues, anneau gris si vues.
      Premier item "Votre story" avec un + (CTA création, mock).

   2. <HighlightsBar> — sur /profil. Cercles + labels en dessous,
      pas d'anneau coloré (highlights = permanent, pas notion de
      "nouveau"). Click → ouvre le même viewer avec la séquence
      de stories du highlight.

   3. <StoryViewer> — modal fullscreen partagé par les deux. Progress
      bars segmentées en haut (Instagram), auto-advance 5 s par story,
      click L/R pour naviguer, swipe-down pour fermer, Escape pour
      fermer (a11y desktop).
   ─────────────────────────────────────────────────────────────────── */

// ─── Types ────────────────────────────────────────────────────────

export interface StoryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  /** Lien optionnel affiché en bas de la story (CTA "Voir le bien"). */
  cta?: { label: string; href: string };
}

export interface StoryRing {
  /** ID auteur — utilisé pour deeplink /profil/{id}. */
  authorId: string;
  authorName: string;
  authorAvatar: string;
  stories: StoryItem[];
  /** True si toutes les stories ont déjà été vues (anneau gris). */
  seen?: boolean;
}

export interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
  stories: StoryItem[];
}

// ─── StoriesBar ───────────────────────────────────────────────────

interface StoriesBarProps {
  /** Avatar de l'utilisateur courant (pour "Votre story"). */
  selfAvatar: string;
  rings: StoryRing[];
  /** Appelé avec l'index du ring cliqué. */
  onOpen: (ringIndex: number) => void;
  /** Optionnel : appelé au click sur "Votre story". */
  onCreateStory?: () => void;
}

export function StoriesBar({ selfAvatar, rings, onOpen, onCreateStory }: StoriesBarProps) {
  return (
    <div
      aria-label="Stories"
      className="no-scrollbar overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 py-3 border-b"
      style={{ borderColor: "var(--card-border)" }}
    >
      <div className="flex gap-4 min-w-max">
        {/* Self / Create story */}
        <button
          onClick={onCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0 active:opacity-60 transition-opacity"
        >
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full overflow-hidden"
              style={{ border: "2px solid var(--card-border)" }}
            >
              <img src={selfAvatar} alt="" className="w-full h-full object-cover" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                border: "2px solid var(--background)",
              }}
            >
              <Plus size={12} strokeWidth={3} />
            </span>
          </div>
          <span className="text-[11px] font-medium" style={{ color: "var(--foreground)" }}>
            Votre story
          </span>
        </button>

        {/* Stories des suivis */}
        {rings.map((ring, i) => (
          <button
            key={ring.authorId}
            onClick={() => onOpen(i)}
            className="flex flex-col items-center gap-1.5 shrink-0 active:opacity-60 transition-opacity"
            aria-label={`Story de ${ring.authorName}`}
          >
            <div
              className="p-[2px] rounded-full"
              style={{
                background: ring.seen
                  ? "var(--card-border)"
                  : "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full overflow-hidden"
                style={{ border: "2px solid var(--background)" }}
              >
                <img
                  src={ring.authorAvatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span
              className="text-[11px] font-medium max-w-[68px] truncate"
              style={{ color: "var(--foreground)" }}
            >
              {ring.authorName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HighlightsBar ────────────────────────────────────────────────

interface HighlightsBarProps {
  highlights: Highlight[];
  /** Self only : montre un bouton "+" en début de liste. */
  isOwn?: boolean;
  onOpen: (highlightIndex: number) => void;
  onCreateHighlight?: () => void;
}

export function HighlightsBar({
  highlights,
  isOwn = false,
  onOpen,
  onCreateHighlight,
}: HighlightsBarProps) {
  if (!isOwn && highlights.length === 0) return null;
  return (
    <div
      aria-label="Moments clés"
      className="no-scrollbar overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6"
    >
      <div className="flex gap-5 py-2 min-w-max">
        {isOwn && (
          <button
            onClick={onCreateHighlight}
            className="flex flex-col items-center gap-1.5 shrink-0 active:opacity-60 transition-opacity"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "var(--card)",
                border: "1.5px dashed var(--card-border)",
                color: "var(--text-muted)",
              }}
            >
              <Plus size={22} />
            </div>
            <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
              Nouveau
            </span>
          </button>
        )}
        {highlights.map((h, i) => (
          <button
            key={h.id}
            onClick={() => onOpen(i)}
            className="flex flex-col items-center gap-1.5 shrink-0 active:opacity-60 transition-opacity"
            aria-label={`Moment clé : ${h.title}`}
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden"
              style={{ border: "1.5px solid var(--card-border)" }}
            >
              <img src={h.coverUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <span
              className="text-[11px] font-medium max-w-[72px] truncate"
              style={{ color: "var(--foreground)" }}
            >
              {h.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── StoryViewer (modal fullscreen) ───────────────────────────────

interface StoryViewerProps {
  /** Sequence de stories (un ring entier OU les stories d'un highlight). */
  stories: StoryItem[];
  /** Auteur affiché en haut. */
  author: { id: string; name: string; avatar: string };
  /** Story de départ (index dans stories[]). */
  startIndex?: number;
  /** Durée d'une story en ms. 5000 ms par défaut (convention Instagram). */
  durationMs?: number;
  onClose: () => void;
}

export function StoryViewer({
  stories,
  author,
  startIndex = 0,
  durationMs = 5000,
  onClose,
}: StoryViewerProps) {
  const [index, setIndex] = React.useState(startIndex);
  const [progress, setProgress] = React.useState(0); // 0..1 pour la story courante
  const [paused, setPaused] = React.useState(false);
  const startedAtRef = React.useRef(0);
  const elapsedAtPauseRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  useLockBodyScroll(true);

  /* Boucle d'animation (rAF) : avance progress de 0 → 1 sur durationMs.
     Quand on hit 1, on passe à la story suivante ou on ferme. */
  React.useEffect(() => {
    if (paused) return;
    startedAtRef.current = performance.now() - elapsedAtPauseRef.current;
    const tick = (now: number) => {
      const elapsed = now - startedAtRef.current;
      const p = Math.min(1, elapsed / durationMs);
      setProgress(p);
      if (p >= 1) {
        elapsedAtPauseRef.current = 0;
        if (index < stories.length - 1) {
          setIndex((i) => i + 1);
        } else {
          onClose();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, index, stories.length, durationMs, onClose]);

  /* Reset le progress quand on change de story (next/prev manuel). */
  React.useEffect(() => {
    setProgress(0);
    elapsedAtPauseRef.current = 0;
  }, [index]);

  /* Échap pour fermer (desktop). */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNext = () => {
    if (index < stories.length - 1) setIndex((i) => i + 1);
    else onClose();
  };

  const goPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const handlePressStart = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    elapsedAtPauseRef.current = (performance.now() - startedAtRef.current);
    setPaused(true);
  };
  const handlePressEnd = () => setPaused(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
    handlePressStart();
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    handlePressEnd();
    const start = touchStartYRef.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientY ?? start;
    if (end - start > 80) onClose(); // swipe-down -> close
    touchStartYRef.current = null;
  };

  const current = stories[index];
  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Story de ${author.name}`}
      className="fixed inset-0 z-[90] flex items-center justify-center animate-fade-in"
      style={{ background: "#000" }}
    >
      {/* Zone d'image + tap zones */}
      <div
        className="relative w-full h-full md:max-w-[420px] md:max-h-[90vh] md:rounded-2xl overflow-hidden mx-auto"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={current.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient haut pour lisibilité du header */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
          }}
        />

        {/* Gradient bas pour lisibilité du caption / CTA */}
        {(current.caption || current.cta) && (
          <div
            className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            }}
          />
        )}

        {/* Progress bars segmentées (une par story dans la séquence) */}
        <div
          className="absolute top-0 left-0 right-0 flex gap-1 px-3 pt-3 z-10"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
        >
          {stories.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-0.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.3)" }}
            >
              <div
                className="h-full bg-white"
                style={{
                  width:
                    i < index
                      ? "100%"
                      : i === index
                      ? `${progress * 100}%`
                      : "0%",
                  transition: paused ? "none" : "width 80ms linear",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header : auteur + close */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-6 z-10"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}
        >
          <Link
            href={`/profil/${author.id}`}
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <img
              src={author.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-white/40"
            />
            <span className="text-sm font-semibold text-white drop-shadow">
              {author.name}
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Caption / CTA bas */}
        {(current.caption || current.cta) && (
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-6 z-10"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
          >
            {current.caption && (
              <p className="text-sm text-white mb-2 drop-shadow">
                {current.caption}
              </p>
            )}
            {current.cta && (
              <Link
                href={current.cta.href}
                onClick={onClose}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {current.cta.label}
              </Link>
            )}
          </div>
        )}

        {/* Tap zones gauche/droite (navigation) — invisibles */}
        <button
          type="button"
          aria-label="Story précédente"
          onClick={goPrev}
          className="absolute left-0 top-12 bottom-0 w-1/3 z-0"
        />
        <button
          type="button"
          aria-label="Story suivante"
          onClick={goNext}
          className="absolute right-0 top-12 bottom-0 w-1/3 z-0"
        />
      </div>

      {/* Chevrons desktop only (alignés au container 420 px) */}
      {index > 0 && (
        <button
          type="button"
          aria-label="Story précédente"
          onClick={goPrev}
          className={cn(
            "hidden md:flex items-center justify-center",
            "absolute left-[calc(50%-260px)] top-1/2 -translate-y-1/2 z-20",
            "w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white"
          )}
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {index < stories.length - 1 && (
        <button
          type="button"
          aria-label="Story suivante"
          onClick={goNext}
          className={cn(
            "hidden md:flex items-center justify-center",
            "absolute right-[calc(50%-260px)] top-1/2 -translate-y-1/2 z-20",
            "w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white"
          )}
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
