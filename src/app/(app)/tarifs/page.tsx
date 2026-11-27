import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Coins, Home, Link2, Scale } from "lucide-react";
import { CineBand, CtaBand } from "@/components/marketing/blocks";
import { CommissionFlow } from "@/components/marketing/commission-flow";
import { PriceCard } from "@/components/marketing/price-card";
import { Reveal } from "@/components/marketing/reveal";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import { apporteurNetChf } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Publier est gratuit. E-Dome ne se rémunère que sur la commission d'apport : 12 %, et seulement si une commission est versée.",
};

/* ── /tarifs — un seul modèle, celui du lancement ────────────────────────────
   Publier : 0 CHF. Recommander : gratuit. E-Dome : 12 % de la commission
   d'apport (3 CHF au minimum), seulement si elle est due. Les formules pour
   professionnels restent dans le catalogue (`lib/pricing/catalog.ts`) et
   n'apparaissent pas tant qu'elles ne sont pas prêtes : aucun prix annoncé
   pour une offre qui n'existe pas encore. */

const EX_PRICE = 1_200_000;
const EX_GROSS = EX_PRICE / 100;
const EX_NET = apporteurNetChf(EX_GROSS);
const EX_FEE = EX_GROSS - EX_NET;

export default function TarifsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="cine relative overflow-hidden rounded-3xl border border-white/10 px-6 py-10 md:px-10 md:py-12">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div className="relative max-w-3xl">
          <p className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Tarifs</p>
          <h1 className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[48px]">
            Rien à payer pour publier. <span className="cine-gold">E-Dome ne gagne que si ça marche.</span>
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-white/70">
            Pas d&apos;abonnement, pas de frais d&apos;annonce, aucun pourcentage sur votre prix de vente. E-Dome se rémunère
            uniquement par une part de la commission d&apos;apport, quand un apporteur a trouvé l&apos;acheteur.
          </p>
        </div>
      </header>

      <section aria-label="Qui paie quoi" className="mt-12 grid items-stretch gap-4 md:mt-16 md:grid-cols-3">
        <Reveal>
          <PriceCard icon={<Home className="h-5 w-5" aria-hidden />} title="Vous vendez ou louez" price="0 CHF"
            items={["Publication illimitée, photos et vidéo", "Demandes, offres et suivi jusqu'à l'acte", "Tableau de bord en temps réel", "Commission d'apport facultative, fixée par vous"]} />
        </Reveal>
        <Reveal delay={0.08}>
          <PriceCard featured tag="88 % pour vous" icon={<Link2 className="h-5 w-5" aria-hidden />} title="Vous recommandez" price="0 CHF"
            items={["Un lien personnel par bien", "Suivi de vos clics, leads et ventes", "88 % de la commission pour vous", "Paiement direct du vendeur (TWINT, virement)"]} />
        </Reveal>
        <Reveal delay={0.16}>
          <PriceCard icon={<Coins className="h-5 w-5" aria-hidden />} title="E-Dome" price="12 %"
            sub="de la commission d'apport, 3 CHF au minimum"
            items={["Seulement si une commission est due", "Compris dans la commission, jamais ajouté au prix", "Rien sur une vente sans apporteur", "E-Dome ne détient jamais les fonds"]} />
        </Reveal>
      </section>

      <Reveal className="mt-16 md:mt-24">
        <CineBand labelledBy="exemple">
          <div className="grid gap-10">
            <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-12">
              <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e3b85c]" aria-hidden /> Exemple de calcul
              </p>
              <h2 id="exemple" className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[38px]">Un exemple, du début à la fin</h2>
              </div>
              <div>
              <p className="text-[14.5px] leading-relaxed text-white/65">
                Vous vendez à {formatNumber(EX_PRICE)} CHF et proposez 1 % aux apporteurs. Une amie de Sarah achète après avoir
                ouvert son lien. À l&apos;acte, la commission est calculée sur le prix final et le règlement est créé
                automatiquement.
              </p>
              <p className="mt-3 text-[12.5px] text-white/45">Exemple de calcul. Sans apporteur, vous ne payez rien à E-Dome.</p>
              </div>
            </div>
            <div>
              <CommissionFlow price={EX_PRICE} rateLabel="1 %" gross={EX_GROSS} net={EX_NET} fee={EX_FEE} apporteur="Sarah" />
              <dl className="mt-6 flex flex-wrap items-baseline justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <dt className="text-[13.5px] text-white/60">Vous gardez</dt>
                <dd className="text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-white">{formatNumber(Math.round(EX_PRICE - EX_GROSS))} CHF</dd>
              </dl>
            </div>
          </div>
        </CineBand>
      </Reveal>

      <section className="mt-16 grid gap-4 md:mt-20 md:grid-cols-2">
        <Reveal>
          <SpotlightCard className="h-full p-6 sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"><Building2 className="h-5 w-5" aria-hidden /></span>
            <p className="mt-4 text-[16px] font-semibold">Pour les professionnels</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
              Des formules pour agences et indépendants sont en préparation. Aucun prix n&apos;est annoncé avant qu&apos;elles
              soient prêtes ; écrivez-nous pour être prévenu.
            </p>
            <Link href="/contact" className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-leman hover:underline">
              Nous écrire <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </SpotlightCard>
        </Reveal>
        <Reveal delay={0.08}>
          <SpotlightCard className="h-full p-6 sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"><Scale className="h-5 w-5" aria-hidden /></span>
            <p className="mt-4 text-[16px] font-semibold">Le cadre</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
              La commission d&apos;apport est un courtage d&apos;indication (art. 412 ss CO), acceptée en ligne par le vendeur et
              horodatée. Détails dans les <Link href="/conditions" className="font-medium text-leman underline-offset-2 hover:underline">conditions</Link>.
            </p>
          </SpotlightCard>
        </Reveal>
      </section>

      <Reveal className="mt-16 md:mt-20">
        <CtaBand title={<>Rien à payer pour commencer. <span className="cine-gold">Choisissez votre rôle.</span></>}>
          <Link href="/auth/inscription?redirect=/publier" className="cine-btn-light inline-flex h-12 items-center rounded-xl px-6 text-[15px] font-semibold">Publier mon bien</Link>
          <Link href="/apporteurs" className="cine-btn-gold inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold">Devenir apporteur <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </CtaBand>
      </Reveal>
    </div>
  );
}
