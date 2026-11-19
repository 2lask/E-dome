"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Trash2, Inbox, Coins, Check, Circle, Building2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { deleteMyProperty } from "@/lib/supabase/property-actions";
import { setMyPrime, liftMyPrime } from "@/lib/supabase/prime-actions";
import {
  apporteurNetChf, coverOf, primeEligible, PRIME_MAX_CHF, PRIME_MIN_CHF, type MyProperty,
} from "@/lib/my-property";
import { PRICE_UNIT, TX_LABEL, chfPrice } from "@/components/listing/listing-card";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Mes biens (REBUILD.md §6) ───────────────────────────────────────────────

   Pour chaque annonce : sa qualité (ce qui manque pour recevoir des
   demandes), ses demandes, sa prime — modifiable sur place — et les actions
   Voir · Modifier · Retirer. Tout est réel ; un compte neuf voit un chemin. */

export interface ListingStats {
  demandes: number;
  pending: number;
}

function qualityOf(p: MyProperty, prime: number | null) {
  return [
    { ok: p.images.length >= 3, label: "3 photos" },
    { ok: p.title.trim().length >= 20, label: "Titre descriptif" },
    { ok: p.description.trim().length >= 250, label: "Description complète" },
    { ok: p.area > 0, label: "Surface" },
    { ok: !primeEligible(p.transactionType) || !!prime, label: "Prime" },
  ];
}

export function MyListings({
  biens,
  primes,
  stats,
}: {
  biens: MyProperty[];
  primes: Record<string, number>;
  stats: Record<string, ListingStats>;
}) {
  const activePrimes = Object.keys(primes).length;
  const openDemandes = Object.values(stats).reduce((s, x) => s + x.demandes + x.pending, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-heading text-[30px]">Mes biens</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {biens.length === 0
              ? "Vos annonces, leur qualité et leurs primes."
              : `${biens.length} annonce${biens.length > 1 ? "s" : ""} · ${activePrimes} prime${activePrimes > 1 ? "s" : ""} active${activePrimes > 1 ? "s" : ""} · ${openDemandes} demande${openDemandes > 1 ? "s" : ""} en cours`}
          </p>
        </div>
        <Button asChild>
          <Link href="/publier"><Plus className="h-4 w-4" aria-hidden /> Publier un bien</Link>
        </Button>
      </header>

      {biens.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-subtle">
            <Building2 className="h-6 w-6 text-muted-foreground" aria-hidden />
          </span>
          <h2 className="mt-4 text-[17px] font-semibold">Aucune annonce pour l&apos;instant</h2>
          <p className="mx-auto mt-1.5 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Publiez votre bien gratuitement. Ajoutez une prime : les apporteurs vous présenteront des acheteurs ou des
            locataires, et vous ne payez que si vous acceptez un contact.
          </p>
          <Button asChild className="mt-5">
            <Link href="/publier">Publier mon premier bien</Link>
          </Button>
        </section>
      ) : (
        <ul className="mt-8 space-y-4">
          {biens.map((p) => (
            <li key={p.id}>
              <ListingRow p={p} prime={primes[p.id] ?? null} stats={stats[p.id] ?? { demandes: 0, pending: 0 }} />
            </li>
          ))}
        </ul>
      )}

      {/* Celui qui remet son bail déménage : le bon moment pour le nettoyage de fin de bail. */}
      {(() => {
        const leaving = biens.find((p) => p.analytics?.reprise === true);
        if (!leaving) return null;
        const href = `/demenagement?depuis=${encodeURIComponent(leaving.city)}&service=nettoyage,demenagement&bien=${leaving.id}`;
        return (
          <Link href={href} className="mt-6 flex items-center gap-3 rounded-2xl border bg-card p-4 hover:border-foreground/20">
            <Truck className="h-5 w-5 shrink-0 text-leman" aria-hidden />
            <span className="flex-1 text-[14px]"><strong>Vous déménagez ?</strong> Nettoyage de fin de bail, déménageurs : jusqu&apos;à trois devis gratuits.</span>
            <span className="text-[13px] font-medium text-leman">Demander →</span>
          </Link>
        );
      })()}
    </div>
  );
}

function ListingRow({ p, prime, stats }: { p: MyProperty; prime: number | null; stats: ListingStats }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [editingPrime, setEditingPrime] = useState(false);
  const [amount, setAmount] = useState(prime ? String(prime) : "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const quality = qualityOf(p, prime);
  const score = quality.filter((q) => q.ok).length;
  const eligible = primeEligible(p.transactionType);
  const value = Number(amount) || 0;
  const validAmount = value >= PRIME_MIN_CHF && value <= PRIME_MAX_CHF;

  const savePrime = () =>
    startTransition(async () => {
      const res = await setMyPrime(p.id, value);
      if (!res.ok) { addToast("La prime n'a pas pu être enregistrée.", "error"); return; }
      addToast(`Prime de ${formatNumber(value)} CHF active.`, "success");
      setEditingPrime(false);
      router.refresh();
    });
  const removePrime = () =>
    startTransition(async () => {
      const res = await liftMyPrime(p.id);
      if (!res.ok) { addToast("La prime n'a pas pu être retirée.", "error"); return; }
      addToast("Prime retirée.", "info");
      setAmount("");
      router.refresh();
    });
  const remove = () =>
    startTransition(async () => {
      const res = await deleteMyProperty(p.id);
      if (!res.ok) {
        addToast(
          res.error === "verrouille"
            ? "Cette annonce a une mise en relation acceptée : elle est conservée comme preuve de la prime. Contactez-nous pour la clore."
            : "L'annonce n'a pas pu être retirée.",
          "error",
        );
        setConfirmDelete(false);
        return;
      }
      addToast("Annonce retirée.", "info");
      router.refresh();
    });

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-xs">
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <Link href={`/explorer/${p.id}`} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverOf(p)} alt="" className="aspect-[4/3] w-full rounded-xl object-cover sm:w-44" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-subtle px-2 py-0.5 text-[11.5px] font-medium">{TX_LABEL[p.transactionType]}</span>
            <span className="inline-flex items-center gap-1 text-[12px] text-[var(--success-text)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden /> En ligne
            </span>
          </div>
          <Link href={`/explorer/${p.id}`} className="mt-1.5 block truncate text-[16px] font-semibold hover:underline">{p.title}</Link>
          <p className="text-[13.5px] text-muted-foreground">
            <span className="font-medium tabular-nums text-foreground">{chfPrice(p.price)}</span>
            {PRICE_UNIT[p.transactionType]} · {p.city}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-[12.5px]">
            <Link href="/demandes" className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1", stats.demandes + stats.pending > 0 ? "border-leman/30 bg-leman-soft text-leman" : "text-muted-foreground")}>
              <Inbox className="h-3.5 w-3.5" aria-hidden />
              {stats.demandes} demande{stats.demandes > 1 ? "s" : ""}
              {stats.pending > 0 && ` · ${stats.pending} à décider`}
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-muted-foreground" title={quality.filter((q) => !q.ok).map((q) => q.label).join(", ") || "Annonce complète"}>
              Qualité {score}/{quality.length}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col sm:items-stretch">
          <Button asChild size="sm" variant="outline"><Link href={`/explorer/${p.id}`}><Eye className="h-4 w-4" aria-hidden /> Voir</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href={`/publier?edit=${p.id}`}><Pencil className="h-4 w-4" aria-hidden /> Modifier</Link></Button>
          {confirmDelete ? (
            <Button size="sm" variant="destructive" disabled={isPending} onClick={remove}>Confirmer le retrait</Button>
          ) : (
            <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4" aria-hidden /> Retirer
            </Button>
          )}
        </div>
      </div>

      {/* Qualité : ce qui manque */}
      {score < quality.length && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t bg-subtle/50 px-4 py-2.5 text-[12.5px]">
          <span className="font-medium">Pour recevoir plus de demandes :</span>
          {quality.filter((q) => !q.ok).map((q) => (
            <span key={q.label} className="inline-flex items-center gap-1 text-muted-foreground">
              <Circle className="h-3 w-3" aria-hidden /> {q.label}
            </span>
          ))}
          <Link href={`/publier?edit=${p.id}`} className="ml-auto font-medium text-leman hover:underline">Compléter</Link>
        </div>
      )}

      {/* Prime */}
      {eligible && (
        <div className={cn("flex flex-wrap items-center gap-3 border-t px-4 py-3", prime ? "bg-laiton-soft/40" : "")}>
          <Coins className={cn("h-4 w-4", prime ? "text-laiton" : "text-muted-foreground")} aria-hidden />
          {editingPrime || (!prime && amount) ? (
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                inputMode="numeric"
                aria-label="Montant de la prime en francs"
                placeholder={`${PRIME_MIN_CHF} à ${formatNumber(PRIME_MAX_CHF)}`}
                className="h-9" containerClassName="w-36"
                trailing={<span className="pr-2 text-[12px] text-muted-foreground">CHF</span>}
              />
              <Button size="sm" variant="prime" disabled={!validAmount || isPending} onClick={savePrime}>
                <Check className="h-4 w-4" aria-hidden /> {prime ? "Mettre à jour" : "Activer"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditingPrime(false); setAmount(prime ? String(prime) : ""); }}>Annuler</Button>
              {validAmount && (
                <span className="text-[12.5px] text-muted-foreground">
                  L&apos;apporteur touche {formatNumber(apporteurNetChf(value))} CHF net
                </span>
              )}
            </div>
          ) : prime ? (
            <>
              <p className="flex-1 text-[13px]">
                Prime active <strong className="tabular-nums text-laiton">{formatNumber(prime)} CHF</strong>
                <span className="text-muted-foreground"> — les apporteurs voient ce bien et peuvent vous présenter des contacts.</span>
              </p>
              <Button size="sm" variant="ghost" onClick={() => setEditingPrime(true)}>Modifier</Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground" disabled={isPending} onClick={removePrime}>Retirer</Button>
            </>
          ) : (
            <>
              <p className="flex-1 text-[13px] text-muted-foreground">
                Sans prime, les apporteurs ne recommandent pas ce bien. Vous ne payez que si vous acceptez un contact.
              </p>
              <Button size="sm" variant="prime" onClick={() => { setEditingPrime(true); setAmount("500"); }}>Ajouter une prime</Button>
            </>
          )}
        </div>
      )}
    </article>
  );
}
