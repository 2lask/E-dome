import { TrendingUp, Wallet, Clock, Trophy, Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { KpiCardIcon } from "@/components/dashboard/kpi-card-icon";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import {
  referralChannels,
  leaderboard,
  apporteurSummary,
} from "@/lib/dashboard-data";

/* Refonte Apporteurs : pattern shadcn-admin + brutalist.
   - 4 KPI cards (Commissions mois / Deja verse / En attente /
     Conversions totales)
   - 2 cols : SimpleBarList canaux + Leaderboard
   - Lien d'affiliation copiable */

const REFERRAL_LINK = "https://e-dome.ch/r/LEO2026";

export default function ApporteursPage() {
  const totalConversions = referralChannels.reduce(
    (s, c) => s + c.conversions,
    0,
  );
  const totalClicks = referralChannels.reduce((s, c) => s + c.clicks, 0);
  const conversionRate = (totalConversions / Math.max(1, totalClicks)) * 100;

  const byChannel = [...referralChannels]
    .sort((a, b) => b.conversions - a.conversions)
    .map((c) => ({ name: c.label, value: c.conversions }));

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Apporteurs</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Vos commissions de recommandation · suivi des canaux et classement
          </p>
        </div>
      </div>

      {/* 4 KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardIcon
          title="Commissions du mois"
          value={`${formatNumber(apporteurSummary.earnedThisMonth)} CHF`}
          delta="+26% vs mois dernier"
          icon={TrendingUp}
        />
        <KpiCardIcon
          title="Déjà versé"
          value={`${formatNumber(apporteurSummary.alreadyPaid)} CHF`}
          delta="Virements honorés"
          icon={Wallet}
          deltaTone="up"
        />
        <KpiCardIcon
          title="En attente"
          value={`${formatNumber(apporteurSummary.pending)} CHF`}
          delta="Versement sous 7 jours"
          icon={Clock}
          deltaTone="neutral"
        />
        <KpiCardIcon
          title="Taux de conversion"
          value={`${conversionRate.toFixed(1)}%`}
          delta={`${totalConversions} / ${totalClicks} clics`}
          icon={Trophy}
          deltaTone="neutral"
        />
      </div>

      {/* Lien d'affiliation copiable */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Votre lien</CardTitle>
          <CardDescription>
            Partagez ce lien pour générer des commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={REFERRAL_LINK}
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm font-mono outline-none"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigator.clipboard?.writeText(REFERRAL_LINK)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canaux + Leaderboard */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Canaux de recommandation</CardTitle>
            <CardDescription>
              Performance par type de cible · {totalConversions} conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {referralChannels.map((c) => {
              const pct =
                c.clicks === 0
                  ? 0
                  : Math.round((c.conversions / c.clicks) * 100);
              return (
                <div key={c.id}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <div>
                      <span className="font-medium">{c.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {c.reward}
                      </span>
                    </div>
                    <div className="tabular-nums">
                      <span className="font-medium">{c.conversions}</span>
                      <span className="text-muted-foreground"> / {c.clicks}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {pct}%
                      </span>
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

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Classement du mois</CardTitle>
            <CardDescription>Top apporteurs par commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={leaderboard.map((e) => ({
                name: e.isCurrentUser ? `${e.name} (vous)` : e.name,
                value: e.commission,
              }))}
              valueFormatter={(n) => `${formatNumber(n)} CHF`}
              barClass="bg-primary"
            />
            {/* Tableau des rangs en dessous, plus compact */}
            <div className="mt-4 space-y-1.5 border-t pt-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1 text-xs",
                    entry.isCurrentUser && "bg-muted font-medium",
                  )}
                >
                  <span className="w-5 shrink-0 text-center font-mono text-muted-foreground">
                    #{entry.rank}
                  </span>
                  <Avatar name={entry.name} size="xs" />
                  <span className="min-w-0 flex-1 truncate">
                    {entry.isCurrentUser ? `${entry.name} (vous)` : entry.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By channel SimpleBarList comparatif */}
      <Card>
        <CardHeader>
          <CardTitle>Conversions par canal</CardTitle>
          <CardDescription>Vue d&apos;ensemble simplifiée</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleBarList
            items={byChannel}
            valueFormatter={(n) => `${n} conv.`}
            barClass="bg-muted-foreground"
          />
        </CardContent>
      </Card>
    </div>
  );
}
