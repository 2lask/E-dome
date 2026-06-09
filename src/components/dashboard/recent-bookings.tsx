import { Avatar } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/format";
import { dashboardReservations, getProperty } from "@/lib/dashboard-data";

/* Adapte de RecentSales (shadcn-admin) au domaine immobilier : la
   liste affiche les dernieres reservations (guest avatar + nom +
   bien/dates + montant +). On reutilise les donnees existantes pour
   garder la coherence des chiffres. */

export function RecentBookings({ limit = 5 }: { limit?: number }) {
  const items = dashboardReservations
    .filter((r) => r.status !== "cancelled")
    .slice(0, limit);

  return (
    <div className="space-y-6">
      {items.map((r) => {
        const property = getProperty(r.propertyId);
        return (
          <div key={r.id} className="flex items-center gap-4">
            <Avatar name={r.guest} size="sm" />
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm leading-none font-medium">{r.guest}</p>
                <p className="text-sm text-muted-foreground">
                  {property?.name} · {r.dateLabel}
                </p>
              </div>
              <div className="text-sm font-medium tabular-nums">
                +{formatNumber(r.amount)}{" "}
                <span className="text-xs font-normal text-muted-foreground">CHF</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
