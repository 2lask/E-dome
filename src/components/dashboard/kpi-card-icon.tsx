import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* KPI card pattern shadcn-admin : titre + icone a droite + grand
   chiffre + sous-titre delta. Icone discrete (h-4 w-4 muted) — c'est
   le chiffre qui domine. */

interface KpiCardIconProps {
  title: string;
  value: string; // deja formate ("24'850" ou "+12.4%")
  delta?: string; // "+20.1% from last month" ou "+18s vs last week"
  icon: LucideIcon;
  deltaTone?: "up" | "down" | "neutral";
}

export function KpiCardIcon({
  title,
  value,
  delta,
  icon: Icon,
  deltaTone = "up",
}: KpiCardIconProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {delta && (
          <p
            className={cn(
              "text-xs",
              deltaTone === "up" && "text-emerald-600 dark:text-emerald-500",
              deltaTone === "down" && "text-destructive",
              deltaTone === "neutral" && "text-muted-foreground",
            )}
          >
            {delta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
