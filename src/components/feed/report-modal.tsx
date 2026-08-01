"use client";

import { useEffect, useState } from "react";
import { X, Flag, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";

/* Modale de signalement (mock) : motif + envoi → toast de confirmation.
   Réutilisable pour un post, un profil, une annonce. */

const REASONS = [
  "Spam ou publicité",
  "Contenu inapproprié",
  "Fausse annonce / arnaque",
  "Harcèlement ou haine",
  "Atteinte à la propriété intellectuelle",
  "Autre",
];

export function ReportModal({
  title = "Signaler cette publication",
  onClose,
}: {
  title?: string;
  onClose: () => void;
}) {
  const { addToast } = useToast();
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    if (!reason) return;
    addToast("Merci, votre signalement a été envoyé.", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--card-border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)] inline-flex items-center gap-2">
            <Flag size={16} className="text-[var(--destructive)]" /> {title}
          </h2>
          <button onClick={onClose} aria-label="Fermer" className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <p className="text-xs text-[var(--text-muted)] px-2 pb-2">Pourquoi signalez-vous ce contenu ?</p>
          <ul className="space-y-0.5">
            {REASONS.map((r) => (
              <li key={r}>
                <button
                  onClick={() => setReason(r)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                  {r}
                  {reason === r && <Check size={16} className="text-[var(--primary)]" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-t border-[var(--card-border)]">
          <button onClick={onClose} className="ml-auto px-4 py-2 text-sm font-medium rounded-full border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
            Annuler
          </button>
          <button onClick={submit} disabled={!reason} className="px-5 py-2 text-sm font-semibold rounded-full bg-[var(--destructive)] text-white hover:opacity-90 transition-opacity disabled:opacity-40">
            Signaler
          </button>
        </div>
      </div>
    </div>
  );
}
