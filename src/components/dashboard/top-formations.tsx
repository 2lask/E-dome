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
import { DataRow } from "@/components/ui/data-row";
import { formations } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

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
          <DataRow
            key={f.id}
            leading={
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                #{index + 1}
              </div>
            }
            title={f.title}
            meta={
              <Badge variant="outline" className="gap-1 text-[10px] font-normal">
                <GraduationCap className="h-3 w-3" />
                {f.price} CHF
              </Badge>
            }
            subtitle={
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-rating text-rating" />
                  <span className="tabular-nums">{f.rating.toFixed(1)}</span>
                </span>
                <span>•</span>
                <span className="tabular-nums">
                  {f.studentsThisMonth} élèves ce mois
                </span>
              </span>
            }
            trailing={
              <div className="space-y-1">
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
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
