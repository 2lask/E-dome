"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye, Inbox, Handshake, Coins, Share2, PlayCircle, Link2, Copy, Check, Plus, Megaphone, QrCode, MessageSquare,
  ArrowRight, Banknote, Filter, Trophy, Building2, ListChecks, LineChart, MousePointerClick,
} from "lucide-react";
import { GlowCard, AnimatedNumber, CardHead } from "./glow-card";
import { TrendChart, Sparkline } from "./trend-chart";
import { LiveActivity } from "./live-activity";
import { LiveNow, SourcesCard } from "./sources-card";
import type { Dashboard } from "@/lib/supabase/dashboard-actions";
import type { Period } from "@/lib/dashboard-stats";
import { PERIODS } from "@/lib/dashboard-stats";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Tableau de bord (vue) ───────────────────────────────────────────────────
   Deux casquettes, un écran : « Mes ventes » (vendeur, agence) et « Mes
   apports » (apporteur). Chiffres réels, recalculés à chaque événement reçu en
   direct. Présentation : cartes à halo (GlowCard), pastilles d'icône v3,
   chiffres en grand, courbe en pixels réels. Tout le texte est visible au
   repos : aucune apparition au défilement. */

const chf = (n: number) => `${formatNumber(Math.round(n))} CHF`;
const money = (n: number) => formatNumber(Math.round(n));
const pct = (n: number) => `${String(n).replace(".", ",")} %`;

/* Boutons de l'en-tête sombre : 44 px, anneau de focus laiton. */
const focusGold = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b85c]";
const linkMore = "inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-[13px] font-medium text-leman transition-colors hover:bg-leman-soft";

export function DashboardView({ data, period, titles, initialTab }: { data: Dashboard; period: Period; titles: Record<string, string>; initialTab?: "apports" }) {
  const [tab, setTab] = useState<"ventes" | "apports">(initialTab === "apports" && data.apporteur ? "apports" : data.seller ? "ventes" : "apports");
  const s = data.seller;
  const a = data.apporteur;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="v3-beam v3-beam--cine rounded-3xl shadow-[0_30px_90px_-30px_rgb(0_0_0/0.7)]">
        <div className="v3-beam__inner cine v3-grain relative rounded-3xl px-5 py-7 md:px-8 md:py-9">
          <div aria-hidden className="cine-aurora" />
          <div aria-hidden className="cine-grid" />
          <div aria-hidden className="v3-orb v3-orb--gold -left-20 -top-24 h-64 w-64" />
          <div aria-hidden className="v3-orb v3-orb--leman -right-16 bottom-[-4rem] h-64 w-64" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="v3-eyebrow v3-eyebrow--cine">Tableau de bord · {period} derniers jours</p>
              <Headline tab={tab} s={s} a={a} />
              {(tab === "apports" || !s) && a ? (
                <div className="mt-4"><LiveNow count={a.liveNow} what="sur vos liens" /></div>
              ) : s ? (
                <div className="mt-4"><LiveNow count={s.liveNow} what="sur vos annonces" /></div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {tab === "apports" || !s ? (
                  <>
                    <Link href="/explorer?prime=1" className={cn("cine-btn-gold v3-sheen inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[14px] font-semibold", focusGold)}><Link2 className="h-4 w-4" aria-hidden />Recommander un bien</Link>
                    <Link href="/reglements" className={cn("inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/[0.04] px-4 text-[14px] font-semibold text-white/90 transition-colors hover:bg-white/10", focusGold)}>Mes règlements</Link>
                  </>
                ) : (
                  <>
                    <Link href="/demandes" className={cn("cine-btn-light inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[14px] font-semibold", focusGold)}><Inbox className="h-4 w-4" aria-hidden />Mes demandes</Link>
                    <Link href="/publier" className={cn("inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 text-[14px] font-semibold text-white/90 transition-colors hover:bg-white/10", focusGold)}><Plus className="h-4 w-4" aria-hidden />Publier un bien</Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(s && a) && (
                <div role="tablist" aria-label="Vue" className="flex rounded-xl border border-white/15 bg-white/[0.06] p-1 backdrop-blur">
                  {([["ventes", "Mes ventes"], ["apports", "Mes apports"]] as const).map(([k, l]) => (
                    <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                      className={cn("h-9 rounded-lg px-3.5 text-[13px] transition-colors", focusGold, tab === k ? "bg-white font-semibold text-[#12110e] shadow-sm" : "text-white/70 hover:text-white")}>{l}</button>
                  ))}
                </div>
              )}
              <nav aria-label="Période" className="flex rounded-xl border border-white/15 bg-white/[0.06] p-1 backdrop-blur">
                {PERIODS.map((p) => (
                  <Link key={p} href={`/tableau-de-bord?p=${p}${tab === "apports" ? "&vue=apports" : ""}`} scroll={false} aria-current={p === period ? "page" : undefined}
                    className={cn("inline-flex h-9 min-w-11 items-center justify-center rounded-lg px-3 text-[13px] transition-colors", focusGold, p === period ? "bg-[rgb(227_184_92/0.2)] font-semibold text-[#f2c66b] shadow-[inset_0_0_0_1px_rgb(227_184_92/0.35)]" : "text-white/70 hover:text-white")}>
                    {p} j
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {!data.ready && (
        <p role="status" className="mt-5 rounded-xl border border-[color-mix(in_oklab,var(--warning,#b7791f)_35%,transparent)] bg-warning-soft px-4 py-3 text-[13px]">
          Le suivi des vues et des liens d&apos;apporteurs s&apos;active avec la mise à jour de la base (migration 009). Les leads sont déjà comptés.
        </p>
      )}

      {!s && !a ? (
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <GlowCard className="p-6 sm:p-7">
            <span className="v3-icon h-11 w-11"><Plus className="h-5 w-5" aria-hidden /></span>
            <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.015em]">Vous vendez ou louez ?</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">Publiez avec photos et vidéo, proposez une commission : vues, leads et ventes s&apos;affichent ici en direct.</p>
            <Link href="/publier" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-leman px-4 text-[14px] font-semibold text-white transition-transform hover:-translate-y-px dark:text-[#0d1513]">Publier un bien <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </GlowCard>
          <GlowCard accent="laiton" className="p-6 sm:p-7">
            <span className="v3-icon v3-icon--gold h-11 w-11"><Megaphone className="h-5 w-5" aria-hidden /></span>
            <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.015em]">Vous connaissez du monde ?</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">Prenez votre lien sur un bien à commission, partagez-le : chaque clic, lead et vente est suivi ici.</p>
            <Link href="/explorer?prime=1" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-laiton px-4 text-[14px] font-semibold text-white transition-transform hover:-translate-y-px dark:text-[#1a1408]">Trouver un bien à recommander <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </GlowCard>
        </section>
      ) : tab === "ventes" && s ? (
        <section aria-label="Mes ventes" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Kpi icon={Eye} label="Vues" value={s.views} sub={`${formatNumber(s.visitors)} visiteurs uniques`} spark={s.series.map((d) => d.views)} />
          <Kpi icon={Inbox} label="Leads" value={s.leads} sub={`${pct(s.conversion)} de conversion`} spark={s.series.map((d) => d.leads)} sparkBars />
          <Kpi icon={Handshake} label="Ventes" value={s.sales} sub={`${s.visits} visite${s.visits > 1 ? "s" : ""} · ${s.offers} offre${s.offers > 1 ? "s" : ""}`}
            steps={[["Visites", s.visits], ["Offres", s.offers], ["Ventes", s.sales]]} />
          <Kpi icon={Coins} label="Commissions apporteurs" value={s.commissions} money accent="laiton" sub={`${pct(s.viaApporteurs)} des vues via un apporteur`} share={s.viaApporteurs} />

          <GlowCard as="section" label="Vues et leads" className="col-span-2 lg:col-span-3">
            <CardHead icon={LineChart} title="Vues et leads" sub={`Par jour, sur ${period} jours`}
              action={
                <p className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-subtle/60 px-2.5 py-1"><Share2 className="h-3.5 w-3.5" aria-hidden /><span className="font-semibold tabular-nums text-foreground">{s.shares}</span> partages</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-subtle/60 px-2.5 py-1"><PlayCircle className="h-3.5 w-3.5" aria-hidden /><span className="font-semibold tabular-nums text-foreground">{s.videoPlays}</span> vidéos lues</span>
                </p>
              } />
            <TrendChart series={s.series} />
          </GlowCard>

          <GlowCard as="section" label="Activité en direct" className="col-span-2 lg:col-span-1 lg:row-span-2">
            <LiveActivity titles={titles} linkIds={data.linkIds} />
          </GlowCard>

          <GlowCard as="section" label="Chiffre d'affaires" accent="laiton" className="col-span-2 lg:col-span-3">
            <CardHead icon={Banknote} gold title="Chiffre d'affaires" sub="Ventes conclues et offres en cours sur la période" />
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-4">
              <Money label="Ventes conclues" value={s.revenue} />
              <Money label="Commissions dues" value={s.commissions} tone="laiton" />
              <Money label="Net vendeur" value={s.net} tone="leman" />
              <Money label="En négociation (offres)" value={s.pipelineValue} hint="valeur des offres reçues" />
            </dl>
            <RevenueSplit revenue={s.revenue} net={s.net} commissions={s.commissions} />
          </GlowCard>

          <GlowCard as="section" label="Entonnoir de vente" className="col-span-2">
            <CardHead icon={Filter} title="Entonnoir de vente" sub="Taux de passage d'une étape à la suivante" />
            <Funnel steps={s.funnel} />
          </GlowCard>

          <GlowCard as="section" label="Provenance des visiteurs" className="col-span-2">
            <SourcesCard sources={s.sources} title="D'où viennent vos visiteurs"
              empty="La provenance des visites (WhatsApp, QR code, e-mail, Facebook, recherche…) s'affiche ici dès les prochaines visites. Partagez avec les boutons d'E-Dome : chaque canal est reconnu." />
          </GlowCard>

          <GlowCard as="section" label="Meilleurs apporteurs" accent="laiton" className="col-span-2">
            <CardHead icon={Trophy} gold title="Meilleurs apporteurs" sub="Classés par leads apportés" />
            {s.topApporteurs.length === 0 ? (
              <EmptyNote icon={Megaphone}>Aucun lead apporté sur la période. Une commission attractive fait venir les apporteurs.</EmptyNote>
            ) : (
              <TopApporteurs rows={s.topApporteurs} />
            )}
          </GlowCard>

          <GlowCard as="section" label="Performance par bien" className="col-span-2">
            <CardHead icon={Building2} title="Performance par bien" sub="Vues, leads et conversion"
              action={<Link href="/mes-biens" className={linkMore}>Mes biens <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>} />
            <ListingTable rows={s.topListings} />
          </GlowCard>
        </section>
      ) : a ? (
        <ApporteurPanel a={a} titles={titles} linkIds={data.linkIds} period={period} />
      ) : null}
    </div>
  );
}

/* La phrase d'en-tête : le chiffre qui compte, selon la casquette. */
function Headline({ tab, s, a }: { tab: "ventes" | "apports"; s: Dashboard["seller"]; a: Dashboard["apporteur"] }) {
  const cls = "mt-4 text-[30px] font-semibold leading-[1.06] tracking-[-0.035em] text-white sm:text-[44px]";
  if ((tab === "apports" || !s) && a) {
    return (
      <h1 className={cls}>
        <span className="cine-gold tabular-nums">{chf(a.commissionsEarned)}</span> gagnés
        <span className="mt-2 block text-[15px] font-normal tracking-normal text-white/65">
          {a.leads} lead{a.leads > 1 ? "s" : ""} apporté{a.leads > 1 ? "s" : ""} · {a.clicks} clic{a.clicks > 1 ? "s" : ""} sur vos liens
          {a.commissionsPending > 0 ? ` · ≈ ${chf(a.commissionsPending)} en cours` : ""}
        </span>
      </h1>
    );
  }
  if (s) {
    return (
      <h1 className={cls}>
        <span className="cine-gold tabular-nums">{formatNumber(s.leads)}</span> lead{s.leads > 1 ? "s" : ""} reçu{s.leads > 1 ? "s" : ""}
        <span className="mt-2 block text-[15px] font-normal tracking-normal text-white/65">
          {formatNumber(s.views)} vue{s.views > 1 ? "s" : ""} · {s.sales} vente{s.sales > 1 ? "s" : ""} conclue{s.sales > 1 ? "s" : ""}
          {s.pipelineValue > 0 ? ` · ${chf(s.pipelineValue)} en négociation` : ""}
        </span>
      </h1>
    );
  }
  return <h1 className={cls}>Votre tableau de bord</h1>;
}

function ApporteurPanel({ a, titles, linkIds, period }: { a: NonNullable<Dashboard["apporteur"]>; titles: Record<string, string>; linkIds: string[]; period: Period }) {
  return (
    <section aria-label="Mes apports" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Kpi icon={MousePointerClick} label="Clics sur mes liens" value={a.clicks} sub={`${formatNumber(a.visitors)} personne${a.visitors > 1 ? "s" : ""}`} spark={a.series.map((d) => d.views)} />
      <Kpi icon={Inbox} label="Leads apportés" value={a.leads} sub="contacts reçus par les vendeurs" spark={a.series.map((d) => d.leads)} sparkBars />
      <Kpi icon={Handshake} label="Ventes" value={a.sales} sub={`${chf(a.revenueGenerated)} de ventes générées`} />
      <Kpi icon={Coins} label="Commissions gagnées (net)" value={a.commissionsEarned} money accent="laiton" sub={`≈ ${chf(a.commissionsPending)} net en cours`} />

      <GlowCard as="section" label="Clics et leads de mes liens" className="col-span-2 lg:col-span-3">
        <CardHead icon={LineChart} title="Clics et leads de mes liens" sub={`Par jour, sur ${period} jours`} />
        <TrendChart series={a.series} viewsLabel="Clics" />
      </GlowCard>
      <GlowCard as="section" label="Activité en direct" className="col-span-2 lg:col-span-1 lg:row-span-2">
        <LiveActivity titles={titles} linkIds={linkIds} />
      </GlowCard>

      <GlowCard as="section" label="Mes liens" accent="laiton" className="col-span-2 lg:col-span-3">
        <CardHead icon={Link2} gold title="Mes liens" sub={`${a.links.length} lien${a.links.length > 1 ? "s" : ""} personnel${a.links.length > 1 ? "s" : ""} · gains nets pour vous`}
          action={<Link href="/reglements" className={linkMore}>Mes règlements <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>} />
        {a.links.length === 0 ? (
          <EmptyNote icon={Link2}>Aucun lien pour l&apos;instant. Prenez votre lien sur un bien à commission depuis l&apos;espace Gagner.</EmptyNote>
        ) : (
          <ul className="-mx-2 divide-y">
            {a.links.map((l) => (
              <li key={l.code} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl px-2 py-3 transition-colors hover:bg-subtle/50">
                <Link href={`/explorer/${l.propertyId}`} className="group flex min-w-0 flex-1 basis-56 items-center gap-3 rounded-lg">
                  <Thumb src={l.cover} />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium group-hover:underline">{l.title}</span>
                    <span className="block truncate font-mono text-[11.5px] text-muted-foreground">ref={l.code}</span>
                  </span>
                </Link>
                <dl className="grid grid-cols-4 gap-x-4 text-right text-[13px]">
                  <Cell label="Clics" value={formatNumber(l.clicks)} />
                  <Cell label="Leads" value={formatNumber(l.leads)} />
                  <Cell label="Ventes" value={formatNumber(l.sales)} />
                  <Cell label="Gagné (net)" value={chf(l.earned)} gold />
                </dl>
                <span className="ml-auto inline-flex gap-1.5">
                  <Link href={`/messages?l=${l.linkId}`} className="inline-flex h-11 items-center gap-1.5 rounded-xl border bg-card px-3 text-[12.5px] font-medium transition-colors hover:border-foreground/25" title="Écrire au propriétaire">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />Écrire
                  </Link>
                  <CopyLink path={`/explorer/${l.propertyId}?ref=${l.code}`} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </GlowCard>

      <GlowCard as="section" label="Provenance des clics" className="col-span-2">
        <SourcesCard sources={a.sources} title="Où vos liens fonctionnent"
          empty="Dès les prochains clics, vous verrez ici d'où ils viennent : WhatsApp, QR code, e-mail, réseaux sociaux. Partagez depuis votre kit pour que chaque canal soit reconnu." />
      </GlowCard>

      {/* Kit de partage : panneau toujours sombre, dans la lignée de l'en-tête. */}
      <section aria-label="Votre kit de partage" className="cine v3-grain relative col-span-2 flex flex-col justify-between gap-5 overflow-hidden rounded-[1.25rem] border border-white/10 p-5 sm:p-6">
        <div aria-hidden className="v3-orb v3-orb--gold -right-10 -top-16 h-48 w-48" />
        <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c]/70 to-transparent" />
        <div className="relative flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="v3-eyebrow v3-eyebrow--cine">Kit de partage</p>
            <h2 className="mt-3 text-[18px] font-semibold tracking-[-0.015em] text-white">Votre lien, partout où l&apos;on vous écoute</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
              Pour chaque bien : le QR code de votre lien (affiche, carte de visite, écran du téléphone), des messages prêts
              à envoyer et un bouton par canal. Chaque scan et chaque clic vous sont attribués.
            </p>
          </div>
          <span aria-hidden className="hidden h-[84px] w-[84px] shrink-0 rotate-3 items-center justify-center rounded-2xl bg-white p-2 shadow-[0_20px_50px_-15px_rgb(227_184_92/0.6)] sm:flex">
            <QrCode className="h-full w-full text-[#12110e]" strokeWidth={1.4} />
          </span>
        </div>
        <Link href="/apporteurs#biens" className={cn("cine-btn-gold v3-sheen relative inline-flex h-11 w-fit items-center gap-2 rounded-xl px-4 text-[14px] font-semibold", focusGold)}>
          <QrCode className="h-4 w-4" aria-hidden />Ouvrir mes kits
        </Link>
      </section>

      <GlowCard as="section" label="Mes leads, étape par étape" className="col-span-2 lg:col-span-4">
        <CardHead icon={ListChecks} title="Mes leads, étape par étape"
          sub="Le vendeur fait avancer chaque lead ; l'identité de l'acheteur reste entre lui et le vendeur." />
        {a.leadList.length === 0 ? (
          <EmptyNote icon={Inbox}>Aucun lead pour l&apos;instant. Partagez vos liens : chaque contact reçu par un vendeur apparaîtra ici avec son étape.</EmptyNote>
        ) : (
          <ul className="-mx-2 divide-y">
            {a.leadList.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl px-2 py-3.5 text-[13px] transition-colors hover:bg-subtle/50">
                <span className="flex min-w-0 flex-1 basis-56 items-center gap-3">
                  {l.cover ? <Thumb src={l.cover} /> : null}
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium">{l.title}</span>
                    <span className="block text-[11.5px] text-muted-foreground">Lead du {new Date(l.createdAt).toLocaleDateString("fr-CH")}</span>
                  </span>
                </span>
                <LeadSteps status={l.status} />
                <span className={cn("ml-auto w-28 text-right text-[14px] tabular-nums", l.final ? "font-semibold text-laiton" : "text-muted-foreground")}>
                  {l.status === "fermee" ? "—" : `${l.final ? "" : "≈ "}${chf(l.netChf)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </GlowCard>
    </section>
  );
}

/* Les étapes d'un lead : piste avec points reliés — franchies, en cours, à venir (ou perdu). */
const LEAD_STEPS: { key: string; label: string }[] = [
  { key: "nouvelle", label: "Contact" },
  { key: "en-cours", label: "Échange" },
  { key: "visite", label: "Visite" },
  { key: "offre", label: "Offre" },
  { key: "conclue", label: "Vendu" },
];
function LeadSteps({ status }: { status: string }) {
  if (status === "fermee") return <span className="rounded-full border bg-subtle px-2.5 py-1 text-[11.5px] text-muted-foreground">Sans suite</span>;
  const at = Math.max(0, LEAD_STEPS.findIndex((s) => s.key === status));
  return (
    <ol className="relative flex w-full items-start sm:w-auto" aria-label={`Étape : ${LEAD_STEPS[at]?.label}`}>
      {LEAD_STEPS.map((s, i) => {
        const done = i < at, cur = i === at, sold = cur && s.key === "conclue";
        return (
          <li key={s.key} className="relative flex flex-1 flex-col items-center sm:w-[60px] sm:flex-none" aria-current={cur ? "step" : undefined}>
            {i > 0 && (
              <span aria-hidden className={cn("absolute right-1/2 top-[7px] h-[2px] w-full rounded-full", i <= at ? "bg-leman" : "bg-border")} />
            )}
            <span aria-hidden className={cn("relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2",
              done ? "border-leman bg-leman" : cur ? (sold ? "border-laiton bg-laiton shadow-[0_0_0_4px_var(--laiton-soft)]" : "border-leman bg-card shadow-[0_0_0_4px_var(--leman-soft)]") : "border-border bg-card")}>
              {done && <Check className="h-2.5 w-2.5 text-card" strokeWidth={3.5} />}
              {cur && !sold && <span className="h-1.5 w-1.5 rounded-full bg-leman" />}
            </span>
            <span className={cn("mt-1.5 text-[11px]", cur ? (sold ? "font-semibold text-laiton" : "font-semibold text-leman") : done ? "text-foreground/80" : "text-muted-foreground/80")}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Kpi({ icon: Icon, label, value, sub, money: isMoney = false, accent = "leman", spark, sparkBars = false, steps, share }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: number; sub: string; money?: boolean; accent?: "leman" | "laiton";
  /** Série réelle de la période (mini-courbe). */
  spark?: number[];
  sparkBars?: boolean;
  /** Petites étapes réelles (visites → offres → ventes). */
  steps?: [string, number][];
  /** Part en % (jauge). */
  share?: number;
}) {
  const gold = accent === "laiton";
  return (
    <GlowCard accent={accent} className="flex flex-col p-4 sm:p-5">
      {gold && <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--laiton)_22%,transparent),transparent)]" />}
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-[12.5px] font-medium leading-snug text-muted-foreground">{label}</p>
        <span className={cn("v3-icon h-8 w-8 rounded-[0.65rem]", gold && "v3-icon--gold")}><Icon className="h-4 w-4" aria-hidden /></span>
      </div>
      <p className={cn("relative mt-3 text-[26px] font-semibold leading-none tracking-[-0.035em] sm:text-[34px]", gold && "text-laiton")}>
        <AnimatedNumber value={value} />{isMoney && <span className="ml-1 text-[13px] font-semibold tracking-normal sm:text-[15px]">CHF</span>}
      </p>
      <p className="relative mt-2 text-[12px] leading-snug text-muted-foreground">{sub}</p>
      <div className="relative mt-auto pt-3">
        {spark && <Sparkline values={spark} bars={sparkBars} tone={gold ? "laiton" : "leman"} />}
        {steps && (
          <div className="flex h-9 items-end gap-1" aria-hidden>
            {steps.map(([l, v], i) => {
              const max = Math.max(1, ...steps.map((x) => x[1]));
              return (
                <span key={l} className="flex flex-1 flex-col items-center gap-1">
                  <span className={cn("w-full rounded-[4px]", i === steps.length - 1 ? "bg-gradient-to-t from-leman/50 to-leman" : "bg-gradient-to-t from-foreground/10 to-foreground/25")}
                    style={{ height: `${Math.max(3, (v / max) * 24)}px` }} />
                  <span className="text-[9.5px] leading-none text-muted-foreground">{l}</span>
                </span>
              );
            })}
          </div>
        )}
        {share !== undefined && (
          <div className="flex h-9 flex-col justify-end" aria-hidden>
            <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
              <div className="h-full rounded-full bg-gradient-to-r from-laiton/50 to-laiton" style={{ width: `${Math.min(100, Math.max(0, share))}%` }} />
            </div>
          </div>
        )}
      </div>
    </GlowCard>
  );
}

function Money({ label, value, tone, hint }: { label: string; value: number; tone?: "laiton" | "leman"; hint?: string }) {
  return (
    <div className="relative bg-card px-4 py-4 sm:px-5">
      {tone && <span aria-hidden className={cn("absolute left-0 top-4 h-6 w-[3px] rounded-r-full", tone === "laiton" ? "bg-laiton" : "bg-leman")} />}
      <dt className="text-[12px] text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1.5 text-[20px] font-semibold leading-tight tracking-[-0.025em] sm:text-[24px]", tone === "laiton" && "text-laiton", tone === "leman" && "text-leman")}>
        <AnimatedNumber value={value} format={(n) => money(n)} /> <span className="text-[12.5px] font-semibold tracking-normal">CHF</span>
      </dd>
      {hint && <dd className="mt-0.5 text-[11px] text-muted-foreground">{hint}</dd>}
    </div>
  );
}

/* Répartition réelle des ventes conclues : net vendeur / commissions. */
function RevenueSplit({ revenue, net, commissions }: { revenue: number; net: number; commissions: number }) {
  if (revenue <= 0) {
    return <p className="mt-3 text-[12.5px] text-muted-foreground">La répartition entre net vendeur et commissions s&apos;affiche dès la première vente conclue.</p>;
  }
  const c = Math.min(100, (commissions / revenue) * 100);
  const n = Math.min(100 - c, (net / revenue) * 100);
  return (
    <div className="mt-4">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-subtle" role="img" aria-label={`Net vendeur ${Math.round(n)} %, commissions ${Math.round(c)} % des ventes conclues`}>
        <span className="h-full bg-gradient-to-r from-leman/70 to-leman" style={{ width: `${n}%` }} />
        <span className="h-full bg-gradient-to-r from-laiton/70 to-laiton" style={{ width: `${c}%` }} />
      </div>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-leman" aria-hidden />Net vendeur · {Math.round(n)} %</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-laiton" aria-hidden />Commissions · {Math.round(c * 10) / 10} %</span>
      </p>
    </div>
  );
}

/* Entonnoir centré : chaque étape se rétrécit, le taux de passage en pastille. */
function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  return (
    <ol className="space-y-1.5">
      {steps.map((st, i) => {
        const prev = i > 0 ? steps[i - 1].value : 0;
        const rate = i > 0 && prev > 0 ? Math.min(100, Math.round((st.value / prev) * 100)) : null;
        const w = st.value ? Math.max(6, (st.value / max) * 100) : 0;
        return (
          <li key={st.label} className="grid grid-cols-[72px_minmax(0,1fr)_52px] items-center gap-3 text-[13px] sm:grid-cols-[84px_minmax(0,1fr)_56px]">
            <span className="truncate text-muted-foreground">{st.label}</span>
            <span className="relative flex h-9 items-center justify-center overflow-hidden rounded-lg bg-subtle/60">
              <span aria-hidden className="absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-lg"
                style={{ width: `${w}%`, background: `linear-gradient(90deg, color-mix(in oklab, var(--leman) ${70 - i * 9}%, transparent), color-mix(in oklab, var(--leman) ${92 - i * 9}%, transparent), color-mix(in oklab, var(--leman) ${70 - i * 9}%, transparent))` }} />
              <span className="relative z-10 rounded-md px-1.5 font-semibold tabular-nums">{formatNumber(st.value)}</span>
            </span>
            <span className="text-right">
              {rate !== null && (
                <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11.5px] font-medium tabular-nums", rate >= 50 ? "bg-leman-soft text-leman" : "bg-subtle text-muted-foreground")}>{rate} %</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TopApporteurs({ rows }: { rows: NonNullable<Dashboard["seller"]>["topApporteurs"] }) {
  const max = Math.max(1, ...rows.map((r) => r.leads));
  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr className="text-left text-[11.5px] uppercase tracking-[0.06em] text-muted-foreground">
          <th className="pb-2 font-medium">Apporteur</th>
          <th className="pb-2 text-right font-medium">Leads</th>
          <th className="pb-2 pl-3 text-right font-medium">Ventes</th>
          <th className="pb-2 pl-3 text-right font-medium">Commissions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((x, i) => (
          <tr key={x.name} className="border-t">
            <td className="py-3 pr-2">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className={cn("relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12.5px] font-semibold",
                  i === 0 ? "bg-laiton-soft text-laiton ring-1 ring-laiton-border" : "bg-subtle text-foreground/80")}>
                  {initials(x.name)}
                  <span className={cn("absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card text-[8.5px] font-bold",
                    i === 0 ? "bg-laiton text-white dark:text-[#1a1408]" : "bg-muted-foreground/70 text-card")}>{i + 1}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{x.name}</span>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-subtle" aria-hidden>
                    <span className="block h-full rounded-full bg-gradient-to-r from-laiton/40 to-laiton" style={{ width: `${(x.leads / max) * 100}%` }} />
                  </span>
                </span>
              </span>
            </td>
            <td className="py-3 text-right font-medium tabular-nums">{x.leads}</td>
            <td className="py-3 pl-3 text-right tabular-nums">{x.sales}</td>
            <td className="py-3 pl-3 text-right font-semibold tabular-nums text-laiton">{chf(x.commissions)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ListingTable({ rows }: { rows: NonNullable<Dashboard["seller"]>["topListings"] }) {
  if (rows.length === 0) return <EmptyNote icon={Building2}>Aucun bien en ligne sur la période.</EmptyNote>;
  const maxConv = Math.max(1, ...rows.map((r) => r.conversion));
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[11.5px] uppercase tracking-[0.06em] text-muted-foreground">
            <th className="pb-2 font-medium">Bien</th>
            <th className="pb-2 pl-3 text-right font-medium">Vues</th>
            <th className="pb-2 pl-3 text-right font-medium">Leads</th>
            <th className="pb-2 pl-3 text-right font-medium" title="Conversion">Conv.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2.5">
                <Link href={`/explorer/${p.id}`} className="group flex min-h-11 items-center gap-3 rounded-lg">
                  <Thumb src={p.cover} className="hidden sm:block" />
                  <span className="line-clamp-2 font-medium group-hover:underline">{p.title}</span>
                </Link>
              </td>
              <td className="py-2.5 pl-3 text-right tabular-nums">{formatNumber(p.views)}</td>
              <td className="py-2.5 pl-3 text-right font-medium tabular-nums">{formatNumber(p.leads)}</td>
              <td className="py-2.5 pl-3 text-right">
                <span className="inline-flex flex-col items-end gap-1">
                  <span className="tabular-nums">{pct(p.conversion)}</span>
                  <span className="block h-1 w-12 overflow-hidden rounded-full bg-subtle" aria-hidden>
                    <span className="block h-full rounded-full bg-leman" style={{ width: `${(p.conversion / maxConv) * 100}%` }} />
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ label, value, gold = false }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">{label}</dt>
      <dd className={cn("mt-0.5 whitespace-nowrap font-semibold tabular-nums", gold && "text-laiton")}>{value}</dd>
    </div>
  );
}

function Thumb({ src, className }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={cn("h-11 w-14 shrink-0 rounded-lg object-cover ring-1 ring-border", className)} />
  );
}

function EmptyNote({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-dashed px-4 py-4 text-[13px] leading-relaxed text-muted-foreground">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

function CopyLink({ path }: { path: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" aria-label="Copier mon lien" className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-laiton-border bg-laiton-soft px-3 text-[12.5px] font-medium text-laiton transition-colors hover:border-laiton"
      onClick={() => { void navigator.clipboard.writeText(`${window.location.origin}${path}`); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}{done ? "Copié" : "Lien"}
    </button>
  );
}
