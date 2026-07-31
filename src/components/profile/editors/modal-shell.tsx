"use client";

import React, { useEffect } from "react";
import { X, Trash2 } from "lucide-react";

/* Coquille de modale d'édition réutilisée par toutes les sections du profil
   (À propos, Expériences, Formation, Compétences, Liens…). Overlay + panneau
   scrollable, header titre + fermeture, footer Annuler/Enregistrer (+ option
   Supprimer). Ferme sur Échap et clic hors panneau. */

export interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  /** Affiche un bouton Supprimer à gauche du footer (édition d'un élément). */
  onDelete?: () => void;
  children: React.ReactNode;
}

export function ModalShell({
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel = "Enregistrer",
  submitDisabled = false,
  onDelete,
  children,
}: ModalShellProps) {
  // Échap pour fermer + verrouille le scroll de l'arrière-plan.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--card-border)] shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--foreground)] truncate">{title}</h2>
            {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4">{children}</div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-[var(--card-border)] shrink-0">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--destructive)] hover:opacity-80 transition-opacity mr-auto"
            >
              <Trash2 size={15} /> Supprimer
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-full border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors ${onDelete ? "" : "ml-auto"}`}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitDisabled}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
