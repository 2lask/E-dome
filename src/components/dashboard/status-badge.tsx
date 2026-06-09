import { cn } from "@/lib/utils";

/* Libelles + couleurs centralises -> accents corrects et coherents
   partout (fini "Termine"/"Confirmee" sans accent sur certaines pages). */
const STATUS: Record<string, { label: string; className: string }> = {
  confirmed: { label: "Confirmée", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  pending: { label: "En attente", className: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  completed: { label: "Terminée", className: "bg-muted text-muted-foreground" },
  cancelled: { label: "Annulée", className: "bg-destructive/10 text-destructive" },
  published: { label: "Publiée", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  draft: { label: "Brouillon", className: "bg-muted text-muted-foreground" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}
