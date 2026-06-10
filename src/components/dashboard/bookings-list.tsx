import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { DataRow } from "@/components/ui/data-row";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { dashboardReservations, getProperty } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* BookingsList : reservations recentes. Refondu sur DataRow pour
   eliminer la duplication avec top-properties, top-formations, etc. */

const DATE_LABEL: Record<string, string> = {
  dr1: "Il y a 2h",
  dr2: "Il y a 5h",
  dr3: "Hier",
  dr5: "Il y a 2j",
  dr7: "Il y a 3j",
  dr9: "Il y a 6h",
};

export function BookingsList({ limit = 5 }: { limit?: number }) {
  const items = dashboardReservations
    .filter((r) => r.status !== "cancelled")
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Réservations récentes</CardTitle>
          <CardDescription>Dernières arrivées et confirmations</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/reservations">
            <Eye className="mr-2 h-4 w-4" />
            Voir tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((r) => {
          const property = getProperty(r.propertyId);
          const when = DATE_LABEL[r.id] ?? "Récemment";
          return (
            <DataRow
              key={r.id}
              leading={<Avatar name={r.guest} size="sm" />}
              title={r.guest}
              subtitle={`${property?.name} · ${r.dateLabel}`}
              trailing={
                <div className="flex items-center gap-3">
                  <StatusBadge status={r.status} />
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums">
                      +{formatNumber(r.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">{when}</p>
                  </div>
                </div>
              }
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
