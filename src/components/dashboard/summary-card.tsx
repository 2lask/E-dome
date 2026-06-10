import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* SummaryCard : card compacte avec un grand chiffre et un lien
   "Voir tout". Utilisee sur la Vue d'ensemble pour remplacer les
   tableaux complets (TopProperties, TopFormations, etc.) qui
   alourdissaient inutilement la home. */

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  href: string;
  tone?: "default" | "warning" | "success";
}

export function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
  href,
  tone = "default",
}: SummaryCardProps) {
  const chip =
    tone === "warning"
      ? "chip-warning-soft"
      : tone === "success"
      ? "chip-success-soft"
      : "bg-primary/10 text-primary";
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-colors hover:border-foreground/40">
        <CardContent className="flex h-full flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                chip,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold tabular-nums">{value}</p>
            {hint && (
              <p className="mt-1 truncate text-[11px] text-muted-foreground">
                {hint}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
