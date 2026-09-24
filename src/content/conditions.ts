import { PLATFORM_RULES } from "@/lib/model/rules";
import { RATES } from "@/lib/pricing/catalog";

/* ── Les conditions générales, réécrites ────────────────────────────────────

   Treize sections, et deux changements de fond par rapport aux dix
   précédentes (plan, étape 7) :

   1. LES QUATRE RÈGLES PASSENT EN §2, AVANT LES PRIX, EN TOUTES LETTRES. Elles
      ne sont pas paraphrasées : le §2 est composé depuis `PLATFORM_RULES`, la
      même source que l'interface, si bien que les conditions ne peuvent pas
      énoncer une règle différente de celle qu'affiche l'application.

   2. LE GLOSSAIRE EST CORRIGÉ AU MÊME TITRE QUE LE BARÈME. L'ancien §2
      définissait « Commission » comme « pourcentage prélevé par la Plateforme
      sur les transactions réalisées » — la règle 3 contredite dans les
      définitions mêmes — et confondait l'hôte de courte durée avec le vendeur,
      la distinction sur laquelle repose tout le modèle. Les deux sont refaits.

   Le barème du §6 est GÉNÉRÉ depuis `RATES` : il ne peut pas diverger du
   catalogue. Les frais fixes de 500 / 2 500 CHF ont disparu — publier le bien
   d'un particulier est gratuit.

   Ce document reste indicatif et attend la relecture de l'avocat ; ce qui doit
   être confirmé est tracé dans JURIDIQUE-A-VALIDER.md. */

export interface Section {
  id: string;
  title: string;
  content: string;
  table?: string[][];
  contentAfter?: string;
}

/* §2 composé depuis le modèle : « 1. <full> » pour chacune des quatre règles. */
const rulesText = PLATFORM_RULES.map((r, i) => `${i + 1}. ${r.full}`).join("\n\n");

/* §6 : barème généré depuis RATES, en toutes lettres. */
const pct = (r: number) => `${(r * 100).toLocaleString("fr-CH")} %`;
const rateRange = (min: number, max: number) => (min === max ? pct(max) : `${pct(min)} à ${pct(max)}`);
const rateRows: string[][] = [
  ["Pôle", "Ce que prélève E-Dome", "Sur qui"],
  ["Vente d'un bien", "Rien — publication gratuite", "—"],
  ["Location longue durée", "Rien — publication gratuite", "—"],
  ["Location courte durée", `Commission ${rateRange(RATES["location-ct"].min, RATES["location-ct"].max)} de la réservation`, "L'hôte"],
  ["Services & prestataires", `Commission ${rateRange(RATES.service.min, RATES.service.max)}`, "Le prestataire"],
  ["Événements / billetterie", `Commission ${rateRange(RATES.evenement.min, RATES.evenement.max)} + part fixe par billet`, "L'organisateur"],
  ["Lives", `Commission ${rateRange(RATES.live.min, RATES.live.max)}`, "Le créateur"],
  ["Formations", `Commission ${rateRange(RATES.formation.min, RATES.formation.max)}`, "Le créateur"],
  ["Boutique", RATES.boutique.max === 0 ? "Rien — affiliation" : `Commission ${rateRange(RATES.boutique.min, RATES.boutique.max)}`, "—"],
];

export const conditionsMeta = {
  disclaimer:
    "Ce document est fourni à titre indicatif dans le cadre de la maquette de démonstration E-Dome. Il ne constitue pas un document légal contraignant et attend la relecture d'un juriste.",
  title: "Conditions Générales d'Utilisation",
  updated: "Dernière mise à jour : 1er janvier 2026",
  tocTitle: "Table des matières",
} as const;

export const SECTIONS: Section[] = [
  {
    id: "objet",
    title: "1. Objet",
    content:
      `Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'utilisation de la plateforme E-Dome (« la Plateforme »), éditée par E-Dome Sàrl, dont le siège est en Suisse. En accédant à la Plateforme, l'Utilisateur accepte l'intégralité des présentes CGU. À défaut, il doit cesser toute utilisation.`,
  },
  {
    id: "regles",
    title: "2. Les quatre règles fondamentales",
    content:
      `E-Dome est un éditeur de logiciel et un espace de mise en relation. Elle n'est pas un courtier, un agent immobilier ni un intermédiaire financier. Quatre règles, énoncées avant toute clause tarifaire parce qu'elles priment sur elle, garantissent ce positionnement :\n\n${rulesText}\n\nCes quatre règles se tiennent ensemble. La troisième, seule, ne suffirait pas : un forfait non conditionné versé à quelqu'un qui agit comme intermédiaire resterait du courtage. Ce sont les règles 1 et 2 — aucun mandat, aucune négociation — qui écartent l'activité de courtage, indépendamment du prix pratiqué.`,
  },
  {
    id: "definitions",
    title: "3. Définitions",
    content:
      `- « Plateforme » : le site web et l'application E-Dome.\n` +
      `- « Utilisateur » : toute personne physique ou morale inscrite.\n` +
      `- « Vendeur » : Utilisateur qui met un bien en vente. E-Dome ne le représente pas et ne perçoit rien sur la vente.\n` +
      `- « Bailleur » : Utilisateur qui met un bien en location longue durée.\n` +
      `- « Hôte » : Utilisateur qui propose un bien en location de courte durée. À la différence du vendeur, l'hôte réalise ses réservations sur la Plateforme, et une commission est prélevée sur lui à ce titre — jamais ajoutée au prix payé par le voyageur.\n` +
      `- « Client », « Voyageur » : Utilisateur qui achète, loue ou réserve.\n` +
      `- « Prestataire », « Créateur » : Utilisateur qui vend un service, une formation, un événement ou un live.\n` +
      `- « Apporteur » : Utilisateur qui recommande par un lien traçable et perçoit une part de la rémunération d'E-Dome, jamais un supplément payé par le client.\n` +
      `- « Prix » et « Commission » : les sommes dues à E-Dome sont fixées à l'avance et dues indépendamment de la conclusion d'une vente ou d'un bail (règle 3). Le mot « commission » désigne, pour les seuls pôles de la marketplace, une part de ce que perçoit le prestataire ou l'hôte au titre d'une prestation vendue via la Plateforme — jamais un pourcentage du prix d'une vente ou d'un loyer immobilier.`,
  },
  {
    id: "inscription",
    title: "4. Inscription, compte et vérification",
    content:
      `L'inscription est gratuite et ouverte à toute personne majeure ou entité valablement constituée. L'Utilisateur fournit des informations exactes et à jour. La vérification comporte trois niveaux, et chaque badge dit ce qu'il garantit :\n- Identité : l'Utilisateur est bien qui il déclare être.\n- Professionnel : un numéro d'identification (IDE) valide a été fourni.\n- Qualification : une qualification déclarée par l'Utilisateur, non vérifiée par E-Dome sauf mention expresse contraire vérifiée contre un registre officiel.\nUn badge ne garantit rien au-delà de ce qu'il énonce.`,
  },
  {
    id: "services",
    title: "5. Services proposés",
    content:
      `La Plateforme permet la publication et la consultation d'annonces (vente, location courte et longue durée), la mise en relation, la réservation de séjours courts, l'accès à des services, formations, événements et lives, le programme d'apporteurs, et des outils de gestion. E-Dome agit comme éditeur et intermédiaire technique ; elle n'est jamais partie aux contrats conclus entre Utilisateurs.`,
  },
  {
    id: "remuneration",
    title: "6. Rémunération d'E-Dome et prix",
    content:
      `E-Dome gagne sa vie du côté professionnel. Publier, chercher et vendre son propre bien est gratuit : il n'existe aucun frais de publication, et aucune somme due à E-Dome ne dépend de la conclusion d'une vente ou d'un bail. Les professionnels s'abonnent aux outils ; les pôles de la marketplace appliquent une commission sur la prestation vendue. Le barème ci-dessous reflète le catalogue en vigueur :`,
    table: rateRows,
    contentAfter:
      `Les abonnements des agences et des propriétaires sont facturés au mois ou à l'année, sans engagement. Il n'existe pas de « revenue share » négocié de gré à gré : tous les Utilisateurs d'une même formule paient le même prix (règle 3).`,
  },
  {
    id: "apporteurs",
    title: "7. Programme d'apporteurs",
    content:
      `L'apporteur recommande un bien, une prestation ou la Plateforme par un lien traçable. Sa rémunération est une part de ce que perçoit E-Dome sur la conversion (10 à 30 % selon le pôle), ou une prime fixe — jamais un supplément ajouté au prix payé par le client. L'apporteur ne représente aucune partie, ne négocie aucun prix, n'est ni agent ni courtier. Le programme peut être restreint par couple pays × type d'apport là où la réglementation locale l'exige.`,
  },
  {
    id: "paiements",
    title: "8. Paiements et fonds",
    content:
      `Les paiements sont exécutés par un prestataire de paiement agréé. E-Dome n'est jamais dépositaire des fonds des Utilisateurs, ne verse aucun intérêt et ne conserve aucun solde : tout montant destiné à un tiers lui est reversé sans délai (règle 4). Les frais du prestataire de paiement sont indiqués à part sur chaque écran de transaction. Le dépôt de garantie d'une location ne peut excéder trois mois de loyer et est placé sur un compte au nom du locataire (art. 257e CO) ; E-Dome ne le détient jamais.`,
  },
  {
    id: "avis",
    title: "9. Avis et évaluations",
    content:
      `Un avis ne peut être publié que par un Utilisateur ayant réalisé une transaction rattachée, et se rapporte à cette transaction. Tout avantage reçu en échange d'un avis doit être déclaré. E-Dome peut retirer un avis manifestement faux ou sans transaction rattachée.`,
  },
  {
    id: "obligations",
    title: "10. Obligations des Utilisateurs",
    content:
      `L'Utilisateur s'engage à :\n- Utiliser la Plateforme conformément à sa destination et aux lois en vigueur.\n- Ne publier aucun contenu illicite, trompeur ou portant atteinte aux droits de tiers, et à donner des informations exactes sur ses biens et prestations.\n- Respecter les droits de propriété intellectuelle.\n- Ne pas contourner les mécanismes de la Plateforme.\n- Maintenir la confidentialité de ses identifiants.\n- Respecter les obligations légales propres à son activité (formule officielle du loyer initial, autorisation de vendre ou de louer, numéro d'enregistrement de courte durée, information Lex Koller le cas échéant).`,
  },
  {
    id: "propriete",
    title: "11. Propriété intellectuelle",
    content:
      `Les éléments composant la Plateforme (design, textes, code) sont la propriété d'E-Dome ou de ses partenaires. Les Utilisateurs conservent la propriété de leurs contenus et accordent à E-Dome une licence non exclusive, mondiale et gratuite pour leur affichage sur la Plateforme. Pour les agences, E-Dome est sous-traitant des données de leurs clients : ces données restent les leurs et sont exportables.`,
  },
  {
    id: "responsabilite",
    title: "12. Limitation de responsabilité",
    content:
      `E-Dome met tout en œuvre pour assurer la disponibilité et la sécurité de la Plateforme, sans être responsable des interruptions temporaires, des contenus publiés par les Utilisateurs, des litiges entre Utilisateurs, ni de l'exactitude des informations qu'ils fournissent. N'étant partie à aucun contrat conclu entre Utilisateurs, E-Dome ne répond pas de leur exécution.`,
  },
  {
    id: "donnees",
    title: "13. Données, droit applicable et juridiction",
    content:
      `Le traitement des données personnelles est régi par la Politique de Confidentialité. E-Dome respecte la Loi fédérale sur la protection des données (nLPD) et, pour les Utilisateurs de l'Union européenne, le RGPD. Les présentes CGU sont soumises au droit suisse ; à défaut de solution amiable, les tribunaux du canton de Neuchâtel sont compétents. Les CGU peuvent être modifiées ; les modifications prennent effet dès leur publication.`,
  },
];
