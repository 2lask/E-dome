import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* DataRow : la "ligne" partagee par toutes les listes du dashboard
   (bookings, top-properties, top-formations, upcoming-events,
   boutique-alerts, leaderboard apporteurs). 4 slots :
   - leading : visuel a gauche (Avatar, IconCircle, RankBadge)
   - title : nom principal (truncate)
   - meta : badges inline a cote du titre
   - subtitle : ligne grise sous le titre
   - trailing : zone droite (montant, status, progress) */

interface DataRowProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  align?: "center" | "start";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function DataRow({
  leading,
  title,
  meta,
  subtitle,
  trailing,
  align = "center",
  href,
  onClick,
  className,
}: DataRowProps) {
  const interactive = !!(href || onClick);
  const content = (
    <>
      {leading && <div className="shrink-0">{leading}</div>}
      <div
        className={cn(
          "flex flex-1 flex-wrap items-center justify-between gap-3 min-w-0",
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium">{title}</div>
            {meta}
          </div>
          {subtitle && (
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
        {trailing && (
          <div className="shrink-0 text-right">{trailing}</div>
        )}
      </div>
    </>
  );

  const cls = cn(
    "flex gap-3 rounded-lg border p-3 transition-colors",
    align === "start" ? "items-start" : "items-center",
    interactive && "hover:bg-muted/40 hover:border-foreground/30",
    !interactive && "hover:bg-muted/40",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cls, "w-full text-left")}>
        {content}
      </button>
    );
  }
  return <div className={cls}>{content}</div>;
}
