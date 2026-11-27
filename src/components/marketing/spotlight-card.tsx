"use client";

import { useRef } from "react";

/* ── Carte à halo qui suit le pointeur ───────────────────────────────────────
   `tone="cine"` : carte sombre des bandeaux cinématiques (classe .cine-card).
   `tone="theme"` : carte qui suit le thème clair ou sombre, halo laiton.
   Le halo ne fait que changer d'opacité ; sa position suit des variables CSS. */

export function SpotlightCard({
  children,
  className = "",
  tone = "theme",
  gold = false,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "cine" | "theme";
  gold?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const base =
    tone === "cine"
      ? "cine-card"
      : `group/spot relative overflow-hidden rounded-3xl border transition-[transform,border-color] duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
          gold
            ? "border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/30 to-card hover:border-laiton"
            : "bg-card hover:border-foreground/20"
        } before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_oklab,var(--laiton)_16%,transparent),transparent_45%)]`;
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`${base} ${className}`}
    >
      {children}
    </div>
  );
}
