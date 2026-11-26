import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Coins, FileSignature, Gavel, Link2, LineChart } from "lucide-react";
import { PlatformRules } from "@/components/legal/platform-rules";

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

      <section aria-label="Le parcours" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.t} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leman-soft text-leman"><s.icon className="h-[18px] w-[18px]" aria-hidden /></span>
              <span className="font-mono text-[12px] text-muted-foreground">0{i + 1}</span>
            </div>
            <h2 className="mt-4 text-[15.5px] font-semibold">{s.t}</h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/40 to-card p-6">
          <p className="text-[15px] font-semibold">Ce que vous payez</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Rien pour publier. Si un apporteur vous amène l&apos;acheteur, vous versez la commission que vous avez fixée :
            88 % à l&apos;apporteur, 12 % à E-Dome, comprise dans le montant promis. Sans apporteur, E-Dome ne touche rien.
          </p>
          <Link href="/tarifs" className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-medium text-leman hover:underline">Exemple chiffré <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-[15px] font-semibold">Ce que vous gardez en main</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Le prix, les visites, le choix de l&apos;acheteur et la négociation. La vente se signe chez le notaire, par acte
            authentique (art. 216 CO) ; E-Dome vous guide jusque-là et vous rappelle les documents à réunir.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Ce qu&apos;E-Dome ne fait jamais</h2>
        <p className="mt-1 max-w-3xl text-[13.5px] text-muted-foreground">Quatre règles, reprises telles quelles dans les conditions d&apos;utilisation.</p>
        <div className="mt-4">
          <PlatformRules variant="full" />
        </div>
      </section>
    </div>
  );
}
