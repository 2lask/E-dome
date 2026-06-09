"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dashboardReservations,
  properties as allProperties,
  type Reservation,
  type ReservationStatus,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

/* MultiPropertyCalendar : grille jours x biens pour visualiser
   l'occupation d'un mois. Lignes = biens, colonnes = jours, cellule
   coloree quand une reservation occupe le jour. Mois navigable.
   Style brutalist : pas de borders fantaisie, juste grille stricte. */

const STATUS_BG: Record<ReservationStatus, string> = {
  confirmed: "bg-success/30 hover:bg-success/50",
  pending: "bg-warning/30 hover:bg-warning/50",
  completed: "bg-muted hover:bg-muted-foreground/30",
  cancelled: "bg-danger/20 hover:bg-danger/40 opacity-50",
};

const STATUS_DOT: Record<ReservationStatus, string> = {
  confirmed: "bg-success",
  pending: "bg-warning",
  completed: "bg-muted-foreground",
  cancelled: "bg-danger",
};

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/* Construit l'index ISO d'un jour pour un mois donne. */
function isoDay(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/* Numero du jour de la semaine (lundi=0..dimanche=6) pour un ISO. */
function weekdayIndex(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return (d.getDay() + 6) % 7;
}

interface MultiPropertyCalendarProps {
  /** Mois initialement affiche. */
  initialYear?: number;
  initialMonth?: number; // 0-11
}

export function MultiPropertyCalendar({
  initialYear = 2026,
  initialMonth = 5, // juin
}: MultiPropertyCalendarProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [hovered, setHovered] = useState<Reservation | null>(null);

  const numDays = daysInMonth(year, month);
  const days = Array.from({ length: numDays }, (_, i) => i + 1);

  const monthIso = `${year}-${String(month + 1).padStart(2, "0")}`;

  /* Reservations qui touchent ce mois. */
  const monthReservations = useMemo(() => {
    return dashboardReservations.filter((r) => {
      return r.startDate.startsWith(monthIso) || r.endDate.startsWith(monthIso);
    });
  }, [monthIso]);

  /* Pour chaque bien, mapping day -> reservation. */
  const occupationByProperty = useMemo(() => {
    const map: Record<string, Record<number, Reservation>> = {};
    allProperties.forEach((p) => {
      map[p.id] = {};
    });
    monthReservations.forEach((r) => {
      const start = new Date(r.startDate + "T00:00:00");
      const end = new Date(r.endDate + "T00:00:00");
      const cur = new Date(start);
      while (cur < end) {
        if (cur.getFullYear() === year && cur.getMonth() === month) {
          const d = cur.getDate();
          if (map[r.propertyId]) {
            map[r.propertyId][d] = r;
          }
        }
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [monthReservations, year, month]);

  /* Stats du mois. */
  const monthStats = useMemo(() => {
    let occupied = 0;
    const totalSlots = allProperties.length * numDays;
    allProperties.forEach((p) => {
      occupied += Object.keys(occupationByProperty[p.id] ?? {}).length;
    });
    const occRate = (occupied / Math.max(1, totalSlots)) * 100;
    const revenue = monthReservations
      .filter((r) => r.status !== "cancelled")
      .reduce((s, r) => s + r.amount, 0);
    return {
      occRate,
      revenue,
      bookings: monthReservations.length,
    };
  }, [occupationByProperty, monthReservations, numDays]);

  function prev() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }
  function next() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            {MONTHS[month]} {year}
          </CardTitle>
          <CardDescription>
            {monthStats.bookings} réservation{monthStats.bookings > 1 ? "s" : ""}
            {" · "}
            {monthStats.occRate.toFixed(0)}% occupation
            {" · "}
            {monthStats.revenue.toLocaleString("fr-CH")} CHF
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setYear(initialYear);
              setMonth(initialMonth);
            }}
          >
            Aujourd&apos;hui
          </Button>
          <Button variant="outline" size="sm" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div
            className="grid gap-px text-xs"
            style={{
              gridTemplateColumns: `minmax(140px, 1fr) repeat(${numDays}, minmax(28px, 1fr))`,
            }}
          >
            {/* Header : jours */}
            <div className="sticky left-0 bg-card py-2 text-[11px] font-medium text-muted-foreground">
              Bien / Jour
            </div>
            {days.map((d) => {
              const wIdx = weekdayIndex(isoDay(year, month, d));
              const isWeekend = wIdx >= 5;
              return (
                <div
                  key={`h-${d}`}
                  className={cn(
                    "py-1 text-center font-medium",
                    isWeekend ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <div className="text-[10px]">{WEEKDAYS[wIdx]}</div>
                  <div className="tabular-nums">{d}</div>
                </div>
              );
            })}

            {/* Rows : 1 par bien */}
            {allProperties.map((p) => (
              <RowProperty
                key={p.id}
                propertyName={p.name}
                propertyCity={p.city}
                days={days}
                occupation={occupationByProperty[p.id] ?? {}}
                year={year}
                month={month}
                onHover={setHovered}
              />
            ))}
          </div>
        </div>

        {/* Legende statuts */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <Legend className="bg-success/40" label="Confirmé" />
          <Legend className="bg-warning/40" label="En attente" />
          <Legend className="bg-muted" label="Terminé" />
          <Legend className="bg-danger/30 opacity-50" label="Annulé" />
        </div>

        {/* Detail reservation survolee */}
        {hovered && (
          <div className="mt-4 rounded-lg border bg-muted/30 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{hovered.guest}</p>
                <p className="text-xs text-muted-foreground">
                  {hovered.dateLabel} · {hovered.nights} nuits
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    hovered.status === "confirmed"
                      ? "success"
                      : hovered.status === "pending"
                      ? "warning"
                      : hovered.status === "cancelled"
                      ? "danger"
                      : "info"
                  }
                  shape="square"
                >
                  <span
                    className={cn(
                      "mr-1.5 h-1.5 w-1.5 rounded-full",
                      STATUS_DOT[hovered.status],
                    )}
                  />
                  {hovered.status}
                </Badge>
                <span className="text-sm font-medium tabular-nums">
                  {hovered.amount.toLocaleString("fr-CH")} CHF
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RowProperty({
  propertyName,
  propertyCity,
  days,
  occupation,
  year,
  month,
  onHover,
}: {
  propertyName: string;
  propertyCity: string;
  days: number[];
  occupation: Record<number, Reservation>;
  year: number;
  month: number;
  onHover: (r: Reservation | null) => void;
}) {
  return (
    <>
      <div className="sticky left-0 z-10 flex items-center justify-between gap-2 bg-card py-1.5 pr-2 text-xs">
        <div className="min-w-0">
          <p className="truncate font-medium">{propertyName}</p>
          <p className="truncate text-[10px] text-muted-foreground">
            {propertyCity}
          </p>
        </div>
      </div>
      {days.map((d) => {
        const reservation = occupation[d];
        const wIdx = weekdayIndex(isoDay(year, month, d));
        const isWeekend = wIdx >= 5;
        return (
          <div
            key={d}
            className={cn(
              "relative h-9 cursor-default border-l border-border/30 transition-colors",
              isWeekend && !reservation && "bg-muted/20",
              reservation && STATUS_BG[reservation.status],
            )}
            onMouseEnter={() => reservation && onHover(reservation)}
            onMouseLeave={() => onHover(null)}
            title={
              reservation
                ? `${reservation.guest} · ${reservation.dateLabel}`
                : undefined
            }
          />
        );
      })}
    </>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("inline-block h-3 w-3 rounded-sm", className)} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
