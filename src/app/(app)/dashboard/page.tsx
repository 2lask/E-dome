import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { dashboard } from "@/lib/dashboard-data";
import { formatNumber, formatPercent } from "@/lib/format";

const PERIODS = ["7j", "30j", "12m"] as const;
const ACTIVE_PERIOD = "30j";

function ProgressRow({
  label,
  current,
  target,
  display,
}: {
  label: string;
  current: number;
  target: number;
  display: string;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{display}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { kpis, monthlyRevenue, objectives, transactions } = dashboard;

  return (
    <div className="space-y-6">
      {/* En-tete de section + selecteur de periode */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-medium">Vue d&apos;ensemble</h1>
        <div className="flex gap-0.5 rounded-md bg-muted p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              className={
                p === ACTIVE_PERIOD
                  ? "rounded-[6px] bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                  : "rounded-[6px] px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chiffre heros */}
      <div>
        <p className="mb-1 text-sm text-muted-foreground">Revenus · 30 derniers jours</p>
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="text-4xl font-medium tracking-tight tabular-nums">
            {formatNumber(kpis.revenue)}
          </span>
          <span className="text-base text-muted-foreground">CHF</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            {kpis.revenueDelta}
          </span>
        </div>
      </div>

      {/* KPIs secondaires */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard label="Réservations" value={formatNumber(kpis.reservations)} delta={kpis.reservationsDelta} />
        <StatCard label="Commissions" value={formatNumber(kpis.commissions)} unit="CHF" delta={kpis.commissionsDelta} />
        <StatCard label="Taux d'occupation" value={formatPercent(kpis.occupancy)} delta={kpis.occupancyDelta} />
        <StatCard label="Note moyenne" value={kpis.rating.toFixed(1)} unit="/ 5" deltaTone="neutral" />
      </div>

      {/* Graphe revenus */}
      <Card>
        <CardHeader className="flex-row items-baseline justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus mensuels</CardTitle>
          <span className="font-mono text-[11px] text-muted-foreground">12 mois · BP-REV · CHF</span>
        </CardHeader>
        <CardContent>
          <RevenueChart data={monthlyRevenue} target={objectives.revenue.target} />
        </CardContent>
      </Card>

      {/* Transactions + objectifs */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Transactions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Objectifs du mois</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <ProgressRow
              label="Revenus"
              current={objectives.revenue.current}
              target={objectives.revenue.target}
              display={`${formatNumber(objectives.revenue.current)} / ${formatNumber(objectives.revenue.target)}`}
            />
            <ProgressRow
              label="Réservations"
              current={objectives.reservations.current}
              target={objectives.reservations.target}
              display={`${objectives.reservations.current} / ${objectives.reservations.target}`}
            />
            <ProgressRow
              label="Note moyenne"
              current={objectives.rating.current}
              target={objectives.rating.target}
              display={`${objectives.rating.current} / ${objectives.rating.target}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
