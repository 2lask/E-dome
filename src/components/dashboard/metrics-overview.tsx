import { KpiCardPremium, KpiGrid } from "@/components/dashboard/kpi-card-premium";
import { dashboard } from "@/lib/dashboard-data";
import { formatNumber, formatPercent } from "@/lib/format";

/* MetricsOverview : 4 KPI cards principaux de l'app pour /dashboard.
   Thin wrapper autour de KpiCardPremium pour garder la flexibilite
   tout en exposant un import direct simple. */

export function MetricsOverview() {
  const { kpis } = dashboard;

  return (
    <KpiGrid>
      <KpiCardPremium
        label="Revenus du mois"
        value={`${formatNumber(kpis.revenue)} CHF`}
        delta={kpis.revenueDelta}
        trend="up"
        footer="En hausse ce mois"
        subfooter="Revenus des 30 derniers jours"
      />
      <KpiCardPremium
        label="Réservations"
        value={formatNumber(kpis.reservations)}
        delta={kpis.reservationsDelta}
        trend="up"
        footer="Forte demande locative"
        subfooter="Cumul confirmées + à venir"
      />
      <KpiCardPremium
        label="Commissions apporteur"
        value={`${formatNumber(kpis.commissions)} CHF`}
        delta={kpis.commissionsDelta}
        trend="up"
        footer="Reseau d'apporteurs actif"
        subfooter="Versées + en attente"
      />
      <KpiCardPremium
        label="Taux d'occupation"
        value={formatPercent(kpis.occupancy)}
        delta={kpis.occupancyDelta}
        trend="up"
        footer="Performance des biens"
        subfooter="Moyenne sur le portefeuille"
      />
    </KpiGrid>
  );
}
