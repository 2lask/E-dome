# ARCHITECTURE-MODÈLE — la double mécanique d'affiliation, verrouillée par type

*Agent ARCHITECTURE/PRICING. Lecture seule sur le code ; ce fichier est le seul livrable écrit. Sources lues : `src/lib/pricing/{charge,quote,catalog,legacy,index}.ts`, `src/lib/model/{billing,rules,identity,agency}.ts`, `src/lib/demo/{ledger,identity}.ts`, `src/lib/referral-links.ts`, `src/components/affiliate/recommend-button.tsx`, `src/components/feed/{attach-cards,post-viewer}.tsx`, `src/app/(app)/{publier,apporteurs,tarifs,aide}/page.tsx`, `AUDIT-2.md` (thèmes 1 et 4), `DECISIONS-2.md` (D1, D4), `PLAN-2.md`.*

---

## 0. Ce que le modèle actuel fait déjà bien (à ne pas casser)

`quote()` est déjà le point d'entrée unique, `Charge` est déjà un discriminant par **mécanique** (pas par domaine), et le verrou `CommissionPole` exclut déjà `vente`/`location-lt` — exactement le patron que le fondateur redemande pour la prime biens. `assertFlowBalances` vérifie déjà `beneficiary + edomeGross (+ psp si à charge vendeur) === gross`. Le nouveau modèle **réutilise cette machine sans la changer structurellement** pour la prime biens, et l'étend d'un champ pour l'affiliation marketplace. Bonne nouvelle vérifiée en lisant le code : la prime biens se comporte, dans `MoneyFlow`, exactement comme `subscription`/`oneOff` (E-Dome encaisse le brut, puis reverse une part) — aucun changement de l'invariant n'est nécessaire pour elle.

Le point qui casse réellement l'existant : la marketplace. Aujourd'hui `ctx.hasApporteur` + `APPORTEUR_SHARES.commission` prélèvent la part apporteur **sur la part E-Dome** (`edomeGross`), donc le vendeur ne voit jamais son net bouger. Le nouveau mandat dit l'inverse : *« part affilié sortant de la marge du vendeur »*, *« commission E-Dome INCHANGÉE »*, *« second prélèvement »*. C'est un changement de mécanique, pas de taux — `assertFlowBalances` doit apprendre une 4e composante.

---

## A. Les types `Charge` proposés

### A.1 — Biens : `bien-introduction`

```ts
// charge.ts

/**
 * Miroir exact de CommissionPole, dans l'autre sens.
 *
 * CommissionPole EXCLUT vente et location-lt (l'assiette du courtage).
 * BienIntroPole ne contient QUE vente et location-lt. Le double verrou tient
 * dans les deux unions : une commission % ne peut jamais viser un bien
 * (déjà vrai), et une prime bien ne peut jamais viser un pôle marketplace
 * (nouveau — voir §C).
 */
export type BienIntroPole = "vente" | "location-lt";
export const BIEN_INTRO_POLES: readonly BienIntroPole[] = ["vente", "location-lt"];

/**
 * Prime biens, EN CHF, jamais un pourcentage.
 *
 * Type nominal (brand) : aucune valeur `Money` ordinaire — y compris le
 * résultat de `shareOf(prix, taux)` — n'est assignable à `PrimeMoney`. La
 * seule façon d'en obtenir une est `primeChf(montant)` (catalog.ts), qui
 * valide 1–10'000 CHF à la construction. Voir §C pour ce que ça bloque
 * réellement au compilateur, et ses limites.
 */
export type PrimeMoney = Money & { readonly __brand: "prime" };

export type Charge =
  | { kind: "subscription"; planId: PlanId; interval: "month" | "year"; foundingRate?: boolean }
  | {
      kind: "commission";
      pole: CommissionPole;
      gross: Money;
      attribution?: Attribution;
      units?: number;
      foundingRate?: boolean;
      /**
       * NOUVEAU — affiliation marketplace. N'existe QUE sur ce variant :
       * `bien-introduction` n'a pas ce champ (voir §C, verrou 2).
       * Absent = pas d'affilié sur cette vente. `rate` est le taux appliqué
       * au PRIX (gross), jamais à la commission E-Dome — voir §B.2.
       */
      affiliation?: { rate: number; apporteurId: AccountId };
    }
  | { kind: "oneOff"; productId: OneOffId; quantity?: number }
  | { kind: "cpm"; campaignId: string; impressions: number }
  | { kind: "bounty"; event: "host-activated" | "user-activated" }
  | {
      /* NOUVEAU — prime fixe biens (vente + location-lt). */
      kind: "bien-introduction";
      pole: BienIntroPole;
      /** Prime fixée par le vendeur/bailleur à l'activation de /publier. */
      prime: PrimeMoney;
      /** Qui a introduit l'acheteur/locataire — D4 : cible de l'écriture crédit. */
      apporteurId: AccountId;
      /** Vendeur/bailleur qui paie la prime — D4 : cible de l'écriture débit. */
      payerId: AccountId;
      /** La mise en relation ACCEPTÉE qui déclenche la prime (AssistanceProposal.id
          ou équivalent pour un apport direct hors demande d'accompagnement). */
      triggerId: string;
    };
```

Remarque sur `payerId`/`apporteurId` : ce sont des `AccountId` (annuaire D1), pas des noms ni des objets `User` embarqués — cohérent avec ce que D1 impose déjà pour `Property.host` etc. C'est ce qui permet à D4 (§E) d'écrire directement au journal sans un second lookup.

### A.2 — Abonnements : pas de nouveau `Charge`

Le variant `subscription` ne change pas de forme. Ce qui change, c'est que `APPORTEUR_SHARES` (catalog.ts) perd ses clés `commission` et `oneOff` et ne garde que `subscription` — voir §D.

---

## B. `quote()` / `MoneyFlow` — le flux « à l'intérieur de l'annoncé »

### B.1 — `MoneyFlow` étendu d'un champ

```ts
export interface MoneyFlow {
  gross: Money;
  psp: Money;
  pspBornBy: "seller" | "platform";
  edomeGross: Money;
  /** Prélevée SUR LA PART E-DOME : abonnement, forfait, PRIME bien-introduction. */
  apporteur: Money;
  /**
   * NOUVEAU — prélevée SUR LA MARGE VENDEUR, distincte de la commission
   * E-Dome. UNIQUEMENT non-nulle sur une commission marketplace avec
   * `affiliation`. Zéro partout ailleurs, y compris bien-introduction (qui
   * utilise `apporteur`, pas `affiliate` — les deux mécaniques ne se
   * mélangent jamais sur un même Charge).
   */
  affiliate: Money;
  edomeNet: Money;
  beneficiary: Money;
}
```

Pourquoi deux champs et pas un seul `apporteur` réutilisé : le sens de la phrase doc change selon la mécanique (« prélevée sur la part E-Dome » vs « prélevée sur la marge vendeur »), et un panneau de flux d'argent qui affiche une ligne « Apporteur » unique sur les deux pôles mentirait sur QUI la finance. Le thème 4 de `AUDIT-2.md` existe précisément parce qu'un même libellé a fini par recouvrir des calculs différents. Deux champs, deux invariants, deux phrases d'explication — jamais une phrase générique qui devine.

### B.2 — Flux prime biens (`bien-introduction`)

```
prime = netApporteur + partE-Dome        (invariant local à la prime)
edomeGross = prime                        (E-Dome encaisse d'abord, comme un abonnement)
partE-Dome = min(prime, max(shareOf(prime, EDOME_PRIME_SHARE), PRIME_FLOOR))
apporteur  = prime − partE-Dome
edomeNet   = partE-Dome
beneficiary = ZERO   (le vendeur/bailleur est le PAYEUR ici, pas un bénéficiaire :
                       aucun tiers ne reçoit une part de la prime elle-même)
psp = ZERO par défaut — OUVERT, voir §Désaccords : la prime est-elle prélevée par
      carte (frais PSP à absorber par E-Dome, comme pspBornBy="platform" pour les
      abonnements) ou par un mandat de prélèvement déjà géré ailleurs ?
```

`assertFlowBalances` existant (`beneficiary + edomeGross (+ psp si seller) === gross`) **passe sans modification** : `0 + prime = prime`. `apporteur`/`edomeNet` restent des sous-répartitions internes à `edomeGross`, exactement comme pour `subscription` aujourd'hui — c'est pour ça qu'aucun changement de l'invariant n'est nécessaire ici, seulement pour la marketplace (§B.3).

Clamp obligatoire (`min(prime, …)`) : avec `PRIME_MIN = 1 CHF` et `PRIME_FLOOR = 3 CHF`, une prime de 1 ou 2 CHF donnerait un `partE-Dome` (3 CHF) supérieur à la prime elle-même sans le clamp — `apporteur` deviendrait négatif. Signalé aussi en §Désaccords : je recommande de remonter `PRIME_MIN` à 20 CHF plutôt que de compter sur le clamp en permanence (une prime à 1 CHF n'a de toute façon aucun sens économique pour personne).

```ts
function quoteBienIntroduction(charge: Extract<Charge, { kind: "bien-introduction" }>): Quote {
  const edomeShare = money(
    Math.min(
      charge.prime.cents,
      Math.max(Math.round(charge.prime.cents * EDOME_PRIME_SHARE), PRIME_FLOOR.cents),
    ),
  );
  const apporteur = subtractMoney(charge.prime, edomeShare);

  return {
    payer: "proprietaire",
    payerTotal: charge.prime,
    lines: [
      { labelKey: `bienIntro.${charge.pole}`, amount: charge.prime },
      { labelKey: "primeApporteur", amount: apporteur },
    ],
    flow: {
      gross: charge.prime,
      psp: ZERO,
      pspBornBy: "platform",
      edomeGross: charge.prime,
      apporteur,
      affiliate: ZERO,
      edomeNet: edomeShare,
      beneficiary: ZERO,
    },
    explanation:
      `Prime fixe de ${formatMoney(charge.prime)}, due à la mise en relation acceptée — ` +
      `jamais un pourcentage du prix du bien. E-Dome retient ${formatMoney(edomeShare)}, ` +
      `l'apporteur reçoit ${formatMoney(apporteur)}.`,
  };
}
```

### B.3 — Flux marketplace affiliée (`commission` + `affiliation`)

```
prix (gross) = beneficiaireNet + affilié + commissionEdome + psp(si vendeur)

commissionEdome = RATES/SELLER_SOURCED/PLATFORM_SOURCED (INCHANGÉ — même calcul qu'aujourd'hui)
affilié          = shareOf(gross, affiliation.rate)        (sur le PRIX, pas sur la commission)
beneficiaireNet  = gross − commissionEdome − affilié (− psp si à charge vendeur)
```

```ts
function quoteCommission(charge: Extract<Charge, { kind: "commission" }>, ctx?: QuoteContext): Quote {
  // … calcul de edomeGross INCHANGÉ (rate, unitsFee, plancher MIN_COMMISSION) …

  const affiliate = charge.affiliation
    ? shareOf(charge.gross, charge.affiliation.rate)
    : ZERO;

  const psp = pspFee(charge.gross);
  const beneficiary =
    PSP.bornBy === "seller"
      ? subtractMoney(subtractMoney(subtractMoney(charge.gross, edomeGross), affiliate), psp)
      : subtractMoney(subtractMoney(charge.gross, edomeGross), affiliate);

  // edomeGross/edomeNet ne bougent PAS à cause de l'affiliation — c'est le
  // point central du mandat : « commission E-Dome INCHANGÉE ».
  const edomeNet = PSP.bornBy === "platform" ? subtractMoney(edomeGross, psp) : edomeGross;

  return {
    // …
    flow: { gross: charge.gross, psp, pspBornBy: PSP.bornBy, edomeGross, apporteur: ZERO, affiliate, edomeNet, beneficiary },
    // …
  };
}
```

`assertFlowBalances` doit apprendre la 4e composante :

```ts
function assertFlowBalances(flow: MoneyFlow): void {
  if (flow.gross.cents === 0) return;
  const parts =
    flow.pspBornBy === "seller"
      ? flow.beneficiary.cents + flow.edomeGross.cents + flow.affiliate.cents + flow.psp.cents
      : flow.beneficiary.cents + flow.edomeGross.cents + flow.affiliate.cents;
  if (parts !== flow.gross.cents) throw new Error(/* … */);
}
```

C'est le seul changement à la fonction d'invariant elle-même — un ajout, pas une réécriture. `bien-introduction` passe `affiliate: ZERO` donc son calcul (§B.2) reste correct sans y toucher.

---

## C. Le verrou par type

### Verrou 1 — « prime en % du prix du bien » ne compile pas

```ts
const priceOfProperty = chf(1_250_000); // property.price
const prime = shareOf(priceOfProperty, 0.03); // Money ordinaire, PAS PrimeMoney

quote({
  kind: "bien-introduction",
  pole: "vente",
  prime, // ❌ Type 'Money' is not assignable to type 'PrimeMoney'.
         //    Property '__brand' is missing in type 'Money' but required in type 'PrimeMoney'.
  apporteurId, payerId, triggerId,
});
```

La seule façon de fournir `prime` est `primeChf(n)` :

```ts
export function primeChf(amountChf: number): PrimeMoney {
  if (amountChf < PRIME_MIN || amountChf > PRIME_MAX) {
    throw new Error(`Prime hors bornes : ${amountChf} CHF (attendu ${PRIME_MIN}–${PRIME_MAX}).`);
  }
  return chf(amountChf) as PrimeMoney; // seul point du code qui a le droit de fabriquer un PrimeMoney
}
```

Ce que ce verrou bloque réellement, honnêtement : il rend **impossible de réutiliser tel quel** le chemin de code que tout développeur connaît déjà (`shareOf(gross, rate)`, utilisé partout ailleurs dans `quote.ts`) — c'est la vraie source de risque, pas une frappe malveillante. Ce qu'il ne peut PAS bloquer par construction : `primeChf(Math.round(property.price * 0.03 / 100))` — TypeScript ne peut pas voir qu'un `number` a été dérivé d'un prix par une multiplication ; aucun système de types structurel ne le peut. La borne `[1, 10'000]` rattrape presque tous les cas réels : 3 % d'un bien suisse moyen (500 k–3 M CHF) fait 15'000–90'000 CHF, très au-dessus du plafond — `primeChf()` lève une exception immédiatement, à la construction du `Charge`, pas au premier rendu. C'est le même choix que `assertFlowBalances` : throw au développement plutôt qu'un panneau faux en démo.

### Verrou 2 — « affiliation sur un bien » ne compile pas

```ts
quote({
  kind: "bien-introduction",
  pole: "vente",
  prime: primeChf(450),
  affiliation: { rate: 0.1, apporteurId }, // ❌ Object literal may only specify known
                                            //    properties, and 'affiliation' does not
                                            //    exist in type '{ kind: "bien-introduction"; … }'.
  apporteurId, payerId, triggerId,
});
```

Ça marche parce que `affiliation` n'existe QUE sur le variant `commission` du discriminant `Charge` — la vérification des propriétés en excès de TypeScript s'applique aux littéraux d'objet passés directement (c'est la façon dont `quote()` est appelé partout dans ce dépôt aujourd'hui). **Limite à documenter** : si un jour du code construit le `Charge` via un spread (`{ ...base, affiliation: x }`) plutôt qu'un littéral direct, la vérification saute — TypeScript élargit le type de l'objet issu d'un spread. Recommandation : n'exposer la construction de `bien-introduction` et de `commission`-affiliée que par deux fonctions fabriques dédiées (`bienIntroductionCharge(...)`, `affiliatedCommissionCharge(...)`) plutôt que de laisser les composants construire le littéral eux-mêmes — ça centralise le point de vérification et évite que le contournement soit tentant.

### Verrou 3 (rappel, déjà en place, inchangé) — la marketplace ne peut pas viser un bien, et réciproquement

```ts
quote({ kind: "commission", pole: "vente", gross: chf(500_000) });
// ❌ déjà vrai aujourd'hui : 'vente' n'est pas assignable à CommissionPole

quote({ kind: "bien-introduction", pole: "formation", prime: primeChf(80), /* … */ });
// ❌ NOUVEAU, symétrique : 'formation' n'est pas assignable à BienIntroPole
```

---

## D. Ce que ça touche

### Fichiers pricing (le cœur)

- **`charge.ts`** — ajoute `BienIntroPole`, `BIEN_INTRO_POLES`, `PrimeMoney`, le variant `bien-introduction`, le champ `affiliation?` sur `commission`.
- **`catalog.ts`** — ajoute `EDOME_PRIME_SHARE = 0.15`, `PRIME_FLOOR = chf(3)`, `PRIME_MIN = 1`, `PRIME_MAX = 10_000`, `primeChf()` ; ajoute une fourchette `AFFILIATION_RATES: Partial<Record<CommissionPole, Rate>>` pour le taux marketplace (**valeurs non données par le mandat — voir Désaccords**) ; **retire** `APPORTEUR_SHARES.commission` et `APPORTEUR_SHARES.oneOff`, garde `APPORTEUR_SHARES.subscription` seul (ou en fait un `Rate {min:.10,max:.30}` si le fondateur veut vraiment une fourchette — aujourd'hui c'est un `0.25` fixe malgré `APPORTEUR_SHARE_LABEL = "10 à 30 %"`, incohérence préexistante non causée par ce chantier mais visible en touchant ce fichier).
- **`quote.ts`** — ajoute `quoteBienIntroduction()` ; modifie `quoteCommission()` (nouvelle ligne `affiliate`, `edomeGross`/`edomeNet` inchangés par construction) ; modifie `assertFlowBalances()` (+`affiliate.cents`) ; ajoute le case `bien-introduction` dans `build()`.
- **`legacy.ts`** — **retiré en entier** (déjà prévu, étape 0 de PLAN-2, thème 4 de l'audit). Le nouveau modèle en est une raison supplémentaire : `estimateEarning()` calcule depuis un `price` de bien, ce que `bien-introduction` interdit structurellement — le garder à côté du nouveau modèle réintroduirait exactement la contradiction du thème 4 (deux moteurs, deux chiffres).
- **`index.ts`** — retire `export * from "./legacy"`.

### Le type `Property` (hors pricing, mais requis par la prime)

Aujourd'hui `RecommendButton`/`AffiliateBadge`/`attach-cards.tsx`/`post-viewer.tsx` appellent `estimateEarning(kind, price, …)` avec le **prix du bien** — c'est précisément le mécanisme que la prime doit remplacer, pas seulement le moteur de calcul en dessous. Il faut un endroit où vit le **budget prime** que le vendeur fixe à l'activation :
- `src/lib/types.ts` — `Property` gagne un champ optionnel, ex. `introBudget?: PrimeMoney` (absent = apporteurs non activés sur ce bien).
- `src/lib/types.ts` — `ReferralTarget` (utilisé par `ReferralLink.target`) doit porter `prime?: Money` à côté de `price?: number` pour `kind: "bien"`, distinct du prix affiché.
- `referral-links.ts` — `buildObjectAffiliate()` et `AFFILIATE_CONFIG.bien` doivent lire `property.introBudget`, pas `property.price`.

### Écrans

- **`/publier`** — l'étape « Apporteurs d'affaires » (`publier/page.tsx:470-555`) est réécrite : au lieu du calcul actuel (`edomeRevenue = (base.min+base.max)/2` puis `APPORTEUR_SHARE.min/max` de ce revenu — le barème 500/2500 aboli), l'activation devient **« faites-vous amener des acheteurs » : une carte + un champ budget** (1–10'000 CHF, `primeChf()` valide la borne côté formulaire aussi). **Rien n'est prélevé à l'activation** — le budget n'est qu'un plafond/montant déclaré, la prime n'est due qu'à la mise en relation acceptée (§A.1, `triggerId`). Concerne uniquement les biens `vente`/`location-lt` ; les autres types de publication (service, formation, live…) restent sur le modèle marketplace existant, inchangé dans son squelette.
- **`/apporteurs`** (`page.tsx:95-119, 263, 286, 452, 467`) — toute la copie « 10–30 % du frais plateforme » / « part prélevée sur E-Dome » pour la carte « Amener un bien » est **fausse sous le nouveau modèle** et doit être réécrite : l'apporteur touche la **majorité** de la prime (85 % ou prime−3 CHF), ce n'est plus « une part minoritaire du revenu E-Dome ». Les cartes « Amener un client » (marketplace) et « Amener un hôte » (bounty, hors mandat) gardent leur mécanique ; seule la carte biens change de nature.
- **`/tarifs`** — si la page affiche `APPORTEUR_SHARE_LABEL` de façon uniforme tous pôles confondus, elle doit désormais distinguer trois régimes (biens = prime fixe affichée en CHF, pas en %; marketplace = affiliation, second prélèvement, taux propre ; abonnements = 10–30 % du revenu E-Dome, inchangé).
- **`/aide`** (`page.tsx:39`) — la FAQ « Qui paie la part de l'apporteur ? » répond aujourd'hui de façon universelle (« prélevée sur ce qu'E-Dome encaisse déjà ») — vrai pour abonnement et prime biens (côté E-Dome), **faux** pour la marketplace affiliée (côté marge vendeur). Réponse à scinder par mécanique.
- **Boutique et fiches produits marketplace** (`boutique/[id]`, `boutique/vendre`, fiches formation/live/service/événement) — branchent `commission.affiliation` quand un lien d'affiliation est actif ; la commission E-Dome affichée ne bouge pas, une ligne « part affilié » distincte apparaît dans le panneau de flux, prélevée sur ce qui restait au vendeur.
- **`recommend-button.tsx` / `attach-cards.tsx` / `post-viewer.tsx`** — remplacent l'appel à `estimateEarning(kind, price, …)` par : `quote({kind:"bien-introduction", prime: property.introBudget, …}).flow.apporteur` pour un bien, `quote({kind:"commission", pole, gross: price, affiliation: {rate, apporteurId}}).flow.affiliate` pour la marketplace. Le bouton doit gérer le cas `introBudget` absent (apporteurs désactivés sur ce bien → bouton inactif ou masqué, pas un calcul à 0 silencieux).

---

## E. Lien avec l'annuaire (D1) et l'argent par `ownerId` (D4)

`bien-introduction` porte déjà `apporteurId` et `payerId` comme `AccountId` — pas de `User` embarqué, conforme à D1. Deux écritures de journal (`Entry` de `demo/ledger.ts`, étendu par D4 avec `ownerId`) par prime payée :

```
Entry { ownerId: payerId,     source: "biens" /* ou nouvelle source "primes-biens" */, gross: -prime,      status, subject: {kind:"property", id} }
Entry { ownerId: apporteurId, source: "apporteurs",                                     gross: +apporteur, status, subject: {kind:"referral", id: triggerId} }
Entry { ownerId: "edome" (ou omis, agrégat plateforme), source: "apporteurs", gross: +edomeShare, … }
```

Pour l'affiliation marketplace, même schéma à trois écritures sur la vente sous-jacente (le vendeur déjà débité de sa commission E-Dome voit une seconde ligne de débit `affiliate`, l'apporteur une ligne de crédit). `LedgerSource` (`demo/ledger.ts:41-48`) gagne potentiellement une valeur dédiée si le fondateur veut distinguer « prime bien » de « bounty » dans les filtres — actuellement `"apporteurs"` couvre déjà les deux dans `REFERRALS[]`, ça reste cohérent de les y garder tant que `subject.kind: "referral"` + `triggerId` permettent de les redistinguer à l'affichage.

Le générateur déterministe de `ledger.ts` (`REFERRALS[]`, ligne 162-169) utilise aujourd'hui un champ `edomeRevenue` (le revenu qu'E-Dome encaisse, dont la part apporteur se dérive à l'affichage via `quote()`) — ce patron reste juste pour la marketplace (`gross` = ce qu'E-Dome encaisse), mais pour une prime bien il faudrait soit ajouter un jeu de données démo séparé portant `prime` directement (puisque `quote({kind:"bien-introduction",...})` a besoin de la prime, pas du revenu E-Dome, pour calculer le flux), soit dériver `prime` depuis `edomeShare` en inversant `EDOME_PRIME_SHARE`/`PRIME_FLOOR` — plus fragile. Je recommande un jeu de données démo dédié (`BIEN_INTRO_REFERRALS`) plutôt qu'une inversion de formule.

---

## F. Intégration dans PLAN-2

**Le modèle pricing doit précéder l'étape 2 (l'argent par owner), pas la suivre**, et il doit suivre l'étape 1 (l'annuaire) sans nécessairement l'attendre entièrement — détail ci-dessous.

- **Dépendance dure sur D1/étape 1** : `bien-introduction` référence `apporteurId`/`payerId` en `AccountId`. Tant que l'annuaire n'est pas unifié (thème 1 de l'audit — sept annuaires, `user-007` = deux personnes selon le fichier), un `AccountId` n'est pas fiable : la prime pourrait créditer la mauvaise personne. **Le modèle de types peut être écrit et compilé avant l'étape 1** (rien dans `charge.ts`/`catalog.ts`/`quote.ts` ne dépend de `demo/identity.ts`), mais **les écrans qui le consomment avec de vraies données** (`/apporteurs`, `/publier`, les boutons Recommander) ne peuvent être branchés sérieusement qu'après l'annuaire.
- **Dépendance dure inverse avec D4/étape 2** : D4 dit « `ownerId` sur `Entry`, invariants bouclés par owner ». Les écritures de §E ne peuvent être ajoutées au journal qu'une fois `ownerId` existe sur `Entry` — donc **le nouveau moteur pricing (types + `quote()`) est un prérequis de l'étape 2**, pas un aval : l'étape 2 a besoin de `quote({kind:"bien-introduction",…}).flow` pour générer des écritures cohérentes, et de la 4e composante `affiliate` pour que les invariants « bouclés par owner » de la marketplace tombent juste.

**Conséquence sur PLAN-2 — une étape à insérer, pas une réécriture des étapes existantes :**

- **Nouvelle étape 1.5 — « Le modèle pricing à deux mécaniques » [ce document]**, entre l'étape 1 (annuaire) et l'étape 2 (argent par owner) actuelles de PLAN-2 :
  - `charge.ts`/`catalog.ts`/`quote.ts` : les ajouts de type ci-dessus (peut démarrer en parallèle de la fin de l'étape 1, aucune dépendance de compilation).
  - Suppression de `legacy.ts` et de ses quatre appelants (`recommend-button`, `attach-cards`, `post-viewer`, `/publier`) — **déjà prévu à l'étape 0 de PLAN-2** (« Retirer le barème aboli ») : cette étape 0 doit maintenant retirer `legacy.ts` **vers** le nouveau moteur (bien-introduction + affiliation), pas vers un vide temporaire, sans quoi les quatre appelants cassent avant que le remplacement existe. Je recommande de **fusionner l'étape 0 « retrait du barème » avec cette étape 1.5**, plutôt que de les traiter comme deux passes séparées sur les mêmes quatre fichiers.
  - `types.ts` : `Property.introBudget`, `ReferralTarget.prime`.
- **Étape 2 (argent par owner)** telle que déjà planifiée, mais sa description doit désormais mentionner explicitement : « les écritures de prime bien et d'affiliation marketplace utilisent `quote().flow` (étape 1.5), jamais un calcul local » — sinon le risque du thème 4 (deux moteurs) revient par la porte de derrière au moment où quelqu'un implémente vite `/dashboard/apporteurs`.
- **Étape 3 (trois premiers profils)** : si Sophie/Marc/Jean-Luc ont des biens avec apporteurs actifs dans leur histoire, leurs fiches doivent déjà porter `introBudget` — donc l'étape 1.5 doit être terminée avant l'étape 3, pas seulement avant l'étape 2. Ça ne change pas l'ordre déjà prévu (1→2→3), juste la définition de « fait » à l'étape 2.
- **Étape 6 (Boutique en affiliation, D5)** : D5 dit déjà « rémunération suit le modèle, payée par le marchand, jamais un pourcentage marketplace ajouté à l'acheteur » — c'est très exactement `commission.affiliation` de ce document. Étape 6 doit référencer ce fichier plutôt que réinventer son propre calcul d'affiliation boutique.
- **Étape 8 (finitions)** : ajouter aux tests neufs déjà listés (« invariants d'argent par owner ») un test spécifique : aucune prime bien ne doit jamais provenir de `shareOf(price, …)` — au minimum un test qui construit un `Charge bien-introduction` avec un `prime` dérivé d'un prix de bien réaliste et vérifie que `primeChf()` lève (couvre le cas où quelqu'un contourne le brand via `as PrimeMoney` en dur, ce qu'aucun verrou de compilateur ne peut empêcher).

---

## Désaccords et points ouverts (à trancher par le fondateur/comptable, pas par moi)

1. **PSP sur la prime biens** — absorbé par E-Dome (comme les abonnements, `pspBornBy: "platform"`) ou par un canal de paiement différent (mandat, virement) hors PSP carte ? J'ai posé `psp: ZERO` par défaut ; à confirmer.
2. **`PRIME_MIN = 1 CHF`** est dans le mandat mais produit un cas limite (`apporteur` clampé à 0 sous 3 CHF de prime) qui n'a aucun sens commercial. Je recommande `PRIME_MIN = 20 CHF` et le garde-fou de clamp en filet de sécurité, pas en mécanisme normal.
3. **Fourchette du taux d'affiliation marketplace** (`AFFILIATION_RATES`) — le mandat dit « taux % du prix », mais ne donne aucun chiffre ni règle de variation par pôle (contrairement à `RATES` qui a sa justification par pôle, §catalog.ts). Sans borne haute explicite, un vendeur pourrait promettre 100 % de son prix à un affilié et vider sa propre marge — recommandé : une borne haute dans `catalog.ts` (ex. un `Rate` par pôle, comme `RATES`), pas un `number` libre sur le `Charge`.
4. **`oneOff`/`cpm` hors des trois familles du mandat** — le mandat couvre biens/marketplace/abonnements, mais `APPORTEUR_SHARES.oneOff` est aujourd'hui aussi utilisé par `quoteOneOff()` (forfaits mise-en-avant, dossier de vente…) et `quoteCpm()` (publicité). Ni bien ni marketplace au sens strict (E-Dome est elle-même le vendeur, pas un tiers dont la marge se partage). J'ai proposé de garder ces deux cas sur l'ancienne mécanique « part carvée sur `edomeGross` » (comme `subscription`), faute d'indication contraire — à confirmer explicitement, sinon `oneOff`/`cpm` se retrouvent avec un apporteur non rémunéré du jour au lendemain, ce qui casse une promesse déjà affichée sur `/apporteurs`.
5. **Incohérence préexistante non liée à ce chantier** mais visible en touchant `catalog.ts` : `APPORTEUR_SHARES.subscription` est un `0.25` fixe alors que `APPORTEUR_SHARE_LABEL`/toute la copie produit affichent « 10 à 30 % ». Signalé, pas résolu ici — hors périmètre de ce mandat.
