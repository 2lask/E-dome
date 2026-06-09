import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { MultiPropertyCalendar } from "@/components/dashboard/multi-property-calendar";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import {
  dashboard,
  properties,
} from "@/lib/dashboard-data";
import { formatNumber, formatPercent } from "@/lib/format";

/* /dashboard/calendrier : vue tableau jours x biens pour visualiser
   l'occupation, les trous, et les chevauchements. Inspire des
   channel managers (Smoobu, Hostaway). */

export default function CalendrierPage() {
  const { reservations, kpis } = dashboard;

  const confirmedFutur = reservations.filter(
    (r) => r.status === "confirmed",
  ).length;
  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const totalRevenue = reservations
    .filter((r) => r.status !== "cancelled")
    .reduce((s, r) => s + r.amount, 0);
  const nbBiens = properties.length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Calendrier"
        description="Vue d'occupation de tous vos biens · navigation par mois"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export iCal
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Bloquer une période
            </Button>
          </>
        }
      />

      <KpiGrid>
        <KpiCardPremium
          label="Biens suivis"
          value={String(nbBiens)}
          delta="actifs"
          trend="neutral"
          footer="Calendrier consolidé"
          subfooter={properties.map((p) => p.city).join(" · ")}
        />
        <KpiCardPremium
          label="Réservations confirmées"
          value={String(confirmedFutur)}
          delta={`${pendingCount} en attente`}
          trend={pendingCount > 0 ? "neutral" : "up"}
          footer="Pipeline locatif"
          subfooter="Tous biens confondus"
        />
        <KpiCardPremium
          label="Taux d'occupation moyen"
          value={formatPercent(kpis.occupancy)}
          delta={kpis.occupancyDelta}
          trend="up"
          footer="Performance des biens"
          subfooter="Moyenne portefeuille"
        />
        <KpiCardPremium
          label="Revenus locatifs"
          value={`${formatNumber(totalRevenue)} CHF`}
          delta={kpis.revenueDelta}
          trend="up"
          footer="Réservations actives + à venir"
          subfooter="Hors annulations"
        />
      </KpiGrid>

      <MultiPropertyCalendar />

      {/* Combine avec les evenements/lives a venir : meme vue
          temporelle, mais source differente. */}
      <UpcomingEvents />
    </div>
  );
}
