import { Download, DollarSign, TrendingUp, Wallet, Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCardIcon } from "@/components/dashboard/kpi-card-icon";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import { dashboard } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* Refonte de la page Revenus : aligne sur le pattern shadcn-admin
   adopte sur /dashboard. KpiCardIcon (4 metriques) + OverviewChart
   sur 12 mois + 2 SimpleBarList (Par bien / Par type). */

export default function RevenusPage() {
  const { properties, revenueByType, kpis, monthlyRevenue } = dashboard;

  // Aggregations derivees pour les KPI cards.
  const totalLocations = revenueByType.find((t) => t.label === "Locations")?.value ?? 0;
  const totalCommissions = revenueByType.find((t) => t.label.startsWith("Commissions"))?.value ?? 0;
  const totalBoutique = revenueByType.find((t) => t.label === "Boutique")?.value ?? 0;

  const overviewData = monthlyRevenue.map((m) => ({ label: m.label, value: m.value }));

  const byProperty = [...properties]
    .sort((a, b) => b.monthRevenue - a.monthRevenue)
    .map((p) => ({ name: p.name, value: p.monthRevenue }));

  const byType = [...revenueByType]
    .sort((a, b) => b.value - a.value)
    .map((t) => ({ name: t.label, value: t.value }));

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenus</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Détail des 12 derniers mois · CHF
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* 4 KPI cards : Total / Locations / Commissions / Boutique */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardIcon
          title="Total revenus"
          value={`${formatNumber(kpis.revenue)} CHF`}
          delta={`${kpis.revenueDelta} vs mois dernier`}
          icon={DollarSign}
        />
        <KpiCardIcon
          title="Locations"
          value={`${formatNumber(totalLocations)} CHF`}
          delta={`${Math.round((totalLocations / kpis.revenue) * 100)}% du total`}
          icon={Building2}
          deltaTone="neutral"
        />
        <KpiCardIcon
          title="Commissions apporteur"
          value={`${formatNumber(totalCommissions)} CHF`}
          delta={`${Math.round((totalCommissions / kpis.revenue) * 100)}% du total`}
          icon={TrendingUp}
          deltaTone="neutral"
        />
        <KpiCardIcon
          title="Boutique"
          value={`${formatNumber(totalBoutique)} CHF`}
          delta={`${Math.round((totalBoutique / kpis.revenue) * 100)}% du total`}
          icon={Wallet}
          deltaTone="neutral"
        />
      </div>

      {/* Chart 12 mois */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution mensuelle</CardTitle>
          <CardDescription>
            Revenus totaux sur 12 mois · barre courante accentuée
          </CardDescription>
        </CardHeader>
        <CardContent className="ps-2">
          <OverviewChart data={overviewData} height={300} />
        </CardContent>
      </Card>

      {/* 2 SimpleBarLists : Par bien / Par type */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Par bien</CardTitle>
            <CardDescription>Contribution de chaque bien ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={byProperty}
              valueFormatter={(n) => `${formatNumber(n)} CHF`}
              barClass="bg-primary"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Par catégorie</CardTitle>
            <CardDescription>Répartition par source de revenu</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={byType}
              valueFormatter={(n) => `${formatNumber(n)} CHF`}
              barClass="bg-muted-foreground"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
