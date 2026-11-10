"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRIME_DISPUTE, PRIME_MAX, PRIME_MIN } from "@/lib/pricing";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { useToast } from "@/components/ui/toast";
import {
  budgetAllows,
  canDispute,
  chfLabel,
  disputeHoursLeft,
  sellerPrimeBook,
  type Introduction,
  type SellerPrimeRow,
} from "@/lib/demo/affiliation";
import { displayName } from "@/lib/demo/session-views";

/* ── Le suivi du VENDEUR : ce qu'il a payé, les contacts reçus (P4a) ─────────

   Côté vendeur de la mécanique biens. Tout se lit dans `sellerPrimeBook()` —
   la même source que l'espace apporteur, si bien que le contact qu'Yves voit
   « en attente » est celui que Léo voit à accepter ici. Accepter facture la
   prime ; refuser est gratuit ; « pas sérieux » sous 48 h rembourse (plafonné). */

const STATUS: Record<Introduction["status"], { label: string; cls: string }> = {
  pending: { label: "À accepter ou refuser", cls: "chip-warning-soft" },
  accepted: { label: "Acceptée · prime payée", cls: "chip-success-soft" },
  declined: { label: "Refusée · gratuit", cls: "bg-[var(--hover-bg)] text-[var(--text-muted)]" },
  refunded: { label: "Contestée · remboursée", cls: "bg-[var(--hover-bg)] text-[var(--text-muted)]" },
  "under-review": { label: "Contestée · examen manuel", cls: "chip-warning-soft" },
};

export function SellerPrimeTracking() {
  const { state, actorId } = useSession();
  const { addToast } = useToast();
  const book = useMemo(() => sellerPrimeBook(state, actorId), [state, actorId]);
  if (book.rows.length === 0) return null;

  return (
    <details open className="mb-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4" id="primes">
      <summary className="cursor-pointer list-none">
        <span className="text-base font-semibold text-[var(--foreground)]">Vos primes de mise en relation</span>
        <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text-muted)]">
          <span>Payé ce mois : <strong className="text-[var(--foreground)]">{chfLabel(book.paidThisMonthCents)}</strong></span>
          <span>Payé au total : <strong className="text-[var(--foreground)]">{chfLabel(book.paidCents)}</strong></span>
          <span>Remboursé : {chfLabel(book.refundedCents)}</span>
          <span>Remboursements encore possibles ce mois : {book.refundsLeftThisMonth} / {PRIME_DISPUTE.maxRefundsPerMonth}</span>
        </span>
      </summary>
      <ul className="mt-4 space-y-3">
        {book.rows.map((row) => (
          <PrimeRow key={row.setting.propertyId} row={row} now={book.now} state={state} onToast={addToast} />
        ))}
      </ul>
    </details>
  );
}

function PrimeRow({
  row,
  now,
  state,
  onToast,
}: {
  row: SellerPrimeRow;
  now: string;
  state: ReturnType<typeof useSession>["state"];
  onToast: (m: string, t?: "success" | "error" | "info") => void;
}) {
  const { setting, property } = row;
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(setting.amountChf);
  const [budget, setBudget] = useState(setting.budgetChf);
  const min = PRIME_MIN.cents / 100;
  const max = PRIME_MAX.cents / 100;
  const valid = amount >= min && amount <= max && budget >= amount;

  const save = () => {
    if (!valid) return;
    recordSessionEvent({
      kind: "prime.set",
      data: { propertyId: setting.propertyId, amountChf: Math.round(amount), budgetChf: Math.round(budget), cardLast4: setting.cardLast4 },
    });
    setEditing(false);
    onToast("Prime mise à jour, sans frais.", "success");
  };

  const answer = (i: Introduction, decision: "accepted" | "declined") => {
    recordSessionEvent({
      kind: "introduction.answered",
      data: { introductionId: i.id, apporteurId: i.apporteurId, propertyId: i.propertyId, decision },
    });
    onToast(decision === "accepted" ? `Mise en relation acceptée : ${chfLabel(i.primeChf * 100)} facturés.` : "Contact refusé. Rien n'est facturé.", "success");
  };

  const dispute = (i: Introduction) => {
    recordSessionEvent({
      kind: "introduction.disputed",
      data: { introductionId: i.id, apporteurId: i.apporteurId, reason: "Ce contact n'était pas sérieux" },
    });
    onToast("Signalement enregistré.", "info");
  };

  return (
    <li className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/explorer/${property.id}`} className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[var(--foreground)] hover:underline">
          {property.title}
        </Link>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${setting.status === "active" ? "chip-success-soft" : "bg-[var(--hover-bg)] text-[var(--text-muted)]"}`}>
          {setting.status === "active" ? "Prime active" : "En pause"}
        </span>
      </div>
      <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
        Prime {chfLabel(setting.amountChf * 100)} par mise en relation acceptée · budget {chfLabel(setting.budgetChf * 100)} / mois · carte ···· {setting.cardLast4}
      </p>

      {editing ? (
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <label className="text-[11px] text-[var(--text-muted)]">
            Prime (CHF)
            <input type="number" min={min} max={max} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} className="mt-0.5 block w-28 rounded-md border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-[13px] text-[var(--foreground)]" />
          </label>
          <label className="text-[11px] text-[var(--text-muted)]">
            Budget / mois (CHF)
            <input type="number" min={min} value={budget || ""} onChange={(e) => setBudget(Number(e.target.value))} className="mt-0.5 block w-28 rounded-md border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-[13px] text-[var(--foreground)]" />
          </label>
          <button type="button" disabled={!valid} onClick={save} className="rounded-md bg-[var(--foreground)] px-3 py-1.5 text-[12px] font-medium text-[var(--background)] disabled:opacity-50">Enregistrer</button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-md border border-[var(--card-border)] px-3 py-1.5 text-[12px]">Annuler</button>
          {!valid && <span className="text-[11px] text-amber-600">Prime de {min} à {max} CHF, budget au moins égal à la prime.</span>}
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
          <button type="button" onClick={() => setEditing(true)} className="rounded-md border border-[var(--card-border)] px-2.5 py-1 hover:bg-[var(--hover-bg)]">Modifier</button>
          {setting.status === "active" ? (
            <button type="button" onClick={() => { recordSessionEvent({ kind: "prime.paused", data: { propertyId: setting.propertyId } }); onToast("Prime mise en pause, sans frais.", "info"); }} className="rounded-md border border-[var(--card-border)] px-2.5 py-1 hover:bg-[var(--hover-bg)]">Désactiver</button>
          ) : (
            <button type="button" onClick={() => recordSessionEvent({ kind: "prime.set", data: { propertyId: setting.propertyId, amountChf: setting.amountChf, budgetChf: setting.budgetChf, cardLast4: setting.cardLast4 } })} className="rounded-md border border-[var(--card-border)] px-2.5 py-1 hover:bg-[var(--hover-bg)]">Réactiver</button>
          )}
          <button type="button" onClick={() => { recordSessionEvent({ kind: "prime.removed", data: { propertyId: setting.propertyId } }); onToast("Prime retirée, sans frais.", "info"); }} className="rounded-md border border-[var(--card-border)] px-2.5 py-1 text-red-500 hover:bg-[var(--hover-bg)]">Retirer</button>
        </div>
      )}

      {row.introductions.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-[var(--card-border)] pt-3">
          {row.introductions.map((i) => {
            const st = STATUS[i.status];
            const disputable = canDispute(i, now);
            const affordable = budgetAllows(state, i);
            return (
              <li key={i.id} className="flex flex-col gap-1.5 text-[12.5px] sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[var(--foreground)]">
                    {i.contactLabel} <span className="text-[var(--text-muted)]">· amené par</span>{" "}
                    <Link href={`/profil/${i.apporteurId}`} className="hover:underline">{displayName(i.apporteurId)}</Link>
                  </p>
                  <p className="text-[11.5px] text-[var(--text-muted)]">
                    Prime {chfLabel(i.primeChf * 100)}{i.manualReview ? " · validation manuelle (au-delà du palier)" : ""}
                  </p>
                </div>
                <span className={`self-start rounded-full px-2 py-0.5 text-[11px] font-medium ${st.cls}`}>{st.label}</span>
                {i.status === "pending" && (
                  <span className="flex gap-1.5">
                    <button type="button" disabled={!affordable} title={affordable ? undefined : "Budget mensuel atteint"} onClick={() => answer(i, "accepted")} className="rounded-md bg-[var(--foreground)] px-2.5 py-1 text-[12px] font-medium text-[var(--background)] disabled:opacity-50">
                      Accepter · {chfLabel(i.primeChf * 100)}
                    </button>
                    <button type="button" onClick={() => answer(i, "declined")} className="rounded-md border border-[var(--card-border)] px-2.5 py-1 text-[12px]">Refuser (gratuit)</button>
                  </span>
                )}
                {disputable && (
                  <button type="button" onClick={() => dispute(i)} className="rounded-md border border-amber-500/40 px-2.5 py-1 text-[12px] text-amber-700 dark:text-amber-300">
                    Ce contact n&apos;était pas sérieux · {disputeHoursLeft(i, now)} h
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
