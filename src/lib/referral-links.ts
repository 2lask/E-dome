import type { Currency, ReferralLink, ReferralTargetKind, TransactionType } from "./types";
import {
  AFFILIATION_RATES,
  HOST_BOUNTY_CHF,
  PRIME_RANGE_LABEL,
  affiliationLabel,
  quote,
  type CommissionPole,
} from "./pricing";
import { money, type Money } from "./model/billing";

/* Identifiant apporteur du user courant (mock — un seul apporteur dans la
   démo, cf. page /apporteurs). Partagé pour que les liens générés là-bas
   et ceux attachables depuis le composer du feed pointent vers la même
   URL de tracking. */
export const REFERRAL_ID = "AP-7291";

export const DEFAULT_REFERRAL_LINKS: ReferralLink[] = [
  {
    label: "Amener un hôte",
    url: `edome.world/ref/hote/${REFERRAL_ID}`,
    description: `Partagez ce lien pour inviter un propriétaire à publier ses biens sur E-Dome. Prime fixe de ${HOST_BOUNTY_CHF} CHF dès activation du compte (acquisition, pas une commission sur transaction).`,
    commission: `${HOST_BOUNTY_CHF} CHF / hôte activé`,
    clicks: 8,
    conversions: 2,
    earned: 200,
    color: "bg-amber-500/20 text-amber-400",
  },
  {
    label: "Amener un client",
    url: `edome.world/ref/client/${REFERRAL_ID}`,
    description: `Invitez des locataires ou acheteurs potentiels à rejoindre la plateforme. Sur une location courte ou un achat marketplace, l'affilié touche un pourcentage du prix (${affiliationLabel("location-ct")} en courte durée), prélevé sur la marge du vendeur — jamais ajouté au prix payé, et sans diminuer la commission d'E-Dome.`,
    commission: affiliationLabel("location-ct"),
    clicks: 12,
    conversions: 5,
    earned: 320,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "Amener un bien",
    url: `edome.world/ref/bien/${REFERRAL_ID}`,
    description: `Recommandez un bien à la vente entre particuliers ou à la location longue durée. L'apporteur touche une prime fixe en francs (${PRIME_RANGE_LABEL}), définie par le vendeur et due à l'acceptation du contact — jamais un pourcentage du prix, jamais conditionnée à la vente.`,
    commission: `Prime fixe (${PRIME_RANGE_LABEL})`,
    clicks: 3,
    conversions: 1,
    earned: 250,
    color: "bg-emerald-500/20 text-emerald-400",
  },
];

export function slugifyLinkLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

export function buildReferralUrl(slug: string) {
  return `edome.world/ref/${slug}/${REFERRAL_ID}`;
}

/* Route interne (page de détail) de destination par type d'annonce. Sert à
   construire le `redirect` réel d'un lien d'affiliation. */
export const REFERRAL_ROUTE: Record<ReferralTargetKind, string> = {
  bien: "/explorer",
  formation: "/formations",
  evenement: "/evenements",
  produit: "/boutique",
};

/* Deux mécaniques (D14), jamais confondues. BIENS : une prime fixe en francs,
   définie par le vendeur (jamais un pourcentage du prix). MARKETPLACE : un
   pourcentage du prix, prélevé sur la marge du vendeur, la commission d'E-Dome
   inchangée. L'ancien « % du prix payé par le client » et « 10 à 30 % du frais
   fixe » sont abolis. */
const AFFILIATE_CONFIG: Record<
  ReferralTargetKind,
  { commission: string; description: (title: string) => string; color: string }
> = {
  bien: {
    commission: `Prime fixe (${PRIME_RANGE_LABEL})`,
    description: (t) =>
      `Recommandez « ${t} » via votre lien. L'apporteur touche une prime fixe en francs (${PRIME_RANGE_LABEL}), définie par le vendeur et due à l'acceptation du contact — jamais un pourcentage du prix, jamais ajoutée au prix payé.`,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  formation: {
    commission: affiliationLabel("formation"),
    description: (t) =>
      `Recommandez la formation « ${t} » via votre lien. Vous touchez ${affiliationLabel("formation")} du prix de chaque inscription issue de votre recommandation, prélevés sur la marge du créateur — la commission d'E-Dome ne change pas.`,
    color: "bg-orange-500/20 text-orange-400",
  },
  evenement: {
    commission: affiliationLabel("evenement"),
    description: (t) =>
      `Recommandez l'événement « ${t} » via votre lien. Vous touchez ${affiliationLabel("evenement")} du prix de chaque billet vendu grâce à votre recommandation, prélevés sur la marge de l'organisateur — la commission d'E-Dome ne change pas.`,
    color: "bg-purple-500/20 text-purple-400",
  },
  produit: {
    commission: "Affiliation payée par le marchand",
    description: (t) =>
      `Recommandez le produit « ${t} » via votre lien. La boutique fonctionne en affiliation : le marchand rémunère la recommandation, jamais un supplément ajouté au prix payé par l'acheteur.`,
    color: "bg-blue-500/20 text-blue-400",
  },
};

/* Lien d'affiliation généré pour une annonce vendable précise (bien,
   formation, événement, produit). Contrairement aux DEFAULT_REFERRAL_LINKS
   (génériques, acquisition plateforme), celui-ci est rattaché à l'objet :
   · url      — chaîne partageable edome.world/ref/<type>/<id>/<AP-…>
   · redirect — route interne réelle /<route>/<id>?ref=<AP-…> (clics in-app)
   · target   — l'annonce (vignette, prix) pour l'affichage des cartes
   Les stats démarrent à 0 : c'est un lien neuf. */
export function buildObjectAffiliate(
  kind: ReferralTargetKind,
  objectId: string,
  title: string,
  extra?: { image?: string; price?: number; currency?: string; transactionType?: TransactionType },
): ReferralLink {
  const c = AFFILIATE_CONFIG[kind];
  return {
    label: title,
    url: `edome.world/ref/${kind}/${objectId}/${REFERRAL_ID}`,
    redirect: `${REFERRAL_ROUTE[kind]}/${objectId}?ref=${REFERRAL_ID}`,
    description: c.description(title),
    commission: c.commission,
    clicks: 0,
    conversions: 0,
    earned: 0,
    color: c.color,
    target: {
      kind,
      id: objectId,
      title,
      image: extra?.image,
      price: extra?.price,
      currency: extra?.currency,
      transactionType: extra?.transactionType,
    },
  };
}

/* Pôle marketplace d'une cible affiliable. « bien » en est absent : un bien
   relève de la PRIME (montant fixe fixé par le vendeur), pas d'un pourcentage
   dérivable d'un prix. « produit » → boutique, sans taux d'affiliation propre
   (rémunérée par le marchand). */
const REFERRAL_MARKETPLACE_POLE: Partial<Record<ReferralTargetKind, CommissionPole>> = {
  formation: "formation",
  evenement: "evenement",
  produit: "boutique",
};

/**
 * Gain affilié estimé pour une cible marketplace, calculé par `quote()` — le
 * seul moteur du modèle. Remplace l'ancien `estimateEarning()` du barème aboli.
 *
 * Renvoie `null` pour un bien (prime en francs, non dérivable d'un prix), une
 * cible sans prix, ou un pôle sans taux d'affiliation (boutique) : l'appelant
 * retombe alors sur le libellé `commission` du lien, jamais sur un montant à 0
 * silencieux.
 */
export function referralEarning(target?: {
  kind: ReferralTargetKind;
  price?: number;
  currency?: string;
}): { amount: Money } | null {
  if (!target || target.price == null) return null;
  const pole = REFERRAL_MARKETPLACE_POLE[target.kind];
  const range = pole ? AFFILIATION_RATES[pole] : undefined;
  if (!pole || !range) return null;
  const gross = money(Math.round(target.price * 100), (target.currency as Currency) ?? "CHF");
  const affiliate = quote({
    kind: "commission",
    pole,
    gross,
    affiliation: { rate: range.max },
  }).flow.affiliate;
  return affiliate.cents > 0 ? { amount: affiliate } : null;
}
