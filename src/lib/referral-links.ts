import type { ReferralLink, ReferralTargetKind } from "./types";

/* Identifiant apporteur du user courant (mock — un seul apporteur dans la
   démo, cf. page /apporteurs). Partagé pour que les liens générés là-bas
   et ceux attachables depuis le composer du feed pointent vers la même
   URL de tracking. */
export const REFERRAL_ID = "AP-7291";

export const DEFAULT_REFERRAL_LINKS: ReferralLink[] = [
  {
    label: "Amener un hôte",
    url: `edome.world/ref/hote/${REFERRAL_ID}`,
    description: "Partagez ce lien pour inviter un propriétaire à publier ses biens sur E-Dome. Bounty fixe de 100 CHF dès activation du compte (referral marketing).",
    commission: "100 CHF / hôte activé",
    clicks: 8,
    conversions: 2,
    earned: 200,
    color: "bg-amber-500/20 text-amber-400",
  },
  {
    label: "Amener un client",
    url: `edome.world/ref/client/${REFERRAL_ID}`,
    description: "Invitez des locataires ou acheteurs potentiels à rejoindre la plateforme. Sur une location courte ou un achat marketplace, vous touchez une part de la commission marketplace d'E-Dome — jamais ajoutée au prix payé.",
    commission: "10–30 % de la commission E-Dome",
    clicks: 12,
    conversions: 5,
    earned: 320,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "Amener un bien",
    url: `edome.world/ref/bien/${REFERRAL_ID}`,
    description: "Recommandez un bien à la vente entre particuliers ou à la location longue durée. Vous touchez une part du frais fixe de plateforme E-Dome (500 ou 2 500 CHF en vente, 150 / 250 / 400 CHF en location LT) — pas un % du prix.",
    commission: "10–30 % du frais plateforme",
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

const AFFILIATE_CONFIG: Record<
  ReferralTargetKind,
  { commission: string; description: (title: string) => string; color: string }
> = {
  bien: {
    commission: "10–30 % du frais plateforme",
    description: (t) =>
      `Recommandez « ${t} » via votre lien. Si l'acheteur ou le locataire conclut sur E-Dome, vous touchez une part du frais fixe de plateforme — jamais ajoutée au prix payé.`,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  formation: {
    commission: "20 % du prix de la formation",
    description: (t) =>
      `Recommandez la formation « ${t} » via votre lien. Vous touchez 20 % du prix pour chaque inscription issue de votre recommandation.`,
    color: "bg-orange-500/20 text-orange-400",
  },
  evenement: {
    commission: "15 % du prix du billet",
    description: (t) =>
      `Recommandez l'événement « ${t} » via votre lien. Vous touchez 15 % du prix pour chaque billet vendu grâce à votre recommandation.`,
    color: "bg-purple-500/20 text-purple-400",
  },
  produit: {
    commission: "10 % du prix de vente",
    description: (t) =>
      `Recommandez le produit « ${t} » via votre lien. Vous touchez 10 % de la commission E-Dome pour chaque vente issue de votre recommandation.`,
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
  extra?: { image?: string; price?: number; currency?: string },
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
    },
  };
}
