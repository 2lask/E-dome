import Link from "next/link";
import { Eye, Star, TrendingUp } from "lucide-react";
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
import { DataRow } from "@/components/ui/data-row";
import { properties as dashboardProperties } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* TopProperties : liste rankee de biens. Refondu sur DataRow,
   avec RankBadge custom en leading. */

export function TopProperties() {
  const ranked = [...dashboardProperties].sort(
    (a, b) => b.monthRevenue - a.monthRevenue,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Top biens</CardTitle>
          <CardDescription>Meilleurs performeurs ce mois</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/annonces">
            <Eye className="mr-2 h-4 w-4" />
            Voir tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {ranked.map((p, index) => (
          <DataRow
            key={p.id}
            leading={
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                #{index + 1}
              </div>
            }
            title={p.name}
            meta={
              <Badge variant="outline" className="text-[10px] font-normal">
                {p.city}
              </Badge>
            }
            subtitle={
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-rating text-rating" />
                  <span className="tabular-nums">{p.rating.toFixed(1)}</span>
                </span>
                <span>•</span>
                <span className="tabular-nums">
                  {formatNumber(p.views)} vues
                </span>
              </span>
            }
            trailing={
              <div className="space-y-1">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(p.monthRevenue)} CHF
                  </span>
                  <Badge
                    variant="outline"
                    className="gap-1 border-success/30 text-success tabular-nums"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {p.monthGrowth}
                  </Badge>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {Math.round(p.occupancy * 100)}% occup.
                  </span>
                  <Progress value={p.occupancy * 100} className="h-1 w-20" />
                </div>
              </div>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
