# Audit — persona « Courtier salarié d'agence » (Sophie Durand, Régie du Léman)

Périmètre testé : `/agence`, `/agence/mandats`, `/agence/equipe`, `/agence/[slug]`,
`/profil/[id]`, `/dashboard`, `/messages`. Méthode : lecture de
`src/content/agence.ts`, `src/lib/mock-data.ts`, `src/lib/profile-data.ts`,
`src/content/roles.ts`, `src/lib/demo/identity.ts` + navigation Playwright réelle
sur le serveur (`/agence`, `/agence/equipe`, `/agence/mandats`,
`/agence/regie-du-leman`, `/profil/user-002`, `/explorer/prop19`).

Point de départ du rôle : le sélecteur « Visiter en tant que → Agence »
(`src/content/roles.ts:74-82`) m'atterrit sur `/agence`, qui présente
« Régie du Léman » comme MON agence. Je me mets dans la peau de Sophie Durand
(`user-002`), seule courtière du jeu de données situable à Lausanne, membre
d'une agence, avec un mandat réel (le chalet de Verbier, `prop19`).

## 1. Cherché / trouvé

- Cherché ma fiche dans l'équipe (`/agence/equipe`) : **pas trouvée**. La table
  `agencyTeam` (`src/content/agence.ts:70-77`) liste 6 noms fixes (Claire Rochat,
  Julien Favre, Sofia Marchetti, Dylan Perret, Nadia Berger, Marc Aubert) —
  aucun ne correspond à un profil réel de `src/lib/profile-data.ts`. Sophie
  Durand n'y figure pas ; aucun des 6 courtiers de l'équipe n'a de fiche
  `/profil/[id]` associable. Impossible de savoir « qui je suis » dans mon
  propre organigramme.
- Cherché mes mandats (`/agence/mandats`) : trouvé 4 lignes, mais aucune ne
  m'est attribuée (agents : Julien Favre, Claire Rochat, Sofia Marchetti —
  jamais « moi »). Les noms d'agent et les biens sont du texte brut, sans lien
  (`src/app/(app)/agence/mandats/page.tsx:25-33`) : impossible de cliquer vers
  la fiche du bien ou vers le profil du collègue.
- Cherché la cohérence de mon propre profil public entre les écrans : **trouvée
  une divergence nette**, voir §3.

## 2. Perdu / bloqué

- Bloquée dès `/agence/equipe` et `/agence/mandats` : zéro lien sortant (pas de
  `<Link>`, juste des `<td>`/texte). C'est un cul-de-sac — la seule action
  possible sur ces deux écrans est de revenir en arrière. Pour une salariée qui
  veut « ouvrir la fiche d'un collègue » ou « voir le bien du mandat M-014 »,
  rien ne répond.
- Le hub `/agence` (`src/content/agence.ts:34-41`) annonce 14 « mandats
  actifs » (repris de `demoAgency.activeMandates`, et ce total colle
  exactement à la somme des colonnes « Mandats » de l'équipe : 5+4+3+0+2+0=14
  — donc les deux fichiers sont cohérents ENTRE EUX) mais `/agence/mandats`
  n'en liste que 4 (`M-014, M-013, M-011, M-009`). Dix mandats promis sont
  invisibles nulle part dans l'appli — en tant que courtière je ne peux
  jamais retrouver "mes" 10 dossiers manquants.

## 3. Faux / vide / artificiel — LA divergence de profil (point B.1)

**Sophie Durand n'a pas les mêmes chiffres selon l'écran où on la croise**,
malgré le commentaire de `profile-data.ts:128-131` qui prétend ce bug déjà
corrigé (il ne l'a été que pour l'utilisateur courant, pas pour les autres
profils) :

| Écran | Source | Followers | Note | Avis | Bio |
|---|---|---|---|---|---|
| `/explorer/prop19` (fiche du chalet dont elle est l'hôte/vendeuse), `src/lib/mock-data.ts:64-78` (`users[1]`) | `mock-data.ts` | **3 100** | **4.9** | **134** | « Courtière immobilière indépendante. 12 ans d'expérience... » |
| `/profil/user-002` (sa fiche publique), `src/lib/profile-data.ts:161` | `profile-data.ts` | **890** | **4.8** | **42** | « Courtière Brevet Fédéral spécialisée dans l'immobilier de standing... » |

Le lien du bien vers le profil est direct et à un clic
(`src/app/(app)/explorer/[id]/page.tsx:1163-1169`, `href="/profil/${property.host.id}"`)
: on quitte une fiche annonçant « 4.9 · 134 avis » pour atterrir sur « 4.8 ·
42 avis » à propos de LA MÊME personne, avec une bio différente. C'est
exactement le bug que le commentaire de `profile-data.ts` dit avoir éliminé («
deux nombres pour un seul fait, à deux clics d'intervalle ») — sauf qu'il ne
l'a corrigé que pour Léo (l'utilisateur courant), pas pour Sophie ni pour
aucun autre profil apparaissant ailleurs dans `mock-data.ts` (stories,
messages, listings).

**Gravité : haute.** C'est le point précis que la mission demande de vérifier
(profil identique partout) et c'est cassé sur le seul profil de courtier du
jeu de données qui a une fiche à la fois publique et « hôte d'un bien ».

Second désaccord sur ce même écran : sur `/explorer/prop19`, le badge de rôle
sous le nom de Sophie affiche **« Hôte »**
(`roleBadgeColors[property.host.activeRole]`, `explorer/[id]/page.tsx:1170-1171`,
`activeRole: 'hote'` figé dans `mock-data.ts:72`) alors que le bien est une
**vente** (chalet à 3,2M CHF) et que le bouton juste en dessous dit
« Contacter **l'agent** ». Une courtière qui vend un chalet ne devrait pas
porter le badge « Hôte » (réservé à la location courte durée) — le badge
suit un champ statique au lieu du contexte de la transaction affichée.

## 4. Manque

- **Aucun rôle « courtier »/« agence » réel** : `CURRENT_USER.roles`
  (`src/lib/demo/identity.ts:95`) = `["proprietaire","hote","apporteur","formateur"]`.
  « Agence » n'est qu'une porte de visite du sélecteur de rôle
  (`content/roles.ts`), pas une identité qu'on habite. Résultat : mon avatar
  header, mon « Profil » dans la nav, mon `/dashboard` restent en permanence
  ceux de Léo Martin (propriétaire), même après avoir choisi « Visiter en
  tant que Agence ». Il n'y a nulle part un `/dashboard` ou un `/profil`
  qui correspond à ce que je vois dans `/agence` — la promesse « chaque
  profil existe » ne tient pas pour le rôle courtier salarié : il n'y a
  tout simplement pas de compte courtier jouable.
- **Aucun gate de plan côté code** sur `/agence/mandats` et `/agence/equipe` :
  le commentaire de `agence.ts:32-33` dit que « mandats » et « attribution »
  « demandent Mandats » (une formule supérieure), mais `demoAgency.plan =
  "vitrine"` (`agence.ts:21`) et les deux pages (`agence/mandats/page.tsx`,
  `agence/equipe/page.tsx`) s'affichent sans aucune vérification de plan ni
  message de restriction. Pour une démo qui vend justement l'upsell « Mandats
  débloque l'équipe et les mandats » (`agence/abonnement`, ligne 65), le fait
  que ces pages soient déjà pleinement accessibles en formule Vitrine défait
  l'argument commercial.
- **La vitrine publique de l'agence n'a aucun rapport avec ses mandats
  déclarés.** `/agence/regie-du-leman` (`agence/[slug]/page.tsx:32`) fait
  `CATALOGUE.filter(p => p.transactionType === "vente").slice(0,3)` — les 3
  premiers biens « vente » du catalogue global, sans filtre géographique. Sur
  le run réel, cela affiche : un 4,5 pièces à Lausanne (cohérent), **une villa
  à Nice**, et **un riad à Marrakech**. Une régie dont la tagline est « Vente
  et gérance sur l'arc lémanique, de Nyon à Vevey »
  (`content/agence.ts:22`) présente donc deux biens hors Suisse, hors du
  Léman, sans rapport avec ses 4 mandats listés (Lausanne, Pully, Montreux,
  Vevey). **Gravité : haute, très visible** — c'est le premier écran qu'un
  visiteur (ou moi-même en partageant ma page) voit, et l'incohérence saute
  aux yeux en un coup d'œil.
- **Aucun tableau de bord personnel courtier** : `/dashboard` reste celui d'un
  hôte de location courte durée (revenus par bien loué, taux d'occupation) —
  rien sur mes commissions du mois, mes visites planifiées, mes mandats en
  cours. `/agence/statistiques` n'offre que des KPI d'agence agrégés
  (`content/agence.ts:90-98`), pas une vue « moi, courtière » dans l'équipe.

## Désaccords avec le fondateur

- Le commentaire de `profile-data.ts:128-131` affirme le problème « deux
  nombres pour un seul fait » réglé — il ne l'est que pour le compte
  utilisateur courant. Tant que `mock-data.ts` (stats du tableau `users`) et
  `profile-data.ts` (stats des profils publics) restent deux sources
  séparées pour les MÊMES personnes (Sophie, et potentiellement d'autres
  hôtes apparaissant comme vendeurs), le bug qu'on dit corrigé reste ouvert
  ailleurs.
- Le choix de `CATALOGUE.slice(0,3)` sans filtre de ville pour la vitrine
  d'agence (`agence/[slug]/page.tsx:32`) est probablement passé inaperçu
  parce que personne n'a visité `/agence/regie-du-leman` après avoir lu la
  tagline « arc lémanique » — un simple filtre sur `location.city` proche de
  Lausanne (ou sur les mêmes biens que `agencyMandates`) réglerait le
  problème et rendrait la vitrine crédible.
