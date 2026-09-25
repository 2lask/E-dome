# Testeur visiteur — curieux qui découvre E-Dome sans personne à côté

Persona : je n'ai jamais entendu parler d'E-Dome, je clique sur un lien qu'on m'a envoyé, personne n'est là pour m'expliquer. Parcours réel joué avec Playwright (desktop 1280×900 et mobile 360×780) sur `/demo`, la **Visite guidée** (bouton bas-gauche, les 6 arrêts), le sélecteur **« Visiter en tant que »** (Apporteur, Administration, Créateur, Hôte, Agence), `/feed`, plus lecture du code source (`src/content/tour.ts`, `src/content/demo.ts`, `src/content/roles.ts`, `src/components/layout/guided-tour.tsx`, `src/components/layout/role-switcher.tsx`) pour vérifier ce que chaque écran fait réellement.

Critère du fondateur : après 10 minutes, sans aide, je dois avoir compris **ce qu'est E-Dome**, **à quoi ça sert pour moi**, et avoir **envie que ça existe** — sans rien de cassé. Jugé durement, comme demandé.

---

## Réponses aux 4 questions

**(1) Qu'est-ce que je cherchais, l'ai-je trouvé ?**
Sur `/demo` seul : oui, et bien. L'écran répond en un balayage d'œil aux trois questions annoncées dans son propre commentaire source (`src/content/demo.ts:8-12`) — ce que c'est, qui paie quoi, ce qui existe déjà — avec un bloc « 0 CHF à E-Dome » qui frappe fort et un disclaimer honnête en bas de page. C'est le meilleur écran du parcours. En revanche, je cherchais un **tutoriel guidé façon jeu vidéo** (c'est le bouton qui le promet : « Visite guidée », icône boussole) et j'ai trouvé un panneau de texte qui se contente de naviguer d'une page à l'autre — voir trouvaille n°1.

**(2) Où me suis-je senti perdu/bloqué/ralenti ?**
À l'étape 3 de la visite guidée (`/explorer/prop5`, rôle Hôte), le texte me dit de regarder « Le panneau « qui paie quoi » : la commission est prélevée sur l'hôte » — mais ce panneau est à **y≈2506px** de profondeur sur une page qui commence à y=0 dans un viewport de 900px (mesuré directement). Rien ne scrolle à ma place, rien ne le met en évidence : je suis planté devant la galerie photo du chalet, sans le moindre indice que ce que je cherche est 3 écrans plus bas. C'est exactement le point sur lequel le fondateur doutait déjà de son propre outil.

**(3) Qu'est-ce qui sonne faux/vide/artificiel ?**
- Le classement des apporteurs (`/apporteurs`, rôle Apporteur) : le podium des 3 premiers (Jean-Pierre D. / Sarah K. / Laura M.) s'affiche en rectangles quasi invisibles (remplissage à 10 % d'opacité), sans le moindre chiffre dessus — au premier coup d'œil ça ressemble à des blocs placeholder cassés, pas à un podium.
- `/feed` : au chargement, React jette une **erreur de hydration** en console (« Il y a 24 min » côté serveur vs « Il y a 32 min » côté client pour le même post) — invisible à l'œil nu (React se rattrape), mais visible immédiatement dans les DevTools, l'endroit où regarde justement un visiteur technique ou un investisseur en train de juger le sérieux du produit pendant ses 10 minutes.
- À l'opposé, le post épinglé « Bienvenue sur E-Dome » en tête de `/feed` est un très bon réflexe honnête (« Rien ici n'est réel… Dites-nous ce qui manque, et ce qui vous paraît faux ») — ça, ça ne sonne pas faux, ça sonne *transparent*.

**(4) Qu'est-ce qui manque pour que ce soit vraiment utile ?**
Il manque surtout que la Visite guidée soit une vraie visite guidée : surbrillance de l'élément cité, fond assombri autour, une action réellement demandée (pas un simple « Suivant » qui téléporte), et un bouton « Passer » explicite plutôt qu'une croix de fermeture ambiguë. Il manque aussi un accès à la visite depuis mobile — voir trouvaille n°2, la plus grave de l'audit.

---

## Trouvailles majeures

### 1. [IMPORTANT] La Visite guidée n'est pas un tutoriel — c'est un panneau qui navigue, exactement la crainte du fondateur
`src/components/layout/guided-tour.tsx:102-156` : à chaque étape, le composant affiche une carte flottante fixe (bas-centre) avec titre/texte/« look », et deux boutons Suivant/Précédent qui appellent `router.push(stop.route)` (ligne 67). Aucune ligne du composant ne touche à l'opacité, au `z-index` ou au style d'un élément de la page ciblée : pas de surbrillance, pas de fond assombri, pas de flèche pointant vers la cible. Confirmé en direct sur l'étape 3 (`/explorer/prop5`) : le texte dit de regarder « le panneau « qui paie quoi » », mais ce panneau est à 2506px de profondeur (mesuré, cf. plus haut) et rien à l'écran n'indique où chercher. L'utilisateur doit deviner et scroller à l'aveugle. C'est du contenu bien écrit (`src/content/tour.ts`) posé sur un mécanisme de navigation, pas sur un moteur de tutoriel — le fondateur avait raison de douter.
Corollaire : pas de bouton « Passer » — seule une croix `X` (`guidedTour.close`, ligne 112) qui ferme le panneau sans distinction entre « j'abandonne » et « j'ai compris, saute à la fin ».

### 2. [BLOQUANT] La Visite guidée est invisible sur mobile — aucune façon de la démarrer
`src/components/layout/guided-tour.tsx:90` : le bouton de lancement porte les classes `"fixed bottom-4 left-4 z-40 hidden items-center gap-1.5 ... md:inline-flex"`. `hidden` + `md:inline-flex` signifie qu'il ne s'affiche **jamais** en dessous du breakpoint `md` (768px). Vérifié par Playwright à 360×780 : `isVisible()` → `false`, `boundingBox()` → `null`. Un visiteur qui ouvre le lien de démo sur son téléphone — le scénario le plus probable pour un lien partagé — n'a strictement aucun moyen de découvrir ni de lancer la visite guidée : pas de bouton, pas de menu, pas d'entrée alternative trouvée ailleurs dans l'app. Pour une fonctionnalité présentée comme LE mécanisme d'accueil en 2 minutes, en être totalement privé sur mobile compromet à lui seul le critère des 10 minutes pour une bonne partie des visiteurs.

### 3. [MODÉRÉ] Hydration error reproductible sur `/feed`, dès le premier chargement
Cause : `src/lib/demo/posts.ts:122` — `export const hAgo = (h) => new Date(Date.now() - h*3600_000).toISOString()` — calcule une date absolue à partir de `Date.now()` au moment où le module est évalué. Comme ce module s'exécute une fois côté serveur puis une seconde fois côté client (à un instant différent), les deux horodatages divergent. `src/lib/utils.ts:8-21` (`timeAgo`) reformate ensuite cette date en « il y a X min » — donc le texte diverge aussi. Reproduit en direct : React lève `Hydration failed... + "Il y a 24 min" / - "Il y a 32 min"` pour le post `p-t2` dès l'arrivée sur `/feed`. Invisible pour un visiteur lambda (React régénère silencieusement), mais visible dans la console pour quiconque l'ouvre — exactement le public technique/investisseur que la maquette veut convaincre.

### 4. [MINEUR] Podium des apporteurs à 10 % d'opacité — lit comme un placeholder cassé
`src/app/(app)/apporteurs/page.tsx:558-582` : les trois barres du podium utilisent `bg-[var(--primary)]/10`, `bg-gray-400/10`, `bg-amber-700/10` — remplissage à 10 % d'opacité, sans aucun chiffre ni libellé sur la barre elle-même. Les hauteurs sont bien différenciées (`h-32`/`h-24`/`h-16`, l'intention est correcte), mais le rendu visuel est si pâle que les trois rectangles ressemblent à des `div` de gabarit jamais stylées plutôt qu'à un podium assumé (voir capture). Un visiteur curieux qui tombe dessus se dit « ils ont oublié de finir ça ».

### 5. [POSITIF — à noter] Le mode explicatif fonctionne et fait bien son travail
Contrairement aux points ci-dessus, le clic sur un « ? » d'un pôle (testé sur Boutique) ouvre un panneau propre avec les 4 champs annoncés (Ce que c'est / Pour qui / Ce qu'E-Dome y gagne / Quand) plus un lien direct vers l'écran réel — exactement ce que documente `src/content/explain.ts:5-19`. C'est probablement le seul mécanisme du parcours visiteur qui tient toutes ses promesses.

---

## Désaccords avec la direction évidente

- **Deux sélecteurs de rôle qui se ressemblent, jamais reliés entre eux.** Sur `/demo`, on trouve à la fois « Visiter en tant que » (bandeau du haut, `src/content/roles.ts`) et « Visite guidée » (bouton bas-gauche, `src/content/tour.ts`) — deux mécanismes distincts qui pilotent tous deux le même `viewingAs` (`src/lib/context.tsx`) mais sans qu'aucun texte à l'écran n'indique lequel choisir en premier, ni qu'ils sont liés. En testant sans savoir ce que je cherchais, je suis tombé sur le sélecteur de rôle avant la visite guidée et j'ai exploré 3 rôles avant de comprendre qu'il existait un second parcours, curé celui-là, en bas à gauche. Ce n'est pas un bug, mais pour un premier écran censé répondre à tout « en 30 secondes » (commentaire de `demo.ts:8`), avoir deux portes d'entrée non hiérarchisées vers la même idée ralentit la compréhension au lieu de l'accélérer.
- Je suis en désaccord avec la priorité donnée aux bugs BLOQUANT/IMPORTANT typiques des autres audits (annonces qui disparaissent, etc.) : du point de vue du visiteur pur, ces bugs fonctionnels comptent moins que l'absence totale de la visite guidée sur mobile — un visiteur qui n'atteint jamais le tutoriel ne découvrira jamais ces autres écrans pour en juger.

---

## VERDICT — critère des 10 minutes

**Ça ne passe pas tel quel, sur mobile — et c'est limite sur desktop.**

Sur desktop, `/demo` seul fait presque tout le travail en 30 secondes (mission accomplie pour cet écran précis), et le sélecteur de rôle permet de visiter la plateforme entière en quelques clics avec un contenu globalement honnête et cohérent (`0 CHF`, statuts « Ensuite » vérifiés cohérents entre `/demo`, `/tarifs`, `/conditions`). Mais la Visite guidée — l'outil explicitement conçu comme LE fil conducteur des 10 minutes — ne fait ni surbrillance, ni assombrissement, ni action demandée : c'est un lecteur de diapositives qui navigue, et à l'étape 3 il envoie littéralement le visiteur regarder un élément invisible à l'écran (2500px plus bas, sans scroll ni flèche). Un visiteur curieux qui clique « Suivant » six fois aura vu six écrans différents sans qu'on l'ait jamais fait regarder concrètement ce qu'on lui demandait de regarder.

Sur mobile, le verdict est net : la Visite guidée n'existe pas (bouton `hidden` sous 768px), donc le produit perd son unique mécanisme d'accueil structuré pour toute une catégorie de visiteurs — probablement la majorité de ceux qui ouvrent un lien de démo reçu par message. Sans elle, il ne reste que `/demo` (bon) et l'exploration libre (correcte mais non guidée) pour convaincre en 10 minutes. Ça peut suffire pour un visiteur patient et motivé ; ça ne suffit pas pour le critère strict « comprendre sans personne à côté, vouloir que ça existe, rien de cassé » que le fondateur a fixé lui-même.
