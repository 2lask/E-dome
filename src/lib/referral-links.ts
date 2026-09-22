import type { ReferralLink, ReferralTargetKind, TransactionType } from "./types";
import {
  APPORTEUR_SHARE_LABEL,
  HOST_BOUNTY_CHF,
  LONG_RENTAL_FEES,
  SALE_FEE_ABOVE,
  SALE_FEE_BELOW,
  apporteurShareLabel,
} from "./pricing";

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
    description: `Invitez des locataires ou acheteurs potentiels à rejoindre la plateforme. Sur une location courte ou un achat marketplace, vous touchez ${APPORTEUR_SHARE_LABEL} de la commission marketplace d'E-Dome — jamais ajoutés au prix payé.`,
    commission: apporteurShareLabel("location-ct"),
    clicks: 12,
    conversions: 5,
    earned: 320,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "Amener un bien",
    url: `edome.world/ref/bien/${REFERRAL_ID}`,
    description: `Recommandez un bien à la vente entre particuliers ou à la location longue durée. Vous touchez ${APPORTEUR_SHARE_LABEL} du frais fixe de plateforme E-Dome (${SALE_FEE_BELOW} ou ${SALE_FEE_ABOVE} CHF en vente, ${LONG_RENTAL_FEES.court} / ${LONG_RENTAL_FEES.median} / ${LONG_RENTAL_FEES.long} CHF en location longue durée) — pas un pourcentage du prix.`,
    commission: apporteurShareLabel("vente"),
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

/* Les libellés viennent de @/lib/pricing : ils disaient auparavant « 20 % du
   prix de la formation », « 15 % du prix du billet », « 10 % du prix de
   vente » — trois assiettes inventées, et surtout un pourcentage du PRIX
   payé par le client, ce que le modèle exclut explicitement. La part de
   l'apporteur porte toujours sur le revenu d'E-Dome. */
const AFFILIATE_CONFIG: Record<
  ReferralTargetKind,
  { commission: string; description: (title: string) => string; color: string }
> = {
  bien: {
    commission: apporteurShareLabel("vente"),
    description: (t) =>
      `Recommandez « ${t} » via votre lien. Si l'acheteur ou le locataire conclut sur E-Dome, vous touchez ${APPORTEUR_SHARE_LABEL} du frais fixe de plateforme — jamais ajoutés au prix payé.`,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  formation: {
    commission: apporteurShareLabel("formation"),
    description: (t) =>
      `Recommandez la formation « ${t} » via votre lien. Vous touchez ${APPORTEUR_SHARE_LABEL} de la commission qu'E-Dome perçoit sur chaque inscription issue de votre recommandation.`,
    color: "bg-orange-500/20 text-orange-400",
  },
  evenement: {
    commission: apporteurShareLabel("evenement"),
    description: (t) =>
      `Recommandez l'événement « ${t} » via votre lien. Vous touchez ${APPORTEUR_SHARE_LABEL} de la commission qu'E-Dome perçoit sur chaque billet vendu grâce à votre recommandation.`,
    color: "bg-purple-500/20 text-purple-400",
  },
  produit: {
    commission: apporteurShareLabel("boutique"),
    description: (t) =>
      `Recommandez le produit « ${t} » via votre lien. Vous touchez ${APPORTEUR_SHARE_LABEL} de la commission qu'E-Dome perçoit sur chaque vente issue de votre recommandation.`,
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
