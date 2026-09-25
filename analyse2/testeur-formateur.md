# Audit — profil Créateur/Formateur (formations + live)

Périmètre testé : `/formations`, `/formations/[id]`, `/formations/[id]/lecon/[n]`, `/formations/creer`, `/live`, `/live/replay/[id]`.
Méthode : lecture de code (pages + `src/lib/mock-data.ts`, `src/lib/replays.ts`, `src/lib/video-metadata.ts`), pas de rendu Playwright (voir note en fin de fichier).

---

## 1. Le lecteur de leçon (`/formations/[id]/lecon/[n]`) n'est relié à RIEN — CRITIQUE

`grep -r "lecon/" src` ne retourne que le fichier de la route lui-même :
`src/app/(app)/formations/[id]/lecon/[n]/page.tsx`. Aucun `<Link>`, aucun `router.push`, nulle part dans
l'app (ni sur la fiche formation, ni sur la carte du catalogue, ni dans le sidebar de progression) ne
mène vers cette route. C'est un écran mort : on ne peut l'atteindre qu'en tapant l'URL à la main.

Or c'est très exactement l'écran qu'on attendrait pour « suivre une leçon » — barre de progression,
liste des leçons dans la sidebar, boutons Précédent/Suivant. Il existe, il est même assez soigné, et
personne ne peut jamais tomber dessus en cliquant. Pour un formateur qui vérifie « est-ce que mon élève
peut suivre mon cours ? », la réponse est : il y a deux systèmes de lecture de cours en parallèle, et
celui qui ressemble le plus à un vrai lecteur n'est jamais utilisé.

**Gravité : critique.** Contredit frontalement la consigne « chaque clic mène quelque part » — ici c'est
l'inverse, une destination entière qu'aucun clic ne mène jamais.

## 2. Ce lecteur orphelin ignore en plus le contenu réel de la formation — CRITIQUE

`src/app/(app)/formations/[id]/lecon/[n]/page.tsx:10-26` : `TOTAL_LESSONS = 12` et `LESSON_TITLES` sont
des constantes **globales, identiques pour toutes les formations** (« Introduction et objectifs », « Les
fondamentaux du marché », « Négociation avancée »…). La page appelle bien `getFormationById(id)`
(ligne 33) mais n'utilise le résultat que pour `formation.title` (ligne 111) — jamais pour
`formation.modules`. Conséquence concrète :
- Pour `form-003` (Négociation, 3 modules / 6 leçons réelles), l'URL `/formations/form-003/lecon/12`
  est acceptée comme valide et affiche « Leçon 12 : Examen et certification » — un contenu qui n'existe
  nulle part dans le vrai programme de cette formation.
- Une formation « Droit immobilier suisse » (`form-007`) et une formation « Photographie immobilière »
  (`form-008`) affichent exactement les mêmes 12 titres de leçons génériques, sans aucun rapport avec
  leur sujet.

**Gravité : critique** (vide/artificiel). Même si le point 1 était corrigé et qu'on reliait cette page,
elle resterait un vernis creux plaqué sur n'importe quel `id`.

## 3. Le catalogue et la fiche formation racontent deux histoires différentes de la même progression — MAJEUR, désaccord avec le code

`src/app/(app)/formations/page.tsx:24-27` fixe en dur `ENROLMENTS = { "form-001": 65, "form-002": 30 }` —
form-001 apparaît donc dans « Mes formations en cours » avec une barre à 65 %.

Mais `src/app/(app)/formations/[id]/page.tsx:131-135` recalcule la progression indépendamment, à partir
des champs `completed` du mock (`src/lib/mock-data.ts:1457-1458`, seules les 2 premières leçons de
form-001 ont `completed: true`) → `2/12 = 17 %`. Pire : `enrollState` démarre à `"idle"` (ligne 136), donc
en ouvrant la fiche de « ma formation en cours à 65 % » on voit le bouton **« S'inscrire à la
formation »** comme si on n'y avait jamais mis les pieds ; il faut recliquer sur inscription, attendre le
faux spinner de 1.5 s, pour voir apparaître une barre... à 17 %, pas 65 %.

Un formateur qui suit un de ses propres élèves via la démo verra deux chiffres de progression
contradictoires pour la même personne sur la même formation en deux clics. C'est exactement le genre
d'incohérence que la consigne demande de signaler.

**Gravité : majeure.**

## 4. Le certificat se débloque sans avoir rien regardé, et le PDF n'en est pas un — MAJEUR

Sur `/formations/[id]`, une fois « inscrit », chaque ligne de leçon a une case à cocher
(`toggleLesson`, ligne 153-159) totalement indépendante de la lecture vidéo : cocher les 12 cases à la
souris (sans jamais ouvrir la vidéo) suffit à passer `allDone` à `true` (ligne 143) et fait apparaître
« Obtenir mon certificat » (ligne 222-226). Le bouton « Télécharger PDF » du modal (ligne 433-438)
appelle `window.print()` — pas de génération PDF, pas de mise en page dédiée à l'impression : j'ai
vérifié qu'il n'existe aucune règle `@media print` dans le repo (`grep "@media print" src` → 0 résultat),
donc « imprimer » sort la page entière de l'app (nav, sidebar, tout) plutôt qu'un certificat propre.

**Gravité : majeure** — pour un pôle qui vend des formations avec certification, le certificat est
la pièce la plus symbolique du produit, et elle est à la fois gratuite à obtenir sans effort et fausse
techniquement (pas un vrai PDF).

## 5. Une seule et même vidéo YouTube pour toutes les formations et toutes les leçons — MAJEUR

`src/app/(app)/formations/[id]/page.tsx:279` : `src="https://www.youtube.com/embed/E0dyHPjiJDo?autoplay=1"`
est codé en dur, indépendamment de `playingLesson`. Cliquer sur n'importe quelle leçon de n'importe
quelle formation (investissement locatif, négociation, luxe, rénovation, droit…) ouvre **exactement la
même vidéo**. Comparer avec `src/lib/replays.ts:25-30` : pour les lives/replays, quelqu'un a pris la
peine de mettre un `youtubeId` distinct par replay (même si R1 et R6 partagent par erreur le même id
`FqjDgXlE2nQ`, cf. point 8) — la marche à suivre existait déjà ailleurs dans le code, elle n'a
simplement pas été reprise ici.

**Gravité : majeure** (contenu pédagogique manifestement factice — la case « le contenu existe-t-il
vraiment ? » de la mission est ici clairement non).

## 6. `/formations/creer` : le parcours va au bout... et publie dans le vide — CRITIQUE

`src/app/(app)/formations/creer/page.tsx:147-150`, `handlePublish` fait
`setPublished(true)` + `localStorage.removeItem(...)`. Rien n'écrit la formation créée dans
`src/lib/mock-data.ts` (`formations` est un `const` array statique importé, pas un state partagé ni un
store). L'écran de succès (ligne 154-168) affiche pourtant « Formation publiée ! Votre formation "X" est
maintenant disponible. » avec un bouton **« Voir mes formations »** qui renvoie vers `/formations` — où
la formation n'apparaîtra jamais, ni dans le catalogue, ni dans « Mes formations en cours », ni sur le
profil du formateur. Le parcours de création « va au bout » au sens UI (4 étapes, écran de succès), mais
le formateur qui vérifierait tout de suite après ne retrouverait rien de ce qu'il vient de créer.

**Gravité : critique** — c'est la tâche centrale du rôle testé (« un pro qui vend des formations ») et
elle échoue silencieusement, sans aucun message d'erreur pour signaler que rien n'a été persisté.

## 7. Les catégories du formulaire de création ne correspondent pas aux catégories du catalogue — MOYEN

`src/app/(app)/formations/creer/page.tsx:36` :
`CATEGORIES = ["Immobilier", "Finance", "Marketing", "Juridique", "Design", "Gestion locative", "Investissement"]`.

Catégories réellement utilisées dans `src/lib/mock-data.ts` (`grep "category: '"`) :
`Investissement, Location, Vente, Luxe, Rénovation, Marketing, Juridique, Photographie`.

Un formateur qui veut créer une formation de négociation (« Vente »), de location courte durée
(« Location »), de home staging/luxe (« Luxe »), de rénovation ou de photographie ne trouve **aucune**
catégorie correspondante dans le menu déroulant — seules 3 des 8 catégories existantes se recoupent.
« Gestion locative » (formulaire) et « Location » (catalogue) sont deux libellés voisins mais différents,
ce qui aurait produit une 9e catégorie fantôme sur la page `/formations` si la création fonctionnait
vraiment (cf. point 6).

**Gravité : moyenne** — révèle que le formulaire de création n'a pas été écrit à partir de la même
source de vérité que le catalogue.

## 8. Deux replays de live partagent le même identifiant YouTube — MINEUR

`src/lib/replays.ts:25` (R1, « Les tendances du marché Q1 2026 ») et ligne 30 (R6, « Photographie
immobilière pro ») pointent tous deux vers `youtubeId: "FqjDgXlE2nQ"`. Sujets et intervenants différents
(Jean-Pierre Dumont vs Amina Koné), même vidéo. Sur les 6 replays c'est la seule collision — largement
moins grave que le point 5, mais même symptôme en modèle réduit.

**Gravité : mineure.**

## 9. `/live` : bouton « Programmer un live » publie un toast, pas un live — MOYEN, cohérent avec le point 6

`src/app/(app)/live/page.tsx:459-468` : cliquer « Publier » dans la modale de création ferme la modale et
affiche un toast « Live programmé ! (démonstration) » (ligne 121) — le nouveau live n'est jamais ajouté à
`UPCOMING_LIVES` (const en dur, ligne 12-16). Au moins ici le mot « (démonstration) » dans le toast est
honnête sur la nature de l'action, contrairement à l'écran « Formation publiée ! » de `/formations/creer`
qui ne prévient pas du tout. **Désaccord à signaler** : les deux flux (créer une formation, créer un
live) ont exactement le même défaut de fond (rien n'est persisté) mais une honnêteté UX très inégale —
il serait cohérent d'aligner `/formations/creer` sur le ton assumé de `/live`, ou vice-versa.

**Gravité : moyenne.**

## 10. Code mort : le lecteur de replay inline sur `/live` ne se déclenche jamais — MINEUR

`src/app/(app)/live/page.tsx:114,332-355` définissent `replayItem`/`viewingReplay` et une section
« Replay viewer » complète (iframe YouTube + infos). Mais la grille de replays (ligne 361-380) utilise un
`<Link href={\`/live/replay/${replay.id}\`}>` qui navigue vers la page dédiée `/live/replay/[id]` —
`setViewingReplay` n'est appelé nulle part. La section 332-355 ne s'affiche donc jamais dans le parcours
normal. Sans conséquence utilisateur (la vraie page replay fonctionne, source de vérité partagée via
`src/lib/replays.ts`, correctement adressée par id — bon point), mais c'est ~25 lignes de JSX et de state
mortes qui pourraient induire un futur développeur en erreur.

**Gravité : mineure.**

---

## Réponses aux 4 questions

1. **Cherché / trouvé ?** Le catalogue (`/formations`), la fiche formation, le catalogue → fiche (même
   source de données, bien corrigé — cf. commentaire en tête de fichier des deux pages), les replays de
   live : tout ça se trouve et se comporte de façon cohérente. En revanche le vrai « lecteur de leçon »
   dédié existe dans le code mais est **introuvable** en navigation normale (point 1).
2. **Perdu / bloqué ?** Jamais au sens strict (pas de dead-end, pas d'erreur JS visible dans le code lu) —
   mais un formateur qui vient de « publier » sa formation ou son live et clique pour aller la revoir se
   retrouve devant un catalogue qui ne contient rien de ce qu'il vient de créer, sans message d'erreur
   (points 6 et 9) : une impasse silencieuse plutôt qu'un blocage visible.
3. **Faux / vide / artificiel ?** Oui, sur le cœur du sujet : une seule vidéo YouTube pour tout le
   catalogue (point 5), un lecteur de leçon générique déconnecté du programme réel (point 2), un
   certificat qui se débloque en cochant des cases sans rien regarder et qui « s'imprime » sans mise en
   page (point 4), une création de formation/live qui ne persiste rien (points 6, 9).
4. **Manque ?** Une vraie table de correspondance vidéo par leçon (même minimale, comme celle qui existe
   déjà pour les replays dans `src/lib/replays.ts`) ; un mécanisme pour que ce que `/formations/creer`
   produit rejoigne réellement `formations` (au moins via un store local partagé) ; une seule notion de
   « progression » au lieu de deux qui divergent ; un alignement des taxonomies (catégories) entre
   catalogue et formulaire de création ; et, si le lecteur de leçon dédié doit exister, au minimum un
   lien vers lui depuis la fiche formation.

## Note méthodologique

Cet audit est fait en lecture de code uniquement (pas de session Playwright lancée) : l'analyse
`useState`/props ci-dessus reproduit fidèlement le comportement runtime pour du state React simple sans
effets externes, mais n'a pas vérifié le rendu visuel réel ni la présence d'erreurs console au chargement.
