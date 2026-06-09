/* Adapte de SimpleBarList (shadcn-admin) : liste verticale de barres
   horizontales (name + valeur). Parfait pour "Top biens par revenus",
   "Top apporteurs", "Top sources de trafic". */

interface SimpleBarListProps {
  items: { name: string; value: number }[];
  valueFormatter?: (n: number) => string;
  /** Tailwind class pour la barre (bg-primary par defaut). */
  barClass?: string;
}

export function SimpleBarList({
  items,
  valueFormatter = (n) => String(n),
  barClass = "bg-primary",
}: SimpleBarListProps) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`;
        return (
          <li key={i.name} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 truncate text-xs text-muted-foreground">
                {i.name}
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted">
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className="ps-2 text-xs font-medium tabular-nums">
              {valueFormatter(i.value)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
