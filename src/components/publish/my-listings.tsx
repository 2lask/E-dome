"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShareButton } from "@/components/listing/share-button";
import { DiffusionKit } from "@/components/publish/diffusion-kit";
import { ShareKit } from "@/components/share/share-kit";
import { Plus, Eye, Pencil, Trash2, Inbox, Coins, Check, Circle, Building2, Truck, QrCode, ArrowRight } from "lucide-react";
import { MemberHero, heroBtnLight } from "@/components/demandes/member-hero";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { deleteMyProperty } from "@/lib/supabase/property-actions";
import { setMyPrime, liftMyPrime } from "@/lib/supabase/prime-actions";
import { coverOf, primeEligible, type MyProperty } from "@/lib/my-property";
import { CommissionEditor } from "@/components/commission/commission-editor";
import { commissionLabel, defaultTerms, dueLabel, estimateChf, netForApporteur, validateTerms, type CommissionTerms } from "@/lib/commission";
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

function qualityOf(p: MyProperty, prime: CommissionTerms | null) {
  return [
    { ok: p.images.length >= 3, label: "3 photos" },
    { ok: p.title.trim().length >= 20, label: "Titre descriptif" },
    { ok: p.description.trim().length >= 250, label: "Description complète" },
    { ok: p.area > 0, label: "Surface" },
    { ok: !primeEligible(p.transactionType) || !!prime, label: "Commission" },
  ];
}

export function MyListings({
  biens,
  primes,
  stats,
}: {
  biens: MyProperty[];
  primes: Record<string, CommissionTerms>;
  stats: Record<string, ListingStats>;
}) {
  const activePrimes = Object.keys(primes).length;
  const openDemandes = Object.values(stats).reduce((s, x) => s + x.demandes + x.pending, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <MemberHero
        eyebrow="Vendeur"
        icon={Building2}
        title="Mes biens"
        description={
          biens.length === 0
            ? "Vos annonces, leur qualité et leurs commissions d'apport, au même endroit."
            : "Chaque annonce, ce qui lui manque pour recevoir des demandes, et la commission que vous proposez aux apporteurs."
        }
        actions={
          <Link href="/publier" className={heroBtnLight}>
            <Plus className="h-4 w-4" aria-hidden /> Publier un bien
          </Link>
        }
        stats={
          biens.length === 0
            ? undefined
            : [
                { label: `Annonce${biens.length > 1 ? "s" : ""} en ligne`, value: formatNumber(biens.length) },
                { label: `Commission${activePrimes > 1 ? "s" : ""} active${activePrimes > 1 ? "s" : ""}`, value: formatNumber(activePrimes), prime: activePrimes > 0 },
                { label: `Demande${openDemandes > 1 ? "s" : ""} en cours`, value: formatNumber(openDemandes) },
              ]
        }
      />

      {biens.length === 0 ? (
        <section className="relative mt-6 overflow-hidden rounded-3xl border bg-card">
          <div aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-laiton/50 to-transparent" />
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-subtle">
                <Building2 className="h-6 w-6 text-muted-foreground" aria-hidden />
              </span>
              <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.02em]">Aucune annonce pour l&apos;instant</h2>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                Publiez votre bien gratuitement. Proposez une commission d&apos;apport : les apporteurs le recommandent
                avec leur lien, et rien n&apos;est dû sans vente.
              </p>
              <Button asChild className="mt-6 h-11 rounded-xl px-5 text-[14.5px]">
                <Link href="/publier">Publier mon premier bien <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              </Button>
            </div>
            <ol className="relative space-y-3">
              {EMPTY_STEPS.map((s, i) => (
                <li key={s.title} className="relative flex gap-4 rounded-2xl border bg-background/60 p-4">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                      s.prime ? "border-laiton-border bg-laiton-soft text-laiton" : "bg-subtle text-foreground",
                    )}
                  >
                    <s.icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-[14px] font-semibold">
                      <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span> {s.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : (
        <ul className="mt-6 space-y-5">
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
          <Link href={href} className="group mt-6 flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-foreground/20">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leman-soft">
              <Truck className="h-5 w-5 text-leman" aria-hidden />
            </span>
            <span className="flex-1 text-[14px]"><strong>Vous déménagez ?</strong> Nettoyage de fin de bail, déménageurs : jusqu&apos;à trois devis gratuits.</span>
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-leman">
              Demander <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        );
      })()}
    </div>
  );
}

/* Le parcours d'un vendeur, pour un compte neuf : des étapes, aucun chiffre. */
const EMPTY_STEPS = [
  { icon: Plus, title: "Publiez votre bien", body: "Photos, prix et description : l'annonce est en ligne dès l'envoi, gratuitement.", prime: false },
  { icon: Coins, title: "Proposez une commission", body: "Les apporteurs recommandent votre bien avec un lien tracé. Rien n'est dû sans vente.", prime: true },
  { icon: Inbox, title: "Recevez les demandes", body: "Contacts, visites et leads apportés arrivent dans vos Demandes, avec leur origine.", prime: false },
];

function ListingRow({ p, prime, stats }: { p: MyProperty; prime: CommissionTerms | null; stats: ListingStats }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [editingPrime, setEditingPrime] = useState(false);
  const [terms, setTerms] = useState<CommissionTerms>(prime ?? defaultTerms(p.transactionType, p.price));
  const [accepted, setAccepted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [kitOpen, setKitOpen] = useState(false);
  const quality = qualityOf(p, prime);
  const score = quality.filter((q) => q.ok).length;
  const eligible = primeEligible(p.transactionType);
  const estimate = prime ? estimateChf(prime, p.price) : null;

  const savePrime = () =>
    startTransition(async () => {
      const res = await setMyPrime(p.id, terms, accepted);
      if (!res.ok) { addToast(res.error ?? "La commission n'a pas pu être enregistrée.", "error"); return; }
      addToast(`Commission active : ${commissionLabel(terms)}.`, "success");
      setEditingPrime(false);
      setAccepted(false);
      router.refresh();
    });
  const removePrime = () =>
    startTransition(async () => {
      const res = await liftMyPrime(p.id);
      if (!res.ok) { addToast("La commission n'a pas pu être retirée.", "error"); return; }
      addToast("Commission retirée.", "info");
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

  const tool = "h-11 rounded-xl sm:h-9 sm:rounded-lg";

  return (
    <article className="group/row relative overflow-hidden rounded-3xl border bg-card shadow-xs transition-shadow duration-300 hover:shadow-[0_24px_60px_-36px_rgb(0_0_0/0.6)]">
      <div className="flex flex-col gap-5 p-4 sm:flex-row sm:p-5">
        <Link href={`/explorer/${p.id}`} className="relative block shrink-0 overflow-hidden rounded-2xl sm:w-60" tabIndex={-1} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverOf(p)}
            alt=""
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover/row:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/row:scale-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-2.5 top-2.5 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[11.5px] font-medium text-white backdrop-blur-md">
            {TX_LABEL[p.transactionType]}
          </span>
          {prime && (
            <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border border-[rgb(227_184_92/0.6)] bg-[rgb(227_184_92/0.25)] px-2.5 py-1 text-[11.5px] font-semibold text-[#ffe7b0] backdrop-blur-md">
              <Coins className="h-3 w-3" aria-hidden /> Commission
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-success-soft px-2.5 py-0.5 text-[11.5px] font-medium text-[var(--success-text)]">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden /> En ligne
            </span>
            <span className="text-[12px] text-muted-foreground">{p.city}</span>
          </div>
          <Link href={`/explorer/${p.id}`} className="mt-2 block truncate text-[18px] font-semibold tracking-[-0.015em] hover:underline">{p.title}</Link>
          <p className="mt-0.5 text-[14px] text-muted-foreground">
            <span className="text-[16px] font-semibold tabular-nums text-foreground">{chfPrice(p.price)}</span>
            {PRICE_UNIT[p.transactionType]}
          </p>

          <div className="mt-4 grid gap-2.5 sm:mt-auto sm:grid-cols-2 sm:pt-4">
            <Link
              href="/demandes"
              className={cn(
                "flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-2 text-[13px] transition-colors",
                stats.demandes + stats.pending > 0 ? "border-leman/30 bg-leman-soft text-leman hover:border-leman/50" : "text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              <Inbox className="h-4 w-4 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="font-semibold tabular-nums">{stats.demandes}</span> demande{stats.demandes > 1 ? "s" : ""}
                {stats.pending > 0 && ` · ${stats.pending} à décider`}
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
            </Link>
            <div
              className="flex min-h-11 flex-col justify-center gap-1.5 rounded-xl border px-3 py-2"
              title={quality.filter((q) => !q.ok).map((q) => q.label).join(", ") || "Annonce complète"}
            >
              <span className="flex items-center justify-between text-[12.5px]">
                <span className="text-muted-foreground">Qualité de l&apos;annonce</span>
                <span className="font-semibold tabular-nums">{score}/{quality.length}</span>
              </span>
              <span className="flex gap-1" aria-hidden>
                {quality.map((q) => (
                  <span key={q.label} className={cn("h-1.5 flex-1 rounded-full", q.ok ? "bg-leman" : "bg-subtle")} />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions : une barre d'outils, comme dans un tableau de bord. */}
      <div className="flex flex-wrap items-center gap-2 border-t bg-subtle/40 px-4 py-3 sm:px-5">
        <Button asChild size="sm" variant="outline" className={tool}><Link href={`/explorer/${p.id}`}><Eye className="h-4 w-4" aria-hidden /> Voir</Link></Button>
        <ShareButton path={`/explorer/${p.id}`} title={p.title} text={`${p.title} à ${p.city}`} propertyId={p.id} className={tool} />
        <Button size="sm" variant="outline" className={tool} onClick={() => setKitOpen(true)}><QrCode className="h-4 w-4" aria-hidden /> QR et messages</Button>
        {kitOpen && (
          <ShareKit open={kitOpen} onOpenChange={setKitOpen} propertyId={p.id} url={`${window.location.origin}/explorer/${p.id}`}
            title={p.title} city={p.city} cover={coverOf(p)}
            priceLabel={`${chfPrice(p.price)}${PRICE_UNIT[p.transactionType]}`}
            facts={[p.bedrooms > 0 ? `${p.bedrooms} chambre${p.bedrooms > 1 ? "s" : ""}` : "", p.area > 0 ? `${p.area} m²` : ""].filter(Boolean).join(" · ") || undefined} />
        )}
        <Button asChild size="sm" variant="outline" className={tool}><Link href={`/publier?edit=${p.id}`}><Pencil className="h-4 w-4" aria-hidden /> Modifier</Link></Button>
        <span className="flex-1" aria-hidden />
        {confirmDelete ? (
          <Button size="sm" variant="destructive" className={tool} disabled={isPending} onClick={remove}>Confirmer le retrait</Button>
        ) : (
          <Button size="sm" variant="ghost" className={cn(tool, "text-muted-foreground hover:text-[var(--danger-text)]")} onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" aria-hidden /> Retirer
          </Button>
        )}
      </div>

      {/* Qualité : ce qui manque */}
      {score < quality.length && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t px-4 py-3 text-[12.5px] sm:px-5">
          <span className="font-medium">Pour recevoir plus de demandes :</span>
          {quality.filter((q) => !q.ok).map((q) => (
            <span key={q.label} className="inline-flex items-center gap-1 text-muted-foreground">
              <Circle className="h-3 w-3" aria-hidden /> {q.label}
            </span>
          ))}
          <Link href={`/publier?edit=${p.id}`} className="ml-auto inline-flex min-h-11 items-center gap-1 font-medium text-leman hover:underline sm:min-h-0">
            Compléter <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      )}

      {/* Commission */}
      {eligible && (
        <div className={cn("relative border-t px-4 py-3.5 sm:px-5", prime ? "bg-gradient-to-r from-laiton-soft/70 via-laiton-soft/30 to-transparent" : "")}>
          {editingPrime ? (
            <div className="space-y-3 py-1">
              <CommissionEditor tx={p.transactionType} price={p.price} value={terms} onChange={setTerms} accepted={accepted} onAccept={setAccepted} />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="prime" className={tool} disabled={!!validateTerms(terms, p.transactionType, p.price) || !accepted || isPending} onClick={savePrime}>
                  <Check className="h-4 w-4" aria-hidden /> {prime ? "Mettre à jour" : "Activer la commission"}
                </Button>
                <Button size="sm" variant="ghost" className={tool} onClick={() => { setEditingPrime(false); setTerms(prime ?? defaultTerms(p.transactionType, p.price)); }}>Annuler</Button>
              </div>
            </div>
          ) : prime ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-laiton-border bg-laiton-soft">
                <Coins className="h-4 w-4 text-laiton" aria-hidden />
              </span>
              <p className="min-w-[12rem] flex-1 text-[13px]">
                Commission <strong className="tabular-nums text-laiton">{commissionLabel(prime)}</strong>
                {prime.kind === "pourcentage" && estimate ? <span className="tabular-nums"> (≈ {formatNumber(Math.round(estimate))} CHF)</span> : null}
                <span className="text-muted-foreground"> · {dueLabel(prime, p.transactionType)} · l&apos;apporteur touche {estimate ? `${formatNumber(Math.round(netForApporteur(estimate)))} CHF net` : "88 %"}</span>
              </p>
              <Button size="sm" variant="ghost" className={tool} onClick={() => setEditingPrime(true)}>Modifier</Button>
              <Button size="sm" variant="ghost" className={cn(tool, "text-muted-foreground")} disabled={isPending} onClick={removePrime}>Retirer</Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-subtle">
                <Coins className="h-4 w-4 text-muted-foreground" aria-hidden />
              </span>
              <p className="min-w-[12rem] flex-1 text-[13px] text-muted-foreground">
                Sans commission, les apporteurs ne recommandent pas ce bien. Rien n&apos;est dû sans vente.
              </p>
              <Button size="sm" variant="prime" className={tool} onClick={() => setEditingPrime(true)}>Proposer une commission</Button>
            </div>
          )}
        </div>
      )}
      <DiffusionKit p={p} />
    </article>
  );
}
