"use client";

import { Download, DollarSign, CalendarCheck, Users, Eye, Activity, Timer, MousePointerClick } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCardIcon } from "@/components/dashboard/kpi-card-icon";
import { RecentBookings } from "@/components/dashboard/recent-bookings";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { AnalyticsAreaChart } from "@/components/dashboard/analytics-area-chart";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import {
  dashboard,
  properties as dashboardProperties,
  referralChannels,
} from "@/lib/dashboard-data";
import { formatNumber, formatPercent } from "@/lib/format";

/* Refonte dashboard inspiree de satnaing/shadcn-admin :
   - 2 onglets internes Overview / Analytics (Tabs)
   - KPI cards avec icone discrete a droite (h-4 w-4 muted)
   - BarChart fill-primary radius [4,4,0,0] sur Overview
   - AreaChart 2-series sur Analytics
   - Recent Bookings (avatar + nom + bien/dates + montant)
   - SimpleBarList pour Top biens / Top apporteurs */

// Donnees Analytics (semaine, traffic-like) — pas de hardcoding cote
// composants, on prepare ici pour pouvoir later brancher sur du vrai.
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
  const { kpis, monthlyRevenue, objectives } = dashboard;

  // Pour Overview chart : Recharts attend label + value, on mappe.
  const overviewData = monthlyRevenue.map((m) => ({
    label: m.label,
    value: m.value,
  }));

  // Top biens par revenus du mois (descendant).
  const topProperties = [...dashboardProperties]
    .sort((a, b) => b.monthRevenue - a.monthRevenue)
    .map((p) => ({ name: p.name, value: p.monthRevenue }));

  // Top canaux apporteurs par conversions.
  const topChannels = [...referralChannels]
    .sort((a, b) => b.conversions - a.conversions)
    .map((c) => ({ name: c.label, value: c.conversions }));

  return (
    <div className="space-y-4">
      {/* En-tete page */}
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        {/* ─── ONGLET VUE D'ENSEMBLE ──────────────────────── */}
        <TabsContent value="overview" className="space-y-4">
          {/* 4 KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCardIcon
              title="Revenus"
              value={`${formatNumber(kpis.revenue)} CHF`}
              delta={`${kpis.revenueDelta} vs mois dernier`}
              icon={DollarSign}
            />
            <KpiCardIcon
              title="Réservations"
              value={formatNumber(kpis.reservations)}
              delta={`${kpis.reservationsDelta} vs mois dernier`}
              icon={CalendarCheck}
            />
            <KpiCardIcon
              title="Commissions"
              value={`${formatNumber(kpis.commissions)} CHF`}
              delta={`${kpis.commissionsDelta} vs mois dernier`}
              icon={Users}
            />
            <KpiCardIcon
              title="Taux d'occupation"
              value={formatPercent(kpis.occupancy)}
              delta={`${kpis.occupancyDelta} vs mois dernier`}
              icon={Activity}
            />
          </div>

          {/* Chart + Recent Bookings */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenus mensuels</CardTitle>
                <CardDescription>
                  12 derniers mois · CHF — barres en accent
                </CardDescription>
              </CardHeader>
              <CardContent className="ps-2">
                <OverviewChart data={overviewData} />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Réservations récentes</CardTitle>
                <CardDescription>
                  {kpis.reservations} réservations ce mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentBookings limit={5} />
              </CardContent>
            </Card>
          </div>

          {/* Objectifs du mois */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Objectifs du mois</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ONGLET ANALYTICS ──────────────────────────── */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Chart Traffic */}
          <Card>
            <CardHeader>
              <CardTitle>Trafic hebdomadaire</CardTitle>
              <CardDescription>
                Vues uniques (accent) vs visiteurs (muted) sur 7 jours
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <AnalyticsAreaChart data={ANALYTICS_WEEK} />
            </CardContent>
          </Card>

          {/* 4 mini KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCardIcon
              title="Vues totales"
              value="1 566"
              delta="+12.4% vs semaine derniere"
              icon={MousePointerClick}
            />
            <KpiCardIcon
              title="Visiteurs uniques"
              value="1 048"
              delta="+5.8% vs semaine derniere"
              icon={Eye}
            />
            <KpiCardIcon
              title="Taux de conversion"
              value="4.2%"
              delta="-0.3% vs semaine derniere"
              icon={Activity}
              deltaTone="down"
            />
            <KpiCardIcon
              title="Durée moyenne"
              value="3m 24s"
              delta="+18s vs semaine derniere"
              icon={Timer}
            />
          </div>

          {/* Top biens + Top canaux */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Top biens</CardTitle>
                <CardDescription>Revenus du mois par bien</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarList
                  items={topProperties}
                  valueFormatter={(n) => `${formatNumber(n)} CHF`}
                  barClass="bg-primary"
                />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Canaux apporteurs</CardTitle>
                <CardDescription>
                  Conversions par canal ce mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarList
                  items={topChannels}
                  valueFormatter={(n) => `${n} conv.`}
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

/* Ligne de progression vers un objectif. Monochrome (bar foreground)
   pour rester coherent avec le theme brutalist. */
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
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{display}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={
            reached
              ? "h-full rounded-full bg-emerald-500"
              : "h-full rounded-full bg-foreground"
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
