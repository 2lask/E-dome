"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Coins, Link2, Handshake, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
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

    <div className="mx-auto mt-14 max-w-5xl">
      <section aria-label="Comment ça marche" className="grid gap-3 md:grid-cols-3">
        {[
          { icon: Coins, t: "Choisissez un bien", d: "Chaque bien affiche sa commission et ce que vous touchez, net, avant toute démarche." },
          { icon: Link2, t: "Partagez votre lien", d: "Un lien personnel par bien. WhatsApp, SMS, e-mail : chaque visite et chaque contact sont suivis en direct." },
          { icon: Handshake, t: "Vente conclue, vous êtes payé", d: "La commission est calculée sur le prix final et réglée par le vendeur. Tout est horodaté." },
        ].map((s, i) => (
          <div key={s.t} className="rounded-2xl border bg-card p-5 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-laiton-border bg-laiton-soft text-laiton">
                <s.icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="font-mono text-[12px] text-muted-foreground">0{i + 1}</span>
            </div>
            <h2 className="mt-4 text-[15.5px] font-semibold">{s.t}</h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </section>

      {/* Les vrais biens à commission */}
      <section id="biens" className="mt-12 scroll-mt-20">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Biens à commission</h2>
        {offers.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
            <p className="text-[15px] font-medium">Les premiers biens à commission arrivent</p>
            <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted-foreground">
              E-Dome vient d&apos;ouvrir. Créez votre compte : vous verrez les biens à commission dès leur publication.
            </p>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {offers.slice(0, 8).map((o) => (
              <li key={o.primeId}>
                <Link href={`/explorer/${o.propertyId}`} className="flex items-center gap-4 rounded-2xl border bg-card p-3.5 shadow-xs transition-colors hover:border-foreground/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.cover} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{o.title}</span>
                    <span className="block text-[12.5px] text-muted-foreground">
                      {o.city} · {o.transactionType === "vente" ? "Vente" : "Location"} · {commissionLabel(o.terms)}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[17px] font-semibold tabular-nums text-laiton">
                      {o.terms.kind === "pourcentage" ? "≈ " : ""}{formatNumber(Math.round(netForApporteur(o.amountChf)))} CHF
                    </span>
                    <span className="block text-[11.5px] text-muted-foreground">net pour vous</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12 grid gap-3 md:grid-cols-3">
        {[
          { icon: Activity, t: "Suivi en temps réel", d: "Clics, contacts et ventes de vos liens s'affichent à l'instant dans votre tableau de bord." },
          { icon: ShieldCheck, t: "Un cadre légal clair", d: "Courtage d'indication (art. 412 ss CO) : conditions acceptées en ligne par le vendeur et horodatées." },
          { icon: Coins, t: "Votre argent, en direct", d: "Le vendeur vous paie directement. E-Dome suit le règlement, sans jamais détenir les fonds." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border bg-card p-5">
            <c.icon className="h-5 w-5 text-leman" aria-hidden />
            <p className="mt-3 text-[15px] font-semibold">{c.t}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Questions fréquentes</h2>
        <dl className="mt-4 divide-y rounded-2xl border bg-card">
          {FAQ.map((f) => (
            <div key={f.q} className="p-5">
              <dt className="text-[14.5px] font-semibold">{f.q}</dt>
              <dd className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-ink p-6 text-paper sm:flex-row sm:items-center md:p-8 dark:bg-card dark:text-foreground">
        <ShieldCheck className="h-6 w-6 text-[#e3b85c]" aria-hidden />
        <p className="flex-1 text-[15px] font-medium">Votre réseau vaut de l&apos;argent. Créer un compte est gratuit.</p>
        <Button asChild variant="prime"><Link href={SIGNUP}>Devenir apporteur</Link></Button>
      </section>
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
                className={`rounded-lg px-4 py-1.5 text-[13.5px] font-medium transition-colors ${mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
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
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[13.5px] text-muted-foreground">{label}</span>
        <span className="text-[16px] font-semibold tabular-nums">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => on(Number(e.target.value))}
        className="mt-2.5 w-full accent-[var(--laiton)]" />
    </label>
  );
}
