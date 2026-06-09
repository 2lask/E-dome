import { KpiCardPremium, KpiGrid } from "@/components/dashboard/kpi-card-premium";
import {
  activeListingsCount,
  dashboard,
  formations,
  revenueBySource,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* MetricsOverview : 4 KPI cards MULTI-SOURCE pour /dashboard.
   Plus 1 KPI sur 4 ne parle pas que de locations : CA total agrege,
   diversite du catalogue, note moyenne POND. multi-source, CA
   previsionnel 30j (signed-not-paid). */

export function MetricsOverview() {
  const { kpis } = dashboard;
  const totalCA = revenueBySource.reduce((s, i) => s + i.value, 0);
  const sourcesActives = revenueBySource.filter((s) => s.value > 0).length;
  const studentsThisMonth = formations.reduce(
    (s, f) => s + f.studentsThisMonth,
    0,
  );

  return (
    <KpiGrid>
      <KpiCardPremium
        label="CA total du mois"
        value={`${formatNumber(totalCA)} CHF`}
        delta={kpis.revenueDelta}
        trend="up"
        footer={`${sourcesActives} sources de revenus actives`}
        subfooter="Biens, formations, boutique, événements…"
      />
      <KpiCardPremium
        label="Annonces actives"
        value={String(activeListingsCount.total)}
        delta={`${activeListingsCount.biens} biens · ${activeListingsCount.formations} formations`}
        trend="up"
        footer="Catalogue multi-catégories"
        subfooter={`+ ${activeListingsCount.events} événements, ${activeListingsCount.services} services`}
      />
      <KpiCardPremium
        label="Note moyenne pondérée"
        value={kpis.weightedRating.toFixed(2)}
        delta="+0.12"
        trend="up"
        footer="Toutes sources confondues"
        subfooter={`${studentsThisMonth} élèves formations + biens loués`}
      />
      <KpiCardPremium
        label="CA prévisionnel 30j"
        value={`${formatNumber(Math.round(kpis.forecast30d))} CHF`}
        delta="signed"
        trend="up"
        footer="Réservations + événements + services"
        subfooter="Hors devis non confirmés"
      />
    </KpiGrid>
  );
}
