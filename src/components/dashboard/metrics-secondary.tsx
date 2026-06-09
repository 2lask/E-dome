import {
  CalendarCheck,
  Handshake,
  Percent,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  apporteurSummary,
  dashboardReservations,
  upcomingEvents,
  kpis,
} from "@/lib/dashboard-data";
import { formatNumber, formatPercent } from "@/lib/format";

/* MetricsSecondary : 4 KPI compacts en seconde rangee.
   Densifie la vue d'ensemble sans dupliquer les 4 cards "premium".
   Format reduit, valeur en gros + label muted + icone en chip. */

interface MiniKpiProps {
  label: string;
  value: string;
  icon: LucideIcon;
  sublabel?: string;
  accent?: "default" | "warning" | "success";
}

function MiniKpi({ label, value, icon: Icon, sublabel, accent = "default" }: MiniKpiProps) {
  const chip =
    accent === "warning"
      ? "chip-warning-soft"
      : accent === "success"
      ? "chip-success-soft"
      : "bg-primary/10 text-primary";
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${chip}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold tabular-nums leading-tight">{value}</p>
          {sublabel && (
            <p className="truncate text-[11px] text-muted-foreground">
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function MetricsSecondary() {
  const reservationsActives = dashboardReservations.filter(
    (r) => r.status === "confirmed" || r.status === "pending",
  ).length;
  const livesA7j = upcomingEvents.filter((e) => e.daysUntil <= 7).length;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MiniKpi
        label="Réservations actives"
        value={String(reservationsActives)}
        sublabel={`Taux d'occupation ${formatPercent(kpis.occupancy)}`}
        icon={CalendarCheck}
      />
      <MiniKpi
        label="Commissions en attente"
        value={`${formatNumber(apporteurSummary.pending)} CHF`}
        sublabel={`Déjà versé ${formatNumber(apporteurSummary.alreadyPaid)} CHF`}
        icon={Handshake}
        accent="warning"
      />
      <MiniKpi
        label="Taux d'occupation moyen"
        value={formatPercent(kpis.occupancy)}
        sublabel={kpis.occupancyDelta + " vs mois passé"}
        icon={Percent}
        accent="success"
      />
      <MiniKpi
        label="Lives & événements 7j"
        value={String(livesA7j)}
        sublabel="Programmation à venir"
        icon={Sparkles}
      />
    </div>
  );
}
