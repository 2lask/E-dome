"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import type { Charge } from "@/lib/pricing/charge";
import { quote, type QuoteContext } from "@/lib/pricing/quote";
import { formatMoney, isZero } from "@/lib/model/billing";

/* ── Panneau de flux d'argent ───────────────────────────────────────────────

   « Sur chaque écran de transaction, un panneau qui montre en clair qui paie
   quoi, ce que touche le vendeur, ce que touche E-Dome, ce que touche
   l'apporteur, ce que prennent les frais de paiement. C'est l'élément qui
   répondra le mieux aux questions d'un investisseur. » (Partie C.)

   Un composant unique, réutilisé partout. Il ne calcule rien : il reçoit un
   `Charge`, le passe à `quote()` — la seule source de vérité du modèle — et
   dispose le `MoneyFlow` qui en sort. Aucun montant, aucun taux, aucune phrase
   ne vit dans ce fichier ; l'invariant `gross = bénéficiaire + E-Dome + frais`
   est déjà vérifié dans `quote()`.

   LA LIGNE « FRAIS DE PAIEMENT » EST TOUJOURS VISIBLE. C'est la conséquence
   assumée du choix « frais directs » (arbitrage encore ouvert chez l'avocat,
   cf. JURIDIQUE-A-VALIDER.md) : on ne cache pas au vendeur ce que le
   prestataire de paiement prélève. */

export function MoneyFlow({
  charge,
  context,
  beneficiaryLabel = "Le vendeur reçoit",
  grossLabel,
  defaultOpen = true,
  className = "",
}: {
  charge: Charge;
  context?: QuoteContext;
  /** Qui encaisse — « Vous (hôte) », « L'agence »… */
  beneficiaryLabel?: string;
  /** Ce que paie le client, ou le montant de l'abonnement. */
  grossLabel?: string;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const q = quote(charge, context);
  const f = q.flow;

  const rows: { label: string; value: string; tone?: "strong" | "muted" }[] = [];
  rows.push({ label: beneficiaryLabel, value: formatMoney(f.beneficiary), tone: "strong" });
  if (!isZero(f.edomeGross)) {
    rows.push({ label: "E-Dome", value: formatMoney(f.edomeNet) });
  }
  if (!isZero(f.apporteur)) {
    rows.push({ label: "dont apporteur", value: formatMoney(f.apporteur), tone: "muted" });
  }
  /* Toujours affichée, même à zéro : c'est le point du choix « frais directs ». */
  rows.push({
    label: `Frais de paiement${f.pspBornBy === "seller" ? " (à votre charge)" : " (pris par E-Dome)"}`,
    value: formatMoney(f.psp),
    tone: "muted",
  });

  return (
    <div className={`rounded-xl border border-[var(--card-border)] bg-[var(--card)] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left"
      >
        <Info size={15} className="shrink-0 text-[var(--primary)]" aria-hidden />
        <span className="flex-1">
          <span className="block text-[13px] font-semibold text-[var(--foreground)]">Qui paie quoi</span>
          <span className="block text-[11.5px] text-[var(--text-muted)]">
            {grossLabel ?? "Ce que paie le client"} : {formatMoney(f.gross)}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="border-t border-[var(--card-border)] px-3.5 py-3">
          <dl className="space-y-1.5">
            {rows.map((r, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3">
                <dt
                  className={
                    r.tone === "muted"
                      ? "pl-3 text-[12px] text-[var(--text-muted)]"
                      : "text-[12.5px] text-[var(--foreground)]"
                  }
                >
                  {r.label}
                </dt>
                <dd
                  className={
                    "tabular-nums " +
                    (r.tone === "strong"
                      ? "text-[13px] font-semibold text-[var(--foreground)]"
                      : r.tone === "muted"
                        ? "text-[12px] text-[var(--text-muted)]"
                        : "text-[12.5px] text-[var(--foreground)]")
                  }
                >
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2.5 border-t border-[var(--card-border)] pt-2 text-[11.5px] italic leading-snug text-[var(--text-muted)]">
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
