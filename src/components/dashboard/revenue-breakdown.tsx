import {
  Building2,
  GraduationCap,
  Handshake,
  Sparkles,
  Briefcase,
  ShoppingBag,
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
import { revenueBySource, type RevenueSourceKey } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* RevenueBreakdown : mix des 7 sources de revenus du mois courant.
   Stylise comme une SimpleBarList enrichie : icone par source +
   barre + montant + pourcentage du mix. Donne du sens au "multi-
   revenu" en un coup d'oeil. */

const ICON: Record<RevenueSourceKey, LucideIcon> = {
  biens: Building2,
  formations: GraduationCap,
  boutique: ShoppingBag,
  lives: Video,
  evenements: Sparkles,
  services: Briefcase,
  apporteurs: Handshake,
};

export function RevenueBreakdown() {
  const items = [...revenueBySource].sort((a, b) => b.value - a.value);
  const total = items.reduce((s, i) => s + i.value, 0);
  const max = items[0]?.value ?? 1;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Mix des revenus</CardTitle>
        <CardDescription>
          Répartition des {formatNumber(total)} CHF ce mois
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3.5">
        {items.map((item) => {
          const Icon = ICON[item.key];
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const width = max > 0 ? `${(item.value / max) * 100}%` : "0%";
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 tabular-nums">
                  <span className="text-muted-foreground">
                    {pct.toFixed(1)}%
                  </span>
                  <span className="font-medium">
                    {formatNumber(item.value)} CHF
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
