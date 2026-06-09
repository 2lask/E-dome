import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboard } from "@/lib/dashboard-data";
import { formatNumber, formatCHF } from "@/lib/format";

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">{formatNumber(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RevenusPage() {
  const { properties, revenueByType, kpis } = dashboard;
  const maxProperty = Math.max(...properties.map((p) => p.monthRevenue));
  const total = kpis.revenue;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Revenus</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Détail des 30 derniers jours · CHF
        </p>
      </div>

      <div className="flex flex-wrap items-baseline gap-2.5">
        <span className="text-3xl font-medium tracking-tight tabular-nums">
          {formatNumber(total)}
        </span>
        <span className="text-sm text-muted-foreground">CHF</span>
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          {kpis.revenueDelta}
        </span>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Par bien</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {properties.map((p) => (
            <BarRow key={p.id} label={p.name} value={p.monthRevenue} max={maxProperty} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Par type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {revenueByType.map((t) => (
            <div key={t.label} className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">{t.label}</span>
              <span className="tabular-nums">{formatCHF(t.value)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
