# CHANGELOG — Reprise de la plateforme (V2)

Branche `feat/plateforme-v2`, partie de `master`. Un thème par section, l'ordre
des étapes. Chaque changement dit ce qu'il corrige et pourquoi. Les identifiants
entre parenthèses sont les commits.

> **Rien n'est encore fusionné.** Tout se valide sur l'URL de préproduction de
> la branche. La landing en production (`edome-demo.vercel.app`) n'a pas bougé.

---

## Fondations — le modèle de domaine (étape 1)

*Aucun changement visible ; tout le reste en dépend.*

- **`src/lib/model/`** : quatre axes d'identité distincts — `PlatformRole` (ce
  qu'on peut faire), `ProviderTrade` (ce qu'on vend), `ProfileInterest` (ce à
  quoi on s'intéresse, aucun droit), et les `RoleGrant`. Un centre d'intérêt
  n'ouvre jamais un écran. (`8aa382d`)
- **Les quatre règles deviennent un objet du modèle** (`PLATFORM_RULES`), avec
  pour chacune son libellé, sa base légale et son pourquoi. Un seul composant
  les affiche, et il les affiche **toutes les quatre** — il n'existe aucun moyen
  d'en montrer une seule. Traduction en code de la réserve sur D1 : la règle 3
  (conditionnalité, art. 413) ne protège de rien sans les règles 1 et 2
  (activité, art. 412).
- **Moteur tarifaire** : `Charge` discriminé par mécanisme, `quote()` qui
  produit un `MoneyFlow` dont l'invariant `brut = bénéficiaire + E-Dome + frais`
  est vérifié dans la fonction. `CommissionPole` **exclut** `vente` et
  `location-lt` : facturer une commission sur une vente devient une erreur de
  compilation.
- **Migration `middleware` → `proxy`** (Next 16), matcher restreint à `/admin`
  et `/dashboard`. (`1858e8a`)
- **`appleWebApp`** : avertissement supprimé, balises en double retirées — après
  quatre diagnostics, le bon étant tiré des sources de Next. (`aaa10a4`, `bd64e5e`)

## La vérité des chiffres (étape 2)

*Le facteur 5 sur les revenus disparaît. Toujours aucun écran neuf.*

- **Un journal unique** (`src/lib/demo/ledger.ts`) : le seul endroit du dépôt où
  vit un montant. Le revenu du mois, la série sur douze mois, la répartition par
  source se **calculent** à partir de lui. (`a59cedc`)
- **Invariants levés à l'import** : `next build` échoue si deux chiffres
  divergent. Messages réparables en une minute (fichier + les deux valeurs), et
  porte de secours `EDOME_INVARIANTS=warn` documentée au README. Deux invariants
  qui se comparaient à eux-mêmes ont été remplacés par deux qui mordent. (`c4aff3e`)
- **Une seule identité d'utilisateur courant** : de huit identités
  contradictoires à un particulier lausannois. (`de5d6bc`, `5f8c135`)
- **`npm run test:data`** : 18 assertions sous `node --test`, zéro dépendance.

## Le fil, et sa crédibilité (étape 3)

- **`/feed` (3 232 lignes) éclaté en douze fichiers** ; **`/creer-post` fusionné**
  — un troisième catalogue de biens supprimé, avec sa collision `prop2`.
  (`451a157`, `f0db803`)
- **L'avis d'accueil épinglé** signé par un compte `E-Dome`, sans compteur ni
  faux témoignages, non tronqué. Les brèves de marché inventées deviennent des
  sujets de veille sans chiffre. (`39f800e`)
- **Balayage de traction** : les compteurs de `/admin` (chiffre d'affaires,
  utilisateurs) et le classement nominatif des apporteurs (montants versés)
  retirés. (`f0030ef`)

## Ce qui se voit enfin (étape 4)

*Premier écran neuf. Le critère des trente secondes devient atteignable.*

- **`/demo`**, la porte d'entrée : sept pôles avec statut · qui paie quoi, avant
  les portes · trois portes. La landing et le conteneur mobile y mènent.
  (`33c9b31`, `2223d8f`)
- **Sélecteur de rôle** : la plateforme se visite entière en huit clics
  (particulier, propriétaire, hôte, agence, prestataire, créateur, apporteur,
  admin). `viewingAs` découplé des droits. (`f4e33a2`)
- **Bandeau-légende permanent** : la mention « données d'exemple », la légende
  des statuts, le sélecteur de rôle — sur toutes les routes. (`f4e33a2`)
- **Mode explicatif** : un « ? » sur les pôles ; au clic, ce qu'ils seront et ce
  qu'E-Dome y gagne. (`f77e1bc`)
- **250 lignes de CSS orphelin retirées**, collision `--text-secondary` /
  `--text-muted` levée. (`688fc42`)

## Les parcours du particulier (étape 5)

- **`/vendre`** : deux façons de vendre, six lignes alignées, « 0 CHF à E-Dome »
  des deux côtés, les quatre règles ensemble en pied. (`23f6a69`)
- **`/vendre/accompagnement`** : comparer trois propositions anonymes, ouvrir le
  contact soi-même — l'inversion du sens de circulation d'un marché de leads.
  (`f9ca9b5`)
- **Panneau de flux d'argent** : un composant unique alimenté par `quote()`, la
  ligne « frais de paiement » toujours visible. **La commission courte durée
  cesse d'être ajoutée au prix du voyageur.** (`3aa6731`)
- **`/publier`** : l'étape de frais devient un écran d'**obligations** (loyer
  initial, autorisation, Lex Koller, numéro d'enregistrement). (`e2a0bcb`)

## L'Espace agence et les abonnements (étape 6)

*La principale source de revenu, construite pour de vrai.*

- **Six routes agence** : hub, demandes (la distribution vue côté agence),
  abonnement, page publique, équipe, mandats, statistiques. (`c33eef8`)
- **`/tarifs` générée depuis le module** : elle ne peut pas afficher un tarif que
  le catalogue ne porte pas. Quatre formules agence (Régie en « Ensuite »),
  Patrimoine côté propriétaire. (`fb95f63`)

## Les textes juridiques (étape 7)

- **`/conditions` réécrites en treize sections** : les quatre règles en **§2, en
  toutes lettres, avant les prix**, composées depuis le modèle. Le glossaire
  corrigé (« Commission » ne contredit plus la règle 3 ; hôte ≠ vendeur). Le
  barème du §6 généré depuis `RATES`. (`96b7041`)
- **`/aide`** : la réponse unique sur le barème éclate en trois questions
  générées depuis le module.

## Boutons morts, garde-fous, visite guidée (étape 8)

- **Les ROI passent en indicatif** : couleur neutre, libellé « (indicatif) »,
  fin du vert qui se lisait comme un gain garanti. (`4985659`)
- **Boutons morts réveillés** ; **`no-traction-claims.spec.ts`** : quatre
  épreuves qui empêchent le retour des affirmations de traction retirées.
- **La visite guidée** : six arrêts qui traversent la plateforme et pilotent le
  sélecteur de rôle, persistante d'une route à l'autre. (`a179a17`)

---

## Portes de qualité (au dernier commit)

`npm run typecheck` 0 · `npm run lint` 0 erreur · `npm run build` 66 pages ·
`npm test` 13/13 Playwright · `npm run test:data` 18/18.

## Ce qui reste ouvert

Voir `TODO.md` (reliquat de l'étape 8, sécurité de `/admin`, panneau de flux à
étendre) et `JURIDIQUE-A-VALIDER.md` (les points à confirmer par l'avocat).
