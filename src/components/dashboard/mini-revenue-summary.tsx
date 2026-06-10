import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { dashboard } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* MiniRevenueSummary : la home AVAIT un grand SalesAreaChart 12 mois
   + objectif. C'est de l'analyse, pas du resume. Maintenant on
   affiche : chiffre du mois + sparkline 12 mois + lien -> Revenus.
   La page Revenus reste la pour le filtre profond. */

export function MiniRevenueSummary() {
  const { monthlyRevenue, kpis } = dashboard;

  const current = monthlyRevenue[monthlyRevenue.length - 1].value;
  const previous = monthlyRevenue[monthlyRevenue.length - 2].value;
  const delta = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  const max = Math.max(...monthlyRevenue.map((m) => m.value));
  const min = Math.min(...monthlyRevenue.map((m) => m.value));
  const range = max - min || 1;
  const w = 280;
  const h = 60;
  const points = monthlyRevenue
    .map(
      (m, i) =>
        `${(i / (monthlyRevenue.length - 1)) * w},${h - ((m.value - min) / range) * h}`,
    )
    .join(" ");

  const lastX = w;
  const lastY = h - ((current - min) / range) * h;

  return (
    <Card>
      <CardContent className="p-5">
        <Link href="/dashboard/revenus" className="group block">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Revenus du mois</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tabular-nums">
                  {formatNumber(current)}
                </span>
                <span className="text-sm text-muted-foreground">CHF</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <span
                  className={
                    delta >= 0
                      ? "chip-success-soft rounded-md px-1.5 py-0.5 font-medium inline-flex items-center gap-1"
                      : "chip-danger-soft rounded-md px-1.5 py-0.5 font-medium inline-flex items-center gap-1"
                  }
                >
                  <TrendingUp className="h-3 w-3" />
                  {delta >= 0 ? "+" : ""}
                  {delta.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs mois passé</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>

          <div className="mt-4">
            <svg
              viewBox={`0 0 ${w} ${h}`}
              className="h-14 w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={`0,${h} ${points} ${w},${h}`}
                fill="url(#sparkGrad)"
                stroke="none"
              />
              <polyline
                points={points}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={lastX} cy={lastY} r={3} fill="var(--primary)" />
            </svg>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>{monthlyRevenue[0].label}</span>
              <span className="font-medium text-foreground">
                {monthlyRevenue[monthlyRevenue.length - 1].label}
              </span>
            </div>
          </div>

          <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
            Voir le détail
            <ArrowRight className="h-3 w-3" />
          </p>
        </Link>
        {/* Reference muet a kpis pour eviter import inutilise si on
            decide de logguer le delta principal. */}
        <span className="hidden" aria-hidden>
          {kpis.revenue}
        </span>
      </CardContent>
    </Card>
  );
}
