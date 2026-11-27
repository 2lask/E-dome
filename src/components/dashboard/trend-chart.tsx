"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { DayPoint } from "@/lib/dashboard-stats";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Courbe vues + leads, interactive ────────────────────────────────────────
   Dessinée en pixels réels (ResizeObserver) : la courbe n'est jamais étirée,
   le point final reste rond. Vues en aire dégradée (courbe monotone : jamais
   de creux inventé entre deux jours), leads en barres laiton sur leur propre
   échelle. Info-bulle au survol, au doigt ou au clavier (flèches). Seuls
   transform et opacity sont animés. */

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
export const dayLabel = (d: string) => { const [, m, j] = d.split("-").map(Number); return `${j} ${MOIS[m - 1]}`; };

type Pt = { x: number; y: number };

/* Interpolation monotone (Fritsch–Carlson) : lisse sans dépasser les valeurs. */
export function monotonePath(pts: Pt[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pts[0].x} ${pts[0].y}`;
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    m.push(dx === 0 ? 0 : (pts[i + 1].y - pts[i].y) / dx);
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const p = pts[i], q = pts[i + 1], dx = (q.x - p.x) / 3;
    d += ` C ${p.x + dx} ${p.y + t[i] * dx}, ${q.x - dx} ${q.y - t[i + 1] * dx}, ${q.x} ${q.y}`;
  }
  return d;
}

/* Échelle « ronde » : 0, 5, 10, 15… ou 0, 25, 50… */
function niceMax(v: number, ticks = 4) {
  if (v <= ticks) return ticks;
  const raw = v / ticks;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = (pow >= 10 ? [1, 2, 2.5, 5, 10] : [1, 2, 5, 10]).map((k) => k * pow).find((s) => s >= raw) ?? 10 * pow;
  return step * ticks;
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

const PAD = { l: 34, r: 14, t: 18, b: 28 };

export function TrendChart({ series, viewsLabel = "Vues", leadsLabel = "Leads" }: { series: DayPoint[]; viewsLabel?: string; leadsLabel?: string }) {
  const uid = useId().replace(/:/g, "");
  const [ref, { w, h }] = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const n = series.length;
  const totalV = series.reduce((s, p) => s + p.views, 0);
  const totalL = series.reduce((s, p) => s + p.leads, 0);
  const maxV = niceMax(Math.max(0, ...series.map((s) => s.views)));
  const maxL = Math.max(1, ...series.map((s) => s.leads));
  const empty = totalV === 0 && totalL === 0;

  const iw = Math.max(0, w - PAD.l - PAD.r);
  const ih = Math.max(0, h - PAD.t - PAD.b);
  const xOf = (i: number) => PAD.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const yOf = (v: number) => PAD.t + ih - (v / maxV) * ih;
  const pts = series.map((s, i) => ({ x: xOf(i), y: yOf(s.views) }));
  const line = monotonePath(pts);
  const base = PAD.t + ih;
  const area = pts.length ? `${line} L ${pts[pts.length - 1].x} ${base} L ${pts[0].x} ${base} Z` : "";
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => Math.round(maxV * k));
  const xTicks = n > 1
    ? Array.from(new Set(iw < 420 ? [0, Math.round((n - 1) * 0.5), n - 1] : [0, Math.round((n - 1) * 0.25), Math.round((n - 1) * 0.5), Math.round((n - 1) * 0.75), n - 1]))
    : [0];
  const barW = Math.max(3, Math.min(14, (iw / Math.max(1, n)) * 0.42));
  const idx = hover ?? n - 1;
  const last = pts[n - 1];
  const at = series[idx];
  const atPt = pts[idx];

  const fromPointer = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const k = (clientX - r.left - PAD.l) / Math.max(1, iw);
    setHover(Math.round(Math.min(Math.max(k, 0), 1) * (n - 1)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const cur = hover ?? n - 1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : cur + (e.key === "ArrowRight" ? 1 : -1);
    setHover(Math.min(n - 1, Math.max(0, next)));
  };

  /* Info-bulle : à gauche du point dans la moitié droite, à droite sinon. */
  const tipLeft = atPt ? (atPt.x > w * 0.6 ? atPt.x - 14 : atPt.x + 14) : 0;
  const tipShift = atPt && atPt.x > w * 0.6 ? "-100%" : "0%";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="h-[3px] w-5 rounded-full bg-leman shadow-[0_0_10px_var(--leman)]" aria-hidden />
          {viewsLabel}
          <span className="font-semibold tabular-nums text-foreground">{formatNumber(totalV)}</span>
        </span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span className="h-3 w-2 rounded-[3px] bg-gradient-to-b from-laiton to-laiton/40" aria-hidden />
          {leadsLabel}
          <span className="font-semibold tabular-nums text-foreground">{formatNumber(totalL)}</span>
        </span>
      </div>
      <div
        ref={ref}
        data-chart="trend"
        tabIndex={0}
        className="relative h-56 cursor-crosshair touch-pan-y select-none rounded-xl outline-offset-4 sm:h-64"
        onPointerMove={(e) => fromPointer(e.clientX, e.currentTarget)}
        onPointerDown={(e) => fromPointer(e.clientX, e.currentTarget)}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={onKey}
        role="img"
        aria-label={`${viewsLabel} et ${leadsLabel.toLowerCase()} par jour : ${series.map((s) => `${dayLabel(s.day)} ${s.views} / ${s.leads}`).join(", ")}. Flèches gauche et droite pour parcourir les jours.`}
      >
        {w > 0 && (
          <svg width={w} height={h} className="absolute inset-0 overflow-visible" aria-hidden>
            <defs>
              <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--leman)" stopOpacity="0.32" />
                <stop offset="70%" stopColor="var(--leman)" stopOpacity="0.06" />
                <stop offset="100%" stopColor="var(--leman)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`bar-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--laiton)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--laiton)" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--leman)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--leman)" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Grille discrète + graduations */}
            {ticks.map((t, i) => (
              <g key={i}>
                <line x1={PAD.l} x2={w - PAD.r} y1={yOf(t)} y2={yOf(t)} stroke="var(--border)" strokeOpacity={i === 0 ? 1 : 0.55} strokeDasharray={i === 0 ? undefined : "3 5"} />
                <text x={PAD.l - 8} y={yOf(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[10.5px] tabular-nums">{formatNumber(t)}</text>
              </g>
            ))}
            {xTicks.map((i) => (
              <text key={i} x={xOf(i)} y={h - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="fill-muted-foreground text-[10.5px]">
                {i === n - 1 ? "Aujourd'hui" : dayLabel(series[i].day)}
              </text>
            ))}

            {/* Leads : barres sur leur propre échelle (40 % de la hauteur) */}
            {series.map((s, i) => {
              if (s.leads <= 0) return null;
              const bh = Math.max(4, (s.leads / maxL) * ih * 0.4);
              return (
                <rect key={s.day} x={xOf(i) - barW / 2} y={base - bh} width={barW} height={bh} rx={Math.min(4, barW / 2)}
                  fill={`url(#bar-${uid})`} opacity={hover === null || i === idx ? 1 : 0.45} />
              );
            })}

            <path d={area} fill={`url(#fill-${uid})`} />
            <path d={line} fill="none" stroke="var(--leman)" strokeOpacity="0.18" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d={line} fill="none" stroke={`url(#stroke-${uid})`} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />

            {hover !== null && atPt && (
              <line x1={atPt.x} x2={atPt.x} y1={PAD.t} y2={base} stroke="var(--foreground)" strokeOpacity="0.22" strokeDasharray="3 3" />
            )}
            {hover !== null && atPt && hover !== n - 1 && (
              <circle cx={atPt.x} cy={atPt.y} r="4.5" fill="var(--card)" stroke="var(--leman)" strokeWidth="2.25" />
            )}
          </svg>
        )}

        {/* Point final, mis en valeur (halo qui pulse si le mouvement est permis) */}
        {last && w > 0 && (
          <span aria-hidden className="pointer-events-none absolute left-0 top-0" style={{ transform: `translate3d(${last.x}px, ${last.y}px, 0)` }}>
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-leman/30 motion-safe:animate-ping" />
            <span className="absolute -left-[7px] -top-[7px] h-3.5 w-3.5 rounded-full border-[2.5px] border-card bg-leman shadow-[0_0_0_4px_color-mix(in_oklab,var(--leman)_22%,transparent),0_0_18px_var(--leman)]" />
            {hover === null && series[n - 1] && (
              <span className={cn("absolute -top-9 whitespace-nowrap rounded-md border border-leman/30 bg-card/90 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-leman shadow-sm backdrop-blur",
                last.x > w - 60 ? "right-0" : "-translate-x-1/2")}>
                {formatNumber(series[n - 1].views)}
              </span>
            )}
          </span>
        )}

        {/* Info-bulle */}
        {hover !== null && at && atPt && (
          <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 transition-transform duration-150 ease-out"
            style={{ transform: `translate3d(${tipLeft}px, ${Math.max(PAD.t, Math.min(atPt.y - 34, h - 96))}px, 0) translateX(${tipShift})` }}>
            <div className="min-w-[148px] rounded-xl border bg-card/95 px-3 py-2.5 text-[12px] shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] backdrop-blur-md">
              <p className="font-medium text-muted-foreground">{hover === n - 1 ? "Aujourd'hui" : dayLabel(at.day)}</p>
              <p className="mt-1.5 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-leman" />{viewsLabel}</span>
                <span className="font-semibold tabular-nums">{formatNumber(at.views)}</span>
              </p>
              <p className="mt-1 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-laiton" />{leadsLabel}</span>
                <span className="font-semibold tabular-nums text-laiton">{formatNumber(at.leads)}</span>
              </p>
            </div>
          </div>
        )}

        {empty && w > 0 && (
          <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[13px] text-muted-foreground">
            Aucune activité sur la période : la courbe se dessine dès la première visite.
          </p>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{hover !== null && at ? `${dayLabel(at.day)} : ${at.views} ${viewsLabel.toLowerCase()}, ${at.leads} ${leadsLabel.toLowerCase()}` : ""}</p>
    </div>
  );
}

/* ── Mini-courbe d'une carte chiffrée (série réelle de la période) ─────────── */
export function Sparkline({ values, tone = "leman", bars = false, className }: { values: number[]; tone?: "leman" | "laiton"; bars?: boolean; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const n = values.length;
  if (n < 2) return null;
  const max = Math.max(1, ...values);
  if (bars) {
    /* Événements rares (leads) : une barre par jour, plutôt qu'une courbe en pics. */
    return (
      <div className={cn("flex h-9 items-end gap-[2px]", className)} aria-hidden>
        {values.map((v, i) => (
          <span key={i} className={cn("flex-1 rounded-[2px]", v > 0 ? (tone === "laiton" ? "bg-laiton" : "bg-gradient-to-t from-laiton/50 to-laiton") : "bg-foreground/10")}
            style={{ height: v > 0 ? `${Math.max(30, (v / max) * 100)}%` : "2px" }} />
        ))}
      </div>
    );
  }
  const pts = values.map((v, i) => ({ x: (i / (n - 1)) * 100, y: 30 - (v / max) * 26 }));
  const line = monotonePath(pts);
  const color = tone === "laiton" ? "var(--laiton)" : "var(--leman)";
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={cn("block h-9 w-full overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id={`sp-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L 100 32 L 0 32 Z`} fill={`url(#sp-${uid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
