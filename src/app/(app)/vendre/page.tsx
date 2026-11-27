import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Check, Coins, FileSignature, Gavel, KeyRound, Link2, LineChart } from "lucide-react";
import { PlatformRules } from "@/components/legal/platform-rules";
import { CtaBand, SectionHeading } from "@/components/marketing/blocks";
import { Reveal } from "@/components/marketing/reveal";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import { StepsTimeline } from "@/components/marketing/steps-timeline";

export const metadata: Metadata = {
  title: "Vendre son bien",
  description: "Vendez sans agence : annonce avec photos et vidéo, commission d'apport facultative, leads suivis en temps réel, offres et étapes jusqu'à l'acte.",
};

/* ── /vendre — le parcours du vendeur, tel qu'il existe ──────────────────────
   Six étapes réelles (toutes livrées), puis ce qu'E-Dome fait et ne fait pas.
   Remplace l'ancienne page « seul / accompagné » : la route accompagnée par
   une agence n'existe pas au lancement, et ses règles 3 et 4 décrivaient
   l'ancien modèle. Les quatre règles affichées viennent de `PLATFORM_RULES`,
   la même source que les conditions. */

const STEPS = [
  { icon: Camera, t: "Publiez en cinq minutes", d: "Photos, vidéo de visite, informations clés. L'annonce est en ligne aussitôt, pensée pour le téléphone." },
  { icon: Coins, t: "Proposez une commission (facultatif)", d: "Montant fixe ou % du prix de vente, fixé par vous. Sans vente grâce à un apporteur, rien n'est dû." },
  { icon: Link2, t: "Le réseau recommande", d: "Chacun prend son lien personnel et partage votre bien. Vous aussi : bouton Partager et kit de diffusion." },
  { icon: LineChart, t: "Suivez tout en direct", d: "Vues, visiteurs, leads, d'où ils viennent : le tableau de bord bouge à l'instant, une alerte signale chaque lead." },
  { icon: Gavel, t: "Négociez avec méthode", d: "Notez les offres, comparez-les à votre prix, acceptez ou contre-proposez ; le copilote les analyse avec vous." },
  { icon: FileSignature, t: "Jusqu'à l'acte", d: "Financement confirmé, projet d'acte du notaire, signature : à la vente, la commission se calcule sur le prix final." },
];

export default function VendrePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="cine relative overflow-hidden rounded-3xl border border-white/10 px-6 py-10 md:px-10 md:py-12">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div className="relative max-w-3xl">
          <p className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Vendre son bien</p>
          <h1 className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[48px]">
            Vendez sans agence, <span className="cine-gold">avec tout un réseau derrière vous.</span>
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-white/70">
            Publication gratuite, aucun pourcentage sur votre prix. Vous gardez la main sur chaque visite et chaque
            offre ; le réseau d&apos;apporteurs vous amène des acheteurs.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/auth/inscription?redirect=/publier" className="cine-btn-light inline-flex h-12 items-center rounded-xl px-6 text-[15px] font-semibold">
              Publier mon bien — gratuit
            </Link>
            <Link href="/tarifs" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 text-[15px] font-semibold text-white/90 hover:bg-white/5">
              Voir les tarifs <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="parcours" className="mt-20 md:mt-24">
        <Reveal>
          <SectionHeading center id="parcours" eyebrow="Le parcours" title={<>De la première photo <span className="text-muted-foreground">à l&apos;acte.</span></>}
            lead="Six étapes, dans l'ordre où vous les vivrez. Vous restez maître de chacune." />
        </Reveal>
        <div className="mt-12 md:mt-16">
          <StepsTimeline steps={STEPS.map((s) => ({ icon: <s.icon className="h-[18px] w-[18px]" aria-hidden />, t: s.t, d: s.d }))} />
        </div>
      </section>

      <section aria-label="Ce que vous payez et ce que vous gardez" className="mt-20 grid gap-4 md:mt-24 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <SpotlightCard gold className="h-full p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-laiton">Ce que vous payez</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-laiton-border bg-card/60 text-laiton"><Coins className="h-5 w-5" aria-hidden /></span>
            </div>
            <p className="mt-4 text-[56px] font-semibold leading-none tracking-[-0.04em] tabular-nums sm:text-[72px]">0 <span className="text-[0.45em] tracking-[-0.02em] text-muted-foreground">CHF pour publier</span></p>
            <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-muted-foreground">
              Rien pour publier. Si un apporteur vous amène l&apos;acheteur, vous versez la commission que vous avez fixée :
              88 % à l&apos;apporteur, 12 % à E-Dome, comprise dans le montant promis. Sans apporteur, E-Dome ne touche rien.
            </p>
            <div aria-hidden className="mt-6">
              <div className="flex h-3 overflow-hidden rounded-full bg-subtle">
                <span className="h-full w-[88%] bg-gradient-to-r from-laiton/70 to-laiton" />
                <span className="h-full flex-1 bg-leman" />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[11.5px] text-muted-foreground">
                <span>Apporteur · 88 %</span><span>E-Dome · 12 %</span>
              </div>
            </div>
            <Link href="/tarifs" className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-laiton hover:underline">Exemple chiffré <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </SpotlightCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.08}>
          <SpotlightCard className="h-full p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-leman">Ce que vous gardez en main</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"><KeyRound className="h-5 w-5" aria-hidden /></span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Ce qui reste à vous">
              {["Le prix", "Les visites", "Le choix de l'acheteur", "La négociation"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-[13px] font-medium">
                  <Check className="h-3.5 w-3.5 text-leman" aria-hidden />{t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
              Le prix, les visites, le choix de l&apos;acheteur et la négociation. La vente se signe chez le notaire, par acte
              authentique (art. 216 CO) ; E-Dome vous guide jusque-là et vous rappelle les documents à réunir.
            </p>
          </SpotlightCard>
        </Reveal>
      </section>

      <section aria-labelledby="regles" className="mt-20 md:mt-24">
        <Reveal>
          <SectionHeading id="regles" eyebrow="Nos limites" title="Ce qu'E-Dome ne fait jamais"
            lead="Quatre règles, reprises telles quelles dans les conditions d'utilisation." />
        </Reveal>
        <div className="mt-8">
          <PlatformRules variant="full" />
        </div>
      </section>

      <Reveal className="mt-20 md:mt-24">
        <CtaBand title={<>Votre bien, <span className="cine-gold">tout un réseau derrière lui.</span></>}
          text="Publication gratuite, aucun pourcentage sur votre prix. Vous gardez la main sur chaque visite et chaque offre.">
          <Link href="/auth/inscription?redirect=/publier" className="cine-btn-light inline-flex h-12 items-center rounded-xl px-6 text-[15px] font-semibold">
            Publier mon bien — gratuit
          </Link>
          <Link href="/tarifs" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 text-[15px] font-semibold text-white/90 hover:bg-white/5">
            Voir les tarifs <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </CtaBand>
      </Reveal>
    </div>
  );
}
