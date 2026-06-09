import { cn } from "@/lib/utils";

type DeltaTone = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string; // deja formate (ex: "2'400")
  unit?: string;
  delta?: string;
  deltaTone?: DeltaTone;
}

export function StatCard({ label, value, unit, delta, deltaTone = "up" }: StatCardProps) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <p className="mb-1.5 text-xs text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-medium tabular-nums">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        {delta && (
          <span
            className={cn(
              "text-xs",
              deltaTone === "up" && "text-emerald-600 dark:text-emerald-500",
              deltaTone === "down" && "text-destructive",
              deltaTone === "neutral" && "text-muted-foreground",
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
