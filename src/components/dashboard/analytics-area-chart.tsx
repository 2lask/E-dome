"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

/* Adapte d'AnalyticsChart (shadcn-admin) : 2 series Area (primary +
   muted-foreground) sur 7 jours. Pour E-Dome on l'utilise pour
   visualiser "Reservations vs Vues" sur la semaine. */

interface AnalyticsAreaChartProps {
  data: { label: string; series1: number; series2: number }[];
  series1Label?: string;
  series2Label?: string;
  height?: number;
}

export function AnalyticsAreaChart({
  data,
  height = 300,
}: AnalyticsAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
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
        />
        <Area
          type="monotone"
          dataKey="series1"
          stroke="currentColor"
          className="text-primary"
          fill="currentColor"
          fillOpacity={0.15}
        />
        <Area
          type="monotone"
          dataKey="series2"
          stroke="currentColor"
          className="text-muted-foreground"
          fill="currentColor"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
