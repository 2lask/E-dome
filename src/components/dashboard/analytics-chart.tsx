"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/format";
import type { ChartSeries, Category } from "@/lib/revenue-data";

export type ChartMode = "evolution" | "comparison" | "repartition";
export type ChartVisual = "bar" | "line";

/* useDark : detecte la presence de la classe "dark" sur <html> via
   MutationObserver. Permet d'adapter dynamiquement les couleurs des
   ticks et de la grille Recharts. */
function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

interface Props {
  mode: ChartMode;
  visual: ChartVisual;
  labels: string[];
  series: ChartSeries[];
  categories: Category[];
}

export function AnalyticsChart({
  mode,
  visual,
  labels,
  series,
  categories,
}: Props) {
  const dark = useDark();
  const tick = dark ? "#94a3b8" : "#64748b";
  const grid = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const tip = {
    backgroundColor: dark ? "#1c1c1c" : "#ffffff",
    border: "0.5px solid " + (dark ? "#333" : "#d1d5db"),
    borderRadius: "8px",
    fontSize: "12px",
  } as React.CSSProperties;
  /* Tooltip formatter de Recharts attend ValueType (number | string |
     Array | undefined). On normalise au cast number. */
  const fmt = (v: unknown): string => {
    const n = typeof v === "number" ? v : Number(v);
    return formatNumber(Number.isFinite(n) ? n : 0) + " CHF";
  };

  if (mode === "repartition") {
    return (
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={1}
            >
              {categories.map((c, i) => (
                <Cell key={i} fill={c.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip formatter={fmt} contentStyle={tip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (mode === "comparison") {
    const data = categories.map((c) => ({ label: c.label, value: c.value }));
    return (
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          {visual === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="label" stroke={tick} fontSize={11} />
              <YAxis
                stroke={tick}
                fontSize={11}
                tickFormatter={(v: number) => formatNumber(v)}
              />
              <Tooltip formatter={fmt} contentStyle={tip} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={categories[0]?.color || "#185FA5"}
                strokeWidth={2}
                dot
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="label" stroke={tick} fontSize={11} />
              <YAxis
                stroke={tick}
                fontSize={11}
                tickFormatter={(v: number) => formatNumber(v)}
              />
              <Tooltip
                formatter={fmt}
                contentStyle={tip}
                cursor={{ fill: "rgba(125,125,125,0.08)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={categories[i].color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  }

  const data = labels.map((l, i) => {
    const o: Record<string, string | number> = { label: l };
    series.forEach((s) => {
      o[s.key] = s.data[i];
    });
    return o;
  });
  const single = series.length === 1;
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        {visual === "line" ? (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="label" stroke={tick} fontSize={11} />
            <YAxis
              stroke={tick}
              fontSize={11}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <Tooltip formatter={fmt} contentStyle={tip} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="label" stroke={tick} fontSize={11} />
            <YAxis
              stroke={tick}
              fontSize={11}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <Tooltip
              formatter={fmt}
              contentStyle={tip}
              cursor={{ fill: "rgba(125,125,125,0.08)" }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                stackId="a"
                fill={s.color}
                radius={single ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
