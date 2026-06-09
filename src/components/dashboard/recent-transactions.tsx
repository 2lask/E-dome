import { CalendarCheck, Landmark, Users, Undo2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { StatusBadge } from "./status-badge";
import type { Transaction, TransactionKind } from "@/lib/dashboard-data";

const ICONS: Record<TransactionKind, LucideIcon> = {
  reservation: CalendarCheck,
  payout: Landmark,
  commission: Users,
  refund: Undo2,
};

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="flex flex-col gap-4">
      {transactions.map((t) => {
        const Icon = ICONS[t.kind];
        const negative = t.amount < 0;
        return (
          <div key={t.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{t.label}</p>
              <p className="truncate text-xs text-muted-foreground">{t.sublabel}</p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-medium tabular-nums",
                  negative ? "text-destructive" : "text-foreground",
                )}
              >
                {negative ? "−" : "+"}
                {formatNumber(Math.abs(t.amount))}
              </p>
              <StatusBadge status={t.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
