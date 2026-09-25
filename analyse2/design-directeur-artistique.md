# Audit direction artistique — E-Dome (2026-09-25)

Méthode : capture Playwright (1440×900, full page) de 12 écrans + rechargement du code source pour chaque défaut cité. Lecture seule sur le code. Référentiel : `src/app/globals.css` (tokens `--primary`, `--rating`, `--success/--warning/--danger` + `-soft`/`-text`, classe `.page-heading` = Source Serif 4).

État général : la base est saine. Un seul système de cartes/boutons/badges est bien défini (`--card`, `--card-border`, `--radius`, `chip-*-soft`), les étoiles de notation sont uniformément ambrées (`--rating`, plus de bug « étoiles bleues »), et `--text-secondary`/`--text-muted` ne se marchent plus dessus. Le problème n'est plus l'absence de système — c'est son application inégale : 3 écrans sur 12 échappent à la règle typographique du H1, deux écrans ont une mise en page qui laisse un vide flagrant, un écran affiche des images de produits cassées.

---

## Classement des écrans (du plus faible au plus fort)

| # | Écran | Défaut dominant | Gravité |
|---|-------|------------------|---------|
| 1 | **Boutique** `/boutique` | Images produits cassées (rectangles gris figés) sur ~4/16 cartes | Élevée |
| 2 | **Espace agence** `/agence` | Page quasi vide, ~40% de vide sous la grille de 6 cartes | Élevée |
| 3 | **Tarifs** `/tarifs` | Carte « Patrimoine » orpheline, grille à 4 colonnes avec 3 vides | Moyenne-haute |
| 4 | **Messages** `/messages` | État par défaut froid : 2/3 de l'écran vide, aucune incitation | Moyenne |
| 5 | **Fil (feed)** `/feed` | Vidéo Reel avec filigrane de template tiers, colonne droite en widgets génériques peu hiérarchisés | Moyenne |
| 6 | **Démo** `/demo` | H1 hors convention (sans-serif au lieu du serif éditorial) ; sinon propre | Basse |
| 7 | **Formations** `/formations` | Bandeau hero un peu générique, sinon cohérent et dense | Basse |
| 8 | **Conditions (CGU)** `/conditions` | Mur de texte sans grille de lecture (pas de colonne resserrée), mais structure sobre correcte | Basse |
| 9 | **Explorer** `/explorer` | Carrousels tronqués net au bord viewport sans fondu — lisible mais un peu brut | Basse |
| 10 | **Profil** `/profil` | Bonne hiérarchie, RAS notable | — |
| 11 | **Fiche bien** `explorer/[id]` | Dense mais bien organisée, meilleure page « produit » du site | — |
| 12 | **Dashboard** `/dashboard` | Écran le plus abouti : KPI, graphe, objectifs, transactions — cohérent et lisible | — |

---

## Détail des 5 écrans les plus faibles

### 1. Boutique — `/boutique` (gravité élevée)

- **Défaut** : dans la grille « Toutes les catégories » (16 produits), au moins 4 cartes affichent un rectangle gris vide à la place de la photo produit — « Four pyrolyse encastrable 71 L », « Plan de travail bois massif chêne », « Hotte aspirante îlot inox », « Table basse marbre travertin ». Visuellement, ça ressemble à un chargement figé en boucle (le shimmer `.skeleton` reste affiché indéfiniment).
- **Preuve** : `src/lib/data/products.ts:564`, `:592`, `:675` référencent des photos Unsplash dont l'URL renvoie **404** (vérifié en direct : `photo-1574269910231-bc508bcb8e29`, `photo-1556909114-44e3e9636da7`, `photo-1556909114-37c9b8aacc7e` → 404). `src/components/ui/blur-image.tsx:21-38` (`BlurImage`) n'a pas de gestion `onError` : si l'`<img>` échoue, `loaded` reste `false` pour toujours, le `<div className="skeleton">` (ligne 25) ne se retire jamais, et il n'y a aucun visuel de repli (pas d'icône, pas de fond neutre). Sur une marketplace, une photo produit cassée est le pire signal de sérieux.
- **Défaut secondaire (même écran)** : les badges d'état produit (« Neuf » / « Reconditionné » / « Occasion », `boutique/page.tsx:477-480`) sont tous rendus dans le même style blanc/texte neutre, alors que l'app dispose déjà d'un triplet sémantique tout fait (`chip-success-soft` / `chip-warning-soft` / `chip-danger-soft`, exactement le motif utilisé pour `badge-level-beginner/intermediate/advanced` en Formations). Occasion mériterait un ton distinct de Neuf — actuellement rien ne les différencie visuellement, seul le texte change.
- **Gravité** : élevée — bug visible immédiatement par tout visiteur qui scrolle la boutique, pas un détail.

### 2. Espace agence — `/agence` (gravité élevée)

- **Défaut** : la page entière (`src/app/(app)/agence/page.tsx:30-81`) tient dans un conteneur `max-w-4xl` avec : un en-tête, une barre « Formule active », puis une grille de 6 cartes d'action — et rien d'autre. Le fichier se termine à la ligne 81. Résultat à l'écran (1440×900) : les cartes s'arrêtent vers y≈570px, laissant plus d'un tiers de la fenêtre en blanc pur, sans footer, sans aperçu chiffré, sans rien qui donne l'impression d'un hub actif. Pour l'écran censé vendre l'abonnement pro (le cœur du modèle économique selon le commentaire ligne 14 du fichier), c'est celui qui a le moins de substance visuelle.
- **Défaut secondaire** : le H1 (`agence/page.tsx:35`, `text-xl font-bold`) n'utilise pas `.page-heading` — rupture avec la convention serif appliquée sur 39 autres fichiers du repo (voir problème transversal n°1).
- **Gravité** : élevée — c'est un écran de conversion (upsell agence) qui se présente comme un brouillon.

### 3. Tarifs — `/tarifs` (gravité moyenne-haute)

- **Défaut** : deux grilles séparées utilisent la même classe `grid ... lg:grid-cols-4` (`tarifs/page.tsx:124` pour les 4 formules agence, `:131` pour la section particuliers). La seconde grille ne contient qu'**une** carte (« Patrimoine ») — sur desktop large, elle occupe 1 colonne sur 4 et laisse trois largeurs de colonne vides à sa droite. Visuellement la page semble inachevée à cet endroit précis, juste après une grille dense et équilibrée.
- **Défaut secondaire** : H1 (`tarifs/page.tsx:98`) également en `font-bold` brut, même rupture que `/agence`.
- **Gravité** : moyenne-haute — n'empêche rien fonctionnellement, mais casse la lecture juste au moment où l'utilisateur compare les offres, un des rares écrans à enjeu commercial direct.

### 4. Messages — `/messages` (gravité moyenne)

- **Défaut** : au premier chargement (aucune conversation sélectionnée), le panneau de droite — environ 65% de la largeur de l'écran — affiche uniquement une icône Lottie dessinée à la main et « Sélectionnez une conversation » (`messages/page.tsx:815-820`), centré sur un fond blanc sans aucune autre information (pas de suggestion de contact, pas d'aperçu, pas de CTA). Combiné à la liste de gauche qui elle-même laisse un vide sous la 6ᵉ conversation, l'écran donne une impression de produit à moitié rempli dès l'ouverture — alors que c'est un écran que l'utilisateur visite très souvent.
- **Gravité** : moyenne — pattern « deux panneaux » classique et acceptable en soi, mais l'état vide n'a reçu aucun soin (comparer avec le vide de Boutique/Agence qui, eux, sont des bugs/oublis de contenu — ici c'est un manque de finition sur un état volontaire).

### 5. Fil (feed) — `/feed` (gravité moyenne)

- **Défaut** : le premier Reel rencontré en scrollant (post vertical « Before / After » home-staging, juste après le post d'accueil « Bienvenue sur E-Dome ») affiche un filigrane **« surjo.aep »** incrusté dans la vidéo elle-même — nom de projet After Effects d'un template tiers jamais nettoyé avant intégration (pool de clips dans `public/videos/feed/`, référencé par `src/lib/video-metadata.ts:21-41`). Sur une plateforme qui se présente comme professionnelle, un filigrane de stock/template visible dans le contenu vedette du fil est un signal amateur immédiat.
- **Défaut secondaire** : la colonne de droite (« Exemple d'activité », « Sujets suivis ») empile des blocs de taille et de poids visuel quasi identiques à ceux du centre, avec des pastilles d'icônes minuscules et peu de respiration — elle ne se hiérarchise pas clairement comme secondaire par rapport au flux principal.
- **Gravité** : moyenne — le filigrane est ponctuel (un seul clip identifié) mais très visible ; la colonne latérale est un défaut d'ambiance plus diffus.

---

## Trois problèmes de cohérence transversaux

1. **La règle typographique serif/H1 n'est pas universelle.** `.page-heading` (Source Serif 4, `globals.css:641-652`) est appliquée dans 39 fichiers et fonctionne bien partout où elle est utilisée (Boutique, Formations, Explorer, Conditions…). Mais au moins 3 écrans-clés du parcours commercial y échappent avec un H1 en `font-bold` sans-serif brut, à l'identique du texte courant : `/demo` (`demo/page.tsx:48`), `/agence` (`agence/page.tsx:35`), `/tarifs` (`tarifs/page.tsx:98`). Résultat : sur ces 3 écrans précisément — ceux qui vendent le produit — l'identité éditoriale (le serif qui devait différencier E-Dome d'un SaaS générique) disparaît. Gravité moyenne-haute : ce n'est pas visible isolément, mais ça affaiblit la signature visuelle exactement là où elle devrait le plus travailler.

2. **Les vides de mise en page ne sont jamais traités comme un problème de design.** Trois écrans distincts (`/agence`, `/tarifs`, `/messages`) laissent des zones blanches non intentionnelles — contenu qui s'arrête net, grille avec une carte orpheline, état vide sans soin. Aucun de ces vides n'est catastrophique isolément, mais leur récurrence indique qu'il n'existe pas de réflexe « qu'est-ce qu'on met dans l'espace restant » en fin de composition — contrairement au Dashboard ou à la fiche bien, qui remplissent l'écran avec de la densité utile jusqu'en bas.

3. **Les tokens sémantiques (success/warning/danger-soft) existent mais ne sont pas appliqués partout où ils devraient l'être.** Le système est bon et déjà utilisé correctement à plusieurs endroits (niveaux de formation, notes, deltas de revenus). Mais Boutique n'en profite pas pour ses badges d'état produit (Neuf/Reconditionné/Occasion, tous identiques visuellement), alors que c'est exactement le type de distinction à 3 états que ce système sait déjà exprimer ailleurs dans la même app. C'est un problème de discipline d'application, pas de conception : le vocabulaire existe, il n'est simplement pas parlé partout.

---

## Priorités de reprise (si budget limité)

1. Corriger les 3-4 images 404 en Boutique + ajouter un `onError` de repli dans `BlurImage` (évite que ça se reproduise silencieusement avec d'autres URLs mortes).
2. Remplacer le clip vidéo filigrané « surjo.aep » dans le pool `public/videos/feed/`.
3. Aligner les H1 de `/demo`, `/agence`, `/tarifs` sur `.page-heading`.
4. Agence : soit étoffer l'écran (aperçu chiffré, activité récente), soit resserrer le conteneur pour que la composition ne laisse plus de vide en dessous de 900px de hauteur.
5. Tarifs : sortir la carte « Patrimoine » de la grille à 4 colonnes (conteneur dédié, largeur contrainte) pour ne plus créer 3 colonnes vides.
