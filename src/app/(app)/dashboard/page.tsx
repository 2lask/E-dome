"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  CalendarDays,
  GraduationCap,
  Handshake,
  ShoppingBag,
  Star,
} from "lucide-react";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { MetricsOverview } from "@/components/dashboard/metrics-overview";
import { MiniRevenueSummary } from "@/components/dashboard/mini-revenue-summary";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { SummaryCard } from "@/components/dashboard/summary-card";
import {
  dashboard,
  formations,
  properties,
  boutiqueAlerts,
  apporteurSummary,
  dashboardReservations,
  reviewsSummary,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* /dashboard = COCKPIT (resumer, pas refaire).
   Aucun graphe filtrable, aucune grande table. Les blocs lourds
   (SalesAreaChart 12 mois, BookingsList complet, TopProperties,
   TopFormations) vivent dans leurs pages dediees. Ici on a :

   - DashboardHero (accueil + actions contextuelles)
   - 4 KPI premium (CA / annonces / note ponderee / forecast 30j)
   - 2-cols : MiniRevenueSummary (chiffre + sparkline + lien) +
     Objectifs du mois
   - 6 SummaryCards "Voir tout ->" : Reservations / Avis / Biens /
     Formations / Boutique / Apporteurs. Chaque card a son chip
     tone (warning si action requise).
   - Prochains rendez-vous (UpcomingEvents 4 items)

   Tout est derive de dashboard-data (SOT). Aucune valeur hardcodee.
   Plus de tableau Reservations recentes / Performance par bien /
   Apporteurs actifs / Mes biens — chacun est resume en une
   SummaryCard qui linke vers sa page detaillee. */

export default function DashboardOverviewPage() {
  const { objectives } = dashboard;
  const draftBoutique = boutiqueAlerts.filter((b) => b.level !== "ok").length;
  const pendingReservations = dashboardReservations.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div className="space-y-6">
      <DashboardHero />

      <MetricsOverview />

      {/* Resume revenus (chiffre + sparkline + lien) + Objectifs. */}
      <div className="grid gap-6 md:grid-cols-2">
        <MiniRevenueSummary />
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

      {/* 6 SummaryCards "Voir tout ->" : 1 par section dediee. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={CalendarDays}
          label="Réservations"
          value={
            pendingReservations > 0
              ? `${pendingReservations} en attente`
              : `${dashboardReservations.length} récentes`
          }
          hint={
            pendingReservations > 0
              ? "À confirmer rapidement"
              : "Voir toutes les réservations"
          }
          href="/dashboard/reservations"
          tone={pendingReservations > 0 ? "warning" : "default"}
        />
        <SummaryCard
          icon={Star}
          label="Avis & notations"
          value={
            reviewsSummary.pendingResponse > 0
              ? `${reviewsSummary.pendingResponse} à répondre`
              : `${reviewsSummary.avg.toFixed(2)} / 5`
          }
          hint={
            reviewsSummary.pendingResponse > 0
              ? "Réponses publiques manquantes"
              : "Note moyenne pondérée"
          }
          href="/dashboard/avis"
          tone={reviewsSummary.pendingResponse > 0 ? "warning" : "success"}
        />
        <SummaryCard
          icon={Building2}
          label="Biens performants"
          value={`${properties.length} biens`}
          hint={`Top : ${properties[0]?.name ?? "—"}`}
          href="/dashboard/annonces"
        />
        <SummaryCard
          icon={GraduationCap}
          label="Formations en vente"
          value={`${formations.length} actives`}
          hint={`${formations.reduce((s, f) => s + f.studentsThisMonth, 0)} élèves ce mois`}
          href="/dashboard/annonces"
        />
        <SummaryCard
          icon={ShoppingBag}
          label="Boutique"
          value={draftBoutique > 0 ? `${draftBoutique} alertes` : "À jour"}
          hint="Stock à réapprovisionner"
          href="/dashboard/annonces"
          tone={draftBoutique > 0 ? "warning" : "success"}
        />
        <SummaryCard
          icon={Handshake}
          label="Apporteurs"
          value={`${formatNumber(apporteurSummary.pending)} CHF`}
          hint="En attente de versement"
          href="/dashboard/apporteurs"
          tone={apporteurSummary.pending > 0 ? "warning" : "default"}
        />
      </div>

      {/* Prochains rendez-vous (lives, ateliers, visites) */}
      <UpcomingEvents limit={4} />
    </div>
  );
}

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
