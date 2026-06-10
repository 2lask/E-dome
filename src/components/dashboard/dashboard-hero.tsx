import Link from "next/link";
import { ArrowRight, Calendar, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  dashboardUser,
  dashboardReservations,
  reviewsSummary,
} from "@/lib/dashboard-data";

/* DashboardHero ALLEGE (blueprint monochrome).
   Avant : salutation + grand titre stat (annonces + previsionnels)
   + ligne attention + 2 boutons (Exporter + Nouvelle annonce) + 2
   chips d'action. C'etait surcharge et les stats se repetaient
   dans les KPI cards juste en dessous.

   Apres : salutation mono, UNE ligne de priorite du jour, UN
   bouton primaire (Nouvelle annonce), et les chips d'actions
   d'attention. L'export vit dans la section Revenus uniquement. */

export function DashboardHero() {
  const pending = dashboardReservations.filter((r) => r.status === "pending")
    .length;
  const totalAttention = pending + reviewsSummary.pendingResponse;
  const firstName = dashboardUser.firstName ?? "Léo";

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1 min-w-0">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Bonjour {firstName}
          </p>
          <p className="max-w-xl text-base text-foreground md:text-lg">
            {totalAttention > 0 ? (
              <>
                <span className="font-medium">
                  {totalAttention} action{totalAttention > 1 ? "s" : ""} demande
                  {totalAttention > 1 ? "nt" : ""}
                </span>{" "}
                votre attention aujourd&apos;hui.
              </>
            ) : (
              <>
                <span className="font-medium">Tout est à jour.</span> Profitez-en
                pour planifier votre prochaine action.
              </>
            )}
          </p>
        </div>

        <Button size="sm" asChild>
          <Link href="/publier">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      {/* Chips d'actions contextuelles : restent pour donner un
          point d'entree direct. La bande d'alertes du cockpit ne
          duplique plus ce contenu (elle n'affiche que les
          commissions, info absente d'ici). */}
      {totalAttention > 0 && (
        <div className="flex flex-wrap gap-2">
          {pending > 0 && (
            <Link
              href="/dashboard/reservations"
              className="chip-warning-soft inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            >
              <Calendar className="h-3.5 w-3.5" />
              Traiter {pending} réservation{pending > 1 ? "s" : ""} en attente
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
          {reviewsSummary.pendingResponse > 0 && (
            <Link
              href="/dashboard/avis"
              className="chip-warning-soft inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            >
              <Star className="h-3.5 w-3.5" />
              Répondre à {reviewsSummary.pendingResponse} avis
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
