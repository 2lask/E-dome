import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { apporteurNetChf, PRIME_MAX_CHF, PRIME_MIN_CHF } from "@/lib/my-property";

export const metadata: Metadata = { title: "Aide", description: "Réponses aux questions sur E-Dome : publier, recevoir des demandes, la prime, la confidentialité." };

/* ── /aide — le centre d'aide (REBUILD.md §8) ────────────────────────────────

   Réécrit entièrement : l'ancienne FAQ décrivait un autre produit (examen des
   annonces sous 48 h, réservations, TWINT et PayPal, rôle « Hôte ») et
   affirmait des faits non vérifiés (« serveurs en Suisse, certifiés ISO
   27001 »). Chaque réponse ci-dessous décrit ce que fait VRAIMENT E-Dome
   aujourd'hui — et dit ce qui n'est pas encore en place. */

const EX = 500;

const SECTIONS: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "Démarrer",
    items: [
      {
        q: "Est-ce gratuit ?",
        a: <>Oui. Publier un bien, chercher, contacter un propriétaire et recommander sont gratuits. E-Dome ne prend rien sur une vente ou une location. Seule exception : quand un vendeur accepte un contact présenté par un apporteur, E-Dome retient 12 % de la prime (3 CHF au minimum).</>,
      },
      {
        q: "Comment créer un compte ?",
        a: <>Cliquez sur « Créer un compte » : e-mail et mot de passe, ou votre compte Google. Selon les réglages, un e-mail de confirmation peut vous être envoyé — ouvrez le lien pour activer votre compte.</>,
      },
    ],
  },
  {
    title: "Publier et recevoir des demandes",
    items: [
      {
        q: "Comment publier un bien ?",
        a: <>« Publier un bien » : le bien, les photos, l&apos;annonce, la prime (facultative), puis l&apos;attestation. L&apos;annonce est en ligne immédiatement, sans délai d&apos;examen.</>,
      },
      {
        q: "Combien de photos puis-je ajouter ?",
        a: <>Jusqu&apos;à 15 (JPEG, PNG ou WebP). Elles sont redimensionnées automatiquement avant l&apos;envoi. La première sert de couverture ; vous pouvez en choisir une autre.</>,
      },
      {
        q: "Où arrivent les messages des intéressés ?",
        a: <>Dans « Demandes » : les contacts, les demandes de visite et les mises en relation des apporteurs, au même endroit. Pour chaque demande : le message, les coordonnées, l&apos;avancement et un historique horodaté.</>,
      },
      {
        q: "Puis-je modifier ou retirer une annonce ?",
        a: <>Oui, depuis « Mes biens ». Retirer une annonce la supprime avec ses photos. Une annonce pour laquelle vous avez accepté une mise en relation est toutefois conservée : c&apos;est la preuve de la prime due. Écrivez-nous pour la clore.</>,
      },
    ],
  },
  {
    title: "La prime et les apporteurs",
    items: [
      {
        q: "Qu'est-ce que la prime ?",
        a: <>Un montant fixe en francs (de {PRIME_MIN_CHF} à {formatNumber(PRIME_MAX_CHF)} CHF), que le vendeur offre à qui lui présente le bon acheteur ou locataire. Jamais un pourcentage du prix. Exemple : sur une prime de {EX} CHF, l&apos;apporteur reçoit {formatNumber(apporteurNetChf(EX))} CHF.</>,
      },
      {
        q: "Quand la prime est-elle due ?",
        a: <>Dès que le vendeur accepte le contact présenté. Elle ne dépend pas de la vente ni de la signature d&apos;un bail. S&apos;il refuse, rien n&apos;est dû.</>,
      },
      {
        q: "Comment la prime est-elle versée ?",
        a: <>Le versement intégré, par un prestataire de paiement agréé, est en cours de mise en place. Aujourd&apos;hui, une prime acceptée est enregistrée et horodatée dans vos comptes respectifs ; son règlement se fait encore hors de la plateforme. E-Dome ne détient jamais les fonds de la transaction.</>,
      },
      {
        q: "Qui peut être apporteur ?",
        a: <>Toute personne majeure résidant en Suisse, hors Tessin (où l&apos;activité est réglementée). Aucune formation immobilière n&apos;est nécessaire : vous présentez quelqu&apos;un, vous ne négociez rien et ne représentez personne.</>,
      },
      {
        q: "Comment présenter un contact ?",
        a: <>Dans « Gagner », choisissez un bien à prime, puis « Présenter un contact » : le besoin de la personne, ses coordonnées, et la confirmation qu&apos;elle vous a autorisé à les transmettre.</>,
      },
    ],
  },
  {
    title: "Confidentialité",
    items: [
      {
        q: "Qui voit mes coordonnées ?",
        a: <>Quand vous écrivez à propos d&apos;un bien, seul son propriétaire les reçoit. Pour une mise en relation, le vendeur voit d&apos;abord le besoin, sans nom ; les coordonnées ne lui sont transmises que s&apos;il accepte.</>,
      },
      {
        q: "Comment supprimer mon compte ?",
        a: <>Écrivez-nous depuis la page <Link href="/contact" className="text-leman underline underline-offset-2">Contact</Link> : nous supprimons votre compte et vos données, sous réserve de ce que la loi nous oblige à conserver. Détails dans la <Link href="/confidentialite" className="text-leman underline underline-offset-2">politique de confidentialité</Link>.</>,
      },
    ],
  },
  {
    title: "Technique",
    items: [
      {
        q: "Y a-t-il une application mobile ?",
        a: <>E-Dome fonctionne dans le navigateur de votre téléphone. Vous pouvez l&apos;ajouter à votre écran d&apos;accueil depuis le menu du navigateur pour l&apos;ouvrir comme une application.</>,
      },
      {
        q: "Je rencontre un problème",
        a: <>Décrivez-le depuis la page <Link href="/contact" className="text-leman underline underline-offset-2">Contact</Link> (ce que vous faisiez, votre appareil, votre navigateur). Nous vous répondons par e-mail.</>,
      },
    ],
  },
];

export default function AidePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="page-heading text-[32px]">Aide</h1>
      <p className="mt-1.5 text-[14.5px] text-muted-foreground">
        Les réponses aux questions les plus fréquentes. Pour le reste, <Link href="/contact" className="text-leman hover:underline">écrivez-nous</Link>.
      </p>

      <nav aria-label="Sections de l'aide" className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a key={s.title} href={`#${slug(s.title)}`} className="rounded-full border bg-card px-3 py-1.5 text-[13px] hover:border-foreground/25">
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.title} id={slug(s.title)} className="scroll-mt-20">
            <h2 className="text-[18px] font-semibold tracking-[-0.015em]">{s.title}</h2>
            <div className="mt-3 divide-y overflow-hidden rounded-2xl border bg-card">
              {s.items.map((it) => (
                <details key={it.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[14.5px] font-medium hover:bg-accent/40 [&::-webkit-details-marker]:hidden">
                    {it.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <div className="px-5 pb-4 text-[14px] leading-relaxed text-muted-foreground">{it.a}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function slug(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
