# AUDIT — état de l'existant

Branche de départ : `feat/plateforme-v2`, créée depuis **`feat/landing`** et non
depuis `master`. C'est une décision, pas un détail : `master` ne contient ni `/`,
ni `/merci`, ni `/admin/leads`, ni `src/lib/pricing.ts`. La consigne « ne casse
ni `/`, ni `/merci`, ni `/confidentialite`, ni `/admin/leads` » serait
inapplicable depuis `master`, où trois de ces quatre routes n'existent pas.

Conséquence à connaître : la landing de `feat/landing` n'a pas encore été
fusionnée ni testée en préproduction avec ses variables d'environnement. Ce
travail hérite donc d'une branche en attente de validation.

---

## 1. Inventaire des routes

**52 routes.** Une landing publique, 48 routes de maquette sous `(app)`, deux
annexes de la landing, trois routes d'authentification.

### Landing et annexes — état : neuf, cohérent

| Route | État |
| --- | --- |
| `/` | Landing complète, contenu centralisé dans `src/content/landing.ts` |
| `/merci` | Confirmation, lien de parrainage, `noindex` |
| `/admin/leads` | Console protégée par mot de passe serveur, export CSV |
| `/(app)/confidentialite` | Politique, section liste d'attente remplie |
| `/(app)/conditions` | Conditions générales, barème §5 |
| `/(app)/aide` | FAQ, dont le modèle de frais |

### Maquette — état : fonctionnelle, mais écrite contre un autre modèle

Réseau social : `/feed` (3 130 lignes), `/creer-post`, `/creer-reel`,
`/reseau`, `/profil`, `/profil/[id]`, `/messages`, `/notifications`,
`/recherche`, `/favoris`.

Biens : `/explorer`, `/explorer/[id]`, `/publier`, `/reservations`.

Marketplace : `/services`, `/services/proposer`, `/boutique`,
`/boutique/[id]`, `/boutique/vendre`, `/evenements`, `/evenements/[id]`,
`/evenements/creer`, `/formations`, `/formations/[id]`,
`/formations/[id]/lecon/[n]`, `/formations/creer`, `/live`,
`/live/replay/[id]`, `/reunion/[roomId]`.

Tableau de bord : `/dashboard` et six sous-pages — `annonces`, `apporteurs`,
`audience`, `avis`, `calendrier`, `reservations`.

Autres : `/apporteurs`, `/investisseurs`, `/paiement`, `/parametres`,
`/onboarding`, `/contact`, `/admin`.

### Ce qui manque au regard de la Partie B

| Attendu | Présent ? |
| --- | --- |
| **Espace agence** (principale source de revenu récurrent) | **Aucune trace.** Zéro occurrence dans tout `src/` |
| Abonnement Propriétaire | Aucun |
| Mise en avant payante | Aucune |
| Régie publicitaire / annonceur | Aucune |
| Écran de choix du vendeur (seul / accompagné / à la carte) | Aucun |
| Demande d'accompagnement par une agence | Aucune |
| Page de tarifs | Aucune |
| Page expliquant la maquette | Aucune |
| Statuts « au lancement / après / vision » | Aucun dans la maquette¹ |
| Mode explicatif | Aucun |
| Sélecteur de rôle | **Machinerie à moitié posée** — voir §4 |
| Panneau de flux d'argent | Aucun |
| Visite guidée | Aucune |
| Bandeau « données fictives » permanent | Aucun² |

¹ La landing possède bien `availability: "launch" | "later"` sur ses sept pôles
et `status` sur les cinq étapes de sa frise. Le vocabulaire existe donc déjà et
sera réutilisé plutôt que réinventé.

² Il existe seulement un lien « Quitter la maquette »
([sidebar.tsx:471](src/components/layout/sidebar.tsx#L471)) et un titre au survol
dans l'en-tête. Rien qui avertisse un visiteur que les données sont fictives.

---

## 2. Le modèle économique du code contredit la Partie B

C'est le constat central de cet audit.

`src/lib/pricing.ts` a été créé hier comme source unique de vérité du barème.
Il est propre, documenté, couvert par une vérification en exécution — et il
encode **exactement le modèle que B.3 abandonne** :

| `pricing.ts` aujourd'hui | Ce que dit B.3 |
| --- | --- |
| `SALE_FEE_BELOW = 500`, `SALE_FEE_ABOVE = 2_500` | « Il n'existe plus aucun frais de publication de 500 ou 2 500 CHF. Ce modèle est abandonné. » |
| `LONG_RENTAL_FEES = { 150, 250, 400 }` | Publication illimitée et gratuite pour un particulier, location longue durée comprise |
| Pôles : vente, location-lt, location-ct, service, événement, live, formation, boutique | Il faut y ajouter abonnement agence, abonnement propriétaire, mise en avant, publicité |
| `location-ct: 5 à 10 %` | ≈ 8 % |
| `service: 5 à 8 %` | ≈ 7 % |
| `evenement: 5 à 8 %` | ≈ 6 % |
| `live: 8 à 12 %`, `formation: 8 à 12 %` | ≈ 10 % |
| `boutique: 4 à 8 %` | ≈ 6 %, affiliation d'abord |

La **forme** du module est bonne et doit être conservée : un point d'entrée
unique, des fourchettes typées, des fonctions qui calculent le revenu
plateforme puis la part d'apporteur, et aucun taux recopié ailleurs. Ce sont
les **valeurs et les pôles** qui changent, plus l'arrivée des abonnements —
une notion que le module ignore complètement aujourd'hui, puisqu'il ne sait
raisonner que par transaction.

### Textes de référence à réécrire

Trois pages énoncent le barème abandonné, en toutes lettres :

- [`/conditions`](src/app/(app)/conditions/page.tsx) §5 — tableau complet avec
  « Frais fixe 500 CHF (< 1 M) ou 2 500 CHF (≥ 1 M) » et « Frais fixe
  150 / 250 / 400 CHF selon la durée du bail ».
- [`/aide`](src/app/(app)/aide/page.tsx) — même barème en réponse de FAQ.
- [`/publier`](src/app/(app)/publier/page.tsx) — écran de tarification qui
  affiche le frais fixe au moment de publier, avec simulation de la part
  d'apporteur.

Ces trois pages étaient, hier encore, la référence rédigée dont `pricing.ts`
était la traduction. Elles deviennent la principale source de contradiction.

### Frais à la charge du locataire

`/publier` facture la mise en ligne d'une location longue durée au bailleur.
B.6 rappelle qu'aucun frais ne peut être mis à la charge du **locataire** — ce
que le code respecte. Mais le point mérite d'être revérifié par l'agent
juridique au regard de la formule officielle du loyer initial, obligatoire dans
plusieurs cantons et absente du parcours.

---

## 3. Textes en dur

**Un seul fichier de contenu existe : `src/content/landing.ts`** (891 lignes),
et il ne couvre que la landing.

Les 48 routes de la maquette portent leurs textes en dur dans les composants.
Mesure : **197 montants, taux ou libellés tarifaires** écrits directement dans
le JSX de `src/app/(app)/`, répartis sur 19 fichiers — sans compter les
données de démonstration.

La consigne A.3 — « je dois pouvoir réécrire n'importe quelle phrase sans
toucher au code » — n'est donc satisfaite que sur `/`, `/merci` et la section
liste d'attente de `/confidentialite`. C'est un chantier de fond, pas un
nettoyage.

---

## 4. Rôles : la moitié du mécanisme est déjà là

`src/lib/context.tsx` porte un `activeRole`, le persiste dans `localStorage`,
et **huit fichiers le lisent** pour adapter leur affichage :
`/evenements`, `/explorer/[id]`, `/feed`, `/formations`, `/live`, `/messages`,
`/reservations`, `post-viewer.tsx`.

Mais `setActiveRole` **n'est appelé nulle part** en dehors du contexte
lui-même. Vérifié par recherche sur l'ensemble de `src/` : aucune interface ne
permet de changer de rôle. La valeur reste sur son défaut, ou sur ce qu'un
ancien passage par `/onboarding` a écrit dans le navigateur.

Bonne nouvelle : le sélecteur « voir la plateforme en tant que… » demandé en
Partie C n'est pas à construire de zéro. Il faut lui donner une interface, et
étendre le nombre de pages qui réagissent au rôle.

### Le jeu de rôles ne correspond pas à B.5

| Code actuel (13) | B.5 (11) |
| --- | --- |
| client, hote, agence, promoteur, apporteur, investisseur, formateur, proprietaire, photographe, courtier, architecte, notaire, admin | visiteur, particulier, propriétaire abonné, agent, agence, prestataire, créateur, hôte, apporteur, annonceur, administrateur |

Absents du code : **visiteur**, **particulier**, **propriétaire abonné**,
**agent** (membre d'une agence), **prestataire**, **créateur**, **annonceur**.

En trop, ou à reclasser : `promoteur`, `photographe`, `architecte`, `notaire`
sont des métiers de prestataires et non des rôles de plateforme ; `courtier`
est délicat, puisque la Partie B insiste précisément sur le fait qu'E-Dome
n'est pas courtier ; `formateur` devient `créateur` ; `client` devient
`particulier`.

`agent` est le manque le plus structurant : sans lui, la gestion d'équipe de
l'Espace agence — agents, droits, attribution des biens et des clients — n'a
pas de support dans le modèle de données.

---

## 5. Données de démonstration

| Fichier | Lignes | Rôle |
| --- | --- | --- |
| `src/lib/mock-data.ts` | 2 719 | Catalogue : 22 biens, 11 formations, utilisateurs, posts, événements |
| `src/lib/revenue-data.ts` | 532 | Revenus de `/dashboard/revenus` |
| `src/lib/dashboard-data.ts` | 446 | Tout le reste du tableau de bord |
| `src/lib/profile-data.ts` | 357 | Profil de l'utilisateur courant |
| `src/lib/profile-posts.ts` | 258 | Publications du profil |
| `src/lib/replays.ts` | 39 | Replays des lives |

Trois sources décrivent des revenus, et elles ne concordent pas (§6).

### Pages les plus lourdes

`/feed` 3 130 lignes, `/creer-post` 1 790, `/explorer/[id]` 1 458,
`/messages` 1 457, `/boutique/[id]` 911, `/creer-reel` 845, `/apporteurs` 794,
`/parametres` 792, `/publier` 728.

Un fichier de 3 130 lignes qui mêle données, composants et page n'est pas
tenable pour le travail à venir. `/feed` concentre à lui seul les
définitions de posts, six composants de carte et la page.

---

## 6. Incohérences

Celles qu'un visiteur rencontre en cliquant ont été corrigées hier :
formations qui ouvraient une autre formation, cartes de biens du feed pointant
vers des biens différents, replays adressés par position, 10 fiches produit en
404, liens d'événements morts, `/favoris` décrivant faussement un bien,
recherche entièrement en erreur.

**Restent ouvertes**, toutes constatées et documentées dans `TODO.md` :

| Incohérence | Portée |
| --- | --- |
| Revenus, facteur 5 : 24 850 CHF/mois contre ≈4 800 pour les mêmes biens ; 66 938 contre 228 100 sur douze mois | `dashboard-data.ts` vs `revenue-data.ts` |
| « 16 annonces actives » compte des devis de service et des alertes de stock ; `/dashboard/annonces` en montre 8, aux titres sans rapport | `dashboard-data.ts:346` |
| Vues : 5 060 / 13 322 / 60 720 sur trois écrans | 3 fichiers |
| **Cinq identités « utilisateur courant »** contradictoires, dont `u1` qui est Sophie dans le feed | mock-data, profile-data, feed, messages, dashboard-data |
| Notifications : pastille « 3 » en dur, « aucune notification » dans l'en-tête, 10 éléments dont 5 non lus sur `/notifications` | sidebar, header, page |
| `/reseau` : l'onglet « Abonnés » affiche tout l'annuaire | `reseau/page.tsx:77` |
| Admin : « 12 signalements ouverts » pour 3 réels | `admin/page.tsx` |
| Réservations : vue voyageur et vue hôte portent sur des biens disjoints | 2 pages |

L'identité unique de l'utilisateur courant est explicitement exigée en Partie C.
C'est aussi la racine de plusieurs incohérences d'auteur dans le feed.

---

## 7. Chiffres de traction

La règle de tri de la Partie C — les données d'un utilisateur sur son propre
tableau de bord sont normales, les affirmations sur E-Dome ne le sont pas — a
été appliquée hier. Ont été retirés : « +4 500 inscrits » du post épinglé et de
la biographie de profil, les montants de commission nominatifs et les « deals
conclus » du fil d'activité, l'« Indice E-Dome », et le « 0,5 % sur chaque
vente » de l'encart sponsorisé.

**Restent à arbitrer :**

- `market-pulse.tsx`, tableau `NEWS` : cinq brèves de marché inventées mais
  crédibles, sans source (« la BNS maintient son taux à 1,5 % », « le m²
  dépasse 14 500 CHF à Genève »). Elles ne portent pas sur E-Dome, donc la
  règle ne les visait pas — mais ce sont des affirmations sur le monde réel
  présentées comme des dépêches.
- Le post de bienvenue affiche 4 521 « j'aime », chiffre qui faisait écho aux
  inscrits retirés.
- `/admin` affiche 387 500 CHF de chiffre d'affaires, 2 847 utilisateurs et
  1 253 biens. Un bandeau « Données d'exemple » a été ajouté, mais la page
  reste **publiquement atteignable** (§8).

---

## 8. Sécurité et dette technique

### `/admin` est public

Le middleware sort immédiatement tant que Supabase n'est pas configuré, ce qui
est le cas en production. La console d'administration de la maquette —
adresses e-mail, signalements de harcèlement — est donc accessible sans
compte. Le bandeau ajouté hier avertit que les données sont fictives ; **ce
n'est pas une porte**.

### `/api/ai/chat` sans authentification ni limite

Le point d'accès appelle l'API Anthropic avec la clé du projet sans vérifier
l'appelant. Son compteur vit en mémoire du processus, le défaut corrigé hier
sur le formulaire. Le remède est désormais disponible à côté : table
`lead_submissions` et `allowSubmission` dans `src/lib/leads/rate-limit.ts`.

### Piège de configuration à connaître

Deux portes Supabase indépendantes cohabitent. `URL + clé de service` active le
stockage des inscriptions ; `URL + clé anonyme` active le middleware
d'authentification et **redirigerait toute la maquette vers l'écran de
connexion**. Toute intervention sur les variables d'environnement doit en
tenir compte.

### Reste

- `maplibre-gl` : faille XSS connue, correction en version 6, majeure.
- Dépréciation `middleware` → `proxy` (Next 16), avertie à chaque build.
- Dépréciation `appleWebApp` dans les métadonnées du layout racine.
- ~250 lignes de CSS orphelin dans `globals.css` : accent teal `--ed-accent`,
  classes `.ed-cta-*` et `.holo-*`, zéro usage.
- `--text-secondary` et `--text-muted` ont la même valeur : la hiérarchie
  typographique prévue n'existe pas à l'écran.
- ESLint : 0 erreur, 182 avertissements sur le code existant, dont six
  violations de `rules-of-hooks` et 23 de `set-state-in-effect`.

---

## 9. Ce qui est réutilisable tel quel

Il ne s'agit pas de tout refaire. Sont sains et servent de fondations :

- **`src/content/landing.ts`** — le patron de centralisation des textes, avec
  ses statuts `launch` / `later` déjà typés.
- **La forme de `src/lib/pricing.ts`** — point d'entrée unique, fourchettes
  typées, aucun taux recopié ailleurs. Seules les valeurs changent.
- **La couche leads** — schéma Zod partagé client/serveur, stockage derrière
  une interface, limite de débit en base, parrainage, export CSV, test de bout
  en bout Playwright. Modèle à suivre pour toute écriture future.
- **Le catalogue unifié** — un identifiant désigne un seul objet pour les
  biens, formations, produits, événements et replays.
- **`src/components/ui/`** — Radix, `class-variance-authority`, jetons de
  couleur. Une seule identité visuelle, à ne pas dupliquer.
- **Le mécanisme de rôle** — état et lecture en place, interface à ajouter.
- **Les portes de qualité** — lint, typecheck, build, `npm test`.

---

## 10. Les huit questions que cet audit pose aux agents

1. Le barème de `pricing.ts` doit être remplacé : par quelles valeurs, et le
   module doit-il représenter les abonnements comme un pôle de plus ou comme
   une notion distincte de la transaction ?
2. `/conditions`, `/aide` et `/publier` énoncent le modèle abandonné. Qui
   rédige la version de remplacement, et jusqu'où va la réécriture juridique ?
3. Le jeu de rôles du code diverge de B.5 sur sept entrées. Quelle liste
   retient-on, et que devient `courtier` ?
4. L'Espace agence n'existe pas et c'est la principale source de revenu :
   une formule ou plusieurs, quel contenu, quel prix ?
5. Comment les demandes d'accompagnement sont-elles distribuées aux agences,
   sans vendre de contact et de façon compréhensible ?
6. Cinq identités d'utilisateur courant : laquelle fait foi ?
7. Les revenus divergent d'un facteur 5 entre deux fichiers : lequel fait foi,
   et faut-il une source unique comme pour le catalogue ?
8. Que faire des brèves de marché inventées et des compteurs d'engagement du
   post épinglé ?
