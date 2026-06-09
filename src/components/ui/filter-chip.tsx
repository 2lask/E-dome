import * as React from "react";
import { cn } from "@/lib/utils";

/* FilterChip : chip toggle utilise en barres de filtres
   (reservations, annonces, publier). Pattern aria-pressed,
   count optionnel a droite. */

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  count?: number | string;
  children: React.ReactNode;
  variant?: "solid" | "pill";
  className?: string;
}

export function FilterChip({
  active,
  onClick,
  count,
  children,
  variant = "solid",
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "pill"
          ? "rounded-full px-3 py-1.5 font-medium"
          : "rounded-md px-3 py-1.5",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
      {count !== undefined && (
        <span className="tabular-nums opacity-70">{count}</span>
      )}
    </button>
  );
}
