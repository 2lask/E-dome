/* ── Les quatre règles inviolables ──────────────────────────────────────────

   Elles sont ici, typées, et non recopiées dans les composants.

   Pourquoi ce module existe. La première version de `DECISIONS.md` consacrait
   une section entière à la règle 3 et ne mentionnait nulle part les règles 1
   et 2 : la règle 3 absorbait toute la protection. C'est une erreur de
   raisonnement, et le fondateur l'a relevée.

   Le partage du travail entre les règles :

   · Les règles 1 et 2 portent le critère de l'**activité** (art. 412 CO).
     C'est le critère qui qualifie le courtage — indiquer une occasion de
     conclure, ou servir d'intermédiaire pour la négociation.
   · La règle 3 porte le critère de la **rémunération** (art. 413 CO, qui
     règle le droit au salaire et ne qualifie rien par lui-même).
   · La règle 4 est hors courtage : elle tient E-Dome à l'écart de la
     réglementation des intermédiaires financiers.

   Conséquence : **un forfait non conditionné versé à quelqu'un qui sert
   d'intermédiaire reste du courtage.** La règle 3, seule, ne protège de rien.
   D'où la garantie que ce module apporte au code : il n'existe aucun moyen
   d'afficher une règle sans les trois autres. `PLATFORM_RULES` est un tuple
   figé, et le composant qui le rend les rend toutes.

   Voir `DECISIONS.md` §1.0 et §1.1, et `JURIDIQUE-A-VALIDER.md` §1. */

export type PlatformRuleId = "mandat" | "negociation" | "remuneration" | "fonds";

export interface PlatformRule {
  id: PlatformRuleId;
  /** Numéro affiché. Correspond à la numérotation de la Partie B. */
  number: 1 | 2 | 3 | 4;
  /** Formulation courte, pour un pied d'écran ou une puce. */
  short: string;
  /** Formulation exacte, pour les conditions générales et le mode explicatif. */
  full: string;
  /** Base invoquée, affichée dans le mode explicatif uniquement. */
  basis: string;
  /** Ce que la règle protège, en une phrase. */
  why: string;
}

/**
 * Les quatre règles, dans l'ordre de la Partie B.
 *
 * Tuple figé de quatre éléments : le type interdit d'en retirer une sans
 * modifier ce fichier, ce qui est exactement le garde-fou voulu.
 */
export const PLATFORM_RULES: readonly [PlatformRule, PlatformRule, PlatformRule, PlatformRule] = [
  {
    id: "mandat",
    number: 1,
    short: "E-Dome ne signe aucun mandat.",
    full:
      "E-Dome ne signe aucun mandat et n'agit pour le compte d'aucune partie. " +
      "Elle n'est jamais partie aux contrats conclus entre ses utilisateurs.",
    basis: "art. 412 CO — le courtage se définit par l'activité, non par le mode de rémunération",
    why: "Agir pour le compte d'une partie est ce qui fait un courtier, quel que soit le prix pratiqué.",
  },
  {
    id: "negociation",
    number: 2,
    short: "E-Dome ne négocie aucun prix.",
    full:
      "E-Dome ne négocie aucun prix, ne sert d'intermédiaire dans aucune " +
      "négociation et n'indique à personne une occasion de conclure en " +
      "échange d'une rémunération.",
    basis: "art. 412 CO — indiquer une occasion de conclure ou négocier, moyennant salaire",
    why: "C'est l'autre moitié du critère d'activité. Sans elle, la règle 3 ne protège de rien.",
  },
  {
    id: "remuneration",
    number: 3,
    short: "Aucune rémunération conditionnée à une vente ou à un bail.",
    full:
      "E-Dome ne perçoit aucune rémunération dont le montant ou l'exigibilité " +
      "dépend de la conclusion d'une vente ou d'un bail d'habitation ou de " +
      "locaux commerciaux. Ses prix sont fixés à l'avance, dus indépendamment " +
      "du résultat, et identiques pour tous les utilisateurs d'une même formule.",
    basis: "art. 413 CO — le droit au salaire du courtier naît de la conclusion",
    why:
      "Un honoraire de succès trahit l'intérêt au résultat. La formulation couvre " +
      "aussi le forfait conditionné, que la version « jamais un pourcentage » laissait passer.",
  },
  {
    id: "fonds",
    number: 4,
    short: "E-Dome n'est jamais dépositaire des fonds de ses utilisateurs.",
    /* Formulation exacte plutôt que catégorique : « E-Dome ne détient jamais
       les fonds » est vrai ou faux selon le schéma d'encaissement retenu, et
       cet arbitrage est réservé à l'avocat (JURIDIQUE-A-VALIDER.md §2). Cette
       version est vraie dans les deux schémas. */
    full:
      "E-Dome n'est jamais dépositaire des fonds de ses utilisateurs. Les " +
      "paiements sont exécutés par un prestataire agréé. E-Dome ne dispose " +
      "librement d'aucune somme appartenant à un utilisateur, ne verse aucun " +
      "intérêt et ne conserve aucun solde : tout montant destiné à un tiers " +
      "lui est reversé sans délai.",
    basis: "ordonnance sur les banques, art. 5 al. 3 let. c — aucun intérêt, exécution sous 60 jours",
    why: "Détenir des fonds du public exigerait une autorisation d'intermédiaire financier.",
  },
];

/** La règle demandée. Accessoire de lecture — n'autorise pas à l'afficher seule. */
export function platformRule(id: PlatformRuleId): PlatformRule {
  const found = PLATFORM_RULES.find((r) => r.id === id);
  /* Impossible par construction : le type de PLATFORM_RULES couvre les quatre
     identifiants. La garde existe pour que l'erreur soit lisible si le tuple
     et l'union divergeaient un jour. */
  if (!found) throw new Error(`Règle de plateforme inconnue : ${id}`);
  return found;
}
