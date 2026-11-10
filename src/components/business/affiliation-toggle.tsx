"use client";

import { AFFILIATION_RATES, type CommissionPole } from "@/lib/pricing";
import { affiliationBreakdown, chfLabel, pctLabel } from "@/lib/demo/affiliation";

/* ── « Ouvrir à l'affiliation » — formulaires de création marketplace (D14) ──

   Mécanique MARKETPLACE : un pourcentage du prix, sortant de la marge du
   vendeur ; la commission d'E-Dome ne change pas. Le taux est PRÉ-REMPLI aux
   deux tiers de la fourchette du pôle (`defaultAffiliationRate`), BORNÉ par
   `AFFILIATION_RATES`, et l'aperçu chiffré — calculé par `quote()` — s'affiche
   AVANT l'activation : prix, part affilié, commission E-Dome, ce que vous
   gardez. L'apporteur, lui, verra toujours un NET en CHF. */

export interface AffiliationValue {
  open: boolean;
  rate: number;
}

export function AffiliationToggle({
  pole,
  priceChf,
  value,
  onChange,
  priceLabel = "par vente",
}: {
  pole: CommissionPole;
  priceChf: number;
  value: AffiliationValue;
  onChange: (v: AffiliationValue) => void;
  priceLabel?: string;
}) {
  const range = AFFILIATION_RATES[pole];
  if (!range) return null;
  const minPct = Math.round(range.min * 100);
  const maxPct = Math.round(range.max * 100);
  const pct = Math.round(value.rate * 100);
  const b = affiliationBreakdown(pole, priceChf, value.rate, pole === "evenement" ? 1 : undefined);
  const free = !(priceChf > 0);

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-3">
      <button
        type="button"
        onClick={() => onChange({ ...value, open: !value.open })}
        aria-pressed={value.open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-[var(--foreground)]">Ouvrir à l&apos;affiliation</span>
          <span className="block text-xs text-[var(--text-muted)]">
            Des apporteurs recommandent votre offre ; ils touchent un pourcentage du prix, pris sur votre marge. La commission d&apos;E-Dome ne change pas.
          </span>
        </span>
        <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value.open ? "bg-[var(--primary)]" : "bg-[var(--card-border)]"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value.open ? "translate-x-5" : "translate-x-0.5"}`} />
        </span>
      </button>

      {value.open && (
        <>
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
              <span>Taux d&apos;affiliation</span>
              <span className="font-mono text-[var(--foreground)]">{pctLabel(value.rate)}</span>
            </label>
            <input
              type="range"
              min={minPct}
              max={maxPct}
              step={1}
              value={pct}
              onChange={(e) => onChange({ ...value, rate: Number(e.target.value) / 100 })}
              className="w-full accent-[var(--primary)]"
              aria-label="Taux d'affiliation"
            />
            <p className="flex justify-between text-[11px] text-[var(--text-muted)]">
              <span>{minPct} %</span>
              <span>fourchette autorisée</span>
              <span>{maxPct} %</span>
            </p>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              Ce taux, proposé par défaut, attire les apporteurs. Vous pouvez le baisser : votre offre sera moins visible dans leur espace.
            </p>
          </div>

          {free ? (
            <p className="text-xs text-[var(--text-muted)]">Indiquez un prix pour voir l&apos;aperçu chiffré.</p>
          ) : (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-lg bg-[var(--background)] p-3 text-[12.5px]">
              <dt className="text-[var(--text-muted)]">Prix payé par le client ({priceLabel})</dt>
              <dd className="text-right font-medium text-[var(--foreground)]">{chfLabel(b.grossCents)}</dd>
              <dt className="text-[var(--text-muted)]">Part de l&apos;affilié ({pctLabel(value.rate)})</dt>
              <dd className="text-right font-medium text-[var(--foreground)]">− {chfLabel(b.affiliateCents)}</dd>
              <dt className="text-[var(--text-muted)]">Commission E-Dome (inchangée)</dt>
              <dd className="text-right text-[var(--foreground)]">− {chfLabel(b.edomeCents)}</dd>
              <dt className="text-[var(--text-muted)]">Frais de paiement</dt>
              <dd className="text-right text-[var(--foreground)]">− {chfLabel(b.pspCents)}</dd>
              <dt className="border-t border-[var(--card-border)] pt-1.5 font-semibold text-[var(--foreground)]">Ce que vous gardez</dt>
              <dd className="border-t border-[var(--card-border)] pt-1.5 text-right font-bold text-[var(--foreground)]">{chfLabel(b.sellerKeepsCents)}</dd>
              <dd className="col-span-2 text-[11px] text-[var(--text-muted)]">
                Sans affiliation : {chfLabel(b.sellerKeepsWithoutCents)}. La part affilié n&apos;est due que sur une vente amenée par un apporteur — jamais ajoutée au prix du client.
              </dd>
            </dl>
          )}
        </>
      )}
    </div>
  );
}
