# RAPPORT FINAL — Mission 2

*Branche `feat/plateforme-v2`, rien de fusionné, landing de production jamais
touchée. Préproduction :
https://plateforme-git-feat-plateforme-v2-leoanser53-5284s-projects.vercel.app*

---

## 1. Le critère, et où on en est

Le test que tu as fixé : **quelqu'un ouvre la plateforme seul, ne tombe sur
rien de cassé, et comprend E-Dome en dix minutes.**

Il est tenu, à la mesure d'une maquette. Un audit runtime automatique a chargé
les 29 pages principales en deux tailles d'écran (téléphone 360 px et ordinateur
1280 px), plus des passes en incarnant plusieurs personnes : **aucune erreur de
page, aucun débordement horizontal sur mobile, aucune image cassée**. Le
tutoriel se lance tout seul à la première visite et explique le reste.

Ce qui reste n'est pas du cassé : c'est de la profondeur de contenu et de la
validation (juridique, design fin). Détaillé en §4 et §5.

---

## 2. Ce qui a été construit

Dans l'ordre d'exécution (impact d'abord, détails à la fin). Un commit par
chantier, portes vertes à chaque fois. Liste des commits : `CHANGELOG-V2.md`.

- **Le casting des seize.** Seize personnes cohérentes de Suisse romande et
  d'ailleurs, chacune avec une voix, une photo de synthèse (personne réelle),
  des biens sur des lieux réels à des prix plausibles, un réseau d'abonnés, des
  avis réciproques liés à de vraies transactions. L'agence est Hartmann
  Immobilier SA avec sa vraie équipe.
- **Le moteur d'interactions.** Une mémoire de session unique : publier,
  contacter, demander un devis, postuler, réserver, faire une offre, mettre en
  favori — **chaque clic laisse une trace** qui survit à un rechargement. La
  messagerie relie vraiment les personnes ; les notifications en découlent, avec
  un seul compteur. C'est ce qui supprime les « succès sans effet ».
- **Le fil vivant.** Trois semaines de publications, seize voix distinctes —
  dont une qui écrit court et mal, une débutante qui pose des questions
  naïves, une qui doute.
- **Être un profil.** On entre dans la peau de n'importe laquelle des seize
  personnes, et toute la plateforme suit : identité, navigation selon le rôle,
  tableau de bord (utile même pour qui n'a aucun bien), messages, notifications,
  réseau. Les actions sont faites en son nom.
- **Le modèle économique visible.** Deux mécaniques d'affiliation, jamais
  confondues. **Biens** : une prime fixe en francs (50 à 3 000), réglée par le
  vendeur, prélevée seulement sur une mise en relation acceptée, jamais un
  pourcentage du prix ; E-Dome en garde 12 %. **Marketplace** : un pourcentage
  sur la marge. Plus les **abonnements** (15/25/30 % pour l'apporteur). Le
  freemium est posé en valeurs de catalogue, `/tarifs` est par rôle, le
  changement de formule fonctionne, et la **restriction France** (un profil
  français ne touche pas de prime biens) est visible à l'écran.
- **La boutique en affiliation.** Plus de panier, de paiement ni de garantie
  E-Dome : E-Dome recommande et redirige vers le marchand, qui vend, encaisse,
  livre et garantit. Message honnête « Vous quittez E-Dome pour <marchand> »,
  sans URL inventée. C'était aussi une mise en conformité (le journal ne
  crédite plus personne du chiffre d'affaires d'un marchand tiers).
- **La complétude des pôles.** Services (fiche par prestataire, devis →
  paiement → avis), formations (leçons propres à chaque cours, progression
  réelle, certificat de démonstration), location longue durée (« Demander une
  visite », prix au mois), investisseurs (chiffres calculés, rendement),
  recherche en texte libre, événements et lives avec de vrais organisateurs,
  console d'administration alignée sur le casting.
- **Le tutoriel guidé.** Mise en lumière de l'élément à regarder, reste de
  l'écran assombri, compteur d'étapes, boutons « Passer » et « Reprendre »,
  cinq parcours (découverte + un par rôle), lancement automatique à la première
  visite, version mobile.
- **Les finitions.** Faux liens externes remplacés par le support interne, fin
  des notes « 0 (0 avis) », noms accessibles sur les avatars.

---

## 3. Ce que j'ai décidé seul (à relire)

Des choix pris sans te les soumettre un par un, parce que tu avais demandé
d'aller jusqu'au bout sans arrêt. Ils sont tous réversibles.

1. **Le riad d'Amina (Marrakech) reste affiché en CHF.** La plateforme est
   suisse et tout est normalisé en francs avec un convertisseur (le dirham est
   dans la liste). J'ai jugé que c'était cohérent plutôt qu'un faux pas. À
   trancher si tu préfères la devise locale.
2. **Les notes nulles deviennent « Nouveau ».** Un bien ou une personne sans
   avis n'affiche plus « 0 » ni « 0 avis », mais rien ou « Nouveau ». C'est plus
   honnête qu'une fausse note de zéro étoile.
3. **Les liens de réservation externes (cal.com) mènent au support écrit
   interne `/contact`.** En maquette, il n'y a pas d'équipe à appeler ; un faux
   lien de prise de rendez-vous sonnait faux.
4. **Le rendement des biens est présenté comme « estimé »** (à partir de loyers
   comparables) plutôt que repris de chiffres « déclarés » qui se contredisaient
   d'un écran à l'autre.
5. **Le certificat de formation est explicitement « de démonstration, sans
   valeur officielle ».** Un vrai certificat aurait sonné faux.
6. **Signataire des commits : « Claude Opus 5.5 ».** J'ai gardé la ligne que tu
   avais fixée au début, par cohérence avec les commits précédents de la
   branche, même quand le modèle a changé en cours de route.

---

## 4. Ce qui reste ouvert (non bloquant)

- **Validation juridique.** Le point central. L'affiliation à deux mécaniques,
  la question de savoir si une mise en relation est du courtage pour
  l'apporteur, l'exposition d'E-Dome, la liste des pays — tout est posé dans
  `JURIDIQUE-A-VALIDER.md §0`, à confirmer par un avocat. Rien n'est tranché en
  droit ; c'est une maquette.
- **`ADMIN_PASSWORD` sur Vercel.** `/admin` est protégé par mot de passe. Il
  faut vérifier que la variable est bien définie dans le projet Vercel (en local
  j'utilise une valeur de test).
- **Contenu de détail.** Quelques adresses de rue ne sont pas vérifiées ; les
  textes des leçons de formation sont génériques (titre + mention « contenu de
  démonstration »), pas rédigés un par un ; certaines photos de biens sont des
  images de banque génériques.
- **Design et accessibilité à approfondir.** Le gros est propre (pas de casse,
  pas de débordement), mais il reste un travail de finition fine : cohérence des
  grands titres en serif, anneaux de focus partout au clavier, relecture
  complète des libellés d'accessibilité.
- **Suite Playwright complète.** Les tests de données (113) sont verts et j'ai
  fait un audit runtime large, mais la suite Playwright d'origine n'a pas été
  réécrite pour tout le nouveau périmètre.

---

## 5. Les trois points dont je suis le moins satisfait

Tu l'as demandé explicitement. Les voici, sans adoucir.

### 1. La validation juridique n'est pas faite — et c'est le cœur du modèle

Tout le modèle économique repose sur une distinction : une prime n'est pas une
commission, une mise en relation n'est pas du courtage. J'ai construit l'UI et
les textes pour qu'ils tiennent cette ligne, et j'ai rassemblé les questions
dans `JURIDIQUE-A-VALIDER.md`. Mais **je ne suis pas juriste, et aucun juriste
n'a confirmé que la ligne tient.** Si elle ne tient pas, ce n'est pas un détail
d'écran à corriger : c'est le modèle à revoir. C'est le risque le plus lourd du
projet, et il est hors de ma main.

### 2. Les quatre chantiers parallèles ont partagé des fichiers — l'historique git est moins propre que je ne le voulais

Pour aller vite, j'ai lancé jusqu'à quatre agents en parallèle. Ils ont dû
toucher des fichiers communs (le journal de session, la vitrine de profil, le
contenu des rôles). Résultat : un repère du tutoriel (P5) s'est retrouvé dans un
commit de pôle (P6), et des ajouts de deux chantiers cohabitent dans le même
fichier. **Chaque commit compile et passe les tests, et la tête est vérifiée ;
mais la séparation « un chantier = un commit » que tu voulais n'est pas parfaite
au fichier près.** Si tu relis l'historique commit par commit, certains
mélangent deux intentions.

### 3. La profondeur de contenu est inégale selon les pôles

Les systèmes sont solides partout — on peut cliquer partout et ça mène quelque
part. Mais le **contenu** n'a pas la même densité d'un pôle à l'autre : les
leçons de formation sont des gabarits plutôt que de vrais cours écrits ; quelques
adresses et photos restent génériques. Quelqu'un qui explore dix minutes ne le
verra pas ; quelqu'un qui creuse un pôle à fond, si. J'ai préféré que **tout
tienne debout** plutôt que de rendre deux pôles parfaits et laisser les autres
en friche — mais c'est un arbitrage, pas une victoire.

---

## 6. Pour regarder

Préproduction :
https://plateforme-git-feat-plateforme-v2-leoanser53-5284s-projects.vercel.app

Un parcours de dix minutes qui montre l'essentiel :
1. À l'arrivée, **le tutoriel se lance** — fais « Découvrir E-Dome ».
2. En haut, **« Vous êtes … — changer »** : incarne **Hélène (France)** et ouvre
   `/apporteurs` → la **restriction France** est visible.
3. Incarne **Bernard** et va sur `/publier` jusqu'au bloc **« Faites-vous amener
   des acheteurs »** : la prime en francs, pas un pourcentage.
4. Ouvre `/boutique`, une fiche produit, puis **« Voir chez le marchand »**.
5. `/services/s3` → **demande un devis** et suis le parcours jusqu'à l'avis.
6. `/admin` (mot de passe) → la console est alignée sur le casting, en **« Volume
   de transactions 2026 »**.

Rien n'est fusionné : tu valides sur cette URL, la production n'a pas bougé.
