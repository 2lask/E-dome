"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Coins, Copy, Eye, Handshake, Inbox, Link2, Loader2, MessageCircle, MousePointerClick, QrCode, Radio, Search, Sparkles, Target,
} from "lucide-react";
import { ShareKit } from "@/components/share/share-kit";
import { withSource } from "@/lib/tracking";
import { PayoutForm } from "@/components/reglements/payout-form";
import type { PayoutProfile } from "@/lib/reglements";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/dashboard/glow-card";
import { SpotlightCard } from "@/components/ui/motion/spotlight";
import { getOrCreateMyLink } from "@/lib/supabase/apport-actions";
import { commissionLabel, dueLabel, netForApporteur } from "@/lib/commission";
import type { PrimedProperty } from "@/lib/my-property";
import type { ApporteurStats } from "@/lib/dashboard-stats";
import { formatNumber } from "@/lib/format";
import { track } from "@/components/listing/track";

/* ── Espace apporteur (membre) ───────────────────────────────────────────────
   Le cœur de l'apport d'affaires : chaque bien à commission avec ce que JE
   touche (net), et en un geste mon lien personnel tracé (copie, WhatsApp).
   Les liens déjà créés arrivent du serveur avec leurs clics, leads et ventes.
   En tête : mes chiffres réels des 30 derniers jours, dans l'en-tête sombre
   (même grammaire que l'en-tête membre partagé). */

type LinkStat = ApporteurStats["links"][number];

const focusGold = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b85c]";

export function ApporteurHub({ offers, stats, payout = null }: { offers: PrimedProperty[]; stats: ApporteurStats | null; payout?: PayoutProfile | null }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"tous" | "vente" | "location">("tous");
  const byProperty = useMemo(() => new Map((stats?.links ?? []).map((l) => [l.propertyId, l])), [stats]);

  const shown = offers.filter((o) => {
    if (kind === "vente" && o.transactionType !== "vente") return false;
    if (kind === "location" && o.transactionType === "vente") return false;
    const q = query.trim().toLowerCase();
    return !q || o.title.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
  });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="v3-beam v3-beam--cine rounded-3xl shadow-[0_30px_90px_-30px_rgb(0_0_0/0.7)]">
        <div className="v3-beam__inner cine v3-grain relative rounded-3xl px-5 pb-6 pt-8 md:px-9 md:pb-8 md:pt-10">
          <div aria-hidden className="cine-aurora" />
          <div aria-hidden className="cine-grid" />
          <div aria-hidden className="v3-orb v3-orb--gold -left-20 -top-24 h-72 w-72" />
          <div aria-hidden className="v3-orb v3-orb--leman -right-16 top-10 h-64 w-64" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="v3-eyebrow v3-eyebrow--cine">Espace apporteur</p>
              <h1 className="mt-4 text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-[52px]">
                Recommandez. <span className="cine-gold">Encaissez.</span>
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">
                Prenez votre lien sur un bien, envoyez-le à qui cherche : par message, par e-mail ou avec votre QR code.
                Chaque visite, lead et vente venus de votre lien vous sont attribués 60 jours, et la commission est
                calculée automatiquement.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a href="#biens" className={`cine-btn-gold v3-sheen inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold ${focusGold}`}>
                <Coins className="h-4 w-4" aria-hidden />Voir les biens
              </a>
              <Link href="/tableau-de-bord?vue=apports" className={`inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 text-[14px] font-semibold text-white/90 transition-colors hover:bg-white/10 ${focusGold}`}>
                Mon tableau de bord <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <dl aria-label="Mes chiffres sur 30 jours" className="relative mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
            <Stat icon={MousePointerClick} label="Clics sur mes liens" value={stats?.clicks ?? 0} sub={`${formatNumber(stats?.visitors ?? 0)} personnes`} />
            <Stat icon={Inbox} label="Leads apportés" value={stats?.leads ?? 0} sub="30 derniers jours" />
            <Stat icon={Handshake} label="Ventes conclues" value={stats?.sales ?? 0} sub={`${formatNumber(stats?.revenueGenerated ?? 0)} CHF de ventes`} />
            <Stat icon={Coins} label="Gagné, net" value={stats?.commissionsEarned ?? 0} money accent="laiton" sub={`≈ ${formatNumber(Math.round(stats?.commissionsPending ?? 0))} CHF en cours`} />
          </dl>
        </div>
      </header>

      {!(payout?.iban || payout?.twintPhone) && <PayoutBanner payout={payout} />}

      <section id="biens" className="mt-12 scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="v3-eyebrow">À recommander</p>
            <h2 className="v3-heading mt-3 text-[26px] font-semibold tracking-[-0.03em] sm:text-[30px]">Biens à recommander</h2>
            <p className="mt-0.5 text-[13.5px] text-muted-foreground">
              {offers.length === 0 ? "Aucun pour l'instant." : `${offers.length} bien${offers.length > 1 ? "s" : ""} avec commission · montants nets pour vous`}
            </p>
          </div>
          {offers.length > 0 && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
                <span className="sr-only">Rechercher un bien</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ville ou titre"
                  className="h-11 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-9 pr-3 text-[14px] outline-none transition-colors focus:border-[var(--leman)]"
                />
              </label>
              <div role="tablist" aria-label="Type" className="flex rounded-xl border bg-card p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
                {(["tous", "vente", "location"] as const).map((k) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={kind === k}
                    onClick={() => setKind(k)}
                    className={`h-9 rounded-lg px-3.5 text-[13px] font-medium transition-colors ${kind === k ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {k === "tous" ? "Tous" : k === "vente" ? "Vente" : "Location"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {offers.length === 0 ? (
          <div className="relative mt-5 overflow-hidden rounded-[1.25rem] border border-dashed bg-card px-6 py-14 text-center">
            <div aria-hidden className="v3-dots" />
            <span className="v3-icon v3-icon--gold relative mx-auto h-12 w-12"><Sparkles className="h-5 w-5" aria-hidden /></span>
            <p className="relative mt-4 text-[16px] font-semibold">Les premiers biens à commission arrivent</p>
            <p className="relative mx-auto mt-1 max-w-md text-[13.5px] text-muted-foreground">
              Dès qu&apos;un propriétaire propose une commission, son bien apparaît ici avec votre gain. Vous vendez vous-même ?
              Publiez et proposez une commission : le réseau travaille pour vous.
            </p>
            <Button asChild size="lg" className="relative mt-6"><Link href="/publier">Publier un bien</Link></Button>
          </div>
        ) : shown.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed px-4 py-6 text-center text-[14px] text-muted-foreground">Aucun bien ne correspond à cette recherche.</p>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((o) => <OfferCard key={o.primeId} offer={o} link={byProperty.get(o.propertyId)} />)}
          </ul>
        )}
      </section>

      <section aria-label="Conseils" className="mt-14">
        <p className="v3-eyebrow v3-eyebrow--leman">Bonnes pratiques</p>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { t: "Ciblez une personne", d: "Un message personnel à quelqu'un qui cherche vraiment convertit bien mieux qu'un partage à tout votre réseau.", icon: Target },
            { t: "Toujours votre lien", d: "C'est lui qui prouve que le contact vient de vous. Sans lien, pas d'attribution automatique.", icon: Link2 },
            { t: "Suivez en direct", d: "Votre tableau de bord montre chaque clic et chaque lead à l'instant où il arrive : relancez au bon moment.", icon: Radio },
          ].map((c, i) => (
            <SpotlightCard as="li" key={c.t} className="v3-card--static p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="v3-icon h-10 w-10"><c.icon className="h-[18px] w-[18px]" aria-hidden /></span>
                <span className="font-mono text-[12px] tabular-nums text-muted-foreground">0{i + 1}</span>
              </div>
              <p className="mt-4 text-[15.5px] font-semibold tracking-[-0.01em]">{c.t}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{c.d}</p>
            </SpotlightCard>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* Sans TWINT ni IBAN, un vendeur ne peut pas payer l'apporteur : on le dit
   en tête, avec le formulaire sur place. */
function PayoutBanner({ payout }: { payout: PayoutProfile | null }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  if (done) return null;
  return (
    <section aria-label="Coordonnées de paiement" className="relative mt-5 overflow-hidden rounded-[1.25rem] border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/40 to-card p-5 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-laiton/70 to-transparent" />
      <div className="relative flex flex-wrap items-center gap-4">
        <span className="v3-icon v3-icon--gold h-11 w-11"><Coins className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1 basis-60">
          <p className="text-[15px] font-semibold">Une étape pour être payé</p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">Ajoutez votre TWINT ou votre IBAN : le vendeur vous paie directement à la vente, E-Dome ne touche jamais l&apos;argent.</p>
        </div>
        {!open && <Button size="lg" variant="prime" className="rounded-xl" onClick={() => setOpen(true)}>Ajouter maintenant <ArrowRight className="h-4 w-4" aria-hidden /></Button>}
      </div>
      {open && <div className="relative mt-4 max-w-2xl"><PayoutForm initial={payout} onSaved={() => setDone(true)} submitLabel="Enregistrer mes coordonnées" /></div>}
    </section>
  );
}

function Stat({ icon: Icon, label, value, sub, money, accent }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub: string;
  money?: boolean;
  accent?: "laiton";
}) {
  return (
    <div className="relative min-w-0 bg-[#0e0c09]/85 px-4 py-4 backdrop-blur-sm sm:px-5">
      <dt className="flex items-center gap-1.5 text-[12px] font-medium text-white/60">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${accent ? "text-[#e3b85c]" : "text-[#5fd3c4]"}`} aria-hidden /><span className="truncate">{label}</span>
      </dt>
      <dd className={`mt-2 truncate text-[24px] font-semibold leading-none tracking-[-0.03em] tabular-nums sm:text-[30px] ${accent ? "text-[#f0c977]" : "text-white"}`}>
        <AnimatedNumber value={value} />{money ? <span className="ml-1 text-[13px] font-semibold tracking-normal">CHF</span> : null}
      </dd>
      <dd className="mt-1.5 truncate text-[11.5px] text-white/50">{sub}</dd>
      {accent && <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c]/70 to-transparent" />}
    </div>
  );
}

function OfferCard({ offer: o, link }: { offer: PrimedProperty; link?: LinkStat }) {
  const [code, setCode] = useState<string | null>(link?.code ?? null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [kitOpen, setKitOpen] = useState(false);
  const net = Math.round(netForApporteur(o.amountChf));
  const pct = o.terms.kind === "pourcentage";
  const urlOf = (c: string) => `${window.location.origin}/explorer/${o.propertyId}?ref=${c}`;

  const ensure = async (): Promise<string | null> => {
    if (code) return urlOf(code);
    setBusy(true);
    setError("");
    const res = await getOrCreateMyLink(o.propertyId);
    setBusy(false);
    if (!res.ok) { setError(res.error); return null; }
    setCode(res.code);
    return urlOf(res.code);
  };

  const copy = async () => {
    const url = await ensure();
    if (!url) return;
    try { await navigator.clipboard.writeText(url); } catch { setError("Copie impossible : ouvrez le bien pour partager."); return; }
    track(o.propertyId, "partage");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const whatsapp = async () => {
    /* Fenêtre ouverte tout de suite (sinon bloquée), adresse posée ensuite. */
    const w = window.open("", "_blank");
    if (w) w.opener = null;
    const url = await ensure();
    if (!url) { w?.close(); return; }
    track(o.propertyId, "partage");
    const text = `${o.title} à ${o.city} — je pense que ça peut t'intéresser : ${withSource(url, "whatsapp")}`;
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (w) w.location.href = wa; else window.location.href = wa;
  };

  return (
    <SpotlightCard as="li" className="v3-card--gold group flex flex-col">
      <Link href={`/explorer/${o.propertyId}`} tabIndex={-1} aria-hidden className="relative block aspect-[16/10] overflow-hidden bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={o.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/45 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[rgb(242_198_107/0.55)] bg-[rgb(22_16_6/0.72)] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-[#f6dc9f] backdrop-blur-md">
          <Coins className="h-3.5 w-3.5" /> {commissionLabel(o.terms)}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur-md">{o.transactionType === "vente" ? "À vendre" : "À louer"}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/explorer/${o.propertyId}`} className="truncate text-[16px] font-semibold tracking-[-0.01em] hover:underline">{o.title}</Link>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">
          {o.city}{o.price > 0 ? ` · ${formatNumber(o.price)} CHF${o.transactionType !== "vente" ? "/mois" : ""}` : ""}
        </p>

        <div className="relative mt-4 overflow-hidden rounded-2xl border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/50 to-transparent px-4 py-3">
          <span aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--laiton)_25%,transparent),transparent)]" />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.1em] text-laiton">Vous touchez, net</p>
          <p className="relative mt-0.5 whitespace-nowrap text-[26px] font-semibold leading-tight tracking-[-0.03em] tabular-nums text-laiton">
            {pct ? "≈ " : ""}{formatNumber(net)} <span className="text-[14px] tracking-normal">CHF</span>
          </p>
          <p className="relative mt-0.5 text-[11.5px] text-laiton/85">{dueLabel(o.terms, o.transactionType)}</p>
        </div>

        {link && (
          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border bg-subtle/60 px-2 py-1"><Eye className="h-3.5 w-3.5" aria-hidden /><span className="font-semibold tabular-nums text-foreground">{link.clicks}</span> clics</span>
            <span className="inline-flex items-center gap-1 rounded-full border bg-subtle/60 px-2 py-1"><Inbox className="h-3.5 w-3.5" aria-hidden /><span className="font-semibold tabular-nums text-foreground">{link.leads}</span> leads</span>
            {link.sales > 0 && <span className="inline-flex items-center gap-1 rounded-full border border-leman/30 bg-leman-soft px-2 py-1 text-leman"><Handshake className="h-3.5 w-3.5" aria-hidden />{link.sales} vente{link.sales > 1 ? "s" : ""}</span>}
            <Link href={`/messages?l=${link.linkId}`} className="ml-auto inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-medium text-leman transition-colors hover:bg-leman-soft"><MessageCircle className="h-3.5 w-3.5" aria-hidden />Écrire</Link>
          </p>
        )}

        <div className="mt-auto grid grid-cols-[1fr_1fr_auto] gap-2 pt-4">
          <Button variant="prime" className="h-11 rounded-xl px-2.5" onClick={() => void copy()} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copié" : code ? "Copier mon lien" : "Mon lien"}
          </Button>
          <Button className="h-11 rounded-xl bg-[#1f8f4e] px-2.5 text-white hover:bg-[#197a42]" onClick={() => void whatsapp()} disabled={busy}>
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </Button>
          <Button variant="outline" className="h-11 w-11 rounded-xl p-0" aria-label="Kit de partage : QR code et messages" title="QR code et messages"
            onClick={async () => { if (await ensure()) setKitOpen(true); }} disabled={busy}>
            <QrCode className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        {code && kitOpen && (
          <ShareKit open={kitOpen} onOpenChange={setKitOpen} propertyId={o.propertyId} url={urlOf(code)}
            title={o.title} city={o.city} cover={o.cover}
            priceLabel={o.price > 0 ? `${formatNumber(o.price)} CHF${o.transactionType !== "vente" ? "/mois" : ""}` : undefined}
            gainLine={`Vous touchez ${pct ? "≈ " : ""}${formatNumber(net)} CHF net`} />
        )}
        {error && <p role="alert" className="mt-2 text-[12px] text-[var(--danger-text)]">{error}</p>}
      </div>
    </SpotlightCard>
  );
}
