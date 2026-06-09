import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* PageHeader global — utilisable partout (dashboard, marketing,
   pages app). Centralise les ~21 variantes ad-hoc page-heading
   text-2xl/3xl/4xl mb-6 dispersees. Slots : actions, breadcrumb. */

export type PageHeaderVariant = "default" | "serif" | "compact";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** CTA(s) a droite. */
  actions?: ReactNode;
  /** Breadcrumb au-dessus du titre. */
  breadcrumb?: ReactNode;
  /** Bouton retour optionnel (rendu en slot custom). */
  back?: ReactNode;
  /** Variante typographique. default = brutalist sans-serif ;
      serif = page-heading editorial ; compact = h2 plus discret. */
  variant?: PageHeaderVariant;
  className?: string;
}

const TITLE_CLS: Record<PageHeaderVariant, string> = {
  default: "text-2xl font-bold tracking-tight lg:text-3xl",
  serif: "page-heading text-3xl md:text-4xl",
  compact: "text-xl font-semibold tracking-tight",
};

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  back,
  variant = "default",
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-3", className)}>
      {back}
      {breadcrumb}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 min-w-0">
          <h1 className={TITLE_CLS[variant]}>{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
