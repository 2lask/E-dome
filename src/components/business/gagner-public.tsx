import Link from "next/link";
import { ArrowRight, Coins, MessageCircle, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apporteurNetChf, type PrimedProperty } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";

/* ── « Gagner » pour un VISITEUR (REBUILD.md §3.3) ───────────────────────────

   Remplace l'ancienne vue de démonstration (biens fictifs, gains inventés au
   nom d'un compte « Léo »). Ici : la promesse, le calcul réel du net, les VRAIS
   biens à prime, et des réponses franches. Le seul chiffre d'illustration est
   marqué comme tel. */

const SIGNUP = "/auth/inscription?redirect=/apporteurs";

const FAQ = [
  {
    q: "Qui peut recommander ?",
    a: "Toute personne majeure résidant en Suisse (hors Tessin, où l'activité est réglementée). Pas besoin d'être un professionnel de l'immobilier.",
  },
  {
    q: "Quand la prime est-elle due ?",
    a: "Dès que le vendeur accepte le contact que vous lui présentez. Elle ne dépend ni de la vente, ni de la signature d'un bail.",
  },
  {
    q: "Pourquoi une prime fixe et pas un pourcentage ?",
    a: "Parce que vous ne négociez rien et ne représentez personne : vous présentez quelqu'un. Un montant fixe, connu d'avance, est plus clair pour tout le monde.",
  },
  {
    q: "Que voit le vendeur ?",
    a: "D'abord le besoin de votre contact (sans nom). S'il accepte, il reçoit ses coordonnées — que votre contact vous a autorisé à transmettre.",
  },
  {
    q: "Et si le vendeur refuse ?",
    a: "Rien n'est dû, et vos coordonnées comme celles de votre contact ne lui sont pas transmises.",
  },
];

export function GagnerPublic({ offers }: { offers: PrimedProperty[] }) {
  const example = 800;
  return (
    <div className="mx-auto max-w-5xl">
      <section className="pb-12 pt-4 md:pt-8">
        <p className="eyebrow">Programme apporteur</p>
        <h1 className="page-heading mt-3 max-w-3xl text-[38px] sm:text-[48px]">
          Vous connaissez quelqu&apos;un qui cherche ? <span className="text-laiton">Présentez-le.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-foreground/80">
          Sur E-Dome, des propriétaires offrent une prime fixe à qui leur amène le bon acheteur ou le bon locataire. Vous
          la touchez dès qu&apos;ils acceptent votre contact — pas à la vente.
        </p>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Button asChild size="lg"><Link href={SIGNUP}>Devenir apporteur — gratuit</Link></Button>
          {offers.length > 0 && (
            <Button asChild size="lg" variant="outline">
              <a href="#biens">Voir les biens à prime <ArrowRight className="h-4 w-4" aria-hidden /></a>
            </Button>
          )}
        </div>
      </section>

      <section aria-label="Comment ça marche" className="grid gap-3 md:grid-cols-3">
        {[
          { icon: Coins, t: "Choisissez un bien à prime", d: "Chaque bien affiche sa prime et ce que vous touchez, net, avant toute démarche." },
          { icon: MessageCircle, t: "Présentez votre contact", d: "Avec son accord : son besoin, son budget, son délai, et ses coordonnées." },
          { icon: UserCheck, t: "Le vendeur accepte", d: "La prime est due. Tout est horodaté : qui a présenté qui, et quand." },
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

      {/* Le calcul, en clair */}
      <section className="mt-10 grid items-center gap-6 rounded-2xl border bg-card p-6 md:grid-cols-[1fr_auto] md:p-8">
        <div>
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Ce que vous touchez, en clair</h2>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            E-Dome retient 12 % de la prime (au minimum 3 CHF) pour la mise en relation, la traçabilité et le paiement.
            Le reste est pour vous — rien n&apos;est ajouté au prix payé par l&apos;acheteur.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-laiton-border bg-laiton-soft px-4 py-3 text-center">
            <p className="text-[11.5px] text-laiton">Prime</p>
            <p className="text-[22px] font-semibold tabular-nums text-laiton">{formatNumber(example)} CHF</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" aria-hidden />
          <div className="rounded-xl border bg-background px-4 py-3 text-center">
            <p className="text-[11.5px] text-muted-foreground">Pour vous, net</p>
            <p className="text-[22px] font-semibold tabular-nums">{formatNumber(apporteurNetChf(example))} CHF</p>
          </div>
        </div>
        <p className="text-[11.5px] text-muted-foreground md:col-span-2">Exemple de calcul. Chaque vendeur fixe sa prime, de 50 à 3&apos;000 CHF.</p>
      </section>

      {/* Les vrais biens à prime */}
      <section id="biens" className="mt-12 scroll-mt-20">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Biens à prime</h2>
        {offers.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
            <p className="text-[15px] font-medium">Les premières primes arrivent</p>
            <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted-foreground">
              E-Dome vient d&apos;ouvrir. Créez votre compte : vous verrez les biens à prime dès leur publication.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {offers.map((o) => (
              <li key={o.primeId}>
                <Link href={`/explorer/${o.propertyId}`} className="flex items-center gap-4 rounded-2xl border bg-card p-3.5 shadow-xs hover:border-foreground/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.cover} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{o.title}</span>
                    <span className="block text-[12.5px] text-muted-foreground">
                      {o.city} · {o.transactionType === "vente" ? "Vente" : "Location"}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[17px] font-semibold tabular-nums">{formatNumber(apporteurNetChf(o.amountChf))} CHF</span>
                    <span className="block text-[11.5px] text-muted-foreground">net · prime {formatNumber(o.amountChf)} CHF</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Questions franches */}
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

      <section className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl bg-ink p-6 text-paper md:p-8 dark:bg-card dark:text-foreground">
        <ShieldCheck className="h-6 w-6 text-[#e3b85c]" aria-hidden />
        <p className="flex-1 text-[15px] font-medium">Votre réseau vaut de l&apos;argent. Créer un compte est gratuit.</p>
        <Button asChild variant="prime"><Link href={SIGNUP}>Devenir apporteur</Link></Button>
      </section>
    </div>
  );
}
