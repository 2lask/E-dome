"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Coins, Link2, Handshake, ShieldCheck, Activity, Check, Plus, Sparkles } from "lucide-react";
import { CtaBand, SectionHeading } from "@/components/marketing/blocks";
import { Reveal } from "@/components/marketing/reveal";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import styles from "@/components/marketing/marketing.module.css";
import { apporteurNetChf, type PrimedProperty } from "@/lib/my-property";
import { commissionLabel, netForApporteur } from "@/lib/commission";
import { formatNumber } from "@/lib/format";

/* ── « Gagner » pour un VISITEUR ─────────────────────────────────────────────
   Le modèle de commission v2 (courtage d'indication, art. 412 ss CO) :
   lien personnel tracé, commission fixe ou en % fixée par le vendeur, due à la
   conclusion par défaut. Les VRAIS biens à commission, un simulateur marqué
   comme tel, et des réponses franches. Aucun chiffre de traction inventé. */

const SIGNUP = "/auth/inscription?redirect=/apporteurs";

const FAQ = [
  {
    q: "Qui peut recommander ?",
    a: "Toute personne majeure résidant en Suisse (hors Tessin, où le courtage immobilier est soumis à autorisation). Pas besoin d'être un professionnel de l'immobilier.",
  },
  {
    q: "Comment le contact m'est-il attribué ?",
    a: "Par votre lien personnel. Toute personne qui l'ouvre puis contacte le vendeur dans les 60 jours vous est attribuée automatiquement, et la commission est figée au moment du contact.",
  },
  {
    q: "Quand la commission est-elle due ?",
    a: "Par défaut, quand la vente ou le bail est conclu grâce à la personne que vous avez amenée. Certains vendeurs offrant un montant fixe la versent dès qu'ils acceptent le contact : c'est indiqué sur l'annonce.",
  },
  {
    q: "Combien puis-je toucher ?",
    a: "Le vendeur fixe la commission : un montant fixe, ou de 0,1 % à 3 % du prix de vente. E-Dome retient 12 % de la commission (au minimum 3 CHF) ; le reste est pour vous. Rien n'est ajouté au prix payé par l'acheteur.",
  },
  {
    q: "Comment suis-je payé ?",
    a: "Directement par le vendeur, par TWINT ou virement. Le règlement est créé automatiquement à la vente et suivi jusqu'à votre confirmation. E-Dome ne détient jamais l'argent.",
  },
];

export function GagnerPublic({ offers }: { offers: PrimedProperty[] }) {
  return (
    <>
      {/* ── Hero plein écran : promesse + simulateur en direct ── */}
      <section className="cine relative -mx-4 -mt-6 overflow-hidden md:-mx-8 md:-mt-8">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 md:px-8 md:pb-20 md:pt-20 lg:grid-cols-[1fr_1.05fr]">
          <div className="hero-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12.5px] text-white/80">
              <Coins className="h-3.5 w-3.5 text-[#f2c66b]" aria-hidden /> Programme apporteur · gratuit
            </p>
            <h1 className="mt-6 text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[54px] lg:text-[58px]">
              Votre réseau trouve l&apos;acheteur.
              <br />
              <span className="cine-gold">Vous touchez la commission.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/70">
              Des propriétaires proposent une commission à qui leur amène le bon acheteur ou locataire. Prenez votre lien,
              envoyez-le à qui cherche : visites, contacts et vente vous sont attribués, la commission se calcule toute seule.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={SIGNUP} className="cine-btn-gold inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold">
                Devenir apporteur — gratuit <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {offers.length > 0 && (
                <a href="#biens" className="cine-btn-light inline-flex h-12 items-center rounded-xl px-6 text-[15px] font-semibold">
                  Voir les {offers.length} bien{offers.length > 1 ? "s" : ""} à commission
                </a>
              )}
            </div>
          </div>
          <Simulator className="cine-glass" stacked />
        </div>
      </section>

    <div className="mx-auto mt-16 max-w-5xl md:mt-24">
      <section aria-labelledby="comment" >
        <Reveal>
          <SectionHeading center id="comment" eyebrow="Comment ça marche" title={<>Trois gestes, <span className="text-muted-foreground">la commission au bout.</span></>} />
        </Reveal>
        <ol className="relative mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          <li aria-hidden className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-[22px] hidden h-3 overflow-hidden md:block">
            <span className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-laiton/30 via-laiton/70 to-laiton/30" />
            <span className={styles.beamX} style={{ ["--beam-run" as string]: "640px" }} />
          </li>
          {[
            { icon: Coins, t: "Choisissez un bien", d: "Chaque bien affiche sa commission et ce que vous touchez, net, avant toute démarche." },
            { icon: Link2, t: "Partagez votre lien", d: "Un lien personnel par bien. WhatsApp, SMS, e-mail : chaque visite et chaque contact sont suivis en direct." },
            { icon: Handshake, t: "Vente conclue, vous êtes payé", d: "La commission est calculée sur le prix final et réglée par le vendeur. Tout est horodaté." },
          ].map((s, i) => (
            <li key={s.t} className="relative">
              <Reveal delay={i * 0.1} className="flex h-full flex-col items-start md:items-center md:text-center">
                <span className="relative z-10 flex h-11 w-11 items-center justify-center">
                  <span aria-hidden className={`absolute inset-0 rounded-full bg-laiton/25 ${styles.ping}`} style={{ animationDelay: `${i * 0.5}s` }} />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-laiton-border bg-background font-mono text-[12.5px] font-semibold text-laiton shadow-[0_0_0_6px_var(--background)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <SpotlightCard className="mt-5 w-full flex-1 p-6 text-left">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-laiton-border bg-laiton-soft text-laiton">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.015em]">{s.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{s.d}</p>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Les vrais biens à commission */}
      <section id="biens" aria-labelledby="biens-t" className="mt-20 scroll-mt-20 md:mt-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading id="biens-t" eyebrow="En ce moment" title="Biens à commission" />
            {offers.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-[13px] text-muted-foreground">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-leman" aria-hidden />
                <strong className="tabular-nums text-foreground">{offers.length}</strong> bien{offers.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </Reveal>
        {offers.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed bg-card px-6 py-12 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-laiton" aria-hidden />
            <p className="mt-3 text-[16px] font-semibold">Les premiers biens à commission arrivent</p>
            <p className="mx-auto mt-1 max-w-md text-[14px] text-muted-foreground">
              E-Dome vient d&apos;ouvrir. Créez votre compte : vous verrez les biens à commission dès leur publication.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {offers.slice(0, 8).map((o, i) => (
              <li key={o.primeId}>
                <Reveal delay={Math.min(i, 4) * 0.06}>
                  <Link href={`/explorer/${o.propertyId}`} className="group flex items-center gap-4 rounded-3xl border bg-card p-3 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-laiton-border motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-32">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={o.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" loading="lazy" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold">{o.title}</span>
                      <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                        {o.city} · {o.transactionType === "vente" ? "Vente" : "Location"} · {commissionLabel(o.terms)}
                      </span>
                      <span className="mt-2 inline-flex items-baseline gap-1.5 rounded-lg border border-laiton-border bg-laiton-soft px-2 py-1">
                        <span className="text-[15px] font-semibold tabular-nums text-laiton">
                          {o.terms.kind === "pourcentage" ? "≈ " : ""}{formatNumber(Math.round(netForApporteur(o.amountChf)))} CHF
                        </span>
                        <span className="text-[11.5px] text-muted-foreground">net pour vous</span>
                      </span>
                    </span>
                    <ArrowRight className="mr-2 hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-laiton sm:block" aria-hidden />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Garanties" className="mt-20 grid gap-4 md:mt-24 md:grid-cols-6">
        <Reveal className="md:col-span-3">
          <SpotlightCard className="h-full p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"><Activity className="h-5 w-5" aria-hidden /></span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-2.5 py-1 text-[11.5px] text-muted-foreground"><span className="live-dot h-1.5 w-1.5 rounded-full bg-leman" aria-hidden />En direct</span>
            </div>
            <p className="mt-4 text-[17px] font-semibold">Suivi en temps réel</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">Clics, contacts et ventes de vos liens s&apos;affichent à l&apos;instant dans votre tableau de bord.</p>
            <svg viewBox="0 0 300 64" className="mt-5 h-16 w-full" aria-hidden>
              {[14, 22, 18, 30, 26, 38, 32, 46, 40, 54, 48, 60].map((h, i) => (
                <rect key={i} x={i * 25 + 2} y={64 - h} width="17" height={h} rx="4" className={i === 11 ? "fill-laiton" : "fill-leman/40"} />
              ))}
            </svg>
            <p className="mt-1 text-right text-[11px] text-muted-foreground">illustration</p>
          </SpotlightCard>
        </Reveal>
        <Reveal className="md:col-span-3" delay={0.08}>
          <SpotlightCard className="h-full p-6 sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
            <p className="mt-4 text-[17px] font-semibold">Un cadre légal clair</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">Courtage d&apos;indication (art. 412 ss CO) : conditions acceptées en ligne par le vendeur et horodatées.</p>
            <div aria-hidden className="mt-5 space-y-2">
              {["Conditions acceptées", "Contact horodaté", "Commission figée"].map((t) => (
                <div key={t} className="flex items-center gap-2.5 rounded-xl border bg-background px-3 py-2 text-[13px]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leman-soft text-leman"><Check className="h-3 w-3" strokeWidth={3} /></span>{t}
                </div>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>
        <Reveal className="md:col-span-6" delay={0.12}>
          <SpotlightCard gold className="p-6 sm:p-7">
            <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-laiton-border bg-card/60 text-laiton"><Coins className="h-6 w-6" aria-hidden /></span>
              <div>
                <p className="text-[17px] font-semibold">Votre argent, en direct</p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">Le vendeur vous paie directement. E-Dome suit le règlement, sans jamais détenir les fonds.</p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </section>

      <section aria-labelledby="faq" className="mt-20 grid gap-8 md:mt-24 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
        <div>
          <div className="lg:sticky lg:top-8">
            <SectionHeading id="faq" eyebrow="FAQ" title="Questions fréquentes" lead="Ce qu'il faut savoir avant de partager votre premier lien." />
            <Link href="/aide" className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-leman hover:underline">
              Toute l&apos;aide <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="space-y-2.5">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0} className="group rounded-2xl border bg-card transition-colors open:border-laiton-border open:bg-gradient-to-br open:from-laiton-soft/60 open:to-card hover:border-foreground/20">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition-transform duration-300 group-open:rotate-45 group-open:border-laiton-border group-open:text-laiton motion-reduce:transition-none">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Reveal className="mt-20 md:mt-24">
        <CtaBand title={<>Votre réseau vaut de l&apos;argent. <span className="cine-gold">Créer un compte est gratuit.</span></>}>
          <Link href={SIGNUP} className="cine-btn-gold inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold">
            Devenir apporteur <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </CtaBand>
      </Reveal>
    </div>
    </>
  );
}

/* Simulateur : vente (prix × taux) ou location (montant fixe). */
function Simulator({ className = "", stacked = false }: { className?: string; stacked?: boolean }) {
  const [mode, setMode] = useState<"vente" | "location">("vente");
  const [price, setPrice] = useState(950_000);
  const [rate, setRate] = useState(1);
  const [fixed, setFixed] = useState(800);
  const gross = mode === "vente" ? Math.round(price * rate) / 100 : fixed;
  const net = apporteurNetChf(gross);
  const fee = Math.round((gross - net) * 100) / 100;

  return (
    <section aria-labelledby="sim-title" className={`overflow-hidden rounded-3xl border bg-card ${className}`}>
      <div className={stacked ? "grid" : "grid md:grid-cols-[1.1fr_1fr]"}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 id="sim-title" className="text-[18px] font-semibold tracking-[-0.015em]">Combien pouvez-vous toucher ?</h2>
            <span className="rounded-full bg-subtle px-2.5 py-1 text-[11.5px] text-muted-foreground">simulation</span>
          </div>
          <div role="tablist" aria-label="Type de transaction" className="mt-5 inline-flex rounded-xl border bg-background p-1">
            {(["vente", "location"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                className={`min-h-[40px] rounded-lg px-5 text-[13.5px] font-medium transition-colors ${mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                {m === "vente" ? "Vente" : "Location"}
              </button>
            ))}
          </div>

          {mode === "vente" ? (
            <div className="mt-6 space-y-6">
              <Range label="Prix de vente" value={`${formatNumber(price)} CHF`} min={200_000} max={4_000_000} step={10_000} v={price} on={setPrice} />
              <Range label="Commission fixée par le vendeur" value={`${String(rate).replace(".", ",")} %`} min={0.1} max={3} step={0.1} v={rate} on={(n) => setRate(Math.round(n * 10) / 10)} />
            </div>
          ) : (
            <div className="mt-6">
              <Range label="Montant fixe offert par le propriétaire" value={`${formatNumber(fixed)} CHF`} min={100} max={3000} step={50} v={fixed} on={setFixed} />
            </div>
          )}
        </div>

        <div className="relative flex flex-col justify-center gap-3 bg-gradient-to-br from-laiton-soft via-laiton-soft/60 to-card p-6 md:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgb(176_122_26/0.22),transparent_70%)]" />
          <p className="relative text-[13px] text-laiton">Vous touchez, net</p>
          <p className="relative text-[44px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-laiton" aria-live="polite">
            {formatNumber(Math.round(net))} CHF
          </p>
          <div aria-hidden className="relative mt-1 flex h-2 overflow-hidden rounded-full bg-background/60">
            <span className="h-full bg-gradient-to-r from-laiton/70 to-laiton transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${gross > 0 ? Math.max(0, Math.min(100, (net / gross) * 100)) : 0}%` }} />
            <span className="h-full flex-1 bg-leman/70" />
          </div>
          <dl className="relative mt-2 space-y-1 text-[13px] text-muted-foreground">
            <div className="flex justify-between"><dt>Commission payée par le vendeur</dt><dd className="tabular-nums">{formatNumber(Math.round(gross))} CHF</dd></div>
            <div className="flex justify-between"><dt>Part E-Dome (12 %)</dt><dd className="tabular-nums">− {formatNumber(Math.round(fee))} CHF</dd></div>
          </dl>
          <p className="relative mt-1 text-[11.5px] text-muted-foreground">Exemple de calcul. Chaque vendeur fixe sa commission ; elle est due quand la vente ou le bail est conclu.</p>
        </div>
      </div>
    </section>
  );
}

function Range({ label, value, min, max, step, v, on }: {
  label: string; value: string; min: number; max: number; step: number; v: number; on: (n: number) => void;
}) {
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[13.5px] text-muted-foreground">{label}</span>
        <span className="text-[17px] font-semibold tabular-nums">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => on(Number(e.target.value))}
        style={{ ["--p" as string]: `${pct}%` }}
        className="mt-1 h-11 w-full cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#e3b85c_var(--p),rgb(255_255_255/0.14)_var(--p))]
          [&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#1a1307] [&::-webkit-slider-thumb]:bg-[#f7d488] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgb(227_184_92/0.25),0_4px_14px_rgb(217_164_65/0.6)]
          [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[rgb(255_255_255/0.14)]
          [&::-moz-range-progress]:h-2 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-[#e3b85c]
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#1a1307] [&::-moz-range-thumb]:bg-[#f7d488]" />
    </label>
  );
}
