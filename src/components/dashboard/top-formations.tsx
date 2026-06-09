import Link from "next/link";
import { Eye, GraduationCap, Star, TrendingUp } from "lucide-react";
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
import { formations } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* TopFormations : equivalent de TopProperties pour les formations.
   Meme densite visuelle pour pouvoir cohabiter en grid 2-cols. */

export function TopFormations() {
  const ranked = [...formations].sort((a, b) => b.monthRevenue - a.monthRevenue);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Top formations</CardTitle>
          <CardDescription>Meilleures ventes ce mois</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/annonces">
            <Eye className="mr-2 h-4 w-4" />
            Voir tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {ranked.map((f, index) => (
          <div
            key={f.id}
            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              #{index + 1}
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{f.title}</p>
                  <Badge variant="outline" className="gap-1 text-[10px] font-normal">
                    <GraduationCap className="h-3 w-3" />
                    {f.price} CHF
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-rating text-rating" />
                    <span className="tabular-nums">{f.rating.toFixed(1)}</span>
                  </span>
                  <span>•</span>
                  <span className="tabular-nums">
                    {f.studentsThisMonth} élèves ce mois
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(f.monthRevenue)} CHF
                  </span>
                  <Badge
                    variant="outline"
                    className="gap-1 border-success/30 text-success tabular-nums"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {f.monthGrowth}
                  </Badge>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {Math.round(f.completionRate * 100)}% complétion
                  </span>
                  <Progress
                    value={f.completionRate * 100}
                    className="h-1 w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
