"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Coins, Home, LayoutDashboard, Link2, Search, ShieldCheck } from "lucide-react";
import { PayoutForm } from "@/components/reglements/payout-form";
import type { PayoutProfile } from "@/lib/reglements";
import { cn } from "@/lib/utils";

/* ── Accueil d'un nouveau membre ─────────────────────────────────────────────
   Inspiré des parcours d'accueil des programmes de partenaires : on demande
   l'intention, on règle tout de suite ce qui bloquerait plus tard (être payé),
   et on termine sur UNE action concrète. Rien n'est obligatoire. */

type Goal = "vendre" | "recommander" | "chercher";

const GOALS: { key: Goal; icon: React.ComponentType<{ className?: string }>; t: string; d: string }[] = [
  { key: "vendre", icon: Home, t: "Vendre ou louer un bien", d: "Publication gratuite, photos et vidéo, demandes et offres suivies jusqu'à l'acte." },
  { key: "recommander", icon: Coins, t: "Recommander et toucher des commissions", d: "Votre lien personnel sur les biens à commission ; chaque vente venue de vous est suivie." },
  { key: "chercher", icon: Search, t: "Trouver un bien", d: "Contact direct avec les propriétaires, sans frais." },
];

/* Ce qu'un apporteur atteste : repris des conditions et de l'aide. */
const APPORTEUR_RULES = [
  "Je suis majeur et je réside en Suisse, hors Tessin (où le courtage immobilier est soumis à autorisation).",
  "Je signale une occasion : je ne négocie pas et je ne représente ni le vendeur ni l'acheteur.",
  "Je partage toujours mon lien personnel : c'est lui qui prouve que le contact vient de moi.",
];

export function Welcome({ firstName, payout }: { firstName: string; payout: PayoutProfile | null }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [rulesOk, setRulesOk] = useState(false);
  const [paid, setPaid] = useState(!!payout && !!(payout.iban || payout.twintPhone));
  const recommends = goals.includes("recommander");
  const steps = recommends ? ["Vos envies", "Être payé", "C'est parti"] : ["Vos envies", "C'est parti"];
  const shownStep = recommends ? step : step === 0 ? 0 : 1;

  const toggle = (g: Goal) => setGoals((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]));
  const next = () => setStep(recommends ? 1 : 2);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="cine relative overflow-hidden rounded-3xl border border-white/10 px-6 py-9 md:px-10">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div className="relative">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Bienvenue sur E-Dome</p>
          <h1 className="mt-3 text-[30px] font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-[40px]">
            {firstName ? <>Bonjour {firstName}, </> : null}<span className="cine-gold">qu&apos;est-ce qui vous amène&nbsp;?</span>
          </h1>
          <ol className="mt-6 flex flex-wrap gap-2" aria-label="Étapes">
            {steps.map((t, i) => (
              <li key={t} aria-current={i === shownStep ? "step" : undefined}
                className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px]",
                  i < shownStep ? "border-[rgb(227_184_92/0.5)] bg-[rgb(227_184_92/0.14)] text-[#f0d79a]"
                    : i === shownStep ? "border-white/40 bg-white/10 text-white" : "border-white/15 text-white/55")}>
                {i < shownStep ? <Check className="h-3.5 w-3.5" aria-hidden /> : <span className="font-mono text-[11px]">{i + 1}</span>}{t}
              </li>
            ))}
          </ol>
        </div>
      </header>

      {step === 0 && (
        <section className="mt-6">
          <p className="text-[14px] text-muted-foreground">Plusieurs choix possibles.</p>
          <div className="mt-3 grid gap-3">
            {GOALS.map((g) => {
              const on = goals.includes(g.key);
              const gold = g.key === "recommander";
              return (
                <button key={g.key} type="button" aria-pressed={on} onClick={() => toggle(g.key)}
                  className={cn("flex items-start gap-4 rounded-2xl border bg-card p-5 text-left transition-[border-color,box-shadow,transform] active:scale-[0.99]",
                    on ? (gold ? "border-laiton-border shadow-[0_0_0_1px_var(--laiton-border)]" : "border-leman shadow-[0_0_0_1px_var(--leman)]") : "hover:border-foreground/25")}>
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", gold ? "bg-laiton-soft text-laiton" : "bg-leman-soft text-leman")}>
                    <g.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold">{g.t}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-relaxed text-muted-foreground">{g.d}</span>
                  </span>
                  <span className={cn("mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", on && "border-transparent bg-leman text-white dark:text-[#0d1513]")}>
                    {on && <Check className="h-3.5 w-3.5" aria-hidden />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="text-[13.5px] text-muted-foreground hover:text-foreground">Passer pour l&apos;instant</Link>
            <button type="button" onClick={next} disabled={goals.length === 0}
              className="cine-btn-light inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold disabled:opacity-50">
              Continuer <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mt-6 space-y-5">
          <div className="rounded-2xl border bg-card p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[16px] font-semibold"><ShieldCheck className="h-5 w-5 text-leman" aria-hidden />Les règles de l&apos;apporteur</p>
            <ul className="mt-3 space-y-2">
              {APPORTEUR_RULES.map((r) => (
                <li key={r} className="flex items-start gap-2 text-[13.5px] leading-relaxed"><Check className="mt-0.5 h-4 w-4 shrink-0 text-leman" aria-hidden />{r}</li>
              ))}
            </ul>
            <label className="mt-4 flex items-start gap-3 rounded-xl border bg-subtle p-3">
              <input type="checkbox" checked={rulesOk} onChange={(e) => setRulesOk(e.target.checked)} className="mt-0.5 h-4.5 w-4.5 accent-[var(--leman)]" />
              <span className="text-[13.5px]">Je confirme remplir ces conditions et j&apos;accepte les <Link href="/conditions" className="text-leman underline underline-offset-2">conditions d&apos;utilisation</Link>.</span>
            </label>
          </div>

          <div className="rounded-2xl border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/40 to-card p-5 sm:p-6">
            <p className="text-[16px] font-semibold">Où recevoir vos commissions ?</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
              Le vendeur vous paie directement, par TWINT ou virement ; E-Dome ne détient jamais l&apos;argent. Sans ces
              coordonnées, il ne peut pas vous payer. Vous pourrez les modifier dans Règlements.
            </p>
            {paid ? (
              <p role="status" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-leman-soft px-3 py-2 text-[13.5px] font-medium text-leman">
                <Check className="h-4 w-4" aria-hidden />Coordonnées enregistrées
              </p>
            ) : (
              <div className="mt-4"><PayoutForm initial={payout} onSaved={() => setPaid(true)} submitLabel="Enregistrer mes coordonnées" /></div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-1.5 text-[13.5px] text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" aria-hidden />Retour
            </button>
            <div className="flex items-center gap-3">
              {!paid && <button type="button" onClick={() => setStep(2)} disabled={!rulesOk} className="text-[13.5px] text-muted-foreground hover:text-foreground disabled:opacity-50">Plus tard</button>}
              <button type="button" onClick={() => setStep(2)} disabled={!rulesOk}
                className="cine-btn-light inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold disabled:opacity-50">
                Continuer <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
          {!rulesOk && <p className="text-right text-[12.5px] text-muted-foreground">Cochez la confirmation pour continuer.</p>}
        </section>
      )}

      {step === 2 && (
        <section className="mt-6">
          <p className="text-[18px] font-semibold tracking-[-0.01em]">Votre première action</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {goals.includes("vendre") && (
              <Action href="/publier" icon={Home} t="Publier mon bien" d="Cinq minutes : photos, prix, commission facultative pour les apporteurs." />
            )}
            {recommends && (
              <Action href="/apporteurs#biens" icon={Link2} gold t="Prendre mon premier lien" d="Choisissez un bien à commission, envoyez votre lien ou votre QR code à qui cherche." />
            )}
            {goals.includes("chercher") && (
              <Action href="/explorer" icon={Search} t="Explorer les biens" d="Ventes et locations, contact direct avec le propriétaire." />
            )}
            <Action href="/tableau-de-bord" icon={LayoutDashboard} t="Mon tableau de bord" d="Vues, leads, ventes et commissions, en direct." />
          </div>
          {recommends && !paid && (
            <p className="mt-4 text-[13px] text-muted-foreground">
              Pensez à ajouter votre TWINT ou votre IBAN dans <Link href="/reglements" className="text-leman underline underline-offset-2">Règlements</Link> avant votre première vente.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function Action({ href, icon: Icon, t, d, gold = false }: { href: string; icon: React.ComponentType<{ className?: string }>; t: string; d: string; gold?: boolean }) {
  return (
    <Link href={href}
      className={cn("group flex flex-col rounded-2xl border p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md",
        gold ? "border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/40 to-card" : "bg-card hover:border-foreground/20")}>
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", gold ? "bg-card/60 text-laiton" : "bg-leman-soft text-leman")}><Icon className="h-5 w-5" aria-hidden /></span>
      <span className="mt-3 text-[15.5px] font-semibold">{t}</span>
      <span className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{d}</span>
      <span className={cn("mt-3 inline-flex items-center gap-1 text-[13px] font-medium", gold ? "text-laiton" : "text-leman")}>Y aller <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
    </Link>
  );
}
