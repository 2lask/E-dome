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

   PRIME DE MISE EN RELATION vs COMMISSION (D14). Le garde-fou de la règle 3
   — « E-Dome ne perçoit aucune rémunération conditionnée à la conclusion » —
   vise la **commission de succès d'une agence** sur une vente ou un bail
   immobilier. Il ne vise **pas** la prime de mise en relation biens : fixe, en
   francs, due à l'acceptation du contact et **indépendante de la conclusion**,
   elle ne dépend d'aucune vente ni d'aucun bail, donc **n'est pas une
   commission**. Qu'E-Dome en retienne une part (un service facturé à un
   apporteur — activité libre en Suisse) ne la fait pas entrer dans le champ de
   la règle 3. Les deux ne doivent jamais être confondues : c'est l'objet de la
   distinction rendue explicite ici, dans les CGU et le glossaire.

   Voir `DECISIONS.md` §1.0 et §1.1, `DECISIONS-2.md` §D14, et
   `JURIDIQUE-A-VALIDER.md` §1. */

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
    short: "Aucune commission sur le prix de vente ou le loyer.",
    /* Commission v2 (lancement du 25.11.2026) : la règle dit ce qui est VRAI.
       E-Dome ne prend rien sur le prix ; sa seule rémunération sur les biens
       est une part de la commission d'apport, due seulement si celle-ci l'est.
       Que cette part, liée à la conclusion, laisse E-Dome hors du champ du
       courtage est la question n°1 soumise à l'avocat
       (JURIDIQUE-A-VALIDER.md). */
    full:
      "E-Dome ne perçoit aucune commission sur le prix d'une vente ni sur un " +
      "loyer, et ne facture aucun frais d'annonce. Sur les biens, sa seule " +
      "rémunération est une part de 12 % (3 CHF au minimum) de la commission " +
      "d'apport convenue entre le vendeur et l'apporteur : cette part n'est due " +
      "que si la commission l'est, elle est comprise dans celle-ci et n'est " +
      "jamais ajoutée au prix payé par l'acheteur ou le locataire.",
    basis: "art. 412 ss CO — la commission d'apport est un courtage d'indication convenu entre le vendeur et l'apporteur",
    why:
      "Transparence : le vendeur connaît d'avance ce que touche E-Dome, l'acheteur ne paie rien de plus, " +
      "et aucune vente sans apporteur ne rapporte quoi que ce soit à E-Dome.",
  },
  {
    id: "fonds",
    number: 4,
    short: "E-Dome n'est jamais dépositaire des fonds de ses utilisateurs.",
    full:
      "E-Dome n'est jamais dépositaire des fonds de ses utilisateurs. La " +
      "commission d'apport est payée directement par le vendeur à l'apporteur " +
      "(TWINT, virement) ; seule la part E-Dome est versée à E-Dome. E-Dome ne " +
      "dispose librement d'aucune somme appartenant à un utilisateur, ne verse " +
      "aucun intérêt et ne conserve aucun solde pour le compte d'un tiers.",
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
