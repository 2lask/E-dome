"use client";

import { Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import { Progress } from "@/components/ui/progress";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import {
  referralChannels,
  leaderboard,
  apporteurSummary,
} from "@/lib/dashboard-data";

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
    <div className="space-y-6">
      <DashboardPageHeader
        title="Apporteurs"
        description="Vos commissions de recommandation · suivi des canaux et classement"
      />

      <KpiGrid>
        <KpiCardPremium
          label="Commissions du mois"
          value={`${formatNumber(apporteurSummary.earnedThisMonth)} CHF`}
          delta="+26%"
          trend="up"
          footer="En forte hausse"
          subfooter="Versées + en attente ce mois"
        />
        <KpiCardPremium
          label="Déjà versé"
          value={`${formatNumber(apporteurSummary.alreadyPaid)} CHF`}
          delta={`${Math.round((apporteurSummary.alreadyPaid / apporteurSummary.earnedThisMonth) * 100)}%`}
          trend="up"
          footer="Virements honorés"
          subfooter="Sous 7 jours après conversion"
        />
        <KpiCardPremium
          label="En attente"
          value={`${formatNumber(apporteurSummary.pending)} CHF`}
          delta="Sous 7j"
          trend="neutral"
          footer="Prochains virements"
          subfooter="Versements automatiques"
        />
        <KpiCardPremium
          label="Taux de conversion"
          value={`${conversionRate.toFixed(1)}%`}
          delta={`${totalConversions}/${totalClicks}`}
          trend="neutral"
          footer="Conversions sur clics"
          subfooter="Tous canaux confondus"
        />
      </KpiGrid>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Votre lien de recommandation</CardTitle>
          <CardDescription>
            Partagez ce lien pour générer des commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input readOnly value={REFERRAL_LINK} className="flex-1 font-mono" />
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Canaux de recommandation</CardTitle>
            <CardDescription>
              Performance par type · {totalConversions} conversions
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
                  <Progress value={pct} className="h-1.5" />
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
