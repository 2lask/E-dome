import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Coins, Home, Link2 } from "lucide-react";
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

      <section aria-label="Qui paie quoi" className="mt-8 grid gap-4 md:grid-cols-3">
        <Card icon={Home} title="Vous vendez ou louez" price="0 CHF"
          items={["Publication illimitée, photos et vidéo", "Demandes, offres et suivi jusqu'à l'acte", "Tableau de bord en temps réel", "Commission d'apport facultative, fixée par vous"]} />
        <Card icon={Link2} title="Vous recommandez" price="0 CHF" gold
          items={["Un lien personnel par bien", "Suivi de vos clics, leads et ventes", "88 % de la commission pour vous", "Paiement direct du vendeur (TWINT, virement)"]} />
        <Card icon={Coins} title="E-Dome" price="12 %"
          sub="de la commission d'apport, 3 CHF au minimum"
          items={["Seulement si une commission est due", "Compris dans la commission, jamais ajouté au prix", "Rien sur une vente sans apporteur", "E-Dome ne détient jamais les fonds"]} />
      </section>

      <section aria-labelledby="exemple" className="mt-8 grid items-center gap-6 rounded-3xl border bg-card p-6 md:grid-cols-[1fr_auto] md:p-8">
        <div>
          <h2 id="exemple" className="text-[20px] font-semibold tracking-[-0.02em]">Un exemple, du début à la fin</h2>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            Vous vendez à {formatNumber(EX_PRICE)} CHF et proposez 1 % aux apporteurs. Une amie de Sarah achète après avoir
            ouvert son lien. À l&apos;acte, la commission est calculée sur le prix final et le règlement est créé
            automatiquement.
          </p>
          <p className="mt-3 text-[12px] text-muted-foreground">Exemple de calcul. Sans apporteur, vous ne payez rien à E-Dome.</p>
        </div>
        <dl className="min-w-[260px] rounded-2xl border bg-background p-4 font-mono text-[13px]">
          <Row k="Commission (1 %)" v={EX_GROSS} />
          <Row k="dont Sarah, net" v={EX_NET} tone="gold" />
          <Row k="dont E-Dome (12 %)" v={EX_FEE} />
          <div className="my-2 h-px bg-border" />
          <Row k="Vous gardez" v={EX_PRICE - EX_GROSS} strong />
        </dl>
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-[15px] font-semibold">Pour les professionnels</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
            Des formules pour agences et indépendants sont en préparation. Aucun prix n&apos;est annoncé avant qu&apos;elles
            soient prêtes ; écrivez-nous pour être prévenu.
          </p>
          <Link href="/contact" className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-medium text-leman hover:underline">
            Nous écrire <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-[15px] font-semibold">Le cadre</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
            La commission d&apos;apport est un courtage d&apos;indication (art. 412 ss CO), acceptée en ligne par le vendeur et
            horodatée. Détails dans les <Link href="/conditions" className="text-leman hover:underline">conditions</Link>.
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/auth/inscription?redirect=/publier" className="cine-btn-light inline-flex h-11 items-center rounded-xl border px-5 text-[14px] font-semibold">Publier mon bien</Link>
        <Link href="/apporteurs" className="cine-btn-gold inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold">Devenir apporteur <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, price, sub, items, gold = false }: {
  icon: React.ComponentType<{ className?: string }>; title: string; price: string; sub?: string; items: string[]; gold?: boolean;
}) {
  return (
    <div className={gold
      ? "rounded-3xl border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/40 to-card p-6"
      : "rounded-3xl border bg-card p-6"}>
      <span className={gold ? "flex h-10 w-10 items-center justify-center rounded-xl bg-card/60 text-laiton" : "flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-4 text-[15px] font-semibold">{title}</p>
      <p className={`mt-1 text-[40px] font-semibold leading-none tracking-[-0.03em] tabular-nums ${gold ? "text-laiton" : ""}`}>{price}</p>
      {sub && <p className="mt-1 text-[12.5px] text-muted-foreground">{sub}</p>}
      <ul className="mt-4 space-y-2 text-[13.5px]">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-leman" aria-hidden />{t}</li>
        ))}
      </ul>
    </div>
  );
}

function Row({ k, v, tone, strong = false }: { k: string; v: number; tone?: "gold"; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-6 py-0.5 ${strong ? "font-semibold" : ""}`}>
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={`tabular-nums ${tone === "gold" ? "text-laiton" : ""}`}>{formatNumber(Math.round(v))} CHF</dd>
    </div>
  );
}
