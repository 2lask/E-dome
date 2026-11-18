# STRATÉGIE — la documentation centrale d'E-Dome

*Document vivant. Référence unique pour la vision, le positionnement, le modèle
économique, les utilisateurs ciblés, le périmètre de lancement, la roadmap et les
décisions importantes. Il doit rester cohérent avec le code réel et être mis à
jour à chaque transformation. Rédigé en endossant les rôles CEO / CTO / produit /
business / acquisition / finance / investisseur.*

*Créé le 2026-11-17. Chaque affirmation est étiquetée : **[FAIT]** (vérifié dans
le code ou une source), **[HYP]** (hypothèse de travail), **[EST]** (estimation
chiffrée non prouvée), **[RECO]** (recommandation), **[À VALIDER]** (décision
humaine ou juridique requise).*

---

## 0. Résumé exécutif (à lire en premier)

**Le constat dur.** E-Dome, tel qu'il existe aujourd'hui, n'est pas une
plateforme : c'est **huit startups empilées** dans une seule maquette (portail
d'annonces, SaaS agence, place de marché de services, formations/LMS,
événements/lives, boutique en affiliation, réseau d'apporteurs, outils
investisseurs). C'est une maquette **remarquable** — architecture propre, modèle
de prix d'une rigueur rare, module IA réel, 65 écrans cohérents. Mais la largeur
qui rend la démo impressionnante est **exactement** ce qui rend l'entreprise
non-lançable par un fondateur seul, sans société, sans capital et sans
validation juridique.

**Les trois vérités que je dois te dire sans les adoucir :**

1. **On ne peut pas amorcer huit marchés biface en même temps.** Chaque pôle est
   lui-même un problème de poule et d'œuf. Un fondateur seul n'en amorce même pas
   *un* facilement ; huit, jamais. → Il faut **un seul point d'entrée** (un
   « wedge » / tête de pont).
2. **L'idée la plus différenciante — la prime apporteur sur les biens — est
   aussi la plus risquée juridiquement et la plus dure à amorcer.** Lancer
   dessus, c'est construire sur le pilier le plus fragile. → On la **garde**,
   mais en version 3, après validation juridique *et* une base d'utilisateurs.
3. **Il existe déjà, dans ce qui est construit, un actif défendable, propre
   juridiquement, et qui a de la valeur dès le premier utilisateur seul** :
   un **espace de travail IA + une vitrine publique pour les professionnels de
   l'immobilier**. C'est la tête de pont recommandée.

**La recommandation en une phrase [RECO] :** lancer **« E-Dome Pro »** — l'outil
IA et la page publique des agents et petites agences de Suisse romande, monétisé
par **abonnement (freemium)** — comme version 1 unique, et faire de tout le reste
(apporteurs, boutique, formations, événements, investisseurs, international,
mobile) la **roadmap V2→V5**. On ne jette aucune idée ; on les **ordonne**.

---

## 1. Ce que contient réellement le projet (audit — livrable 1)

### 1.1 État technique réel [FAIT]
- **Stack :** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, zod.
  Déploiement Vercel (préproduction sur la branche `feat/plateforme-v2`, prod =
  landing figée sur `master`).
- **65 routes applicatives** sous `src/app/(app)/` + auth + admin + landing.
- **Données : encore majoritairement fictives.** La persistance passe par un
  **journal de session en `localStorage`** (`src/lib/demo/session-store.ts`) :
  les clics laissent une trace, mais **rien n'est partagé entre comptes ni
  appareils**, rien n'est écrit côté serveur de façon durable.
- **Backend : optionnel, fondation posée.** Supabase (Postgres + Auth + Storage
  + RLS) est câblé mais gaté : sans clés → mode démo. Le **schéma complet**
  existe (`supabase/schema.sql`), l'**auth e-mail/mot de passe + Google** est
  fonctionnelle, et le pont `getCurrentUser()` relie l'auth à l'app. **Aucun
  écran applicatif ne lit encore la vraie base** — c'est la frontière actuelle.
- **Module IA réel** (`src/lib/ai/`) : moteur de calcul immobilier pur
  (rendement, cashflow, mensualité, ROI, prix/m², estimation par comparables),
  7 outils sur les données, prompt anti-invention, quotas par formule côté
  serveur, provider Claude. Route `src/app/api/ai/chat/route.ts`. **C'est l'actif
  technique le plus différenciant du projet.**
- **Coquille mobile** (`mobile/`, Expo/React Native) : scaffold, non abouti.
- **Pas de Stripe.** Les paiements sont simulés.

### 1.2 Le modèle économique codé [FAIT]
`src/lib/pricing/catalog.ts` est **excellent et à conserver tel quel** : tout le
modèle est en données, pas en `if`. Il porte déjà **trois mécaniques** :
- **Abonnements** (freemium par rôle) : Présence 0 / Vitrine 89 / Mandats 290 /
  Régie 690 CHF/mois pour les agences ; Patrimoine 19 CHF/mois pour un
  particulier. Plafonds gratuits en valeurs de catalogue (`FREE_LIMITS`).
- **Prime biens** : montant **fixe en CHF** (50–3 000), payé par le vendeur sur
  une mise en relation acceptée, jamais un % du prix ; E-Dome en garde 12 %.
- **Affiliation marketplace** : un % **sortant de la marge du vendeur** sur
  formations/lives/événements/services/courte durée ; commission E-Dome
  inchangée. Boutique = affiliation pure payée par le marchand (0 % E-Dome).

### 1.3 L'état « vrai vs annoncé », sans complaisance [FAIT]
- **Fonctionne vraiment :** navigation, auth, le journal de session (clics →
  traces en local), le module IA (si clé API), les calculs, l'affichage du
  modèle de prix, la cohérence des 16 personas.
- **Simulé / maquette :** toute la donnée métier (biens, profils, formations,
  avis), les paiements, la messagerie (locale, pas serveur), les notifications,
  les statistiques, la boutique, les apporteurs, les événements/lives.
- **Prévu mais inexistant :** persistance serveur réelle, comptes qui se voient
  entre eux, publication qui écrit en base, Stripe, app store.

---

## 2. Diagnostic stratégique — honnête (livrable 2)

### 2.1 La proposition de valeur
Aujourd'hui elle est **diffuse** : « le tout-en-un de l'immobilier suisse ». Un
tout-en-un ne se lance pas ; il se **gagne** pôle par pôle après avoir dominé un
premier usage. **[RECO]** La proposition de valeur de lancement doit tenir en une
phrase qu'un agent comprend en 10 secondes : *« Ta vitrine professionnelle en
ligne + un copilote IA qui estime, rédige et qualifie, à la place d'un logiciel
métier des années 2000. »*

### 2.2 Le marché [FAIT, sources §11]
- **Les portails sont un oligopole capitalistique.** SMG (Homegate +
  ImmoScout24) : **164 M CHF** de revenus sur le seul immobilier en 2025,
  **marge EBITDA ~60 %**, groupe coté **5,9 Md CHF**. **[RECO]** Ne **jamais**
  attaquer frontalement comme « un nouveau portail d'annonces » : c'est
  l'erreur fatale, capital contre capital, effet de réseau déjà possédé.
- **Les professionnels sont un marché B2B concret et atteignable.** ~2 500 à
  3 600 agences actives en Suisse qui diffusent des annonces ; concentration en
  **Vaud, Genève, Valais** (Suisse romande). 42 % des agences ont ≤ 5 biens →
  des structures petites, mal outillées, directement démarchables.
- **La PropTech suisse est petite mais financée, et l'IA pour agents intéresse
  les investisseurs** (ex. un CRM immobilier IA a levé en seed en 2025). → Notre
  angle IA est **dans l'air du temps et fundable**.

### 2.3 Pourquoi quelqu'un nous choisirait
- **Côté pro :** un outil moderne, beau, IA-natif, moins cher et plus simple que
  les logiciels installés ; une page publique partageable qui lui sert **même
  seul** (pas besoin d'audience E-Dome pour en tirer de la valeur).
- **Ce que les incumbents ne font PAS bien :** l'IA appliquée au quotidien de
  l'agent, le réseau professionnel, et (plus tard) l'apport d'affaires. C'est là
  qu'est l'espace.

### 2.4 Potentiel réel [EST, à ne jamais présenter comme certitude]
- **Court terme :** une petite entreprise SaaS rentable en Suisse romande est
  **plausible** (quelques dizaines à ~200 agences payantes).
- **Moyen terme :** un acteur PropTech romand puis suisse reconnu, si le réseau
  et l'apport d'affaires prennent — **conditionnel** à la validation juridique et
  à l'effet de réseau.
- **Long terme / « licorne » :** **non promis.** Possible *seulement* si l'effet
  de réseau biface s'enclenche (apporteurs + marketplace) et que l'expansion
  internationale (pays déjà cartographiés) s'ouvre. C'est une hypothèse haute,
  pas un plan.

### 2.5 Les risques classés
1. **Juridique (le plus lourd) [À VALIDER] :** tout le modèle repose sur « une
   prime n'est pas une commission, une mise en relation n'est pas du courtage ».
   Non validé par un juriste. *Mais* — point clé — **l'abonnement SaaS ne dépend
   pas de cette question.** On peut lancer la V1 en validant d'abord la question
   **étroite et moins chère** (l'abonnement indexé au volume est-il hors
   courtage ? cf. `JURIDIQUE-A-VALIDER.md §1`), et ne traiter la prime apporteur
   qu'en V3.
2. **Amorçage (poule/œuf) :** résolu en V1 par un produit **mono-face** (valeur
   pour l'agent seul), repoussé en V2 pour la face consommateur.
3. **Fondateur seul, sans capital, sans société.** Le temps et les actions
   humaines (société, avocat, démarchage) sont le vrai goulot, pas le code.
4. **Dispersion.** Le risque d'exécution numéro un : vouloir tout garder.

---

## 3. Audit fonctionnel — la classification (livrable 3)

Classes : **A** indispensable au lancement · **B** importante mais simplifiable ·
**C** après le lancement · **D** à retirer du périmètre (sans supprimer le code) ·
**E** à valider avant d'investir.

| Pôle / système | Classe | Décision |
|---|---|---|
| Auth réelle (e-mail + Google) | **A** | Garder, déjà faite |
| Profil pro public (vitrine) | **A** | **Cœur V1** — câbler sur la vraie base |
| Gestion d'annonces (publier/dashboard) côté pro | **A** | **Cœur V1** — câbler sur la base |
| Copilote IA (estimation, rédaction, calculs) | **A** | **Cœur V1** — le différenciateur |
| Abonnement freemium agence (`catalog.ts`) | **A** | **Seul revenu V1** (simulé → Stripe après juridique) |
| Moteur de prix `catalog.ts` | **A** | Garder tel quel (déjà parfait) |
| Bandeau « données fictives » tant que mock | **A** | Garder (honnêteté) |
| Recherche / explorer (face consommateur) | **C** | V2 — lire les vraies annonces |
| Messagerie, notifications, favoris, réseau | **B/C** | V1 minimal côté pro ; complet en V2 |
| Formations / LMS | **C** | V3 — acquisition créateurs (marge propre) |
| Services (place de marché) | **C** | V2/V3 |
| Événements / lives | **D** | Parquer — hors périmètre de lancement |
| Boutique en affiliation | **D** | Parquer |
| Outils investisseurs | **C** | V2 (bon up-sell de l'abonnement Patrimoine) |
| Location courte durée (hôtes) | **D** | Parquer (réglementation UE lourde) |
| **Apporteurs — prime biens** | **E** | **V3**, après validation juridique + base d'utilisateurs |
| Apporteurs — affiliation marketplace | **E** | V3, avec les pôles marketplace |
| « Demandes d'accompagnement » (distribution de leads) | **E** | **Ne PAS en faire l'argument V1** — juridiquement fragile (`JURIDIQUE §5`) |
| Sélecteur « être un profil » (démo) | **B** | Garder en démo ; s'efface quand on se connecte en vrai |
| App mobile (`mobile/`) | **C** | V4 — après le web, via PWA d'abord |
| Multi-pays / multi-devises | **C/E** | V4/V5 |

**Règle d'or [RECO] :** « parquer » ≠ « supprimer ». On **retire du parcours
principal et de la nav** ce qui n'est pas V1, en l'affichant honnêtement comme
« bientôt » ou en démonstration, **sans casser ni effacer le code** (la mission
l'exige). Rien n'est détruit ; tout est ordonné.

---

## 4. Modèle économique de lancement (livrable 4)

### 4.1 Un seul moteur de revenu en V1 [RECO]
**L'abonnement professionnel** (freemium → Vitrine/Mandats), déjà modélisé dans
`catalog.ts`. Raisons : (1) **juridiquement le plus propre** (dû indépendamment
de toute transaction) ; (2) **payeur clair** (l'agence, habituée à payer ses
outils) ; (3) **récurrent** ; (4) **aucune dépendance** à l'effet de réseau pour
commencer. Les paiements restent **simulés** jusqu'à la constitution de la
société + Stripe + validation juridique de la formulation.

### 4.2 Qui paie, pourquoi, combien
- **Payeur :** agent indépendant / petite agence de Suisse romande.
- **Pourquoi :** remplacer un logiciel métier cher et daté par un outil IA +
  une vitrine ; gagner du temps (estimation, rédaction d'annonce, qualification).
- **Combien [FAIT, catalog] :** 0 (Présence) → **89** (Vitrine) → **290**
  (Mandats) CHF/mois. Panier moyen plausible **~150 CHF/mois** [EST].

### 4.3 Simulations — étiquetées comme estimations, pas des certitudes [EST]
Hypothèses : SAM Suisse romande ≈ **1 200–1 500** structures ; démarchage
fondateur ; conversion lente mais directe.

| Scénario | Agences payantes (fin an 1) | Panier moyen | MRR | ARR |
|---|---|---|---|---|
| Prudent | 30 | 150 CHF | 4 500 CHF | ~54 k CHF |
| Réaliste | 80 | 160 CHF | 12 800 CHF | ~154 k CHF |
| Ambitieux | 200 | 175 CHF | 35 000 CHF | ~420 k CHF |

- **Coûts [EST] :** hébergement (Vercel + Supabase) faible au départ ;
  **API IA variable**, bornée par les quotas serveur déjà codés ; **avocat**
  (ponctuel, ~5–15 k CHF pour valider le modèle) ; **société** (Sàrl, ~2–5 k) ;
  TVA dès ~100 k CHF de revenus (assujettissement volontaire envisagé).
- **CAC [EST] :** proche de **zéro en cash** au début (vente fondateur), mais
  **coûteux en temps**. C'est le vrai investissement de la V1.
- **Seuil de rentabilité [EST] :** le scénario réaliste couvre les coûts
  courants ; l'avocat et la société sont des coûts de démarrage à provisionner.

### 4.4 Ce qu'on NE fait pas en V1
Pas de multiplication artificielle des revenus. **Pas** de prime apporteur
(V3), **pas** de commission marketplace (V2/V3), **pas** de boutique. Un seul
message de prix, compréhensible.

---

## 5. Stratégie d'acquisition (livrable 5)

### 5.1 La cible première, et pourquoi
**Les agents indépendants et petites agences (≤ ~5 biens) de l'arc lémanique +
Neuchâtel** [RECO]. Pourquoi eux d'abord : mal outillés, sensibles au prix,
décision rapide (pas de comité d'achat), nombreux, géographiquement proches du
fondateur (Neuchâtel), et ils **apportent leur propre contenu** (leurs annonces)
et **leur propre audience** (leurs clients) — ce qui amorce la plateforme sans
qu'on ait à fabriquer la demande.

### 5.2 Comment on casse le problème de la poule et de l'œuf
En **le supprimant pour la V1** : le produit a de la valeur **mono-face**. Un
agent tire profit de l'outil IA et de sa page publique **même s'il est le seul
inscrit** (comme un portfolio + un assistant). La face consommateur (recherche,
réseau) arrive en **V2**, déjà alimentée par les pros embarqués et leurs
annonces. On ne demande jamais aux deux côtés d'arriver en même temps.

### 5.3 Le plan concret, pas théorique
1. **10–20 partenaires-pilotes** recrutés **en direct** par le fondateur
   (Neuchâtel → Lausanne/Genève). Offre : **Vitrine gratuite 12 mois** (le
   « tarif fondateur agence » **déjà** dans `catalog.ts`) contre usage réel +
   retours + témoignage.
2. **Boucle de recommandation entre agents** (un bon outil se dit entre
   confrères d'une même région).
3. **SEO des pages pros publiques** + annonces (actif qui compose dans le temps).
4. **Contenu** (plus tard, via les formations) comme génération de demande.
5. **Pas de publicité payante au lancement** — on apprend d'abord, on dépense
   ensuite.

---

## 6. Vision produit — la V1 qu'on lance vraiment (livrable 6)

**« E-Dome Pro »** : l'espace de travail et la vitrine publique de l'agent
immobilier romand, avec copilote IA. Ce qu'un pilote doit pouvoir faire **en
vrai, contre la base, dès la V1** :
1. Créer un **compte pro réel** (déjà possible) et un **profil public** complet
   (vitrine partageable, référençable).
2. **Publier et gérer ses annonces** — écrites en base, visibles sur sa page.
3. **Utiliser le copilote IA** : estimer un bien (comparables), calculer un
   rendement, **rédiger une annonce**, préparer un argumentaire.
4. Voir un **tableau de bord** honnête de son activité.
5. **Choisir et simuler une formule** (paiement simulé jusqu'à Stripe).

Hors V1, affiché honnêtement « bientôt » : recherche grand public, messagerie
complète, formations, services, apporteurs, boutique, événements, mobile.

---

## 7. Roadmap par versions (livrable 7)

- **V1 — LANCEMENT (le périmètre ci-dessus).** Pro + vitrine + IA + abonnement,
  Suisse romande, web (PWA). Backend réel câblé **sur la face pro uniquement**.
  Validation juridique **de l'abonnement** (question étroite). Paiement simulé →
  Stripe dès société + feu vert.
- **V2 — PREMIÈRE ÉVOLUTION.** Ouverture de la **face consommateur** : recherche
  et fiches sur vraies annonces, comptes particuliers, favoris, contact → vraie
  messagerie, réseau. L'effet de réseau commence. Outils investisseurs en up-sell.
- **V3 — DÉVELOPPEMENT.** **Le modèle apporteur / affiliation** — *après*
  validation juridique **et** base d'utilisateurs réelle. C'est le déblocage de
  croissance signature du projet. Formations comme acquisition créateurs.
- **V4 — EXPANSION.** Suisse alémanique, nouveaux rôles (prestataires, hôtes),
  événements, **app mobile**, nouvelles lignes de revenu.
- **V5 — VISION LONG TERME.** L'écosystème super-app complet, international (pays
  déjà cartographiés dans `PRIME_COUNTRIES`), IA propriétaire, levée éventuelle.

**Principe [RECO] :** ne rien construire de la V5 maintenant, mais ne prendre
**aucune** décision technique qui la rende impossible. Le modèle de prix, le
schéma de base et le module IA sont déjà conçus pour cette extension — on les
garde.

---

## 8. Plan de transformation technique (livrable 8)

### 8.1 Ce qu'on garde intact [RECO]
Le moteur de prix (`catalog.ts`), le module IA (`src/lib/ai/`), la plomberie +
le schéma + le pont Supabase, le journal de session (devient la couche optimiste
hors-ligne), le casting des 16 (devient la **donnée de démonstration / seed**),
le design et l'accessibilité déjà faits.

### 8.2 Ce sur quoi on travaille maintenant (si la direction est validée)
Câbler la **face pro** sur Supabase — la suite logique de `BACKEND-SETUP.md`,
mais **cadrée sur le pro** : phases 2–3 restreintes à profil pro, annonces,
tableau de bord, abonnement. L'en-tête montre la personne connectée.

### 8.3 Ce qu'on parque (cache, sans détruire)
Apporteurs, boutique, événements/lives, courte durée, (temporairement)
formations/services/investisseurs : **retirés de la nav principale**, marqués
« bientôt » ou démonstration. Le code reste, les tests restent verts.

### 8.4 Ce qui est gelé jusqu'au juridique
Stripe (paiements réels), prime apporteur, distribution de leads
(« accompagnement ») comme argument de vente.

### 8.5 Règles de sécurité (mission §9/§10)
Ne rien casser qui marche · ne rien supprimer sans comprendre les dépendances ·
ne pas détruire les données/migrations · **toute suppression importante ou
modification irréversible est présentée et validée avant exécution** · pas de
fausse interface donnant l'impression qu'un système marche alors qu'il est en
démo (le bandeau « données fictives » et les mentions « bientôt » tiennent cette
honnêteté).

---

## 9. Plan de lancement commercial (livrable 9)

**Actions qui n'appartiennent qu'au fondateur [À VALIDER] :**
1. **Constituer une société** (Sàrl ou SA) — préalable à encaisser.
2. **Mandater un avocat suisse** pour valider d'abord la question **étroite** de
   l'abonnement (la plus urgente et la moins chère), puis, plus tard, la prime
   apporteur.
3. **Créer le projet Supabase** et renseigner les clés (local + Vercel).
4. **Nom de domaine** et décisions de prix finales.
5. **Fournir le contenu réel** dont tu es propriétaire (photos, entité légale).

**Ce que je pilote (moi + agents) :** le code de la face pro réelle, le tunnel
d'inscription pro, la vitrine publique, le copilote IA en situation, la
simulation d'abonnement, l'instrumentation, la QA, le design, la chasse aux
incohérences, les tests utilisateurs simulés. Puis l'accompagnement du
recrutement des 10–20 pilotes.

**Jalon de lancement :** 10–20 pilotes actifs sur la vraie base, retours
intégrés, premières conversions en payant (après Stripe + juridique).

---

## 10. Vision long terme et levée de fonds (livrable 10)

- **Garder l'ambition, séquencée.** La super-app et l'international ne sont pas
  abandonnés : ils sont la **récompense** d'une V1 réussie, pas son point de
  départ.
- **Ce qui rendrait E-Dome investissable [EST] :** des pros payants qui
  **restent** (rétention), des annonces réelles, du trafic consommateur sur les
  pages pros, et — surtout — le **début d'un effet de réseau** (V2/V3). L'angle
  **IA pour agents** est déjà fundable sur le marché suisse.
- **Quand lever :** pas maintenant. Quand il y a une traction mesurable (V2/V3)
  et un besoin de capital pour accélérer l'acquisition ou l'international.
- **Ne jamais construire pour impressionner un investisseur.** On construit pour
  des utilisateurs qui paient ; la levée suit la traction, pas l'inverse.

---

## 11. Décisions importantes (journal)

| Date | Décision | Statut |
|---|---|---|
| 2026-11-17 | Lancement **mono-wedge « E-Dome Pro »** (SaaS agents/agences romands + IA), reste en roadmap V2→V5 | **[VALIDÉ par le fondateur, 2026-11-17]** |
| 2026-11-17 | Parquer (sans supprimer) : apporteurs, boutique, événements/lives, courte durée ; différer formations/services/investisseurs | **[VALIDÉ, 2026-11-17]** |
| 2026-11-17 | Valider d'abord la question juridique **étroite** (abonnement), pas tout le modèle apporteur | **[RECO]** |
| (antérieur) | Backend = Supabase ; auth e-mail + Google ; paiements simulés d'abord | **[FAIT]** |
| 2026-11-18 | **PIVOT confirmé** : fin du wedge « SaaS agents » ; cœur = **apport d'affaires + transaction directe + paiements** ; modèle lançable sans avocat (courtage libre en CH, monétisation portail en frais fixes, jamais dépositaire → PSP). Voir **`MODELE.md`** | **[VALIDÉ, 2026-11-18]** |

### Sources de marché (§2)
- SMG / Swiss Marketplace Group, résultats 2025 et IPO : onlinemarketplaces.com, finanzen.ch, stockanalysis.com
- Agences immobilières suisses : business-monitor.ch, lookmove.ch (NehoCompass)
- PropTech CH 2025 : immo-invest.ch (SwissPropTech Report), startbase.com, venturekick.ch

*Fin du document. À mettre à jour à chaque transformation du périmètre ou du
modèle.*
