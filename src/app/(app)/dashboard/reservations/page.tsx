"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatNumber } from "@/lib/format";
import {
  dashboardReservations as seed,
  getProperty,
  type Reservation,
  type ReservationStatus,
} from "@/lib/dashboard-data";

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

  const counts = {
    total: items.length,
    confirmed: items.filter((r) => r.status === "confirmed").length,
    pending: items.filter((r) => r.status === "pending").length,
    cancelled: items.filter((r) => r.status === "cancelled").length,
  };

  const visible = filter === "all" ? items : items.filter((r) => r.status === filter);

  function setStatus(id: string, status: ReservationStatus) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-medium">Réservations</h1>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard label="Total" value={formatNumber(counts.total)} deltaTone="neutral" />
        <StatCard label="Confirmées" value={formatNumber(counts.confirmed)} deltaTone="neutral" />
        <StatCard label="En attente" value={formatNumber(counts.pending)} deltaTone="neutral" />
        <StatCard label="Annulées" value={formatNumber(counts.cancelled)} deltaTone="neutral" />
      </div>

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
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {visible.map((r) => {
          const p = getProperty(r.propertyId);
          return (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                {p?.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p?.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {r.guest} · {r.dateLabel}
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
            Aucune réservation dans cette catégorie.
          </div>
        )}
      </div>
    </div>
  );
}
