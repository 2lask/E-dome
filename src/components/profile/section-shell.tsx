"use client";

import React from "react";
import { Plus, Pencil } from "lucide-react";

/* Carte de section réutilisable (À propos, Expériences, Formation…).
   Titre + actions (ajouter / éditer) visibles uniquement pour l'owner.
   Ajouter une nouvelle section = créer un composant qui rend <SectionShell>. */
export function SectionShell({
  title,
  isOwn,
  onAdd,
  onEdit,
  addLabel = "Ajouter",
  children,
}: {
  title: string;
  isOwn: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
  addLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
        {isOwn && (
          <div className="flex items-center gap-1">
            {onAdd && (
              <button
                onClick={onAdd}
                aria-label={addLabel}
                title={addLabel}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                <Plus size={19} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                aria-label="Modifier"
                title="Modifier"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                <Pencil size={17} />
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}

/* État vide encourageant (owner) ou discret (visiteur). */
export function SectionEmpty({
  isOwn,
  ownText,
  publicText,
  onAction,
  actionLabel,
}: {
  isOwn: boolean;
  ownText: string;
  publicText: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  if (!isOwn) return <p className="text-sm text-[var(--text-muted)]">{publicText}</p>;
  return (
    <div className="text-sm text-[var(--text-muted)]">
      <p>{ownText}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
