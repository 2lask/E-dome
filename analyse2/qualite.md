# Audit qualité & données — E-Dome (Mission 2)

Balayage réel du 2026-09-25 sur `feat/plateforme-v2`, lecture seule. Portée :
`src/app/(app)/`, `src/components/`, `src/lib/`, `tests/`. Les 52 routes
connues sont celles listées par la structure de dossiers sous `src/app/(app)/`
(fichiers `page.tsx`), plus `/`, `/auth/connexion`, `/auth/inscription`,
`/auth/erreur`, `/merci`, `/admin/leads` hors du groupe `(app)`.

Complète `TODO.md`, qui documente déjà une bonne partie du terrain — ce
fichier revérifie chaque point à la ligne près et ajoute ce que `TODO.md` ne
couvrait pas (le compte exhaustif des boutons morts, le statut des liens, la
consultation des tests).

---

## 1. Boutons morts (`<button>` sans `onClick`, sans `type="submit"`, sans `formAction`)

Scan programmatique (parseur de balises maison, pas une regex naïve) sur
`src/app/(app)/**` et `src/components/**`. 14 candidats bruts ; 6 sont des
faux positifs légitimes (4 utilisent `onMouseDown` au lieu de `onClick` dans
`recherche/page.tsx`, 2 sont des boutons `disabled` d'état de chargement/succès
dans `formations/[id]/page.tsx:325` et `:331` — pas des boutons morts, des
états intermédiaires corrects). **8 boutons réellement morts** :

| # | Fichier:ligne | Libellé | Gravité |
|---|---|---|---|
| 1 | `src/app/(app)/admin/page.tsx:423` | « Sauvegarder les paramètres » | Moyenne — page admin, mais visible et cliquable sans effet |
| 2 | `src/app/(app)/boutique/[id]/page.tsx:428` | « Favoris » (fiche produit) | Haute — le cœur `Heart` suggère un toggle, aucun état ne bouge |
| 3 | `src/app/(app)/boutique/[id]/page.tsx:437` | « Partager » (fiche produit) | Haute — à côté d'un vrai bouton « Ajouter au panier » fonctionnel, l'absence de retour est visible |
| 4 | `src/app/(app)/dashboard/annonces/page.tsx:278` | icône « Modifier » (aria-label) | Moyenne — sur chaque carte de la liste, répété N fois |
| 5 | `src/app/(app)/dashboard/annonces/page.tsx:285` | icône « Plus d'options » (aria-label) | Moyenne — idem, répété N fois |
| 6 | `src/app/(app)/explorer/[id]/page.tsx:961` | « QR Code » (partage de lien apporteur) | Basse/Moyenne — son voisin direct `href="mailto:..."` (ligne 958) fonctionne, l'asymétrie saute aux yeux |
| 7 | `src/app/(app)/feed/page.tsx:847` | « J'aime » sur un commentaire | Haute — très visible, sur chaque commentaire du fil ; le bouton « Répondre » juste en dessous (ligne 850) a lui un `onClick` |
| 8 | `src/app/(app)/investisseurs/page.tsx:227` | « Télécharger » (rapport) | Moyenne — répété pour chaque `REPORTS.map` |

Recoupe le chiffre de `TODO.md` (« Le plan en comptait ~14 ») : sur les
boutons `<button>` restants (hors les 4 Exporter/Télécharger déjà traités à
l'étape 8), il en reste 8 sans aucun gestionnaire — plus les deux faux
positifs `disabled` à ne pas retraiter, et les 4 boutons `recherche/page.tsx`
qui sont en réalité câblés (`onMouseDown`, pas `onClick` — le choix est
volontaire pour éviter le blur de l'input avant le clic, mais si un futur
audit refait ce grep il tombera sur les mêmes 4).

---

## 2. Liens cassés (`href` / `router.push` / `router.replace` vers une route interne)

Scan programmatique de toutes les valeurs `href="/..."`, `router.push("/...")`
`router.replace("/...")` dans `src/app/(app)/`, `src/components/`, `src/lib/`,
comparées à la liste réelle des 52 routes + les routes hors groupe `(app)`
(`/`, `/auth/connexion`, `/auth/inscription`, `/auth/erreur`, `/merci`,
`/admin/leads`, `/api/*`).

**Aucun lien interne cassé trouvé.** Les seules cibles hors de la liste des
52 routes (`/`, `/auth/connexion`, `/auth/inscription`, `/merci?ref=...`)
correspondent toutes à des pages réelles hors du groupe `(app)` (landing,
auth, confirmation) — pas des 404.

En revanche, **5 liens externes pointent vers des adresses qui n'existent
pas réellement** (le chiffre « cinq » de `TODO.md` est confirmé, source
identifiée) : le composant `src/components/ui/calendar.tsx` (alias
`BookingCallout`) pointe vers des URL `cal.com/edome/...` fictives :

- `src/components/ui/calendar.tsx:48` — défaut `https://cal.com/edome/demo` (non utilisé actuellement, aucun appelant ne laisse le défaut)
- `src/app/(app)/aide/page.tsx:177` — `https://cal.com/edome/support`
- `src/app/(app)/formations/[id]/page.tsx:403` — `https://cal.com/edome/formateur-${instructor.id}` (dynamique, donc autant d'URL mortes que d'instructeurs)
- `src/app/(app)/investisseurs/page.tsx:239` — `https://cal.com/edome/strategie-investisseur`
- `src/app/(app)/reservations/page.tsx:414` — `https://cal.com/edome/conseil-location-courte`

Gravité : Moyenne. Ce sont des CTA visibles (« Réserver un appel »), et
`edome` n'est pas un compte cal.com réel — cliquer mène soit à une page
cal.com « n'existe pas », soit à un compte tiers si quelqu'un l'enregistre un
jour. À neutraliser (lien désactivé + « bientôt disponible », ou vrai lien de
contact) avant toute mise en avant publique.

Note méthode : le scan ne peut pas détecter un `href={variable}` construit
loin de son usage (pas de flux de données statique) ; la revue manuelle des
composants de navigation (sidebar, header, mobile-nav, cards) n'a rien trouvé
de plus. Aucun `href="#"` trouvé dans `src/`.

---

## 3. Incohérences de données entre écrans

### 3.1 Toujours ouvertes (vérifiées à nouveau, lignes actuelles)

**`/reseau` — l'onglet « Abonnés » affiche tout l'annuaire, pas les
abonnés réels.**
`src/app/(app)/reseau/page.tsx:76-77` :
```
const base: PersonSummary[] =
  tab === "abonnements" ? followingIds : tab === "decouvrir" ? notFollowing : people;
```
et `counts.abonnes = people.length` (ligne 90). Le tab par défaut
(`tab === "abonnes"`) tombe dans la branche `people` (tout l'annuaire), pas
dans une liste de vrais followers — qui n'existe nulle part dans le modèle.
Gravité : **Haute** — c'est un compteur social visible en premier écran de la
page, et il ment structurellement (il n'y a même pas de notion de « qui me
suit » dans les données, seulement `isFollowing` = qui l'utilisateur suit).

**Notifications : trois comptes différents, toujours en désaccord.**
- `src/components/layout/sidebar.tsx:113` — `const unreadNotifications = 3;` (en dur, badge sidebar)
- `src/components/layout/header.tsx:334` — texte fixe « Aucune nouvelle notification » dans le menu cloche, quel que soit l'état réel
- `src/app/(app)/notifications/page.tsx:27-38` — 10 notifications, dont **5 non lues** (`n1`…`n5`, `read: false`)

Trois affichages, trois chiffres (3 / 0 / 5) pour la même donnée. Gravité :
**Haute** — visible en permanence dans la barre latérale et l'en-tête, sur
toutes les pages.

**`/apporteurs` — second tableau de montants, toujours en dur, toujours
déconnecté du journal.**
`src/app/(app)/apporteurs/page.tsx:125-136` (`MOCK_APPORTS`, `MOCK_VERSEMENTS`)
alimente `totalCommissions` (ligne 222, = 1034 CHF : 100+0+36+100+750+48) et
`totalVersements` (ligne 223, = 934 CHF : 886+48), affichés lignes 515 et 519.
Aucun lien avec `src/lib/demo/ledger.ts`. En parallèle, `/dashboard` (ligne
208) et `/dashboard/apporteurs` (ligne 54) affichent
`apporteurSummary.earnedThisMonth`, qui lui **est** dérivé du journal
(`src/lib/dashboard-data.ts:430`, `derive.currentMonth({ source: "apporteurs" })`).
Le test `test:data` #17 ne vérifie que la cohérence interne de
`apporteurSummary` — il ne touche jamais `/apporteurs` (page utilisateur), qui
reste donc un troisième chiffre non testé et non garanti cohérent avec les
deux premiers. Gravité : **Haute** — c'est un montant financier (« gains »),
la catégorie la plus sensible pour la crédibilité de la démo.

**Vues : deux comptages toujours disjoints.**
`src/app/(app)/dashboard/annonces/page.tsx:86-93` (`MOCK_LISTINGS`) porte des
`views` en dur, `totalViews` (ligne 135) = 2840+1240+3120+0+480+230+612+4800 =
**13 322**. `src/lib/dashboard-data.ts:190` calcule les vues du tableau de
bord via `derive.nightsThisMonth(id) * 34` — un nombre différent (≈ 5 060,
conforme au chiffre de `TODO.md`). Gravité : Moyenne — deux pages du même
espace « dashboard », deux définitions de « vue », aucune n'est fausse en soi
mais elles ne peuvent pas cohabiter sans note explicative.

### 3.2 Partiellement résolue depuis `TODO.md` (à corriger dans le fichier de suivi)

**« 16 annonces actives »** — `TODO.md` la liste encore comme ouverte
(« à trancher »), mais `src/app/(app)/dashboard/page.tsx:69-79` a déjà ajouté
une décomposition (`hint={annoncesDecomp}` ligne 202) : « 3 biens · 3
formations · 4 événements · 3 services · 3 produits ». Le total mélange
toujours des types hétérogènes, mais ce n'est plus une boîte noire — un
lecteur qui survole la carte voit la composition. Reste ouvert : est-ce que
« annonce » est le bon mot pour un devis de service ou une alerte de stock ;
mais ce n'est plus une incohérence cachée, juste un choix de vocabulaire
discutable. **À rétrograder de « incohérence » à « choix lexical » dans le
suivi.**

### 3.3 Vérifiées comme non reproductibles

Comptes de `currentUser` / `DEFAULT_PROFILE` / profil public : couverts et
gardés verts par `test:data` (tests 12-14, 16) — followers, avis, biens
possédés. Pas de nouvelle divergence trouvée en dehors de ce que `TODO.md`
documentait déjà comme résolu.

---

## 4. États vides / erreur sur les routes dynamiques

Vérification de chaque route dynamique avec un id qui n'existe pas dans le
catalogue :

| Route | Comportement id inconnu | Fichier |
|---|---|---|
| `/explorer/[id]` | État « Bien introuvable » géré, pas de crash | `explorer/[id]/page.tsx:237-241` |
| `/profil/[id]` | État « Profil introuvable » géré | `profil/[id]/page.tsx:105-108` |
| `/formations/[id]` | État « Formation introuvable. » géré | `formations/[id]/page.tsx:112-115` |
| `/formations/[id]/lecon/[n]` | État « Lecon introuvable » géré (id ou n° de leçon hors bornes) | `formations/[id]/lecon/[n]/page.tsx:64-70` |
| `/boutique/[id]` | Appelle `notFound()` (vraie page 404 Next.js) | `boutique/[id]/page.tsx:182` |
| `/evenements/[id]` | État « Événement introuvable » géré | `evenements/[id]/page.tsx:29-36` |
| `/live/replay/[id]` | État « Replay introuvable » géré + métadonnées adaptées | `live/replay/[id]/page.tsx:40-67` |
| `/agence/[slug]` | Message « Cette agence n'existe pas dans la démonstration. » | `agence/[slug]/page.tsx:23` |
| `/reunion/[roomId]` | Pas de notion d'existence (salle WebRTC ad hoc) — non applicable | `reunion/[roomId]/page.tsx` |

**Bon point : aucun crash trouvé.** Toutes les routes dynamiques à données
gèrent l'id inconnu, avec des libellés cohérents entre eux (« introuvable »).
Seule `boutique/[id]` utilise le vrai mécanisme Next.js `notFound()` — les
autres affichent un état géré à la main sans passer par la 404 native ; ce
n'est pas un bug (le rendu reste correct), mais c'est une incohérence de
patron de code si quelqu'un veut un jour uniformiser.

---

## 5. Tests — couverture actuelle et trous pour la Mission 2

### Ce qui existe

- **`tests/data/integrity.test.ts`** (`npm run test:data`, `node --test`) —
  18 assertions solides sur la cohérence interne du journal, des deux moteurs
  de revenus, de l'identité utilisateur unique, des dates, et (test 17) de
  `apporteurSummary`. C'est la meilleure ligne de défense actuelle contre les
  régressions de données.
- **`tests/e2e/smoke-protected-routes.spec.ts`** — vérifie que `/`, `/merci`,
  `/confidentialite`, `/admin/leads` répondent 200, affichent leur contenu
  attendu et ne lèvent aucune erreur JS. Garde-fou contre les régressions
  d'hydratation causées par des changements globaux (ex. renommage de rôle).
- **`tests/e2e/no-traction-claims.spec.ts`** — 4 épreuves ciblées : `/admin`
  sans chiffre de traction plateforme, `/apporteurs` sans montants du
  podium, `/feed` sans brève chiffrée, `/demo` sans nombre d'inscrits.
- **`tests/e2e/interest-form.spec.ts`** — parcours complet du formulaire
  d'inscription (3 profils, parrainage, refus de consentement), assertions
  sur ce qui est réellement écrit dans le magasin, pas seulement affiché.

### Trous pour la Mission 2

- **Aucun test « no dead buttons »** — noté dans `TODO.md` comme non écrit ;
  confirmé absent (`tests/e2e/` ne contient que les 3 fichiers ci-dessus). Les
  8 boutons morts de la section 1 ne seraient pas détectés par la suite
  actuelle.
- **Aucun test sur la cohérence `/apporteurs` ↔ `/dashboard/apporteurs`** —
  le test 17 de `test:data` couvre uniquement `apporteurSummary`, jamais
  `MOCK_APPORTS`/`MOCK_VERSEMENTS` de la page `/apporteurs`.
- **Aucun test sur `/reseau`** (onglet Abonnés) ni sur les compteurs de
  notifications (sidebar/header/page) — les trois incohérences les plus
  visibles de la section 3.1 ne sont couvertes par rien.
- **Aucun test sur les liens externes morts** (`cal.com/edome/*`).
- **Aucun test sur les états vides des routes dynamiques** — le comportement
  est correct aujourd'hui (section 4) mais rien n'empêche une régression
  silencieuse ; un seul test paramétré sur les 8 routes couvrirait le risque.
- **`/admin` non protégé** (déjà documenté dans `TODO.md`, section Sécurité)
  n'a aucun test négatif (« sans session, `/admin` doit rediriger ou refuser »)
  — contrairement à `/admin/leads`, qui lui est vérifié par
  `smoke-protected-routes.spec.ts` seulement pour son état "porte d'entrée",
  pas pour une vraie protection puisqu'il n'y en a pas non plus en
  production sans mot de passe configuré.

---

## 6. Affirmations de traction sur E-Dome

Aucune trouvée en dehors de ce que `no-traction-claims.spec.ts` garde déjà
vert, et aucune régression détectée pendant ce balayage. La seule occurrence
de chiffres historiques (2 847 / 1 253 / 387 500) restante dans le code est
un **commentaire** de code expliquant ce qui a été retiré
(`src/app/(app)/admin/page.tsx:87`), pas un texte affiché — sans risque pour
l'utilisateur final, mais à surveiller si quelqu'un décide un jour
d'assainir aussi les commentaires.

---

## Résumé des gravités

| Catégorie | Compte | Gravité dominante |
|---|---|---|
| Boutons morts confirmés | 8 | Haute (3), Moyenne (5) |
| Liens internes cassés | 0 | — |
| Liens externes vers adresse fictive | 5 (`cal.com/edome/*`) | Moyenne |
| Incohérences de données ouvertes | 4 (reseau, notifications, apporteurs, vues) | Haute (3), Moyenne (1) |
| Incohérence rétrogradée (déjà mitigée) | 1 (« 16 annonces ») | Basse |
| Routes dynamiques qui plantent | 0 | — |
| Tests manquants critiques pour Mission 2 | 6 catégories | — |
| Affirmations de traction actives | 0 | — |
