"use client";

import { CreditCard, ShieldCheck, TrendingUp } from "lucide-react";
import {
  EDOME_PRIME_SHARE,
  PRIME_DISPUTE,
  PRIME_FLOOR,
  PRIME_MANUAL_REVIEW_ABOVE,
  PRIME_MAX,
  PRIME_MIN,
  PRIME_RANGE_LABEL,
} from "@/lib/pricing";
import { EDOME_PRIME_SHARE_LABEL, chfLabel, needsManualReview, primeBreakdown } from "@/lib/demo/affiliation";

/* ── « Faites-vous amener des acheteurs » — activation de la prime biens ─────

   Mécanique BIENS (D14) : une PRIME en francs, jamais un pourcentage du prix.
   Une carte est enregistrée (simulée) et un budget fixé : RIEN n'est prélevé à
   l'activation. La prime n'est facturée que lorsque le vendeur ACCEPTE une mise
   en relation ; refuser est gratuit ; rien n'est jamais lié à la vente.
   L'aperçu chiffré vient de `quote()` (via `primeBreakdown`). */

export interface PrimeDraft {
  active: boolean;
  amountChf: number;
  budgetChf: number;
  cardLast4: string;
}

const MIN = PRIME_MIN.cents / 100;
const MAX = PRIME_MAX.cents / 100;

/** Erreurs bloquantes d'un brouillon de prime (vide si valide ou inactive). */
export function primeDraftErrors(d: PrimeDraft): string[] {
  if (!d.active) return [];
  const errs: string[] = [];
  if (!Number.isFinite(d.amountChf) || d.amountChf < MIN || d.amountChf > MAX) {
    errs.push(`La prime doit être comprise entre ${PRIME_RANGE_LABEL}.`);
  }
  if (!(d.budgetChf >= d.amountChf)) errs.push("Le budget mensuel doit couvrir au moins une prime.");
  if (!/^\d{4}$/.test(d.cardLast4)) errs.push("Enregistrez une carte (simulée) : quatre derniers chiffres.");
  return errs;
}

const inputCls =
  "w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]/50";

export function PrimeActivation({
  value,
  onChange,
  audience,
}: {
  value: PrimeDraft;
  onChange: (v: PrimeDraft) => void;
  /** « acheteurs » (vente) ou « locataires » (location longue durée). */
  audience: "acheteurs" | "locataires";
}) {
  const set = <K extends keyof PrimeDraft>(k: K, v: PrimeDraft[K]) => onChange({ ...value, [k]: v });
  const inRange = value.amountChf >= MIN && value.amountChf <= MAX;
  const b = inRange ? primeBreakdown(Math.round(value.amountChf)) : null;
  const errors = primeDraftErrors(value);

  return (
    <div className="space-y-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
      <button
        type="button"
        onClick={() => set("active", !value.active)}
        aria-pressed={value.active}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block font-semibold text-[var(--foreground)]">Faites-vous amener des {audience}</span>
          <span className="block text-xs text-[var(--text-muted)]">
            Vous offrez une prime fixe en francs à l&apos;apporteur qui vous amène un contact — payée seulement si vous acceptez la mise en relation.
          </span>
        </span>
        <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value.active ? "bg-[var(--primary)]" : "bg-[var(--card-border)]"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value.active ? "translate-x-5" : "translate-x-0.5"}`} />
        </span>
      </button>

      {value.active && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]" htmlFor="prime-amount">
                Prime par mise en relation (CHF)
              </label>
              <input
                id="prime-amount"
                type="number"
                min={MIN}
                max={MAX}
                step={10}
                className={inputCls}
                value={value.amountChf || ""}
                onChange={(e) => set("amountChf", Number(e.target.value))}
              />
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">De {PRIME_RANGE_LABEL}. Un montant en francs, jamais un pourcentage du prix.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]" htmlFor="prime-budget">
                Budget mensuel (CHF)
              </label>
              <input
                id="prime-budget"
                type="number"
                min={MIN}
                step={50}
                className={inputCls}
                value={value.budgetChf || ""}
                onChange={(e) => set("budgetChf", Number(e.target.value))}
              />
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">Au-delà, plus aucune mise en relation n&apos;est facturée ce mois.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]" htmlFor="prime-card">
                Carte enregistrée (simulée)
              </label>
              <div className="relative">
                <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden />
                <input
                  id="prime-card"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4 derniers chiffres"
                  className={`${inputCls} pl-8`}
                  value={value.cardLast4}
                  onChange={(e) => set("cardLast4", e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">Rien n&apos;est prélevé à l&apos;activation.</p>
            </div>
          </div>

          {b && (
            <div className="rounded-lg bg-[var(--background)] p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Pour chaque mise en relation que vous acceptez
              </p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                <dt className="text-[var(--text-muted)]">Vous payez</dt>
                <dd className="text-right font-bold text-[var(--foreground)]">{chfLabel(b.sellerPaysCents)}</dd>
                <dt className="text-[var(--text-muted)]">L&apos;apporteur touche, net</dt>
                <dd className="text-right font-medium text-[var(--foreground)]">{chfLabel(b.apporteurCents)}</dd>
                <dt className="text-[var(--text-muted)]">Part E-Dome ({EDOME_PRIME_SHARE_LABEL}, à l&apos;intérieur de la prime)</dt>
                <dd className="text-right text-[var(--foreground)]">{chfLabel(b.edomeShareCents)}</dd>
                <dt className="text-[var(--text-muted)]">Frais de paiement — absorbés par E-Dome</dt>
                <dd className="text-right text-[var(--foreground)]">{chfLabel(b.pspCents)}</dd>
              </dl>
              <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                E-Dome se sert à l&apos;intérieur de la prime que vous annoncez, jamais en plus. Minimum pratique : {MIN} CHF — en dessous, la part
                minimale d&apos;E-Dome ({chfLabel(PRIME_FLOOR.cents)}) pèserait plus que les {Math.round(EDOME_PRIME_SHARE * 100)} % prévus et l&apos;apporteur ne
                toucherait presque rien.
              </p>
            </div>
          )}

          <p className="flex items-start gap-2 text-[12.5px] text-[var(--foreground)]">
            <TrendingUp size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
            Plus la prime est élevée, plus le bien remonte dans l&apos;espace des apporteurs.
          </p>

          <ul className="space-y-1.5 text-[12px] leading-snug text-[var(--text-secondary)]">
            <li>· Facturée uniquement quand vous <strong>acceptez</strong> une mise en relation. Refuser est gratuit. Jamais liée à la vente ni au bail.</li>
            <li>· Modifiable, désactivable ou retirable à tout moment, sans frais.</li>
            <li>
              · « Ce contact n&apos;était pas sérieux » : signalable pendant {PRIME_DISPUTE.windowHours} h après l&apos;acceptation, depuis votre suivi.
              Remboursement plafonné à {PRIME_DISPUTE.maxRefundsPerMonth} contacts par mois ; au-delà, examen manuel.
            </li>
            <li className="flex items-start gap-1.5">
              <ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden />
              <span>
                Vérification : jusqu&apos;à {chfLabel(PRIME_MANUAL_REVIEW_ABOVE.cents)}, automatique. Au-delà, vérification renforcée de l&apos;apporteur et
                validation manuelle de la mise en relation avant facturation.
                {needsManualReview(value.amountChf) ? " Votre prime est dans ce palier." : ""}
              </span>
            </li>
          </ul>

          {errors.length > 0 && (
            <ul className="list-disc rounded-lg border border-amber-500/30 bg-amber-500/10 px-6 py-2 text-[12px] text-amber-700 dark:text-amber-300">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
