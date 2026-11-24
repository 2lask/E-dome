"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Check, Circle, FileSignature, Gavel, Plus, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { addOffer, getDeal, setDealStep, setOfferStatus } from "@/lib/supabase/deal-actions";
import {
  DEAL_STEPS, FINANCING_LABEL, OFFER_STATUS_LABEL, gapToAskingPct, isExpired, stepsDone, suggestedSalePrice,
  type Deal, type DealOffer, type Financing,
} from "@/lib/deal";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Parcours de vente : offres et étapes jusqu'à l'acte ─────────────────────
   Sous une demande (vente) : le vendeur note chaque offre reçue, l'accepte,
   la refuse ou contre-propose ; puis coche les étapes suisses jusqu'à l'acte
   authentique. L'offre acceptée pré-remplit le prix final de la conclusion,
   donc la commission de l'apporteur. */

const chf = (n: number) => `CHF ${formatNumber(Math.round(n))}`;
const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { amount: "", financing: "inconnu" as Financing, conditions: "", validUntil: "" };

export function DealPanel({
  inquiryId, status, askingPrice, onConclude, onChanged,
}: {
  inquiryId: string;
  status: string;
  askingPrice: number;
  onConclude: (price: number | null) => void;
  onChanged: () => void;
}) {
  const { addToast } = useToast();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [counterFor, setCounterFor] = useState<string | null>(null);
  const [counter, setCounter] = useState("");
  const [isPending, startTransition] = useTransition();
  const closed = status === "conclue" || status === "fermee";

  const reload = useCallback(async () => setDeal(await getDeal(inquiryId)), [inquiryId]);
  useEffect(() => {
    let alive = true;
    getDeal(inquiryId).then((d) => { if (alive) setDeal(d); });
    return () => { alive = false; };
  }, [inquiryId, status]);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, done?: string) =>
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) { addToast(res.error ?? "Erreur.", "error"); return; }
      if (done) addToast(done, "success");
      await reload();
      onChanged();
    });

  if (!deal) return null;
  if (!deal.ready) {
    return (
      <p className="rounded-xl bg-subtle px-4 py-3 text-[12.5px] text-muted-foreground">
        Offres et étapes jusqu&apos;à l&apos;acte : disponibles après la mise à jour de la base (migration 010).
      </p>
    );
  }

  const amountNum = Number(form.amount.replace(/[^\d]/g, "")) || 0;
  const counterNum = Number(counter.replace(/[^\d]/g, "")) || 0;
  const accepted = suggestedSalePrice(deal.offers);
  const done = stepsDone(deal.steps);

  const submitOffer = () =>
    run(async () => {
      const r = await addOffer(inquiryId, { amountChf: amountNum, financing: form.financing, conditions: form.conditions, validUntil: form.validUntil || null });
      if (r.ok) { setForm(EMPTY); setAdding(false); }
      return r;
    }, "Offre enregistrée.");

  return (
    <section aria-label="Offres et étapes jusqu'à l'acte" className="space-y-4 rounded-xl border bg-card p-4">
      {/* ── Offres ── */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-[14px] font-semibold"><Gavel className="h-4 w-4 text-leman" aria-hidden /> Offres</p>
          {!closed && !adding && (
            <Button size="sm" variant="outline" onClick={() => setAdding(true)}><Plus className="h-4 w-4" aria-hidden /> Noter une offre</Button>
          )}
        </div>

        {adding && (
          <div className="mt-3 space-y-3 rounded-lg border bg-background p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[12.5px] font-medium">Montant proposé</span>
                <Input value={form.amount ? formatNumber(amountNum) : ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} inputMode="numeric" placeholder="0"
                  trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">CHF</span>} />
                {amountNum > 0 && askingPrice > 0 && (
                  <span className="mt-1 block text-[11.5px] text-muted-foreground">{gapLabel(amountNum, askingPrice)}</span>
                )}
              </label>
              <label className="block">
                <span className="mb-1 block text-[12.5px] font-medium">Valable jusqu&apos;au (facultatif)</span>
                <Input type="date" value={form.validUntil} min={today()} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
              </label>
            </div>
            <div>
              <span className="mb-1 block text-[12.5px] font-medium">Financement</span>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(FINANCING_LABEL) as Financing[]).map((f) => (
                  <button key={f} type="button" onClick={() => setForm({ ...form, financing: f })}
                    className={cn("h-8 rounded-full border px-3 text-[12px]", form.financing === f ? "border-leman bg-leman-soft font-medium text-leman" : "bg-card text-muted-foreground hover:text-foreground")}>
                    {FINANCING_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-1 block text-[12.5px] font-medium">Conditions (facultatif)</span>
              <textarea value={form.conditions} onChange={(e) => setForm({ ...form, conditions: e.target.value.slice(0, 1000) })} rows={2}
                placeholder="Sous réserve du financement, entrée en jouissance au 1er avril…"
                className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[13px] outline-none focus:border-[var(--leman)]" />
            </label>
            <div className="flex gap-2">
              <Button size="sm" disabled={isPending || amountNum < 1000} onClick={submitOffer}>Enregistrer l&apos;offre</Button>
              <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setForm(EMPTY); }}>Annuler</Button>
            </div>
          </div>
        )}

        {deal.offers.length === 0 && !adding ? (
          <p className="mt-2 text-[12.5px] text-muted-foreground">Une offre reçue par écrit, au téléphone ou par e-mail ? Notez-la : vous gardez la trace, et l&apos;offre acceptée pré-remplit le prix final.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {deal.offers.map((o) => (
              <OfferRow key={o.id} o={o} askingPrice={askingPrice} closed={closed} pending={isPending}
                counterOpen={counterFor === o.id} counter={counter} counterNum={counterNum}
                onCounterOpen={() => { setCounterFor(o.id); setCounter(""); }}
                onCounterChange={setCounter}
                onCounterCancel={() => setCounterFor(null)}
                onStatus={(st) => run(async () => {
                  const r = await setOfferStatus(o.id, st, st === "contre-offre" ? counterNum : null);
                  if (r.ok) setCounterFor(null);
                  return r;
                }, st === "acceptee" ? "Offre acceptée. Passez aux étapes chez le notaire." : undefined)} />
            ))}
          </ul>
        )}
      </div>

      {/* ── Étapes jusqu'à l'acte ── */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-[14px] font-semibold"><FileSignature className="h-4 w-4 text-leman" aria-hidden /> Jusqu&apos;à l&apos;acte</p>
          <span className="text-[12px] tabular-nums text-muted-foreground">{done}/{DEAL_STEPS.length}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
          <div className="h-full rounded-full bg-leman transition-[width] duration-500" style={{ width: `${(done / DEAL_STEPS.length) * 100}%` }} />
        </div>
        <ol className="mt-3 space-y-1">
          {DEAL_STEPS.map((s) => {
            const at = deal.steps[s.key];
            return (
              <li key={s.key}>
                <button type="button" disabled={closed || isPending}
                  onClick={() => run(() => setDealStep(inquiryId, s.key, !at))}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-accent/50 disabled:cursor-default disabled:hover:bg-transparent">
                  {at ? (
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leman text-white dark:text-[#0d1513]"><Check className="h-3 w-3" aria-hidden /></span>
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" aria-hidden />
                  )}
                  <span className="min-w-0">
                    <span className={cn("block text-[13.5px] font-medium", at && "text-muted-foreground line-through decoration-muted-foreground/40")}>{s.title}</span>
                    {!at && <span className="block text-[12px] leading-relaxed text-muted-foreground">{s.hint}</span>}
                    {at && <span className="block text-[11.5px] text-muted-foreground">le {new Date(at).toLocaleDateString("fr-CH")}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {!closed && deal.steps.acte && (
          <Button size="sm" variant="accent" className="mt-2" onClick={() => onConclude(accepted)}>
            Acte signé : confirmer la vente{accepted ? ` à ${chf(accepted)}` : ""}
          </Button>
        )}
        <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
          En Suisse, la vente d&apos;un bien immobilier n&apos;est valable que par acte authentique chez le notaire (art. 216 CO). E-Dome suit le parcours ; il ne détient aucun fonds et ne rédige pas l&apos;acte.
        </p>
      </div>
    </section>
  );
}

function gapLabel(amount: number, asking: number) {
  const g = gapToAskingPct(amount, asking);
  if (g === null) return "";
  if (g === 0) return "Au prix demandé";
  return `${g > 0 ? "+" : ""}${String(g).replace(".", ",")} % par rapport au prix demandé (${chf(asking)})`;
}

function OfferRow({
  o, askingPrice, closed, pending, counterOpen, counter, counterNum, onCounterOpen, onCounterChange, onCounterCancel, onStatus,
}: {
  o: DealOffer; askingPrice: number; closed: boolean; pending: boolean;
  counterOpen: boolean; counter: string; counterNum: number;
  onCounterOpen: () => void; onCounterChange: (v: string) => void; onCounterCancel: () => void;
  onStatus: (s: "acceptee" | "refusee" | "contre-offre" | "retiree") => void;
}) {
  const expired = isExpired(o, today());
  const open = !closed && (o.status === "en-attente" || o.status === "contre-offre");
  const tone = o.status === "acceptee" ? "border-leman/40 bg-leman-soft/50" : o.status === "refusee" || o.status === "retiree" ? "opacity-60" : "";
  return (
    <li className={cn("rounded-lg border p-3", tone)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[16px] font-semibold tabular-nums">{chf(o.amountChf)}</p>
        <span className={cn("rounded-md px-2 py-0.5 text-[11.5px] font-medium",
          o.status === "acceptee" ? "bg-leman text-white dark:text-[#0d1513]" : expired ? "bg-warning-soft" : "bg-subtle text-muted-foreground")}>
          {expired ? "Expirée" : OFFER_STATUS_LABEL[o.status]}
          {o.status === "contre-offre" && o.counterAmountChf ? ` à ${chf(o.counterAmountChf)}` : ""}
        </span>
      </div>
      <p className="mt-0.5 text-[12px] text-muted-foreground">
        {gapLabel(o.amountChf, askingPrice)}{askingPrice > 0 ? " · " : ""}{FINANCING_LABEL[o.financing]}
        {o.validUntil ? ` · valable jusqu'au ${new Date(o.validUntil).toLocaleDateString("fr-CH")}` : ""}
      </p>
      {o.conditions && <p className="mt-1.5 whitespace-pre-line text-[12.5px]">{o.conditions}</p>}

      {open && !counterOpen && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Button size="sm" disabled={pending} onClick={() => onStatus("acceptee")}><Check className="h-4 w-4" aria-hidden /> Accepter</Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={onCounterOpen}>Contre-offre</Button>
          <Button size="sm" variant="ghost" disabled={pending} onClick={() => onStatus("refusee")}>Refuser</Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground" disabled={pending} onClick={() => onStatus("retiree")}><Undo2 className="h-4 w-4" aria-hidden /> Retirée</Button>
        </div>
      )}
      {open && counterOpen && (
        <div className="mt-2.5 flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium">Votre contre-offre</span>
            <Input value={counter ? formatNumber(counterNum) : ""} onChange={(e) => onCounterChange(e.target.value)} inputMode="numeric" placeholder="0"
              containerClassName="w-[200px]" trailing={<span className="pr-2 text-[12px] text-muted-foreground">CHF</span>} />
          </label>
          <Button size="sm" disabled={pending || counterNum < 1000} onClick={() => onStatus("contre-offre")}>Noter la contre-offre</Button>
          <Button size="sm" variant="ghost" onClick={onCounterCancel}>Annuler</Button>
        </div>
      )}
    </li>
  );
}
