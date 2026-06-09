"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── RevenueChart — version monochrome refonte ─────────────────────────
   Conformement au brief utilisateur :
   - Graphe en BARRES monochrome (avant: AreaChart avec 2 couleurs + gradients).
   - Toutes les barres en gris discret (var(--text-muted)) sauf le mois
     courant accentue en foreground (var(--foreground)).
   - PAS d'ombres, PAS de degrades. Aspect Linear/Vercel : fonds neutre,
     grille tres atenuee horizontale, axes tickless.
   - Tooltip minimaliste avec montants formates fr-CH/CHF.
   - tabular-nums dans le tooltip pour alignement des chiffres.
   ─────────────────────────────────────────────────────────────────── */

export interface RevenueDataPoint {
  /** Label du mois affiche en X (ex: "Jan", "Fev"). */
  month: string;
  /** Montant des revenus du mois (CHF). */
  revenus: number;
}

export interface RevenueChartProps {
  data: RevenueDataPoint[];
  /** Index du mois courant a accentuer (defaut : dernier element). */
  currentMonthIndex?: number;
  /** Hauteur du graphe en px (defaut 280). */
  height?: number;
}

const formatCHF = (n: number) =>
  new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(n);

/* Compact axis tick : 4'200 → 4.2k pour eviter la pollution visuelle des
   gros nombres sur l'axe Y. */
const formatTick = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: RevenueDataPoint }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs"
      style={{
        background: "var(--card)",
        borderColor: "var(--card-border)",
        color: "var(--foreground)",
      }}
    >
      <p
        className="font-medium mb-0.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      <p className="tabular-nums" style={{ fontWeight: 500 }}>
        {formatCHF(value)}
      </p>
    </div>
  );
}

export function MonochromeRevenueChart({
  data,
  currentMonthIndex,
  height = 280,
}: RevenueChartProps) {
  const activeIndex =
    currentMonthIndex !== undefined ? currentMonthIndex : data.length - 1;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
        barCategoryGap="22%"
      >
        {/* Grille tres atenuee, lignes horizontales uniquement (Linear style) */}
        <CartesianGrid
          strokeDasharray="2 4"
          stroke="var(--card-border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--text-muted)" }}
        />
        <YAxis
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={40}
          tick={{ fill: "var(--text-muted)" }}
          tickFormatter={formatTick}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: "var(--hover-bg)", opacity: 0.4 }}
        />
        <Bar dataKey="revenus" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={
                i === activeIndex ? "var(--foreground)" : "var(--text-muted)"
              }
              fillOpacity={i === activeIndex ? 1 : 0.55}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
