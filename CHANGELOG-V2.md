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

## Plan priorisé P0→P7 — « rendre la plateforme vivante » (reprise 2026-11)

*Deuxième moitié de la Mission 2. L'ordre suit l'impact, pas les écrans un par
un : d'abord les systèmes dont tout dépend, les détails à la fin. Un commit par
chantier, portes vertes et vérification à l'écran à chaque fois. Bilan complet
dans `RAPPORT-FINAL-2.md`.*

- **P1 — Le casting des seize** (`84ef578`) : seize personnes réelles et
  cohérentes (Léo … Amina), 25 biens sur des lieux réels, graphe d'abonnés,
  avis réciproques liés à des transactions, agence Hartmann et sa vraie équipe.
- **P2bis — Le fil vivant** (`da29da7`) : 44 posts sur trois semaines, seize
  voix distinctes (dont une qui écrit court et mal, une débutante, une qui
  doute), compteurs de « j'aime » vrais.
- **P2 — Le moteur d'interactions** (`a6e40fb`) : une mémoire de session unique
  où chaque clic laisse une trace (publier, contacter, devis, postuler,
  réserver, offrir, favoris), messagerie qui relie, notifications dérivées des
  événements avec un seul compteur.
- **P4b — La boutique en affiliation** (`9fa6da7`) : fin du panier, du paiement
  et de la garantie E-Dome ; « Vous quittez E-Dome pour <marchand> » sans URL
  inventée ; avis non liés à un achat retirés ; le journal ne crédite plus Léo
  des ventes d'un marchand tiers (invariant 20).
- **P3 — Être un profil** (`84f4d28`) : on entre dans la peau d'une des seize
  personnes ; identité, navigation, tableau de bord, messages et notifications
  suivent, y compris un tableau de bord utile pour qui n'a aucun bien.
- **P4a — Le modèle économique visible** (`0b39c70`) : activation de la prime
  biens sur `/publier` (prime fixe en CHF, jamais un % du prix, 12 % E-Dome),
  espace apporteur Biens/Marketplace/Abonnements d'une source unique,
  restriction France visible, freemium en valeurs de catalogue, `/tarifs` par
  rôle, changement de formule et garde-fous d'agence.
- **P6a — Services et Formations** (`31fa4c5`) : fiche service par prestataire
  réel, parcours devis→paiement→avis ; leçons propres à chaque formation,
  progression dérivée, certificat de démonstration à 100 %.
- **P6b — Location, investisseurs, recherche** (`117ace1`) : « Demander une
  visite » et prix au mois en longue durée, offre d'achat avec le panneau « qui
  paie quoi », pôle investisseurs calculé, recherche en texte libre tokenisée.
- **P6c — Événements, admin, apporteurs** (`21bc1a5`) : organisateurs réels et
  dates cohérentes, `/live` du point de vue de l'acteur, admin aligné sur le
  casting (« Volume de transactions 2026 »), tuile apporteur et espace de la
  même source, reliquats boutique retirés.
- **P5 — Le tutoriel guidé** (`8c4bb8a`) : mise en lumière en portail,
  cinq parcours (découverte + par rôle), compteur d'étapes, « Passer »,
  reprise, lancement automatique à la première visite, version mobile ;
  « Mode explicatif » devient « Glossaire ».
- **P7 — Finitions** (`8d99a9c`) : faux liens cal.com → support interne, fin des
  notes « 0 (0 avis) » (« Nouveau » sinon), noms accessibles sur les avatars.

---

## Portes de qualité (au dernier commit, 2026-11-12)

`npm run typecheck` 0 · `npm run build` compilé (toutes routes) ·
`npm run test:data` **113/113** · audit runtime Playwright : 29 routes × 2
tailles (360 px et 1280 px) + passes par persona, **aucune erreur de page,
aucun débordement horizontal, aucune image cassée**. Déploiement Vercel de la
préproduction au vert.

## Ce qui reste ouvert

Voir `RAPPORT-FINAL-2.md` (bilan, décisions prises seul, points ouverts, les
trois points les moins satisfaisants) et `JURIDIQUE-A-VALIDER.md` (affiliation
et points à confirmer par l'avocat).
