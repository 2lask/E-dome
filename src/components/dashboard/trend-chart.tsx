"use client";

import { useState } from "react";
import type { DayPoint } from "@/lib/dashboard-stats";

/* ── Courbe vues + leads, interactive ────────────────────────────────────────
   Deux séries sur la période (vues en aire, leads en barres), lissées, avec
   une info-bulle au survol (ou au doigt). Échelles indépendantes : on lit la
   tendance de chacune. */

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const dayLabel = (d: string) => { const [, m, j] = d.split("-").map(Number); return `${j} ${MOIS[m - 1]}`; };

function smooth(pts: { x: number; y: number }[]) {
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const mid = (prev.x + p.x) / 2;
    return `${d} C ${mid} ${prev.y}, ${mid} ${p.y}, ${p.x} ${p.y}`;
  }, "");
}

export function TrendChart({ series, viewsLabel = "Vues", leadsLabel = "Leads" }: { series: DayPoint[]; viewsLabel?: string; leadsLabel?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = series.length;
  const maxV = Math.max(1, ...series.map((s) => s.views));
  const maxL = Math.max(1, ...series.map((s) => s.leads));
  const pts = series.map((s, i) => ({ x: n === 1 ? 50 : (i / (n - 1)) * 100, y: 92 - (s.views / maxV) * 80 }));
  const line = smooth(pts);
  const area = `${line} L 100 100 L 0 100 Z`;
  const idx = hover ?? n - 1;

  const onMove = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setHover(Math.round(Math.min(Math.max((clientX - r.left) / r.width, 0), 1) * (n - 1)));
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-4 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-leman/70" aria-hidden />{viewsLabel}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-laiton" aria-hidden />{leadsLabel}</span>
      </div>
      <div
        className="relative h-48 cursor-crosshair touch-none sm:h-56"
        onPointerMove={(e) => onMove(e.clientX, e.currentTarget)}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`${viewsLabel} et ${leadsLabel} par jour : ${series.map((s) => `${dayLabel(s.day)} ${s.views} / ${s.leads}`).join(", ")}`}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--leman)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--leman)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          ))}
          {series.map((s, i) => {
            const w = Math.max(0.6, 60 / n);
            const h = (s.leads / maxL) * 38;
            return s.leads > 0 ? (
              <rect key={s.day} x={(n === 1 ? 50 : (i / (n - 1)) * 100) - w / 2} y={100 - h} width={w} height={h} rx="0.6" fill="var(--laiton)" opacity={i === idx ? 1 : 0.55} />
            ) : null;
          })}
          <path d={area} fill="url(#trend-fill)" />
          <path d={line} fill="none" stroke="var(--leman)" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {hover !== null && (
            <line x1={pts[hover].x} x2={pts[hover].x} y1="0" y2="100" stroke="var(--leman)" strokeOpacity="0.35" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
        <span aria-hidden className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-leman shadow-[0_0_0_4px_color-mix(in_oklab,var(--leman)_25%,transparent)]"
          style={{ left: `${pts[idx]?.x ?? 0}%`, top: `${pts[idx]?.y ?? 0}%` }} />
        {hover !== null && series[hover] && (
          <div aria-hidden className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border bg-card/95 px-2.5 py-1.5 text-[12px] shadow-lg backdrop-blur"
            style={{ left: `clamp(56px, ${pts[hover].x}%, calc(100% - 56px))`, top: `calc(${pts[hover].y}% - 12px)` }}>
            <p className="text-muted-foreground">{dayLabel(series[hover].day)}</p>
            <p className="font-medium tabular-nums">{series[hover].views} {viewsLabel.toLowerCase()} · {series[hover].leads} {leadsLabel.toLowerCase()}</p>
          </div>
        )}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
        <span>{series[0] ? dayLabel(series[0].day) : ""}</span>
        <span>aujourd&apos;hui</span>
      </div>
    </div>
  );
}
