"use client";

import { useState, useMemo } from "react";
import {
  Check,
  X,
  Search as SearchIcon,
  CalendarSearch,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { FilterChip } from "@/components/ui/filter-chip";
import { formatNumber } from "@/lib/format";
import {
  dashboardReservations as seed,
  getProperty,
  type Reservation,
  type ReservationStatus,
} from "@/lib/dashboard-data";

/* /dashboard/reservations : style premium coherent. */

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

  const confirmedPct = Math.round(
    (counts.confirmed / Math.max(1, counts.total)) * 100,
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Réservations"
        description="Suivi et gestion de toutes vos réservations"
      />

      <KpiGrid>
        <KpiCardPremium
          label="Total"
          value={String(counts.total)}
          delta={`${formatNumber(totalRevenue)} CHF`}
          trend="neutral"
          footer="Revenus générés"
          subfooter="Confirmées + terminées"
        />
        <KpiCardPremium
          label="Confirmées"
          value={String(counts.confirmed)}
          delta={`${confirmedPct}%`}
          trend="up"
          footer="Taux de confirmation"
          subfooter="Du total des réservations"
        />
        <KpiCardPremium
          label="En attente"
          value={String(counts.pending)}
          delta={counts.pending > 0 ? "Action requise" : "À jour"}
          trend={counts.pending > 0 ? "neutral" : "up"}
          footer={counts.pending > 0 ? "À traiter rapidement" : "Aucune action"}
          subfooter="Demandes non confirmées"
        />
        <KpiCardPremium
          label="Annulées"
          value={String(counts.cancelled)}
          delta={`${Math.round((counts.cancelled / Math.max(1, counts.total)) * 100)}%`}
          trend="down"
          footer="Taux d'annulation"
          subfooter="À surveiller si > 10%"
        />
      </KpiGrid>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Liste des réservations</CardTitle>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Guest, bien, ville..."
              className="w-64"
              leadingIcon={SearchIcon}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
                count={
                  f.value === "all"
                    ? undefined
                    : f.value === "confirmed"
                    ? counts.confirmed
                    : f.value === "pending"
                    ? counts.pending
                    : f.value === "cancelled"
                    ? counts.cancelled
                    : items.filter((r) => r.status === f.value).length
                }
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {visible.length === 0 ? (
            <EmptyState
              icon={CalendarSearch}
              title={search ? `Aucune réservation pour "${search}"` : "Aucune réservation"}
              description={
                search
                  ? "Modifiez votre recherche ou changez de filtre."
                  : "Cette catégorie est vide pour le moment."
              }
            />
          ) : (
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
                        <span className="text-xs font-normal text-muted-foreground">
                          CHF
                        </span>
                      </p>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
