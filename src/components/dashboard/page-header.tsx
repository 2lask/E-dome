import type { ReactNode } from "react";

/* Header standardise pour toutes les pages dashboard.
   - H1 + sous-titre + slot actions a droite, espacement identique
   - Aligne les 5 variantes ad-hoc qui existaient (space-y-1 vs mt-1,
     wrappers vides, weights divergents). */

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1 min-w-0">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
