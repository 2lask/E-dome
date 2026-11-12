"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { MoneyFlow } from "@/components/pricing/money-flow";
import { servicesText } from "@/content/services";
import { iso, DEMO_TODAY } from "@/lib/demo/clock";
import { displayName, groupThousands } from "@/lib/demo/session-views";
import {
  requestsReceivedBy,
  serviceDealOf,
  servicePaymentCharge,
  simulatedQuote,
  type DealStage,
  type ServiceView,
} from "@/lib/demo/services-catalog";
import { recordSessionEvent, useSession } from "@/lib/use-session";
import { Stars } from "./stars";

/* ── Le parcours devis → paiement → avis d'un service (P6a) ─────────────────

   Chaque étape est un événement du journal de session ; l'étape affichée se
   DÉRIVE du journal (`serviceDealOf`), rien n'est tenu dans un état local
   qui pourrait mentir après un rechargement. Le devis est une réponse
   simulée du prestataire, et l'écran le dit. Le paiement passe par
   `MoneyFlow` → `quote()` : la somme tombe juste par construction. */

const T = servicesText.flow;
const chfLabel = (n: number) => `${groupThousands(n)} CHF`;
const STEP_OF: Record<DealStage, number> = { none: 0, quoted: 1, accepted: 2, paid: 3, completed: 4, reviewed: 5 };
const inputCls =
  "w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/60 transition-colors";
const primaryBtn =
  "w-full py-2.5 bg-[var(--primary)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition-opacity disabled:opacity-50";
const secondaryBtn =
  "w-full py-2.5 border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors inline-flex items-center justify-center gap-2";

function Steps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="Étapes">
      {T.stepLabels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex-1 min-w-0">
            <div className={`h-1 rounded-full ${done ? "bg-[var(--primary)]" : active ? "bg-[var(--primary)]/50" : "bg-[var(--card-border)]"}`} />
            <span className={`mt-1 block truncate text-[10.5px] ${active ? "text-[var(--foreground)] font-medium" : "text-[var(--text-muted)]"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function ServiceFlow({ service }: { service: ServiceView }) {
  const { state, actorId } = useSession();
  const deal = useMemo(() => serviceDealOf(state, actorId, service.id), [state, actorId, service.id]);
  const [need, setNeed] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [again, setAgain] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 3500);
  };

  /* Le prestataire regarde son propre service : il voit les demandes reçues. */
  if (service.providerId === actorId) {
    const requests = requestsReceivedBy(state, actorId, service.id);
    return (
      <div className="space-y-3">
        <p className="text-sm text-[var(--text-secondary)]">{servicesText.detail.own}</p>
        {requests.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{servicesText.detail.requestsTitle}</h3>
            {requests.map((r) => (
              <Link key={r.id} href={`/messages?to=${r.clientId}`} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--card-border)] px-3 py-2 text-sm hover:bg-[var(--hover-bg)]">
                <span>{displayName(r.clientId)}</span>
                <span className="tabular-nums text-[var(--text-muted)]">{chfLabel(r.totalChf)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const stage: DealStage = again ? "none" : deal.stage;
  const q = deal.quote;
  const threadHref = `/messages?to=${service.providerId}`;

  const send = () => {
    if (!need.trim()) {
      setError(T.needRequired);
      return;
    }
    const b = Number(budget);
    const text = [need.trim(), budget.trim() && Number.isFinite(b) && b > 0 ? T.budgetLine(groupThousands(b)) : ""].filter(Boolean).join(" ");
    const request = recordSessionEvent({
      kind: "quote.sent",
      data: { toId: service.providerId, serviceId: service.id, subject: service.title, providerName: service.provider, text, date: date || undefined },
    });
    recordSessionEvent({ kind: "service.quoted", data: simulatedQuote(service, request.id) });
    setNeed("");
    setDate("");
    setBudget("");
    setError(null);
    setAgain(false);
    setRating(0);
    setComment("");
    flash(T.toastSent(service.provider));
  };

  const ids = q && deal.quotedId ? { serviceId: service.id, providerId: service.providerId, quotedId: deal.quotedId } : null;

  return (
    <div className="space-y-4">
      <Steps current={STEP_OF[stage]} />

      {stage === "none" && (
        <div className="space-y-3">
          <h3 className="font-semibold">{T.askTitle}</h3>
          <label className="block space-y-1">
            <span className="text-xs text-[var(--text-secondary)]">{T.need}</span>
            <textarea className={`${inputCls} min-h-[84px] resize-y`} placeholder={T.needPlaceholder} value={need} onChange={(e) => setNeed(e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="text-xs text-[var(--text-secondary)]">{T.date}</span>
              <input type="date" min={iso(DEMO_TODAY)} className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-[var(--text-secondary)]">{T.budget}</span>
              <input type="number" min={0} inputMode="numeric" className={inputCls} placeholder={T.budgetPlaceholder} value={budget} onChange={(e) => setBudget(e.target.value)} />
            </label>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="button" onClick={send} className={primaryBtn}>
            {T.send}
          </button>
        </div>
      )}

      {q && stage !== "none" && (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{T.quotedTitle}</h3>
            <span className="text-[11px] text-[var(--text-muted)]">{service.provider}</span>
          </div>
          <p className="text-sm italic text-[var(--text-secondary)]">« {q.message} »</p>
          <dl className="space-y-1 text-sm">
            {q.lines.map((l) => (
              <div key={l.label} className="flex justify-between gap-3">
                <dt className="text-[var(--text-secondary)]">{l.label}</dt>
                <dd className="tabular-nums">{chfLabel(l.amountChf)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-t border-[var(--card-border)] pt-1 font-semibold">
              <dt>{T.total}</dt>
              <dd className="tabular-nums">{chfLabel(q.totalChf)}</dd>
            </div>
          </dl>
          <p className="text-[11px] text-[var(--text-muted)]">{T.simulated}</p>
        </div>
      )}

      {stage === "quoted" && ids && q && (
        <div className="space-y-2">
          <button type="button" onClick={() => recordSessionEvent({ kind: "service.quote.accepted", data: { ...ids, totalChf: q.totalChf } })} className={primaryBtn}>
            {T.accept}
          </button>
          <Link href={threadHref} className={secondaryBtn}>
            <MessageCircle size={15} aria-hidden /> {T.openThread}
          </Link>
        </div>
      )}

      {stage === "accepted" && ids && q && (
        <div className="space-y-3">
          <h3 className="font-semibold">{T.payTitle}</h3>
          <MoneyFlow charge={servicePaymentCharge(q.totalChf)} beneficiaryLabel={T.beneficiary} grossLabel={T.grossLabel} />
          <p className="text-[11px] text-[var(--text-muted)]">{T.payHint}</p>
          <button
            type="button"
            onClick={() => {
              recordSessionEvent({ kind: "service.paid", data: { ...ids, totalChf: q.totalChf } });
              flash(T.toastPaid);
            }}
            className={primaryBtn}
          >
            {T.pay(chfLabel(q.totalChf))}
          </button>
        </div>
      )}

      {stage === "paid" && ids && (
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check size={15} aria-hidden /> {T.paidTitle}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">{T.paidHint}</p>
          <button type="button" onClick={() => recordSessionEvent({ kind: "service.completed", data: ids })} className={primaryBtn}>
            {T.complete}
          </button>
          <Link href={threadHref} className={secondaryBtn}>
            <MessageCircle size={15} aria-hidden /> {T.openThread}
          </Link>
        </div>
      )}

      {stage === "completed" && ids && (
        <div className="space-y-3">
          <h3 className="font-semibold">{T.reviewTitle}</h3>
          <div className="flex gap-1" role="radiogroup" aria-label={T.reviewTitle}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={T.stars(n)}
                onClick={() => setRating(n)}
                className={`p-1 rounded-md transition-colors ${n <= rating ? "text-amber-400" : "text-[var(--text-muted)] opacity-50 hover:opacity-100"}`}
              >
                <svg width={24} height={24} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <textarea className={`${inputCls} min-h-[84px] resize-y`} placeholder={T.commentPlaceholder} value={comment} onChange={(e) => setComment(e.target.value)} />
          <p className="text-[11px] text-[var(--text-muted)]">{T.reviewHint}</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={() => {
              if (rating < 1) {
                setError(T.ratingRequired);
                return;
              }
              setError(null);
              recordSessionEvent({ kind: "service.reviewed", data: { ...ids, rating, comment: comment.trim() } });
              flash(T.toastReview);
            }}
            className={primaryBtn}
          >
            {T.publishReview}
          </button>
        </div>
      )}

      {stage === "reviewed" && deal.review && (
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check size={15} aria-hidden /> {T.doneTitle}
          </p>
          <div className="flex items-center gap-2">
            <Stars rating={deal.review.rating} />
            {deal.review.comment && <span className="text-sm text-[var(--text-secondary)] line-clamp-2">{deal.review.comment}</span>}
          </div>
          <button type="button" onClick={() => setAgain(true)} className={secondaryBtn}>
            {T.newRequest}
          </button>
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(80px+env(safe-area-inset-bottom)+1rem)] md:bottom-6 right-4 md:right-6 left-4 md:left-auto z-50 px-5 py-3 toast-success rounded-xl shadow-lg text-sm font-medium animate-fade-in text-center md:text-left"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
