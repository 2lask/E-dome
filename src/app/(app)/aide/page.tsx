import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { apporteurNetChf } from "@/lib/my-property";

export const metadata: Metadata = { title: "Aide", description: "Réponses aux questions sur E-Dome : publier, vendre, la commission d'apport, la confidentialité." };

/* ── /aide — le centre d'aide (REBUILD.md §8) ────────────────────────────────

   Réécrit entièrement : l'ancienne FAQ décrivait un autre produit (examen des
   annonces sous 48 h, réservations, TWINT et PayPal, rôle « Hôte ») et
   affirmait des faits non vérifiés (« serveurs en Suisse, certifiés ISO
   27001 »). Chaque réponse ci-dessous décrit ce que fait VRAIMENT E-Dome
   aujourd'hui — et dit ce qui n'est pas encore en place. */

const EX_PRICE = 1_200_000;
const EX_GROSS = EX_PRICE / 100;

const SECTIONS: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "Démarrer",
    items: [
      {
        q: "Est-ce gratuit ?",
        a: <>Oui. Publier un bien, chercher, contacter un propriétaire et recommander sont gratuits. E-Dome ne prend rien sur le prix de vente. Seule rémunération : 12 % de la commission d&apos;apport (3 CHF au minimum), et seulement si une commission est effectivement due à un apporteur.</>,
      },
      {
        q: "Comment créer un compte ?",
        a: <>Cliquez sur « Créer un compte » : prénom, nom, e-mail et mot de passe. Si une confirmation est demandée, ouvrez le lien reçu par e-mail pour activer votre compte.</>,
      },
    ],
  },
  {
    title: "Publier et vendre",
    items: [
      {
        q: "Comment publier un bien ?",
        a: <>« Publier un bien » : le bien, les photos et la vidéo, l&apos;annonce, la commission pour les apporteurs (facultative), puis l&apos;attestation. L&apos;annonce est en ligne immédiatement.</>,
      },
      {
        q: "Combien de photos et de vidéos ?",
        a: <>Jusqu&apos;à 15 photos (JPEG, PNG ou WebP), redimensionnées automatiquement, et une vidéo de visite (MP4 ou MOV, 50 Mo au plus). La vidéo passe en grand en haut de l&apos;annonce.</>,
      },
      {
        q: "Où arrivent les demandes ?",
        a: <>Dans « Demandes », avec le message, les coordonnées et, si la personne vient du lien d&apos;un apporteur, la mention « Apporté par… ». Une alerte s&apos;affiche aussi en direct sur toutes les pages ; vous pouvez activer les notifications du navigateur depuis « Demandes ».</>,
      },
      {
        q: "Comment suivre une vente jusqu'à l'acte ?",
        a: <>Dans chaque demande : faites avancer l&apos;étape (échange, visite, offre), notez les offres reçues (montant, financement, conditions), acceptez, refusez ou contre-proposez, puis cochez les étapes jusqu&apos;à l&apos;acte authentique chez le notaire. À la vente, indiquez le prix final : la commission de l&apos;apporteur est calculée automatiquement.</>,
      },
      {
        q: "Puis-je modifier ou retirer une annonce ?",
        a: <>Oui, depuis « Mes biens ». Une annonce liée à une commission déjà due est conservée comme preuve : écrivez-nous pour la clore.</>,
      },
    ],
  },
  {
    title: "La commission et les apporteurs",
    items: [
      {
        q: "Qu'est-ce que la commission d'apport ?",
        a: <>Un montant que le vendeur promet à qui lui amène l&apos;acheteur ou le locataire : soit un montant fixe, soit un pourcentage du prix de vente (0,1 % à 3 %). Exemple : une vente à {formatNumber(EX_PRICE)} CHF avec 1 % donne {formatNumber(EX_GROSS)} CHF de commission ; l&apos;apporteur reçoit {formatNumber(apporteurNetChf(EX_GROSS))} CHF, E-Dome {formatNumber(EX_GROSS - apporteurNetChf(EX_GROSS))} CHF.</>,
      },
      {
        q: "Quand est-elle due ?",
        a: <>Par défaut, quand la vente ou le bail est conclu grâce à la personne amenée (courtage d&apos;indication, art. 412 ss CO). Pour un montant fixe, le vendeur peut choisir qu&apos;elle soit due dès qu&apos;il accepte le contact ; c&apos;est alors indiqué sur l&apos;annonce.</>,
      },
      {
        q: "Comment le contact est-il attribué à l'apporteur ?",
        a: <>Par son lien personnel. Toute personne qui l&apos;ouvre puis écrit au vendeur dans les 60 jours lui est attribuée, et les conditions de la commission sont figées à ce moment-là.</>,
      },
      {
        q: "Comment la commission est-elle versée ?",
        a: <>Directement par le vendeur à l&apos;apporteur, par TWINT ou virement. À la vente, un règlement est créé automatiquement dans « Règlements » : le vendeur déclare le paiement, l&apos;apporteur le confirme. E-Dome ne détient jamais les fonds.</>,
      },
      {
        q: "Qui peut être apporteur ?",
        a: <>Toute personne majeure résidant en Suisse, hors Tessin (où le courtage immobilier est soumis à autorisation). Aucune formation n&apos;est nécessaire : vous signalez une occasion, vous ne négociez rien et ne représentez personne.</>,
      },
    ],
  },
  {
    title: "Confidentialité",
    items: [
      {
        q: "Qui voit mes coordonnées ?",
        a: <>Quand vous écrivez à propos d&apos;un bien, seul son propriétaire les reçoit. L&apos;apporteur dont vous avez suivi le lien voit seulement l&apos;étape de la demande et sa commission, jamais votre nom ni vos coordonnées.</>,
      },
      {
        q: "Les visites sont-elles suivies ?",
        a: <>Oui, de façon anonyme : un identifiant aléatoire (jamais l&apos;adresse IP) compte les visites et rattache un contact au lien d&apos;un apporteur. Détails dans la <Link href="/confidentialite" className="text-leman underline underline-offset-2">politique de confidentialité</Link>.</>,
      },
      {
        q: "Comment supprimer mon compte ?",
        a: <>Écrivez-nous depuis la page <Link href="/contact" className="text-leman underline underline-offset-2">Contact</Link> : nous supprimons votre compte et vos données, sous réserve de ce que la loi nous oblige à conserver.</>,
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
