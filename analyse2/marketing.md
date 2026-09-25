# Audit marketing, contenu & crédibilité — E-Dome (Mission 2)

Domaine : le feed (B.2), le storytelling des profils (B.1), la proposition de valeur par rôle, ce qui sonne faux. Lecture seule, sources citées `fichier:ligne`.

---

## 1. Le feed — verdict

### Ce qui marche déjà (à ne pas casser)

- **Variété de format réelle** : `src/lib/demo/posts.ts` mélange vidéo (`clip(n)`, 27 posts p1-p27), photo unique (`p-photo-1`, `p-photo-formation`), galeries 2/3/4 photos (`p-gal-2`, `p-gal-3`, `p-gal-4`), texte pur façon X (`p-t2` à `p-t6`), sondages (`p-poll-1`, `p-poll-2`), et une carte analytique (`p-analytics-1`). C'est un vrai travail, pas un feed de vignettes identiques.
- **Rythme temporel correct** : `hAgo()` étale les posts sur ~8 jours (`hAgo(0.3)` à `hAgo(184)`), avec des écarts variables (2h, 4h, 8h...). Contrairement à l'hypothèse de départ, ce n'est PAS un mur de publications du même jour. Bon point, à garder tel quel.
- **Longueurs variées** : les posts vidéo (p2-p27) portent un titre + un paragraphe ; les posts `p-t*` sont volontairement courts et sans hashtag. Le commentaire en ligne 499-502 de `posts.ts` montre que l'auteur a déjà identifié le problème d'uniformité et corrigé partiellement — c'est un chantier en cours, pas un aveuglement.
- **CTA contextuels** : `CUSTOM_CTA` (`posts.ts:685-690`) relie certains posts à une action pertinente (p6 → rejoindre les apporteurs, p23 → voir le profil de Sophie, p25 → explorer le Maroc). Bonne pratique, sous-exploitée (4 posts sur ~34).
- **Le post épinglé (p1)** est honnête et bien pensé : `likes: 0`, `comments: []`, disclaimer clair. Le commentaire en ligne 202-219 explique pourquoi (pas de traction fabriquée). C'est le meilleur texte de la maquette — voir §4.

### Ce qui casse la crédibilité — par gravité

**CRITIQUE — le widget « Suggestions » propose de se suivre soi-même**
`src/lib/demo/posts.ts:719` : `export const SUGGESTIONS = [U_LEO, U_AMIRA, U_THOMAS, U_YASMIN];` — et ligne 727, `export const CURRENT_USER = U_LEO;`. Le panneau de droite du feed (`src/app/(app)/feed/page.tsx:756-800`) rend `SUGGESTIONS.slice(0,10)` avec un bouton « Suivre » pour chacun. Résultat : la première chose visible dans la colonne « qui suivre » est un bouton « Suivre » sous son propre avatar et son propre nom. N'importe quel visiteur qui regarde la colonne de droite pendant 3 secondes voit l'incohérence — bien avant les 10 minutes du critère de la mission. À corriger en retirant `U_LEO` de `SUGGESTIONS`.

**CRITIQUE — 4 des 5 personnages récurrents du feed ont un profil mort**
Le feed invente ses propres identifiants pour ses auteurs récurrents : `U_SOPHIE` id `"u1"` (`posts.ts:72-78`), `U_MARC` id `"u2"` (`80-86`), `U_AMIRA` id `"u3"` (`88-94`), `U_THOMAS` id `"u4"` (`96-102`), `U_YASMIN` id `"u-yasmin"` (`112-118`). Mais `/profil/[id]` résout via `getMockProfile(id)` (`src/lib/profile-data.ts:309`), qui ne connaît que les clés `user-002` à `user-012` et `user-015`. Aucune des cinq ne matche. Conséquence vérifiée dans `src/app/(app)/profil/[id]/page.tsx:105-121` : cliquer sur l'avatar ou le nom de Sophie (autrice de 7 posts : p2, p7, p13, p18, p23, p-gal-2, p-t4), Marc (p4, p10, p15, p21, p-t2, p-t3, p-poll-1/2, p-analytics-1), Amira (p3, p11, p16, p25) ou Thomas (p5, p12, p19, p26, p-gal-3) affiche **« Profil introuvable — Cet utilisateur n'existe pas dans la maquette »**. Seule Amina (`id: "user-004"`, `posts.ts:104`) résout correctement, parce que son id coïncide par hasard avec `profile-data.ts`. C'est la pire chose possible pour « un feed crédible est la première chose qu'un visiteur juge » : le premier clic sur un nom, pour 80 % des personnages qui font vivre le fil, mène dans le mur.

**MAJEUR — même quand ça résout, les chiffres divergent**
Amina (la seule qui résout) : le feed l'affiche avec 8 900 abonnés et 412 avis (`posts.ts:108-109`), sa page de profil avec 1 200 abonnés et 98 avis (`profile-data.ts:188`). Un visiteur qui clique voit les chiffres changer sous ses yeux — 7× et 4× d'écart pour « la même » personne.

**MAJEUR — uniformité structurelle des 26 posts vidéo d'origine**
Sur les 27 posts vidéo (p1-p27), 26 suivent exactement le même moule : *Titre accrocheur / ligne vide / paragraphe avec un chiffre ou une promesse / 2-3 hashtags en minuscules*. Ex. `#marrakech #riad #investissement` (p3), `#dubai #offmarket #apporteur` (p6), `#penthouse #geneve #luxe` (p10), `#marketing #reels #formation` (p27). Le sujet varie, la forme jamais. C'est ce qui donne l'impression « généré » même là où le rythme et le format sont bons — un feed humain a des posts qui ne suivent pas tous le même gabarit ville+thème+3-hashtags. Les posts `p-text-1` à `p-poll-2` (ajoutés après coup, cf. commentaire ligne 499) cassent ce moule — mais ils ne représentent que ~9 posts sur 34.

**MAJEUR — un feed unanimement élogieux, sans une seule voix discordante**
Aucun commentaire ne négocie, ne conteste un prix, ne pose une question difficile, ne exprime une déception. Tout est superlatif : « Référence absolue » (×2), « Performance hallucinante », « Le plus beau riad que j'ai vu cette année », « Bravo », « Confirmation totale ». Plus problématique : **Léo — le personnage dans la peau duquel le visiteur navigue** — commente en admirateur sur 9 posts d'autres personnes, toujours en éloge : `posts.ts:244` (Amira, « Bravo Amira »), `276` (Yasmin, « Référence absolue »), `320` (Marc), `340` (Thomas), `360` (Yasmin encore, « tu es ma référence Dubaï »), `380` (Amira, « Bravo Amira »), `412` (Thomas, « Bravo Thomas »), `442` (Yasmin, « La méthode Al Falasi »), `474` (Amira). Un utilisateur qui complimente tout le monde sur un ton uniforme lit comme un compte-modérateur ou un bot, pas comme un propriétaire lausannois qui loue trois appartements. Ça contredit directement le travail fait sur son identité (voir §2, `demo/identity.ts`).

**MODÉRÉ — le pôle Services (prestataires) est absent du feed**
`content/demo.ts:64` liste « Services » comme pôle « au lancement », au même rang que Biens et Apporteurs. Pourtant aucun auteur du feed ne parle de photographie, de home staging ou d'un devis obtenu via la plateforme — alors que `mock-data.ts` a deux personnages taillés pour ça (Lucas photographe, Carlos photographe). Le pôle le plus proche d'une preuve sociale concrète (« j'ai eu un devis en 24h, mes photos ont doublé mes vues ») n'a pas de voix dans le fil.

**MODÉRÉ — aucun contenu « particulier » alors que c'est le rôle par défaut**
`content/demo.ts:123` : `DEFAULT_VIEWING_AS = "particulier"` — c'est la porte d'entrée par défaut de la visite. Mais aucun post du feed n'est écrit du point de vue d'un acheteur/locataire ordinaire (type Clémence dans `mock-data.ts`, cadre pharma, premier achat). Le rôle qu'on demande le plus souvent au visiteur d'incarner n'a aucun miroir dans le fil qu'il découvre en premier.

### Ce qu'il faut pour un feed vivant (résumé actionnable)

1. Retirer Léo de `SUGGESTIONS` (`posts.ts:719`).
2. Faire pointer les auteurs récurrents du feed vers de vrais ids de `profile-data.ts` (ou l'inverse : étendre `profile-data.ts` et faire de lui la source unique — voir §2).
3. Réconcilier les stats affichées (feed vs profil) pour tout personnage qui apparaît aux deux endroits.
4. Casser le moule « Titre / paragraphe+chiffre / 3 hashtags » sur une bonne moitié des posts vidéo existants — varier l'ouverture (question directe, citation, constat sans titre).
5. Ajouter 3-4 commentaires qui ne sont pas des compliments : une objection sur un prix, une question logistique sans réponse enthousiaste, un avis mitigé. Et réduire drastiquement les interventions de Léo en mode supporter.
6. Donner une voix au pôle Services et au rôle « particulier » dans le fil.

---

## 2. Storytelling des profils — le vrai problème structurel

### Trois castings différents, pas un seul

La maquette ne porte pas « 16 profils éparpillés » mais **trois casts partiellement différents** qui partagent parfois un id ou un prénom sans être la même personne :

| Source | Où | Qui l'utilise |
|---|---|---|
| `src/lib/mock-data.ts` (`users`, 16 personnes, ids `user-002`…`user-016`) | catalogue legacy | `messages/page.tsx`, listes de biens/instructeurs |
| `src/lib/profile-data.ts` (`PUBLIC_SEEDS`, 11 personnes + Léo, ids `user-002`…`user-012`, `user-015`) | le cast « propre », le plus récemment corrigé | `/profil/[id]`, `/reseau`, `/recherche` |
| `src/lib/demo/posts.ts` (auteurs du feed, ids `u1`-`u4`, `u-yasmin`, `user-004`) | le feed | `/feed`, `/creer-post` |

Ces trois listes se recoupent en apparence (mêmes prénoms) mais divergent sur les faits. Exemples vérifiés :

- **`user-005` change de métier selon le fichier consulté.** `mock-data.ts:111-126` : Lucas Renaud, Nice, *photographe et hôte*, « Je sublime vos biens... Drone & Matterport ». `profile-data.ts:191-203` : Lucas Renaud, Nice, *promoteur immobilier*, « Spécialiste des villas de prestige et des programmes neufs ». Même nom, même ville, deux professions opposées.
- **`user-007` désigne deux personnes différentes.** `mock-data.ts:159-174` : Nathalie Blanc, notaire à Genève, formatrice juridique, brevet de notaire VD 2016. `profile-data.ts:231-242` : Camille Rochat, investisseuse à Fribourg. Pas de recoupement de nom ni de rôle — c'est une pure collision d'identifiant.
- **`user-009` porte le même nom, deux vies différentes.** `mock-data.ts:191-206` : Fatima Zahra, Dakar (Sénégal), apporteuse d'affaires en Afrique de l'Ouest. `profile-data.ts:255-266` : Fatima Zahra, Casablanca (Maroc), directrice d'agence. Même identité déclarée, ville et rôle contradictoires.
- Le feed ajoute une quatrième couche : Sophie y est « Sophie Martin » (`posts.ts:72-78`, id `u1`) alors que les deux autres fichiers la connaissent comme « Sophie Durand » (id `user-002`). Marc est « Marc Dubois » dans le feed (`posts.ts:80-86`, id `u2`) contre « Marc Favre » ailleurs (id `user-003`). Amira (feed, `posts.ts:88-94`) devient Amina ailleurs — noms suffisamment proches pour semer le doute sans être la même personne.

Ce n'est pas un détail : ça veut dire qu'il n'existe **aucune base cohérente de 15 profils aujourd'hui**, seulement des fragments qui se contredisent selon l'écran. Le fondateur devra choisir UNE source de vérité (je recommande `profile-data.ts`, qui est visiblement le chantier le plus récent et le plus soigné — voir la trace de correction dans `demo/identity.ts`) et faire pointer le feed et le catalogue vers elle, plutôt que de continuer à faire vivre trois annuaires en parallèle.

### Le seul profil vraiment réussi : Léo (le user courant)

`src/lib/demo/identity.ts` mérite d'être signalé comme référence de qualité, pas comme problème. Une seule source (`CURRENT_USER`), des chiffres modestes et cohérents (38 abonnés, pas 12 400 — commentaire ligne 58-61 explicite le raisonnement), un historique de correction documenté dans le code (pourquoi ce n'est plus « le fondateur », pourquoi 3 biens et pas 14, pourquoi le rôle formateur). C'est exactement le niveau d'exigence qu'il faut appliquer aux 14 autres profils, et actuellement aucun ne l'atteint.

### Suisse romande : le problème est réel, mais pas absolu

Sur les 16 profils de `mock-data.ts`, seuls 6 sont en Suisse (Léo/Lausanne, Sophie/Lausanne, Marc/Genève, Nathalie/Genève, Thomas/Lausanne, Jean-Luc/Neuchâtel) contre 10 à l'étranger (Marrakech ×2, Dubaï, Lisbonne, Dakar, Bangkok, Athènes, Barcelone, Nice). Dans `profile-data.ts`, le cast le plus « propre », c'est mieux mais pas réglé : 8 profils suisses (Lausanne, Genève, Neuchâtel, Fribourg, Zurich, Zoug — dont 2 hors Romandie) contre 4 à l'étranger (Marrakech, Dubaï ×2, Casablanca).

C'est un problème de crédibilité direct : la proposition de valeur entière de la maquette est suisse — francs, notaire, USPI/SVIT, Minergie, fiscalité suisse (`content/demo.ts`, `content/explain.ts`) — mais le visage de la communauté qu'on montre est à moitié étranger. Un visiteur ne peut pas trancher si E-Dome est une plateforme suisse avec un marché immobilier local, ou une place de marché internationale de luxe qui utilise le CHF comme unité d'affichage. Voir §3 pour la proposition de distribution.

**Nuance à ne pas perdre** : deux ou trois personnages « off-market international » servent un vrai but narratif — montrer que le réseau d'apporteurs peut faire venir de l'argent étranger vers l'immobilier suisse, ou qu'un hôte romand a un pied-à-terre ailleurs. Le problème n'est pas l'existence de contenu international, c'est que les personnages eux-mêmes RÉSIDENT et opèrent entièrement à l'étranger, sans jamais toucher à la Suisse romande dans leurs posts. Ma proposition (§3) garde la saveur internationale mais la rattache à une base romande.

---

## 3. Proposition — 15 archétypes Suisse romande

Base à réécrire par le fondateur, pas un casting final. Objectif : couvrir les 8 portes de `content/roles.ts` (`roleTour`) + les spécialités de `mock-data.ts` (notaire, architecte, photographe) qui n'ont pas survécu dans `profile-data.ts`, avec une répartition géographique credible (VD, GE, NE, FR, VS).

| # | Nom | Ville (canton) | Rôle(s) | Accroche |
|---|---|---|---|---|
| 1 | **Léo Martin** *(garder tel quel)* | Lausanne (VD) | Propriétaire · Hôte · Apporteur · Créateur | « Trois logements loués en direct, et ce que j'apprends en chemin. » |
| 2 | **Sophie Bovay** | Lausanne / Riviera (VD) | Courtière brevet fédéral · Hôte | « Biens de standing entre Lausanne et la Riviera, 12 ans de terrain. » |
| 3 | **Marc Rey** | Genève (GE) | Investisseur · Apporteur | « Portefeuille locatif romand, rendement net avant tout. » |
| 4 | **Nathalie Perret** | Genève (GE) | Notaire · Créatrice (formations juridiques) | « Le droit immobilier suisse expliqué avant que ça ne coûte cher. » |
| 5 | **Thomas Wenger** | Lausanne (VD) | Architecte EPFL · Investisseur | « Rénovation énergétique et Minergie, du dessin au chantier. » |
| 6 | **Jean-Luc Hartmann** *(garder tel quel)* | Neuchâtel (NE) | Agence familiale | « Vente et gérance depuis 1992, le service de quartier. » |
| 7 | **Camille Rochat** *(garder tel quel)* | Fribourg (FR) | Investisseuse | « Colocation premium et rendement, sans les paris risqués. » |
| 8 | **Clémence Moreau** | Lausanne (VD) | Particulière — premier achat | « Mon premier 4.5 pièces, en direct — ce que j'apprends en cherchant. » |
| 9 | **Amina Fassi** | Genève (GE), réseau Maroc | Créatrice (gestion locative, pricing dynamique) · Apporteuse | « Basée à Genève, formée sur les marchés émergents. » |
| 10 | **David Meier** | Nyon (VD) | Courtier — financement hypothécaire | « Le montage du crédit et la fiscalité, avant de signer. » |
| 11 | **Elena Currat** | Vevey / Montreux (VD) | Créatrice — home staging · Prestataire | « Valoriser un bien avant la photo, pas après. » |
| 12 | **Carlos Nunes** | Genève (GE) | Photographe immobilier · Prestataire | « Drone, Matterport, home staging — vos photos font vendre. » |
| 13 | **Yasmin Berrada** | Sion (VS) | Agence · Apporteuse | « Chalets et résidences valaisannes, clientèle internationale. » |
| 14 | **Omar Haddad** | Genève (GE) | Apporteur d'affaires | « Réseau d'investisseurs du Golfe, pour l'immobilier suisse. » |
| 15 | **Nicolas Berger** | Sion (VS) | Promoteur | « Programmes neufs basse consommation, Valais et Vaud. » |

Répartition : Lausanne ×4, Genève ×5, Neuchâtel ×1, Fribourg ×1, Nyon ×1, Vevey/Montreux ×1, Sion ×2 — tout en Suisse romande. Couverture des 8 rôles de `roleTour` (`content/roles.ts:42-119`) : particulier (8), propriétaire/hôte (1), agence (6, 13), prestataire (11, 12), créateur (4, 9, 11), apporteur (1, 3, 9, 13, 14), admin (hors cast, compte plateforme). Plus notaire (4), architecte (5), courtier financement (10), promoteur (15) — rôles présents dans `mock-data.ts` mais absents de `profile-data.ts` aujourd'hui.

**Désaccord assumé** : #9, #13, #14 gardent une couleur internationale (Maroc, clientèle du Golfe) mais je les ancre en Suisse romande plutôt que de les faire résider à Marrakech ou Dubaï comme aujourd'hui. C'est un choix — ça perd un peu du glamour « on est déjà internationaux », mais ça gagne en cohérence avec « plateforme suisse ». Si le fondateur préfère afficher une portée mondiale immédiate, il peut garder 2 profils clairement résidents à l'étranger, mais alors il faut le assumer explicitement dans le contenu (ex. un post qui dit « je gère mon portefeuille depuis Marrakech pour mes clients romands ») plutôt que de laisser un visiteur découvrir par hasard qu'un tiers du casting vit ailleurs.

---

## 4. Proposition de valeur par rôle — ce qui est clair, ce qui manque

### Ce qui est déjà fort

`src/content/roles.ts` (`roleTour`, 8 portes) et `src/content/explain.ts` (`POLE_EXPLAIN`, 7 pôles) sont le meilleur contenu marketing de la maquette. Chaque pôle répond à 4 questions fixes — quoi / pour qui / ce qu'E-Dome y gagne / quand — dans get cet ordre, sans jargon inutile. Exemple (`explain.ts:68-75`, pôle apporteurs) : « L'apporteur touche une part (10 à 30 %) de ce que gagne E-Dome sur la conversion — c'est un partage de la marge, pas un supplément pour le client. » C'est précis, ça anticipe l'objection (« est-ce que ça gonfle le prix ? ») et ça répond avant qu'elle soit posée. Le bloc « qui paie quoi » de `content/demo.ts:94-104` a la même qualité — c'est un contenu honnête et bien hiérarchisé (0 CHF sur la transaction mis en avant en premier, cf. commentaire ligne 84-88).

### Ce qui manque pour donner vraiment envie

- **Ce contenu ne sort pas de sa boîte.** Le mode explicatif et le sélecteur de rôle sont une couche à part (`/demo`, toggle « ? »). Le feed — la première chose qu'un visiteur juge selon le fondateur — n'en hérite jamais. Un post « services » qui dirait, dans son propre texte, « devis en 24h, commission 5-10 % jamais répercutée sur le client » ferait davantage pour la conversion qu'un lien vers une explication séparée.
- **Le rôle « particulier »** (porte par défaut, `demo.ts:123`) a la proposition la plus faible dans `roles.ts:47-55` : « Acheter, louer ou réserver un bien » — vrai mais générique, ça pourrait être le slogan de n'importe quel portail immobilier. Les autres rôles (propriétaire : « 0 CHF à E-Dome » ; apporteur : « lien traçable, rémunéré ») ont un différenciateur explicite dans la tagline elle-même. Le particulier n'en a pas — alors que c'est le rôle que la visite montre en premier.
- **Le rôle « prestataire »** est correctement expliqué (`explain.ts:60-66`) mais n'a aucune incarnation humaine visible (ni dans le feed, ni dans le cast de profils) — voir §1 et §2. Une proposition de valeur sans visage crédible pour la porter reste abstraite.

### Ce qui sonne faux

- Les hashtags mécaniques du feed (§1) lisent comme un générateur de légendes plutôt que des gens qui postent depuis leur téléphone.
- Le ton unanimement élogieux des commentaires (§1) — en particulier Léo en VRP permanent de tout le monde — contredit sa propre bio soigneusement modeste (`demo/identity.ts:78-82`).
- Les incohérences d'identité (§2 : Lucas photographe vs promoteur, Fatima Dakar vs Casablanca) ne sont visibles qu'en creusant deux fichiers côte à côte — un visiteur normal ne les verra pas directement, mais elles se manifestent concrètement via les liens de profil morts (§1) et les stats qui changent (§1), qui eux SONT visibles en 2 clics.
- Rien de « vide » de détecté dans le texte du contenu explicatif lui-même (`roles.ts`, `explain.ts`, `demo.ts`) — c'est au contraire la partie la plus honnête et la mieux calibrée de toute la maquette. Le problème n'est pas ce texte, c'est qu'il ne rayonne pas jusqu'au feed et aux profils, qui sont eux pleins de bruit non résolu.
