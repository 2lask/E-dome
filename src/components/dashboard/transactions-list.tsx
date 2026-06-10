"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Handshake,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilterChip } from "@/components/ui/filter-chip";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  transactions,
  type TransactionKind,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* TransactionsList : liste des paiements/virements/commissions/
   remboursements. Filtre par kind. Format suisse (formatNumber =
   apostrophe). Tokens chip-*-soft via StatusBadge.

   AVANT cette liste etait sur la home /dashboard, ce qui en
   faisait du detail financier au mauvais endroit. Maintenant elle
   vit dans /dashboard/revenus (sous le chart). */

type KindFilter = TransactionKind | "all";

const KIND_LABEL: Record<KindFilter, string> = {
  all: "Toutes",
  reservation: "Paiements",
  payout: "Virements",
  commission: "Commissions",
  refund: "Remboursements",
};

const KIND_ICON: Record<TransactionKind, LucideIcon> = {
  reservation: Receipt,
  payout: ArrowUpRight,
  commission: Handshake,
  refund: ArrowDownLeft,
};

const KIND_CHIP: Record<TransactionKind, string> = {
  reservation: "bg-primary/10 text-primary",
  payout: "chip-success-soft",
  commission: "bg-muted text-muted-foreground",
  refund: "chip-danger-soft",
};

const FILTERS: KindFilter[] = ["all", "reservation", "payout", "commission", "refund"];

export function TransactionsList() {
  const [filter, setFilter] = useState<KindFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.kind === filter);
  }, [filter]);

  const counts = useMemo(() => {
    const c: Record<KindFilter, number> = {
      all: transactions.length,
      reservation: 0,
      payout: 0,
      commission: 0,
      refund: 0,
    };
    transactions.forEach((t) => {
      c[t.kind] += 1;
    });
    return c;
  }, []);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          Paiements, virements, commissions et remboursements
        </CardDescription>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <FilterChip
              key={f}
              active={filter === f}
              onClick={() => setFilter(f)}
              count={counts[f]}
            >
              {KIND_LABEL[f]}
            </FilterChip>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            Aucune transaction sur cette catégorie.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((t) => {
              const Icon = KIND_ICON[t.kind];
              const positive = t.amount > 0;
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                      KIND_CHIP[t.kind],
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.sublabel}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "text-sm font-medium tabular-nums",
                        !positive && "text-destructive",
                      )}
                    >
                      {positive ? "+" : ""}
                      {formatNumber(t.amount)} CHF
                    </p>
                    <div className="mt-0.5 flex justify-end">
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
