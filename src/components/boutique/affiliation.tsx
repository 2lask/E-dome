"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ExternalLink, X, Building2 } from "lucide-react";
import type { Condition } from "@/lib/data/products";

/* ── Boutique en affiliation : briques partagées ─────────────────────────────

   `DECISIONS-2.md` §D5 / `DECISIONS.md` §1.8 (art. 20a LTVA) : E-Dome
   référence des produits et redirige vers le marchand. Il ne tient pas le
   checkout, ne garantit pas l'achat et n'est pas vendeur apparent. La
   rémunération est payée par le marchand, jamais ajoutée au prix payé.

   Ces textes vivent ici, une seule fois, pour que la liste, la fiche et
   l'interstitiel disent exactement la même chose. */

/** Mention d'affiliation courte, visible sur chaque fiche et chaque carte. */
export const AFFILIATION_NOTICE =
  "Lien d'affiliation : si vous achetez chez le marchand, E-Dome est rémunéré par lui, sans rien ajouter à votre prix.";

/** Jeton sémantique par état : trois états, trois couleurs (plus de badge unique). */
const CONDITION_CHIP: Record<Condition, string> = {
  Neuf: "chip-success-soft",
  Reconditionné: "chip-info-soft",
  Occasion: "chip-warning-soft",
};

export function ConditionChip({ condition, className = "" }: { condition: Condition; className?: string }) {
  return (
    <span
      className={`${CONDITION_CHIP[condition]} inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${className}`}
    >
      {condition}
    </span>
  );
}

export function AffiliationChip({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${className}`}
      style={{ background: "var(--hover-bg)", color: "var(--text-secondary)", border: "1px solid var(--card-border)" }}
    >
      En affiliation
    </span>
  );
}

/* ── L'interstitiel « Vous quittez E-Dome » ────────────────────────────────

   En démonstration, AUCUNE URL externe n'est ouverte : l'audit a sanctionné
   les liens fictifs. L'interstitiel dit ce qui se passerait, puis propose de
   revenir. */
export function LeavingInterstitial({
  merchant,
  productTitle,
  onClose,
}: {
  merchant: string;
  productTitle: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 animate-fade-in" style={{ background: "rgba(15,23,42,0.5)" }} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaving-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl p-5 space-y-4 animate-scale-in"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 pr-8">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--hover-bg)", color: "var(--primary)" }}
          >
            <ExternalLink size={18} />
          </span>
          <h2 id="leaving-title" className="text-base font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
            Vous quittez E-Dome pour {merchant}
          </h2>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          E-Dome est rémunéré par le marchand sur cette recommandation, sans rien ajouter à votre prix. Le contrat de
          vente, la livraison et la garantie sont ceux du marchand.
        </p>

        <div
          className="rounded-xl px-3 py-2.5 text-xs leading-relaxed flex items-start gap-2"
          style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
        >
          <Building2 size={14} className="shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
          <span>
            <strong style={{ color: "var(--foreground)" }}>Démonstration.</strong> Aucun site marchand n&apos;est
            ouvert ici. En service, ce bouton ouvrirait la page « {productTitle} » chez {merchant}, dans un nouvel
            onglet : vous y paieriez {merchant} directement, aux conditions de {merchant}.
          </span>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
          <Link
            href="/boutique"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--hover-bg)]"
            style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
          >
            Voir d&apos;autres produits
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "var(--primary)" }}
          >
            Revenir à la fiche
          </button>
        </div>
      </div>
    </div>
  );
}
