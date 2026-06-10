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
  GraduationCap,
  Handshake,
  ShoppingBag,
} from "lucide-react";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { MetricsOverview } from "@/components/dashboard/metrics-overview";
import { SalesAreaChart } from "@/components/dashboard/sales-area-chart";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { BookingsList } from "@/components/dashboard/bookings-list";
import { SummaryCard } from "@/components/dashboard/summary-card";
import {
  dashboard,
  formations,
  properties,
  boutiqueAlerts,
  apporteurSummary,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* Vue d'ensemble degraissee — VRAI resume.
   AVANT : Hero + 4 KPI + 4 mini KPI + Tabs (Vue/Analytics) avec
   row 1 chart+breakdown, row 2 TopProp+TopForm, row 3 Events+Boutique,
   row 4 Bookings+Objectifs. C'etait dense mais cela DUPLIQUAIT le
   contenu des pages dediees (/dashboard/revenus a deja le breakdown,
   /dashboard/annonces a deja TopProp et TopForm, etc.).

   APRES : Hero + 4 KPI premium + chart 8col/objectifs 4col + 4 cards
   "Voir tout" (Biens / Formations / Boutique / Apporteurs) + prochains
   rendez-vous + 3 dernieres reservations. La home est un INDEX, les
   pages dediees ont le detail. */

export default function DashboardOverviewPage() {
  const { objectives } = dashboard;
  const draftBoutique = boutiqueAlerts.filter((b) => b.level !== "ok").length;

  return (
    <div className="space-y-6">
      <DashboardHero />

      {/* 4 KPI cards premium multi-source */}
      <MetricsOverview />

      {/* Chart 12 mois + Objectifs (le seul "tableau" qu'on garde,
          car il appartient a la Vue d'ensemble par nature). */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SalesAreaChart />
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

      {/* 4 cards compactes "Voir tout" -> pages dediees */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Prochains rendez-vous + 3 dernieres reservations.
          BookingsList limit=3 (au lieu de 5 pour rester compact). */}
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingEvents limit={4} />
        <BookingsList limit={3} />
      </div>
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
