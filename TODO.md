# À faire

Ce qui a été volontairement laissé de côté, avec de quoi le reprendre sans
refaire l'enquête. Chaque entrée porte le chemin du fichier et ce qui a été
vérifié.

---

## Dette technique

### Migration `middleware` → `proxy` (Next 16)

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

### `appleWebApp` déprécié

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

## Incohérences de données restantes

Toutes constatées, aucune corrigée. Celles qu'un visiteur rencontre en
cliquant — formations, biens du feed, replays — ont été traitées ; il reste
celles qui demandent d'arbitrer sur les chiffres eux-mêmes.

### Revenus : facteur 5 entre deux fichiers

Les mêmes biens rapportent 24 850 CHF par mois dans
[src/lib/dashboard-data.ts](src/lib/dashboard-data.ts) et environ 4 800 dans
[src/lib/revenue-data.ts](src/lib/revenue-data.ts). Le total sur douze mois
affiche 66 938 d'un côté, 228 100 de l'autre.

À trancher : lequel des deux fichiers fait foi. Le modèle de commission, lui,
est désormais unifié dans [src/lib/pricing.ts](src/lib/pricing.ts) — c'est le
patron à suivre.

### « 16 annonces actives » compte autre chose que des annonces

[src/lib/dashboard-data.ts:346](src/lib/dashboard-data.ts) additionne les
devis de service et les alertes de stock aux annonces. `/dashboard/annonces`
en affiche 8, aux titres sans rapport.

### Vues : trois comptages contradictoires

5 060 au tableau de bord, 13 322 dans les annonces, 60 720 dans l'audience.

### Cinq identités « utilisateur courant »

`mock-data` (user-001, Neuchâtel), `profile-data` (« me », Lausanne), le feed
(`u1` = **Sophie** Martin), `messages` (« me ») et `dashboard-data` décrivent
cinq personnes différentes. C'est la racine de plusieurs incohérences d'auteur
dans le feed : un post signé Marc renvoie à une formation dont le formateur
est quelqu'un d'autre.

Chantier à part entière : il faut d'abord choisir qui est l'utilisateur de
démonstration, puis y ramener les cinq sources.

### `/reseau` : l'onglet « Abonnés » affiche tout l'annuaire

[src/app/(app)/reseau/page.tsx:77](src/app/(app)/reseau/page.tsx)

### Notifications : trois comptes différents

Pastille « 3 » en dur dans la barre latérale, « Aucune nouvelle notification »
dans le menu de l'en-tête, 10 éléments dont 5 non lus sur `/notifications`.

### Admin : « 12 signalements ouverts » pour 3 réels

[src/app/(app)/admin/page.tsx](src/app/(app)/admin/page.tsx) — le compteur est
en dur, `MOCK_SIGNALEMENTS` en contient 3 dont 2 ouverts.

### Réservations : deux jeux de biens disjoints

`/reservations` (vue voyageur) et `/dashboard/reservations` (vue hôte) portent
sur des biens différents.

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

### `maplibre-gl` : faille XSS connue

Correction disponible en version 6, majeure et avec ruptures. À planifier.

---

## Contenus à réexaminer

### Actualités du feed

[src/components/feed/market-pulse.tsx](src/components/feed/market-pulse.tsx),
tableau `NEWS` : cinq brèves de marché inventées mais crédibles (« Lex Koller :
nouvelles conditions dès 2026 », « la BNS maintient son taux à 1,5 % », « le m²
dépasse 14 500 CHF à Genève »).

Elles ne portent sur E-Dome — la règle de tri appliquée en phase A — et ont
donc été laissées. Elles restent des affirmations sur le monde réel, présentées
sans source. À remplacer par de vraies dépêches sourcées, ou à marquer comme
exemples.

### Compteurs d'engagement du post épinglé

Le post de bienvenue affiche 4 521 « j'aime ». Le chiffre faisait écho aux
« +4 500 inscrits » qui ont été retirés. Il ne prétend plus rien en soi, mais
suggère une audience que le projet n'a pas encore.
