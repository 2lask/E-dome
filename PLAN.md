# PLAN DE TRAVAIL — en attente de validation

Branche `feat/plateforme-v2`. Un commit par étape. Après chaque étape : `lint`,
`typecheck`, `build`, et les épreuves existantes — verts, sans exception.

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

- `src/lib/model/` : `PlatformRole` (11 valeurs), `ProviderTrade`, `RoleGrant`
  avec portée, `Account`, `Agency` / `AgencyMember` / `Mandate` / `VisitSlot` /
  `DocumentRef`, `Subscription`, `FeatureStage`, et les champs de conformité.
  `types.ts` survit en coquille de ré-exports, sinon l'étape casse tout le dépôt
  d'un coup.
- `src/lib/pricing/` : `Charge` (abonnement · commission · forfait · CPM ·
  prime), `quote()`, `MoneyFlow` avec son invariant vérifié dans la fonction,
  `PLANS` / `RATES` / `ONE_OFFS` en **données**. `CommissionPole` exclut `vente`
  et `location-lt` : la règle 3 devient une erreur de compilation. Enveloppes
  dépréciées pour que les dix importateurs compilent inchangés.
- Suppression de `AGENCY_REVENUE_SHARE_LABEL`.
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

## Étape 3 — Découpage de `/feed`, et sa crédibilité

*Déplacement pur, plus trois corrections qui vivent dans ce fichier.*

- `/feed` (3 130 lignes) éclaté : identité, posts, composants média, carte de
  post, composer, sparkline. Il reste ~250 lignes d'état et de composition.
- `/creer-post` **fusionné**, pas découpé : il redéclare le composer et un
  troisième catalogue de biens. Ce commit supprime du code.
- Au passage, parce que c'est le même fichier : le post épinglé perd tout
  compteur, ses trois faux témoignages deviennent des questions produit, et les
  brèves de marché deviennent des catégories de veille sans chiffre ni
  horodatage.

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
  `/explorer/[id]`, `/paiement`, les fiches marchandes et `/apporteurs`.
- Correction de la réservation courte durée : la commission cesse d'être
  **ajoutée** au prix payé par le voyageur.
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

- `/conditions` réécrites en **13 sections**, les quatre règles avant les prix.
  Six des dix sections actuelles posent problème, pas seulement le §5.
- `/aide` : la réponse unique sur le barème éclate en trois questions, générées
  depuis le module.
- Les quatre mentions visibles sans interaction, aux trois emplacements
  autorisés.
- Les formulations de l'apporteur, et la restriction `pays × type d'apport`.

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

## Ce qui reste à décider par vous

1. **Les six décisions du §0 de `DECISIONS.md`** modifient la Partie B. La plus
   structurante est **D1**, la reformulation de la règle 3 : elle touche une
   règle que vous avez qualifiée d'inviolable.
2. **`feat/landing` n'est ni fusionnée ni validée.** La préproduction attend vos
   variables d'environnement et votre test. Ce chantier est bâti dessus.
3. **Le périmètre.** Huit étapes, c'est une reprise complète. Si vous voulez
   voir quelque chose plus tôt, l'ordre des étapes 5 et 6 peut s'inverser —
   mais pas celui des étapes 1 à 4.
