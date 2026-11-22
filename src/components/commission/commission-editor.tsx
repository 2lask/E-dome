"use client";

import { Input } from "@/components/ui/input";
import {
  FIXE_MAX_CHF, FIXE_MIN_CHF, RATE_MAX_PCT, commissionChf, netForApporteur, validateTerms,
  type CommissionTerms,
} from "@/lib/commission";
import { formatNumber } from "@/lib/format";
import type { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── Éditeur de commission d'apport (publication et « Mes biens ») ───────────
   Fixe ou pourcentage du prix (vente), déclencheur, aperçu de ce que touche
   l'apporteur, et l'accord du vendeur (courtage d'indication, art. 412 ss CO). */

const FIXE_PRESETS = [500, 1000, 2500, 5000];
const RATE_PRESETS = [0.5, 1, 1.5, 2];

export function CommissionEditor({
  tx,
  price,
  value,
  onChange,
  accepted,
  onAccept,
}: {
  tx: TransactionType;
  /** Prix demandé (estimation d'un pourcentage). */
  price: number;
  value: CommissionTerms;
  onChange: (t: CommissionTerms) => void;
  accepted: boolean;
  onAccept: (v: boolean) => void;
}) {
  const sale = tx === "vente";
  const error = validateTerms(value, tx);
  const estimate = commissionChf(value, value.kind === "pourcentage" ? price : null);
  const set = (patch: Partial<CommissionTerms>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      {sale && (
        <div role="radiogroup" aria-label="Forme de la commission" className="grid grid-cols-2 rounded-xl border bg-card p-1">
          {([
            { k: "pourcentage", label: "% du prix de vente" },
            { k: "fixe", label: "Montant fixe" },
          ] as const).map(({ k, label }) => (
            <button key={k} type="button" role="radio" aria-checked={value.kind === k}
              onClick={() => set(k === "fixe"
                ? { kind: "fixe", amountChf: value.amountChf ?? 2500, ratePct: null }
                : { kind: "pourcentage", ratePct: value.ratePct ?? 1, amountChf: null, dueOn: "conclusion" })}
              className={cn("h-10 rounded-lg text-[13.5px]", value.kind === k ? "bg-laiton-soft font-semibold text-laiton" : "text-muted-foreground hover:text-foreground")}>
              {label}
            </button>
          ))}
        </div>
      )}

      {value.kind === "pourcentage" ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {RATE_PRESETS.map((r) => (
              <button key={r} type="button" aria-pressed={value.ratePct === r} onClick={() => set({ ratePct: r })}
                className={cn("h-8 rounded-full border px-3 text-[13px] tabular-nums", value.ratePct === r ? "border-laiton bg-card font-semibold text-laiton" : "border-laiton-border bg-card/60 hover:bg-card")}>
                {String(r).replace(".", ",")} %
              </button>
            ))}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Pourcentage du prix de vente final</span>
            <Input value={value.ratePct ?? ""} inputMode="decimal" containerClassName="sm:max-w-[180px]"
              onChange={(e) => { const n = Number(e.target.value.replace(",", ".")); set({ ratePct: Number.isFinite(n) ? n : null }); }}
              trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">%</span>} aria-label="Pourcentage" />
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {(sale ? FIXE_PRESETS : [200, 300, 500, 800]).map((v) => (
              <button key={v} type="button" aria-pressed={value.amountChf === v} onClick={() => set({ amountChf: v })}
                className={cn("h-8 rounded-full border px-3 text-[13px] tabular-nums", value.amountChf === v ? "border-laiton bg-card font-semibold text-laiton" : "border-laiton-border bg-card/60 hover:bg-card")}>
                {formatNumber(v)} CHF
              </button>
            ))}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Montant</span>
            <Input value={value.amountChf ? formatNumber(value.amountChf) : ""} inputMode="numeric" containerClassName="sm:max-w-[200px]"
              onChange={(e) => set({ amountChf: Number(e.target.value.replace(/[^\d]/g, "").slice(0, 6)) || null })}
              placeholder={`${FIXE_MIN_CHF} à ${formatNumber(FIXE_MAX_CHF)}`}
              trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">CHF</span>} aria-label="Montant de la commission" />
          </label>
          <div role="radiogroup" aria-label="Quand la commission est due" className="flex flex-wrap gap-2 pt-1">
            {([
              { k: "conclusion", label: sale ? "À la signature de la vente" : "À la signature du bail" },
              { k: "acceptation", label: "Dès que j'accepte le contact" },
            ] as const).map(({ k, label }) => (
              <button key={k} type="button" role="radio" aria-checked={value.dueOn === k} onClick={() => set({ dueOn: k })}
                className={cn("h-8 rounded-full border px-3 text-[12.5px]", value.dueOn === k ? "border-leman bg-leman-soft font-medium text-leman" : "bg-card hover:border-foreground/25")}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error ? (
        <p className="text-[12.5px] font-medium text-[var(--danger-text)]">{error}</p>
      ) : estimate ? (
        <p className="rounded-lg bg-card px-3 py-2 text-[13px]">
          {value.kind === "pourcentage" ? <>Au prix demandé, ≈ <strong className="tabular-nums">{formatNumber(Math.round(estimate))} CHF</strong>. </> : null}
          L&apos;apporteur touche <strong className="tabular-nums">{formatNumber(Math.round(netForApporteur(estimate)))} CHF</strong> net
          {value.kind === "pourcentage" ? " (calculé sur le prix final)" : ""} ; E-Dome retient 12 %.
        </p>
      ) : null}

      <label className="flex items-start gap-2.5 text-[12.5px] leading-relaxed">
        <input type="checkbox" checked={accepted} onChange={(e) => onAccept(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--laiton)]" />
        <span>
          Je promets cette commission à la personne qui m&apos;amène l&apos;{sale ? "acheteur" : "locataire"} par E-Dome (courtage d&apos;indication, art. 412 ss CO),
          {value.kind === "pourcentage" || value.dueOn === "conclusion" ? " due à la signature" : " due dès que j'accepte le contact"}.
          Plafond {RATE_MAX_PCT} % ou {formatNumber(FIXE_MAX_CHF)} CHF. <a href="/conditions" className="text-leman underline underline-offset-2">Conditions</a>
        </span>
      </label>
    </div>
  );
}
