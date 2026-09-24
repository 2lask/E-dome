# À faire

> Mis à jour pendant la reprise `feat/plateforme-v2`. Les entrées barrées sont
> faites ; elles restent visibles avec ce qui a été trouvé en chemin, parce que
> plusieurs diagnostics de ce fichier se sont révélés faux.

Ce qui a été volontairement laissé de côté, avec de quoi le reprendre sans
refaire l'enquête. Chaque entrée porte le chemin du fichier et ce qui a été
vérifié.

---

## Dette technique

### ~~Migration `middleware` → `proxy`~~ — FAIT (étape 1)

`next build` et `next dev` affichent l'avertissement à chaque lancement :

> The "middleware" file convention is deprecated. Please use "proxy" instead.

La migration est mécanique : renommer `src/middleware.ts` en `src/proxy.ts` et
exporter `proxy` (nommé ou par défaut) ; `config.matcher` est inchangé. Un
codemod existe : `npx @next/codemod@canary middleware-to-proxy .`

Elle touche la plomberie d'authentification en production
([src/lib/supabase/middleware.ts](src/lib/supabase/middleware.ts) contient la
liste des routes publiques) : à faire dans sa propre branche, avec une
vérification que `/admin` reste protégé et que `/merci`, `/admin/leads`,
`/confidentialite` restent atteignables sans session.

### ~~`appleWebApp`~~ — FAIT (étape 1), et le diagnostic était faux

Second avertissement à chaque build : « Use appleWebApp instead ». Vient des
métadonnées du layout racine. Correctif court, à grouper avec la migration
ci-dessus.

### ~250 lignes de CSS orphelin

[src/app/globals.css](src/app/globals.css) conserve les styles de l'ancienne
landing : l'accent teal `--ed-accent`, les classes `.ed-cta-*` et `.holo-*`.
**Zéro usage** dans le code — vérifié par recherche sur l'ensemble de `src/`.
Ce teal n'existe nulle part dans la maquette actuelle.

### Collision de jetons de couleur

`--text-secondary` et `--text-muted` ont la même valeur : la hiérarchie
typographique prévue par le design n'existe donc pas à l'écran. Décider
laquelle des deux bouge, ou fusionner les deux jetons.

---

## ~~Incohérences de données~~ — traitées à l’étape 2

Le journal unique (`src/lib/demo/ledger.ts`) et l’identité unique
(`src/lib/demo/identity.ts`) ont supprimé, par construction :

- **le facteur 5 sur les revenus** — les deux moteurs lisent la même table ;
- **les trois montants de `/dashboard`** — le KPI douze mois, la série et le
  revenu du mois se déduisent l’un de l’autre, et `npm run test:data` le
  vérifie ;
- **les huit identités d’utilisateur courant** — dont le bug du fil, où
  l’identifiant courant désignait Sophie ;
- **les biens, formations et produits inexistants** du tableau de bord ;
- **la collision `prop2`**, qui désignait deux biens différents selon la page ;
- **les dates incohérentes** — tout dérive de `DEMO_TODAY`.

Restent ouvertes, parce qu’elles demandent un arbitrage et non un mécanisme :

### « 16 annonces actives » compte autre chose que des annonces

`activeListingsCount` additionne devis de service et alertes de stock aux
annonces. À trancher : ce que « annonce active » doit désigner.

### Vues : deux comptages

5 060 au tableau de bord contre 13 322 dans les annonces. Le tableau de bord
dérive désormais ses vues des nuits vendues ; `/dashboard/annonces` garde les
siennes.

### `/apporteurs` : un second tableau de montants, en dur

[src/app/(app)/apporteurs/page.tsx](src/app/(app)/apporteurs/page.tsx) —
`MOCK_APPORTS` et `MOCK_VERSEMENTS` portent des francs écrits à la main,
**datés de mars 2026** quand la démonstration est en septembre, et sans lien
avec `src/lib/demo/ledger.ts`. C'est le défaut qu'a supprimé l'étape 2, à un
endroit qu'elle n'a pas touché : `apporteurSummary.earnedThisMonth` dérive du
journal, ces deux tableaux non.

Trouvé pendant le balayage de traction de l'étape 3, et laissé de côté parce
que ce n'est pas une affirmation sur E-Dome — ce sont les gains propres de
l'utilisateur, que la règle de tri garde. À reprendre avec le journal : le
détail des apports se déduit des écritures de source `apporteurs`.

### `/reseau` : l'onglet « Abonnés » affiche tout l'annuaire

[src/app/(app)/reseau/page.tsx:77](src/app/(app)/reseau/page.tsx)

### Notifications : trois comptes différents

Pastille « 3 » en dur dans la barre latérale, « Aucune nouvelle notification »
dans le menu de l'en-tête, 10 éléments dont 5 non lus sur `/notifications`.

### ~~Admin : « 12 signalements ouverts » pour 2 réels~~ — FAIT (étape 3)

[src/app/(app)/admin/page.tsx](src/app/(app)/admin/page.tsx) — les quatre
compteurs de la console se calculent maintenant **sur l'état**, pas sur les
constantes : résoudre un signalement fait bouger le chiffre. Au passage, les
trois qui affirmaient une traction d'E-Dome (2 847 utilisateurs, 1 253 biens,
387 500 CHF de chiffre d'affaires) ont été retirés.

### ~~Réservations : deux jeux de biens disjoints~~ — constat erroné

Vérifié : ce sont **les mêmes cinq réservations**, renommées et décalées de
un à quatre mois. `/dashboard/reservations` dérive maintenant du journal ;
`/reservations` (vue voyageur) reste à reconstruire, parce que son
utilisateur y est encore l’hôte de ses propres biens.

---

## Sécurité

### `/admin` reste atteignable sans compte

Le middleware laisse tout passer tant que Supabase n'est pas configuré, ce qui
est le cas en production. La console d'administration — adresses e-mail,
signalements de harcèlement — est donc publique.

Un bandeau « Données d'exemple » a été ajouté pour qu'aucun chiffre ne soit
pris pour réel, **mais ce n'est pas une porte**. Il faut soit la protéger
comme `/admin/leads` (mot de passe serveur, cf.
[src/lib/leads/admin-auth.ts](src/lib/leads/admin-auth.ts)), soit la retirer
de la démonstration publique.

### `/api/ai/chat` : ni authentification, ni vraie limite

Le point d'accès appelle l'API Anthropic avec la clé du projet, sans vérifier
qui appelle. Son compteur souffre du même défaut que celui du formulaire avant
correction : il vit en mémoire du processus.

Le correctif existe maintenant à côté : la table `lead_submissions` et
`allowSubmission` dans [src/lib/leads/rate-limit.ts](src/lib/leads/rate-limit.ts)
se généralisent sans peine.

### Panneau de flux d'argent : poser sur les autres écrans de transaction

Le composant `src/components/pricing/money-flow.tsx` est posé sur
`/explorer/[id]` (location courte durée). Le plan (étape 5) le veut aussi sur
`/paiement`, les fiches marchandes de la boutique, et `/apporteurs`. Chaque
pose demande un `Charge` adapté au contexte de l'écran ; le composant, lui, est
prêt et générique.

### `maplibre-gl` : faille XSS connue

Correction disponible en version 6, majeure et avec ruptures. À planifier.

---

## Contenus à réexaminer

### ~~Compteurs d'engagement du post épinglé~~ — FAIT (étape 3)

Le post de bienvenue affichait 4 521 « j'aime » et trois témoignages
fabriqués. Retirés : `likes: 0` et `comments: []` suffisent, parce
qu'`ActionBtn` n'affiche pas un compteur nul.

Trouvé en chemin, et corrigé aussi : le post était **signé par
l'utilisateur de démonstration**, devenu un propriétaire lausannois à
l'étape 2. Un avis de la plateforme signé par lui ramenait la confusion que
l'étape 2 avait retirée du profil. Il vient maintenant d'un compte `E-Dome`,
et il est épinglé pour de bon : le tri par date le reléguait en cinquième
position, donc le lecteur croisait les exemples avant l'avertissement.

### ~~Actualités du feed~~ — FAIT (étape 3)

Les cinq brèves inventées (« la BNS maintient son taux à 1,5 % », « le m²
dépasse 14 500 CHF à Genève ») sont devenues les **sujets** que la veille
couvrira : plus un chiffre, plus une date. Le bloc s'intitule « Sujets
suivis » et dit qu'aucune dépêche n'est publiée.
