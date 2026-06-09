import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import {
  referralChannels,
  leaderboard,
  apporteurSummary,
} from "@/lib/dashboard-data";

export default function ApporteursPage() {
  const conversionRate = (channel: { clicks: number; conversions: number }) =>
    channel.clicks === 0 ? 0 : (channel.conversions / channel.clicks) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Apporteurs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Vos commissions de plateforme · suivi des recommandations
        </p>
      </div>

      {/* Resume du mois */}
      <div>
        <p className="mb-1 text-sm text-muted-foreground">Commissions du mois</p>
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="text-3xl font-medium tracking-tight tabular-nums">
            {formatNumber(apporteurSummary.earnedThisMonth)}
          </span>
          <span className="text-sm text-muted-foreground">CHF</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            +26%
          </span>
        </div>
      </div>

      {/* KPI : deja paye / en attente */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          label="Déjà versé"
          value={formatNumber(apporteurSummary.alreadyPaid)}
          unit="CHF"
          deltaTone="neutral"
        />
        <StatCard
          label="En attente"
          value={formatNumber(apporteurSummary.pending)}
          unit="CHF"
          deltaTone="neutral"
        />
      </div>

      {/* Canaux de referral */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Canaux de recommandation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3.5">
          {referralChannels.map((c) => {
            const pct = conversionRate(c);
            return (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-baseline justify-between text-sm">
                  <div>
                    <p className="font-medium">{c.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.reward}</p>
                  </div>
                  <div className="text-right tabular-nums">
                    <p>
                      <span className="font-medium">{c.conversions}</span>
                      <span className="text-muted-foreground"> / {c.clicks}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{pct.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Classement */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Classement du mois</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                entry.isCurrentUser && "bg-muted font-medium",
              )}
            >
              <span className="w-6 shrink-0 text-center text-xs font-mono text-muted-foreground">
                #{entry.rank}
              </span>
              <span className="min-w-0 flex-1 truncate">{entry.name}</span>
              <span className="shrink-0 tabular-nums">
                {formatNumber(entry.commission)}{" "}
                <span className="text-xs font-normal text-muted-foreground">CHF</span>
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
