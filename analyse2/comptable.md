# Audit comptable — cohérence financière de la maquette E-Dome

Périmètre : le journal unique (`src/lib/demo/ledger.ts` + `derive.ts` +
`invariants.ts`), le modèle de prix (`src/lib/pricing/`), et tout ce qui
affiche un montant pour l'utilisateur courant ou pour les 15 autres profils
(`src/lib/mock-data.ts`, `src/lib/profile-data.ts`, les pages `/apporteurs`,
`/dashboard/apporteurs`, `/profil/[id]`, `/messages`, `/reservations`).

Verdict en une phrase : **le journal unique de la Mission 1 est excellent et
tient toujours, mais il ne couvre qu'une seule personne (Léo, `user-001`).
Tout ce qui concerne les 15 autres profils est resté dans l'ancien monde —
trois casts de personnages différents, des montants écrits à la main, et un
modèle de commission « vente » que le code lui-même a explicitement aboli
mais qui reste branché et affiché.** Ajouter de la richesse aux 15 profils
sans d'abord régler ça ne recrée pas le facteur 5 : il existe déjà, sur
l'écran Apporteurs, sous une forme pire (facteur ~50).

---

## 1. Comment étendre le modèle à 15 profils sans recréer le facteur 5

### 1.1 Ce que garantit le modèle actuel, et pourquoi ça s'arrête à une personne

`LEDGER` (`src/lib/demo/ledger.ts:313`) est un tableau plat d'écritures. Il
n'a pas de colonne « propriétaire » — il est implicitement scellé au seul
`CURRENT_USER` parce que :

- `build()` boucle sur `OWNED_PROPERTY_IDS` et `OWNED_FORMATION_IDS`
  (`ledger.ts:196, 236`), deux constantes définies dans
  `src/lib/demo/identity.ts:50,53` et qui ne décrivent que Léo ;
- `derive.ts` n'a aucun paramètre « pour quel profil » — `entries()`,
  `monthly()`, `total()` lisent `LEDGER` en entier et filtrent seulement par
  `source`/`subjectId` (`derive.ts:20-29`) ;
- `invariants.ts` vérifie que **chaque bien possédé** a une activité
  (invariant 7, `invariants.ts:223-232`) mais « possédé » ne veut dire
  « possédé par Léo », puisque c'est la seule notion de possession qui
  existe.

Ajouter 15 profils en réutilisant tel quel ce module donnerait soit (a) un
seul journal géant où toutes les écritures de tout le monde se mélangent
sans étiquette de propriétaire — invérifiable — soit, plus probable vu la
pression du planning, (b) 15 fichiers de montants écrits à la main pour les
14 autres profils pendant que Léo garde son vrai journal. L'option (b) est
exactement le schéma qui a produit le facteur 5 : un seul point de vérité
pour une personne, des nombres en dur partout ailleurs, qui divergeront à la
première correction oubliée sur l'un des deux écrans.

### 1.2 L'extension proposée : une clé de propriétaire, pas 15 journaux

Le changement minimal qui préserve toute la mécanique existante (le
générateur déterministe, les fonctions pures, les invariants levés à
l'import) :

1. **Ajouter `ownerId: string` à `Entry`** (`ledger.ts:58-72`). Une seule
   colonne. Le générateur `build()` reste un seul fichier, mais chaque
   section (biens, formations, apporteurs…) déclare pour quel `ownerId` elle
   écrit — remplaçant `OWNED_PROPERTY_IDS`/`OWNED_FORMATION_IDS` par une
   table `PROFILES: Record<string, { properties: string[]; formations:
   string[]; ... }>` dont Léo devient une entrée parmi 15, pas un cas
   spécial. `identity.ts` cesse de décrire une seule personne et devient un
   annuaire — voir §1.4 sur pourquoi c'est de toute façon nécessaire.

2. **Paramétrer `derive.ts` par `ownerId`** : `Filter` (`derive.ts:13-18`)
   gagne un champ optionnel `ownerId`, et `keep()` (`derive.ts:20-25`) filtre
   dessus. Toutes les fonctions existantes (`monthly`, `total`,
   `currentMonth`, `bySource`, `growth`, `occupancy`) continuent de
   fonctionner sans changer de signature de retour — un appelant qui ne
   passe pas `ownerId` verrait la plateforme entière, ce qui doit être
   réservé à un futur écran « Espace agence/admin », jamais au dashboard
   d'un profil.

3. **Étendre les invariants, pas les dupliquer.** L'invariant 6
   (répartition par source = revenu du mois, `invariants.ts:211-221`) et
   l'invariant 4 (aucune écriture passée orpheline, `invariants.ts:152-185`)
   doivent boucler sur `PROFILES` et lever le même `assert()` **pour chaque
   `ownerId`** — pas une passe globale qui masquerait un profil vide sous la
   moyenne des 14 autres. L'invariant 7 (chaque bien possédé a une activité)
   devient trivialement générique puisqu'il lit déjà `OWNED_PROPERTY_IDS`
   par construction. Le coût réel : les messages d'erreur de `Fault`
   (`invariants.ts:57-65`) doivent nommer le profil en plus du fichier et
   des deux valeurs, sans quoi une violation sur le 12ᵉ profil oblige à
   deviner lequel des 15 a un chiffre faux.

4. **Un catalogue, pas 15.** La garantie qui a le plus de valeur dans le
   module actuel — invariant 2 et 3, « toute écriture porte sur un objet du
   catalogue », « le montant d'un séjour vaut nuits × tarif de la fiche »
   (`invariants.ts:116-150`) — reste valable à l'identique : `CATALOGUE` est
   déjà partagé par tous les biens de `mock-data.ts`, il suffit que chaque
   bien y porte son propriétaire réel (aujourd'hui implicite : tout ce qui
   n'est pas dans `OWNED_PROPERTY_IDS` n'appartient à personne dans le
   modèle financier, alors que `properties` a 14 fiches et que
   `mock-data.ts` prête déjà des biens sans revenu à 12 autres profils via
   `stats.properties`, voir §2.3).

### 1.3 Le point dur : les ventes d'agence « à des millions »

Le journal actuel ne modélise que des flux **qu'E-Dome commissionne**
(biens en courte durée, formations, événements, services, boutique,
apporteurs) — c'est un choix délibéré et documenté (`identity.ts:46-49`,
`charge.ts:17-29`) : la vente immobilière classique (`vente`) est **exclue
par le système de types** de `CommissionPole` précisément pour qu'aucun code
neuf ne facture une commission de courtage. Si Mission 2 veut qu'une agence
(Yasmin, Jean-Luc) affiche des « ventes conclues » à 7 chiffres, ces
écritures ne peuvent **pas** entrer dans le même `LEDGER` avec un `gross`
commissionnable — elles décriraient une activité que la plateforme ne
facture pas. Deux options propres :
   - un **second type d'écriture, non commissionnable** (`kind: "vente-gmv"`
     ou équivalent), agrégé séparément, jamais sommé dans `total()`/
     `bySource()` du modèle de revenu E-Dome, affiché seulement comme
     volume d'activité du profil (« 3,5 M de biens vendus cette année »,
     pas « revenu ») ;
   - ou ne pas modéliser ces ventes comme des montants du tout, seulement
     comme des annonces au statut « vendu » sans `gross` attaché.
La pire option — celle vers laquelle la pente naturelle mène — est de
réutiliser `Entry.gross` avec `subject.kind` libre : rien n'empêcherait
alors un futur écran de sommer par erreur ces millions dans
`revenueBySource`/`kpis.revenue`, ce qui ferait gonfler le CA affiché
d'E-Dome de plusieurs ordres de grandeur au-dessus de ce que le modèle de
commission peut réellement produire (§3).

### 1.4 Préalable non négociable : un seul annuaire de personnes

Le point le plus urgent n'est pas dans le journal — il est en amont. Il
existe aujourd'hui **trois casts de personnages différents** pour les
mêmes identifiants `user-00x` (détail en §2.1). Brancher un journal par
profil sur cette base ferait porter le bon montant… au mauvais nom, sur un
écran sur trois. La condition pour que l'extension du §1.2 tienne est que
`identity.ts` cesse de ne décrire qu'une personne et devienne l'unique
registre des 15 (nom, ville, rôles, avatar) que `mock-data.ts`,
`profile-data.ts` et toute donnée mockée de page (`messages/page.tsx`,
`reservations/page.tsx`) dérivent — exactement le schéma qui a déjà
fonctionné pour Léo (`identity.ts` en amont, `mock-data.ts:37-59` et
`profile-data.ts:24-104` qui en dérivent). Sans ce préalable, l'extension
financière du §1.2 est un journal correct attaché à une identité qui n'est
pas fiable.

---

## 2. Divergences déjà présentes aujourd'hui (avant toute Mission 2)

### 2.1 CRITIQUE — Trois casts de personnages différents pour les mêmes IDs

- `src/lib/mock-data.ts:79-286` (`users[]`, `user-002` à `user-016`)
- `src/lib/profile-data.ts:127-303` (`PUBLIC_SEEDS`, `user-002` à `user-012`
  + `user-015`)
- `src/app/(app)/messages/page.tsx:16-24, 96-244` (contacts locaux `u1-u4`,
  `g1-g3`)

Exemple concret et vérifiable : `user-007` est **Pierre Gonçalves**, hôte à
Lisbonne, `revenue: 275000` dans `mock-data.ts:144-158` — et **Camille
Rochat**, investisseuse à Fribourg, sans aucun montant, dans
`profile-data.ts:231-242`. Même chose pour `user-008` (Nathalie Blanc,
notaire genevoise vs. Nicolas Berger, promoteur zurichois),
`user-009` (Thomas Müller, architecte lausannois vs. Fatima Zahra, agence à
Casablanca), `user-010`, `user-011`, `user-012` : cinq identifiants sur
onze désignent une personne différente selon l'écran consulté. Une liste
construite depuis `users` (ex. `messages/page.tsx:14`,
`import { users as allUsers }`) et un clic vers `/profil/user-007`
atterrissent sur deux personnes sans rapport. C'est la racine du problème :
tant que ceci n'est pas corrigé, aucun montant attribué à un profil ne peut
être vérifié cohérent d'un écran à l'autre, parce que l'écran suivant
montrera peut-être quelqu'un d'autre sous le même nom.

### 2.2 CRITIQUE — Les commissions apporteur de Léo divergent d'un facteur ~50, sur le même écran

Trois sources indépendantes affichent « la rémunération apporteur de
Léo/l'utilisateur courant » :

1. `src/lib/dashboard-data.ts:428-433` (`apporteurSummary`, dérivé du
   journal) : `earnedThisMonth = derive.currentMonth({source:
   "apporteurs"})` ≈ **187 CHF** (dernière écriture `REFERRALS`,
   `ledger.ts:168`, mois courant), total douze mois ≈ **1 116 CHF**
   (`ledger.ts:162-169`, somme des `edomeRevenue`).
2. `src/lib/dashboard-data.ts:418-423` (`leaderboard`, **écrit en dur**,
   jamais dérivé du journal) : `{ name: "Léo M. · vous", commission: 9500,
   isCurrentUser: true }`.
3. `src/app/(app)/apporteurs/page.tsx:125-132` (`MOCK_APPORTS`, écrit en
   dur, présenté comme « Résumé de ma rémunération », `apporteurs/page.tsx:
   511-515`) : total **1 034 CHF**.

Les sources 1 et 2 s'affichent **sur le même écran**,
`src/app/(app)/dashboard/apporteurs/page.tsx` : la carte KPI « Commissions
du mois » ligne 54 lit `apporteurSummary.earnedThisMonth` (187 CHF) pendant
que le classement juste en dessous, lignes 154-176, lit `leaderboard` et
affiche 9 500 CHF pour la même personne sur, implicitement, la même période
(« Classement du mois »). C'est le facteur 5 de la Mission 1, à l'identique
— même architecture de bug (un tableau en dur jamais migré à côté d'un
calcul dérivé) — sauf que l'écart est plus grand (~50×) et que **le module
qui devait l'empêcher ne le couvre pas**, puisque `leaderboard` n'est reliée
à aucun invariant : rien dans `invariants.ts` ne connaît son existence.

Gravité : critique, parce que c'est précisément le type de contradiction que
la Mission 1 a été payée pour éliminer, qu'elle est visible en un seul
scroll, et qu'elle est indépendante de tout travail de la Mission 2 — elle
existe déjà.

### 2.3 CRITIQUE — La boutique attribue à Léo le revenu d'un vendeur tiers, en contradiction avec le modèle d'affiliation

`src/lib/demo/ledger.ts:146-152` (`PRODUCT_SALES`) et `ledger.ts:282-294`
(expansion) créditent le journal de Léo — `source: "boutique"`,
`counterparty` un client — du produit `b11` au **prix plein**
(`gross: p.units * p.price`, jusqu'à 6×89 = 534 CHF sur un seul mois). Or
`b11` appartient au vendeur **« linen-house »**
(`src/lib/data/products.ts:517`, `vendorId: "linen-house"`), une entité
boutique distincte, sans lien avec Léo. Deux problèmes cumulés :

- **Attribution.** Léo n'est le vendeur d'aucun produit de la boutique ; le
  journal le crédite pourtant du chiffre d'affaires d'un tiers, comme s'il
  encaissait une vente qu'il n'a pas faite.
- **Économie.** Même s'il s'agissait d'un lien d'affiliation (ce que le
  code ne modélise pas ici — aucune trace de `estimateEarning` ni de
  `REFERRAL_LINKS` dans `ledger.ts`), le taux boutique est **0 %**
  (`src/lib/pricing/catalog.ts:39`, `boutique: { min: 0, max: 0 }`,
  justifié par l'art. 20a LTVA — affiliation pure, aucune commission
  E-Dome). Il n'existe donc **rien à reverser** à un apporteur sur ce pôle :
  `quoteCommission()` (`quote.ts:174-179`) renvoie `edomeGross = ZERO` dès
  que `rate === 0`. Créditer 534 CHF de « revenu boutique » à qui que ce
  soit contredit directement le modèle économique que `catalog.ts`
  documente à deux endroits.

Répercussion en aval : `revenueBySource`/`bySource()`
(`dashboard-data.ts:281-286`) affiche une source « Boutique » non nulle sur
le dashboard de Léo pour un montant qui, économiquement, ne devrait exister
nulle part dans son propre compte de résultat.

Gravité : critique pour la question posée explicitly — la réponse directe à
« les chiffres de la boutique reflètent-ils l'affiliation ? » est **non**,
et ce n'est pas une question de libellé mais un montant présent au mauvais
endroit dans le seul journal cohérent du dépôt.

### 2.4 MAJEUR — Le modèle de commission « vente » aboli reste vivant sur les boutons de recommandation

`src/lib/pricing/legacy.ts:33-40` documente que `SALE_FEE_THRESHOLD`,
`SALE_FEE_BELOW` (500 CHF) et `SALE_FEE_ABOVE` (2 500 CHF) décrivent « le
modèle que la mission ABANDONNE », gelé uniquement parce que dix fichiers
en dépendaient encore. `edomeRevenue()` (`legacy.ts:98-103`) et
`apporteurEarning()` (`legacy.ts:135-147`) continuent pourtant de calculer
un gain apporteur sur un bien « vente » avec ce barème aboli, et cette
fonction est **appelée en direct, aujourd'hui**, sur des écrans que
l'utilisateur voit :

- `src/components/affiliate/recommend-button.tsx:8,41-43`
  (`estimateEarning`, bouton « Recommander & gagner » sur toute annonce
  vendable) ;
- `src/components/feed/attach-cards.tsx:279,342` et
  `src/components/feed/post-viewer.tsx:14,132` (même fonction) ;
- `src/app/(app)/apporteurs/page.tsx:112,121,130` (`MOCK_APPORTS`, libellé
  « 10–30 % du frais plateforme », entrée A-005 « Appartement Lausanne
  (vente ≥ 1 M) → 750 CHF »).

`src/lib/pricing/charge.ts:17-29` est pourtant explicite : `vente` a été
retirée du type `CommissionPole` **précisément** pour qu'aucun code neuf ne
puisse plus calculer de commission dessus, avec un commentaire qui
anticipe le risque (« l'erreur a déjà été commise une fois »). La couche
`legacy.ts` la recommet, en silence, sur les écrans consommateur ; l'écran
public `/apporteurs` l'affiche même comme exemple pédagogique de calcul
(`apporteurs/page.tsx:118-124`). Un visiteur qui recommande une vente
immobilière voit donc aujourd'hui un gain estimé pour un revenu qu'E-Dome
s'interdit, par construction, de facturer.

Gravité : majeur — le risque juridique (courtage sans mandat, art. 412 CO)
que `charge.ts` a pris soin d'exclure au niveau du système de types reste
exposé côté UI via la voie de compatibilité.

### 2.5 MINEUR (mais piège pour Mission 2) — Une série de revenus morte, aux dates obsolètes, prête à ressusciter

`src/lib/mock-data.ts:2315-2328` exporte `monthlyRevenue: MonthlyRevenue[]`
avec douze valeurs à la main (28 500 → 42 500 CHF, avril 2025 → mars 2026).
Aucun fichier ne l'importe aujourd'hui (vérifié : seule occurrence hors
définition est l'import de type). Elle n'est donc pas un bug actif — mais
elle est le type exact de mine qui a produit l'incident originel : un
second moteur de revenus, à seulement un `import` de redevenir vivant, avec
des dates qui ne correspondent déjà plus à la fenêtre glissante de
`DEMO_TODAY` (le dépôt est daté ~septembre 2026 ; ce tableau s'arrête en
mars 2026). À supprimer plutôt qu'à laisser dormir, avant que Mission 2 n'y
touche pour l'étendre à 15 profils.

### 2.6 MINEUR — Nombre d'avis incohérent entre l'annuaire et la fiche publique

Effet de bord de §2.1, hors périmètre strictement financier mais adjacent :
`mock-data.ts` donne à Sophie Durand (`user-002`) `reviews: 134`
(`mock-data.ts:73`) ; sa fiche publique réelle (`/profil/user-002`, via
`profile-data.ts:161`) affiche `reviewsCount: 42`, et la page elle-même
n'expose que 3 avis statiques identiques pour **tous** les profils
(`AVIS`, `profil/[id]/page.tsx:42-46`, `RATING_BREAKDOWN:47-53` qui somme à
3 quel que soit le profil visité). Non financier au sens strict, mais
pertinent parce que la Mission 2 doit aussi rendre les avis vivants et
cohérents avec les transactions — même piège, même cause (mockage local
non dérivé d'une source commune).

---

## 3. La boutique en affiliation — verdict

Le taux `RATES.boutique = { min: 0, max: 0 }` (`catalog.ts:30-40`) est
cohérent avec le narratif d'affiliation pure et sa justification fiscale
(art. 20a LTVA, motif documenté et renvoyant à `JURIDIQUE-A-VALIDER.md`).
**Le modèle de prix, lui, est défendable.** Ce qui ne l'est pas :

- Le journal de Léo lui attribue un revenu boutique qui n'a aucune existence
  économique légitime dans ce modèle (§2.3) — à corriger avant toute
  extension à 15 profils, sinon chacun des 15 hérite du même défaut.
- Le texte de la page `/apporteurs` (`apporteurs/page.tsx:99-101`, « pour
  les pôles marketplace (…) e-commerce, il touche une PART de la commission
  marketplace E-Dome ») affirme qu'un apporteur touche une part de la
  commission sur la boutique — alors que cette commission est nulle par
  construction. Le texte contredit le taux qu'il est censé résumer.

Pour 15 profils, la boutique devrait rester **hors du revenu personnel de
chacun**, sauf pour le ou les profils explicitement définis comme vendeurs
boutique (aucun aujourd'hui — tous les `VENDORS` de `products.ts` sont des
entités à part, jamais un `user-00x`). Si Mission 2 veut qu'un profil
« vende » à la boutique, il faut d'abord relier un `vendorId` de
`products.ts` à un `ownerId` de l'annuaire (§1.4), sans quoi la même
confusion vendeur/tiers se reproduira 15 fois.

---

## 4. Prix (formules agence, Patrimoine, commissions) — cohérence et viabilité

### 4.1 Ce qui tient

`src/lib/pricing/catalog.ts` et `quote.ts` forment, contrairement au reste
de la maquette, un module déjà construit pour résister à l'extension : un
seul barème (`RATES`, `PLANS`, `APPORTEUR_SHARES`), un point d'entrée
unique (`quote()`) qui vérifie lui-même que la somme des lignes tombe juste
(`quote.ts:330-343`, `assertFlowBalances`), et des justifications chiffrées
et sourcées pour chaque taux discuté (12 % vs les 15,5 % d'Airbnb ; 5 %/10 %
formation en fonction de qui apporte l'audience ; plancher de 3 CHF motivé
par le coût du prestataire de paiement à 3,15 % + fixe). Les quatre paliers
agence (0 / 89 / 290 / 690 CHF/mois) et Patrimoine à 19 CHF/mois sont
cohérents entre eux (montée en gamme progressive, `tier` explicite) et avec
les intentions documentées en `DECISIONS.md`.

### 4.2 Ce qui ne tient que si §2.4 est corrigé

La cohérence de `RATES`/`PLANS` ne protège pas des écrans qui, comme
`recommend-button.tsx` et `/apporteurs`, contournent `quote()` via
`legacy.ts` pour recalculer un montant sur un pôle explicitement exclu. Tant
que ce chemin reste branché, le barème « propre » et le barème « aboli »
coexistent visiblement, et un investisseur qui clique sur une annonce de
vente verra le second.

### 4.3 Le §8 (DECISIONS.md) tient toujours, et Mission 2 ne doit pas le contredire silencieusement

Le risque nommé par le comptable en Mission 1 — E-Dome vend une visibilité
qu'elle n'a pas encore, contre un duopole de portails qui vient de baisser
ses prix, et les deux moteurs de revenu (SaaS agence, commission courte
durée) ont besoin de la même demande qu'aucun prix n'achète — est un risque
de **traction réelle**, pas de cohérence interne de la maquette. Il reste
valable tel quel : rien dans le travail de la Mission 2 ne peut l'éliminer,
seulement l'illustrer honnêtement ou le trahir.

Le point de vigilance pour Mission 2 : §8 s'accompagne d'un engagement
explicite — « la démonstration ne doit pas prétendre que ce risque n'existe
pas » (`DECISIONS.md:1064-1068`). Donner à 15 profils des cumulés de
revenus crédibles (voir §5) est sain ; mais si leur somme, une fois
publiée, se lit comme une preuve de traction agrégée de la plateforme (par
exemple en additionnant les `stats.revenue` de `mock-data.ts` dans un total
affiché quelque part, ce que rien ne fait aujourd'hui mais qu'un futur
écran « Espace agence » pourrait faire), la maquette recommencerait à
affirmer, par les chiffres, ce que §8 dit ne pas encore exister. Ce point
est un désaccord possible avec l'esprit de Mission 2 plutôt qu'un fait
constaté : à trancher explicitement plutôt qu'à laisser un futur écran en
décider par défaut.

---

## 5. Crédibilité des montants pour la Suisse romande

- **Léo (le seul profil réellement dérivé)** : 3 biens en courte durée
  (studio genevois, chalet à Verbier, villa à Phuket), revenu annuel de
  l'ordre de quelques dizaines de milliers de CHF par bien selon
  l'occupation saisonnière modélisée (`NIGHTS_BY_PROPERTY`,
  `ledger.ts:118-125`). Ordre de grandeur crédible pour de la location
  courte durée haut de gamme en Suisse romande/international.
- **Les 15 autres profils (`mock-data.ts:61-303`)** : revenus annuels
  déclarés de 12 000 CHF (Clémence, une cliente en première acquisition,
  cohérent) à 3 500 000 CHF (Yasmin, agence Dubaï, 35 biens ultra-luxe —
  environ 100 000 CHF/bien/an, plausible pour du Palm Jumeirah). Aucun
  chiffre isolé n'est absurde pour le profil qu'il décrit. Le problème
  n'est donc pas le réalisme de chaque nombre pris seul — il est qu'**aucun
  de ces nombres n'est dérivé de quoi que ce soit** (pas de journal, pas de
  liste de biens avec un prix, pas de saisonnalité) : ce sont des
  affirmations, pas des calculs, exactement la situation que le journal de
  Léo a été construit pour ne plus jamais produire.
- **Prime de risque à surveiller pour Mission 2** : si les 15 profils
  gagnent des réservations/ventes détaillées comme Léo, leurs totaux
  dérivés devront rester dans le même ordre de grandeur que les
  `stats.revenue` déjà publiés dans `mock-data.ts` (920 k pour Sophie,
  1,25 M pour Marc, etc.) — sans quoi ces stats deviennent elles-mêmes une
  nouvelle divergence, cette fois entre le résumé annuaire et le détail
  transactionnel du profil.

---

## Désaccords / points ouverts

- Je ne tranche pas si les ventes d'agence (§1.3) doivent apparaître comme
  un montant du tout dans la maquette, ou seulement comme un statut
  d'annonce sans CHF attaché — les deux sont défendables, mais le choix
  doit être fait consciemment et documenté comme `identity.ts`/`charge.ts`
  le font pour leurs propres décisions, pas laissé à l'implémentation du
  premier écran qui en aura besoin.
- Le §8 de `DECISIONS.md` est un jugement du comptable de Mission 1 sur la
  viabilité **du modèle d'affaires réel**, pas sur la maquette. Je le
  rapporte tel quel plutôt que de le réévaluer : rendre 15 profils vivants
  ne le renforce ni ne l'affaiblit, sauf si l'agrégat de leurs chiffres se
  met, par accident d'implémentation, à raconter une histoire de traction
  que la plateforme n'a pas (voir §4.3).
