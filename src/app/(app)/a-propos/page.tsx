import type { Metadata } from "next";
import Link from "next/link";
import { Tag, Coins, Compass, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { apporteurNetChf } from "@/lib/my-property";

export const metadata: Metadata = {
  title: "Comment fonctionne E-Dome",
  description: "Vendre ou louer sans agence, recommander un bien avec son lien et toucher la commission d'apport : les règles d'E-Dome.",
};

/* ── /a-propos — comment fonctionne E-Dome (REBUILD.md) ──────────────────────
   Remplace l'ancien explicatif « sept pôles » (services, formations, lives,
   boutique…), qui contredisait le produit. Ici : les trois rôles, la boucle,
   qui paie quoi, les règles — et ce qui n'est PAS encore en place, dit
   franchement. */

const ROLES = [
  { icon: Tag, t: "Vous vendez ou louez", d: "Publiez gratuitement avec photos et vidéo, recevez les demandes dans une boîte unique, gardez la main sur la vente. Si vous le souhaitez, offrez une commission à qui vous amène le bon acheteur." },
  { icon: Coins, t: "Vous connaissez quelqu'un", d: "Partagez votre lien personnel à qui cherche. Si la vente se conclut grâce à votre contact, la commission est due — vous ne négociez rien, ne représentez personne." },
  { icon: Compass, t: "Vous cherchez", d: "Des biens proposés directement par leurs propriétaires. Écrivez ou demandez une visite : votre message arrive chez le propriétaire, sans intermédiaire." },
];

const RULES = [
  { t: "E-Dome ne signe aucun mandat", d: "Ni de vente, ni de recherche. Le propriétaire reste maître de sa vente." },
  { t: "E-Dome ne négocie aucun prix", d: "Les parties s'entendent directement." },
  { t: "Une commission claire et tracée", d: "Le vendeur fixe la commission (en francs ou en % du prix) ; elle est due quand la vente est conclue grâce à l'apporteur, preuve à l'appui. E-Dome en retient 12 %." },
  { t: "E-Dome ne détient jamais vos fonds", d: "L'argent de la transaction ne passe pas par nous." },
];

const SOON = [
  "Le versement intégré des commissions, par un prestataire de paiement agréé. Aujourd'hui, une commission due est enregistrée, horodatée et suivie ; son paiement se fait directement entre les parties (TWINT, virement).",
  "Les notifications par e-mail (aujourd'hui : alerte en direct dans l'application et notifications du navigateur).",
  "La QR-facture suisse pour régler une commission en un scan.",
  "Les favoris enregistrés sur votre compte, et les profils vérifiés.",
  "Les formules pour les professionnels (agences, régies), à frais fixes.",
];

export default function AProposPage() {
  const example = 800;
  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Comment ça marche</p>
      <h1 className="page-heading mt-3 text-[36px] sm:text-[44px]">Le réseau immobilier où votre réseau vous rapporte</h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/80">
        Les portails vous font payer pour être vu. Les agences prennent un pourcentage. E-Dome fait autrement : publier est
        gratuit, et ceux qui connaissent le bon acheteur sont récompensés pour l&apos;avoir présenté.
      </p>

      <section className="mt-10 grid gap-3 md:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r.t} className="rounded-2xl border bg-card p-5 shadow-xs">
            <r.icon className="h-5 w-5 text-leman" aria-hidden />
            <h2 className="mt-3 text-[15.5px] font-semibold">{r.t}</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{r.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Qui paie quoi</h2>
        <dl className="mt-4 divide-y rounded-2xl border bg-card">
          <div className="grid gap-1 p-5 sm:grid-cols-[220px_1fr]">
            <dt className="text-[14px] font-semibold">Vendre ou louer</dt>
            <dd className="text-[14px] text-muted-foreground"><strong className="text-foreground">0 CHF à E-Dome</strong> sur la transaction. Publier et recevoir des demandes est gratuit.</dd>
          </div>
          <div className="grid gap-1 p-5 sm:grid-cols-[220px_1fr]">
            <dt className="text-[14px] font-semibold">La commission d&apos;apport (facultative)</dt>
            <dd className="text-[14px] text-muted-foreground">
              Fixée par le vendeur : un montant fixe, ou de 0,1 % à 3 % du prix de vente. Due quand la vente est conclue grâce à l&apos;apporteur (ou, pour un montant fixe, dès l&apos;acceptation du contact si le vendeur l&apos;a choisi). Sur une commission de {formatNumber(example)} CHF,
              l&apos;apporteur reçoit <strong className="text-foreground">{formatNumber(apporteurNetChf(example))} CHF</strong> ; E-Dome retient 12 % (3 CHF au minimum).
            </dd>
          </div>
          <div className="grid gap-1 p-5 sm:grid-cols-[220px_1fr]">
            <dt className="text-[14px] font-semibold">Recommander</dt>
            <dd className="text-[14px] text-muted-foreground">Gratuit. Rien n&apos;est jamais ajouté au prix payé par l&apos;acheteur.</dd>
          </div>
        </dl>
      </section>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-leman" aria-hidden />
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Quatre règles, tenues par le produit</h2>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {RULES.map((r) => (
            <li key={r.t} className="rounded-2xl border bg-card p-5">
              <p className="text-[14.5px] font-semibold">{r.t}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{r.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-dashed bg-card p-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" aria-hidden />
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Ce qui n&apos;est pas encore en place</h2>
        </div>
        <p className="mt-1 text-[13.5px] text-muted-foreground">E-Dome vient d&apos;ouvrir. Plutôt que de faire semblant, voici ce qui arrive :</p>
        <ul className="mt-4 space-y-2.5">
          {SOON.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 flex flex-wrap gap-2.5">
        <Button asChild><Link href="/publier">Publier un bien</Link></Button>
        <Button asChild variant="outline"><Link href="/apporteurs">Devenir apporteur <ArrowRight className="h-4 w-4" aria-hidden /></Link></Button>
        <Button asChild variant="ghost"><Link href="/aide">Une question ?</Link></Button>
      </section>
    </div>
  );
}
