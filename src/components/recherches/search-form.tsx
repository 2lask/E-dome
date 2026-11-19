"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Coins, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMySearch } from "@/lib/supabase/search-actions";
import { apporteurNetChf } from "@/lib/my-property";
import { REWARD_MAX_CHF, REWARD_MIN_CHF, type SearchKind, type SearchTransaction } from "@/lib/recherches";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Publier une recherche à récompense ──────────────────────────────────────
   Deux publics : la personne qui cherche un logement (location ou achat), et
   l'agence qui cherche des propriétaires vendeurs. Une récompense fixe,
   obligatoire — c'est elle qui met le réseau en mouvement. */

const PRESETS = [200, 500, 1000, 1500];
const digits = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

export function SearchForm({ isAgency }: { isAgency: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [kind, setKind] = useState<SearchKind>(isAgency ? "vendeurs" : "logement");
  const [tx, setTx] = useState<SearchTransaction>("location");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [budget, setBudget] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState(isAgency ? "1000" : "500");
  const [error, setError] = useState("");
  const rewardN = digits(reward);
  const rewardOk = rewardN >= REWARD_MIN_CHF && rewardN <= REWARD_MAX_CHF;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await createMySearch({
        kind,
        transaction: tx,
        city,
        area,
        roomsMin: rooms ? Number(rooms.replace(",", ".")) : null,
        budgetMax: digits(budget) || null,
        neededBy: neededBy || null,
        description,
        rewardChf: rewardN,
      });
      if (!res.ok) { setError(res.error); return; }
      router.push(`/recherches/${res.id}?publie=1`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6">
      <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour
      </button>
      <div>
        <h1 className="page-heading text-[30px]">Publier ma recherche</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">Dites ce que vous cherchez et ce que vous offrez à qui vous le trouve. Vous ne payez que si vous acceptez une proposition.</p>
      </div>

      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
        <div role="radiogroup" aria-label="Ce que vous cherchez" className="grid grid-cols-2 rounded-xl border bg-subtle p-1">
          {([["logement", "Je cherche un logement"], ["vendeurs", "Je cherche des vendeurs"]] as const).map(([k, l]) => (
            <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)}
              className={cn("h-10 rounded-lg px-1 text-[13px] sm:text-[14px]", kind === k ? "bg-card font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground")}>
              {l}
            </button>
          ))}
        </div>
        {kind === "vendeurs" && (
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Pour les agences et les acheteurs : vous récompensez qui vous présente un propriétaire qui souhaite vendre, avec son accord.
          </p>
        )}

        {kind === "logement" && (
          <div role="radiogroup" aria-label="Location ou achat" className="flex gap-2">
            {([["location", "À louer"], ["achat", "À acheter"]] as const).map(([k, l]) => (
              <button key={k} type="button" role="radio" aria-checked={tx === k} onClick={() => setTx(k)}
                className={cn("h-9 rounded-full border px-3.5 text-[13px]", tx === k ? "border-leman bg-leman-soft font-medium text-leman" : "bg-card hover:border-foreground/25")}>
                {l}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Localité</span>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex. Lausanne" required /></label>
          <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Quartier ou rayon</span>
            <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex. Sous-Gare, Ouchy, 10 min du centre" /></label>
        </div>
        {kind === "logement" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Pièces (min.)</span>
              <Input value={rooms} onChange={(e) => setRooms(e.target.value.replace(/[^\d.,]/g, "").slice(0, 4))} inputMode="decimal" placeholder="3,5" /></label>
            <label className="block"><span className="mb-1.5 block text-[13px] font-medium">{tx === "location" ? "Loyer max" : "Budget max"}</span>
              <Input value={budget ? formatNumber(digits(budget)) : ""} onChange={(e) => setBudget(e.target.value)} inputMode="numeric" placeholder="0"
                trailing={<span className="pr-2 text-[12px] text-muted-foreground">CHF</span>} /></label>
            <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Avant le</span>
              <Input type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} /></label>
          </div>
        )}
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Votre recherche, en quelques lignes</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={2000} required
            placeholder={kind === "logement"
              ? "Ex. Couple, deux salaires, non-fumeurs, sans animaux. Cherchons un 3,5 pièces lumineux proche des transports, idéalement avec balcon."
              : "Ex. Agence active à Neuchâtel depuis 15 ans. Nous cherchons des appartements et maisons à vendre dans le canton."}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[14px] leading-relaxed shadow-xs outline-none placeholder:text-muted-foreground hover:border-foreground/25 focus:border-leman" />
        </label>
      </section>

      <section className="space-y-3 rounded-2xl border border-laiton-border bg-laiton-soft/40 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-laiton" aria-hidden />
          <h2 className="text-[16px] font-semibold">Votre récompense</h2>
        </div>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
          Due quand vous <strong className="text-foreground">acceptez</strong> une proposition qui vous convient — pas avant, et rien si vous refusez.
          Un montant fixe, jamais un pourcentage.
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((v) => (
            <button key={v} type="button" onClick={() => setReward(String(v))} aria-pressed={rewardN === v}
              className={cn("h-8 rounded-full border px-3 text-[13px] tabular-nums", rewardN === v ? "border-laiton bg-card font-semibold text-laiton" : "border-laiton-border bg-card/60 hover:bg-card")}>
              {formatNumber(v)} CHF
            </button>
          ))}
        </div>
        <label className="block max-w-[220px]"><span className="mb-1.5 block text-[13px] font-medium">Montant</span>
          <Input value={reward} onChange={(e) => setReward(e.target.value.replace(/[^\d]/g, "").slice(0, 4))} inputMode="numeric"
            trailing={<span className="pr-2 text-[12px] text-muted-foreground">CHF</span>} /></label>
        {rewardOk && (
          <p className="text-[13px]">Qui vous aide touche <strong className="tabular-nums">{formatNumber(apporteurNetChf(rewardN))} CHF</strong> net.</p>
        )}
      </section>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-[13.5px] text-[var(--danger-text)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isPending || !rewardOk}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Publier ma recherche
      </Button>
    </form>
  );
}
