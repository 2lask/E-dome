import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Plus } from "lucide-react";
import { CtaBand, PageHero } from "@/components/marketing/blocks";
import { TocNav } from "@/components/marketing/toc-nav";
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
  const toc = SECTIONS.map((s) => ({ id: slug(s.title), label: s.title }));
  const total = SECTIONS.reduce((n, s) => n + s.items.length, 0);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHero
        eyebrow="Centre d'aide"
        title={<>Aide</>}
        lead={<>Les réponses aux questions les plus fréquentes. Pour le reste, <Link href="/contact" className="font-medium text-[#f7d488] underline-offset-4 hover:underline">écrivez-nous</Link>.</>}
        aside={
          <div className="cine-glass ml-auto max-w-xs rounded-3xl p-5">
            <p className="text-[12px] uppercase tracking-[0.16em] text-white/50">Dans cette page</p>
            <p className="mt-2 text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{total}</p>
            <p className="mt-1 text-[13.5px] text-white/60">réponses, en {SECTIONS.length} thèmes</p>
          </div>
        }
      />

      <nav aria-label="Sections de l'aide" className="mt-8 flex flex-wrap gap-2 lg:hidden">
        {SECTIONS.map((s) => (
          <a key={s.title} href={`#${slug(s.title)}`} className="inline-flex min-h-[44px] items-center rounded-full border bg-card px-4 text-[13.5px] hover:border-laiton-border">
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-[230px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-6">
            <TocNav items={toc} label="Sommaire de l'aide" title="Sommaire" numbered />
            <div className="relative overflow-hidden rounded-2xl border border-laiton-border bg-gradient-to-br from-laiton-soft to-card p-4">
              <MessageCircle className="h-5 w-5 text-laiton" aria-hidden />
              <p className="mt-2 text-[14px] font-semibold">Pas de réponse ici ?</p>
              <Link href="/contact" className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-[13.5px] font-medium text-laiton hover:underline">
                Écrivez-nous <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-14">
          {SECTIONS.map((s, si) => (
            <section key={s.title} id={slug(s.title)} aria-labelledby={`${slug(s.title)}-t`} className="scroll-mt-20">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[12px] font-semibold text-laiton">{String(si + 1).padStart(2, "0")}</span>
                <h2 id={`${slug(s.title)}-t`} className="text-[24px] font-semibold tracking-[-0.025em]">{s.title}</h2>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>
              <div className="mt-5 space-y-2.5">
                {s.items.map((it) => (
                  <details key={it.q} className="group rounded-2xl border bg-card transition-colors open:border-laiton-border open:bg-gradient-to-br open:from-laiton-soft/60 open:to-card hover:border-foreground/20">
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                      {it.q}
                      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition-transform duration-300 group-open:rotate-45 group-open:border-laiton-border group-open:text-laiton motion-reduce:transition-none">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-[14.5px] leading-relaxed text-muted-foreground">{it.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <CtaBand title="Une question sans réponse ?" text="Décrivez-la depuis la page Contact : nous vous répondons par e-mail.">
            <Link href="/contact" className="cine-btn-gold inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold">
              Nous écrire <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </CtaBand>
        </div>
      </div>
    </div>
  );
}

function slug(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
