# Testeur vendeur — particulier suisse qui veut vendre son appartement

Persona : je n'ai aucune connaissance technique ni immobilière. Je veux juste vendre mon appartement et je regarde ce qu'E-Dome me propose. Parcours réel joué avec Playwright (desktop 1280×900 et mobile 360×780) sur `/demo → /vendre → /vendre/accompagnement → /publier` (wizard entier, chemin "Vente") `→ /explorer → /dashboard/annonces → /messages`, plus lecture du code source pour vérifier ce que chaque écran fait réellement (pas seulement ce qu'il affiche).

Aucune erreur console/page n'est apparue sur l'ensemble du parcours — la fragilité n'est pas technique, elle est **narrative et fonctionnelle** : des promesses que l'app ne tient pas.

---

## Réponses aux 4 questions

**(1) Qu'est-ce que je cherchais, l'ai-je trouvé ?**
Je cherchais à comprendre "combien ça coûte de vendre ici" et à publier mon appartement. La page `/vendre` répond très bien à la première question (0 CHF à E-Dome, clairement répété). Mais la seconde échoue complètement : après avoir rempli les 7 étapes du formulaire et cliqué "Publier le bien", mon annonce **n'existe nulle part**. Ni dans `/explorer`, ni dans `/dashboard/annonces`. J'ai fait tout le travail pour rien — c'est le pire résultat possible pour un testeur vendeur.

**(2) Où me suis-je senti perdu/bloqué/ralenti ?**
Sur la route "Accompagné" : je clique "Être accompagné" depuis `/vendre` et j'atterris directement sur une page qui affiche 3 propositions d'agences pour "mon bien" — sauf que je n'ai jamais décrit ce bien (pas d'adresse, pas de prix, pas de photo, rien). Le texte dit "Votre bien a été présenté de façon anonyme aux agences" comme si c'était déjà fait. Je me suis senti téléporté, pas accompagné. Ensuite, dans le wizard `/publier`, je ne me suis jamais senti "bloqué" par une validation — ce qui est en fait le problème inverse et plus grave (voir trouvailles).

**(3) Qu'est-ce qui sonne faux/vide/artificiel ?**
- Le bouton "Ouvrir le contact" avec une agence me redirige vers `/messages`, avec un toast "Contact ouvert avec Régie du Léman" — mais aucune conversation avec cette agence n'existe dans la liste de messages. Je me retrouve devant Sophie Martin, Jean Dupont, un "Groupe Hôtes Verbier 2026"... personne en rapport avec ma vente.
- Dans le wizard, l'étape "Apporteurs" affiche un encadré "Frais fixe plateforme : 500 CHF (vente < 1 M)" — un chiffre que je n'ai vu nulle part ailleurs et qui contredit frontalement le "0 CHF à E-Dome" répété à l'étape suivante et sur `/vendre`.
- `/dashboard/annonces` est un catalogue figé (Villa piscine, Studio Genève, Penthouse Zurich...) qui n'a aucun lien avec mon compte ni avec ce que je viens de publier.

**(4) Qu'est-ce qui manque pour que ce soit vraiment utile ?**
Une vraie boucle : mon annonce publiée doit apparaître quelque part que je peux consulter, modifier, et sur laquelle je peux voir des vues/contacts. Aujourd'hui rien de tout ça n'existe après publication — pas d'ID généré, pas de page dédiée, pas de persistance au-delà du `localStorage` du formulaire lui-même (qui n'est jamais relu par personne d'autre que `/publier`).

---

## Trouvailles majeures

### 1. [BLOQUANT] L'annonce publiée disparaît — le cœur du parcours vendeur est un cul-de-sac
`src/app/(app)/publier/page.tsx:181-186` (`handlePublish`) ne fait que déclencher un toast et un état local `published=true`. Aucun objet listing n'est créé, aucun ID généré, rien n'est écrit dans une source de données partagée. Le bouton "Voir l'annonce" (`publier/page.tsx:199`) pointe vers `/explorer` en dur — pas `/explorer/{id}` — et l'Explorer affiche son catalogue statique de 22 biens (`src/lib/mock-data.ts`), sans trace de "Bel appartement 4.5 pièces vue lac" que je viens de publier (vérifié : le texte n'apparaît ni sur `/explorer` ni sur `/dashboard/annonces`).
`src/app/(app)/dashboard/annonces/page.tsx:85-94` confirme : `MOCK_LISTINGS` est un tableau codé en dur, totalement déconnecté de `/publier`. Pour un vendeur, c'est la pire expérience possible : "publié avec succès" mais introuvable ensuite.

### 2. [BLOQUANT] Zéro validation sur les 7 étapes du wizard
Testé en cliquant "Suivant" sur l'étape 1 sans rien remplir (pas de type de transaction, pas de type de bien, pas d'adresse, pas de prix) → avance quand même à l'étape 2 (`Étape 2 sur 6`). Même chose étape 2 avec titre/description vides → avance à l'étape 3. Aucun des boutons "Suivant" (`publier/page.tsx` lignes ~300, 317, 394, 412/447, 465, 574) ne vérifie quoi que ce soit ; seule la case CGU bloque le bouton final "Publier le bien" (ligne 664). Une annonce peut donc être "publiée" avec 0 photo, 0 titre, 0 prix, 0 adresse — l'aperçu affiche alors littéralement "Sans titre" et "Prix à définir" (lignes 642, 649) sans que rien n'empêche la publication.

### 3. [IMPORTANT] Contradiction interne sur "0 CHF à E-Dome", dans le même wizard
À l'étape "Apporteurs" (vente, 850'000 CHF), le simulateur affiche "Frais fixe plateforme : 500 CHF (vente < 1 M)" comme base de calcul de la part apporteur — `src/lib/pricing/legacy.ts:98-102` (`edomeRevenue`), appelée depuis `publier/page.tsx:523` (`platformRevenue`). Une étape plus loin (étape "Options & Publication"), l'écran affiche "Publication gratuite — 0 CHF à E-Dome. Le bien d'un particulier est gratuit à publier." (`src/content/publier-obligations.ts:22-23`), et `/vendre` répète "0 CHF à E-Dome" deux fois en gros caractères (`src/content/offer.ts:46,69,84`).
Le code lui-même documente cette dette : `legacy.ts:14-19` dit explicitement que ce modèle de frais fixe "est ABANDONNÉ" et que "l'étape 5 réécrit `/publier`" pour le supprimer — mais le bloc Apporteurs de `/publier` n'a jamais été migré. Un vendeur attentif verra ces deux chiffres contradictoires (0 CHF vs 500 CHF) à 30 secondes d'intervalle dans le même formulaire.

### 4. [IMPORTANT] La route "Accompagné" présuppose une étape qui n'existe pas
`src/content/offer.ts:79` fait pointer le CTA "Être accompagné" directement vers `/vendre/accompagnement`, qui affiche déjà 3 propositions d'agences avec le texte "Votre bien a été présenté de façon anonyme aux agences vérifiées de votre secteur" (`src/content/accompagnement.ts:35`). Mais aucun écran ne permet de décrire ce bien (adresse, prix, photos) avant d'arriver là — vérifié en navigant directement, aucune redirection ni formulaire intermédiaire. Le récit suppose un acte que le vendeur n'a jamais posé.

### 5. [IMPORTANT] "Ouvrir le contact" avec une agence mène à une messagerie qui ne la contient pas
`src/app/(app)/vendre/accompagnement/page.tsx:24-28` (`openContact`) affiche un toast "Contact ouvert avec Régie du Léman. Elle reçoit vos coordonnées." puis `router.push("/messages")`. Mais `src/app/(app)/messages/page.tsx:93+` (`mockConversations`) est une liste figée (Sophie Martin, Jean Dupont, Marie Leroy, "Groupe Hôtes Verbier 2026"...) qui ne contient aucune des trois agences (`Régie du Léman`, `Alpes Immobilier`, `Cardinal & Associés` — vérifié : ces noms n'existent nulle part hors de `content/agence.ts` et `content/accompagnement.ts`). J'atterris sur un écran "Sélectionnez une conversation" sans savoir où est passé mon contact.

### 6. [IMPORTANT] Dashboard "Mes annonces" : boutons Modifier / Plus d'options morts
`src/app/(app)/dashboard/annonces/page.tsx:278-291` : les boutons `Edit3` ("Modifier") et `MoreHorizontal` ("Plus d'options") n'ont **aucun `onClick`**. Même en admettant que mon annonce y apparaisse un jour, je ne peux rien en faire — répond négativement aux deux sous-questions du brief ("puis-je la modifier ?").

### 7. [COSMÉTIQUE] "Sauvegarder brouillon" ne donne aucun retour visuel
`publier/page.tsx:154-163` (`saveDraft`) écrit en `localStorage` mais n'appelle jamais `setToastMsg` (contrairement à `handlePublish` qui, lui, affiche un toast). Un vendeur non technique qui clique sur ce bouton ne sait pas si quelque chose s'est passé — seul un panneau "Brouillons" apparaît discrètement en haut de page, hors du champ visuel immédiat.

### 8. [COSMÉTIQUE / à surveiller] Rafraîchir la page ramène à l'étape 1
Le formulaire (`form`) est persisté dans `localStorage` (`publier/page.tsx:127-129`) mais pas le numéro d'étape (`step` n'est qu'un `useState`, jamais sauvegardé). Un rafraîchissement accidentel en cours de route ne fait pas perdre les données saisies, mais fait perdre la progression visuelle — pas dramatique, mais surprenant pour qui ne s'y attend pas.

---

## Désaccords avec la direction évidente

- **Le toggle "Autoriser les apporteurs" est documenté "opt-in" mais codé "opt-out".** Le commentaire à `publier/page.tsx:42-44` dit : *"Apporteurs — V1.0 : seul controle vendeur = ON/OFF (opt-in)."* Mais `emptyForm.autoriserApporteurs` vaut `true` par défaut (`publier/page.tsx:90`). Un vendeur qui traverse le wizard sans y prêter attention autorise donc, par défaut, des tiers inconnus à partager son annonce et à toucher une commission (prélevée sur E-Dome, pas sur lui — donc sans risque financier direct pour lui), sans avoir rien décidé activement. Ce n'est pas grave sur le plan financier (c'est bien précisé que ça ne coûte rien au vendeur), mais ça contredit l'intention affichée dans le commentaire du code, et pour une maquette qui se targue d'être "sans intermédiaire imposé", démarrer avec un intermédiaire pré-activé par défaut est un choix de conception qui mérite d'être assumé explicitement, pas laissé en incohérence entre commentaire et valeur par défaut.

- **Je ne suis pas d'accord avec le choix de faire disparaître le frais de publication vente/LT sans repenser ce que finance réellement E-Dome pour ce pôle.** Le contenu dit fièrement "0 CHF à E-Dome" partout — mais le code de tarification sous-jacent (`legacy.ts`) n'a jamais été nettoyé de son modèle à 500/2500 CHF, et cette relique refait surface visuellement dans le wizard. Soit le modèle "0 CHF" est réellement définitif et le calcul apporteur pour la vente doit être refondu pour ne plus s'appuyer sur un "frais plateforme" fictif ; soit il ne l'est pas et l'affichage "0 CHF à E-Dome" ment par omission. Les deux ne peuvent pas coexister dans le même écran.

- **La route "Accompagné" devrait avoir sa propre étape de saisie du bien**, séparée du wizard `/publier` qui est taillé pour la vente "seul". Aujourd'hui elle emprunte un raccourci qui casse l'illusion (propositions pour un bien jamais décrit). Ce n'est pas un détail technique, c'est le moment précis où, en tant que vendeur, j'aurais arrêté de faire confiance à la maquette.
