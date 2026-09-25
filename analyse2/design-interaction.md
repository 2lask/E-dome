# Audit design d'interaction — E-Dome (mobile 360px + desktop)

Méthode : navigation Playwright (chromium) contre le serveur dev déjà lancé sur `localhost:3002`, viewport mobile 360×780 et desktop 1440×900. Routes couvertes en mobile : `/demo`, `/feed`, `/explorer`, `/explorer/prop1`, `/explorer/inexistant`, `/messages`, `/dashboard`, `/agence`, `/tarifs`, `/publier`, `/profil`, `/profil/inexistant`, `/formations`, `/formations/inexistant`, `/boutique`, `/boutique/inexistant`, `/favoris` (+ onglet Publications), `/notifications` (+ onglet Lues), recherche vide sur `/messages`. Desktop : `/demo`, `/feed`, `/explorer`, `/dashboard`, `/tarifs`, `/messages`, `/agence`. Vérification systématique de `document.documentElement.scrollWidth` (débordement horizontal), des erreurs console/`pageerror`, et test clavier (Tab) sur `/explorer`.

Aucun débordement horizontal (`scrollWidth`) détecté sur les 18 routes mobiles testées — le responsive de base (grilles, conteneurs) est sain à 360px. Les problèmes trouvés sont ailleurs : texte tronqué dans des lignes flex sans `min-w-0`, imbrication HTML invalide, un état 404 mal aiguillé, et une visibilité du focus clavier proche de zéro pour la majorité des boutons.

---

## 1. Bugs confirmés (gravité haute)

### 1.1 `<a>` imbriqué dans `<a>` sur `/formations` — HTML invalide + erreur d'hydratation React
**Fichier** : `src/app/(app)/formations/page.tsx:205` et `:220`
Chaque carte de formation est un `<Link href={.../formations/${f.id}}>` (donc un `<a>`), qui contient un second `<Link href={.../profil/${f.instructor.id}}>` (donc un second `<a>`) pour le nom du formateur, avec un `onClick={(e) => e.stopPropagation()}` pour tenter d'isoler le clic. `stopPropagation()` ne corrige pas l'imbrication HTML : un `<a>` ne peut pas contenir un `<a>`.
Conséquence mesurée : à chaque chargement de `/formations`, React lève une vraie erreur d'hydratation (« In HTML, `<a>` cannot be a descendant of `<a>`... This will cause a hydration error ») capturée en `pageerror`/console, et le sous-arbre est regénéré côté client (flash visuel possible, perte de la version SSR). C'est aussi un problème d'accessibilité : deux éléments interactifs imbriqués cassent la navigation clavier/lecteur d'écran (Tab, VoiceOver/NVDA annoncent un lien dans un lien, comportement indéterminé selon navigateurs).
Comparaison utile : `src/components/feed/post-card.tsx:157` fait le même besoin (lien vers le profil de l'auteur dans une carte cliquable) mais correctement — la carte parente est un `<article>`, pas un `<Link>`. `formations/page.tsx` est donc une régression isolée, pas un pattern généralisé.
**Fix suggéré** : remplacer le `<Link>` englobant par un `<article>`/`<div>` avec `onClick`+`role="link"` géré en JS (ou déplacer le lien formateur hors de la zone cliquable de la carte, ex. sous l'image plutôt que dans le bloc titre).

### 1.2 Hydratation cassée sur `/feed` — horodatage de sondage calculé pendant le rendu
**Fichier** : `src/components/feed/poll-block.tsx:12-19` (fonction `pollTimeLeft`), appelée en render à `:60` (`` `· ${pollTimeLeft(poll.endsAt)}` ``)
`pollTimeLeft()` fait `new Date(endsAt).getTime() - Date.now()` directement dans le corps de rendu d'un composant client. Un composant `"use client"` est quand même rendu côté serveur pour le HTML initial : `Date.now()` diffère (même de quelques ms) entre le rendu serveur et l'hydratation client, et si l'écart franchit une frontière d'affichage (`"3 h restantes"` → `"Sondage terminé"`, ou `h`→`min`), le texte SSR ≠ texte client.
Confirmé en conditions réelles : chargement direct de `/feed` déclenche un `pageerror` « Hydration failed because the server rendered text didn't match the client... This can happen if a SSR-ed Client Component used... Date.now() ». C'est très probablement la source du badge « 1 Issue » du dev overlay Next.js visible en bas à gauche sur toutes les pages testées (voir capture `ix-feed-top2000.png` — badge rouge « 1 Issue ✕ » superposé à la barre de navigation mobile, recouvrant partiellement « Accueil »/« Explorer »).
Un commentaire existe déjà dans `src/components/feed/attach-cards.tsx:20` avertissant explicitement d'éviter `Math.random()` « sinon mismatch d'hydratation SSR/client » — la même règle n'a pas été appliquée à `Date.now()` dans `poll-block.tsx`.
**Fix suggéré** : calculer `pollTimeLeft` seulement après montage (`useEffect` + `useState`, ou `suppressHydrationWarning` sur le seul `<span>` concerné si l'écart visuel est jugé acceptable).

### 1.3 Dashboard mobile — valeurs numériques tronquées au milieu d'un caractère (360px)
**Fichier** : `src/app/(app)/dashboard/page.tsx`, composant `ProgressRow` (~ligne 310-336), utilisé lignes 135-161 dans la carte « Objectifs du mois »
La ligne `<div className="mb-1.5 flex items-baseline justify-between">` place le libellé (`Revenus du mois`) et la valeur (`14'641 / 30'000 CHF`) sur une même ligne flex sans `flex-wrap`, sans `min-w-0`/`truncate` sur aucun des deux `<span>`. À 360px, le texte de droite déborde silencieusement de la carte (pas de `scrollWidth` de page car le débordement est absorbé par le `overflow-hidden` du `Card` parent) et se retrouve **coupé net, y compris au milieu d'un chiffre** :
- « Revenus du mois » → `14'641 / 30'000 C` (le reste de « CHF » disparaît)
- « Réservations » → `12 / ` (la cible disparaît entièrement)
- « Note moyenne » → `4.14 / ` (idem)
- « Taux d'occupation cible » → `37% / 8` (le `5%` final coupé à mi-chiffre)
Capture zoomée : `ix-dash-objectifs-zoom.png`. C'est une régression de lisibilité sur des métriques business capitales (revenus, réservations) — précisément le genre d'écran qu'un agent/propriétaire regarde en premier sur mobile.
**Fix suggéré** : `flex-wrap` + `whitespace-nowrap` sur la valeur avec `text-right shrink-0`, ou passer en deux lignes sous 400px (libellé au-dessus, valeur en dessous), ou réduire la taille de police de la valeur en `clamp()`.

### 1.4 `/boutique/[id-inexistant]` — le vrai 404 se prend les pieds dans le chrome de l'app (mobile)
**Fichiers** : `src/app/(app)/boutique/[id]/page.tsx:182` (`if (!product) return notFound();`) → remonte jusqu'à `src/app/not-found.tsx` (aucun `not-found.tsx` propre au groupe `(app)`) ; superposition avec `src/components/layout/app-shell.tsx` (chrome) et `src/components/ai/ai-assistant.tsx:117` (bouton flottant).
`src/app/not-found.tsx` est conçu comme une page **pleine hauteur autonome** (`min-h-screen flex flex-col items-center justify-center`), pensée pour remplacer tout l'écran (URL totalement inconnue). Mais parce que `(app)/` n'a pas son propre `not-found.tsx`, `notFound()` appelé depuis une page du groupe fait quand même remonter au `not-found.tsx` racine **tout en gardant l'AppShell monté autour** (header « Maquette de démonstration », barre de recherche, et surtout la `MobileNav` fixe en bas + le FAB rond « Expert IA »). Résultat mesuré à 360px sans scroll (`ix-boutique-404-viewport-only.png`) :
- Le bouton IA flottant (`fixed bottom-24 right-5 z-40`) est visuellement posé **sur** la phrase « La page que vous recherchez n'existe pas » — confirmé par `elementFromPoint` en JS (le point central du texte renvoie l'élément SVG du bouton, pas le texte).
- Les deux CTA (« Retour au feed », « Explorer ») ne sont pas visibles dans le premier écran ; l'utilisateur doit deviner qu'il faut scroller pour les atteindre (ils redeviennent bien cliquables une fois scrollé jusqu'en bas — vérifié, ce n'est donc pas un blocage total, mais la première impression est celle d'une page cassée/coupée).
**Fix suggéré** : créer un `not-found.tsx` dans `src/app/(app)/` qui rend le même contenu mais dimensionné pour vivre *dans* l'AppShell (`min-h-[60vh]` au lieu de `min-h-screen`, cohérent avec `(app)/error.tsx` qui utilise déjà `min-h-[60vh]`).

---

## 2. États « introuvable » incohérents entre routes dynamiques (gravité moyenne)

Aucune des 4 routes `[id]` testées avec un identifiant bidon ne plante, ce qui est le principal point positif de cette catégorie — mais chacune réinvente son propre mini state, avec des résultats inégaux :

| Route | Fichier | Bouton de retour ? | Style |
|---|---|---|---|
| `/explorer/inexistant` | `explorer/[id]/page.tsx:238-248` | Oui (« Retour à l'explorer ») | `py-20 text-center`, pas centré verticalement, gros vide en dessous |
| `/profil/inexistant` | `profil/[id]/page.tsx:105-121` | Oui (« Retour au feed ») | idem, pas centré |
| `/formations/inexistant` | `formations/[id]/page.tsx:112-118` | **Non** | `min-h-[50vh] flex items-center justify-center`, un simple `<p>` gris « Formation introuvable. », aucun lien, aucun bouton |
| `/evenements/[id-inexistant]` | `evenements/[id]/page.tsx:29-44` | Oui (« Retour aux événements ») + icône | le plus abouti des quatre (icône, `min-h-screen` centré) |
| `/boutique/inexistant` | via `notFound()` | Oui, mais caché (voir 1.4) | seul cas à utiliser le vrai 404 Next.js |

Le cas `/formations/inexistant` est le plus problématique : sur mobile, un utilisateur qui atterrit sur un lien de formation mort (partagé, expiré, mal formé) voit un écran quasi blanc avec une seule phrase grise, et n'a **aucune affordance pour repartir** sinon la nav globale. C'est un cul-de-sac silencieux, à l'opposé de la qualité du `(app)/error.tsx` et du `not-found.tsx` racine qui, eux, sont bien conçus (icône/Lottie, titre, texte, CTA).
**Fix suggéré** : factoriser ces 4 (5) implémentations dans un composant partagé `<NotFoundState icon title description ctaHref ctaLabel />`, et l'utiliser partout — y compris pour combler le manque sur `/formations/[id]`.

---

## 3. Accessibilité clavier — focus quasi invisible (gravité haute)

### 3.1 Focus supprimé sans remplacement en mode PWA installé
**Fichier** : `src/app/globals.css:359-361`
```css
@media (display-mode: standalone), (display-mode: fullscreen) {
  .app-shell *:focus { outline: none; }
}
```
Dès que l'app tourne en PWA installée (standalone/fullscreen), **tout** indicateur de focus disparaît sur **tous** les éléments de `.app-shell`, sans remplacement (pas de `box-shadow`/ring de secours dans ce bloc). Un utilisateur clavier (ou clavier Bluetooth sur tablette, PWA de bureau installée) perd toute indication de la position du focus. Violation WCAG 2.4.7 (Focus Visible, AA).

### 3.2 Anneau de focus par défaut quasiment invisible même hors PWA
**Fichiers** : `src/app/globals.css:243-246` (`* { @apply border-border outline-ring/50; }`), combiné à `--ring: #d4d4d8` en mode clair (`globals.css:13`)
Testé concrètement : `Tab` × 6 sur `/explorer` (360px) amène le focus sur le bouton cloche (notifications, `header.tsx:308-327`). `getComputedStyle` confirme un `outline: auto` actif (donc pas supprimé), mais sa couleur résolue est un gris très clair à 50 % d'opacité — capture zoomée `ix-focus-bell-zoom.png` : **aucun anneau visible à l'œil**, sur un bouton avec fond quasi blanc. Le composant `Button` partagé (`src/components/ui/button.tsx:8`) a lui un vrai traitement `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`, mais la majorité des boutons de l'app sont écrits à la main (`mobile-nav.tsx`, `not-found.tsx`, `error.tsx`, cartes du dashboard, etc. — seuls 10 fichiers sur l'ensemble du repo utilisent `focus-visible` explicitement) et héritent donc du style de base à faible contraste plutôt que du ring stylé. Un utilisateur clavier peut naviguer toute l'app sans jamais voir où il se trouve.
**Fix suggéré** : soit relever le contraste de `--ring` en clair (au moins 3:1 contre le fond, cf. WCAG 2.4.11), soit généraliser le pattern `focus-visible:ring-2` du composant `Button` à tous les boutons/liens custom via une classe utilitaire partagée.

### 3.3 Deux champs de recherche identiques et ambigus sur `/messages`
**Fichier** : `src/app/(app)/messages/page.tsx:542-545` (recherche de conversation) vs la recherche globale du header
Exactement 2 `<input placeholder="Rechercher...">` co-existent sur `/messages` (vérifié par sélecteur DOM), sans `aria-label` sur ni l'un ni l'autre pour les différencier. Un lecteur d'écran annoncera deux champs identiques « Rechercher, texte à saisir » sans moyen de savoir lequel filtre les conversations et lequel lance une recherche globale.
**Fix suggéré** : `aria-label="Rechercher une conversation"` sur `messages/page.tsx:542`, `aria-label="Recherche globale"` sur le champ du header.

### 3.4 Badge « non lu » invisible pour lecteur d'écran
**Fichier** : `src/components/layout/header.tsx:313` vs `:322-326`
Le bouton cloche a un bon `aria-label="Notifications"` (+ `aria-haspopup`/`aria-expanded`, correctement posés), mais le petit point doré signalant des notifications non lues est `aria-hidden` sans équivalent textuel — un utilisateur voyant sait qu'il a des non-lus, un utilisateur de lecteur d'écran non.
**Fix suggéré** : enrichir l'`aria-label` dynamiquement (« Notifications, 3 non lues ») quand un compteur existe.

---

## 4. Marge de sécurité de la nav mobile fixe (risque, non confirmé visuellement)

**Fichiers** : `src/components/layout/app-shell.tsx:170` (`pb-20 md:pb-6` sur le `<main>`) vs `src/components/layout/mobile-nav.tsx:75-81` (`height: calc(64px + env(safe-area-inset-bottom))`)
Le padding bas appliqué au contenu (`pb-20` = 80px) est fixe, alors que la vraie hauteur de la nav varie avec l'inset de sécurité de l'appareil. Sur un iPhone à encoche/barre home (inset ≈ 34px), la nav mesure ≈ 98px — supérieur aux 80px de marge réservés. Les derniers ~18px de contenu défilant pourraient donc passer sous la nav fixe sur ce type d'appareil. **Non vérifiable visuellement ici** : Chromium/Playwright sans émulation d'appareil réel ne simule pas `env(safe-area-inset-bottom)` (résout à 0), donc ce point est une lecture de code, pas une capture. À vérifier sur un vrai iPhone ou un simulateur iOS.
Point positif à noter en passant : cette marge protège correctement la nav sur `/tarifs`, `/publier`, `/agence`, `/dashboard`, etc. sur viewport standard (aucun chevauchement réel constaté en dehors du cas 1.4) — le chevauchement apparent de la nav au milieu de certaines captures `fullPage` (ex. `/tarifs`, `/publier`) est un **artefact de capture** (la nav est `position: fixed`, et le stitching `fullPage` de Playwright la « republie » à intervalles réguliers dans l'image assemblée) et non un bug réel — confirmé en comparant à une capture viewport-only (sans `fullPage`) qui ne montre aucun chevauchement sur ces pages.

---

## 5. États vides — ce qui fonctionne bien

Contrairement à l'hypothèse de départ (« une liste sans données affiche-t-elle du blanc ? »), les listes testées ont de vrais états vides soignés :
- **`/favoris` → onglet « Publications »** (vide dans les données mock) : icône document, titre « Aucune publication sauvegardée », sous-texte explicite. Bon exemple (`favoris/page.tsx:160`).
- **`/messages` → recherche sans résultat** (`messages/page.tsx:549-559`) : icône bulle, « Aucune conversation pour « zzzznoresultxyz » », capture `ix-empty-messages-search2.png`. Bon exemple, contextualise la requête tapée.
- **`/notifications`** (`notifications/page.tsx:185-190`) : garde `Aucune notification.` codée, non testable visuellement ici (les onglets « Non lues »/« Lues » sont tous deux peuplés par les données mock) mais le code est présent et correct.

Aucun de ces trois écrans n'a pu être pris en défaut. Le seul vrai manque d'état vide constaté est indirect : les écrans `[id]` avec ID invalide (section 2), où « vide » veut dire « plus rien à afficher » et où le traitement est inégal plutôt qu'absent.

---

## 6. Chargement — infrastructure présente mais peu utilisée

- `(app)/loading.tsx` (Lottie spinner) et `(app)/error.tsx` (icône + message + bouton Réessayer) sont bien conçus et cohérents visuellement, mais ne se déclenchent qu'au niveau `Suspense` d'une route entière lors de la navigation — non testé ici en conditions réelles de lenteur réseau (throttling non appliqué, budget de temps).
- Le composant `Skeleton` (`src/components/ui/skeleton.tsx`) n'est utilisé que dans **une seule route** de toute l'app (`(app)/live/page.tsx`). Comme toutes les données sont des imports mock synchrones (pas de vrai `fetch`), la plupart des zones (tableaux du dashboard, listes de messages, grilles de biens) passent instantanément de rien à plein, sans transition de chargement — indolore aujourd'hui, mais à corriger avant de brancher des données réelles/Supabase, sous peine de sauts bruts.

---

## 7. Cibles tactiles et transitions — points positifs

- `MobileNav` respecte la cible tactile minimale de 44px (`min-w-[44px] min-h-[44px]`, `mobile-nav.tsx:159`), et le bouton central « Créer » a un état ouvert/fermé animé (rotation 45°, Lottie de fermeture) cohérent.
- `.app-page-enter` (transition d'entrée de page, `globals.css:368-380`) est désactivée proprement sous `prefers-reduced-motion: reduce` — bon réflexe d'accessibilité motion.
- La galerie photo de `/explorer/[id]` gère le swipe tactile (`touchStartX`) et s'affiche sans débordement à 360px.
- Le popup de sondage IA (« L'expert réfléchit… », `ai-assistant.tsx:195`) a un vrai indicateur de chargement (spinner + texte), contrairement au reste de l'app.

---

## Résumé (12–15 lignes)

Pires bugs mobiles confirmés : (1) `/formations` (360px et desktop) imbrique un `<Link>` dans un `<Link>` (`formations/page.tsx:205`+`:220`) → HTML invalide, erreur d'hydratation React à chaque chargement, casse la sémantique clavier/lecteur d'écran — gravité haute. (2) `/dashboard` à 360px : la carte « Objectifs du mois » (`dashboard/page.tsx` `ProgressRow`, ~ligne 325) tronque les valeurs au milieu d'un chiffre — « 14'641 / 30'000 C », « 12 / », « 37% / 8 » — sur les métriques business principales, capture `ix-dash-objectifs-zoom.png` — gravité haute. (3) `/boutique/[id-inexistant]` à 360px : le vrai 404 Next.js est englouti par le chrome de l'app, le texte du message est visuellement recouvert par le bouton flottant « Expert IA » (`ai-assistant.tsx:117`) dans le premier écran, CTA non visibles sans scroll — gravité haute. (4) `/feed` : hydratation cassée par un `Date.now()` calculé en plein rendu dans `poll-block.tsx:13`/`:60`, capturé comme vraie erreur navigateur, correspond au badge « 1 Issue » du dev overlay visible sur toutes les pages.

États vides manquants/incohérents : `/formations/[id-inexistant]` n'a aucun bouton de retour (`formations/[id]/page.tsx:112-118`), contrairement à `/explorer`, `/profil`, `/evenements` qui gèrent chacun leur propre mini-état « introuvable » de façon non standardisée (4 implémentations différentes). En revanche `/favoris` (onglet Publications), `/messages` (recherche sans résultat) et `/notifications` ont de vrais états vides bien conçus.

Accessibilité : focus clavier supprimé sans remplacement en mode PWA installée (`globals.css:359-361`) ; même hors PWA, l'anneau de focus par défaut (`globals.css:243-246`, `--ring: #d4d4d8`) est quasi invisible sur les boutons custom (confirmé par capture zoomée après 6× Tab) — seuls les composants `Button`/`Input` partagés ont un focus visible correct. `/messages` a deux champs « Rechercher... » identiques sans `aria-label` pour les distinguer. Aucun débordement horizontal détecté sur les 18 routes mobiles testées ; les chevauchements apparents de la nav sur certaines captures `fullPage` sont des artefacts de capture (nav `fixed`), pas des bugs réels, vérifié en viewport-only.
