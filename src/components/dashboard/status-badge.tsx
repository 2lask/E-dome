import { cn } from "@/lib/utils";

/* Libelles + couleurs centralises. Utilise les tokens semantiques
   du theme (chip-*-soft) plutot que des hex emerald/amber harcodes
   -> coherent en clair et sombre, et un seul endroit a changer. */
const STATUS: Record<string, { label: string; className: string }> = {
  confirmed: { label: "Confirmée", className: "chip-success-soft" },
  pending: { label: "En attente", className: "chip-warning-soft" },
  completed: { label: "Terminée", className: "bg-muted text-muted-foreground" },
  cancelled: { label: "Annulée", className: "chip-danger-soft" },
  published: { label: "Publiée", className: "chip-success-soft" },
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
