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
  as: Comp = "div",
  label,
}: {
  accent?: keyof typeof ACCENT;
  className?: string;
  children: React.ReactNode;
  /** Élément rendu (une section titrée reste une <section>). */
  as?: "div" | "section" | "article";
  label?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const move = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${x - r.left}px`);
    el.style.setProperty("--gy", `${y - r.top}px`);
  };
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      aria-label={label}
      onPointerMove={(e: React.PointerEvent) => move(e.clientX, e.clientY)}
      style={{ "--glow": ACCENT[accent] } as React.CSSProperties}
      className={cn(
        "glow-card group/glow relative overflow-hidden rounded-[1.25rem] border bg-card p-5 sm:p-6",
        "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--foreground)_2.5%,var(--card)),var(--card)_42%)]",
        "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.06)]",
        className,
      )}
    >
      <div aria-hidden className="glow-card__halo pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100" />
      {/* Filet de lumière sur l'arête haute : laiton pour ce qui rapporte. */}
      <div aria-hidden className={cn("pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
        accent === "laiton" ? "via-laiton/70" : "via-foreground/15")} />
      <div className="relative h-full">{children}</div>
    </Comp>
  );
}

/* En-tête de carte : pastille d'icône, titre, sous-titre, action à droite. */
export function CardHead({ icon: Icon, title, sub, action, gold = false, className }: {
  icon?: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  gold?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2", className)}>
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className={cn("v3-icon h-9 w-9 rounded-[0.7rem]", gold && "v3-icon--gold")}>
            <Icon className="h-[17px] w-[17px]" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold leading-tight tracking-[-0.01em]">{title}</h2>
          {sub && <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {action}
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
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-medium",
      on ? "border-leman/30 bg-leman-soft text-leman" : "border-transparent bg-subtle text-muted-foreground")}>
      <span className="relative flex h-2 w-2" aria-hidden>
        {on && <span className="absolute inset-0 rounded-full bg-leman/60 motion-safe:animate-ping" />}
        <span className={cn("relative h-2 w-2 rounded-full", on ? "bg-leman shadow-[0_0_8px_var(--leman)]" : "bg-muted-foreground")} />
      </span>
      {on ? "En direct" : "Hors ligne"}
    </span>
  );
}
