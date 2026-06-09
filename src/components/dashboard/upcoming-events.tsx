import Link from "next/link";
import {
  CalendarDays,
  Eye,
  MapPin,
  Sparkles,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { upcomingEvents, type EventKind } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* UpcomingEvents : prochains lives + visites + ateliers + evenements
   dans les 30 jours. Affiche taux de remplissage + CA previsionnel.
   Critique pour signaler "live demain a 19h, 87/120 places". */

const KIND_ICON: Record<EventKind, LucideIcon> = {
  live: Video,
  evenement: Sparkles,
  atelier: CalendarDays,
  visite: MapPin,
};

const KIND_LABEL: Record<EventKind, string> = {
  live: "Live",
  evenement: "Événement",
  atelier: "Atelier",
  visite: "Visite",
};

export function UpcomingEvents({ limit = 4 }: { limit?: number }) {
  const items = [...upcomingEvents]
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Prochainement</CardTitle>
          <CardDescription>
            Lives, ateliers et visites dans les 30 jours
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/annonces">
            <Eye className="mr-2 h-4 w-4" />
            Tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((e) => {
          const Icon = KIND_ICON[e.kind];
          const fillPct = Math.round((e.spotsTaken / e.spotsTotal) * 100);
          const urgent = e.daysUntil <= 2;
          return (
            <div
              key={e.id}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {KIND_LABEL[e.kind]}
                  </Badge>
                  <span
                    className={
                      urgent
                        ? "chip-warning-soft rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                        : "text-[11px] text-muted-foreground"
                    }
                  >
                    {e.whenLabel}
                  </span>
                </div>
                <p className="truncate text-sm font-medium">{e.title}</p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={fillPct}
                    className="h-1.5 flex-1 max-w-[160px]"
                  />
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {e.spotsTaken}/{e.spotsTotal}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                {e.price > 0 ? (
                  <>
                    <p className="text-sm font-medium tabular-nums">
                      {formatNumber(e.forecast)} CHF
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      prévisionnel
                    </p>
                  </>
                ) : (
                  <Badge variant="outline" className="text-[10px]">
                    Gratuit
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
