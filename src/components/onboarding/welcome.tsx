"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Coins, Home, LayoutDashboard, Link2, Search, ShieldCheck } from "lucide-react";
import { PayoutForm } from "@/components/reglements/payout-form";
import type { PayoutProfile } from "@/lib/reglements";
import { SpotlightLink } from "@/components/ui/motion/spotlight";
import { cn } from "@/lib/utils";

/* ── Accueil d'un nouveau membre ─────────────────────────────────────────────
   Inspiré des parcours d'accueil des programmes de partenaires : on demande
   l'intention, on règle tout de suite ce qui bloquerait plus tard (être payé),
   et on termine sur UNE action concrète. Rien n'est obligatoire.
   Présentation : en-tête sombre à faisceau (v3), piste d'étapes reliées,
   cartes de choix lumineuses. Aucun texte n'attend un défilement. */

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

/* Bouton principal : encre sur le fond de page (lisible dans les deux thèmes). */
const primaryBtn = "v3-sheen inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-[14px] font-semibold text-background shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)] transition-[transform,opacity] hover:-translate-y-px disabled:pointer-events-none disabled:opacity-45";
const ghostBtn = "inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-[13.5px] text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground disabled:pointer-events-none disabled:opacity-45";

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
      <header className="v3-beam v3-beam--cine rounded-3xl shadow-[0_30px_90px_-30px_rgb(0_0_0/0.7)]">
        <div className="v3-beam__inner cine v3-grain relative rounded-3xl px-6 pb-7 pt-9 md:px-10 md:pt-11">
          <div aria-hidden className="cine-aurora" />
          <div aria-hidden className="cine-grid" />
          <div aria-hidden className="v3-orb v3-orb--gold -left-16 -top-20 h-64 w-64" />
          <div aria-hidden className="v3-orb v3-orb--leman -right-12 bottom-[-3rem] h-56 w-56" />
          <div className="relative">
            <p className="v3-eyebrow v3-eyebrow--cine">Bienvenue sur E-Dome</p>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-[46px]">
              {firstName ? <>Bonjour {firstName}, </> : null}<span className="cine-gold">qu&apos;est-ce qui vous amène&nbsp;?</span>
            </h1>
            <p className="mt-3 text-[14.5px] text-white/65">Tout est facultatif et modifiable plus tard.</p>

            {/* Piste d'étapes : points reliés par un trait qui se remplit. */}
            <ol className="mt-7 flex items-start" aria-label="Étapes">
              {steps.map((t, i) => {
                const done = i < shownStep, cur = i === shownStep;
                return (
                  <li key={t} aria-current={cur ? "step" : undefined} className="relative flex flex-1 flex-col items-start last:flex-none">
                    {i < steps.length - 1 && (
                      <span aria-hidden className="absolute left-8 right-2 top-[15px] h-[2px] overflow-hidden rounded-full bg-white/12">
                        <span className={cn("block h-full origin-left rounded-full bg-gradient-to-r from-[#e3b85c] to-[#f2c66b] transition-transform duration-700 ease-out", done ? "scale-x-100" : "scale-x-0")} />
                      </span>
                    )}
                    <span className={cn("relative flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold tabular-nums transition-colors",
                      done ? "border-transparent bg-gradient-to-b from-[#f2c66b] to-[#d9a441] text-[#1a1307]"
                        : cur ? "border-white/60 bg-white/10 text-white shadow-[0_0_0_4px_rgb(255_255_255/0.06)]" : "border-white/20 text-white/50")}>
                      {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                    </span>
                    <span className={cn("mt-2 whitespace-nowrap text-[12.5px]", cur ? "font-semibold text-white" : done ? "text-[#f0d79a]" : "text-white/55")}>{t}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </header>

      {step === 0 && (
        <section className="mt-8" aria-label="Vos envies">
          <p className="text-[14px] text-muted-foreground">Plusieurs choix possibles.</p>
          <div className="mt-3 grid gap-3">
            {GOALS.map((g) => {
              const on = goals.includes(g.key);
              const gold = g.key === "recommander";
              return (
                <button key={g.key} type="button" aria-pressed={on} onClick={() => toggle(g.key)}
                  className={cn("group relative flex items-start gap-4 overflow-hidden rounded-[1.25rem] border bg-card p-5 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 active:scale-[0.99] sm:p-6",
                    on ? (gold ? "border-laiton-border shadow-[0_0_0_1px_var(--laiton-border),0_18px_40px_-20px_var(--laiton)]" : "border-leman shadow-[0_0_0_1px_var(--leman),0_18px_40px_-20px_var(--leman)]") : "hover:border-foreground/25")}>
                  <span aria-hidden className={cn("pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
                    on && "opacity-100", gold ? "bg-gradient-to-br from-laiton-soft via-transparent to-transparent" : "bg-gradient-to-br from-leman-soft via-transparent to-transparent")} />
                  <span className={cn("v3-icon relative h-12 w-12 rounded-2xl", gold && "v3-icon--gold")}>
                    <g.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-[16.5px] font-semibold tracking-[-0.01em]">{g.t}</span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-muted-foreground">{g.d}</span>
                  </span>
                  <span className={cn("relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    on ? (gold ? "border-transparent bg-laiton text-white dark:text-[#1a1408]" : "border-transparent bg-leman text-white dark:text-[#0d1513]") : "border-border")}>
                    {on && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className={ghostBtn}>Passer pour l&apos;instant</Link>
            <button type="button" onClick={next} disabled={goals.length === 0} className={primaryBtn}>
              Continuer <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mt-8 space-y-4" aria-label="Être payé">
          <div className="relative overflow-hidden rounded-[1.25rem] border bg-card p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="v3-icon h-11 w-11"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
              <p className="text-[17px] font-semibold tracking-[-0.01em]">Les règles de l&apos;apporteur</p>
            </div>
            <ul className="mt-5 space-y-3">
              {APPORTEUR_RULES.map((r, i) => (
                <li key={r} className="flex items-start gap-3 text-[14px] leading-relaxed">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leman-soft font-mono text-[11px] font-semibold text-leman" aria-hidden>{i + 1}</span>
                  {r}
                </li>
              ))}
            </ul>
            <label className={cn("mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors", rulesOk ? "border-leman/50 bg-leman-soft" : "bg-subtle hover:border-foreground/20")}>
              <input type="checkbox" checked={rulesOk} onChange={(e) => setRulesOk(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--leman)]" />
              <span className="text-[14px] leading-relaxed">Je confirme remplir ces conditions et j&apos;accepte les <Link href="/conditions" className="text-leman underline underline-offset-2">conditions d&apos;utilisation</Link>.</span>
            </label>
          </div>

          <div className="relative overflow-hidden rounded-[1.25rem] border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/40 to-card p-5 sm:p-7">
            <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-laiton/70 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--laiton)_22%,transparent),transparent)]" />
            <div className="relative flex items-center gap-3">
              <span className="v3-icon v3-icon--gold h-11 w-11"><Coins className="h-5 w-5" aria-hidden /></span>
              <p className="text-[17px] font-semibold tracking-[-0.01em]">Où recevoir vos commissions ?</p>
            </div>
            <p className="relative mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              Le vendeur vous paie directement, par TWINT ou virement ; E-Dome ne détient jamais l&apos;argent. Sans ces
              coordonnées, il ne peut pas vous payer. Vous pourrez les modifier dans Règlements.
            </p>
            {paid ? (
              <p role="status" className="relative mt-4 inline-flex items-center gap-2 rounded-xl border border-leman/30 bg-leman-soft px-3.5 py-2.5 text-[13.5px] font-medium text-leman">
                <Check className="h-4 w-4" aria-hidden />Coordonnées enregistrées
              </p>
            ) : (
              <div className="relative mt-5"><PayoutForm initial={payout} onSaved={() => setPaid(true)} submitLabel="Enregistrer mes coordonnées" /></div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button type="button" onClick={() => setStep(0)} className={ghostBtn}>
              <ArrowLeft className="h-4 w-4" aria-hidden />Retour
            </button>
            <div className="flex items-center gap-2">
              {!paid && <button type="button" onClick={() => setStep(2)} disabled={!rulesOk} className={ghostBtn}>Plus tard</button>}
              <button type="button" onClick={() => setStep(2)} disabled={!rulesOk} className={primaryBtn}>
                Continuer <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
          {!rulesOk && <p className="text-right text-[12.5px] text-muted-foreground">Cochez la confirmation pour continuer.</p>}
        </section>
      )}

      {step === 2 && (
        <section className="mt-8" aria-label="C'est parti">
          <p className="v3-eyebrow v3-eyebrow--leman">C&apos;est parti</p>
          <h2 className="v3-heading mt-3 text-[24px] font-semibold tracking-[-0.03em]">Votre première action</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
            <p className="mt-5 rounded-2xl border border-dashed px-4 py-3 text-[13px] text-muted-foreground">
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
    <SpotlightLink href={href}
      className={cn("group flex flex-col p-5 sm:p-6", gold && "v3-card--gold border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/30 to-card")}>
      <span className={cn("v3-icon h-11 w-11", gold && "v3-icon--gold")}><Icon className="h-5 w-5" aria-hidden /></span>
      <span className="mt-4 text-[16px] font-semibold tracking-[-0.01em]">{t}</span>
      <span className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{d}</span>
      <span className={cn("mt-4 inline-flex items-center gap-1 text-[13px] font-semibold", gold ? "text-laiton" : "text-leman")}>Y aller <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden /></span>
    </SpotlightLink>
  );
}
