"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Inbox, Handshake, Coins, Share2, PlayCircle, Link2, Copy, Check, Plus, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard, AnimatedNumber } from "./glow-card";
import { TrendChart } from "./trend-chart";
import { LiveActivity } from "./live-activity";
import type { Dashboard } from "@/lib/supabase/dashboard-actions";
import type { Period } from "@/lib/dashboard-stats";
import { PERIODS } from "@/lib/dashboard-stats";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Tableau de bord (vue) ───────────────────────────────────────────────────
   Deux casquettes, un écran : « Mes ventes » (vendeur, agence) et « Mes
   apports » (apporteur). Chiffres réels, recalculés à chaque événement reçu en
   direct. */

const chf = (n: number) => `${formatNumber(Math.round(n))} CHF`;
const money = (n: number) => formatNumber(Math.round(n));

export function DashboardView({ data, period, titles, initialTab }: { data: Dashboard; period: Period; titles: Record<string, string>; initialTab?: "apports" }) {
  const [tab, setTab] = useState<"ventes" | "apports">(initialTab === "apports" && data.apporteur ? "apports" : data.seller ? "ventes" : "apports");
  const s = data.seller;
  const a = data.apporteur;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Pilotage</p>
          <h1 className="page-heading mt-1.5 text-[30px] sm:text-[34px]">Tableau de bord</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(s && a) && (
            <div role="tablist" aria-label="Vue" className="flex rounded-xl border bg-card p-1">
              {([["ventes", "Mes ventes"], ["apports", "Mes apports"]] as const).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                  className={cn("h-8 rounded-lg px-3 text-[13px]", tab === k ? "bg-ink font-medium text-paper dark:bg-foreground dark:text-background" : "text-muted-foreground hover:text-foreground")}>{l}</button>
              ))}
            </div>
          )}
          <nav aria-label="Période" className="flex rounded-xl border bg-card p-1">
            {PERIODS.map((p) => (
              <Link key={p} href={`/tableau-de-bord?p=${p}`} scroll={false} aria-current={p === period ? "page" : undefined}
                className={cn("h-8 rounded-lg px-3 text-[13px] leading-8", p === period ? "bg-leman-soft font-medium text-leman" : "text-muted-foreground hover:text-foreground")}>
                {p} j
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {!data.ready && (
        <p role="status" className="mt-5 rounded-xl bg-warning-soft px-4 py-3 text-[13px]">
          Le suivi des vues et des liens d&apos;apporteurs s&apos;active avec la mise à jour de la base (migration 009). Les leads sont déjà comptés.
        </p>
      )}

      {!s && !a ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <GlowCard className="p-6">
            <Plus className="h-6 w-6 text-leman" aria-hidden />
            <h2 className="mt-3 text-[18px] font-semibold">Vous vendez ou louez ?</h2>
            <p className="mt-1 text-[14px] text-muted-foreground">Publiez avec photos et vidéo, proposez une commission : vues, leads et ventes s&apos;affichent ici en direct.</p>
            <Button asChild className="mt-4"><Link href="/publier">Publier un bien</Link></Button>
          </GlowCard>
          <GlowCard accent="laiton" className="p-6">
            <Megaphone className="h-6 w-6 text-laiton" aria-hidden />
            <h2 className="mt-3 text-[18px] font-semibold">Vous connaissez du monde ?</h2>
            <p className="mt-1 text-[14px] text-muted-foreground">Prenez votre lien sur un bien à commission, partagez-le : chaque clic, lead et vente est suivi ici.</p>
            <Button asChild variant="prime" className="mt-4"><Link href="/explorer?prime=1">Trouver un bien à recommander</Link></Button>
          </GlowCard>
        </section>
      ) : tab === "ventes" && s ? (
        <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Kpi icon={Eye} label="Vues" value={s.views} sub={`${formatNumber(s.visitors)} visiteurs uniques`} />
          <Kpi icon={Inbox} label="Leads" value={s.leads} sub={`${String(s.conversion).replace(".", ",")} % de conversion`} />
          <Kpi icon={Handshake} label="Ventes" value={s.sales} sub={`${s.visits} visites · ${s.offers} offres`} />
          <Kpi icon={Coins} label="Commissions apporteurs" value={s.commissions} money accent="laiton" sub={`${String(s.viaApporteurs).replace(".", ",")} % des vues via un apporteur`} />

          <GlowCard className="col-span-2 lg:col-span-3">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[14px] font-semibold">Vues et leads</p>
              <p className="flex items-center gap-3 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Share2 className="h-3.5 w-3.5" aria-hidden />{s.shares} partages</span>
                <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" aria-hidden />{s.videoPlays} vidéos lues</span>
              </p>
            </div>
            <TrendChart series={s.series} />
          </GlowCard>

          <GlowCard className="col-span-2 lg:col-span-1 lg:row-span-2">
            <LiveActivity titles={titles} linkIds={data.linkIds} />
          </GlowCard>

          <GlowCard accent="laiton" className="col-span-2 lg:col-span-3">
            <p className="text-[14px] font-semibold">Chiffre d&apos;affaires</p>
            <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Money label="Ventes conclues" value={s.revenue} />
              <Money label="Commissions dues" value={s.commissions} tone="laiton" />
              <Money label="Net vendeur" value={s.net} tone="leman" />
              <Money label="En négociation (offres)" value={s.pipelineValue} />
            </div>
          </GlowCard>

          <GlowCard className="col-span-2">
            <p className="mb-3 text-[14px] font-semibold">Entonnoir de vente</p>
            <Funnel steps={s.funnel} />
          </GlowCard>

          <GlowCard accent="laiton" className="col-span-2">
            <p className="mb-3 text-[14px] font-semibold">Meilleurs apporteurs</p>
            {s.topApporteurs.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">Aucun lead apporté sur la période. Une commission attractive fait venir les apporteurs.</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-muted-foreground"><th className="pb-2 font-medium">Apporteur</th><th className="pb-2 text-right font-medium">Leads</th><th className="pb-2 text-right font-medium">Ventes</th><th className="pb-2 text-right font-medium">Commissions</th></tr></thead>
                <tbody>{s.topApporteurs.map((x) => (
                  <tr key={x.name} className="border-t"><td className="py-2">{x.name}</td><td className="py-2 text-right tabular-nums">{x.leads}</td><td className="py-2 text-right tabular-nums">{x.sales}</td><td className="py-2 text-right tabular-nums text-laiton">{chf(x.commissions)}</td></tr>
                ))}</tbody>
              </table>
            )}
          </GlowCard>

          <GlowCard className="col-span-2 lg:col-span-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold">Performance par bien</p>
              <Link href="/mes-biens" className="text-[13px] font-medium text-leman hover:underline">Mes biens →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-[13px]">
                <thead><tr className="text-left text-muted-foreground"><th className="pb-2 font-medium">Bien</th><th className="pb-2 text-right font-medium">Vues</th><th className="pb-2 text-right font-medium">Leads</th><th className="pb-2 text-right font-medium">Conversion</th></tr></thead>
                <tbody>{s.topListings.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2"><Link href={`/explorer/${p.id}`} className="flex items-center gap-2.5 hover:underline">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt="" className="h-8 w-11 rounded-md object-cover" /><span className="truncate">{p.title}</span></Link></td>
                    <td className="py-2 text-right tabular-nums">{p.views}</td>
                    <td className="py-2 text-right tabular-nums">{p.leads}</td>
                    <td className="py-2 text-right tabular-nums">{String(p.conversion).replace(".", ",")} %</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </GlowCard>
        </section>
      ) : a ? (
        <ApporteurPanel a={a} titles={titles} linkIds={data.linkIds} />
      ) : null}
    </div>
  );
}

function ApporteurPanel({ a, titles, linkIds }: { a: NonNullable<Dashboard["apporteur"]>; titles: Record<string, string>; linkIds: string[] }) {
  return (
    <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Kpi icon={Link2} label="Clics sur mes liens" value={a.clicks} sub={`${formatNumber(a.visitors)} personne${a.visitors > 1 ? "s" : ""}`} />
      <Kpi icon={Inbox} label="Leads apportés" value={a.leads} sub="contacts reçus par les vendeurs" />
      <Kpi icon={Handshake} label="Ventes" value={a.sales} sub={`${chf(a.revenueGenerated)} de ventes générées`} />
      <Kpi icon={Coins} label="Commissions gagnées (net)" value={a.commissionsEarned} money accent="laiton" sub={`≈ ${chf(a.commissionsPending)} net en cours`} />

      <GlowCard className="col-span-2 lg:col-span-3">
        <p className="mb-3 text-[14px] font-semibold">Clics et leads de mes liens</p>
        <TrendChart series={a.series} viewsLabel="Clics" />
      </GlowCard>
      <GlowCard className="col-span-2 lg:col-span-1 lg:row-span-2">
        <LiveActivity titles={titles} linkIds={linkIds} />
      </GlowCard>

      <GlowCard accent="laiton" className="col-span-2 lg:col-span-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14px] font-semibold">Mes liens</p>
          <Link href="/reglements" className="text-[13px] font-medium text-leman hover:underline">Mes règlements →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead><tr className="text-left text-muted-foreground"><th className="pb-2 font-medium">Bien</th><th className="pb-2 text-right font-medium">Clics</th><th className="pb-2 text-right font-medium">Leads</th><th className="pb-2 text-right font-medium">Ventes</th><th className="pb-2 text-right font-medium">Gagné (net)</th><th className="pb-2" /></tr></thead>
            <tbody>{a.links.map((l) => (
              <tr key={l.code} className="border-t">
                <td className="py-2"><Link href={`/explorer/${l.propertyId}`} className="flex items-center gap-2.5 hover:underline">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.cover} alt="" className="h-8 w-11 rounded-md object-cover" /><span className="truncate">{l.title}</span></Link></td>
                <td className="py-2 text-right tabular-nums">{l.clicks}</td>
                <td className="py-2 text-right tabular-nums">{l.leads}</td>
                <td className="py-2 text-right tabular-nums">{l.sales}</td>
                <td className="py-2 text-right tabular-nums text-laiton">{chf(l.earned)}</td>
                <td className="py-2 pl-3 text-right"><CopyLink path={`/explorer/${l.propertyId}?ref=${l.code}`} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </GlowCard>

      <GlowCard className="col-span-2 lg:col-span-4">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[14px] font-semibold">Mes leads, étape par étape</p>
          <p className="text-[12px] text-muted-foreground">Le vendeur fait avancer chaque lead ; l&apos;identité de l&apos;acheteur reste entre lui et le vendeur.</p>
        </div>
        {a.leadList.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">Aucun lead pour l&apos;instant. Partagez vos liens : chaque contact reçu par un vendeur apparaîtra ici avec son étape.</p>
        ) : (
          <ul className="divide-y">
            {a.leadList.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 py-2.5 text-[13px]">
                {l.cover ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={l.cover} alt="" className="h-8 w-11 shrink-0 rounded-md object-cover" />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{l.title}</span>
                  <span className="block text-[11.5px] text-muted-foreground">Lead du {new Date(l.createdAt).toLocaleDateString("fr-CH")}</span>
                </span>
                <LeadSteps status={l.status} />
                <span className={cn("w-28 text-right tabular-nums", l.final ? "font-semibold text-laiton" : "text-muted-foreground")}>
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

/* Les étapes d'un lead, en pastilles : franchies, en cours, à venir (ou perdu). */
const LEAD_STEPS: { key: string; label: string }[] = [
  { key: "nouvelle", label: "Contact" },
  { key: "en-cours", label: "Échange" },
  { key: "visite", label: "Visite" },
  { key: "offre", label: "Offre" },
  { key: "conclue", label: "Vendu" },
];
function LeadSteps({ status }: { status: string }) {
  if (status === "fermee") return <span className="rounded-md bg-subtle px-2 py-0.5 text-[11.5px] text-muted-foreground">Sans suite</span>;
  const at = LEAD_STEPS.findIndex((s) => s.key === status);
  return (
    <ol className="flex items-center gap-1" aria-label={`Étape : ${LEAD_STEPS[Math.max(0, at)]?.label}`}>
      {LEAD_STEPS.map((s, i) => (
        <li key={s.key} className={cn(
          "rounded-md px-1.5 py-0.5 text-[11px]",
          i < at ? "bg-leman-soft text-leman" : i === at ? (s.key === "conclue" ? "bg-laiton-soft font-semibold text-laiton" : "bg-leman font-semibold text-white dark:text-[#0d1513]") : "bg-subtle text-muted-foreground/70",
        )}>{s.label}</li>
      ))}
    </ol>
  );
}

function Kpi({ icon: Icon, label, value, sub, money: isMoney = false, accent = "leman" }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: number; sub: string; money?: boolean; accent?: "leman" | "laiton";
}) {
  return (
    <GlowCard accent={accent} className={accent === "laiton" ? "bg-laiton-soft/40" : undefined}>
      <p className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground"><Icon className="h-4 w-4" aria-hidden />{label}</p>
      <p className={cn("mt-2 text-[24px] font-semibold leading-none tracking-[-0.02em] sm:text-[30px]", accent === "laiton" && "text-laiton")}>
        <AnimatedNumber value={value} />{isMoney && <span className="ml-1 text-[15px] font-medium">CHF</span>}
      </p>
      <p className="mt-2 text-[12px] text-muted-foreground">{sub}</p>
    </GlowCard>
  );
}

function Money({ label, value, tone }: { label: string; value: number; tone?: "laiton" | "leman" }) {
  return (
    <div>
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-[22px] font-semibold tracking-[-0.01em]", tone === "laiton" && "text-laiton", tone === "leman" && "text-leman")}>
        <AnimatedNumber value={value} format={(n) => money(n)} /> <span className="text-[13px] font-medium">CHF</span>
      </p>
    </div>
  );
}

function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  return (
    <ol className="space-y-2">
      {steps.map((st, i) => {
        const prev = i > 0 ? steps[i - 1].value : 0;
        const rate = i > 0 && prev > 0 ? Math.min(100, Math.round((st.value / prev) * 100)) : null;
        return (
          <li key={st.label} className="flex items-center gap-3 text-[13px]">
            <span className="w-20 shrink-0 text-muted-foreground">{st.label}</span>
            <span className="relative h-7 flex-1 overflow-hidden rounded-md bg-subtle">
              <span className="absolute inset-y-0 left-0 rounded-md bg-leman/80 transition-[width] duration-700" style={{ width: `${Math.max(st.value ? 4 : 0, (st.value / max) * 100)}%`, opacity: 1 - i * 0.12 }} />
              <span className="relative z-10 flex h-full items-center px-2.5 font-medium tabular-nums">{formatNumber(st.value)}</span>
            </span>
            <span className="w-12 shrink-0 text-right text-[12px] tabular-nums text-muted-foreground">{rate !== null ? `${rate} %` : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}

function CopyLink({ path }: { path: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" aria-label="Copier mon lien" className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[12px] hover:border-foreground/25"
      onClick={() => { void navigator.clipboard.writeText(`${window.location.origin}${path}`); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? <Check className="h-3.5 w-3.5 text-leman" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}{done ? "Copié" : "Lien"}
    </button>
  );
}

