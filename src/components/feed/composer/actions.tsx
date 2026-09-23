"use client";
import React from "react";


export interface ComposerActionProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
  badge?: boolean;
}

/* Bouton-icône du composer (Photo/Vidéo, Bien, Formation, Événement, Analyse).
   `badge` ajoute un point bleu pour marquer une action "premium" attachable. */
export function ComposerAction({ icon: Icon, label, onClick, badge }: ComposerActionProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="relative w-10 h-10 flex items-center justify-center rounded-full text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
    >
      <Icon size={18} />
      {badge && (
        <span aria-hidden className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
      )}
    </button>
  );
}

