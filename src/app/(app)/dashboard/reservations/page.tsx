"use client";

import { useState, useMemo } from "react";
import {
  Check,
  X,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Search as SearchIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { KpiCardIcon } from "@/components/dashboard/kpi-card-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import {
  dashboardReservations as seed,
  getProperty,
  type Reservation,
  type ReservationStatus,
} from "@/lib/dashboard-data";

/* Refonte Reservations : KpiCardIcon (Total / Confirmees / Pending /
   Annulees) + recherche + filtres + liste avec Avatar guest. Style
   shadcn-admin + brutaliste. */

type Filter = "all" | ReservationStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "confirmed", label: "Confirmée" },
  { value: "pending", label: "En attente" },
  { value: "completed", label: "Terminée" },
  { value: "cancelled", label: "Annulée" },
];

export default function ReservationsPage() {
  const [items, setItems] = useState<Reservation[]>(seed);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      total: items.length,
      confirmed: items.filter((r) => r.status === "confirmed").length,
      pending: items.filter((r) => r.status === "pending").length,
      cancelled: items.filter((r) => r.status === "cancelled").length,
    }),
    [items],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      const property = getProperty(r.propertyId);
      return (
        r.guest.toLowerCase().includes(q) ||
        property?.name.toLowerCase().includes(q) ||
        property?.city.toLowerCase().includes(q)
      );
    });
  }, [items, filter, search]);

  function setStatus(id: string, status: ReservationStatus) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const totalRevenue = items
    .filter((r) => r.status === "confirmed" || r.status === "completed")
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Réservations</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Suivi et gestion de toutes vos réservations
          </p>
        </div>
      </div>

      {/* 4 KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardIcon
          title="Total"
          value={String(counts.total)}
          delta={`${formatNumber(totalRevenue)} CHF generes`}
          icon={CalendarCheck}
          deltaTone="neutral"
        />
        <KpiCardIcon
          title="Confirmées"
          value={String(counts.confirmed)}
          delta={`${Math.round((counts.confirmed / Math.max(1, counts.total)) * 100)}% du total`}
          icon={Check}
          deltaTone="up"
        />
        <KpiCardIcon
          title="En attente"
          value={String(counts.pending)}
          delta={counts.pending > 0 ? "Action requise" : "Aucune"}
          icon={CalendarClock}
          deltaTone={counts.pending > 0 ? "neutral" : "up"}
        />
        <KpiCardIcon
          title="Annulées"
          value={String(counts.cancelled)}
          delta={`${Math.round((counts.cancelled / Math.max(1, counts.total)) * 100)}% du total`}
          icon={CalendarX}
          deltaTone="down"
        />
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">Liste des réservations</CardTitle>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher guest, bien, ville..."
                className="h-9 w-64 rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          {/* Filtres pills */}
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs transition-colors",
                  filter === f.value
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                {f.value !== "all" && (
                  <span className="ml-1.5 tabular-nums opacity-70">
                    {f.value === "confirmed"
                      ? counts.confirmed
                      : f.value === "pending"
                      ? counts.pending
                      : f.value === "cancelled"
                      ? counts.cancelled
                      : items.filter((r) => r.status === f.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2.5">
            {visible.map((r) => {
              const p = getProperty(r.propertyId);
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3 sm:p-4"
                >
                  <Avatar name={r.guest} size="md" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.guest}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p?.name} · {r.dateLabel}
                    </p>
                  </div>

                  {r.status === "pending" && (
                    <div className="hidden gap-1.5 sm:flex">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => setStatus(r.id, "confirmed")}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-muted-foreground"
                        aria-label="Refuser la réservation"
                        onClick={() => setStatus(r.id, "cancelled")}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium tabular-nums">
                      {formatNumber(r.amount)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">CHF</span>
                    </p>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              );
            })}

            {visible.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                {search
                  ? `Aucune réservation pour "${search}".`
                  : "Aucune réservation dans cette catégorie."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
