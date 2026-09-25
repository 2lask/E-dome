# Marketing/Business — virage freemium & nouveau modèle d'affiliation

*Agent marketing/business, lecture seule. Sources : `src/lib/pricing/catalog.ts`, `src/lib/pricing/charge.ts`,
`src/content/tarifs.ts`, `src/content/roles.ts`, `src/content/explain.ts`, `src/content/demo.ts`,
`src/content/agence.ts`, `src/content/offer.ts`, `src/content/accompagnement.ts`,
`src/app/(app)/apporteurs/page.tsx`, `src/app/(app)/tarifs/page.tsx`, `src/app/(app)/aide/page.tsx`,
`AUDIT-2.md`, `DECISIONS-2.md`. Rien n'est codé ici — c'est une note d'arbitrage marketing/business.*

**Date :** 2026-09-25 · **Branche :** `feat/plateforme-v2`

---

## 0. Où on part

Aujourd'hui le modèle n'est **pas** vraiment freemium malgré les apparences :

- `PLANS` (`catalog.ts:169-238`) a déjà un palier `presence` à 0 CHF (`holder: "agency"`), mais il est **verrouillé à 3 biens** (`biens-3`) — un plafond qui punit le *démarrage*, pas la *réussite* : le commentaire du fichier lui-même cite **42 % des agences suisses ayant au plus 5 biens** (`catalog.ts:160-163`), donc le palier gratuit actuel exclut déjà une majorité d'agences qui devraient pouvoir y vivre.
- Les demandes d'accompagnement — le mécanisme qui amène de nouveaux clients à une agence, et que `DECISIONS-2.md` désaccord #7 identifie comme un **argument de confiance sous-vendu** — sont verrouillées derrière Vitrine (89 CHF, `catalog.ts:183-192`). Une agence gratuite ne peut donc pas « vraiment travailler » : elle peut se montrer, pas recruter.
- `agent` est un `PlatformRole` à part entière (`model/identity.ts:47`) mais **n'a aucun palier** dans `PLANS` — ni gratuit ni payant. C'est un trou, pas un choix.
- `prestataire`, `créateur`, `hôte` n'ont **aucun abonnement** aujourd'hui : ils paient uniquement à la commission marketplace (5–12 % selon le pôle, `RATES` dans `catalog.ts:30-40`). C'est déjà, de facto, le modèle le plus proche du « on paie quand on réussit » — il ne faut pas le casser en y ajoutant un mur.
- Côté affiliation, `APPORTEUR_SHARES` (`catalog.ts:110-117`) et le texte actuel d'`/apporteurs` (`page.tsx:109-116`) mélangent **un pourcentage unique 10–30 %** pour tout — biens compris (« Amener un bien… 10–30 % du frais plateforme »). Le nouveau modèle du fondateur (prime CHF fixe pour les biens, jamais un %) **contredit ce texte tel quel** : c'est un changement de contenu obligatoire, pas une nuance.

---

## A. Découpage freemium par rôle

Principe appliqué partout : **le plafond gratuit doit porter sur un signal de réussite mesurable**, jamais sur la capacité de démarrer. Pour un pro (agence/agent/prestataire/créateur/hôte), ce signal est en général *le volume d'annonces actives* ou *la taille d'équipe* — deux choses qui grandissent avec le chiffre d'affaires, pas avant lui.

### A.1 — Particulier (acheteur, locataire, visiteur)

| | Contenu |
|---|---|
| **Gratuit** | Tout, sans exception : recherche, filtres, contact, messagerie, favoris, alertes, simulateur hypothécaire, réservation courte durée, avis. |
| **Payant** | Rien, et ça ne doit pas changer. C'est le côté demande du marché biface — le monétiser tuerait la liquidité que les autres rôles paient pour atteindre. |

### A.2 — Propriétaire (particulier qui vend ou loue son bien)

| | Contenu |
|---|---|
| **Gratuit** | Publier et vendre/louer **sans plafond de biens**, contacts, messagerie, estimation IA de base. **0 CHF à E-Dome sur la transaction, sans exception** — c'est le pilier de tout le positionnement (`sellPage`, `demo.ts:94-101`) et il ne doit **jamais** devenir un argument freemium à géométrie variable. |
| **Payant — Patrimoine (19 CHF/mois)** | Le tableau de bord *bailleur* : baux et échéances, charges/décomptes, rendement réel, alertes de marché, IA approfondie, export fiduciaire. Seuil concret : **gratuit pour 1 bien loué avec suivi basique ; Patrimoine devient pertinent dès le 2ᵉ bien loué activement**, ou dès qu'on veut le rendement réel/export — pas avant, parce qu'un vendeur occasionnel n'a jamais besoin de ces outils. |

*Pourquoi pas de plafond sur la vente elle-même : contrairement à une agence, un particulier qui vend 8 appartements hérités n'est structurellement pas plus « pro » qu'un particulier qui en vend un — le nombre n'est pas un signal de réussite ici, contrairement à la location active.*

### A.3 — Agent indépendant (rôle `agent`, sans structure d'agence)

| | Contenu |
|---|---|
| **Gratuit** | Profil pro vérifié, **jusqu'à 10 biens actifs**, messagerie, candidater sans limite aux demandes d'accompagnement de son secteur. |
| **Payant — même palier que Vitrine agence (89 CHF), tel quel** | Annonces illimitées, page publique personnalisée, mise en avant, badge vérifié, statistiques. Un agent solo n'a **jamais** besoin de « Mandats » (équipe) — le jour où il embauche, il devient une agence au sens du modèle et migre naturellement vers ce palier. |

**Trou à combler (implication produit, pas une action de ce fichier) :** `PLANS` n'a aujourd'hui aucun palier `holder: "account"` en dehors de Patrimoine. Pour que l'agent indépendant existe vraiment, Vitrine doit devenir accessible à un compte individuel, pas seulement à une agence — actuellement structurel, à trancher avec l'archi/produit.

### A.4 — Agence

| | Contenu |
|---|---|
| **Gratuit (renommer Présence → « Essentiel » ou garder le mot mais changer le contenu)** | **Jusqu'à 10 biens actifs**, 1 utilisateur, page publique basique, **candidatures illimitées aux demandes d'accompagnement**, messagerie, statistiques de base (vues, demandes). |
| **Payant — Vitrine (89 CHF)** | Annonces **illimitées**, page publique enrichie, sous-domaine personnalisé, badge vérifié, mise en avant (quota/mois), statistiques avancées. |
| **Payant — Mandats (290 CHF)** | Tout Vitrine + **équipe et droits** (2ᵉ utilisateur et au-delà), mandats formels, agenda des visites, suivi des commissions, export, mise en avant élargie. |
| **Payant — Régie (690 CHF, later)** | Multi-entités, import de flux, rôles fins, comptabilité, SLA, DPA — inchangé. |

**Seuil de réussite explicite :** le 11ᵉ bien actif et le 2ᵉ utilisateur sont les deux déclencheurs. Les deux sont directement corrélés au chiffre d'affaires de l'agence — on ne peut pas gérer 15 mandats actifs ou faire grandir une équipe sans que ça se traduise déjà en revenu réel.

### A.5 — Prestataire

| | Contenu |
|---|---|
| **Gratuit** | Profil, **jusqu'à 5 fiches de service actives**, devis illimités, messagerie. E-Dome se rémunère déjà sur la commission (5–10 %) à chaque devis transformé — l'abonnement n'est pas nécessaire pour « travailler ». |
| **Payant** | Fiches illimitées, mise en avant dans le catalogue prestataires, badge vérifié, statistiques (vues → devis → conversion). |

### A.6 — Créateur

| | Contenu |
|---|---|
| **Gratuit** | **Jusqu'à 2 formations/produits actifs**, lives illimités (déjà commissionnés à 10 %, coût marginal faible — bon levier d'acquisition), messagerie, profil créateur. |
| **Payant** | Catalogue de formations illimité, mise en avant, statistiques d'audience avancées, automatisations (relances, certificats). |

*Le tarif fondateur créateur (5 %, 24 mois, 30 premiers — `catalog.ts:92-97`) reste un levier d'acquisition séparé, sur la commission, pas sur l'abonnement. Les deux se cumulent sans se contredire.*

### A.7 — Hôte (location courte durée)

| | Contenu |
|---|---|
| **Gratuit** | **Jusqu'à 2 biens en courte durée actifs simultanément**, calendrier, messagerie, réservations. Déjà commissionné à 12 %. |
| **Payant** | Biens illimités, synchronisation calendrier multi-plateformes (iCal), statistiques de revenus avancées, automatisations (messages auto, tarification dynamique), mise en avant saisonnière. |

*Seuil : 2 biens simultanés est le point où gérer « à la main » devient pénible — c'est exactement le moment où un hôte occasionnel devient un petit professionnel de la location, et où beaucoup de communes suisses elles-mêmes distinguent usage occasionnel et activité régulière.*

### Tableau de synthèse

| Rôle | Gratuit (de quoi travailler) | Bascule payante | Palier |
|---|---|---|---|
| Particulier | Tout, sans limite | — jamais — | — |
| Propriétaire | Vente/location illimitée, 0 CHF transaction | 2ᵉ bien loué activement / outils patrimoniaux | Patrimoine, 19 CHF |
| Agent indépendant | 10 biens actifs, candidatures illimitées | 11ᵉ bien / visibilité | Vitrine, 89 CHF |
| Agence | 10 biens actifs, 1 utilisateur, candidatures illimitées | 11ᵉ bien → Vitrine ; 2ᵉ utilisateur → Mandats | Vitrine 89 / Mandats 290 / Régie 690 |
| Prestataire | 5 fiches actives | 6ᵉ fiche / visibilité | à créer (~29–39 CHF) |
| Créateur | 2 formations actives, lives illimités | 3ᵉ formation / visibilité | à créer (~29–39 CHF) |
| Hôte | 2 biens courte durée actifs | 3ᵉ bien / automatisations | à créer (~29–39 CHF) |

---

## B. Ce qui change vs les paliers actuels

1. **Présence perd son plafond punitif.** `biens-3` (`catalog.ts:175`) passe à un plafond qui protège plutôt qu'il n'exclut : 10 biens, pas 3. Sous ce chiffre, une agence ne peut littéralement pas exister sur la plateforme ; au-dessus, elle est en croissance et peut payer.
2. **Les demandes d'accompagnement deviennent gratuites, à tous les paliers, sans plafond de candidatures.** C'est le changement le plus important de cette note : aujourd'hui verrouillées derrière Vitrine (`catalog.ts:189` `"demandes-accompagnement"`), elles sont *le* mécanisme d'acquisition de nouveaux mandats pour une agence — les garder payantes contredit frontalement « gratuit = de quoi vraiment travailler ». **Attention à ne pas commercialiser l'ordre chronologique** (désaccord #7 de `DECISIONS-2.md`) : le payant doit rester sur la *capacité à gérer plus de mandats gagnés* (Mandats), jamais sur la *position dans la file* — sinon on détruit l'argument de confiance juridique qui fait la force de ce mécanisme.
3. **Vitrine se repositionne : de « débloquer l'outil de base » à « visibilité et volume ».** Ce qui reste exclusif à 89 CHF : annonces illimitées, sous-domaine, badge vérifié, mise en avant, page publique enrichie, statistiques avancées. Ce n'est plus un droit d'entrée, c'est un accélérateur.
4. **Un palier manque structurellement : l'agent indépendant.** Aujourd'hui `PLANS` n'a que `holder: "agency"` et une seule ligne `holder: "account"` (Patrimoine, pour les propriétaires). Recommandation : ouvrir Vitrine à un compte individuel (même prix, même contenu, scope différent) plutôt que d'inventer un cinquième palier — ça évite la prolifération de formules que le comptable dénonçait déjà (`catalog.ts:160-163`).
5. **Prestataire, créateur et hôte gagnent chacun un palier payant qui n'existe pas aujourd'hui.** Actuellement 100 % commission, 0 % abonnement — c'est bien pour l'acquisition, mais ça laisse de l'argent sur la table pour les professionnels qui utilisent la plateforme comme outil principal (ex. un photographe qui vit d'E-Dome, pas d'un devis occasionnel). Proposition : un palier léger (~29–39 CHF), volontairement moins cher que Vitrine agence, car la charge de travail à servir est plus petite. **Ne pas fusionner ces trois rôles dans un seul palier** — leurs signaux de réussite (fiches actives, formations actives, biens courte durée) sont différents et doivent rester lisibles séparément.
6. **Patrimoine ne change pas de prix, mais change de logique d'entrée** : aujourd'hui c'est un palier autonome peu visible (l'audit UX note la carte Patrimoine « seule dans une grille 4 colonnes », `AUDIT-2.md` Thème 9) ; avec le virage freemium, il doit être présenté comme *la suite naturelle* d'un propriétaire qui loue plusieurs biens, pas comme un produit à part.
7. **Ce qui NE change PAS et ne doit pas changer** : le « 0 CHF à E-Dome » sur la vente/location entre particuliers (`sellPage`, `demo.ts`) reste absolu — c'est un pilier de positionnement, pas une case du tableau freemium à ajuster.

---

## C. Les seuils du gratuit — challenge acquisition vs conversion

**Le risque « trop généreux » est réel mais mal placé si on regarde le mauvais paramètre.** Rendre les annonces illimitées gratuites tuerait la conversion (le fondateur le dit explicitement : *annonces illimitées* est un item payant dans son propre message). Le bon calibrage n'est donc pas *combien de biens gratuits*, mais *lequel des leviers reste payant sans exception* :

- **Jamais gratuits, quel que soit le volume** : la 2ᵉ personne dans une équipe, la mise en avant, le sous-domaine/branding, l'export de données, les automatisations, les statistiques avancées. Une agence à 4 biens et une agence à 40 biens ont toutes deux une raison de payer si elles veulent une de ces choses — le plafond de biens n'est pas le seul verrou, et ne doit pas l'être : **une agence à 6 biens qui embauche un 2ᵉ agent doit basculer en payant même si elle est sous le plafond d'annonces**. C'est la meilleure protection contre « trop généreux = personne ne paie ».
- **Le chiffre 10 (biens) n'est pas arbitraire** : le commentaire de `catalog.ts:160-163` cite 42 % des agences suisses à ≤5 biens — sous ce chiffre-là (l'actuel, 3), on en exclut une majorité dès le premier jour ; à 10, on couvre confortablement ce segment ET une partie de la tranche 6–10, tout en laissant un mur net pour toute agence en croissance réelle. Descendre à 5 recrée le problème actuel (on redevient trop serré pour arriver) ; monter à 20+ retarde trop la conversion d'une agence moyenne (elle n'a jamais de raison de payer avant plusieurs années).
- **Sur les rôles marketplace (prestataire/créateur/hôte), le risque inverse existe** : des plafonds à 2–5 fiches sont bas en valeur absolue, mais ces rôles sont **déjà rémunérateurs pour E-Dome via la commission dès la première vente** — contrairement aux agences, un prestataire gratuit qui ne convertit jamais ne coûte presque rien et peut rester gratuit longtemps sans détruire l'économie. Le seuil peut donc être un peu plus généreux ici sans risque : je recommande de **ne pas descendre sous 5 fiches / 2 formations / 2 biens courte durée**, parce que ces trois métiers ont un vrai besoin de tester plusieurs offres avant de savoir laquelle marche — un plafond à 1 tuerait l'expérimentation, qui est justement ce qui produit la conversion (« j'ai 3 formations qui marchent, je veux la 4ᵉ »).
- **Sur les demandes d'accompagnement, aucun plafond, à dessein.** Les limiter (ex. 3 candidatures/mois gratuites) semble une évidence de conversion, mais ça détruit exactement l'argument que le désaccord #7 de `DECISIONS-2.md` identifie comme sous-exploité — c'est le canal d'acquisition *de la plateforme elle-même* (chaque candidature déposée est une agence qui découvre la valeur du produit). Le rentabiliser directement serait optimiser le mauvais métrique.

**Résumé du calibrage recommandé :** doser le gratuit sur le *volume d'inventaire* (biens/fiches/formations — généreux, seuil ≈ 10 pour le pro établi, ≈ 2–5 pour les rôles marketplace) et garder *tout ce qui est structurel* (équipe, visibilité, données, automatisation) payant sans aucune exception de volume. C'est la combinaison qui laisse démarrer sans jamais laisser grandir gratuitement.

---

## D. UI des deux affiliations — comment ne pas les confondre

Le texte actuel d'`/apporteurs` mélange déjà les deux mécaniques dans le même tableau `APPORT_TYPES` (`page.tsx:109-116`) : « Amener un hôte → Bounty fixe 100 CHF », « Amener un client → 10–30 % de la commission E-Dome », « Amener un bien → 10–30 % du frais plateforme ». Sous le nouveau modèle, cette dernière ligne est **fausse** : un bien se rémunère en prime CHF fixe (1–10 000 CHF), jamais en %. C'est le premier changement de contenu obligatoire, avant toute question de mise en page.

**Principe directeur : deux mécaniques = deux univers visuels qui ne se touchent jamais dans la même ligne, le même badge, ou le même chiffre.**

1. **Vocabulaire strictement séparé et jamais interchangé.**
   - Biens → toujours « **prime** » (jamais « commission », jamais « % »). Ex. « Prime de 350 CHF si la mise en relation aboutit ».
   - Marketplace/abonnements → toujours « **commission** » ou « **part** », toujours exprimée en % dans le contexte produit, mais **le nombre affiché à l'apporteur est le montant net en CHF**, pas le %. Le % sert à expliquer, le CHF sert à motiver.

2. **`/apporteurs` — un sélecteur en tête de page, pas un mélange.** Un commutateur à deux positions (« Biens » / « Marketplace & abonnements ») au-dessus du tableau de bord change tout le contenu affiché en dessous : liens, exemples, calculette. Les deux mécaniques ne doivent **jamais apparaître côte à côte dans la même grille de cartes** — c'est exactement ce que fait `APPORT_TYPES` aujourd'hui et c'est la source de confusion à corriger en premier.
   - Onglet **Biens** : un badge visuel distinct (icône maison/poignée de main, couleur dédiée), montant toujours affiché en CHF absolu, jamais en %, avec la phrase fixe « prime versée à la mise en relation acceptée — jamais un pourcentage du prix du bien » — cette dernière précision est aussi un garde-fou juridique (`catalog.ts` documente déjà pourquoi les primes fixes évitent le terrain du courtage).
   - Onglet **Marketplace** : badge distinct (icône %/graphique), exemple concret par produit (« Formation à 490 CHF → commission marketplace 10 % → votre part 30 % → vous touchez **~15 CHF net** ») — toujours résoudre jusqu'au **net en CHF**, jamais laisser un % nu comme dernière ligne.

3. **`/tarifs` — une seule ligne de renvoi, pas de détail.** La page tarifs parle d'abonnements, pas d'affiliation ; y dupliquer les deux mécaniques créerait une troisième source à maintenir en cohérence (déjà un problème structurel identifié dans `AUDIT-2.md` Thème 4, le « facteur-5 »). Une ligne suffit : « Programme apporteurs : prime fixe sur les biens, commission sur la marketplace et les abonnements → *voir /apporteurs* ».

4. **`/aide` — un tableau comparatif à 2 colonnes, pas 2 FAQ éparpillées.** La FAQ actuelle (`aide/page.tsx:39-43`) répond déjà à « qui paie la part de l'apporteur » avec la formulation à un seul taux (« 10 à 30 % ») — **à réécrire**, parce qu'elle ne dit plus la vérité une fois les primes biens introduites. Remplacer par un tableau : colonne « Biens » (prime CHF, versée après mise en relation acceptée, jamais liée au prix) vs colonne « Marketplace & abonnements » (commission %, sur la marge du vendeur, jamais ajoutée au prix payé par le client). Le lecteur doit pouvoir répondre à « combien je touche si… » en 5 secondes en identifiant d'abord la colonne, pas en lisant un paragraphe.

5. **Interdit strict, dans les trois écrans : ne jamais afficher un pourcentage à côté du prix d'un bien.** Même à titre illustratif (« ça ferait environ X% »), ça recrée visuellement l'ancien barème 500/2 500 CHF que `DECISIONS-2.md` (D4) a déjà fait disparaître de `legacy.ts` — un simple raccourci de présentation pourrait le faire revivre dans le texte.

---

## E. Anti-cold-start affiliation — challenge et compléments

Les trois mécanismes proposés par le fondateur sont bons mais incomplets pris séparément :

1. **Taux pré-rempli à la création — d'accord, mais pas au minimum de la fourchette.** Pré-remplir à 5 % pour une formation (bas de la fourchette 20–50 % citée dans le brief business) recrée exactement le problème qu'on veut éviter : personne ne recommande un produit à faible rémunération. **Recommandation : pré-remplir aux 2/3 supérieurs de la fourchette affichée** (ex. ~35 % pour une formation, pas 20 %), avec un message explicite « ce taux attire les apporteurs — vous pouvez le baisser, mais votre produit sera moins visible dans leur catalogue ». Toujours éditable, jamais imposé.
2. **Mise en avant des produits affiliés — d'accord, avec un garde-fou anti-pay-to-win.** Un produit avec un taux actif doit être visuellement signalé (« Éligible apporteurs ») et remonté dans le **picker apporteur** (`/apporteurs`, le composant `CATALOG_TABS` existant, `page.tsx:48-90`) — mais **cette remontée ne doit jamais influencer le classement de la recherche publique générale**. Sinon un vendeur pourrait acheter du rang en gonflant sa commission, ce qui rouvre exactement le problème que « demandes d'accompagnement » évite soigneusement ailleurs sur la plateforme (classement chronologique, jamais payant).
3. **Taux minimum pour figurer — d'accord, mais avec deux planchers différents, pas un seul.** Pour la marketplace, un plancher en % a du sens (aligné sur les planchers déjà écrits dans `RATES`, `catalog.ts:30-40`, qui sont eux-mêmes ≥5 % sur presque tous les pôles). Pour les biens, un plancher en % n'a **aucun sens dans ce modèle** — il faut un **plancher en CHF** (ex. prime minimum de 50–100 CHF pour figurer au catalogue apporteur), sinon on retombe dans le problème du `MIN_COMMISSION` (`catalog.ts:74`) : sur un petit montant, une part proportionnelle s'écrase à presque rien et décourage l'apporteur d'un côté comme du vendeur de l'autre.
4. **Un complément qui manque : la transparence AVANT publication, pas seulement le pré-remplissage.** Un vendeur qui règle son taux doit voir, au moment où il le fixe, une estimation concrète — « à 10 %, un apporteur qui vous amène 3 clients/mois touche environ X CHF/mois » — pour comprendre l'arbitrage visibilité/marge sans faire le calcul lui-même. Sans ça, le taux pré-rempli reste une case qu'on ne comprend pas et qu'on a tendance à baisser par réflexe.
5. **Un complément qui manque : un tarif fondateur apporteur, symétrique à celui des créateurs.** `CREATOR_FOUNDING` (`catalog.ts:92-97`) donne aux 30 premiers créateurs un taux avantageux pendant 24 mois pour amorcer l'offre. Rien d'équivalent n'existe côté demande (les apporteurs). Proposition à challenger par le fondateur : les 50 premiers apporteurs actifs bénéficient d'une part majorée (ex. +5 points sur `APPORTEUR_SHARES`) pendant une fenêtre limitée, pour amorcer le réseau de distribution en même temps que le catalogue — sans ça, on a un catalogue attractif (créateurs fondateurs) sans personne pour le pousser (apporteurs).

---

## Désaccords assumés (à trancher par le fondateur)

1. **Le plafond « 10 biens actifs » pour agence/agent indépendant est ma proposition, pas un chiffre validé.** Il est ancré sur le seul repère chiffré disponible dans le code (42 % des agences ≤5 biens) plus une marge de sécurité. Le fondateur peut préférer 8 ou 15 — l'important est de rester nettement au-dessus de 3 (le chiffre actuel) et de ne jamais gater les demandes d'accompagnement.
2. **Je recommande de ne PAS créer de 5ᵉ palier pour l'agent indépendant**, mais d'ouvrir Vitrine à un compte individuel. C'est un choix produit/tarification qui simplifie la grille au prix d'un changement de modèle de données (`holder` doit accepter un compte individuel sur un palier aujourd'hui réservé aux agences). Si l'archi juge ce changement trop coûteux à court terme, l'alternative (un palier « Agent » dédié, prix à définir ~60–70 CHF) reste possible mais alourdit `PLANS`.
3. **Prix des paliers prestataire/créateur/hôte (~29–39 CHF) sont des ordres de grandeur, pas un chiffrage.** Je n'ai pas de données de rentabilité par rôle pour les valider — à faire trancher avec le comptable avant tout affichage public.
4. **Rendre les demandes d'accompagnement 100 % gratuites, sans aucun plafond de candidatures, est la recommandation la plus tranchée de cette note — et celle qui a le plus d'impact business.** Elle inverse la logique actuelle (`catalog.ts:189`, verrouillée dès Vitrine). Je la défends parce qu'elle est la seule cohérente avec le mot d'ordre du fondateur, mais elle réduit un revenu potentiel à court terme (candidater ne sera plus un argument de conversion vers Vitrine) au profit de l'acquisition. Si le fondateur veut un compromis, l'option la moins pire est de garder les candidatures gratuites mais de limiter à Vitrine+ des outils de *gestion* des candidatures envoyées (brouillons, relances), jamais l'acte de candidater lui-même.
5. **Le mécanisme de prime CHF pour les biens n'existe dans aucune structure de données actuelle** (`Charge` dans `charge.ts:56-71` n'a ni type `referral-bounty` par bien, ni champ de prime éditable par annonce — seul `BOUNTIES` existe, pour l'activation hôte/utilisateur, pas pour la mise en relation sur un bien). C'est une implication produit/archi de cette note, pas quelque chose que je peux trancher ici — je le signale pour que Mission 3 en tienne compte avant de construire l'UI de la section D.
