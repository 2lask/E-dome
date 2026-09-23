# Produit et UX — parcours, clarté, hiérarchie

La maquette est riche et fluide, mais elle raconte une plateforme sociale, pas un modèle économique. Trois manques dominent tous les autres : **une porte d'entrée** (la démo s'ouvre sur `/feed`, un fil de 3 130 lignes), **un écran de choix pour le vendeur particulier** (inexistant), **un point de vue assumable** (l'utilisateur courant est le fondateur d'E-Dome, décliné en cinq identités contradictoires). Le reste en découle.

---

## 1. L'écran de choix du vendeur particulier — `/vendre`

C'est le cœur de la démonstration, et le seul écran de la Partie B absent partout. Aujourd'hui un particulier qui veut vendre tombe directement sur `src/app/(app)/publier/page.tsx` : sept étapes, dont une étape « Frais de publication » (l.583-660) qui lui facture 500 ou 2 500 CHF — le modèle que B.3 abandonne. Il n'a jamais su qu'il avait le choix.

### Position : deux routes principales, une troisième en complément

La mission décrit trois routes ; je les rends **2 + 1**, pas 3 symétriques. « Seul » et « Accompagné » s'excluent : on choisit. « À la carte » ne s'exclut de rien — on prend un photographe qu'on vende seul ou accompagné. Trois cartes de même taille mentiraient sur la nature du choix, et entre trois options équivalentes on hésite au lieu de comprendre.

### Structure, bloc par bloc

**Bloc 0 — cadrage** (~140 px). H1 : « Vous vendez. Deux façons de le faire. » Sous-titre : « Publier est gratuit dans les deux cas. Ce qui change, c'est qui fait le travail — et qui vous facture. » Badge de statut « Au lancement » à droite du H1.

**Bloc 1 — les deux routes côte à côte** (colonnes égales, empilées sous 768 px). Chaque carte porte **les mêmes six lignes, dans le même ordre** : c'est la règle qui rend le coût lisible, l'œil compare des lignes alignées, pas des paragraphes.

| Ligne | « Je vends seul » | « Je me fais accompagner » |
| --- | --- | --- |
| 1. Nom + phrase | « Vous publiez, vous recevez les contacts, vous faites visiter. » | « Vous décrivez le bien, des agences vérifiées proposent leurs conditions, vous en choisissez une. » |
| 2. **À E-Dome** | **0 CHF** | **0 CHF** |
| 3. **À un tiers** | **0 CHF** — sauf prestations choisies | **Commission de l'agence**, fourchette indicative, payée à la vente uniquement |
| 4. Ce que vous faites | Photos · visites · négociation · dossiers | Vous choisissez l'agence. Elle fait le reste. |
| 5. Ce qu'E-Dome fait | Publication, visibilité, messagerie, outils | Publication de votre demande, comparaison des propositions |
| 6. Action | « Publier mon bien » → `/publier` | « Décrire mon bien » → `/vendre/accompagnement` |

Le **0 CHF des deux côtés de la ligne 2** est le point contre-intuitif de tout le modèle : plus gros caractère de l'écran, même hauteur dans les deux cartes. Le différenciateur n'est pas E-Dome, c'est la ligne 3. Sous elle, côté « accompagné » : « E-Dome ne touche rien sur cette commission et ne vous facture rien. »

**Bloc 2 — la troisième route, rattachée** (pleine largeur, décalée, fond neutre, un tiers de la hauteur des cartes). « En complément : à la carte. » — « Photographe, home staging, conseil juridique, dossier de vente : une prestation à l'unité, que vous vendiez seul ou avec une agence. » → `/services`. Ligne de coût : « Vous payez le prestataire. E-Dome prélève sa commission **sur ce que le prestataire encaisse**, pas en plus de son devis. »

**Bloc 3 — bande comparative** (tableau 3 colonnes desktop, accordéon mobile, six lignes max) : Publication · Frais E-Dome · Ce qu'un tiers facture · Qui organise les visites · Qui négocie · Quand vous payez. Reprise scannable du Bloc 1 ; doit pouvoir être lue seule.

**Bloc 4 — « Vous pouvez changer d'avis »** : un bien publié seul peut demander un accompagnement plus tard, depuis sa fiche. Sans cette phrase, le choix ressemble à un engagement et personne ne clique.

**Bloc 5 — panneau de flux d'argent, replié** (§3) : « Où va l'argent dans chaque cas ».

**Bloc 6 — les quatre règles inviolables**, quatre lignes en pied, petites mais pas grises. C'est ici qu'elles servent le plus : au moment où l'on se demande ce qu'E-Dome gagne sur sa vente.

### Où l'on atterrit

- Seul → `/publier`, **sans l'étape « Frais de publication »**, et la confirmation mène à la fiche du bien. Aujourd'hui elle mène à `/explorer`, la liste (`publier/page.tsx` l.202 : `href="/explorer"`).
- Accompagné → `/vendre/accompagnement` (à créer, §5).
- À la carte → `/services` avec un filtre de besoin.

---

## 2. Chaque parcours, et ce qui manque

Onze rôles en B.5, treize valeurs dans le code (`src/lib/types.ts` l.3), sept absentes. Manques constatés fichier ouvert.

**Visiteur.** `/` → « Explorer la démo » → `/feed` (`src/content/landing.ts` l.353). Il manque `/demo` entre les deux (§7). Le rôle `visiteur` n'existe pas et il n'y a aucun état déconnecté : le pied de `src/components/layout/sidebar-whop.tsx` affiche « Léo Martin · Démo » avec un avatar en dur.

**Particulier vendeur.** Manquent `/vendre` en amont de `/publier`, et un écran « mon annonce » en aval : vues, contacts reçus, demandes de visite, bouton « demander un accompagnement ». Sans lui, publier ne mène à rien.

**Particulier bailleur (longue durée).** `/publier` facture 150 / 250 / 400 CHF (l.621-638), contraire à B.3. Manquent la formule officielle du loyer initial, le tri des candidatures (tout tombe dans `/messages`), l'état des lieux, la garantie de loyer.

**Acheteur.** `/explorer` → `/explorer/[id]` → « Planifier une visite » (l.1111) → modale → toast (l.1307). **La demande n'atterrit nulle part** : pas d'écran « mes visites », aucun suivi. Les alertes de recherche existent mais sont enterrées dans `/parametres` (l.463), inatteignables depuis `/explorer`. Autre incohérence : la colonne d'action d'une vente propose « Contacter l'agent » (l.1123) même pour un bien publié par un particulier — le parcours « seul » n'a aucune représentation sur la fiche.

**Locataire.** Rien : ni dossier de candidature, ni mention « aucun frais à votre charge », pourtant l'argument le plus fort de ce côté.

**Voyageur courte durée.** Parcours complet (fiche → `/paiement` → `/reservations`), mais le widget calcule `fraisEdome = Math.round(subtotal * 0.08)` puis `total = subtotal + fraisEdome` (`explorer/[id]/page.tsx` l.1019-1020) : la commission est **ajoutée au prix payé par le voyageur**, exactement ce que `/publier` promet de ne pas faire (l.650) et ce que `src/lib/pricing.ts` interdit dans son en-tête. Taux en dur, hors du module de tarification. C'est le défaut le plus visible pour un investisseur attentif.

**Propriétaire abonné.** Rôle absent, écran absent. `/parametres` a une section « Plan actuel » (l.670) sans plan derrière.

**Agent (membre d'une agence).** Rôle absent, aucun écran — donc la gestion d'équipe de l'Espace agence n'a aucun support.

**Agence.** Zéro trace dans `src/`. Manquent `/agence/[slug]` (page publique), `/agence/equipe`, `/agence/mandats`, `/agence/demandes` (§5), `/agence/abonnement`, `/agence/statistiques`. Principale source de revenu, seul écran qu'une agence regardera : il ne peut pas être gris.

**Prestataire.** `/services/proposer` existe ; **aucune fiche prestataire** — les cartes de `/services` ouvrent une modale de devis en place (l.190). Manque le cycle : demande → devis chiffré → acceptation → paiement → avis adossé à la prestation.

**Créateur.** `/formations/creer`, `/evenements/creer`, `/live` existent. Manque un écran « mes revenus de créateur » avec le flux d'argent (commission, part apporteur, frais de paiement).

**Hôte.** `/reservations` et `/dashboard/reservations` portent sur des biens disjoints. Manque l'autorisation du propriétaire quand l'hôte est locataire (B.6).

**Apporteur.** `/apporteurs` est la page la mieux dotée (794 lignes, types d'apport l.109-115, tunnel l.440). Manquent l'écran de KYC — pourtant cité comme condition d'activation du lien — et la restriction géographique de B.3 ; le classement nominatif (l.139) doit partir, il affiche des gains par personne. Manque aussi l'écran vu du filleul : « vous avez été amené par X ».

**Annonceur.** Rien : aucune régie, aucun étiquetage « sponsorisé » généralisé.

**Administrateur.** `/admin` est publiquement atteignable et affiche des chiffres de traction (`admin/page.tsx` l.10). La porte est un sujet technique ; **les chiffres sont un sujet de crédibilité** et doivent partir.

---

## 3. Les quatre mécanismes transversaux

### Statuts visibles

Trois valeurs, en réutilisant le vocabulaire déjà typé de la landing (`landing.ts` l.34 `PoleAvailability`, l.182 `poleBadges`) : `launch`, `later`, plus `vision`.

- **Où.** À droite de chaque H1 ; une pastille de 6 px sur chaque entrée de navigation (`sidebar-whop.tsx`, `mobile-nav.tsx`) ; sur chaque carte de pôle et chaque bouton d'action indisponible.
- **Le gris.** Pas une opacité : `opacity: .5` casse le contraste du texte et échoue en AA. Un jeton dédié `--status-later`, bordure 1 px en tirets, fond neutre à 4 %, **et le mot écrit** (« Ensuite »). Jamais la couleur seule.
- **Le clic.** Pas une infobulle : un panneau latéral droit de 420 px, cinq sections dans un ordre fixe — *Ce que ça fera · Pour qui · Gratuit ou payant · Comment E-Dome gagne de l'argent dessus · Quand* — plus une sortie utile : « Voir ce qui existe déjà à la place ».
- **La légende permanente.** Fusionnée avec le bandeau « données fictives » de `src/components/layout/app-shell.tsx` (l.~130), qui fait aujourd'hui 10 px de texte : illisible pour la charge qu'il porte. Il passe à 32 px de hauteur, 12-13 px de texte, et contient la mention fictive, les trois pastilles de statut (cliquables : elles surlignent tout ce qui est de ce statut sur l'écran courant), le sélecteur de rôle sur mobile, et l'interrupteur du mode explicatif.

### Mode explicatif

- **Une annotation** = une puce numérotée de 18 px au coin haut-droit de l'élément, ouvrant une bulle de quatre lignes au plus : *quoi · qui · gratuit ou payant · revenu pour qui*. Jamais un paragraphe.
- **Sur quels éléments.** Plafond dur de **six puces par écran**, priorité à ce qui porte de l'argent ou un statut. Si un écran en demande plus, c'est l'écran qu'il faut découper.
- **Activation.** Interrupteur dans le bandeau permanent, à droite ; raccourci `e`.
- **Première visite.** Actif mais **replié** : les six puces sont visibles, aucune bulle ouverte — sauf **une seule**, sur l'élément le plus important, avec « 1 / 6 » et deux flèches. C'est là que la demande de la mission peut tout casser : six bulles ouvertes d'office rendent le premier écran illisible.
- **Textes** dans `src/content/annotations.ts`, clé `route:element`.

### Sélecteur de rôle

L'état existe (`src/lib/context.tsx`), `setActiveRole` est défini et **n'est appelé nulle part**. Correction à l'audit : ce ne sont pas huit fichiers qui le lisent mais **quatre** — `evenements/page.tsx` l.45, `explorer/[id]/page.tsx` l.118, `formations/page.tsx` l.87, `live/page.tsx` l.33. Les autres occurrences sont un champ `activeRole` porté par des objets de démonstration, sans lien avec le contexte. Le mécanisme est donc moins avancé que l'audit ne le suggère.

- **Où.** Dans le pied de `sidebar-whop.tsx`, à la place du bloc « Léo Martin · Démo » en dur : seul emplacement présent sur les 48 routes. Doublon dans le bandeau permanent pour le mobile, où la sidebar est masquée.
- **Ce qu'il change, exactement** — contrat à ne pas dépasser : (1) les entrées de navigation ; (2) la page d'accueil du rôle (particulier → `/feed`, agence → `/agence`, apporteur → `/apporteurs`) ; (3) le tableau de bord ; (4) l'action primaire sur une fiche ; (5) la ligne « vous » du panneau de flux d'argent. **Les données ne changent pas** : seul le point de vue.
- **Ne pas s'y perdre.** Le rôle actif est écrit en clair en permanence dans le pied de la sidebar ; au changement on atterrit sur la page d'accueil du rôle avec un bandeau d'un seul écran, « Vous voyez E-Dome comme une agence » + « Revenir à particulier » ; une seule liste, les onze rôles de B.5 dans l'ordre de B.5, chacun avec son statut (agence : au lancement ; annonceur : ensuite) ; jamais de bascule silencieuse.
- Corollaire : le jeu de rôles passe de 13 à 11 (`types.ts` l.3) et `DEFAULT_ROLE` de `client` à `particulier`.

### Panneau de flux d'argent

- **Une seule forme, partout** : un tableau de cinq lignes toujours dans le même ordre — *Ce que paie [le payeur] · Ce que reçoit [le vendeur, l'hôte, le créateur] · Ce que reçoit E-Dome · Ce que reçoit l'apporteur · Frais du prestataire de paiement*. Jamais un camembert : on doit pouvoir vérifier que la somme est juste, et un camembert ne se vérifie pas.
- Quand E-Dome ne touche rien, la ligne le dit en gras au lieu d'afficher zéro : « E-Dome ne touche rien sur cette vente. »
- **Où** : `/vendre` (replié) · `/publier` dernière étape (déployé) · `/explorer/[id]` widget de réservation (déployé) · `/paiement` (déployé) · fiches formation / événement / produit (replié) · `/apporteurs` (déployé) · abonnements agence et propriétaire (déployé) · `/vendre/accompagnement` (replié).
- **Règle de pliage, unique** : déployé quand l'utilisateur est sur le point de payer ou d'encaisser, replié ailleurs — **et déployé partout tant que le mode explicatif est actif**. Une règle, pas un réglage par écran.

---

## 4. La visite guidée

Sept étapes, environ quatre minutes, une étape = un écran + une phrase + une action. Elle pilote le sélecteur de rôle : c'est ce qui la rend démonstrative plutôt que narrative.

1. `/demo` — ce qu'est E-Dome, le code couleur (20 s)
2. `/vendre` — les deux routes et leur coût, en rôle particulier (40 s)
3. `/publier`, dernière étape — publication gratuite, flux d'argent (30 s)
4. `/explorer/[id]` — la réservation courte durée, seule commission liée à un logement (30 s)
5. bascule en rôle **agence** → `/agence` — l'Espace agence, la vraie source de revenu récurrent (60 s)
6. `/agence/demandes` — comment une demande d'accompagnement arrive (30 s)
7. `/apporteurs` — la règle unique de rémunération (30 s)

Pas de masque plein écran : un bandeau bas de 64 px, un halo sur l'élément visé, un compteur « 3 / 7 », sortie à chaque étape et reprise possible. Elle se construit **en dernier** : elle dépend des écrans qu'elle traverse, la faire avant c'est la refaire.

---

## 5. Q5 — distribuer les demandes d'accompagnement sans vendre de contact

**Principe : une agence ne reçoit jamais un contact. Elle voit une demande anonyme et elle y répond.** Ce n'est pas une nuance de vocabulaire, c'est l'inversion du sens de circulation : dans un marché de leads, la plateforme pousse une identité vers celui qui paie ; ici l'identité ne bouge que par un acte du particulier.

**Le mécanisme, en cinq temps**

1. Le particulier décrit son bien sur `/vendre/accompagnement`, choisit un rayon (commune / district / canton) et un nombre maximum de propositions — **trois par défaut, cinq au plus**.
2. La demande devient une **fiche anonyme** dans `/agence/demandes`, visible par **toutes** les agences vérifiées du rayon : type de bien, surface, fourchette de prix, commune, échéance. Ni nom, ni adresse exacte, ni téléphone, ni e-mail.
3. Les agences intéressées **postulent** — quatre champs imposés, pas un message libre : taux de commission proposé, ce qui est inclus, délai estimé, deux références vérifiables dans la commune. Le nombre de propositions ouvertes simultanément dépend de la formule d'abonnement : c'est la seule chose que l'abonnement change, et elle **limite un volume, jamais un accès**.
4. Le particulier compare sur `/vendre/accompagnement/propositions` : un tableau, une colonne par agence, les quatre mêmes champs. **Il ouvre le contact** en acceptant une proposition ; l'identité circule à cet instant, pas avant.
5. Moins de trois propositions en 72 h : le rayon s'élargit d'un cran automatiquement, et on le dit au particulier.

**Équité, et comment on la rend visible.** L'ordre des fiches dans `/agence/demandes` est **chronologique**, jamais fonction de l'abonnement. Aucune enchère, aucun paiement pour voir, aucun paiement pour postuler : ce qui départage, c'est la qualité de la réponse. Avant rédaction, un compteur honnête — « 4 agences ont déjà répondu · le propriétaire en retiendra 3 » — évite de rédiger dans le vide. Et une phrase permanente en tête de l'écran : « Ces demandes ne sont pas achetées. Elles sont ouvertes à toutes les agences vérifiées de la zone. Le propriétaire choisit qui il contacte. »

**Ce qu'il faut assumer.** Une agence peut payer son abonnement et ne gagner aucun mandat. Il faut le dire, sinon on vend des leads en le niant. Conséquence directe : la promesse de l'Espace agence n'est **jamais** « des demandes », c'est les outils et la page publique. Sur l'écran d'abonnement, la ligne « demandes d'accompagnement » figure donc **sans chiffre** — pas de « jusqu'à N demandes par mois ».

---

## 6. Q6 — quelle identité fait foi

**`src/lib/profile-data.ts`, `DEFAULT_PROFILE` (`id: "me"`, Lausanne).** Seule des cinq à être branchée sur le contexte (`context.tsx` l'importe comme état initial), persistée, éditable par `/onboarding` et `/parametres`, et lue par `/profil`. Les autres sont des copies d'affichage : `mock-data.ts` l.29-37 (`user-001`, Neuchâtel) est un doublon de catalogue ; `dashboard-data.ts` l.145 (`dashboardUser`) n'est qu'un nom et des initiales ; `feed/page.tsx` l.658 pose `CURRENT_USER_ID = "u1"` où `u1` est **Sophie Martin** (l.41) — un bug d'identité, pas une variante ; `messages/page.tsx` recrée ses participants en local (l.95 et suivantes).

Correction : `user-001` reste l'identifiant canonique et devient un alias dérivé de `DEFAULT_PROFILE` (le catalogue a besoin d'un `User`, pas d'un `Profile`) ; `dashboardUser` et le `u1` du feed disparaissent au profit d'un `getCurrentUser()` unique. Une seule ville : **Lausanne**.

**Qui doit être cet utilisateur : pas le fondateur.** Il est aujourd'hui « Fondateur & CEO · E-Dome » (`profile-data.ts`, expérience `exp-1`). Trois problèmes : chaque chiffre de son tableau de bord devient une affirmation sur E-Dome, ce que la Partie C interdit — la règle « les données d'un utilisateur sont normales » ne tient que si l'utilisateur n'est pas la plateforme ; un investisseur qui bascule en rôle agence voit le fondateur jouer l'agence ; c'est le seul profil pleinement rempli, donc E-Dome a l'air d'une plateforme à un utilisateur, son fondateur.

Recommandation : un **particulier de Lausanne, propriétaire de deux biens, cumulant trois rôles** — particulier-bailleur, hôte, apporteur. Ordinaire, crédible, sans lien avec E-Dome, nom manifestement fictif. C'est le profil du plus grand nombre, celui qui rend `/vendre` intelligible, et celui depuis lequel le sélecteur de rôle raconte quelque chose. Le fondateur, s'il apparaît, apparaît comme un profil **tiers** consultable.

---

## 7. Le critère des trente secondes

**Ce qu'on voit aujourd'hui.** Un clic sur « Explorer la démo » et l'on atterrit sur `/feed` (`landing.ts` l.353) : un fil social, déjà connecté sous le nom d'un inconnu, avec un bandeau de 10 px. En trente secondes on apprend qu'il existe un fil et que des gens y publient. **Aucune des trois questions du critère ultime n'a de réponse** : ni ce qu'est E-Dome, ni qui paie quoi, ni ce qui existe déjà.

**Recommandation : un écran d'entrée `/demo`**, destination de `demo.href` et du « En savoir plus » du bandeau. Trois blocs, une hauteur d'écran, sans défilement sur un téléphone :

1. **Une phrase et un plan.** « E-Dome est le réseau professionnel de l'immobilier, avec une couche transactionnelle. » Puis les sept pôles en pastilles portant leur statut. Première question réglée.
2. **Qui paie quoi, en quatre lignes.** Le particulier : rien. Le professionnel : un abonnement. Les marketplaces : une commission, payée par le vendeur. La vente et la location longue durée : E-Dome ne touche rien. C'est le tableau le plus important de la maquette. Deuxième question.
3. **Trois portes, pas six.** « Je veux vendre mon bien » → `/vendre` · « Je suis une agence » → bascule le rôle et ouvre `/agence` · « Faites-moi visiter » → visite guidée. Et en dessous, petit : « Entrer directement dans le fil ».

Plus la légende des trois statuts et l'interrupteur du mode explicatif, expliqués ici une fois pour toutes. Troisième question.

---

## 8. Au lancement, ou après (B.7)

- **Au lancement — Biens.** Ce qui attire les acheteurs, donc les investisseurs, donc les agences. Sans lui il n'y a rien.
- **Au lancement — Services et prestataires.** C'est la route « à la carte » et la première commission encaissable : un devis se règle en semaines, pas en mois comme une vente.
- **Au lancement — Apporteurs.** Moteur d'acquisition, et aucun catalogue à constituer : l'offre, c'est ce qui est déjà sur la plateforme. `/apporteurs` est d'ailleurs déjà la page la plus complète.
- **Hors liste mais au lancement — l'Espace agence.** Ce n'est pas un des sept pôles, c'est la principale source de revenu récurrent. Le repousser, c'est lancer sans revenu.
- **Ensuite — Formations, puis Événements.** Ils demandent un catalogue de créateurs qu'on n'a pas au départ, mais leur mécanique (un billet, une leçon, une commission) est celle des services : peu coûteuse une fois la première en place.
- **Vision — Lives.** Infrastructure temps réel (déjà amorcée via Jitsi, `src/components/jitsi-meet.tsx`) et aucune audience à diffuser tant que le réseau est vide. C'est la définition d'une vision.
- **Vision — Boutique, mais en affiliation seulement.** Stock, expédition, retours et TVA sur biens physiques : un métier entier pour quelques pour cent d'un panier moyen faible, le plus mauvais rapport travail / revenu des sept. En affiliation elle coûte presque rien et garde le pôle crédible.

**Les mécanismes**, dans l'ordre où je les construirais : (1) identité unique + onze rôles + sélecteur — sans point de vue stable tout le reste est bancal ; (2) `/demo`, bandeau-légende, statuts portés par la donnée ; (3) `/vendre`, `/publier` corrigé, flux d'argent sur quatre écrans ; (4) `/agence` et ses sous-écrans ; (5) mode explicatif ; (6) visite guidée, en dernier.

---

## 9. Désaccords attendus

**Marketing — il segmentera là où je simplifie.** La landing porte déjà six profils (`landing.ts`, « Six façons d'utiliser E-Dome ») et il voudra les retrouver à l'entrée de la maquette, plus trois cartes symétriques sur `/vendre`. Je ne cède pas sur deux points : `/demo` a **trois** portes, pas six — au-delà de trois on ne choisit plus, on lit ; et `/vendre` reste en 2 + 1, parce qu'« à la carte » n'exclut pas les autres routes. **Ce qu'on perd :** un message taillé par segment dès l'entrée, donc probablement de la conversion, et l'impossibilité de dire à un créateur « cette page est pour vous » au premier écran. Concession : la landing garde ses six profils intacts.

**Juridique — il voudra des mentions qui alourdissent.** Formule officielle du loyer initial, trois niveaux de vérification avec ce que chaque badge ne garantit pas, Lex Koller, numéro d'enregistrement courte durée, nLPD. Je ne conteste pas le fond, je conteste la **place** : trois emplacements autorisés, pas quatre — une phrase au point exact de décision juste au-dessus du bouton ; le panneau de flux d'argent, déjà l'endroit où l'on lit des règles ; un lien nommé vers `/conditions`. Aucun bloc d'avertissement en tête de parcours. **Ce qu'on perd :** une mention lue par moins de monde qu'un encadré, et un risque résiduel si la version courte est jugée insuffisante. Je cède entièrement sur un cas : la formule officielle du loyer initial s'affiche dans le corps de l'écran de publication en location longue durée — obligation cantonale, pas avertissement.

**Comptable — il voudra plusieurs formules.** Probablement trois paliers d'Espace agence et deux d'abonnement Propriétaire. Je ne vais pas au-delà de **deux** formules d'Espace agence (agent indépendant / agence avec équipe) et **une** d'abonnement Propriétaire. Raison : la page de tarifs est un des écrans qu'un investisseur lira en entier, et la Partie C y impose une colonne de statut ; deux formules × deux statuts font déjà quatre choses à comparer, et à trois formules la grille devient illisible. **Ce qu'on perd :** du revenu sur le haut du marché et la possibilité de tester l'élasticité du prix. Compromis accepté : un troisième palier existe, en statut « Ensuite », donc gris et hors comparaison.

**Architecture.** Je demande un `status` porté par la **donnée** sur chaque entrée de navigation et chaque carte de pôle, plus un `getCurrentUser()` unique. Cela touche presque toutes les routes et je ne le négocie pas : sans statut dans la donnée, la légende permanente ne tient pas et le gris redevient une décision de composant, prise 48 fois différemment.

---

## 10. Ce qui rendra la maquette illisible si on l'accepte

La demande la plus dangereuse : « une fonctionnalité future reste visible et cliquable », combinée à « montrer toute la plateforme, y compris ce qui viendra après ». Mal réalisée, elle produit un écran où la moitié des éléments est grise et où chaque clic ouvre une explication au lieu d'un écran. Le visiteur apprend en une minute à ne plus cliquer, et la maquette cesse d'être une maquette : elle devient un catalogue annoté.

L'effet secondaire est pire que l'effet principal. Si tout ce qui manque peut être représenté par un carré gris cliquable qui explique ce qu'il fera, il devient tentant de « livrer » ainsi l'Espace agence — qui n'existe pas, qui est le plus coûteux à construire, et qui est la principale source de revenu. Une maquette où l'Espace agence est un carré gris ne démontre pas le modèle économique : elle le décrit.

Quatre garde-fous, sans exception :

1. **Plafond dur** : jamais plus d'un quart des éléments d'un écran en statut gris. Au-delà, c'est l'écran entier qui est marqué « Ensuite », et on n'en dessine qu'un, représentatif.
2. **L'Espace agence se construit pour de vrai, au lancement**, même s'il est le plus cher. Pas de gris sur la source de revenu.
3. **Un seul composant d'explication**, identique partout, qui ne remplace jamais un écran qui aurait dû exister.
4. **Tout élément gris a un voisin non gris** qui fait aujourd'hui quelque chose de proche — c'est le rôle du bouton « Voir ce qui existe déjà à la place ».

Seconde demande à surveiller, de la même famille : le mode explicatif actif par défaut à la première visite. Six bulles ouvertes d'office sur le premier écran, et personne ne lit la septième ligne. D'où la règle de §3 : actif, mais replié, avec une seule bulle ouverte et un compteur.
