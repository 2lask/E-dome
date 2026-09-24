# PLAN DE TRAVAIL

Branche `feat/plateforme-v2`. Un commit par étape. Après chaque étape : `lint`,
`typecheck`, `build`, et les épreuves existantes — verts, sans exception.

---

## ▶ POINT DE REPRISE — mis à jour à chaque commit

> Pour qui ouvre le dépôt sans contexte. Lisez ce bloc, puis l'étape en cours.

**Où on en est.** Étapes 1, 2, 3, 4, 5, 6, **7 faites**. L'étape 4 a livré : `/demo`
(premier écran neuf), les liens landing + mobile qui y mènent, le sélecteur de
rôle (visite en cinq minutes, 8 rôles), le bandeau-légende permanent, le mode
explicatif avec panneau au clic sur les statuts, le nettoyage du CSS orphelin
(−250 lignes) et de la collision `--text-secondary` / `--text-muted`.

**Ce qui vient après.** Étape 8 (**en cours**, la dernière), **sans pause de
validation** (feu vert donné). Boutons morts, ROI indicatifs, épreuves
Playwright de non-régression, et la visite guidée en dernier.

**Consignes fondateur en vigueur, à ne pas perdre :**
- **La règle de tri** (phase A) : les données *d'un utilisateur* restent
  fictives (ses revenus, ses réservations) ; toute affirmation sur *E-Dome
  elle-même* (inscrits, montants versés, indice de marché, deals) dégage.
- **Les quatre règles ensemble** : rien n'affiche la seule règle 3. Elles sont
  un objet du modèle (`src/lib/model/rules.ts`), affichées toutes les quatre.
- **Frais directs** par défaut ; la ligne « frais de paiement » du flux d'argent
  reste visible partout — c'est un arbitrage encore ouvert chez l'avocat, voir
  `JURIDIQUE-A-VALIDER.md`.
- **Direction visuelle de `/demo`** comme référence pour tout écran neuf, pour
  que l'ensemble se ressemble.
- **Le sélecteur de rôle doit montrer toute la plateforme en cinq minutes** :
  ce parcours se teste soi-même avant de déclarer l'étape finie.
- **La landing reste par ailleurs gelée** (`/`, `/merci`, `/confidentialite`,
  `/admin/leads`, la couche leads, `src/content/landing.ts`) : les liens `demo`
  ont été la seule exception autorisée. Toute autre nécessité de la toucher →
  s'arrêter et demander.
- **Pousser après chaque commit** sur `origin/feat/plateforme-v2`, et donner
  l'URL de préproduction avec ce qu'il faut y regarder.

**Portes de qualité** (toutes vertes au dernier commit) :
`npm run typecheck` · `npm run lint` (0 erreur ; les warnings sont de la dette
existante documentée) · `npm run build` · `npm test` (Playwright 9/9) ·
`npm run test:data` (18/18). Les invariants de démonstration sont levés à
l'import — un chiffre incohérent fait échouer `next build` ; voir README,
« Pourquoi mon build échoue ».

**Attribution des commits** : `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

**Dernier commit au moment d'écrire** : `96b7041` (CGU 13 sections — étape 7 terminée).

---

> **Révision 2**, après les amendements du fondateur. Ce qui change dans le
> plan : les **quatre règles** deviennent un objet du modèle, affichées
> ensemble et jamais séparément (étapes 1, 5, 7) · les **frais directs** sont
> le défaut, la ligne « frais de paiement » devient visible partout (étapes 1
> et 5) · un quatrième axe `ProfileInterest` entre au modèle (étape 1) · le
> **glossaire** des conditions est corrigé au même titre que le §5 (étape 7) ·
> `JURIDIQUE-A-VALIDER.md` est tenu à jour à chaque étape qui touche un point
> ouvert.

Les quatre routes protégées par la consigne A.3 — `/`, `/merci`,
`/confidentialite`, `/admin/leads` — sont couvertes par un test de fumée dès
l'étape 1. Elles cessent ainsi de dépendre de l'attention.

**Ordre directeur** : rien de neuf ne s'affiche tant que les chiffres peuvent se
contredire. C'est l'arbitrage du §7.5 de `DECISIONS.md` — un sélecteur de rôle
ou un mode explicatif posés sur des données incohérentes **multiplient** les
contradictions au lieu de les révéler. Le premier écran neuf arrive à l'étape 4,
soit après trois commits.

---

## Étape 1 — Fondations

*Aucun changement visible. Tout le reste en dépend.*

- `src/lib/model/` : `PlatformRole` (11 valeurs), `ProviderTrade`,
  **`ProfileInterest`** (quatrième axe — un centre d'intérêt n'ouvre jamais un
  écran), `RoleGrant` avec portée, `Account`, `Agency` / `AgencyMember` /
  `Mandate` / `VisitSlot` / `DocumentRef`, `Subscription`, `FeatureStage`, et
  les champs de conformité. `types.ts` survit en coquille de ré-exports, sinon
  l'étape casse tout le dépôt d'un coup.
- **Les quatre règles deviennent un objet du modèle**, pas une phrase recopiée :
  un `PLATFORM_RULES` typé, avec pour chacune son libellé et sa base. Un seul
  composant les affiche, et il les affiche **toutes les quatre** — il n'existe
  aucun moyen d'en montrer une seule. C'est la traduction exécutable de la
  réserve sur D1.
- `src/lib/pricing/` : `Charge` (abonnement · commission · forfait · CPM ·
  prime), `quote()`, `MoneyFlow` avec son invariant vérifié dans la fonction,
  `PLANS` / `RATES` / `ONE_OFFS` en **données** — tarif fondateur créateur
  compris, comme une ligne datée et non comme un cas particulier de code.
  `CommissionPole` exclut `vente` et `location-lt` : la règle 3 devient une
  erreur de compilation. Enveloppes dépréciées pour que les dix importateurs
  compilent inchangés.
- **`MoneyFlow` porte `psp` comme ligne distincte et visible**, pas comme un
  détail replié : c'est ce qui permet de basculer entre frais directs et frais
  destinataires sans réécrire un écran. Défaut retenu : **frais directs**.
- Suppression de `AGENCY_REVENUE_SHARE_LABEL`, et réécriture de l'en-tête de
  `pricing.ts`, dont l'affirmation sur l'assiette du courtage est fausse.
- `middleware` → `proxy` par le codemod, **et matcher restreint à `/admin` et
  `/dashboard`** — sans quoi le jour où la clé anonyme Supabase apparaît, toute
  la maquette redirige vers l'écran de connexion.
- Triple déclaration `appleWebApp` dans `layout.tsx` : bloc manuel supprimé.
- Les six `rules-of-hooks` : un seul bug, dans `formations/[id]/page.tsx`.
- Validation de `storedRole` au chargement du contexte, aujourd'hui absente.
- **Test de fumée** sur les quatre routes protégées.

**Risque** : le renommage `Role` → `PlatformRole`. C'est précisément ce que le
test de fumée couvre.

---

## Étape 2 — La vérité des chiffres

*Le facteur 5 disparaît. Toujours aucun écran neuf.*

- `src/lib/demo/` : journal d'écritures, agrégats dérivés par fonctions pures,
  **invariants levés à l'import** — `next build` échoue si deux chiffres
  divergent.
- **Identité unique** : `DEFAULT_PROFILE` devient `user-001`, un particulier
  lausannois, trois rôles cumulés, **plus le fondateur d'E-Dome**. Les sept
  autres identités en dérivent ou disparaissent.
- Données de démonstration refaites : **18 personnes** couvrant les onze rôles,
  **12 biens** dont 3 à l'utilisateur courant, 6 formations, 8 produits,
  4 événements. Cinq histoires vérifiables de bout en bout. `DEMO_TODAY` d'où
  toutes les dates dérivent.
- `dashboard-data.ts` et `revenue-data.ts` réduits à des enveloppes : les pages
  du tableau de bord ne changent pas d'une ligne.
- **Les douze assertions d'intégrité** via `node --test` — zéro dépendance
  nouvelle, `npm run test:data`.
- Suppression des ~600 lignes de données orphelines.

**Ce qui se lira comme une régression dans le diff** : deux gros fichiers
réduits à des enveloppes. C'est le but.

---

## Étape 3 — Découpage de `/feed`, et sa crédibilité — FAIT

*Déplacement pur, plus les corrections qui vivent dans ce fichier.*

- `/feed` (3 232 lignes) **éclaté en douze fichiers** : `demo/posts.ts`,
  `components/feed/media/` (vidéo, image, galerie, formats), `post-card.tsx`,
  `attach-cards.tsx`, `composer/` (actions, événements, listes), `sparkline.tsx`.
  Il reste 1 029 lignes d'état et de composition. Imports calculés d'après
  l'usage réel, pas devinés — un import mort est une erreur de lint ici.
- `/creer-post` **fusionné**, pas découpé : il redéclarait le composer et un
  **troisième catalogue de biens**, avec une quatrième collision `prop2`
  (penthouse à 950 000 CHF contre le studio genevois à 120 CHF). Biens, villes,
  mentions et mots-dièse dérivent maintenant des données du fil. Ce commit
  supprime du code.
- Le **post épinglé** : ni compteur ni faux témoignages, signé par un compte
  `E-Dome` et non plus par l'utilisateur de démonstration, épinglé pour de bon
  (le tri par date le reléguait cinquième), et non tronqué (l'avertissement
  disparaissait derrière « Voir plus »).
- Les **brèves de marché** deviennent des sujets de veille, sans chiffre ni
  date. Bloc « Sujets suivis ».
- **Balayage de traction demandé** : trouvé et corrigé ailleurs — les quatre
  compteurs de `/admin` (2 847 utilisateurs, 387 500 CHF de CA) et le classement
  nominatif des apporteurs (4 200 CHF versés). Aucun indice de marché ne
  subsiste. Ce qui reste (inscrits d'un live, demandes de visite d'une annonce)
  relève des données d'un utilisateur, que la règle de tri garde.

*Ajouté en chemin, hors plan* : l'icône (option B, PNG 180×180 depuis le SVG,
`npm run icons`, sans dépendance) ; et le second garde-fou des invariants —
messages nommant fichier et valeurs, porte de secours `EDOME_INVARIANTS=warn`,
section README « Pourquoi mon build échoue ». Deux invariants qui s'écrivaient
`x === x` remplacés par deux qui mordent.

---

## Étape 4 — Ce qui se voit enfin — FAIT

*Premier écran neuf. Le critère des trente secondes devient atteignable.*

- **FAIT** — `src/content/demo.ts` : le texte de `/demo`, écrit d'emblée. Les
  autres fichiers de contenu (`common`, `explain`, `roles`, `offer`) se créent
  quand l'écran qui les consomme arrive, pas en passe dédiée.
- **FAIT** — **`/demo`**, la porte d'entrée : trois blocs (les sept pôles avec
  statut · qui paie quoi, avant les portes · trois portes). `demo.href` de la
  landing, le lien de pied, le bandeau « En savoir plus » et l'URL du conteneur
  mobile y pointent (commit `2223d8f`).
- **FAIT** — Jetons de statut `--stage-later` / `--stage-vision`, un par thème,
  décidés à un seul endroit.
- **À FAIRE** — **Sélecteur de rôle**, branché sur le `setActiveRole` qui existe
  déjà et que personne n'appelle. `viewingAs` découplé des droits. *Doit montrer
  toute la plateforme en cinq minutes — parcours à tester soi-même.*
- **À FAIRE** — **Statuts** portés par la donnée, panneau d'explication au clic,
  **bandeau-légende permanent** fusionné avec la mention « données fictives » —
  qui passe de 10 px à une hauteur lisible. (Le jeton de gris est déjà là.)
- **À FAIRE** — **Mode explicatif** : actif par défaut mais replié, une seule
  bulle ouverte, plafond de six puces par écran.
- **À FAIRE** — Au passage : CSS orphelin supprimé, collision
  `--text-secondary` / `--text-muted` levée — une ligne par thème, zéro site
  d'appel.

---

## Étape 5 — Les parcours du particulier — FAIT (panneau de flux à étendre, cf. TODO)

- **`/vendre`** : deux routes plus une en complément, six lignes alignées par
  carte, « 0 CHF à E-Dome » des deux côtés en plus gros caractère de l'écran.
- **`/publier` change de nature** : l'écran de tarification disparaît pour la
  vente et la location longue durée, et devient un écran d'**obligations** —
  formule officielle du loyer initial, autorisation du propriétaire, numéro
  d'enregistrement, information Lex Koller.
- **Panneau de flux d'argent**, composant unique, sur `/vendre`, `/publier`,
  `/explorer/[id]`, `/paiement`, les fiches marchandes et `/apporteurs` — avec
  sa ligne « frais de paiement » toujours visible, conséquence du défaut « frais
  directs ».
- Correction de la réservation courte durée : la commission cesse d'être
  **ajoutée** au prix payé par le voyageur.
- Pied de `/vendre` : **les quatre règles ensemble**, jamais la seule règle 3.
  Route « accompagné », la formulation exacte est « E-Dome ne signe aucun
  mandat, ne négocie aucun prix, et ne touche rien sur cette commission » — la
  version courte était trompeuse par omission.
- `/vendre/accompagnement` et son écran de comparaison des propositions.

---

## Étape 6 — L'Espace agence et les abonnements — FAIT

*La principale source de revenu. Elle se construit pour de vrai — pas de gris
sur cette brique.*

- `/agence/[slug]` publique, `/agence/equipe`, `/agence/mandats`,
  `/agence/demandes`, `/agence/abonnement`, `/agence/statistiques`.
- Les quatre paliers, dont Régie en statut « Ensuite ».
- `/tarifs`, **générée depuis le module** : elle ne peut donc pas mentir.
- Abonnement Patrimoine.
- La distribution des demandes : fiche anonyme, ordre chronologique, les agences
  postulent, le particulier ouvre le contact.

---

## Étape 7 — Les textes juridiques — FAIT

- `/conditions` réécrites en **13 sections**, les quatre règles avant les prix,
  **en §2 et en toutes lettres**. Six des dix sections actuelles posent
  problème, pas seulement le §5.
- **Le glossaire du §2 actuel est corrigé au même titre que le tableau du §5** :
  il définit « Commission » comme « pourcentage prélevé par la Plateforme sur
  les transactions réalisées » — la règle 3 contredite dans les définitions — et
  confond l'hôte de courte durée avec le vendeur, c'est-à-dire la distinction
  sur laquelle repose tout le modèle.
- La **règle 4 dans sa formulation exacte**, vraie quel que soit le schéma
  d'encaissement retenu, et non dans sa version catégorique.
- `/aide` : la réponse unique sur le barème éclate en trois questions, générées
  depuis le module.
- Les quatre mentions visibles sans interaction, aux trois emplacements
  autorisés.
- Les formulations de l'apporteur, et la restriction `pays × type d'apport`.
- Mise à jour de `JURIDIQUE-A-VALIDER.md` avec ce que la rédaction aura révélé.

---

## Étape 8 — Boutons morts, épreuves, visite guidée

- Les 14 boutons sans gestionnaire, en priorité les quatre « Exporter ».
- Les ROI en vert sur les 22 biens deviennent indicatifs, ou disparaissent.
- Les encarts pointant vers cinq adresses inexistantes.
- Les indicateurs de `/admin` dérivés, et la route protégée.
- Six épreuves Playwright : cohérence du tableau de bord, identité,
  **`no-dead-buttons`**, flux d'argent, **`no-traction-claims`**, plus
  `interest-form` conservée telle quelle.
- **La visite guidée en dernier** : elle dépend des écrans qu'elle traverse.

---

## Hors étapes

`maplibre-gl` : montée en version majeure, commit isolé, après les huit étapes.
Un « critique » sur un dépôt montré à des investisseurs ne s'oublie pas, mais
une montée majeure de bibliothèque de cartes au milieu d'une migration de modèle
n'achète rien.

---

## Ce qui reste ouvert

1. **Les questions de `JURIDIQUE-A-VALIDER.md`.** Aucune ne bloque les étapes 1
   à 6 : le modèle représente les deux schémas d'encaissement, et les textes
   juridiques n'arrivent qu'à l'étape 7. La seule qui presse est le **numéro
   d'enregistrement UE pour la courte durée**, exigible depuis mai 2026 — le
   champ est posé dès l'étape 1.
2. **Le périmètre.** Huit étapes, c'est une reprise complète. Si vous voulez
   voir quelque chose plus tôt, l'ordre des étapes 5 et 6 peut s'inverser —
   mais pas celui des étapes 1 à 4.
3. **`feat/landing`.** Ce chantier part de cette branche et peut avancer sans
   attendre sa fusion. Le détail est dans la réponse jointe.
