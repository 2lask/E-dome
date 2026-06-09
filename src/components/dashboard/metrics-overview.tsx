import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarCheck,
  Users,
  Activity,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/lib/dashboard-data";
import { formatNumber, formatPercent } from "@/lib/format";

/* MetricsOverview : 4 KPI cards en grid. Pattern dashboard-2 :
   - CardDescription en label haut (petite muted)
   - CardTitle en GROS chiffre (tabular-nums)
   - CardAction avec Badge variant outline + trend icon
   - CardFooter avec phrase descriptive + sous-phrase
   - Background gradient subtil from-primary/5 to-card */

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: typeof DollarSign;
  footer: string;
  subfooter: string;
}

export function MetricsOverview() {
  const { kpis } = dashboard;

  const metrics: Metric[] = [
    {
      title: "Revenus du mois",
      value: `${formatNumber(kpis.revenue)} CHF`,
      change: kpis.revenueDelta,
      trend: "up",
      icon: DollarSign,
      footer: "En hausse ce mois",
      subfooter: "Revenus des 30 derniers jours",
    },
    {
      title: "Réservations",
      value: formatNumber(kpis.reservations),
      change: kpis.reservationsDelta,
      trend: "up",
      icon: CalendarCheck,
      footer: "Forte demande locative",
      subfooter: "Cumul confirmées + à venir",
    },
    {
      title: "Commissions apporteur",
      value: `${formatNumber(kpis.commissions)} CHF`,
      change: kpis.commissionsDelta,
      trend: "up",
      icon: Users,
      footer: "Reseau d'apporteurs actif",
      subfooter: "Versées + en attente",
    },
    {
      title: "Taux d'occupation",
      value: formatPercent(kpis.occupancy),
      change: kpis.occupancyDelta,
      trend: "up",
      icon: Activity,
      footer: "Performance des biens",
      subfooter: "Moyenne sur le portefeuille",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        const FooterIcon = TrendIcon;
        return (
          <Card key={metric.title}>
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums lg:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className="gap-1">
                  <TrendIcon className="h-3.5 w-3.5" />
                  {metric.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex items-center gap-2 font-medium">
                {metric.footer} <FooterIcon className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.subfooter}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
