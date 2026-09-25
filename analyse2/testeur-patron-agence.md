# Audit patron/directrice d'agence — Espace agence E-Dome

**Rôle** : directrice d'une régie immobilière lémanique (type Régie du Léman elle-même — Lausanne, arc Nyon–Vevey, 6 collaborateurs) qui évalue si E-Dome vaut un abonnement payant, et comment elle piloterait son agence dessus.

**Périmètre testé** : `/agence`, `/agence/abonnement`, `/tarifs`, `/agence/demandes`, `/agence/statistiques`, `/agence/equipe`, `/agence/mandats`, `/agence/regie-du-leman` (page publique). Lecture du code (`src/content/agence.ts`, `src/content/tarifs.ts`, `src/lib/pricing/catalog.ts`, `src/lib/mock-data.ts`, les 7 `page.tsx`) + parcours réel via Playwright, y compris un clic bout-en-bout sur le CTA d'upgrade.

---

## 1. Ce que j'ai cherché, et ce que j'ai trouvé

- **Ma formule active, ce qu'elle inclut** : trouvé tout de suite. `/agence/abonnement` lit `demoAgency.plan` et affiche fidèlement les inclus de `PLANS` — cohérent avec `/tarifs`, aucune divergence de prix constatée (le fichier revendique cette garantie en commentaire, et elle tient à l'usage).
- **Le mécanisme des demandes anonymes** : compris en une lecture. Ordre chronologique, pas de classement payant, quatre champs annoncés, le particulier ouvre le contact — c'est un choix de positionnement clair et je le comprends vite.
- **Comment monter de formule** : cherché, PAS trouvé de façon fonctionnelle (voir §3, c'est le trou le plus grave).
- **Gérer mon équipe (ajouter/retirer un agent, changer des droits)** : cherché, pas trouvé — la page `/agence/equipe` est un tableau, rien n'est cliquable.

## 2. Où je me suis sentie bloquée / trompée

- **Le bouton « Choisir cette formule » sur Mandats (290 CHF) ne fait rien.** Cliqué depuis `/tarifs`, j'atterris sur `/agence/abonnement`, et ma formule active affiche toujours **Vitrine, 89 CHF** — aucun changement, aucune confirmation, aucun message d'erreur, aucun « ceci nécessiterait un paiement ». En tant que patronne qui essaie littéralement de vous donner de l'argent, je tombe dans une boucle qui ne se referme sur rien. Fichiers : `src/app/(app)/tarifs/page.tsx:69-75` (le lien pointe vers `/agence/abonnement` pour toute formule `launch`) → `src/app/(app)/agence/abonnement/page.tsx:18` (relit `demoAgency.plan`, statique, jamais modifié). **Gravité : critique** — c'est l'action de conversion centrale du modèle d'affaires annoncé (« les agences s'abonnent aux outils », `tarifs.ts:17`), et elle ne mène nulle part.

## 3. Ce qui sonne faux, vide ou artificiel

- **Ma vitrine publique expose des biens à Nice et à Marrakech.** `/agence/regie-du-leman` — ma page publique, celle censée « donner envie » — affiche 3 biens : Lausanne (cohérent), puis **Villa à Nice (3'031'915 CHF)** et **Riad à Marrakech (304'762 CHF)**. Mon agence se présente comme « Vente et gérance sur l'arc lémanique, de Nyon à Vevey » (`src/content/agence.ts:22`). Le code prend juste les 3 premiers biens « vente » du catalogue global, sans aucun lien agence : `src/app/(app)/agence/[slug]/page.tsx:32` — `CATALOGUE.filter((p) => p.transactionType === "vente").slice(0, 3)`. Il n'existe aucun champ `agencyId`/`agencySlug` reliant un bien à une agence dans `mock-data.ts`. **Gravité : critique** — c'est ma vitrine commerciale, l'écran censé me vendre l'abonnement, et il est absurde au premier coup d'œil pour quiconque connaît un peu la géographie.
- **Les niveaux « Statistiques » (Vitrine, 89 CHF) et « Statistiques complètes » (Mandats, 290 CHF) sont visuellement identiques.** `/agence/statistiques` affiche toujours les 4 mêmes KPI statiques (`agencyStats.kpis`, `src/content/agence.ts:90-97`), peu importe la formule. Le libellé « complètes » (`src/content/tarifs.ts:76`) n'a aucune traduction produit — je ne vois strictement rien de plus pour 201 CHF de plus par mois. **Gravité : élevée.**
- **Le quota « mises en avant » (1/mois Vitrine, 4/mois Mandats) n'est utilisable nulle part.** Aucun bouton « mettre en avant » sur les biens listés dans `/agence/mandats`, ni ailleurs dans l'espace agence. Les seuls objets « mise-en-avant » du code sont des forfaits ponctuels à l'unité (`catalog.ts:264-265`, 79 et 199 CHF), sans lien avec le quota inclus au plan. Je paie pour un droit que je ne peux nulle part exercer.
- **« Postuler » sur une demande ne recueille aucun des quatre champs promis.** Le texte dit : « Vous renseignez taux, inclus, délai et deux références — les quatre champs imposés » (`src/content/agence.ts:50`). Le clic réel (`src/app/(app)/agence/demandes/page.tsx:22-25`) ne fait qu'ajouter l'id à un `Set` local et déclenche un toast — zéro champ saisi, zéro formulaire. Pour un mandat à 1,25M–2,4M CHF, je m'attends à au moins un minimum de sérieux dans la candidature. **Gravité : moyenne-élevée**, parce que c'est la fonctionnalité qui justifie à elle seule la formule Vitrine.

## 4. Ce qui manque

- **Aucun garde-fou de formule.** Sur « Vitrine » (89 CHF), j'ai un accès intégral à `/agence/equipe` (6 agents, droits détaillés) et `/agence/mandats` (14 mandats, taux de commission) — deux fonctionnalités vendues exclusivement dans « Mandats » (290 CHF) via `equipe-droits`, `attribution`, `mandats` dans `PLANS` (`catalog.ts:198-211`). Le commentaire du code lui-même dit qu'un contrôle devrait exister (« attribution et mandats demandent Mandats », `src/content/agence.ts:32-33`), mais `src/app/(app)/agence/page.tsx:62-79` rend toutes les sections sans aucune vérification de `demoAgency.plan`. **Concrètement : pourquoi paierais-je 290 CHF/mois si Vitrine à 89 CHF me donne déjà tout ?** C'est la question business n°1 du brief, et la réponse honnête du produit actuel est « aucune raison ».
- **`/agence/equipe` est une simple table de lecture** (le code le dit lui-même : « Vue lecture de démonstration », `src/app/(app)/agence/equipe/page.tsx:5`) — pas d'invitation, pas d'édition de droits, pas de retrait d'un agent. Pour une formule qui vend explicitement « Équipe et droits », c'est le strict minimum qui manque.
- **Aucun tunnel de paiement, nulle part** — ni Stripe, ni formulaire de carte, ni mention « à l'activation réelle ceci demandera... ». C'est acceptable pour une maquette si c'est assumé, mais rien ne l'assume : le bouton dit « Choisir cette formule » comme s'il allait aboutir.
- Petit signal à noter : les statistiques (`23 demandes reçues`, `content/agence.ts:93`) et la liste réelle des demandes ouvertes (4 items sur `/agence/demandes`) ne se recoupent jamais — pas forcément faux (certaines ont pu se clore), mais rien à l'écran n'explique l'écart, ce qui sent le chiffre de vitrine.

## Désaccords / nuances (ce que je ne reprocherais pas)

- Le mécanisme anonyme-chronologique-sans-classement-payant de `/agence/demandes` est en réalité un **argument de vente**, pas une faiblesse : contrairement à un marché de leads classique, je ne peux pas payer pour doubler un concurrent, et E-Dome ne touche aucune commission sur mes mandats (`agencyMandates`, display-only). C'est un point de confiance juridique réel (pas de courtage déguisé) que le produit gagnerait à VALORISER davantage auprès de moi plutôt qu'à le sous-jouer dans un simple paragraphe.
- Le footnote `/tarifs` — « Prix affichés à titre indicatif, en cours de validation » (`tarifs.ts:26-27`) — est honnête, mais du point de vue d'une patronne qui doit budgéter, cette phrase à elle seule me fait hésiter à m'engager tant que le prix n'est pas ferme. Ce n'est pas un bug, mais son effet sur la crédibilité perçue est réel et vaut d'être noté.

---

**Verdict** : le mécanisme métier (demandes anonymes, pas de commission E-Dome sur les mandats, cohérence prix/catalogue) est solide sur le papier et bien pensé juridiquement. Mais à l'usage, les deux écrans qui devraient me convaincre de payer — ma vitrine publique et le geste d'upgrade — sont respectivement absurde et cassé, et la hiérarchie des formules n'est pas appliquée dans le produit. Aujourd'hui, rien ne m'empêche techniquement de rester sur Presence (gratuit) ou Vitrine (89 CHF) et d'avoir quand même Équipe et Mandats. Je ne signerais pas à 290 CHF/mois en l'état.
