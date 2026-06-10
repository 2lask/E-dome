import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Download,
  Plus,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  dashboardUser,
  dashboardReservations,
  reviewsSummary,
  kpis,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* DashboardHero : bandeau d'accueil personnalise. Donne un signal
   visuel fort : tu sais qui tu es, ce qui demande ton attention
   aujourd'hui, et tu peux exporter / publier en 1 clic.
   Inspire des pattern "command center" Hostaway / Smoobu. */

export function DashboardHero() {
  const pending = dashboardReservations.filter((r) => r.status === "pending")
    .length;
  const totalAttention = pending + reviewsSummary.pendingResponse;

  /* On evite Date.now() pour rester compatible SSR statique :
     "Bonjour" + prenom. */
  const firstName = dashboardUser.firstName ?? "Léo";

  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/8 via-card to-card p-6 md:p-8">
      {/* Halo decoratif */}
      <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            Bonjour {firstName} 👋
          </p>
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Vous avez {formatNumber(kpis.activeListings)} annonces actives
            <br className="hidden md:block" />
            et {formatNumber(Math.round(kpis.forecast30d))} CHF prévisionnels.
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {totalAttention > 0 ? (
              <>
                <strong className="font-medium text-foreground">
                  {totalAttention} action{totalAttention > 1 ? "s" : ""} demande
                  {totalAttention > 1 ? "nt" : ""}
                </strong>{" "}
                votre attention aujourd&apos;hui — {pending} réservation
                {pending > 1 ? "s" : ""} en attente, {reviewsSummary.pendingResponse}{" "}
                avis à répondre.
              </>
            ) : (
              <>Tout est à jour. Profitez-en pour planifier votre prochaine action.</>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" asChild>
            <Link href="/publier">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>
        </div>
      </div>

      {/* Actions rapides contextuelles */}
      {totalAttention > 0 && (
        <div className="relative mt-6 flex flex-wrap gap-2">
          {pending > 0 && (
            <Link
              href="/dashboard/reservations"
              className="inline-flex items-center gap-1.5 rounded-md border bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors hover:bg-background"
            >
              <Calendar className="h-3.5 w-3.5 text-warning" />
              Traiter {pending} réservation{pending > 1 ? "s" : ""} en attente
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
          {reviewsSummary.pendingResponse > 0 && (
            <Link
              href="/dashboard/avis"
              className="inline-flex items-center gap-1.5 rounded-md border bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors hover:bg-background"
            >
              <Star className="h-3.5 w-3.5 text-rating" />
              Répondre à {reviewsSummary.pendingResponse} avis
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
