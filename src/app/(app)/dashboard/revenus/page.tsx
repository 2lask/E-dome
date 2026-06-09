import { Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { RevenueBreakdown } from "@/components/dashboard/revenue-breakdown";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import {
  dashboard,
  formations,
  upcomingEvents,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* /dashboard/revenus : detail des 7 sources de revenus.
   Avant : 3 KPI (Locations / Commissions / Boutique) ignoraient
   4 sources sur 7. Refonte avec breakdown complet + top actifs
   cross-categorie (biens ET formations ET evenements). */

export default function RevenusPage() {
  const { revenueBySource, properties, monthlyRevenue, kpis } = dashboard;

  const totalRevenue = revenueBySource.reduce((s, i) => s + i.value, 0);
  const totalBiens =
    revenueBySource.find((s) => s.key === "biens")?.value ?? 0;
  const totalFormations =
    revenueBySource.find((s) => s.key === "formations")?.value ?? 0;
  const totalEvents =
    revenueBySource.find((s) => s.key === "evenements")?.value ?? 0;

  const overviewData = monthlyRevenue.map((m) => ({
    label: m.label,
    value: m.value,
  }));

  /* Top actifs cross-categorie : biens (monthRevenue), formations
     (monthRevenue), evenements (forecast). Trie par CA et limite a 8. */
  const topActifs = [
    ...properties.map((p) => ({
      name: `${p.name} (bien)`,
      value: p.monthRevenue,
    })),
    ...formations.map((f) => ({
      name: `${f.title} (formation)`,
      value: f.monthRevenue,
    })),
    ...upcomingEvents
      .filter((e) => e.forecast > 0)
      .map((e) => ({ name: `${e.title} (${e.kind})`, value: e.forecast })),
  ]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const pct = (v: number) =>
    totalRevenue > 0 ? Math.round((v / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Revenus"
        description="Détail des 7 sources de revenus et de leur évolution"
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        }
      />

      <KpiGrid>
        <KpiCardPremium
          label="Total revenus"
          value={`${formatNumber(totalRevenue)} CHF`}
          delta={kpis.revenueDelta}
          trend="up"
          footer="Cumul du mois en cours"
          subfooter="Toutes sources confondues"
        />
        <KpiCardPremium
          label="Biens (locations)"
          value={`${formatNumber(totalBiens)} CHF`}
          delta={`${pct(totalBiens)}%`}
          trend="up"
          footer="Réservations courte durée"
          subfooter="Part dans le total"
        />
        <KpiCardPremium
          label="Formations"
          value={`${formatNumber(totalFormations)} CHF`}
          delta={`${pct(totalFormations)}%`}
          trend="up"
          footer="Ventes e-learning"
          subfooter="Part dans le total"
        />
        <KpiCardPremium
          label="Événements & services"
          value={`${formatNumber(totalEvents)} CHF`}
          delta={`${pct(totalEvents)}%`}
          trend="up"
          footer="Lives, ateliers, visites"
          subfooter="Part dans le total"
        />
      </KpiGrid>

      {/* Chart évolution + Mix breakdown côte à côte */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
            <CardDescription>
              Revenus totaux sur 12 mois · mois courant accentué
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-6">
            <OverviewChart data={overviewData} height={300} />
          </CardContent>
        </Card>
        <div className="lg:col-span-4">
          <RevenueBreakdown />
        </div>
      </div>

      {/* Top actifs cross-cat + détail par source */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top actifs (toutes catégories)</CardTitle>
            <CardDescription>
              Biens, formations et événements les plus rentables ce mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={topActifs}
              valueFormatter={(n) => `${formatNumber(n)} CHF`}
              barClass="bg-primary"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Détail par source</CardTitle>
            <CardDescription>
              Répartition des 7 sources de revenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={[...revenueBySource]
                .sort((a, b) => b.value - a.value)
                .map((s) => ({ name: s.label, value: s.value }))}
              valueFormatter={(n) => `${formatNumber(n)} CHF`}
              barClass="bg-muted-foreground"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
