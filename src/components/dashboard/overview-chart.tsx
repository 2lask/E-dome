"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

/* Adapte d'Overview (shadcn-admin) : BarChart Recharts avec barres en
   fill-primary (var(--primary) — l'accent orange brutaliste). Format
   CHF avec apostrophe suisse pour les ticks Y. */

interface OverviewChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

function formatTick(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
  return String(v);
}

export function OverviewChart({ data, height = 350 }: OverviewChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <XAxis
          dataKey="label"
          stroke="currentColor"
          className="text-muted-foreground"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="currentColor"
          className="text-muted-foreground"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatTick}
          width={40}
        />
        <Bar
          dataKey="value"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
