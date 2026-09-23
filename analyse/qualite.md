# Qualité et données — cohérence de la maquette

Méthode : relecture des six fichiers de données, des huit pages du tableau de bord, et recalcul de chaque total depuis le code. Aucun chiffre ci-dessous n'est recopié depuis `AUDIT.md` ou `TODO.md`.

**8 points reçus : 5 confirmés, 2 à corriger, 1 faux. 23 incohérences nouvelles. 14 boutons morts. 8 identités d'utilisateur courant, pas 5.**

## 1. Vérification de la liste reçue

| Point de `TODO.md` / `AUDIT.md` §6 | Verdict |
| --- | --- |
| Revenus, facteur 5 | **Confirmé, et pire** : trois chiffres de revenus sur la *même* page (§3.1) |
| « 16 annonces » vs 8 | **Confirmé.** Ligne réelle `dashboard-data.ts:354-361`, pas 346 |
| Vues 5 060 / 13 322 / 60 720 | **À corriger.** 60 720 n'existe que sur l'onglet « 12 mois » d'`/audience` ; l'onglet par défaut (30 j) affiche bien 5 060. Le vrai écart est 5 060 vs 13 322 |
| Cinq identités | **Confirmé mais sous-évalué : huit** (§4) |
| Notifications 3 / « aucune » / 10 dont 5 | **Confirmé**, et le « 3 » est écrit **deux fois** : `sidebar.tsx:113` et `sidebar-whop.tsx:53` |
| `/reseau` « Abonnés » = annuaire | **Confirmé** (`reseau/page.tsx:77`, `base = people`) et plus grave : `/profil` annonce **2 340 abonnés**, le lien mène à **11** |
| Admin : 12 signalements pour 3 | **Faux sur le détail.** `MOCK_SIGNALEMENTS` en contient **5**, dont **2 ouverts**. L'écart est 12 → 2 |
| Réservations : biens disjoints | **À corriger.** Ce sont **les mêmes 5 réservations** (montants 2450/900/356/1750/720, clients Sophie Bernard / Jean Dupont / Marie Leroy), renommées et décalées de 1 à 4 mois (§3.9) |

## 2. Le constat de fond : quatre pôles ont deux catalogues

Ce n'est pas une collection d'écarts, c'est un schéma répété. Chaque pôle marchand a un catalogue canonique **et** un jeu parallèle inventé pour le tableau de bord, dans un autre espace de noms.

| Pôle | Catalogue canonique | Jeu parallèle |
| --- | --- | --- |
| Biens | `prop1`…`prop22` (`mock-data.ts:303`) | `chalet-alpin`, `appart-vue-lac`, `studio-lausanne` |
| Formations | `form-001`…`form-011` (`mock-data.ts:1430`) | `form-lcd`, `form-fisc`, `form-photo` |
| Produits | `b1`…`b16` (`data/products.ts:226`) | `p-stage`, `p-plaid`, `p-bougie` |
| Événements | `e1`…`e6` (`data/events.ts:76`) | `ev-1`…`ev-4` |
| Annonces | — | `l1`…`l8` (`dashboard/annonces/page.tsx:85`), un 3ᵉ jeu |

Conséquence mesurable : l'utilisateur courant possède **1 bien** au catalogue (`prop5`, seul `host: users[0]`, `mock-data.ts:474`) et **1 formation** (`form-001`, ligne 1438). Le tableau de bord en pilote 3 et 3, `/dashboard/annonces` en liste 8 autres, `/profil` en revendique 14 (`currentUser.stats.properties`), le feed 38 (`feed/page.tsx:36`). Cinq réponses à « combien de biens as-tu ? ».

## 3. Incohérences nouvelles

**3.1 — Trois montants de revenus sur le seul écran `/dashboard`.** `dashboard/page.tsx:94` KPI « Revenus · 12 mois / Toutes sources » = **66 938 CHF** ; ligne 137 « Revenus du mois » = **24 850 / 30 000** ; `revenue-section.tsx:147` (défaut `immobilier`/`12m`) hero = **57 606 CHF**. 24 850 en un mois contre 57 606 sur douze : arithmétiquement impossible, visible en un scroll. *Correction : un seul module de revenus dérivé des réservations ; l'objectif mensuel lit la dernière valeur de la même série.*

**3.2 — Deux autres « revenus » sur les sous-pages.** `dashboard/calendrier/page.tsx:78` « Revenus locatifs » = **10 416** (non annulées) ; `dashboard/reservations/page.tsx:96` « Revenus générés » = **7 416** (confirmées + terminées). Cinq nombres pour un mot. *Correction : nommer par périmètre — encaissé / engagé / prévisionnel — et dériver d'une fonction unique.*

**3.3 — Le prix à la nuit contredit le prix à la semaine.** `dashboard-data.ts:155-157` vs `:267-277` : Chalet 350/nuit cohérent ; Appartement Vue Lac `weeklyPrice`÷7 = 257 mais réservations à **180** (dr2, dr4, dr8) ; Studio `weeklyPrice`÷7 = 127 mais **89** (dr3) et **178** (dr6, dr9) — deux tarifs pour un même bien. *Correction : `amount = nights × nightlyPrice`, supprimer `weeklyPrice`.*

**3.4 — `monthRevenue` n'est pas dérivable de l'occupation affichée.** `price × occupancy × 30` donne 9 660 / 4 212 / 2 819 contre 11 200 / 8 400 / 5 250 annoncés : facteur 2 sur deux biens, alors que les deux chiffres cohabitent sur `/dashboard/audience`.

**3.5 — Croissance du studio : +8 % ou −3 %.** `dashboard-data.ts:157` `monthGrowth: "+8%"` contre `revenue-data.ts:158` `delta: -3`. Le tableau « Par bien » affiche −3 % sous un bien que la même page décrit en croissance.

**3.6 — Un troisième jeu de revenus, mort mais présent.** `mock-data.ts:2216-2320` : `dashboardStats` (CA 485 000, mensuel 42 500, occupation 87 %, 24 680 vues) et `monthlyRevenue` dont la somme fait **475 000** — donc déjà incohérent avec ses propres 485 000. Aucun consommateur. *Correction : supprimer ; tant qu'il existe, quelqu'un le rebranchera.*

**3.7 — Le classement des apporteurs se contredit d'un facteur 9.**

| Nom | `/dashboard/apporteurs` (`dashboard-data.ts:326`) | `/apporteurs` (`apporteurs/page.tsx:139`) |
| --- | --- | --- |
| Laura M. | **#1 — 15 200 CHF** | #3 — 3 010 |
| Léo M. (vous) | **#2 — 9 500** | #4 — **1 034** |
| Jean-Pierre D. | #3 — 8 700 | #2 — 3 380 |
| Nadia S. | #4 — 6 100 | #5 — 1 050 |

Le classement de `/apporteurs` est **faux en interne** : le rang 4 (1 034) est inférieur au rang 5 (1 050). Et `/dashboard/apporteurs` annonce 2 400 CHF gagnés ce mois puis, douze lignes plus bas, 9 500 au classement « du mois ». Quatrième chiffre : `referral-links.ts:17-47`, `earned` = 200+320+250 = **770**. *Correction : un seul tableau d'apports ; totaux, classement et KPI dérivés ; tri calculé.*

**3.8 — Clics et conversions du programme.** `dashboard-data.ts:313-317` : 23/41/17 clics, 8/12/5 conversions. `referral-links.ts` : 8/12/3 clics, 2/5/1 conversions, pour **les trois mêmes canaux**. Le « 23 » du premier canal devient le total du second : c'est une copie dégradée.

**3.9 — `/reservations` et `/dashboard/reservations` : même contenu, deux vérités.** `reservations/page.tsx:31-37` reprend les cinq mêmes réservations que `dashboard-data.ts:267-277` — mêmes clients, mêmes montants — avec des biens renommés (« Chalet de luxe Verbier » pour « Chalet Alpin Premium ») et des dates décalées (juin→juillet, juin→avril, juin→mars). Les deux pages portent le titre `Réservations`. Et `mockHost` (ligne 16) fait de l'utilisateur **l'hôte** des biens : la « vue voyageur » est une seconde vue hôte. *Correction : supprimer la page, ou la reconstruire avec des réservations où l'utilisateur est `guest`.*

**3.10 — Les alertes boutique désignent des produits inexistants.** `dashboard-data.ts:181-185` : `p-stage` « Kit home-staging » et `p-bougie` « Bougie parfumée 80h » n'existent dans aucun des 16 produits de `data/products.ts`. Le plaid existe (`b11`, ligne 514) avec **stock 14** ; le tableau de bord l'annonce en **stock 3, « faible »** et `/dashboard/annonces:90` affiche « stock 14 ». Un produit, trois états.

**3.11 — Une annonce en brouillon avec 87 inscrits.** `dashboard/annonces/page.tsx:89` : le live « Décrypter les annonces immobilières » est `brouillon`, « Programmé le 2026-06-12 ». `dashboard-data.ts:173` : le même live est « Demain · 19h00 », **87 places prises sur 120**.

**3.12 — Une formation liée à un identifiant inexistant.** `profile-posts.ts:66-72` : `FORMATION_F1 = { id: "f1", title: "Investissement immobilier : de 0 à expert" }`. Aucun `f1` au catalogue ; la formation à 497 CHF de Léo s'appelle « Investissement locatif : de zéro à rentier » (`form-001`). Ligne 157, `buildObjectAffiliate("formation","f1",…)` produit `redirect: /formations/f1` → **page introuvable**. Le feed est immunisé (`feed/page.tsx:125`, `mkFormation` lève à la compilation) ; `profile-posts.ts` non. *Correction : y appliquer le même accesseur.*

**3.13 — Deux systèmes de rôles disjoints.** `context.tsx:97` `DEFAULT_ROLE = "client"`, jamais modifié : les 8 pages qui lisent `activeRole` rendent **en permanence la variante « client »**, tandis que `/dashboard` traite l'utilisateur en hôte-formateur-apporteur. `/onboarding:75` écrit `profile.roles` — un **autre** champ, que rien ne lit pour adapter un comportement. `AUDIT.md` §4 attribue la valeur d'`activeRole` à « un ancien passage par `/onboarding` » : inexact, `/onboarding` n'y touche pas.

**3.14 — Messages non lus : 4 contre 3.** `sidebar.tsx:110` dérive 4 non-lus de `mock-data.conversations` ; `/messages` définit ses propres fils, total **3**. Le badge ne correspond jamais à la boîte.

**3.15 — Un profil, deux nombres d'avis, et un troisième au tableau de bord.** `profile-data.ts:110` `reviewsCount: 56` pour `DEFAULT_PROFILE` ; ligne 145 `reviewsCount: 87` pour `user-001`, **le même personnage**. `/profil` affiche « 4,8 (56 avis) », `/dashboard/avis` « 4,14 · 7 avis ».

**3.16 — Six identifiants `user-0xx` désignent deux personnes.** Présents dans `mock-data.ts` **et** `profile-data.ts` avec des personnes sans rapport : `user-007` Pierre Gonçalves (Lisbonne) / Camille Rochat (Fribourg) ; `user-008` Nathalie Blanc / Nicolas Berger ; `user-009` Thomas Müller / Fatima Zahra ; `user-010` Fatima Zahra (**Dakar**) / David Meier ; `user-011` Alexandre Petit / Elena Rossi ; `user-012` Clémence Moreau / Omar Haddad. Violation directe de « un identifiant désigne toujours le même objet ». En prime `user-013`…`user-016` existent dans `mock-data` mais pas dans `profile-data` : `suggestedUsers` et `storyUsers` les proposent, `/profil/user-013` répond « profil introuvable ».

**3.17 — Vingt-cinq patronymes pour sept prénoms.** 4 Sophie (Bernard / Durand / Martin / Meier), 4 Marc (Bonnard / Dubois / Dupont / Favre), 4 Thomas (Muller / Roth / Roux / Weber), 4 Amina-Amira, 5 Pierre, 2 Nadia, 2 Laura. Le même avatar `photo-1472099645785` est Léo sur `/profil` et **Thomas Weber** dans le feed (`feed/page.tsx:64`).

**3.18 — L'utilisateur de démonstration est suspendu dans sa propre console.** `admin/page.tsx:21` : `{ nom: "Léo Martin", role: "apporteur", statut: "suspendu" }`.

**3.19 — Le libellé « vous » est doublé.** `dashboard-data.ts:328` `name: "Léo M. · vous"` et `dashboard/apporteurs/page.tsx:155` ajoute ` (vous)` → « **Léo M. · vous (vous)** ». Le même défaut a été corrigé sur `/apporteurs` (commentaire ligne 141) mais pas ici.

**3.20 — Trois domaines, trois e-mails.** `edome.world` (`apporteurs/page.tsx:30`, `referral-links.ts`), `e-dome.ch` (`profile-data.ts:105`), `edome.ch` (`mock-data.ts:33`) ; `leo.martin@edome.ch`, `leo@e-dome.ch`, `leo@example.com`.

**3.21 — Le mois courant de la démonstration change selon l'écran.** `dashboard-data` : réservations et virements en **juin 2026**, série mensuelle s'arrêtant à « Déc ». `mock-data` : dernier mois **mars 2026**. `/messages` et `/notifications` : **avril 2026**. `/admin` : **mars 2026**. Date réelle : septembre 2026. *Correction : une constante `DEMO_TODAY`, toutes les dates relatives.*

**3.22 — `/dashboard/annonces` cite un nombre d'avis qui n'existe pas.** Ligne 88 : « 189 CHF · 4.8/5 (124 avis) ». `form-lcd` a 342 élèves ; 124 est le nombre d'élèves de `form-fisc`. Ni l'un ni l'autre n'est un nombre d'avis.

**3.23 — L'icône PWA pointe sur un fichier inexistant.** `layout.tsx:57` référence `/icons/icon-192x192.svg`. `public/icons/` contient un unique fichier nommé littéralement `icon-${size}x${size}.svg` : un gabarit de chaîne écrit sur le disque.

**3.24 — Environ 600 lignes de données orphelines.** Dans `mock-data.ts` : `socialPosts` (227 l.), `events` (147 l., orphelin documenté ligne 1955), `dashboardStats` + `transactions` + `monthlyRevenue` + `monthlyReferralEarnings` (123 l.), `suggestedUsers` / `trendingHashtags` / `storyUsers` (53 l.), `favoritePropertyIds`, `favoritePostIds`, `upcomingAppointments` (44 l.), `getUserById` — 22 % du fichier, zéro consommateur. Idem dans `dashboard-data.ts` : `revenueBySource`, `revenueByType`, `monthlyRevenue`, `messageThreads`, `messagesSummary`, `serviceLeads`, `forecast30d`. Inutilisées mais pas inoffensives : ce sont les valeurs qu'un futur contributeur rebranchera.

## 4. L'identité unique de l'utilisateur courant

| Source | id | Ville | Rôles | Abonnés | Biens | Avis |
| --- | --- | --- | --- | --- | --- | --- |
| `mock-data.ts:28` `currentUser` | `user-001` | **Neuchâtel** | 6 (dont `agence`, `client`) | 2 340 | 14 | 87 |
| `profile-data.ts:18` `DEFAULT_PROFILE` | `me` | **Lausanne** | 4 | 2 340 | — | **56** |
| `profile-data.ts:135` seed `user-001` | `user-001` | Lausanne | 4 | 2 340 | — | **87** |
| `feed/page.tsx:32` `U_LEO` | `u-leo` | **Genève** | 2 | **12 400** | **38** | 156 |
| `dashboard-data.ts:145` `dashboardUser` | *aucun* | — | 4, en `Capitales` | — | 3 | 7 |
| `reservations/page.tsx:16` `mockHost` | `me` | Lausanne | 1 | 0 | 0 | 0 |
| `messages/page.tsx:88` | `me` | — | — | — | — | — |
| `context.tsx:97` `activeRole` | — | — | **`client`** | — | — | — |

Divergences supplémentaires : « **Fondateur** E-Dome » (`profile-data.ts:26`) contre « **Co-fondateur** E-Dome » (`feed/page.tsx:37`) ; deux avatars ; 485 000 CHF de revenu cumulé contre **12 400 000**.

**Doit faire foi : `profile-data.DEFAULT_PROFILE`.** Trois raisons : c'est la seule source éditable et persistée (`context.tsx:129`), donc la seule que l'interface peut modifier ; la seule typée par un schéma (`profile-schema.ts`) ; et celle que `/profil`, `/onboarding` et `/parametres` écrivent déjà. **Un changement de fond : l'identifiant doit devenir `user-001`, non `me`**, pour que l'utilisateur courant soit une ligne du même annuaire que les autres — sans quoi aucun test ne peut vérifier qu'il est bien l'auteur de ce qu'il publie.

Endroits exacts à changer :

1. `profile-data.ts:19` — `id: "me"` → `"user-001"` ; supprimer le doublon `PUBLIC_SEEDS["user-001"]` (135-152) et dériver le profil public de `DEFAULT_PROFILE`. Résout §3.15.
2. `mock-data.ts:28-51` — supprimer `currentUser`, réexporter depuis `profile-data`. Consommateurs : `messages/page.tsx:14`, `reunion/[roomId]/page.tsx:11`, les `host:`/`instructor: users[0]`.
3. `feed/page.tsx:32-38` — supprimer `U_LEO`, lire le profil courant. Retire 12 400 abonnés, 38 biens, 12,4 M CHF.
4. `dashboard-data.ts:145-151` — supprimer `dashboardUser` ; ses rôles sont des libellés (`"Hôte"`), pas des `Role` : retyper.
5. `reservations/page.tsx:16` — supprimer `mockHost`.
6. `messages/page.tsx:88` — `currentUserId = "me"` → identifiant du profil courant.
7. `context.tsx:97` — `DEFAULT_ROLE` doit valoir `profile.roles[0]`, pas `"client"`.
8. `admin/page.tsx:21` — retirer ou renommer la ligne « Léo Martin … suspendu ».
9. `profile-posts.ts:66` — `FORMATION_F1` → `form-001`.
10. Ville : **Lausanne** partout. Domaine : **`e-dome.ch`** partout.

## 5. Concordance tableau de bord ↔ pages de détail

| Indicateur `/dashboard` | Valeur | Page de détail | Valeur | |
| --- | --- | --- | --- | --- |
| Revenus 12 mois, toutes sources | 66 938 | section Revenus, même page | 57 606 | 3 chiffres visibles |
| Revenus du mois (objectif) | 24 850 | — | — | **impossible vs 57 606/12 m** |
| Réservations · en attente | 9 · 3 | `/dashboard/reservations` | 9 · 3 | ✔ |
| Occupation moyenne | 81 % | `/dashboard/calendrier` | 81 % | ✔ |
| Note moyenne | 4,14 / 7 avis | `/dashboard/avis` | 4,14 / 7 | ✔ (mais `/profil` : 4,8 / 56) |
| Avis à répondre | 3 | `/dashboard/avis` | 3 | ✔ |
| Annonces actives | **16** | `/dashboard/annonces` | **8**, titres sans rapport | **✘** |
| Audience | **5 060 vues** | `/dashboard/annonces` | **13 322 vues** | **✘** |
| Apporteurs, ce mois | 2 400 | `/dashboard/apporteurs` | 2 400 puis **9 500** | **✘** |
| Apporteurs, en attente | 350 | `/apporteurs` | **100** (1 034 − 934) | **✘** |
| Alertes boutique | 3 | `/boutique` | 2 produits sur 3 inexistants | **✘** |
| Formations | 3 | `/formations` | 11, aucune commune | **✘** |
| Prochains rendez-vous | 4 (`ev-*`) | `/evenements` | 6 (`e*`), non cliquables | **✘** |

**7 des 14 indicateurs ne concordent pas.** Les 7 qui concordent sont exactement ceux que `dashboard-data.ts` dérive par `reduce` : la preuve que le mécanisme fonctionne dès qu'il est appliqué.

## 6. Chiffres de traction restants

Règle : données d'un utilisateur sur son tableau de bord = normales ; affirmations sur E-Dome = interdites. Les trois cas en attente, arbitrés :

- **`market-pulse.tsx:107-113`, `NEWS` — à remplacer.** Cinq affirmations sur le monde réel, horodatées (« Marché · 5 h ») pour ressembler à des dépêches, sans source, dont **deux fausses** : la valeur locative n'« entre pas en vigueur » (réforme votée, application ~2028) et « Lex Koller : nouvelles conditions dès 2026 » est inventé. Le même fichier consacre 16 lignes de commentaire à justifier la démonétisation du fil d'activité, puis publie ceci vingt lignes plus bas. *Correction : bloc « Exemple de veille », titres génériques non datés — ou trois dépêches réelles sourcées et liées.*
- **Les 4 521 « j'aime » du post épinglé (`feed/page.tsx:160`) — à retirer, et pas seulement le nombre.** Le post dit « les commentaires sont des exemples » et porte trois témoignages sur E-Dome : « Tellement fier de faire partie de l'aventure depuis le jour 1 », « La meilleure plateforme pour les investisseurs sérieux ». C'est la première chose que lit un visiteur venu de la landing, et la preuve sociale la plus forte du site. *Correction : 0 j'aime sur ce post, commentaires remplacés par des questions produit.*
- **`/admin` KPIS (`admin/page.tsx:10-15`) — à retirer.** 2 847 utilisateurs, 1 253 biens, 387 500 CHF : trois affirmations sur E-Dome, contredites par la page elle-même (10 utilisateurs, 5 biens). Le bandeau « Données d'exemple » ne suffit pas tant que la route est publique. *Correction : dériver les quatre KPI des tableaux (10 / 5 / 0 / 2) et protéger la route.*

Cas non signalés jusqu'ici, à traiter au même titre :

- **Les deux classements d'apporteurs** affichent des commissions nominatives (15 200 CHF pour « Laura M. »). `AUDIT.md` §7 affirme que « les montants de commission nominatifs » ont été retirés : ils sont toujours là, sur deux pages.
- **`dashboard/annonces/page.tsx:189`** — « Comparable au **benchmark E-Dome** » : affirme un référentiel de performance inexistant.
- **Les quatre `BookingCallout`** promettent « notre équipe support, lundi-vendredi 9h-18h » (`aide:170`), « un conseiller E-Dome » (`investisseurs:241`), « un expert E-Dome » (`reservations:415`), et pointent vers cinq URL `cal.com/edome/*` inexistantes. Services affirmés, absents du modèle économique.
- **`/explorer/[id]:632-633`** — « ROI 5 ans **+18,5 %** », « ROI 10 ans **+42,0 %** » en vert, sur chacun des 22 biens ; `feed/page.tsx:181` « Rendement locatif courte durée : 9.5 % brut » ; `:193` « le marché suisse romand sur 5 ans : +37 % ». B.6 interdit la promesse de rendement. *Correction : « projection indicative » + mention de non-garantie, ou retrait.*

## 7. Boutons morts

**14 boutons sans aucun gestionnaire**, sur 12 fichiers — balayage de toutes les balises `<button>` et `<Button>` de `src/app` et `src/components`, vérification de l'absence de `onClick`, `asChild`, `type="submit"`, `form`.

| Fichier | Ligne | Libellé |
| --- | --- | --- |
| `dashboard/calendrier/page.tsx` | 39, 43 | Export iCal · Bloquer une période |
| `dashboard/annonces/page.tsx` | 278, 285 | Modifier · Plus d'options (× 8 cartes) |
| `boutique/[id]/page.tsx` | 428, 437 | Favoris · Partager |
| `dashboard/avis/page.tsx` | 59 | Exporter |
| `components/dashboard/revenue-section.tsx` | 192 | Exporter |
| `components/dashboard/review-card.tsx` | 91 | Répondre (× 3 avis) |
| `admin/page.tsx` | 385 | Sauvegarder les paramètres |
| `explorer/[id]/page.tsx` | 939 | QR Code |
| `feed/page.tsx` | 2756 | J'aime, sur chaque commentaire |
| `formations/[id]/page.tsx` | 418 | Télécharger PDF |
| `investisseurs/page.tsx` | 227 | Télécharger (× 5 rapports) |

**6 des 8 pages du tableau de bord** sont touchées, dont les quatre boutons « Exporter ». En instances rendues : une trentaine de clics sans effet.

Actions sans issue qui ne sont pas des boutons morts au sens strict :

- **3 `alert()`** : `boutique/page.tsx:671`, `investisseurs/page.tsx:82`, `live/page.tsx:111` — ce dernier annonce « Lien copié » sans rien copier.
- **`components/ui/calendar.tsx:103`** : le `<Button>` n'a pas de gestionnaire mais la carte entière est enveloppée dans `<Link href={bookingLink}>` (ligne 168). Il navigue donc — vers cinq URL `cal.com` inexistantes — et c'est un `<button>` dans un `<a>`, invalide et inaccessible au clavier.
- **`components/dashboard/upcoming-events.tsx`** : les 4 rendez-vous ne sont pas cliquables ; seul le pied de bloc mène à `/dashboard/annonces`, qui n'en parle pas.
- **`feed/page.tsx:2628`** : un `<form>` de recherche complet, `className="hidden"`.
- **0 bouton mort sur `/parametres`** : les 22 contrôles ont tous un gestionnaire, dont 11 en `showToast`. C'est la page la mieux câblée de la maquette.

Aucun `href="#"`, aucun `onClick={() => {}}`, et **aucun lien interne vers une route inexistante** (52 routes, tous les `href` littéraux vérifiés) — sauf l'icône PWA du §3.23.

## 8. Stratégie de données de démonstration

Le mécanisme revient à l'agent architecture ; voici la substance.

**Un annuaire, 18 personnes, identifiants `user-001`…`user-018`**, `user-001` étant l'utilisateur courant. Couverture des 11 rôles de B.5 sans en inventer : 1 particulier vendeur, 1 propriétaire abonné, 3 agences (dont une avec 3 agents nommés, pour que la gestion d'équipe ait un support), 3 agents, 3 prestataires (photographe, home-staging, notaire), 2 créateurs, 2 hôtes, 1 apporteur, 1 annonceur, 1 administrateur. 12 en Suisse, 3 en France, 3 aux Émirats — juste assez pour démontrer la restriction géographique du programme apporteurs.

**Qui est l'utilisateur courant.** Un hôte-propriétaire de Lausanne, deux rôles cumulés (hôte + apporteur), vérifié au niveau identité. **Pas « Fondateur d'E-Dome »** : un fondateur ne peut pas servir d'utilisateur type, et sa présence rend tout chiffre de son tableau de bord lisible comme une traction de la plateforme. C'est la racine de la moitié du §6.

**Les volumes.** 12 biens (et non 22), dont **3 appartenant à `user-001`** — exactement ceux que pilote le tableau de bord, par identifiant. 6 formations, 8 produits, 4 événements, 4 prestataires avec devis. Un catalogue plus petit et entièrement traversable vaut mieux qu'un catalogue de 22 biens dont 21 n'ont pas d'histoire ; les 10 biens retirés sont ceux qu'aucune page ne référence.

**Cinq histoires, chacune vérifiable de bout en bout dans les deux sens.**

1. *Le particulier accompagné.* `user-002` publie gratuitement un bien à Lausanne, trois agences vérifiées le contactent, il en choisit une. E-Dome n'encaisse rien : le panneau de flux l'affiche à 0.
2. *L'hôte courte durée.* `user-001` loue ses 3 biens. Chaque réservation a un montant = nuits × tarif, et apparaît dans le calendrier, le revenu du mois, la transaction et l'avis. La commission ≈ 8 % est la seule ligne de revenu plateforme.
3. *L'agence abonnée.* `user-006` paie un abonnement mensuel, a 3 agents et 5 mandats. Seule histoire à revenu récurrent : c'est celle qui intéresse l'investisseur, elle doit être la plus soignée.
4. *Le créateur.* `user-011` vend une formation à 497 CHF, 12 inscrits ce mois, commission ≈ 10 %. Les 12 inscrits sont nommés et réapparaissent en élèves.
5. *L'apporteur.* `user-001` a amené l'agence de l'histoire 3 et deux hôtes. Sa commission est **calculée** depuis le revenu E-Dome de ces trois apports : c'est le seul chiffre d'apporteur de la maquette, identique sur `/apporteurs`, `/dashboard/apporteurs` et le panneau de flux.

**Trois règles de contenu non négociables.** Aucun compteur d'audience à quatre chiffres sur un post — l'ordre de grandeur crédible pour un réseau qui se lance est 0 à 50. Aucun classement nominatif de commissions. Aucune projection de rendement sans le mot « indicative » et une mention de non-garantie.

## 9. Plan de vérification

Portes actuelles : `lint` (0 erreur, **182 avertissements**), `typecheck`, `build`, et `npm test` = Playwright avec **un seul fichier**, `tests/e2e/interest-form.spec.ts` (et non `interest-query.spec.ts`). Aucun exécuteur de tests unitaires n'est installé.

**a) Tests d'intégrité du catalogue, en ligne de commande.** `node --test` est intégré à Node 24 : zéro dépendance nouvelle. Ajouter `"test:data": "node --test tests/data/"`. Les douze assertions qui auraient attrapé tout ce qui précède :

1. Tout `id` unique dans son espace de noms, et aucun chevauchement entre espaces (§3.16).
2. Toute référence croisée résout : `sourceId` d'avis, `propertyId` de réservation, `id` de lien d'affiliation (§3.12).
3. Chaque bien, formation, produit, événement du tableau de bord existe au catalogue (§2, §3.10, §3.11).
4. `reservation.amount === nights × property.nightlyPrice` (§3.3).
5. `property.monthRevenue` = somme des réservations du mois (§3.4).
6. Somme des revenus par source = revenu total, sur les trois fenêtres (§3.1).
7. Revenu du mois courant = dernière valeur de la série mensuelle (§3.1).
8. Total du classement apporteurs = somme des apports, et classement trié décroissant (§3.7).
9. Une seule constante d'identité ; aucun littéral `"Léo"`, `"me"`, `"user-001"` hors du module d'identité (§4).
10. Aucune date hors de `DEMO_TODAY − 12 mois` … `+ 3 mois` (§3.21).
11. Tout compteur d'engagement sous un plafond configuré (§6).
12. Aucun montant CHF littéral hors de `pricing.ts` (A.3).

Ces douze assertions s'exécutent en moins d'une seconde et remplacent la relecture humaine. **C'est le livrable technique le plus rentable du chantier** : tant qu'il n'existe pas, chaque écran neuf recréera la divergence.

**b) Épreuves Playwright — six fichiers, avec des assertions qui comparent des nombres entre écrans plutôt que la présence de texte.**

- `dashboard-coherence.spec.ts` : lire chaque indicateur sur `/dashboard`, ouvrir la sous-page, comparer. Une assertion par ligne du §5.
- `identity.spec.ts` : nom, ville et avatar identiques sur `/profil`, `/dashboard`, l'en-tête, `/messages` et l'auteur du post épinglé.
- `no-dead-buttons.spec.ts` : parcourir les 52 routes, cliquer chaque bouton visible, échouer si rien ne change (URL, DOM, toast, modale). Seul contrôle qui tient la consigne A.3 dans le temps.
- `money-flow.spec.ts` : sur chaque écran de transaction, la somme des lignes du panneau de flux égale le montant payé.
- `no-traction-claims.spec.ts` : aucune page ne contient un nombre au-delà d'un seuil à proximité de « utilisateurs », « inscrits », « membres », « biens publiés », « chiffre d'affaires », « benchmark ».
- Conserver `interest-form.spec.ts` tel quel : c'est le modèle.

**c) Lint.** Ramener les 182 avertissements à 0 et les passer en erreurs, en commençant par les 6 `rules-of-hooks` et les 23 `set-state-in-effect` : ce sont des bugs, pas du style. Ajouter un `no-restricted-syntax` interdisant les littéraux numériques suivis de `CHF` hors de `src/lib/pricing.ts`, et une règle interdisant d'importer `mock-data` hors de `src/lib/data/`.

**d) Hors machine.** La crédibilité du récit, le ton, la justesse juridique des formulations. Tout le reste doit être automatisé.

## 10. Désaccords attendus

**Avec l'agent produit.** Il voudra construire l'Espace agence, le sélecteur de rôle, le mode explicatif et la visite guidée avant que les écrans existants concordent. Je m'y oppose sur un point précis : **le sélecteur de rôle et le mode explicatif multiplient les incohérences au lieu de les révéler.** Un sélecteur qui bascule sur « agence » alors qu'`activeRole` n'est lu que par 8 pages sur 52 produira une navigation d'agence et un tableau de bord d'hôte ; et le mode explicatif, qui annote chaque chiffre, pointera du doigt les 7 indicateurs discordants du §5. Ma position : les douze assertions du §9.a et l'identité unique du §4 passent **avant** tout écran neuf — deux jours, pas deux semaines. Ce qu'on perd : deux jours de retard, et l'Espace agence plus tard dans la démonstration.

**Avec l'agent marketing.** Il voudra garder le fondateur comme utilisateur courant, les 4 521 j'aime, les témoignages du post épinglé et les classements d'apporteurs, parce qu'ils rendent la maquette vivante. Je ne céderai sur aucun des quatre. La Partie C est catégorique, et surtout ce sont les seuls endroits où un investisseur peut nous prendre en flagrant délit d'exagération : un compteur à 4 521 sur un produit non lancé ne rend pas la maquette crédible, il rend tout le reste suspect. Ce qu'on perd : un feed plus désert, un post d'accueil moins chaleureux. Contrepartie proposée : un bandeau « données fictives » assumé et un compteur du nombre de personnes sur la liste d'attente — un chiffre **vrai**.

**Avec l'agent architecture.** Il voudra un schéma unique, probablement Supabase, et refondre les six fichiers d'un coup. Je m'oppose à l'ordre, pas au but. Le catalogue unifié de `data/properties.ts`, `data/events.ts` et `data/products.ts` existe déjà et fonctionne : le problème n'est pas l'absence de modèle, c'est que `dashboard-data.ts` et `revenue-data.ts` ne l'utilisent pas — et que `data/properties.ts:23-28` le reconnaît par écrit en remettant la question à plus tard. Rebrancher ces deux fichiers sur le catalogue existant prend quelques heures et supprime la moitié de mes 23 constats ; écrire un schéma Supabase prend plusieurs jours pendant lesquels la maquette reste incohérente. **Rebrancher d'abord, refondre ensuite.** Ce qu'on perd : un passage intermédiaire à jeter quand le schéma arrivera.

**Avec l'agent comptable.** Pas de désaccord de fond, une exigence : le nouveau barème doit arriver avec **un jeu de données chiffré cohérent**, pas seulement des taux. Cinq des incohérences ci-dessus viennent de taux corrigés dans `pricing.ts` sans recalcul des montants de démonstration.

## 11. Les trois défauts qu'un investisseur verra en premier

**1. Les trois montants de revenus sur `/dashboard` — quasi certain.** C'est le deuxième écran montré après le feed. Il affiche 66 938 CHF sur douze mois, 24 850 CHF pour le mois courant et 57 606 CHF de revenu immobilier sur douze mois, dans cet ordre, à un scroll d'intervalle. Personne n'a besoin d'être comptable pour voir que 24 850 × 12 ne tient pas dans 57 606 — et `/dashboard/calendrier` puis `/dashboard/reservations` en ajoutent deux autres.

**2. Les quatre boutons « Exporter » qui ne font rien — très probable.** Un investisseur devant un tableau de bord clique sur « Exporter ». Il y en a quatre (section Revenus, `/dashboard/avis`, `/dashboard/calendrier` × 2) et aucun ne réagit. « Sauvegarder les paramètres » sur `/admin`, « Télécharger » sur les cinq rapports investisseurs et « Télécharger PDF » du certificat tombent dans la même catégorie. Un bouton qui ne répond pas ne se lit pas « pas encore fait », il se lit « rien ne marche derrière ».

**3. « 2 340 abonnés » qui ouvre une liste de 11 — probable.** Le nombre est cliquable sur `/profil` et mène à `/reseau`, dont l'onglet « Abonnés » affiche l'annuaire entier, soit 11 personnes. Le geste est naturel, la contradiction immédiate. Juste derrière : `/profil` annonce « 4,8 (56 avis) », `/dashboard/avis` en compte 7 pour une moyenne de 4,14.

Ces trois défauts ont la même cause : **des nombres écrits à la main au lieu d'être dérivés.** Les 7 indicateurs qui concordent au §5 sont exactement ceux que `dashboard-data.ts` calcule par `reduce`. La correction n'est pas une chasse aux chiffres, c'est une règle — plus aucun nombre visible ne s'écrit à la main — et les douze assertions du §9.a la vérifient à chaque commit.
