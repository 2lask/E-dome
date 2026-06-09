import { Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import { dashboard } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* /dashboard/revenus : style premium coherent avec /dashboard.
   KpiGrid + 4 KpiCardPremium + OverviewChart + 2 SimpleBarList. */

export default function RevenusPage() {
  const { properties, revenueByType, kpis, monthlyRevenue } = dashboard;

  const totalLocations =
    revenueByType.find((t) => t.label === "Locations")?.value ?? 0;
  const totalCommissions =
    revenueByType.find((t) => t.label.startsWith("Commissions"))?.value ?? 0;
  const totalBoutique =
    revenueByType.find((t) => t.label === "Boutique")?.value ?? 0;

  const overviewData = monthlyRevenue.map((m) => ({
    label: m.label,
    value: m.value,
  }));

  const byProperty = [...properties]
    .sort((a, b) => b.monthRevenue - a.monthRevenue)
    .map((p) => ({ name: p.name, value: p.monthRevenue }));

  const byType = [...revenueByType]
    .sort((a, b) => b.value - a.value)
    .map((t) => ({ name: t.label, value: t.value }));

  const pct = (v: number) => Math.round((v / kpis.revenue) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenus</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Détail des 12 derniers mois · CHF
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      <KpiGrid>
        <KpiCardPremium
          label="Total revenus"
          value={`${formatNumber(kpis.revenue)} CHF`}
          delta={kpis.revenueDelta}
          trend="up"
          footer="Cumul du mois en cours"
          subfooter="Toutes sources confondues"
        />
        <KpiCardPremium
          label="Locations"
          value={`${formatNumber(totalLocations)} CHF`}
          delta={`${pct(totalLocations)}%`}
          trend="neutral"
          footer="Part dans le total"
          subfooter="Réservations courte + longue durée"
        />
        <KpiCardPremium
          label="Commissions apporteur"
          value={`${formatNumber(totalCommissions)} CHF`}
          delta={`${pct(totalCommissions)}%`}
          trend="neutral"
          footer="Part dans le total"
          subfooter="Conversions générées ce mois"
        />
        <KpiCardPremium
          label="Boutique"
          value={`${formatNumber(totalBoutique)} CHF`}
          delta={`${pct(totalBoutique)}%`}
          trend="neutral"
          footer="Part dans le total"
          subfooter="Ventes de produits annexes"
        />
      </KpiGrid>

      <Card>
        <CardHeader>
          <CardTitle>Évolution mensuelle</CardTitle>
          <CardDescription>
            Revenus totaux sur 12 mois · mois courant accentué
          </CardDescription>
        </CardHeader>
        <CardContent className="ps-2">
          <OverviewChart data={overviewData} height={300} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Par bien</CardTitle>
            <CardDescription>
              Contribution de chaque bien ce mois
            </CardDescription>
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
