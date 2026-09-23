# Architecture technique — note de l'agent

Périmètre : modèle de données, structure, dette technique. Tout est vérifié dans
le dépôt, branche `feat/plateforme-v2`. Les conventions Next citées viennent de
`node_modules/next/dist/docs/` (Next 16.3.4), jamais de mémoire.
`analyse/juridique.md` **n'existe pas** quand j'écris — `analyse/` ne contient
que `marketing.md` : je livre donc les champs de conformité en optionnel, nommés
d'après B.6 (§1.4), et je dis §8 ce que j'accepterai d'en changer.

**Les cinq décisions que je demande au CEO de trancher dans mon sens :**

1. Le rôle éclate en trois axes — capacité de plateforme, métier de prestataire,
   appartenance à une agence. Pas une union de 13 chaînes élargie à 15.
2. `pricing.ts` change de signature **avant** tout écran neuf : sa seule porte,
   `edomeRevenue(pole, price)`, suppose une transaction avec un prix, alors qu'un
   abonnement a un plan, une période et un titulaire.
3. Les formules d'abonnement sont des lignes d'un tableau, jamais des variantes
   d'un type. Marketing peut alors en demander quatre.
4. Un seul journal d'écritures pour la démo, agrégats dérivés, invariants levés à
   l'import — donc `next build` échoue si deux chiffres divergent.
5. `/feed` est découpé avant le premier écran neuf, pas après.

---

## 1. Le modèle de données

`src/lib/types.ts` (365 l.) mélange rôles, biens, social, messagerie et tableau
de bord. Il devient `src/lib/model/` — `identity`, `agency`, `billing`,
`feature`, `catalog`, `compliance` — et `types.ts` survit en coquille de
ré-exports dépréciés, sinon l'étape 1 casse tout le dépôt d'un coup.

### 1.1 Les rôles — trois axes

`types.ts:3-16` liste 13 chaînes où cohabitent des capacités (`agence`,
`apporteur`, `admin`) et des métiers (`photographe`, `architecte`, `notaire`,
`promoteur`). Élargir cette union ne résout rien : le code continuerait à
demander « quel rôle ? » là où la question est « quel droit, dans quelle
agence ? ».

```ts
// model/identity.ts
/** Capacité sur la plateforme. Aligné B.5, exactement 11 valeurs. */
export type PlatformRole =
  | "visiteur" | "particulier" | "proprietaire" | "agent" | "agence"
  | "prestataire" | "createur" | "hote" | "apporteur" | "annonceur" | "admin";

/** Métier d'un prestataire — PAS un rôle : un notaire et un photographe ont les
    mêmes droits, ils vendent autre chose. `courtier` quitte les rôles et devient
    un métier détenu par une agence ; jamais par E-Dome (B.2.1). */
export type ProviderTrade = "photographe" | "home-staging" | "architecte"
  | "notaire" | "promoteur" | "courtage" | "diagnostic" | "conciergerie";

/** Rôle détenu, daté, porté ou non par un abonnement, et dont la PORTÉE compte :
    `agent` n'existe qu'au sein d'une agence. */
export interface RoleGrant {
  role: PlatformRole;
  scope?: { kind: "agency"; agencyId: AgencyId };
  grantedAt: string; subscriptionId?: SubscriptionId;
  status: "active" | "suspended" | "revoked";
}

export interface Account {
  id: AccountId; firstName: string; lastName: string; email: string; avatar: string;
  /** Cumulables — c'est B.5. Au moins un grant, toujours. */
  grants: RoleGrant[];
  /** Rôle sous lequel l'interface se présente : une VUE, pas un droit. Le
      sélecteur « voir la plateforme en tant que… » n'écrit que ceci. */
  viewingAs: PlatformRole;
  trades?: ProviderTrade[];
  verification: VerificationState; consents: Consent[];
  /** Décide ce que le programme apporteur autorise (B.3) : Suisse tout,
      FR et AE apport immobilier coupé, reste bloqué. */
  residence: { country: CountryCode; canton?: string };
}
```

Découpler `grants` de `viewingAs` rend le sélecteur honnête : changer de vue ne
donne pas de droit. `context.tsx:122` porte déjà `activeRole`, qui devient
`viewingAs`. Au passage, `context.tsx:137` fait `setActiveRoleState(storedRole as
Role)` sans valider : un `localStorage` contenant `"courtier"` produira un rôle
inexistant après le renommage.

### 1.2 L'agence, ses agents, leurs droits

```ts
// model/agency.ts
export interface Agency {
  id: AgencyId; name: string;
  slug: string;    // sous-domaine vendu dans la formule haute
  ide: IdeNumber;  // une agence est vérifiée niveau 2 ou n'existe pas
  subscriptionId: SubscriptionId | null; members: AgencyMember[];
}

export type AgencyPermission =
  | "listing:create" | "listing:publish" | "listing:assign"
  | "client:read" | "client:write" | "mandate:read" | "mandate:sign"
  | "document:upload" | "visit:schedule"
  | "stats:read" | "team:manage" | "billing:manage";

export interface AgencyMember {
  accountId: AccountId;
  seat: "owner" | "manager" | "agent" | "assistant";
  permissions: AgencyPermission[];   // droits effectifs ; `seat` = préréglage affiché
  /** Attribution des biens et des clients (B.3, Espace agence). */
  assignedListingIds: string[]; assignedClientIds: string[];
  status: "invited" | "active" | "suspended";
}

export interface Mandate {
  id: MandateId; agencyId: AgencyId; listingId: string; clientId: AccountId;
  kind: "vente" | "location-lt" | "gerance";
  exclusivity: "exclusif" | "simple"; signedAt: string | null;
  /** Commission de l'AGENCE : affichage et suivi seulement. E-Dome n'en prélève
      aucune part et n'est jamais partie au mandat (B.2.1 et 3). */
  agencyCommission: { rate: number; basis: "prix-de-vente" | "loyer-annuel" };
  documents: DocumentRef[]; visits: VisitSlot[];
}

export interface VisitSlot {
  id: string; mandateId: MandateId; agentId: AccountId; start: string; end: string;
  attendees: { accountId?: AccountId; name: string }[];
  status: "proposee" | "confirmee" | "honoree" | "annulee";
}

export interface DocumentRef {
  id: string; label: string; uploadedAt: string; uploadedBy: AccountId;
  kind: "mandat" | "bail" | "diagnostic" | "piece-identite"
      | "autorisation-proprietaire" | "formule-loyer" | "autre";
  /** Sous-traitance : la donnée reste celle de l'agence, exportable (B.6). Ce
      champ rend l'export par agence écrivable sans requête transverse. */
  controller: { kind: "agency"; agencyId: AgencyId };
}
```

### 1.3 Abonnements et statuts de fonctionnalité

```ts
// model/billing.ts
export type PlanId = string;   // volontairement string : §2.3, catalogue = donnée

export interface Subscription {
  id: SubscriptionId; planId: PlanId;
  /** Une agence s'abonne, un particulier s'abonne : pas le même titulaire. */
  holder: { kind: "agency"; agencyId: AgencyId } | { kind: "account"; accountId: AccountId };
  interval: "month" | "year";
  currentPeriod: { start: string; end: string };
  status: "trialing" | "active" | "past_due" | "canceled" | "paused";
  /** Montant réellement appliqué : un tarif fondateur gelé se lit ICI, pas dans
      un plan dupliqué (voir §8, désaccord marketing). */
  unitAmount: Money; cancelAt?: string;
  apporteurCode?: string;   // apporteur crédité sur ce qu'E-Dome encaisse
}

// model/feature.ts — élargit `PoleAvailability` (content/landing.ts:34) du 3e
// palier exigé Partie C. `landing.ts` garde son alias, donc ses 7 pôles et les
// 18 composants de `/` compilent inchangés.
export type FeatureStage = "launch" | "later" | "vision";
export interface FeatureEntry {
  id: string; stage: FeatureStage;
  /** Affiché au clic sur une fonctionnalité future (Partie C). */
  explains: { what: string; who: string; revenue: string; when: string };
}
```

### 1.4 Les champs que le droit impose

Optionnels, nommés d'après B.6, livrés sans attendre la note juridique : ajouter
un champ obligatoire plus tard impose de retoucher toutes les données de démo,
réserver la place coûte une ligne.

```ts
// model/compliance.ts
export type IdeNumber = string;   // CHE-123.456.789

export interface VerificationState {
  level: "none" | "identity" | "professional" | "qualification";
  identity?: { method: "document" | "video"; verifiedAt: string };
  /** Niveau 2 : impose l'IDE. Le badge garantit l'inscription au registre, rien
      de la qualité des prestations — à écrire dans les conditions. */
  professional?: { ide: IdeNumber; legalName: string; checkedAt: string };
  /** Niveau 3 : DÉCLARÉ. `verified: false` est littéral, pour que personne ne
      puisse afficher ce badge comme une garantie. */
  qualification?: { claims: { label: string; issuer: string; verified: false }[] };
}

export interface Consent {
  purpose: "terms" | "privacy" | "newsletter" | "profiling" | "agency-dpa";
  version: string;   // un consentement sans version ne prouve rien
  givenAt: string | null; withdrawnAt?: string;
}

/** Porté par l'annonce, pas par le compte. */
export interface ListingCompliance {
  /** Formule officielle du loyer initial (obligatoire dans plusieurs cantons). */
  initialRentNotice?: { canton: string; previousRent: Money | null; servedAt: string };
  /** Courte durée : autorisation du propriétaire quand l'hôte est locataire. */
  ownerAuthorization?: { required: boolean; documentId?: string };
  registrationNumber?: string;      // obligatoire pour un bien situé dans l'UE
  lexKollerNoticeShownAt?: string;  // acheteur domicilié à l'étranger
}

/** Un avis n'existe pas sans transaction : champ OBLIGATOIRE, pas optionnel —
    seule façon de rendre la règle non contournable. */
export interface Review { id: string; transactionId: TransactionId; /* … */ }
/** Contenu payant toujours étiqueté. Présent = étiquette affichée. */
export interface Sponsorship { kind: "ad" | "sponsored" | "affiliate"; label: string }
```

---

## 2. Le module de tarification — réponse à Q1

**Ni un pôle de plus, ni une notion séparée : un autre discriminant.**
`pricing.ts:33-41` appelle `Pole` ce qui mélange le **domaine** (vente,
formation, boutique) et la **mécanique** (frais fixe, pourcentage). D'où le fait
que `edomeRevenue(pole, price)` (l. 117) doive deviner la mécanique depuis le
pôle — et qu'il ne puisse pas représenter un abonnement, pour lequel aucune
valeur de `price` n'a de sens. Le discriminant devient la mécanique.

```ts
// lib/pricing/charge.ts
/** Les six pôles réellement commissionnables. `vente` et `location-lt` en sont
    ABSENTS : une commission proportionnelle sur un bien immobilier est
    l'assiette du courtage (B.2.3). `quote({kind:"commission",pole:"vente"})`
    devient une erreur de compilation — mieux qu'un commentaire. */
export type CommissionPole =
  | "location-ct" | "service" | "evenement" | "live" | "formation" | "boutique";

export type Charge =
  | { kind: "subscription"; planId: PlanId; interval: "month" | "year" }
  | { kind: "commission";   pole: CommissionPole; gross: Money }
  | { kind: "oneOff";       productId: OneOffId; quantity?: number }
  | { kind: "cpm";          campaignId: string; impressions: number }
  | { kind: "bounty";       event: "host-activated" | "user-activated" };

// lib/pricing/quote.ts — LE point d'entrée unique
export function quote(charge: Charge, ctx?: QuoteContext): Quote;

export interface Quote {
  payer: PlatformRole; payerTotal: Money; lines: QuoteLine[]; flow: MoneyFlow;
  explanation: string;   // phrase générée, jamais reformulée dans un composant
}

/** Alimente le panneau « flux d'argent » de la Partie C, tel quel. */
export interface MoneyFlow {
  gross: Money;        // transaction ou abonnement
  psp: Money;          // frais du prestataire de paiement
  edomeGross: Money;   // part E-Dome avant reversement
  apporteur: Money;    // prélevée SUR edomeGross, jamais ajoutée au prix (B.3)
  edomeNet: Money;
  beneficiary: Money;  // vendeur, hôte, créateur, organisateur
  /** Invariant vérifié dans la fonction : gross === beneficiary + edomeGross + psp. */
}

// lib/pricing/catalog.ts — ce qui change quand marketing ou compta tranche
export interface Plan {
  id: PlanId; holder: "agency" | "account";
  tier: number;                         // ordre d'affichage et de montée en gamme
  price: { month: Money; year?: Money };
  includes: string[];                   // référence des FeatureEntry.id, pas du texte
  stage: FeatureStage;
}
export const PLANS: readonly Plan[] = [ /* … */ ];
export const RATES: Readonly<Record<CommissionPole, Rate>> = { /* … */ };
export const ONE_OFFS: readonly OneOff[] = [ /* … */ ];
```

Mise en avant et dossier de vente sont des `oneOff` ; la publicité est `cpm` ou
`oneOff` selon le contrat ; la prime d'acquisition est `bounty`. `edomeRevenue`
et `apporteurEarning` deviennent des enveloppes dépréciées autour de `quote`,
pour ne pas casser d'un coup les dix importateurs : `admin/page.tsx`,
`explorer/[id]`, `feed`, `publier`, `recommend-button.tsx`, `market-pulse.tsx`,
`post-viewer.tsx`, `dashboard-data.ts:14`, `revenue-data.ts:2`,
`referral-links.ts`. Noms et arguments commerciaux vont dans
`src/content/offer.ts`, montants ici : la page de tarifs se génère de `PLANS`
croisé avec ce contenu, donc elle ne peut pas mentir.

---

## 3. Centralisation des textes — réponse à Q3, plan structure

**44 des 46 pages de `src/app/(app)/` portent `"use client"`** (seules
`dashboard/calendrier` et `live/replay/[id]` sont serveur). Le patron
d'internationalisation de Next 16 — `getDictionary`, `import()` dynamique,
`server-only` (`02-guides/internationalization.md` l. 98-190) — **ne s'applique
donc pas** : il repose explicitement sur le fait que « all layouts and pages
default to Server Components ». La forme correcte est celle de `landing.ts` :
modules TS d'objets `const`, importés statiquement, valides des deux côtés de la
frontière. Le jour où un segment `[lang]` apparaît, c'est `next/root-params` qui
partage la locale (même guide, « Sharing the locale »), pas du prop drilling.

```
src/content/
  index.ts   — seul point d'import : `import { biens } from "@/content"`
  landing.ts — existant, 891 l., APPEND-ONLY dans ce chantier (§6)
  common.ts  — navigation, boutons, états vides, erreurs
  legal.ts   — /conditions, /aide, /confidentialite  (agent juridique)
  offer.ts   — noms et arguments des formules (montants : lib/pricing)
  demo.ts    — bandeau données fictives, légende des statuts, visite guidée
  explain.ts — annotations du mode explicatif (Partie C : « fichier unique »)
  roles.ts   — libellés et descriptions des 11 rôles
  poles/     — biens, agence, services, evenements, lives, formations,
               boutique, apporteurs
```

Typage : pas de type `Dictionary` générique, qui transforme une faute de frappe
en `undefined` silencieux. Le patron de `landing.ts` — objets `const` plus
`satisfies` sur ce qui doit avoir une forme — fait échouer la compilation :
`satisfies Record<PlanId, PlanCopy>` dans `offer.ts` rend impossible d'ajouter
une formule sans son texte. Clés calquées sur la route :
`biens.detail.cta.contacter`. `src/lib/i18n.tsx` (167 l., 3 langues, 33 clés) est
une coquille : il ne sert **qu'une chaîne** dans tout le dépôt, le placeholder de
`header.tsx:153`. `common.ts` devient la source française, `t()` la lit, le thaï
disparaît, l'anglais reste comme preuve que la structure se traduit.

**Migration.** La règle qui évite trois semaines avant le premier écran : *les
textes d'une route sortent quand on touche cette route, jamais dans une passe
dédiée.* Pas de commit « extraction de 48 routes ». Sont écrits d'emblée, parce
que ce sont des textes **neufs** et non des extractions : `common.ts`, `demo.ts`,
`explain.ts`, `roles.ts`, `offer.ts` — un après-midi, et le mode explicatif comme
la légende des statuts deviennent possibles immédiatement. `legal.ts` suit dès que
l'agent juridique rend ses textes : `/conditions` §5, `/aide` et `/publier`
énoncent le barème abandonné (audit §2) et seront réécrits de toute façon, autant
qu'ils naissent centralisés. Limite assumée : aucune règle ESLint ne garantira
l'absence de texte en dur — `react/jsx-no-literals` produirait des milliers
d'avertissements et serait désactivé dans la semaine. Le garde-fou réel est que
`@/content` soit le seul chemin d'import de texte.

---

## 4. Source unique des données de démo — réponse à Q7

**Lequel fait foi : aucun des deux, tel qu'écrit.**

- `dashboard-data.ts:155-157` **écrit en dur** `monthRevenue: 11200 / 8400 /
  5250`, d'où `biensRevenue = 24 850` (l. 221).
- `dashboard-data.ts:195-208` écrit en dur douze valeurs dont la somme fait
  **228 100**, et sa valeur de décembre — **24 850** — est exactement le total des
  biens seuls : le graphique exclut donc formations, événements, boutique,
  services et apporteurs, que `revenueBySource` (l. 232-240) inclut. La
  contradiction est **interne au fichier**, et le commentaire des lignes 217-219
  l'assume : « garde son chiffre historique (24'850) pour coherence chart ».
- `revenue-data.ts:133-164` dérive au contraire de `ramp()` un montant par bien,
  par type et par mois. Dernier mois : 1 350 + 1 385 + 916 = **3 651** en
  immobilier, **≈4 805** toutes sources, **≈66 900** sur douze mois.

`revenue-data.ts` a la bonne granularité (bien × type × mois),
`dashboard-data.ts` la bonne discipline (« KPIs derives — JAMAIS codes en dur »,
l. 344, tenue pour l'occupation, la note et le prévisionnel). Aucun n'a les deux.
Corriger les valeurs ne servirait à rien : elles divergeraient à nouveau le jour
où l'Espace agence ajoute du revenu d'abonnement.

**Le mécanisme.** Ce qui a marché pour le catalogue (`replays.ts` : adressage par
identifiant et non par position) appliqué à l'argent — un journal, et lui seul
contient des chiffres. `src/lib/demo/` : `ledger.ts` (le fait), `identity.ts` (un
compte courant), `derive.ts` (agrégats, fonctions pures), `invariants.ts`.

```ts
// demo/ledger.ts
export interface Entry {
  id: string;
  date: string;                   // ISO — borne les fenêtres 7j / 30j / 12m
  /** Même identifiant que le catalogue : pas de troisième liste de biens. */
  subject: { kind: SubjectKind; id: string };
  charge: Charge;                 // le type de lib/pricing, pas un doublon
  payerId: AccountId; beneficiaryId: AccountId; apporteurCode?: string;
}
export const LEDGER: readonly Entry[] = [ /* … */ ];

// demo/invariants.ts — levées à l'IMPORT, pas dans un test
assert(totals({}).gross === sum(LEDGER, e => e.gross), "agrégat ≠ journal");
assert(new Set(LEDGER.map(e => e.id)).size === LEDGER.length, "identifiant dupliqué");
assert(LEDGER.every(e => catalogHas(e.subject)), "écriture sur un objet inexistant");
```

`derive.ts` expose `monthly(f)`, `totals(f)`, `bySource(f)` — ce qui remplace à la
fois `monthlyRevenue`, `revenueBySource`, `PROPS[].monthly` et `buildView`.
`dashboard-data.ts` et `revenue-data.ts` deviennent des enveloppes conservant
leurs noms d'export : les pages du tableau de bord ne changent pas d'une ligne.
C'est structurel et non une correction parce que la seule façon de faire diverger
deux écrans redevient d'ajouter un second tableau, que les invariants refusent.

L'assertion à l'import plutôt qu'un test unitaire est délibérée : il n'y a **pas
de lanceur de tests unitaires** ici — `npm test` est Playwright et
`tests/e2e/interest-form.spec.ts` est le seul fichier de test. Une assertion à
l'import fait échouer `next build`, qui prérend les pages : la violation bloque le
commit sans ajouter ni dépendance ni porte de qualité.

Même mécanisme pour l'identité unique exigée Partie C. Cinq identités
coexistent : `mock-data.ts:28` (`user-001`, Léo Martin), `dashboard-data.ts:145`,
`feed/page.tsx:658-659` (`CURRENT_USER_ID = "u1"`, qui est **Sophie**),
`messages/page.tsx:88` (`"me"`), `profile-data.ts` (`DEFAULT_PROFILE`).
`demo/identity.ts` exporte un `Account` ; les quatre autres en dérivent.

---

## 5. Découpage des gros fichiers

**`/feed` (3 130 l.) d'abord, et de loin.** Pas pour le gain de lignes : parce
qu'il contient sept `User` en dur (l. 32-86) dont l'identité courante
contradictoire, un `VIDEO_POSTS` de 474 lignes (l. 153-626), six composants de
carte, et qu'il fait partie des huit fichiers qui lisent `activeRole`. Les étapes
identité, rôles, contenu et journal doivent **toutes** y passer : le découper une
fois transforme quatre commits « éditer 3 130 lignes » en quatre commits « éditer
le bon fichier de 200 lignes ».

| Destination | Origine dans `feed/page.tsx` |
| --- | --- |
| `lib/demo/identity.ts` | `U_LEO`…`U_YASMIN` l. 32-86, `CURRENT_USER*` l. 658-659 |
| `lib/demo/posts.ts` | `VIDEO_POSTS` l. 153-626, `mkComments`/`propRef`/`mkFormation` l. 90-151 |
| `components/feed/media/` | `VideoPlayer` 701, `BlurImage` 852, `ImageView` 880, `MediaGallery` 907 |
| `components/feed/post-card.tsx` | `PostCard` 1553, `ActionBtn` 1883, `PostCaption` 964 |
| `components/feed/composer/` | `ComposerAction` 1030, `*AttachCard` 1208-1387, `AffiliateToggle` 1393, `*PickerList` 2914-3129 |
| `components/feed/sparkline.tsx` | `Sparkline` 1171 — réutilisé par les cartes analytiques |
| `feed/page.tsx` | reste ~250 l. : état et composition |

Déplacement pur, sans changement de comportement : lint, typecheck et build
restent verts en un commit. Puis : **`/creer-post` (1 790)**, non pas à découper
mais à **fusionner** — il redéclare le composer du feed et, l. 76, un
`MOCK_PROPERTIES` de 12 entrées générées, soit un troisième catalogue de biens ;
ce commit supprime du code. **`/explorer/[id]` (1 458)** — `PAID_OPTIONS` (l. 34)
et `FLOOR_PLANS` (l. 47) vont au journal, `resolveProperty` (l. 62) au catalogue,
et le panneau de flux d'argent devient un composant partagé, attendu sur
**chaque** écran de transaction, d'où la troisième place. **`/messages`
(1 457)** — environ 900 lignes sont la visioconférence (`CONF_*` l. 41-81,
`ConferenceTile` 1339, `ConferenceAction` 1424), qui appartient à
`/reunion/[roomId]` : en dernier, ce découpage ne débloque rien.

---

## 6. L'ordre de migration

Cinq étapes, un commit chacune, lint + typecheck + build verts.

**1 — `lib/model/` + `lib/pricing/` + `middleware` → `proxy`.** Types et moteur
tarifaire, `PLANS`/`RATES` en données, enveloppes dépréciées pour que les dix
importateurs compilent inchangés. Aucun changement visible. *Ne dépend de rien,
et tout le reste en dépend :* chaque étape suivante se type contre ce modèle.

**2 — `lib/demo/` : journal, dérivations, invariants, identité unique.** C'est ici
que le facteur 5 disparaît. *Dépend de 1* (le journal stocke un `Charge`). Doit
précéder tout écran neuf, sinon chaque écran ajoute un chiffre à réconcilier.

**3 — découpage de `/feed`**, plus le remplacement de ses utilisateurs en dur par
`demo/identity`. *Dépend de 2.* Avant le contenu, parce qu'extraire des textes
d'un fichier de 3 130 lignes est là où l'on se trompe.

**4 — `src/content/` + sélecteur de rôle + statuts + mode explicatif.** Premier
écran visible. Le sélecteur se branche sur le `setActiveRole` qui existe déjà
(`context.tsx:241`) et que personne n'appelle (audit §4). *Dépend de 1 et 3.*

**5 — Espace agence, abonnements, flux d'argent, page de tarifs.** Le cœur de
revenu manquant. *Dépend de 1, 2 et 4.* Tout ce qui précède existe pour que cette
étape soit ennuyeuse.

Le reste — `/creer-post`, `/explorer/[id]`, `/messages`, la réécriture de
`/publier` et de `/conditions` §5 — vient **après** ces cinq étapes, pas dedans.

**Ce qui risque de casser les quatre routes protégées.** `/` ne dépend que de
`app/page.tsx` et de `content/landing.ts` (18 composants l'importent) : **règle,
`landing.ts` est append-only**, et l'étape 1 est tentée de faire de
`PoleAvailability` un alias de `FeatureStage` — à reporter à l'étape 4, quand `/`
est de toute façon revérifiée. `/merci` (`app/merci/page.tsx`, `landing.ts:865
thanks`, `referral-share.tsx`) : même règle. `/admin/leads` : **la couche leads
n'est pas touchée** ; sa seule surface partagée est `ProfileId`, importé de
`content/landing.ts` par `leads/types.ts:1`, `schema.ts`, `score.ts` et
`supabase-store.ts` — le renommer casserait la console **et** la correspondance
des colonnes Supabase. `/confidentialite` (comme `/aide` et `/conditions`) est
sous `(app)`, donc passe par `AppShell` puis `AppProvider` : ce sont les routes
les plus susceptibles de casser en silence, parce que personne ne les regarde. Le
danger précis est à l'étape 4, renommage `Role` → `PlatformRole` combiné au
`storedRole as Role` non validé de `context.tsx:137`. **Contre-mesure demandée :
étendre `tests/e2e/` d'un test de fumée** chargeant `/`, `/merci`,
`/confidentialite` et `/admin/leads` et vérifiant un titre connu. Quatre
assertions, et A.3 cesse de reposer sur l'attention.

---

## 7. La dette technique de l'audit §8

| Dette | Verdict | Raison |
| --- | --- | --- |
| `middleware` → `proxy` | **Étape 1** | Codemod fourni : `npx @next/codemod@latest middleware-to-proxy .` (`codemods.md:155-163`). Deux contraintes vérifiées : le runtime `edge` **n'est pas** supporté par `proxy`, dont le runtime est `nodejs` et non configurable (`version-16.md:616`) ; le fichier se place au niveau de `app/`, donc `src/proxy.ts` (`proxy.md:23`). `src/middleware.ts` fait 18 l. et n'utilise aucune API edge. **Même commit** : le matcher (l. 16) couvre tout, donc le jour où la clé anonyme Supabase apparaît, toute la maquette redirige vers la connexion (audit §8) — le restreindre à `/admin` et `/dashboard`. |
| `appleWebApp` | **L'audit se trompe — mais il y a un défaut** | `generate-metadata.md:779-798` documente `appleWebApp` comme courant ; les champs dépréciés sont `themeColor`, `colorScheme`, `viewport` (l. 654, 658, 754), et `layout.tsx:37` utilise déjà l'export `viewport` correctement. Le défaut réel est une **triple déclaration** : `metadata.appleWebApp` (l. 21-25), `metadata.other` (l. 26-29) et quatre `<meta>` écrits à la main dans `<head>` (l. 58-61) émettent les mêmes balises deux fois. Supprimer le bloc manuel. Cinq minutes, étape 1. |
| CSS orphelin (~250 l.) | **Étape 4** | `--ed-accent` (`globals.css:99`), `.ed-cta-*` (993+), `.holo-*` (724-840) : zéro usage dans `src/**/*.tsx`, la seule occurrence est un commentaire d'avertissement (`landing/section.tsx:12`). À supprimer quand l'étape 4 touche déjà les jetons ; le faire seul fait courir un risque sur `/` pour aucun gain. |
| `--text-secondary` / `--text-muted` | **Étape 4, valeurs à l'agent UX** | `globals.css:63-64`, `143-144`, `487-488` : identiques dans les trois thèmes. **372 usages** de l'un, **641** de l'autre. Le correctif est d'**une ligne par thème**, zéro site d'appel modifié. Cette asymétrie est l'argument : la hiérarchie est déjà écrite dans le balisage, l'allumer ne coûte rien. Je fournis le mécanisme, l'agent UX les deux valeurs. |
| `maplibre-gl` | **Laisser — puis commit isolé** | `npm audit` : 1 critique, contournement du sanitiseur XSS, correctif seulement en `6.11.1`, `isSemVerMajor: true`. Un seul consommateur, `explorer/page.tsx`. Le vecteur est du HTML de popup non fiable, dont la maquette n'a aucun. Une montée majeure de carte au milieu d'une migration de modèle n'achète rien — mais c'est un « critique » sur un dépôt montré à des investisseurs : à faire **après** les cinq étapes, jamais dedans. |
| 181 avertissements ESLint | **Corriger 6 + 1, laisser 174** | Les six `rules-of-hooks` sont **un seul bug dans un seul fichier** : `formations/[id]/page.tsx` sort en `return` l. 101-107 **avant** les `useState` des l. 115-125. Hooks conditionnels : un plantage qui attend un mauvais identifiant. Correctif : remonter les hooks au-dessus du retour. Plus `react/display-name` (1). Les 174 autres coûtent si on y touche : les 88 `no-img-element` imposeraient de convertir chaque `<img>` en `next/image`, dont le comportement change en 16 (`version-16.md`, « `next/image` changes ») — chantier de performance, pas celui-ci ; les 30 `no-unused-vars` et 23 `set-state-in-effect` sont dans les quatre gros fichiers que les étapes 3 et suivantes réécrivent : les corriger maintenant, c'est les corriger deux fois. |

---

## 8. Désaccords attendus

**Agent produit et UX.** Il voudra des écrans avant que le modèle soit propre, et
il a raison sur le fond : une maquette invisible ne démontre rien. Concession :
l'étape 3 découpe `/feed`, l'étape 4 livre le sélecteur de rôle, les statuts et le
mode explicatif — du visible après trois commits, pas quinze. *Où je ne céderai
pas :* **aucune route neuve avant l'étape 2.** Un Espace agence bâti sur des
chiffres en dur fait de ses montants d'abonnement une neuvième source de vérité,
et le panneau de flux d'argent — l'élément qui répond le mieux à un investisseur —
contredira le tableau de bord dès le premier écran. *Ce qu'on perd :* deux
commits, environ une journée, avant le premier écran neuf.

**Agent marketing.** Il demande trois paliers d'agence (`Présence` gratuit,
`Vitrine`, `Mandats`), plus `Patrimoine`, plus un statut `Fondateur`
(`marketing.md:157-182`). **J'accepte tout**, à une condition non négociable :
**les formules sont des lignes de `PLANS`, jamais des variantes d'un type, et
aucun composant ne branche sur un nom de formule.** `planId` reste `string`, les
fonctionnalités sont des `includes: string[]` référençant des `FeatureEntry.id` ;
passer de deux à quatre paliers devient une édition de données. *Où je ne céderai
pas :* pas un seul `if (plan === "mandats")`. Et `Fondateur` **n'est pas une
formule** : c'est un `unitAmount` gelé sur la `Subscription` plus un badge — en
faire un plan double le catalogue à chaque changement de prix. *Ce qu'on perd :*
aucune mise en page sur mesure par palier sans d'abord ajouter un champ à `Plan`,
soit une étape de plus pour chaque différence cosmétique entre formules.

**Agent qualité et données.** Il voudra tout corriger d'un coup. Voir la ligne
ESLint : un commit dont le diff est 181 corrections sur 40 fichiers est impossible
à réviser et **cache le seul vrai bug parmi 180 cosmétiques**. Et je refuse de
« corriger les chiffres » à l'étape 2 : aligner 24 850 sur 4 805 prend une heure
et n'achète rien, puisque les deux fichiers divergeraient à nouveau dès que
l'Espace agence ajoute du revenu d'abonnement. *Ce qu'on perd :* l'étape 2 dure un
jour au lieu d'une heure, et `dashboard-data.ts` / `revenue-data.ts` réduits à des
enveloppes se liront comme une régression dans un diff.

**Agent juridique.** Sa note n'existe pas encore ; je livre les champs de
conformité en optionnel à l'étape 1 sans l'attendre. Quand elle arrivera, les
seuls gestes autorisés sont **élargir un type ou rendre un champ obligatoire** —
jamais renommer, parce que les données de démo porteront déjà ces noms. Un champ
manquant s'ajoute ; rien ne se reforme.

---

## Ce qui nous coûtera cher si on ne le fait pas maintenant

**La signature de la tarification.** Pas les rôles, pas les textes.

`pricing.ts:117` n'expose qu'une porte, `edomeRevenue(pole: Pole, price: number)`
— une fonction qui **suppose une transaction avec un prix**. Dix fichiers
l'importent ; `dashboard-data.ts:14` et `revenue-data.ts:2` en dérivent les
montants d'apporteur ; `/publier` bâtit tout son écran tarifaire sur `SALE_FEE_*`
et `LONG_RENTAL_FEES` (l. 607-634).

Or la principale source de revenu récurrent du modèle retenu n'a pas d'argument
`price` : un abonnement coûte ce que dit son plan, pour une période, à un
titulaire qui peut être une agence et non un compte. Tout écran écrit contre
`edomeRevenue(pole, price)` avant que cette signature change devra être réécrit,
et le panneau de flux d'argent de la Partie C ne peut pas être écrit **du tout**
contre elle : elle n'a aucune notion de payeur, de période ni de titulaire.

Coût aujourd'hui : un commit, dix sites d'import, des enveloppes de compatibilité.
Coût après l'Espace agence : chaque écran neuf, plus les deux tableaux de bord,
plus `/publier`, plus une page de tarifs générée depuis un module incapable
d'exprimer les deux tiers de l'offre.

Tout le reste de cette note peut attendre une étape. Pas ceci.
