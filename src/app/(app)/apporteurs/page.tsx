"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Percent, Repeat, ShieldCheck, Copy, Check, ExternalLink } from "lucide-react";
import { useApp } from "@/lib/context";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { useApporteurBook } from "@/lib/use-business";
import { useToast } from "@/components/ui/toast";
import { buildObjectAffiliate, buildReferralUrl, slugifyLinkLabel } from "@/lib/referral-links";
import {
  APPORTEUR_SUBSCRIPTION_SHARES,
  APPORTEUR_WINDOW_MONTHS,
  PLANS,
  PRIME_DISPUTE,
  PRIME_MANUAL_REVIEW_ABOVE,
  PRIME_RANGE_LABEL,
} from "@/lib/pricing";
import { PLAN_META } from "@/content/tarifs";
import {
  EDOME_PRIME_SHARE_LABEL,
  affiliableOffers,
  canIntroduce,
  chfLabel,
  offerNetCents,
  pctLabel,
  primeListings,
  subscriptionShareCents,
  type ApportLine,
  type AffiliableOffer,
  type Mechanic,
} from "@/lib/demo/affiliation";
import { ApporteurTotals, PrimeCountryNotice } from "@/components/business/apporteur-summary";

/* ── `/apporteurs` — l'espace apporteur, refondu (P4a, D14) ──────────────────

   Un COMMUTATEUR en tête : Biens / Marketplace. Jamais les deux mécaniques
   dans la même grille — c'était le bug de l'ancienne page (une prime affichée
   comme un pourcentage). Biens : des PRIMES en francs, triées par prime, avec
   le NET de l'apporteur. Marketplace : un pourcentage qui n'explique que — le
   chiffre mis en avant est toujours le NET en CHF. Puis les Abonnements.

   UNE source : `apporteurBook()` (la même que `/dashboard/apporteurs`). Plus
   de classement nominatif avec montants : E-Dome n'affirme aucune traction.

   La personne est l'acteur de session (chantier P3) : en incarnant Hélène
   Marchal (Évian, France), l'onglet Biens dit pourquoi elle n'y touche pas. */

type Tab = "biens" | "marketplace";

const STATUS_LABEL: Record<ApportLine["status"], { label: string; cls: string }> = {
  acquis: { label: "Acquis", cls: "chip-success-soft" },
  "en-attente": { label: "En attente du vendeur", cls: "chip-warning-soft" },
  refuse: { label: "Refusé · rien dû", cls: "bg-[var(--hover-bg)] text-[var(--text-muted)]" },
  rembourse: { label: "Contesté · remboursé", cls: "bg-[var(--hover-bg)] text-[var(--text-muted)]" },
};

export default function ApporteursPage() {
  const { state, actorId } = useSession();
  const book = useApporteurBook();
  const [tab, setTab] = useState<Tab>("biens");

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 animate-fade-in">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">Espace apporteur</p>
        <h1 className="text-2xl page-heading text-[var(--foreground)] sm:text-3xl">Recommandez, et voyez ce que vous touchez avant de recommander</h1>
        <p className="max-w-3xl text-sm text-[var(--text-secondary)]">
          Deux mécaniques, jamais confondues. Sur un <strong>bien</strong>, le vendeur offre une prime fixe en francs, payée quand il accepte le contact que
          vous amenez. Sur la <strong>marketplace</strong>, le vendeur vous reverse un pourcentage du prix, pris sur sa marge. Dans les deux cas, rien
          n&apos;est ajouté au prix payé par le client — et vous ne négociez rien, ne représentez personne.
        </p>
      </header>

      <section data-tour="apporteurs-totals" aria-label="Vos apports" className="space-y-2">
        <ApporteurTotals book={book} />
        <p className="text-[11.5px] text-[var(--text-muted)]">
          Un seul calcul pour tout l&apos;espace — le même que votre <Link href="/dashboard/apporteurs" className="text-[var(--primary)] hover:underline">tableau de bord</Link>.
        </p>
      </section>

      {/* Le commutateur */}
      <div data-tour="apporteurs-tabs" role="tablist" aria-label="Mécanique" className="inline-flex rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1">
        {([
          { key: "biens", label: "Biens", icon: Building2, hint: "prime en CHF" },
          { key: "marketplace", label: "Marketplace", icon: Percent, hint: "net en CHF" },
        ] as const).map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.key ? "bg-[var(--foreground)] text-[var(--background)]" : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <t.icon size={15} aria-hidden />
            {t.label}
            <span className="hidden text-[11px] opacity-70 sm:inline">· {t.hint}</span>
          </button>
        ))}
      </div>

      {tab === "biens" ? (
        <BiensTab state={state} actorId={actorId} book={book} />
      ) : (
        <MarketplaceTab state={state} book={book} />
      )}

      <AbonnementsSection book={book} />

      <section data-tour="apporteurs-rules" className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <ShieldCheck size={15} className="text-[var(--primary)]" aria-hidden /> Les règles du programme
        </h2>
        <ul className="space-y-1.5 text-[12.5px] leading-snug text-[var(--text-secondary)]">
          <li>· Activation après vérification d&apos;identité. Le vendeur peut fermer chaque annonce aux apporteurs : double accord.</li>
          <li>· Aucune intermédiation : vous ne négociez aucun prix, ne signez aucun mandat, ne représentez aucune partie.</li>
          <li>· Biens : une prime au-delà de {chfLabel(PRIME_MANUAL_REVIEW_ABOVE.cents)} passe en vérification renforcée et validation manuelle. Un apporteur contesté {PRIME_DISPUTE.contestedLimit} fois perd l&apos;accès au volet biens.</li>
          <li>· Le volet biens dépend du pays de l&apos;apporteur ; la marketplace est ouverte partout.</li>
        </ul>
      </section>
    </div>
  );
}

/* ── Onglet BIENS ─────────────────────────────────────────────────────────── */

function BiensTab({
  state,
  actorId,
  book,
}: {
  state: ReturnType<typeof useSession>["state"];
  actorId: string;
  book: ReturnType<typeof useApporteurBook>;
}) {
  const { addToast } = useToast();
  const listings = useMemo(() => primeListings(state), [state]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [contact, setContact] = useState("");

  if (!book.eligibility.eligible) {
    return (
      <section className="space-y-3" aria-label="Biens">
        <PrimeCountryNotice country={book.eligibility.country} reason={book.eligibility.reason} />
        <p className="text-[12.5px] text-[var(--text-muted)]">
          Vous restez apporteur sur la marketplace et sur les abonnements : passez à l&apos;onglet Marketplace.
        </p>
      </section>
    );
  }

  const submit = (propertyId: string, sellerId: string, primeChf: number) => {
    if (contact.trim().length < 3) return;
    recordSessionEvent({ kind: "introduction.made", data: { propertyId, sellerId, contactLabel: contact.trim(), primeChf } });
    setContact("");
    setOpenId(null);
    addToast("Contact proposé. Le vendeur accepte (prime due) ou refuse (rien dû).", "success");
  };

  return (
    <section className="space-y-4" aria-label="Biens">
      <p className="text-[12.5px] text-[var(--text-secondary)]">
        Biens à prime active, du plus au moins rémunérateur. La prime ({PRIME_RANGE_LABEL}) est fixée par le vendeur et due quand il accepte votre
        contact — jamais un pourcentage du prix, jamais liée à la vente. E-Dome en retient {EDOME_PRIME_SHARE_LABEL} ; vous voyez votre net.
      </p>
      <ul className="space-y-2.5">
        {listings.map(({ property, setting, breakdown, manualReview }) => {
          const guard = canIntroduce(state, actorId, property.id);
          const own = !guard.ok && guard.reason === "own-listing";
          return (
            <li key={property.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={property.images[0]} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <Link href={`/explorer/${property.id}`} className="block truncate text-[14px] font-semibold text-[var(--foreground)] hover:underline">
                    {property.title}
                  </Link>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {property.location.city} · {property.transactionType === "vente" ? "Vente" : "Location longue durée"} · prime fixée par le vendeur
                    {manualReview ? " · validation manuelle" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums text-[var(--foreground)]">{chfLabel(breakdown.apporteurCents)}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">net pour vous · prime {chfLabel(setting.amountChf * 100)}</p>
                </div>
                {own ? (
                  <span className="shrink-0 rounded-lg border border-[var(--card-border)] px-3 py-2 text-[12px] text-[var(--text-muted)]">Votre bien</span>
                ) : guard.ok ? (
                  <button
                    type="button"
                    onClick={() => { setOpenId(openId === property.id ? null : property.id); setContact(""); }}
                    className="shrink-0 rounded-lg bg-[var(--foreground)] px-3 py-2 text-[12.5px] font-medium text-[var(--background)] hover:opacity-90"
                  >
                    Proposer un contact
                  </button>
                ) : (
                  <span className="shrink-0 max-w-[12rem] text-[11.5px] text-[var(--text-muted)]">{guard.message}</span>
                )}
              </div>
              {openId === property.id && guard.ok && (
                <form
                  className="mt-3 flex flex-col gap-2 border-t border-[var(--card-border)] pt-3 sm:flex-row"
                  onSubmit={(e) => { e.preventDefault(); submit(property.id, setting.sellerId, setting.amountChf); }}
                >
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Qui amenez-vous ? Ex. couple, cherche un 4,5 p. proche des écoles"
                    className="flex-1 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  />
                  <button type="submit" disabled={contact.trim().length < 3} className="rounded-lg bg-[var(--primary)] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50">
                    Envoyer au vendeur
                  </button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
      <ApportList title="Vos mises en relation" lines={book.lines} mechanic="bien" empty="Aucune mise en relation pour l'instant." />
    </section>
  );
}

/* ── Onglet MARKETPLACE ───────────────────────────────────────────────────── */

const LINK_KIND: Partial<Record<AffiliableOffer["pole"], "formation" | "evenement">> = {
  formation: "formation",
  evenement: "evenement",
};

function MarketplaceTab({ state, book }: { state: ReturnType<typeof useSession>["state"]; book: ReturnType<typeof useApporteurBook> }) {
  const { addReferralLink, hasReferralLinkFor } = useApp();
  const { addToast } = useToast();
  const offers = useMemo(
    () => affiliableOffers(state).slice().sort((a, b) => offerNetCents(b) - offerNetCents(a)),
    [state],
  );

  const createLink = (o: AffiliableOffer) => {
    const kind = LINK_KIND[o.pole];
    const created = kind
      ? addReferralLink(buildObjectAffiliate(kind, o.id, o.title, { image: o.image, price: o.priceChf, currency: "CHF" }))
      : addReferralLink({
          label: o.title,
          url: buildReferralUrl(slugifyLinkLabel(o.title)),
          redirect: o.href,
          description: `${o.kindLabel} · vous touchez ${chfLabel(offerNetCents(o))} net (${pctLabel(o.rate)} du prix, sur la marge du vendeur).`,
          commission: `${chfLabel(offerNetCents(o))} net`,
          clicks: 0,
          conversions: 0,
          earned: 0,
          color: "bg-[var(--primary)]/15 text-[var(--primary)]",
        });
    addToast(created ? `Lien créé pour « ${o.title} »` : "Ce lien existe déjà.", created ? "success" : "info");
  };

  return (
    <section className="space-y-4" aria-label="Marketplace">
      <p className="text-[12.5px] text-[var(--text-secondary)]">
        Produits que leurs vendeurs ont ouverts à l&apos;affiliation : formations, lives, événements, services, courte durée. Le chiffre en gras est ce
        que vous touchez, net, sur une vente ; le pourcentage n&apos;explique que d&apos;où il vient. La commission d&apos;E-Dome n&apos;en est pas diminuée.
      </p>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {offers.map((o) => {
          const linked = LINK_KIND[o.pole] ? hasReferralLinkFor(LINK_KIND[o.pole]!, o.id) : false;
          return (
            <li key={`${o.pole}-${o.id}`} className="flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <span className="rounded-full bg-[var(--hover-bg)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--text-muted)]">{o.kindLabel}</span>
                  <Link href={o.href} className="mt-1 block text-[13.5px] font-semibold leading-snug text-[var(--foreground)] hover:underline">
                    {o.title}
                  </Link>
                  <p className="text-[11.5px] text-[var(--text-muted)]">{o.ownerName}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold tabular-nums text-[var(--foreground)]">{chfLabel(offerNetCents(o))}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">net pour vous</p>
                </div>
              </div>
              <p className="mt-2 text-[11.5px] text-[var(--text-muted)]">
                {pctLabel(o.rate)} de {chfLabel(o.priceChf * 100)} ({o.unitLabel}), pris sur la marge du vendeur.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => createLink(o)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90"
                >
                  {linked ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
                  {linked ? "Lien créé" : "Créer mon lien"}
                </button>
                <Link href={o.href} className="inline-flex items-center gap-1 rounded-md border border-[var(--card-border)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]">
                  <ExternalLink size={12} aria-hidden /> Voir
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      <ApportList title="Vos ventes affiliées" lines={book.lines} mechanic="marketplace" empty="Aucune vente affiliée pour l'instant." />
    </section>
  );
}

/* ── ABONNEMENTS ──────────────────────────────────────────────────────────── */

function AbonnementsSection({ book }: { book: ReturnType<typeof useApporteurBook> }) {
  const paid = PLANS.filter((p) => p.price.month.cents > 0).slice().sort((a, b) => a.tier - b.tier || a.price.month.cents - b.price.month.cents);
  return (
    <section data-tour="apporteurs-abonnements" className="space-y-3" aria-label="Abonnements">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
        <Repeat size={17} className="text-[var(--primary)]" aria-hidden /> Abonnements
      </h2>
      <p className="text-[12.5px] text-[var(--text-secondary)]">
        Amener une agence ou un propriétaire qui s&apos;abonne : une part de ce qu&apos;E-Dome encaisse, pendant {APPORTEUR_WINDOW_MONTHS} mois au plus. Le
        barème dépend de la formule, et sort de la part d&apos;E-Dome — jamais du prix de l&apos;abonné.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--text-muted)]">
              <th className="p-3 font-medium">Formule</th>
              <th className="p-3 font-medium">Votre part</th>
              <th className="p-3 text-right font-medium">Net par mois</th>
              <th className="p-3 text-right font-medium">Sur {APPORTEUR_WINDOW_MONTHS} mois</th>
            </tr>
          </thead>
          <tbody>
            {paid.map((p) => {
              const share = subscriptionShareCents(p.id);
              return (
                <tr key={p.id} className="border-b border-[var(--card-border)] last:border-0">
                  <td className="p-3 font-medium text-[var(--foreground)]">
                    {PLAN_META[p.id]?.name ?? p.id}
                    {p.stage !== "launch" && <span className="ml-1 text-[11px] text-[var(--text-muted)]">(ensuite)</span>}
                  </td>
                  <td className="p-3 text-[var(--text-secondary)]">{pctLabel(APPORTEUR_SUBSCRIPTION_SHARES[p.id] ?? 0)} de ce qu&apos;encaisse E-Dome</td>
                  <td className="p-3 text-right tabular-nums text-[var(--foreground)]">{chfLabel(share)}</td>
                  <td className="p-3 text-right font-semibold tabular-nums text-[var(--foreground)]">{chfLabel(share * APPORTEUR_WINDOW_MONTHS)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ApportList title="Vos abonnements apportés" lines={book.lines} mechanic="abonnement" empty="Aucun abonnement apporté pour l'instant." />
    </section>
  );
}

/* ── Liste d'apports d'une mécanique ──────────────────────────────────────── */

function ApportList({ title, lines, mechanic, empty }: { title: string; lines: ApportLine[]; mechanic: Mechanic; empty: string }) {
  const mine = lines.filter((l) => l.mechanic === mechanic);
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      {mine.length === 0 ? (
        <p className="text-[12.5px] text-[var(--text-muted)]">{empty}</p>
      ) : (
        <ul className="divide-y divide-[var(--card-border)] rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
          {mine.map((l) => {
            const st = STATUS_LABEL[l.status];
            return (
              <li key={l.id} className="flex flex-col gap-1 p-3 text-[12.5px] sm:flex-row sm:items-center sm:gap-3">
                <div className="min-w-0 flex-1">
                  {l.href ? (
                    <Link href={l.href} className="font-medium text-[var(--foreground)] hover:underline">{l.label}</Link>
                  ) : (
                    <span className="font-medium text-[var(--foreground)]">{l.label}</span>
                  )}
                  <p className="text-[11.5px] text-[var(--text-muted)]">{l.date} · {l.detail}</p>
                </div>
                <span className={`self-start rounded-full px-2 py-0.5 text-[11px] font-medium sm:self-auto ${st.cls}`}>{st.label}</span>
                <span className="w-24 text-right font-semibold tabular-nums text-[var(--foreground)]">{l.netCents > 0 ? chfLabel(l.netCents) : "—"}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
