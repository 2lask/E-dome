import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* KpiCardPremium : carte KPI riche, pattern dashboard-2.
   - CardDescription = label haut (petite muted)
   - CardTitle = grand chiffre tabular-nums
   - CardAction = Badge outline avec trend icon
   - CardFooter optionnel = phrase descriptive + sous-phrase
   - Gradient subtil from-primary/5 to-card via le wrapper */

export type Trend = "up" | "down" | "neutral";

interface KpiCardPremiumProps {
  label: string;
  value: string;
  /** Delta texte affiche dans le Badge (ex: "+12.5%"). */
  delta?: string;
  trend?: Trend;
  /** Phrase principale du footer. Optionnel. */
  footer?: string;
  /** Sous-phrase du footer (plus muted). Optionnel. */
  subfooter?: string;
}

export function KpiCardPremium({
  label,
  value,
  delta,
  trend = "up",
  footer,
  subfooter,
}: KpiCardPremiumProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums lg:text-3xl">
          {value}
        </CardTitle>
        {delta && (
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <TrendIcon className="h-3.5 w-3.5" />
              {delta}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {(footer || subfooter) && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {footer && (
            <div className="line-clamp-1 flex items-center gap-2 font-medium">
              {footer} <TrendIcon className="h-3.5 w-3.5" />
            </div>
          )}
          {subfooter && (
            <div className="text-xs text-muted-foreground">{subfooter}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

/* Grille standard 4 KPI cards avec gradient subtil applique aux
   enfants direct. A utiliser autour de 4 KpiCardPremium pour
   l'effet visuel dashboard-2. */
export function KpiGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}
