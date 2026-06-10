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

/* /dashboard = page UNIQUE en 3 zones, style blueprint monochrome.
   Discipline : mono pour eyebrows/labels/chiffres, couleurs uniquement
   dans le graphe et les initiales de biens. Pas de titres "remplissage"
   (l'eyebrow suffit). Une seule famille de carte (border hairline,
   radius homogene, ombre quasi nulle via card.tsx). */

export default function DashboardOverviewPage() {
  const { objectives } = dashboard;

  /* Total CA 12 mois TOUTES sources via buildView('all'). Cette
     somme = immobilier + formations + evenements + boutique +
     apporteur, derivee de la SOT (revenue-data). Le sub-libellé
     "Toutes sources" le distingue du 57'606 immobilier seul que
     l'utilisateur verra plus bas dans la RevenueSection. */
  const revenue12mAll = buildView({
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

  /* Decomposition annonces precise pour la SummaryCard. Avant on
     n'avait que "biens + formations" qui n'expliquait pas le total
     16. Maintenant : 3 biens + 3 formations + 4 evenements + 3
     services + 3 boutique = 16. */
  const annoncesDecomp = [
    `${activeListingsCount.biens} biens`,
    `${activeListingsCount.formations} formations`,
    `${activeListingsCount.events} événements`,
    `${activeListingsCount.services} services`,
    `${activeListingsCount.boutique} produits`,
  ].join(" · ");

  return (
    <div className="space-y-10">
      <DashboardHero />

      {/* ─── ZONE 1 : COCKPIT ─────────────────────────────── */}
      <ZoneSeparator />
      <section className="space-y-6">
        {/* 4 KPI transversaux blueprint mono */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiTile
            icon={TrendingUp}
            label="Revenus · 12 mois"
            sub="Toutes sources"
            value={`${formatNumber(revenue12mAll.total)} CHF`}
            delta="+15%"
          />
          <KpiTile
            icon={CalendarDays}
            label="Réservations"
            sub="Sur la période"
            value={String(dashboardReservations.length)}
            delta="+21%"
          />
          <KpiTile
            icon={Percent}
            label="Occupation moyenne"
            sub="Sur portefeuille"
            value={`${Math.round(occupancyAvg * 100)}%`}
            delta="+4 pts"
          />
          <KpiTile
            icon={Star}
            label="Note moyenne"
            sub={`${reviewsSummary.total} avis`}
            value={`${reviewsSummary.avg.toFixed(2)} / 5`}
          />
        </div>

        {/* Bande d'alertes : ne contient PLUS que ce qui n'est pas
            deja dans le hero. Reservations + avis sont dans le hero,
            commissions est unique a cette bande. */}
        <AlertsBanner pendingCommissions={apporteurSummary.pending} />

        {/* Prochains rendez-vous + Objectifs (2-cols) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingEvents limit={3} />
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Objectifs du mois
              </CardTitle>
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
              {/* "Diversification 6/7 sources" remplace par "Taux
                  d'occupation cible" : objectif metier concret pour
                  un host immobilier. */}
              <ProgressRow
                label="Taux d'occupation cible"
                current={Math.round(occupancyAvg * 100)}
                target={85}
                display={`${Math.round(occupancyAvg * 100)}% / 85%`}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── ZONE 2 : REVENUS & PERFORMANCE ───────────────── */}
      <ZoneSeparator />
      <RevenueSection />

      {/* ─── ZONE 3 : EXPLORER LE RESTE ───────────────────── */}
      <ZoneSeparator />
      <section className="space-y-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Explorer le reste
        </p>
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
            tone={reviewsSummary.pendingResponse > 0 ? "warning" : "default"}
          />
          <SummaryCard
            icon={Building2}
            label="Annonces"
            value={`${activeListingsCount.total} actives`}
            hint={annoncesDecomp}
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

/* Filet pleine largeur entre zones : blueprint = espace + hairline. */
function ZoneSeparator() {
  return <div className="h-px w-full bg-border" aria-hidden />;
}

/* KpiTile blueprint : eyebrow mono uppercase + sub mono + valeur
   tabular-nums. Icone discrete chip muted. Pas de tone colore -
   la couleur est reservee au graphe. */
function KpiTile({
  icon: Icon,
  label,
  sub,
  value,
  delta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
  value: string;
  delta?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
          {delta && (
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {delta}
            </span>
          )}
        </div>
        <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 font-mono text-2xl font-medium tabular-nums">
          {value}
        </p>
        {sub && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}

/* AlertsBanner : ne contient plus que les commissions
   (reservations + avis sont dans le hero). Si rien -> bordure
   dashed sobre. */
function AlertsBanner({
  pendingCommissions,
}: {
  pendingCommissions: number;
}) {
  if (pendingCommissions <= 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/dashboard/apporteurs"
        className={cn(
          "chip-warning-soft inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80",
        )}
      >
        <Handshake className="h-3.5 w-3.5" />
        {formatNumber(pendingCommissions)} CHF de commissions en attente
        <ArrowRight className="h-3 w-3" />
      </Link>
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
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums">{display}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all motion-reduce:transition-none",
            reached ? "bg-foreground" : "bg-foreground/70",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
