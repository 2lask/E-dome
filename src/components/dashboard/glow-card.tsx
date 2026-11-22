"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

/* ── Carte lumineuse (inspirée des « bento grids » à halo) ───────────────────
   Le halo et la bordure suivent le pointeur. La position est écrite dans des
   variables CSS (aucun re-rendu React à chaque mouvement). Au doigt : le halo
   suit le glissé. Mouvement réduit : pas d'animation. */

const ACCENT: Record<"leman" | "laiton" | "encre", string> = {
  leman: "11 93 87",
  laiton: "176 122 26",
  encre: "21 19 15",
};

export function GlowCard({
  accent = "leman",
  className,
  children,
}: {
  accent?: keyof typeof ACCENT;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${x - r.left}px`);
    el.style.setProperty("--gy", `${y - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={(e) => move(e.clientX, e.clientY)}
      style={{ "--glow": ACCENT[accent] } as React.CSSProperties}
      className={cn("glow-card group/glow relative overflow-hidden rounded-2xl border bg-card p-5 shadow-xs", className)}
    >
      <div aria-hidden className="glow-card__halo pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── Chiffre qui compte jusqu'à sa valeur ─────────────────────────────────── */
export function AnimatedNumber({ value, format = (n) => formatNumber(Math.round(n)), duration = 700 }: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { from.current = value; setShown(value); return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min((t - start) / duration, 1);
      const v = a + (value - a) * (1 - Math.pow(1 - k, 3));
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span className="tabular-nums">{format(shown)}</span>;
}

export function LiveBadge({ on }: { on: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium", on ? "bg-leman-soft text-leman" : "bg-subtle text-muted-foreground")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", on ? "live-dot bg-leman" : "bg-muted-foreground")} aria-hidden />
      {on ? "En direct" : "Hors ligne"}
    </span>
  );
}
