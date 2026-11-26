"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Coins, Copy, Eye, Handshake, Inbox, Loader2, MessageCircle, MousePointerClick, QrCode, Search, Sparkles,
} from "lucide-react";
import { ShareKit } from "@/components/share/share-kit";
import { withSource } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { GlowCard, AnimatedNumber } from "@/components/dashboard/glow-card";
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
   En tête : mes chiffres réels des 30 derniers jours. */

type LinkStat = ApporteurStats["links"][number];

export function ApporteurHub({ offers, stats }: { offers: PrimedProperty[]; stats: ApporteurStats | null }) {
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
      <header className="cine relative overflow-hidden rounded-3xl border border-white/10 px-5 py-8 md:px-9 md:py-10">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Espace apporteur</p>
            <h1 className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-[46px]">
              Recommandez. <span className="cine-gold">Encaissez.</span>
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              Prenez votre lien sur un bien, envoyez-le à qui cherche : par message, par e-mail ou avec votre QR code.
              Chaque visite, lead et vente venus de votre lien vous sont attribués 60 jours, et la commission est
              calculée automatiquement.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href="#biens" className="cine-btn-gold inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold">
              <Coins className="h-4 w-4" aria-hidden />Voir les biens
            </a>
            <Link href="/tableau-de-bord?vue=apports" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 px-5 text-[14px] font-semibold text-white/90 hover:bg-white/5">
              Mon tableau de bord <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <section aria-label="Mes chiffres sur 30 jours" className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat icon={MousePointerClick} label="Clics sur mes liens" value={stats?.clicks ?? 0} sub={`${formatNumber(stats?.visitors ?? 0)} personnes`} />
        <Stat icon={Inbox} label="Leads apportés" value={stats?.leads ?? 0} sub="30 derniers jours" />
        <Stat icon={Handshake} label="Ventes conclues" value={stats?.sales ?? 0} sub={`${formatNumber(stats?.revenueGenerated ?? 0)} CHF de ventes`} />
        <Stat icon={Coins} label="Gagné, net" value={stats?.commissionsEarned ?? 0} money accent="laiton" sub={`≈ ${formatNumber(Math.round(stats?.commissionsPending ?? 0))} CHF en cours`} />
      </section>

      <section id="biens" className="mt-10 scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Biens à recommander</h2>
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
                  className="h-10 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-9 pr-3 text-[13.5px] outline-none focus:border-[var(--leman)]"
                />
              </label>
              <div role="tablist" aria-label="Type" className="flex rounded-xl border bg-card p-1">
                {(["tous", "vente", "location"] as const).map((k) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={kind === k}
                    onClick={() => setKind(k)}
                    className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${kind === k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {k === "tous" ? "Tous" : k === "vente" ? "Vente" : "Location"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {offers.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-laiton" aria-hidden />
            <p className="mt-3 text-[15px] font-medium">Les premiers biens à commission arrivent</p>
            <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted-foreground">
              Dès qu&apos;un propriétaire propose une commission, son bien apparaît ici avec votre gain. Vous vendez vous-même ?
              Publiez et proposez une commission : le réseau travaille pour vous.
            </p>
            <Button asChild className="mt-5"><Link href="/publier">Publier un bien</Link></Button>
          </div>
        ) : shown.length === 0 ? (
          <p className="mt-6 text-[14px] text-muted-foreground">Aucun bien ne correspond à cette recherche.</p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((o) => <OfferCard key={o.primeId} offer={o} link={byProperty.get(o.propertyId)} />)}
          </ul>
        )}
      </section>

      <section aria-label="Conseils" className="mt-12 grid gap-3 md:grid-cols-3">
        {[
          { t: "Ciblez une personne", d: "Un message personnel à quelqu'un qui cherche vraiment convertit bien mieux qu'un partage à tout votre réseau." },
          { t: "Toujours votre lien", d: "C'est lui qui prouve que le contact vient de vous. Sans lien, pas d'attribution automatique." },
          { t: "Suivez en direct", d: "Votre tableau de bord montre chaque clic et chaque lead à l'instant où il arrive : relancez au bon moment." },
        ].map((c, i) => (
          <div key={c.t} className="rounded-2xl border bg-card p-5">
            <span className="font-mono text-[12px] text-muted-foreground">0{i + 1}</span>
            <p className="mt-2 text-[15px] font-semibold">{c.t}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
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
    <GlowCard accent={accent} className="p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground"><Icon className="h-3.5 w-3.5" aria-hidden />{label}</p>
      <p className={`mt-2 text-[24px] font-semibold leading-none tracking-[-0.02em] tabular-nums sm:text-[28px] ${accent ? "text-laiton" : ""}`}>
        <AnimatedNumber value={value} />{money ? <span className="ml-1 text-[14px] font-medium">CHF</span> : null}
      </p>
      <p className="mt-1.5 truncate text-[12px] text-muted-foreground">{sub}</p>
    </GlowCard>
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
    <li className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md">
      <Link href={`/explorer/${o.propertyId}`} className="relative block aspect-[16/10] overflow-hidden bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={o.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md border border-[#ead7ad] bg-[#f7edd6] px-2 py-0.5 text-[11.5px] font-semibold tabular-nums text-[#8a5d0c] shadow-sm">
          <Coins className="h-3.5 w-3.5" aria-hidden /> {commissionLabel(o.terms)}
        </span>
        <span className="absolute right-3 top-3 rounded-md bg-white/92 px-2 py-0.5 text-[11.5px] font-medium text-[#15130f] backdrop-blur">{o.transactionType === "vente" ? "À vendre" : "À louer"}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/explorer/${o.propertyId}`} className="truncate text-[15px] font-semibold hover:underline">{o.title}</Link>
        <p className="text-[12.5px] text-muted-foreground">
          {o.city}{o.price > 0 ? ` · ${formatNumber(o.price)} CHF${o.transactionType !== "vente" ? "/mois" : ""}` : ""}
        </p>

        <div className="mt-3 rounded-xl border border-laiton-border bg-laiton-soft px-3 py-2.5">
          <p className="text-[11.5px] text-laiton">Vous touchez, net</p>
          <p className="whitespace-nowrap text-[22px] font-semibold leading-tight tabular-nums text-laiton">{pct ? "≈ " : ""}{formatNumber(net)} CHF</p>
          <p className="mt-0.5 text-[11.5px] text-laiton/80">{dueLabel(o.terms, o.transactionType)}</p>
        </div>

        {link && (
          <p className="mt-2.5 flex items-center gap-3 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden />{link.clicks} clics</span>
            <span className="inline-flex items-center gap-1"><Inbox className="h-3.5 w-3.5" aria-hidden />{link.leads} leads</span>
            {link.sales > 0 && <span className="inline-flex items-center gap-1 text-leman"><Handshake className="h-3.5 w-3.5" aria-hidden />{link.sales} vente{link.sales > 1 ? "s" : ""}</span>}
          </p>
        )}

        <div className="mt-auto grid grid-cols-[1fr_1fr_auto] gap-2 pt-3">
          <Button size="sm" variant="prime" onClick={() => void copy()} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copié" : code ? "Copier mon lien" : "Mon lien"}
          </Button>
          <Button size="sm" className="bg-[#1f8f4e] text-white hover:bg-[#197a42]" onClick={() => void whatsapp()} disabled={busy}>
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </Button>
          <Button size="sm" variant="outline" aria-label="Kit de partage : QR code et messages" title="QR code et messages"
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
    </li>
  );
}
