import { redirect } from "next/navigation";

/* ── UNE seule vérité pour les réservations (D8) ─────────────────────────────

   Cette page autonome inventait ses propres réservations et ses propres prix :
   une commission de 8 % (`revenue = total × 0.92`) là où le modèle applique
   12 % sur `location-ct`, et des montants sans lien avec le journal. L'audit a
   compté TROIS jeux de réservations incompatibles pour les mêmes biens.

   La vérité unique est `/dashboard/reservations`, dérivée du journal
   (`dashboard-data.dashboardReservations` → `derive.stays()`), où le montant
   d'une réservation vaut nuits × tarif du catalogue (invariant 18). Cette page
   n'existe plus que comme redirection, pour qu'aucun lien historique ne mène à
   un 404. */

export default function ReservationsPage() {
  redirect("/dashboard/reservations");
}
