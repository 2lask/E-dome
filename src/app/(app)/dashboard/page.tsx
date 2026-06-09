"use client";

import Link from "next/link";
import { Download, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { MetricsOverview } from "@/components/dashboard/metrics-overview";
import { MetricsSecondary } from "@/components/dashboard/metrics-secondary";
import { SalesAreaChart } from "@/components/dashboard/sales-area-chart";
import { RevenueBreakdown } from "@/components/dashboard/revenue-breakdown";
import { TopProperties } from "@/components/dashboard/top-properties";
import { TopFormations } from "@/components/dashboard/top-formations";
import { BookingsList } from "@/components/dashboard/bookings-list";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { BoutiqueAlerts } from "@/components/dashboard/boutique-alerts";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { AnalyticsAreaChart } from "@/components/dashboard/analytics-area-chart";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import { dashboard, referralChannels } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* Vue d'ensemble dashboard — refonte MULTI-SOURCE.
   Structure pensee pour densifier l'ecran (max-w-[1680px]) :
   - 4 KPI premium (CA total, annonces actives, note pond., previs 30j)
   - 4 mini KPI (reservations, commissions, occupation, lives a venir)
   - Tab Overview : grid 12-col
     · row 1 : SalesAreaChart col-8 + RevenueBreakdown col-4
     · row 2 : TopProperties col-6 + TopFormations col-6
     · row 3 : UpcomingEvents col-6 + BoutiqueAlerts col-6
     · row 4 : BookingsList col-8 + Objectifs col-4
   - Tab Analytics : trafic + canaux + sources
   Couverture multi-source : 7/7 (avant : 2/7). */

const ANALYTICS_WEEK = [
  { label: "Lun", series1: 142, series2: 98 },
  { label: "Mar", series1: 178, series2: 112 },
  { label: "Mer", series1: 156, series2: 102 },
  { label: "Jeu", series1: 224, series2: 148 },
  { label: "Ven", series1: 268, series2: 174 },
  { label: "Sam", series1: 312, series2: 218 },
  { label: "Dim", series1: 286, series2: 196 },
];

export default function DashboardOverviewPage() {
  const { objectives } = dashboard;

  const topChannels = [...referralChannels]
    .sort((a, b) => b.conversions - a.conversions)
    .map((c) => ({ name: c.label, value: c.conversions }));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble multi-revenus : biens, formations, boutique, événements, services & apporteurs"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" asChild>
              <Link href="/publier">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle annonce
              </Link>
            </Button>
          </>
        }
      />

      {/* 4 KPI cards premium multi-source */}
      <MetricsOverview />

      {/* 4 mini KPI secondaires actionnables */}
      <MetricsSecondary />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ─── VUE D'ENSEMBLE ─────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          {/* Row 1 : Chart 12 mois + Mix multi-source */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SalesAreaChart />
            </div>
            <div className="lg:col-span-4">
              <RevenueBreakdown />
            </div>
          </div>

          {/* Row 2 : Top biens + Top formations */}
          <div className="grid gap-6 md:grid-cols-2">
            <TopProperties />
            <TopFormations />
          </div>

          {/* Row 3 : Prochainement + Alertes boutique */}
          <div className="grid gap-6 md:grid-cols-2">
            <UpcomingEvents />
            <BoutiqueAlerts />
          </div>

          {/* Row 4 : Réservations récentes + Objectifs */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <BookingsList limit={5} />
            </div>
            <div className="lg:col-span-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Objectifs du mois</CardTitle>
                  <CardDescription>Progression vers vos cibles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressRow
                    label="Revenus"
                    current={objectives.revenue.current}
                    target={objectives.revenue.target}
                    display={`${formatNumber(objectives.revenue.current)} / ${formatNumber(objectives.revenue.target)} CHF`}
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
                  <ProgressRow
                    label="Diversification"
                    current={objectives.diversification.current}
                    target={objectives.diversification.target}
                    display={`${objectives.diversification.current} / ${objectives.diversification.target} sources`}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── ANALYTICS ──────────────────────────────────── */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trafic hebdomadaire</CardTitle>
              <CardDescription>
                Vues uniques vs visiteurs sur 7 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <AnalyticsAreaChart data={ANALYTICS_WEEK} />
            </CardContent>
          </Card>

          <KpiGrid>
            <KpiCardPremium
              label="Vues totales"
              value="1 566"
              delta="+12.4%"
              trend="up"
              footer="Trafic en hausse"
              subfooter="Vs semaine dernière"
            />
            <KpiCardPremium
              label="Visiteurs uniques"
              value="1 048"
              delta="+5.8%"
              trend="up"
              footer="Audience qualifiée"
              subfooter="Vs semaine dernière"
            />
            <KpiCardPremium
              label="Taux de conversion"
              value="4.2%"
              delta="-0.3%"
              trend="down"
              footer="Légère baisse"
              subfooter="À surveiller cette semaine"
            />
            <KpiCardPremium
              label="Durée moyenne"
              value="3m 24s"
              delta="+18s"
              trend="up"
              footer="Engagement accru"
              subfooter="Vs semaine dernière"
            />
          </KpiGrid>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Canaux apporteurs</CardTitle>
                <CardDescription>Conversions par canal ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarList
                  items={topChannels}
                  valueFormatter={(n) => `${n} conv.`}
                  barClass="bg-primary"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sources de trafic</CardTitle>
                <CardDescription>D&apos;où viennent vos visiteurs</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarList
                  items={[
                    { name: "Direct", value: 612 },
                    { name: "Recherche organique", value: 348 },
                    { name: "Réseaux sociaux", value: 218 },
                    { name: "Liens d'apporteurs", value: 138 },
                    { name: "Newsletter", value: 67 },
                  ]}
                  valueFormatter={(n) => `${formatNumber(n)} visites`}
                  barClass="bg-muted-foreground"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* Ligne de progression vers un objectif. Brutalist : pas de
   rounded-full sur la barre — rectangle strict comme tout le reste. */
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
  const reached = pct >= 100;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{display}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={
            reached ? "h-full bg-success rounded-full" : "h-full bg-primary rounded-full"
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
