# Comptable — le nouveau modèle d'affiliation et le virage freemium

*Lecture seule. Sources : `src/lib/pricing/catalog.ts`, `quote.ts`, `charge.ts`,
`legacy.ts`, `src/lib/demo/ledger.ts`, `DECISIONS.md` (§1, §7, §8),
`JURIDIQUE-A-VALIDER.md` (§4), `AUDIT-2.md`, `DECISIONS-2.md`,
`analyse2/comptable.md` (ma propre note Mission 2). Aucun fichier de code
modifié.*

---

## Résumé de méthode

Le fondateur demande de challenger trois mécaniques et un virage freemium. Je
les traite dans l'ordre des questions A à G, puis je referme sur un
récapitulatif chiffré. Deux faits du dépôt encadrent tout le reste et je les
pose d'emblée parce qu'ils changent la lecture de plusieurs réponses :

1. **La prime « biens » n'est pas une idée neuve dans ses risques : c'est le
   courtage d'indication, déjà nommé et non tranché.**
   `JURIDIQUE-A-VALIDER.md` §4 : *« un apporteur rémunéré pour avoir amené un
   vendeur à une agence est lui-même courtier (courtage d'indication). Le
   risque pour E-Dome n'est pas d'être courtière : c'est d'organiser et
   d'outiller du courtage et d'en percevoir une part. »* La position de
   travail existante (prime fixe, versée après un fait objectif et vérifiable,
   Suisse ouverte avec avertissement Tessin, France/UAE fermés à l'apport
   immobilier) est compatible avec ce que le fondateur propose — mais elle est
   listée **« à valider »**, pas validée. Tous mes chiffres pour la mécanique 1
   (A, B, C) sont donc conditionnels à cette validation ; c'est le plus gros
   risque binaire du dossier, plus gros que n'importe quel taux.

2. **Le label « 10 à 30 % » existe déjà dans le code, et il est faux
   aujourd'hui.** `catalog.ts:128`, `APPORTEUR_SHARE_LABEL = "10 à 30 %"`,
   encore importé et affiché en direct sur cinq écrans
   (`referral-links.ts`, `market-pulse.tsx`, `explorer/[id]/page.tsx`) alors
   que les taux réellement appliqués par `quote()` sont 25 % (abonnement),
   15 % (commission) et 15 % (forfait) — voir §G. La question G du fondateur
   n'introduit donc pas un nouveau chiffre : elle demande si un chiffre déjà
   affiché doit devenir réel.

---

## A. La prime biens — 15 % + plancher 3 CHF

**Verdict : 15 % n'est pas défendable comme il est écrit ; je recommande
12 %, plancher 3 CHF inchangé, plus un garde-fou de plafonnement que le
modèle actuel n'a pas.**

**Pourquoi pas 15 %.** Dans tout le catalogue actuel, aucun pôle ne dépasse
12 % (`location-ct`), et 12 % est déjà défendu dans `DECISIONS.md` §1.3 par
la comparaison « 23 % moins cher que le seul modèle réellement en vigueur »
(Airbnb 15,5 %). La prime biens n'est pas un service plus lourd que
l'hébergement courte durée — c'est l'inverse : E-Dome n'y organise ni
réservation ni calendrier ni support litige, seulement l'encaissement d'une
somme entre deux parties après un événement déclaré (l'acceptation). Faire de
ce pôle le taux le plus élevé du catalogue, sur le pôle qui porte le plus
grand risque juridique (§4 JURIDIQUE), inverse la hiérarchie du risque : c'est
précisément le pôle où E-Dome devrait vouloir être la moins gourmande, pas la
plus.

**Comparables vérifiés :**

| Comparable | Taux | Nature |
| --- | --- | --- |
| Airbnb (hôte) | 15,5 % | Location, service complet (calendrier, litiges) |
| **`location-ct` E-Dome** | **12 %** | Déjà défendu dans ce dépôt |
| TaskRabbit | ~15–22 % | Marketplace de service exécuté |
| Fiverr | 20 % | Marketplace de service exécuté |
| Upwork | ~10 % (barème dégressif) | Marketplace de mise en relation freelance |
| Coût réel PSP (`PSP.rate`+`PSP.fixed`) | 3,15 % + 0,30 CHF | Coût plancher incompressible |

Upwork est le comparable le plus proche dans sa nature (mise en relation,
sans exécution de la prestation par la plateforme) et se situe à 10 %.
E-Dome n'assume même pas la gestion de la relation ensuite (elle s'arrête à
l'acceptation). **12 %** reste un compromis narrativement cohérent — même
chiffre que le pôle déjà défendu du dépôt — et laisse un vrai écart avec les
15,5 % d'Airbnb.

**Le plancher 3 CHF est correct et n'a pas besoin d'une nouvelle
justification** : c'est `MIN_COMMISSION` (`catalog.ts:74`), déjà motivé par
le coût réel du PSP sous ~25 CHF de panier. Le garder évite d'introduire une
deuxième règle de plancher dans le même catalogue.

**Ce que l'exemple du fondateur ne montre pas : le PSP.** « Prime 100 →
vendeur paie 100, apporteur 85, E-Dome 15 » ignore la ligne `psp`, qui existe
dans tout le reste du moteur et que `assertFlowBalances` (`quote.ts:330`)
imposerait de toute façon. En position de travail actuelle
(`PSP.bornBy: "seller"`, §6.1 DECISIONS.md), c'est le bénéficiaire — donc
l'apporteur — qui absorbe les frais de paiement, exactement comme pour tout
autre pôle de commission. Calcul réel à 12 % sur une prime de 100 CHF :

- E-Dome : 12,00 CHF (net, le plancher de 3 ne joue pas ici)
- PSP : 3,45 CHF (3,15 % + 0,30, à la charge de l'apporteur)
- **Apporteur : 84,55 CHF, pas 85.**

À 15 % comme écrit dans le brief, l'apporteur ne recevrait que **81,55 CHF**,
pas 85. L'écart (3,45 CHF) est petit en valeur absolue mais gros en principe :
c'est exactement le genre d'écart entre « ce qu'on annonce » et « ce que
calcule le moteur » que la Mission 1 a été payée pour éliminer, et que
`AUDIT-2.md` Thème 4 vient de retrouver en vivant (facteur ×50 sur l'écran
apporteurs). **Toute maquette de cette mécanique doit passer par `quote()` et
afficher le nombre qu'il calcule, jamais l'arithmétique simplifiée du brief.**

---

## B. Le minimum pratique — le chiffre demandé explicitement

**Verdict : 50 CHF de prime minimale, imposée par la plateforme (pas
seulement suggérée). Plancher technique absolu à ne jamais descendre en
dessous : 35 CHF.**

**Raisonnement.** Ce qu'un apporteur doit produire pour une « mise en
relation acceptée » en Suisse : identifier un acheteur réellement qualifié,
rédiger et envoyer l'introduction, coordonner l'acceptation — de l'ordre de
30 à 60 minutes d'effort, plus, si la mise en relation implique un
déplacement local (accompagnement, remise de clés, visite), 10 à 20 CHF de
frais réels. En valorisant le temps à un taux de référence bas (salaire
minimum romand, ~21–23 CHF/heure là où il existe), le seuil sous lequel
personne d'un tant soit peu sérieux ne se déplace se situe autour de
**30 à 50 CHF de NET**, pas de brut.

**Ce que ça implique pour la prime affichée**, à 12 % + plancher 3 CHF :

| Prime | E-Dome | PSP | Net apporteur | Lecture |
| --- | --- | --- | --- | --- |
| 1 CHF | 3,00 CHF (plancher) | 0,33 CHF | **–2,33 CHF** | **Impossible** — le plancher dépasse la prime elle-même |
| 20 CHF | 3,00 CHF (plancher) | 0,93 CHF | 16,07 CHF | Net dérisoire, personne ne se déplace |
| 35 CHF | 4,20 CHF | 1,40 CHF | 29,40 CHF | Plancher technique absolu |
| **50 CHF** | 6,00 CHF | 1,88 CHF | **42,12 CHF** | **Minimum pratique recommandé** |
| 100 CHF | 12,00 CHF | 3,45 CHF | 84,55 CHF | Confortable |

La ligne à 1 CHF n'est pas seulement « peu réaliste » — elle est
**mathématiquement cassée** : le plancher de 3 CHF, conçu pour un panier
d'au moins ~25 CHF, dépasse la prime elle-même et produirait un net apporteur
négatif. C'est un bug économique avant d'être un problème de générosité, et
c'est l'argument le plus fort pour répondre aussi à la question C.

---

## C. La plage 1–10 000 CHF — bornes réalistes ?

**Verdict : non. Je recommande [50 CHF – 3 000 CHF], pas [1 – 10 000].**

**Le plancher.** Voir B : 1 CHF casse le calcul lui-même. Même à 20-30 CHF, le
net apporteur est trop faible pour motiver un déplacement réel. **Plancher
recommandé : 50 CHF**, imposé par la plateforme (comme `ONE_OFFS` impose déjà
« jamais sous 25 CHF » aux forfaits ponctuels, `catalog.ts:257-259` — même
logique, seuil un cran plus haut parce que la prime biens demande plus
d'effort qu'un forfait numérique).

**Le plafond — c'est le point le plus risqué de la question C.** Un plafond
à 10 000 CHF n'est pas neutre : rapporté au prix d'un bien suisse courant, il
se comporte comme une commission déguisée.

| Prix du bien | Prime à 10 000 CHF, en % du prix | Comparable |
| --- | --- | --- |
| 500 000 CHF | **2,0 %** | Dans la fourchette courante d'une commission d'agence (2–3 %) |
| 800 000 CHF | 1,25 % | Toujours dans la zone perceptible comme un courtage |
| 1 200 000 CHF | 0,83 % | En bordure basse |

Le risque n'est pas seulement de perception isolée : c'est que, **si les
primes choisies par les vendeurs se mettent statistiquement à graviter autour
d'un même pourcentage du prix du bien** (ce qui est le comportement humain
attendu — les gens raisonnent en %, même sur un champ libre en CHF), la
plateforme finit par produire, dans les faits, exactement le motif que la
règle 3 reformulée (`DECISIONS.md` §1.1) interdit : un prix dont
l'**exigibilité** reste hors cause, mais dont le **montant** se comporte comme
un pourcentage de la valeur du bien. Ce n'est pas une violation littérale de
la règle telle qu'écrite (la règle porte sur la conclusion de la vente, pas
sur le montant du bien), mais c'est le type d'apparence que ce dépôt a déjà
traité comme disqualifiant ailleurs — le rôle « courtier » a été retiré des
profils uniquement parce que *« l'apparence suffit à nourrir un litige »*
(`DECISIONS.md` §3.1). Le même principe de prudence s'applique ici. C'est
aussi, très concrètement, le retour du motif qui a fait abandonner le barème
500/2 500 CHF indexé sur le seuil de prix (`pricing/legacy.ts:33-40`,
« modèle que la mission ABANDONNE ») — un plafond de 10 000 CHF sur des biens
de valeur moyenne romande reproduit la même mécanique en plus souple.

**Plafond recommandé : 3 000 CHF.** Sur les mêmes biens : 0,6 % à 500 000 CHF,
0,25 % à 1,2 M — nettement en dessous du bruit d'une commission
proportionnelle, tout en restant significatif pour un bien de gamme
supérieure. Garde-fou produit à ajouter, indépendant du taux : **ne jamais
suggérer ou pré-calculer la prime à partir du prix affiché du bien** — champ
libre uniquement, pour qu'aucun outil de la plateforme elle-même ne crée le
pattern proportionnel qu'on cherche à éviter.

---

## D. Les fourchettes marketplace (Whop) — cohérentes ?

**Verdict : directionnellement bonnes, avec deux clarifications
nécessaires avant chiffrage final.**

Les fourchettes (formations/lives 20-50 %, événements 10-25 %, services
5-15 %, courte durée 3-10 %) sont plausibles par comparaison : les produits
numériques à marge quasi nulle supportent des taux d'affiliation élevés dans
toute l'industrie (Gumroad, ClickBank vont au-delà de 50 % sur l'info-produit)
; les services et l'hébergement, à marge réelle et coûts opérationnels, sont
à raison nettement plus bas. L'ordre relatif (formation > événement >
service > courte durée) est le bon.

**Deux points à trancher avant d'écrire le code, sans quoi la promesse « il
voit son net » se casse comme au point A :**

1. **L'assiette du taux affilié.** Le brief dit « sortant de SA marge » —
   mais marge calculée comment ? Si le taux s'applique au prix brut payé par
   le client (comme Whop/Gumroad le font réellement), l'affichage est trivial
   : `net apporteur = prix × taux vendeur`, indépendant de la commission
   E-Dome. Si au contraire il s'applique au **net du vendeur après commission
   E-Dome**, il faut un calcul en cascade (prix → commission E-Dome → base →
   taux affilié) que rien dans `quote.ts` ne fait aujourd'hui pour un
   troisième acteur. Je recommande la première option : assiette = prix
   brut, exactement le patron déjà utilisé pour la prime biens (§A) et pour
   les taux `PLATFORM_SOURCED_RATE`/`SELLER_SOURCED_RATE` existants.
2. **Ne pas laisser le taux se négocier au cas par cas.** Le principe
   juridique déjà posé pour l'ensemble du catalogue — « prix identiques pour
   tous les utilisateurs d'une même formule », condition juridique et non
   commodité (`DECISIONS.md` §1.3) — doit s'étendre ici : le vendeur choisit
   un taux **dans** la fourchette publiée, jamais en dehors, via un
   contrôle borné dans l'interface (pas un champ libre en %). Sinon un
   vendeur pourrait afficher 90 % en façade puis négocier autre chose en
   coulisse, ce que le reste du modèle interdit explicitement partout
   ailleurs.

**Un point positif à préserver tel quel :** la commission E-Dome reste
inchangée quel que soit le taux affilié choisi par le vendeur — contrairement
à Upwork/Fiverr, qui parfois partagent le coût d'acquisition avec le
prestataire, E-Dome ne dilue jamais sa propre marge pour financer
l'acquisition d'un vendeur. C'est une bonne discipline, à garder explicite
dans la doc du futur `charge.ts`.

---

## E. « E-Dome prélève à l'intérieur » — cohérence avec `quote.ts`/`MoneyFlow`

**Verdict : la mécanique tient dans l'architecture existante sans nouveau
`Charge.kind` — à condition de la brancher sur `quoteCommission`, pas d'écrire
un calcul séparé.**

`quoteCommission` (`quote.ts:160-218`) fait déjà, pour n'importe quel pôle,
exactement ce que demande le fondateur : `gross` payé par une partie →
`edomeGross` (taux + plancher) prélevé **à l'intérieur** → `psp` séparé →
`beneficiary = gross - edomeGross - psp` (frais directs). C'est la mécanique
« commission », pas « bounty » ni « forfait » : la prime biens n'est pas un
coût qu'E-Dome avance (contrairement à `BOUNTIES`, payées par `admin` sur son
propre budget), c'est un flux financé par le vendeur dont E-Dome prélève une
part — architecture identique à un pôle marketplace ordinaire, seul le
**bénéficiaire** change de nom : « apporteur » au lieu de « vendeur/hôte/
créateur/organisateur ».

**Changements concrets recommandés, en restant dans le patron existant :**

1. **Un nouveau `CommissionPole`**, par exemple `"biens-prime"`, distinct de
   `"vente"`/`"location-lt"` qui restent exclus. La distinction à documenter
   dans le commentaire du type (`charge.ts:30-36`) : le pôle exclu est celui
   dont le **montant est calculé comme un pourcentage du prix de vente** ;
   `"biens-prime"` est un montant choisi librement par le vendeur, borné
   `[50, 3000]` CHF (§C), jamais dérivé du prix. La distinction doit rester
   dans le type, pas seulement dans un commentaire — c'est précisément ce qui
   a rendu `"vente"` sûre à exclure la première fois.
2. **`RATES["biens-prime"] = { min: 0.12, max: 0.12 }`** (§A), et un garde-fou
   que le modèle actuel n'a nulle part : **la commission ne doit jamais
   dépasser un pourcentage de la prime elle-même** (par exemple 50 %), pour
   que le plancher de 3 CHF ne puisse plus produire un bénéficiaire négatif
   comme démontré en B. C'est un test à ajouter aux invariants (`invariants.ts`)
   si ce pôle est implémenté.
3. **`MoneyFlow.beneficiary`** (`quote.ts:47-48`) : élargir le commentaire
   (« Vendeur, hôte, créateur, organisateur ») pour couvrir explicitement
   l'apporteur sur ce pôle — sinon un futur lecteur du type ne saura pas que
   ce champ porte aussi une rémunération d'apporteur.
4. **Le déclencheur « mise en relation acceptée »** doit être un événement
   objectif, horodaté et vérifiable, affiché **avant** que l'apporteur
   s'engage — c'est la condition posée par `JURIDIQUE-A-VALIDER.md` §4 pour
   toute prime fixe du programme apporteurs, pas une option produit.
5. **Ne pas faire passer `ctx.hasApporteur`** sur ce pôle : ce champ sert
   aujourd'hui à rémunérer un *second* apporteur (celui qui a amené le
   vendeur/créateur sur la plateforme) ; sur la prime biens, l'apporteur
   **est** déjà le bénéficiaire de la transaction. Le faire quand même
   créerait une rémunération à deux étages sur un seul événement, contraire à
   `referralDepth ≤ 1` (`DECISIONS.md` §1.7).

Fait ainsi, `assertFlowBalances` (`quote.ts:330-343`) protège cette nouvelle
mécanique gratuitement, exactement comme les autres pôles — c'est l'argument
le plus fort pour ne **pas** écrire un calcul dédié dans un composant, ce qui
est la cause directe du facteur ×50 relevé par `AUDIT-2.md` sur l'écran
apporteurs actuel.

---

## F. Freemium & viabilité — le risque numéro un revisité

**Verdict : le calcul de funnel ne boucle pas dans le marché adressable
suisse tel qu'il est documenté dans ce dépôt. Le freemium ne doit pas toucher
les quatre verrous qui financent aujourd'hui la formule Vitrine.**

### Le calcul qui manque

`DECISIONS.md` §1.4 fixe l'objectif à **161 agences payantes** (barème
Mandats) pour couvrir 45 000 CHF/mois de charges, sur un marché total de
**~3 500 agences suisses**, et §8 affirme sans ambiguïté que l'abonnement
agence est, pendant 24 à 36 mois, **la seule** source de revenu récurrent. Le
freemium ne change rien à ce dénominateur — il change seulement le taux de
conversion visé et le nombre de comptes gratuits nécessaires pour l'atteindre.

| Conversion gratuit → payant (repère SaaS B2B) | Comptes gratuits nécessaires pour 161 payeurs | % du marché suisse total (~3 500) |
| --- | --- | --- |
| 20 % (excellent, PLG rare) | 805 | 23 % |
| 10 % (optimiste pour un produit non prouvé) | 1 610 | **46 %** |
| 5 % (bon, benchmark SaaS courant) | 3 220 | **92 %** |
| 3 % (typique B2B freemium) | 5 367 | **> 100 % — dépasse le marché total** |

Aucune de ces lignes n'est un scénario confortable. Même l'hypothèse la plus
généreuse (20 %, rarement atteinte hors produits grand public à effet de
réseau déjà installé) suppose que près d'un quart de **toutes** les agences
suisses ouvrent un compte Présence. Le §8 dit explicitement que la demande
manquante — pas le prix — est le risque numéro un, et qu'*« aucun prix ne
l'achète »* : rendre le produit gratuit ne répare pas ce risque, il en
déplace juste l'affichage vers un taux de conversion qui n'est mesuré nulle
part dans le dossier. **Ce chiffre — la conversion visée — est la donnée
manquante la plus importante avant de trancher le freemium**, et je
recommande de l'exiger avant tout élargissement du palier gratuit.

### Où mettre la limite, par rôle

- **Particuliers (vendeur, bailleur ponctuel, locataire, voyageur).** Rester
  gratuit sans condition — c'est déjà la promesse verrouillée par le
  marketing (`DECISIONS.md` §7.2 : *« si une option payante touche un jour la
  publication d'un particulier, nous briserons une phrase écrite en gros
  caractères »*). Aucun risque de cannibalisation : ces profils n'ont jamais
  été des cibles d'abonnement dans ce modèle. Effet même plutôt positif —
  plus d'annonces particulier = plus de volume pour les mécaniques 1 et 2.
- **Bailleur multipropriétaire.** Patrimoine à 19 CHF reste la bonne coupure
  (outils de portefeuille, pas la publication elle-même) — ne touche à rien
  ici, risque de cannibalisation faible : c'est un usage différent (gestion),
  pas concurrent du palier Présence.
- **Agent indépendant.** N'a pas de palier propre — il hérite du plan de son
  agence (`RoleGrant` scope `agency`). Rien à trancher séparément.
- **Agence — le point qui compte.** **Ne pas élargir le plafond de 3 biens de
  Présence.** La statistique déjà citée dans ce dépôt travaille contre
  l'élargissement : *« 42 % des agences suisses ont au plus cinq biens »*
  (`DECISIONS.md` §1.4). Un plafond gratuit remonté à 5 laisserait quasiment
  la moitié du marché adressable ne jamais avoir besoin de payer — l'inverse
  exact de ce que la statistique a servi à démontrer la première fois.
  **Plus important encore : ne jamais rendre gratuits les quatre éléments qui
  justifient aujourd'hui Vitrine** — `demandes-accompagnement`,
  `mise-en-avant`, `badge-verifie`, `statistiques` (`catalog.ts:183-190`). Une
  agence à trois biens qui liste et messagerie déjà gratuitement n'a, dans le
  catalogue actuel, plus **aucune** raison de payer 89 CHF si l'une de ces
  quatre lignes devient gratuite. C'est très exactement l'application du
  principe du fondateur — *« la bonne limite gêne quand on réussit »* —
  déjà en place dans `PLANS` : une agence peut publier et être trouvée
  gratuitement, mais la **demande** (le flux de leads) reste payante. Le
  freemium que le fondateur décrit est largement déjà construit ; le risque
  est de le défaire en croyant l'étendre.

### Verdict cannibalisation

Le risque de cannibaliser 89/290/690 n'est pas dans le principe freemium — il
est dans **un seul geste précis** : donner gratuitement l'accès aux demandes
d'accompagnement, à la mise en avant, au badge ou aux statistiques. Tant que
ces quatre lignes restent payantes et que le plafond de biens gratuits ne
remonte pas au-dessus de 3-4, le virage freemium peut s'annoncer sans
réécrire l'économie du modèle. S'il les touche, il faut alors revoir tout le
calcul du §1.4 — pas seulement l'ajuster.

---

## G. Abonnement apporteur — 10 à 30 % sur 12 mois

**Verdict : cohérent avec l'existant, à condition de cesser d'être un simple
libellé et de devenir un vrai barème.**

**Ce chiffre est déjà dans le code, et il ne correspond à rien de réel
aujourd'hui.** `APPORTEUR_SHARE_LABEL = "10 à 30 %"` (`catalog.ts:128`) est
affiché en direct sur cinq écrans (`referral-links.ts:31,41,83,89,95,101`,
`market-pulse.tsx:180`, `explorer/[id]/page.tsx:980`) alors que les taux
réellement calculés par `quote()` via `APPORTEUR_SHARES` sont **25 %**
(abonnement), **15 %** (commission) et **15 %** (forfait) —
`catalog.ts:110-117`. Aucun de ces trois nombres n'est cohérent avec une
fourchette « 10 à 30 % » présentée comme homogène ; c'est un texte hérité de
`legacy.ts:50` (`APPORTEUR_SHARE: Rate = { min: 0.1, max: 0.3 }`), jamais mis
à jour, qui contamine même des écrans qui citent encore le barème
500/2 500 CHF aboli (`referral-links.ts:41`).

**Le 25 % actuel est vérifié et sain.** Recalcul indépendant du CAC cité en
`DECISIONS.md` §1.7 (« 842 CHF ») sur la formule Mandats (290 CHF/mois) :
290 × 12 = 3 480 CHF brut annuel, moins ~113 CHF de PSP cumulés sur douze
prélèvements, net ≈ 3 367 CHF, × 25 % = **841,7 CHF** — le chiffre retombe
exactement sur celui du document. C'est une bonne nouvelle : le mécanisme
existant est correctement chiffré, ce n'est que son affichage générique qui
ment.

**Recommandation pour une vraie fourchette 10-30 % :** ne pas la transformer
en champ négociable apporteur par apporteur — ce serait contraire au principe
« prix identiques pour tous les utilisateurs d'une même formule »
(`DECISIONS.md` §1.3). La faire varier **par formule**, publiée et non
négociée :

| Cible | Taux recommandé | CAC résultant (12 mois) | % de la LTV (~10 100 CHF) |
| --- | --- | --- | --- |
| Patrimoine (19 CHF/mois) | 15 % | ~29 CHF | négligeable |
| Vitrine (89 CHF/mois) | 25 % (inchangé) | ~257 CHF | ~2,5 % |
| Mandats (290 CHF/mois) | 25 % (inchangé) | ~842 CHF (vérifié) | ~8,3 % |
| Régie (690 CHF/mois) | 30 % | ~2 350 CHF | ~23 %, à revalider avec la vraie LTV Régie |

**Ne pas descendre sous 15 %** pour aucune formule payante : le seul point de
comparaison chiffré du dépôt (25 % sur Mandats) a déjà été jugé le bon
équilibre par le fondateur ; un taux à 10 % en dessous de ce qui est déjà
validé risque de sous-inciter le parrainage sans gain de CAC significatif
(336 CHF contre 842 CHF, sur un poste qui ne pèse de toute façon que ~2 % de
la valeur vie estimée à trois ans). Garder le plafond de 12 mois
(`APPORTEUR_WINDOW_MONTHS`) tel quel — c'est ce qui évite la rente perpétuelle,
et rien dans la demande du fondateur n'y touche.

---

## Récapitulatif chiffré

| Paramètre | Brief du fondateur | Recommandation | Écart |
| --- | --- | --- | --- |
| Taux E-Dome sur prime biens | 15 % | **12 %** | –3 pts |
| Plancher commission | 3 CHF | 3 CHF (inchangé) | — |
| Plancher de la prime elle-même | 1 CHF (implicite) | **50 CHF** (technique absolu 35 CHF) | +49 CHF |
| Plafond de la prime | 10 000 CHF | **3 000 CHF** | –7 000 CHF |
| Fourchettes marketplace | 20-50 / 10-25 / 5-15 / 3-10 % | Conservées, assiette = prix brut à clarifier | — |
| Apporteur abonnement | 10-30 % générique | 15-30 % **par formule**, 25 % inchangé sur Vitrine/Mandats | Barème réel au lieu d'un libellé |
| Palier gratuit agence (biens) | à élargir (implicite) | **Ne pas élargir**, rester à 3 | — |
| Demandes-accompagnement / mise-en-avant / badge / stats | — | **Rester payantes sans exception** | — |

---

*Désaccords chiffrés avec le brief : A (15 %→12 %), B/C (plancher 1→50 CHF,
plafond 10 000→3 000 CHF), F (le freemium tel que décrit ne boucle pas
mathématiquement dans le marché suisse documenté sans une conversion jamais
observée à cette échelle pour ce type de produit).*
