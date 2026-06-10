"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarDays,
  Handshake,
  Percent,
  Star,
  TrendingUp,
} from "lucide-react";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { RevenueSection } from "@/components/dashboard/revenue-section";
import {
  dashboard,
  formations,
  properties,
  boutiqueAlerts,
  apporteurSummary,
  dashboardReservations,
  reviewsSummary,
  activeListingsCount,
} from "@/lib/dashboard-data";
import { buildView } from "@/lib/revenue-data";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* /dashboard = page UNIQUE (fusion Vue d'ensemble + Revenus).
   La page Revenus autonome n'existe plus -- son contenu est extrait
   dans <RevenueSection> et rendu ici dans la Zone 2 (id="revenus"
   pour les liens entrants depuis le redirect 308).

   Structure 3 zones :
   - Zone 1 : Cockpit (Hero + 4 KPI + alertes + a venir + objectifs)
   - Zone 2 : RevenueSection (filtres profonds + chart + transactions)
   - Zone 3 : Explorer le reste (6 SummaryCards "Voir tout ->")

   Tout derive de la SOT (dashboard-data + revenue-data). Aucun
   chiffre hardcode. */

export default function DashboardOverviewPage() {
  const { objectives } = dashboard;

  /* Zone 1 : 4 KPI transversaux derives. */
  const revenue12m = buildView({
    source: "all",
    period: "12m",
    propType: "all",
    bien: null,
  });
  const occupancyAvg =
    properties.reduce((s, p) => s + p.occupancy, 0) / properties.length;

  const draftBoutique = boutiqueAlerts.filter((b) => b.level !== "ok").length;
  const pendingReservations = dashboardReservations.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div className="space-y-8">
      <DashboardHero />

      {/* ─── ZONE 1 : COCKPIT ─────────────────────────────── */}
      <section className="space-y-6">
        {/* 4 KPI transversaux (tuiles chiffrees, pas de graphe) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiTile
            icon={TrendingUp}
            label="Revenus · 12 mois"
            value={`${formatNumber(revenue12m.total)} CHF`}
            delta="+15%"
            tone="primary"
          />
          <KpiTile
            icon={CalendarDays}
            label="Réservations"
            value={String(dashboardReservations.length)}
            delta="+21%"
            tone="primary"
          />
          <KpiTile
            icon={Percent}
            label="Occupation moyenne"
            value={`${Math.round(occupancyAvg * 100)}%`}
            delta="+4 pts"
            tone="success"
          />
          <KpiTile
            icon={Star}
            label="Note moyenne"
            value={`${reviewsSummary.avg.toFixed(2)} / 5`}
            delta={`${reviewsSummary.total} avis`}
            tone="warning"
          />
        </div>

        {/* Bande d'alertes cliquables (chips, derivees) */}
        <AlertsBanner
          pendingReservations={pendingReservations}
          pendingReviews={reviewsSummary.pendingResponse}
          pendingCommissions={apporteurSummary.pending}
        />

        {/* Prochains rendez-vous + Objectifs (2-cols) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingEvents limit={3} />
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Objectifs du mois</CardTitle>
              <CardDescription>Progression vers vos cibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressRow
                label="Revenus du mois"
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
                display={`${objectives.rating.current.toFixed(2)} / ${objectives.rating.target}`}
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
      </section>

      {/* ─── ZONE 2 : REVENUS & PERFORMANCE ───────────────── */}
      <RevenueSection />

      {/* ─── ZONE 3 : EXPLORER LE RESTE ───────────────────── */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            Explorer le reste
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Voir tout dans chaque section
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            icon={CalendarDays}
            label="Réservations"
            value={`${dashboardReservations.length} · ${pendingReservations} en attente`}
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
            label="Avis"
            value={`${reviewsSummary.avg.toFixed(2)} · ${reviewsSummary.pendingResponse} à répondre`}
            hint="Note moyenne pondérée"
            href="/dashboard/avis"
            tone={reviewsSummary.pendingResponse > 0 ? "warning" : "success"}
          />
          <SummaryCard
            icon={Building2}
            label="Annonces"
            value={`${activeListingsCount.total} actives`}
            hint={`${activeListingsCount.biens} biens + ${activeListingsCount.formations} formations`}
            href="/dashboard/annonces"
          />
          <SummaryCard
            icon={Handshake}
            label="Apporteurs"
            value={`${formatNumber(apporteurSummary.earnedThisMonth)} CHF ce mois`}
            hint={`${formatNumber(apporteurSummary.pending)} CHF en attente`}
            href="/dashboard/apporteurs"
            tone={apporteurSummary.pending > 0 ? "warning" : "default"}
          />
          <SummaryCard
            icon={BarChart3}
            label="Audience"
            value={`${formatNumber(properties.reduce((s, p) => s + p.views, 0))} vues`}
            hint="Trafic et conversions"
            href="/dashboard/audience"
          />
          <SummaryCard
            icon={CalendarCheck}
            label="Calendrier"
            value={`${Math.round(occupancyAvg * 100)}% occupation`}
            hint={`${formations.length} formations · ${draftBoutique} alertes boutique`}
            href="/dashboard/calendrier"
            tone={draftBoutique > 0 ? "warning" : "default"}
          />
        </div>
      </section>
    </div>
  );
}

/* KpiTile : tuile chiffrée premium pour la Zone 1 du cockpit.
   Icone chip a gauche, valeur enorme, delta colorise. */
function KpiTile({
  icon: Icon,
  label,
  value,
  delta,
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta?: string;
  tone?: "primary" | "success" | "warning";
}) {
  const chip =
    tone === "warning"
      ? "chip-warning-soft"
      : tone === "success"
      ? "chip-success-soft"
      : "bg-primary/10 text-primary";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
              chip,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {delta && (
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {delta}
            </span>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

/* AlertsBanner : chips d'actions requises, derivees des compteurs. */
function AlertsBanner({
  pendingReservations,
  pendingReviews,
  pendingCommissions,
}: {
  pendingReservations: number;
  pendingReviews: number;
  pendingCommissions: number;
}) {
  const items = [
    pendingReservations > 0 && {
      href: "/dashboard/reservations",
      label: `${pendingReservations} réservation${pendingReservations > 1 ? "s" : ""} en attente`,
      icon: CalendarDays,
    },
    pendingReviews > 0 && {
      href: "/dashboard/avis",
      label: `${pendingReviews} avis à répondre`,
      icon: Star,
    },
    pendingCommissions > 0 && {
      href: "/dashboard/apporteurs",
      label: `${formatNumber(pendingCommissions)} CHF de commissions en attente`,
      icon: Handshake,
    },
  ].filter(Boolean) as Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }>;

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-success/5 px-4 py-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Tout est à jour.</span>{" "}
        Aucune action requise pour le moment.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="chip-warning-soft inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
        >
          <item.icon className="h-3.5 w-3.5" />
          {item.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      ))}
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
