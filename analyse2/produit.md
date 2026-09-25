# Produit & UX — Mission 2, état réel du code (25.09.2026)

Audit de l'état ACTUEL de la branche `feat/plateforme-v2`, après les huit
étapes de reprise (M1). Je ne réévalue pas ce qui a été corrigé — je vérifie
fichier ouvert ce qui reste, ce qui a changé, et ce que B.4/B.5 demandent
précisément par rapport à ce qui existe. Gravité : **bloquant** (casse le
critère des trente secondes ou le récit économique) · **important** (visible,
corrige la crédibilité) · **cosmétique**.

---

## B.4 — Le mode explicatif : ce que le fondateur a dit, ce qui existe

### Ce qu'il a demandé (rappel du brief)

Un tutoriel guidé façon jeu vidéo : bulle ancrée sur l'élément + reste de
l'écran assombri + action demandée (« cliquez ici ») + progression « étape
4/12 » + bouton Passer + reprise + **plusieurs parcours** (découverte + par
rôle) + **déclenchement automatique à la première visite** + relançable. Il a
été explicite sur ce qu'il ne veut PAS : un interrupteur qui sème des
annotations partout.

### Ce qui existe : deux mécanismes distincts, ni l'un ni l'autre ne correspond

**1. `src/components/layout/guided-tour.tsx` + `src/content/tour.ts`** — la
« visite guidée ». J'ai lu le composant en entier. Ce qu'il fait réellement :

- Une carte fixe en bas de l'écran (`fixed bottom-4 left-1/2`, l.103), **pas
  un halo sur l'élément visé** — il n'y a aucune mesure du DOM (pas de
  `getBoundingClientRect`, pas de portail positionné sur une cible), et donc
  aucune possibilité technique de surligner quoi que ce soit.
- **Aucun assombrissement du reste de l'écran** — pas d'overlay `bg-black/*`
  plein écran nulle part dans le fichier.
- **Le composant navigue lui-même** (`router.push(stop.route)`, l.67) au lieu
  de demander une action à l'utilisateur. Il n'y a donc pas de « cliquez ici » :
  la visite fait le clic à la place du visiteur, ce qui est l'inverse exact du
  modèle « jeu vidéo » demandé.
- Progression : oui, partiellement — « Étape X sur Y » (l.107). Bouton
  Précédent/Suivant/Fermer, oui. Reprise via `localStorage` (l.21-33), oui.
  **Mais un seul parcours** : `guidedTour.stops` est un tableau plat de six
  arrêts (`src/content/tour.ts` l.31-71) — aucune notion de parcours multiples
  (« découverte » vs « par rôle »), aucun écran de choix au lancement.
- **Aucun déclenchement automatique.** J'ai cherché dans tout `src/` un
  marqueur de première visite (`firstVisit`, `hasVisited`, etc.) : rien
  n'existe. `open` démarre à `false` (l.40) et ne passe à `true` que si
  `localStorage` contient déjà `"1"` (l.27) ou si l'utilisateur clique le
  lanceur. Personne ne voit jamais la visite sans agir en premier.
- **Le lanceur est invisible sur mobile** : `hidden ... md:inline-flex`
  (`guided-tour.tsx` l.90). Sur téléphone, sans déclenchement automatique et
  sans bouton visible, la visite guidée n'existe simplement pas.

Verdict : ce composant est un **stepper de navigation avec mémoire**, pas un
tutoriel. Il répond à « progression » et « reprise » et rate les cinq autres
critères (surbrillance, assombrissement, action demandée, parcours multiples,
déclenchement auto). Ce n'est pas une nuance — c'est la différence entre
« montrer des écrans dans un ordre » et « apprendre en faisant ».

**2. `src/content/explain.ts` + `demo-legend-bar.tsx` + `demo/page.tsx`** —
le « mode explicatif ». C'est exactement le mécanisme que le fondateur a dit
ne pas vouloir : un interrupteur global (`explainMode`, persisté, actif par
défaut — `context.tsx` l.147) qui fait apparaître des affordances « ? »
ouvrant un panneau à quatre lignes (quoi/qui/revenu/quand). Bonne nouvelle en
pratique : j'ai vérifié par recherche exhaustive (`POLE_EXPLAIN` n'apparaît
que dans un seul fichier consommateur) que ce mécanisme est aujourd'hui
**confiné à `/demo`** — les sept pastilles de pôles, rien d'autre. Il n'est
donc pas littéralement « partout » comme le fondateur le craint. Mais il reste
câblé, actif par défaut, et présenté dans le bandeau permanent
(`demo-legend-bar.tsx` l.55-69) comme LE mécanisme d'explication de la
plateforme — sur toutes les routes, alors qu'il n'explique en réalité qu'un
seul écran. C'est le mauvais outil, laissé en position centrale.

### Ce qu'il faut construire

Un vrai composant de spotlight : portail plein écran, masque avec un trou
découpé sur `getBoundingClientRect()` de la cible (ou `clip-path`/SVG mask),
bulle ancrée au bord du trou, et surtout une **étape qui attend l'action**
(écoute l'événement — clic, changement de champ — plutôt que de naviguer
elle-même) avant d'avancer. Un écran de sélection au lancement avec au moins
deux parcours (« Découverte » générique + un parcours par rôle, réutilisant
`content/roles.ts` qui existe déjà et couvre huit rôles). Déclenchement auto
à la première visite (un simple flag `edome:tour:seen` absent aujourd'hui,
à poser au montage de `AppShell`). Et le lanceur manuel doit survivre sur
mobile — aujourd'hui il n'existe nulle part sur petit écran.

Sur le mode explicatif : je ne le retirerais pas tel quel (il est utile et
déjà limité à un écran), mais je ne le laisserais plus dans le rôle de
« mécanisme pédagogique principal » du bandeau — c'est un glossaire de statut,
pas un tutoriel, et le libellé « Mode explicatif » à côté du lanceur de visite
laisse croire que ce sont deux façons équivalentes d'apprendre E-Dome. Elles
ne le sont pas : l'une explique un mot, l'autre est censée enseigner un
parcours.

---

## B.5 — « Visiter en tant que » : option 1 ou option 2, tranché par le code

### Ce que le mécanisme fait vraiment aujourd'hui

J'ai tracé `viewingAs` et `activeRole` dans tout `src/`.

**`viewingAs`** (l'axe `PlatformRole` propre, censé porter la vision) n'est lu
nulle part en dehors de sa propre plomberie : `context.tsx`, `role-switcher.tsx`,
`content/roles.ts`, et le fichier de types `model/identity.ts`. **Aucune page
ne branche son rendu dessus.** Le sélecteur change cette valeur et redirige
vers une URL fixe (`router.push(r.href)`, `role-switcher.tsx` l.52) — c'est
tout ce qu'il fait structurellement.

**`activeRole`** (la valeur héritée, pontée automatiquement par `setViewingAs`,
`context.tsx` l.299-303) est lu en direct par exactement **quatre fichiers**
sur l'ensemble du dépôt :
- `explorer/[id]/page.tsx` l.504 — affiche un bouton « Booster » si
  hôte/agence/promoteur ;
- `formations/page.tsx` l.113 — affiche « Créer une formation » si `formateur` ;
- `evenements/page.tsx` l.46 — affiche « Créer un événement » si un rôle
  organisateur ;
- `live/page.tsx` l.33 — la variable est **importée et jamais utilisée** :
  `canCreateLive` est câblé en dur à `true` (l.53, commentaire « Button
  visible to all users in demo mode »). C'est un reste de branchement à moitié
  défait.

C'est tout le rayon d'action du sélecteur de rôle : **deux boutons de création
qui apparaissent ou non**. La navigation (`sidebar-whop.tsx` l.49-66, statique,
zéro référence à un rôle), le tableau de bord (`dashboard/page.tsx`, aucune
référence à `viewingAs`/`activeRole` dans tout le fichier), l'identité dans le
fil et la messagerie ne changent jamais. Le contrat que M1 s'était fixé — « le
rôle change (1) la nav, (2) l'accueil, (3) le dashboard, (4) l'action
primaire, (5) le flux d'argent » — n'est tenu qu'au point (5) partiel et par
accident.

**Et l'incohérence est plus profonde qu'un simple manque.** Pour les rôles que
Léo (l'utilisateur courant, `CURRENT_USER` — `demo/identity.ts`) détient déjà
— propriétaire, hôte, apporteur, créateur — choisir ce rôle dans le sélecteur
atterrit sur SES vraies données (`/vendre`, `/dashboard`, `/apporteurs`,
`/formations`). Pour les rôles qu'il ne détient pas — particulier, agence,
prestataire, admin — le sélecteur atterrit soit sur une page générique sans
identité (`/explorer`, `/services`), soit, pour « Agence », sur une **entité
fictive entièrement différente** : `demoAgency` (« Régie du Léman »,
`src/content/agence.ts` l.13-23) — un nom d'entreprise, aucune personne, aucun
lien avec Léo. Le sélecteur de rôle n'est donc déjà, pour la moitié de ses
huit portes, ni une vue sur ses propres données (option 1) ni un vrai profil
incarné (option 2) : c'est un lien vers une page publique sans personne
derrière.

### Tranché : option 2

Rendre l'option 1 réelle demanderait de faire dépendre de `viewingAs` : la nav
globale (2 fichiers, sidebar + mobile), le dashboard (`dashboard-data.ts` +
`revenue-data.ts`, déjà bâtis sur une seule identité), l'auteur affiché dans
le fil et la messagerie (`feed/page.tsx`, `messages/page.tsx`, qui recréent
déjà leurs participants localement), et l'action primaire sur chaque fiche.
C'est une réécriture transversale de dizaines de fichiers pour un produit de
démonstration où personne ne se connecte jamais réellement — et elle
défmerait le travail déjà fait à l'étape 2 (une identité unique, un ledger
unique) pour le remplacer par une deuxième couche de vérité conditionnelle.

Le code montre au contraire que l'équipe a déjà, sans le nommer, commencé
l'option 2 : Léo est un individu complet avec quatre rôles cumulés
(`roles: ["proprietaire", "hote", "apporteur", "formateur"]`,
`demo/identity.ts` l.95), un dashboard qui lui appartient réellement
(dérivé du ledger, pas de la vue), un profil édité et persistant
(`profile-data.ts`). Il manque seulement un **petit roster de profils
supplémentaires nommés** — une agente pour incarner l'Espace agence au lieu
de « Régie du Léman » sans visage, un prestataire, un administrateur — et un
sélecteur qui dit « Devenir Léo / Devenir [Nom], agente à Lausanne / … »
plutôt que « Visiter en tant que ». C'est moins de travail que de finir
l'option 1, et le résultat est plus honnête : un investisseur voit une
messagerie, un dashboard et des mandats qui appartiennent réellement à la
personne qu'il incarne, au lieu d'une coquille qui change de titre sans
changer de contenu.

**Recommandation concrète** : garder `viewingAs`/`setViewingAs` comme le
mécanisme de sélection (il est bien conçu, « une vue, pas un droit » —
`model/identity.ts` l.148-154 — et cette séparation reste juste pour un futur
produit réel avec de vrais comptes). Mais dans la démo, faire de
`setViewingAs("agence")` un raccourci vers **« devenir » un compte de
démonstration** distinct plutôt que vers une page publique anonyme : router
vers le profil et le dashboard d'une personne nommée, réutilisant les 18
personnes déjà construites à l'étape 2 (`PLAN.md` l.125). Construire d'abord
le visage manquant de l'agence — c'est le trou le plus visible, puisque
l'Espace agence est justement le pôle le plus achevé du produit.

---

## B.6 — Chaque pôle, verdict court

Du plus fort au plus faible.

**Agence — fort, sonne vrai.** Six écrans réels (`agence/page.tsx` et ses
sous-routes), formules générées depuis `content/tarifs.ts` — ne peut pas
mentir sur un prix. Seul manque : aucun visage humain (`demoAgency`, sans
personne nommée) au moment précis où B.5 en aurait besoin.

**Profils (`/profil`) — solide, cohérent.** Identité et sections dérivent du
contexte réel (`profile-data.ts`), la vitrine mélange catalogue réel
(3 biens possédés) et données de démo assumées. Un des points forts
silencieux du dépôt.

**Recherche (`/recherche`) — corrigé, fonctionne.** L'ancien bug qui menait
chaque résultat vers une 404 (identifiants inventés B1-B8) est réparé —
l'index dérive maintenant des sources réelles (`recherche/page.tsx` l.19-31).
Reste un angle mort : les alertes de recherche vivent encore isolées dans
`/parametres` (l.461-548), sans point d'entrée depuis `/explorer` ni
`/recherche` elle-même — la fonctionnalité existe, personne ne la trouve.

**Biens / Explorer — riche mais contredit son propre modèle.** Fiches
détaillées, `/vendre` répare le choix « seul / accompagné ». Mais
`explorer/[id]/page.tsx` l.1145-1150 affiche **« Contacter l'agent »** comme
CTA fixe sur TOUTE fiche en vente, y compris celles publiées « seul » — le
parcours que `/vendre` vient précisément de légitimer n'a toujours aucune
représentation sur la fiche qui en est l'aboutissement. **Important.**

**Formations / Événements — corrects, sans nouveauté.** Les deux seuls pôles
où `activeRole` fait quelque chose de réel (gate d'un bouton « Créer »).
Fonctionnel, mais mécanique isolée — aucun autre effet du rôle visité.

**Apporteurs — le concept le plus complet, la donnée la moins soignée.**
`MOCK_APPORTS` et `MOCK_VERSEMENTS` (`apporteurs/page.tsx` l.125-137) restent
écrits en dur, datés de mars 2026 dans une démo qui se déroule en septembre,
déconnectés du `ledger` que l'étape 2 a construit pour tout unifier. Un
investisseur qui compare ces dates à « aujourd'hui » voit une page figée dans
le passé, sur le pôle que le fondateur lui-même cite comme moteur
d'acquisition prioritaire.

**Services — priorité affichée du fondateur, réalité en retard.** Le
fondateur le classe « au lancement », juste après Biens (`analyse/produit.md`
§8, toujours valable). Le code n'a **aucune fiche prestataire** :
`/services/[id]` n'existe pas — confirmé à la fois par l'absence du fichier
et par le commentaire de `recherche/page.tsx` l.30-31 (« il n'existe pas de
route `/services/[id]`, le clic renvoie vers `/services` »). Le cycle
demande → devis chiffré → acceptation → paiement → avis que M1 réclamait
n'existe toujours pas. Écart net entre priorité déclarée et état réel.
**Important, presque bloquant vu la priorité assumée.**

**Lives — reste « vision », et ça se voit dans le code.** `live/page.tsx`
l.109-112 utilise `alert()` natif du navigateur pour « Partager » — rupture
d'immersion immédiate dans une maquette par ailleurs soignée. `activeRole`
est importé et mort (`canCreateLive` figé à `true`, l.53) : un reste de
branchement commencé puis abandonné, pas une décision.

**Admin — le plus faible.** Trois défauts cumulés : (1) la console reste
publiquement atteignable — `proxy.ts` ne protège que `/admin` et `/dashboard`
mais seulement une fois Supabase configuré, ce qui n'est pas le cas
aujourd'hui (documenté comme dette connue, l.31-33) ; (2) les données
(`MOCK_USERS`, `admin/page.tsx` l.11-22) portent des noms qui n'existent nulle
part ailleurs dans la démo (« Sophie Meier », « Bruno Chappuis ») — aucun lien
avec le casting du reste de la plateforme, donc aucune cohérence de récit ;
(3) le bouton « Sauvegarder les paramètres » (l.423-425) n'a **aucun
gestionnaire** — mort, malgré le balayage de l'étape 8.

**Boutique — la pire incohérence trouvée dans tout l'audit.** Deux modèles
économiques opposés coexistent dans le même pôle. `src/content/explain.ts`
l.100-107 (le panneau affiché sur `/demo`) dit : *« Aucune commission :
E-Dome ne facilite pas la livraison, la boutique fonctionne en affiliation. »*
Mais `boutique/page.tsx` (l.37-39, 219-220, 662-663), `boutique/[id]/page.tsx`
(l.632-635) et `boutique/vendre/page.tsx` (l.10-12, 95-103, 267-285) disent
tous, en toutes lettres et avec un montant : *« E-Dome fournit la vitrine +
paiement + visibilité (...) Commission marketplace 4–8 %, prélevée sur ce
qu'E-Dome encaisse via le PSP. »* Un visiteur qui lit `/demo` puis clique dans
la boutique verra l'inverse de ce qu'on vient de lui expliquer. C'est
exactement la classe de défaut que toute la refonte V2 s'est donné pour but
d'éliminer (« rien de neuf ne s'affiche tant que les chiffres peuvent se
contredire » — `PLAN.md` l.67-71) — et il s'est reformé après coup, sur un
pôle que personne n'a retouché depuis. **Bloquant.**

---

## Parcours & navigation — les ruptures, par ordre de gravité

1. **Boutique : modèle économique contradictoire** (détaillé ci-dessus).
   **Bloquant.**

2. **`/publier` : la confirmation ne mène pas à l'annonce.** L'écran de
   succès affiche « Voir l'annonce » mais le lien pointe vers `/explorer`, la
   liste entière (`publier/page.tsx` l.199-201) — pas vers la fiche du bien
   qu'on vient de publier. Signalé par M1, toujours ouvert malgré le balayage
   de boutons morts de l'étape 8 (ce bouton n'est pas mort, il est juste faux).
   **Important.**

3. **« Planifier une visite » ne mène nulle part.** Le formulaire de
   `explorer/[id]/page.tsx` (l.1328-1333) affiche un toast de succès et ferme
   la modale — sans créer la moindre trace ailleurs. Aucun écran « mes
   visites », aucune ligne dans le dashboard, rien dans les messages. La
   demande disparaît. Même famille de défaut pour « Faire une offre »
   (l.1372-1376) : succès, puis rien. **Important**, et symptomatique : la
   messagerie (`/messages`) est le réceptacle générique de tous les
   « Contacter » du site (l.1120-1122, 1145-1150) — jamais une conversation
   pré-amorcée avec le bon contexte.

4. **« Contacter l'agent » fixe sur toute fiche vente** — voir B.6, Biens.
   **Important.**

5. **Notifications : trois comptages qui ne s'accordent pas.** Le badge de la
   sidebar est câblé en dur à `3` (`sidebar-whop.tsx` l.53), pendant que
   `notifications/page.tsx` calcule 5 non-lues réelles à partir de
   `initialNotifications` (n1 à n5, `read: false`). Déjà documenté dans
   `TODO.md`, toujours vrai — vérifié en lisant les deux fichiers côte à côte.
   **Cosmétique mais facile à repérer** : c'est visible sur chaque écran, en
   permanence, dans la sidebar.

6. **Visite guidée : invisible sur mobile, jamais déclenchée seule** — voir
   B.4. **Important** pour une démo qu'on est censé pouvoir laisser
   quelqu'un explorer seul.

7. **Alertes de recherche enterrées** — voir B.6, Recherche. **Cosmétique.**

---

## Désaccords attendus

**Avec la trajectoire actuelle du mode explicatif.** Il reste câblé, actif
par défaut, et affiché dans le bandeau à égalité avec le lanceur de la visite
guidée — comme si c'étaient deux portes d'entrée équivalentes vers la
compréhension d'E-Dome. Ce n'en sont pas deux : l'une explique un mot au clic,
l'autre est censée enseigner un parcours en le faisant vivre. Je ne
retirerais pas le mode explicatif (il est déjà sagement confiné à `/demo`,
contrairement à ce que le fondateur craignait), mais je le redescendrais au
rang de glossaire secondaire — jamais présenté comme la façon d'apprendre la
plateforme, ce rôle revenant entièrement au tutoriel à construire.

**Avec l'idée de « compléter » l'option 1 du sélecteur de rôle plutôt que de
trancher pour l'option 2.** Le code montre que la moitié du mécanisme penche
déjà, sans le dire, vers « devenir quelqu'un » (Léo garde ses vraies données
sur ses quatre rôles) et l'autre moitié vers une coquille sans personne
(Agence, particulier générique). Continuer à câbler `viewingAs` dans la nav,
le dashboard et le fil pour sauver l'option 1 reviendrait à défaire ce
embryon d'option 2 pour repartir dans l'autre sens — plus de travail, pour un
résultat moins honnête au final.

**Avec la hiérarchie de priorité implicite de `TODO.md` / `RAPPORT-FINAL.md`.**
Ces documents placent le reliquat de l'étape 8 et la sécurité de `/admin` en
tête des urgences restantes — à raison pour la sécurité. Mais du point de vue
produit, je place la contradiction de la Boutique et l'absence de fiche
prestataire (Services, pourtant priorité n°2 du fondateur après Biens) au même
niveau d'urgence : ce sont deux pôles où un clic suffit, en moins de trente
secondes, à contredire ce que l'écran d'entrée vient d'annoncer — exactement
le critère que le fondateur a fixé comme seuil de réussite.
