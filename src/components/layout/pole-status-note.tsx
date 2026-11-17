import React from "react";
import { Clock } from "lucide-react";

/* ── Note de statut d'un pôle hors périmètre V1 ─────────────────────────────

   Affichée en haut des pôles parqués (STRATEGIE.md / PLAN-V1.md, chantier C1) :
   boutique, lives, événements, apporteurs. Elle dit honnêtement que le pôle ne
   fait pas partie du lancement, plutôt que de le présenter comme une fonction
   active. Composant présentationnel, sans état ni client. Textes dans
   `@/content/common` (`PARKED_POLES`). */

export function PoleStatusNote({ label, note }: { label: string; note: string }) {
  return (
    <div
      role="note"
      className="mb-4 flex items-start gap-2.5 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3.5 py-2.5"
    >
      <Clock size={15} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0 text-[var(--primary)]" />
      <p className="text-[13px] leading-snug text-[var(--foreground)]/80">
        <span className="font-semibold text-[var(--foreground)]">{label} — bientôt.</span>{" "}
        {note}
      </p>
    </div>
  );
}
