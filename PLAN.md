# PLAN DE TRAVAIL — en attente de feu vert

Branche `feat/plateforme-v2`. Un commit par étape. Après chaque étape : `lint`,
`typecheck`, `build`, et les épreuves existantes — verts, sans exception.

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

## Étape 4 — Ce qui se voit enfin

*Premier écran neuf. Le critère des trente secondes devient atteignable.*

- `src/content/` : `common`, `demo`, `explain`, `roles`, `offer` — textes
  **neufs**, écrits d'emblée. Les extractions de routes existantes suivent au
  fil des étapes, jamais en passe dédiée.
- **Sélecteur de rôle**, branché sur le `setActiveRole` qui existe déjà et que
  personne n'appelle. `viewingAs` découplé des droits.
- **Statuts** portés par la donnée, jeton de gris dédié, panneau d'explication
  au clic, **bandeau-légende permanent** fusionné avec la mention « données
  fictives » — qui passe de 10 px à une hauteur lisible.
- **`/demo`** : la porte d'entrée. `demo.href` de la landing y pointe, et l'URL
  du conteneur mobile suit.
- **Mode explicatif** : actif par défaut mais replié, une seule bulle ouverte,
  plafond de six puces par écran.
- Au passage : CSS orphelin supprimé, collision `--text-secondary` /
  `--text-muted` levée — une ligne par thème, zéro site d'appel.

---

## Étape 5 — Les parcours du particulier

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

## Étape 6 — L'Espace agence et les abonnements

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

## Étape 7 — Les textes juridiques

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
