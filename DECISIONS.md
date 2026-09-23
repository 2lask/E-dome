# DECISIONS — arbitrages du CEO

Six agents ont rendu leur note dans `analyse/`. Ce document tranche. Chaque
décision porte les options envisagées, la raison du choix, et ce qu'on perd.

> **Révision 2** — après relecture du fondateur. Cinq changements :
> une **réserve fondée sur D1** (les règles 1 et 2 avaient disparu du document,
> §1.0) · les **taux de créateurs ramenés à 10 %** et le motif iOS écarté pour
> le lancement, avec un tarif fondateur et une révision datée (§1.3) ·
> l'arbitrage **frais directs / frais destinataires retiré** et rendu à
> l'avocat, règle 4 reformulée exactement (§6.1) · **`investisseur` conservé
> comme centre d'intérêt** (§3.1) · l'**art. 20a LTVA** promu motif principal de
> la boutique en affiliation (§1.8).

Les désaccords sont au §7. Ils sont réels : les agents juridique et comptable
se sont opposés sur la plus grosse source de revenu imaginable, et l'agent
juridique a démontré que la règle 3 — présentée comme inviolable — est mal
formulée.

---

## 0. Les six décisions qui modifient la Partie B

Ces six-là ne sont pas des choix d'exécution : elles changent des prémisses du
cahier des charges. Elles méritent votre lecture avant les autres.

| # | Ce que dit la Partie B | Ce que je décide | Où |
| --- | --- | --- | --- |
| **D1** | Règle 3 : « jamais un pourcentage sur la vente ou la location longue durée » | **Reformulée** : jamais une rémunération dont le montant **ou l'exigibilité** dépend de la conclusion d'une vente ou d'un bail | §1.1 |
| **D2** | §5 des CGU : revenue share B2B ~10 à 15 % de la commission de l'agence | **Supprimé sans remplacement** | §1.2 |
| **D3** | Taux indicatifs : 8 / 7 / 6 / 10 / 10 / 6 % | **Révisés** : 12 / 10-5 / 5 %+1 CHF / **10** / **10-5** / 0 %, plus un tarif fondateur créateur | §1.3 |
| **D4** | Espace agence : « une formule ou plusieurs ? » | **Quatre paliers, dont trois au lancement** | §1.4 |
| **D5** | Abonnement Propriétaire : particulier, ~10 CHF | **Bailleur, 19 CHF, renommé Patrimoine** | §1.5 |
| **D6** | Onze rôles, dont `investisseur` ; `courtier` dans le code | **Onze rôles sans `investisseur` ni `courtier`** ; les métiers sortent des rôles, `investisseur` devient un **centre d'intérêt** | §3.1 |

---

## 1. Le modèle économique

### 1.0 Les quatre règles, et leur rang

**Correction apportée après relecture du fondateur.** La première version de ce
document consacrait une section entière à la règle 3 et **ne mentionnait nulle
part les règles 1 et 2**. En pratique, la règle 3 reformulée absorbait toute la
protection — ce qui est une erreur de raisonnement, et la même que celle
reprochée à B.2.

La reformulation de D1 porte sur la **rémunération** : son montant, son
exigibilité. C'est le versant de l'art. 413 CO. Mais l'art. 412 CO définit le
courtage par l'**activité** — indiquer une occasion de conclure, ou servir
d'intermédiaire pour la négociation. **Un forfait non conditionné versé à
quelqu'un qui sert d'intermédiaire reste du courtage.** La règle 3, seule, ne
protège donc de rien.

Ce qui porte le critère de l'activité, ce sont les règles 1 et 2. Elles ne sont
pas des corollaires de la règle 3 : elles sont l'autre moitié du dispositif, et
la moitié la plus déterminante.

| Règle | Ce qu'elle interdit | Article | Rang |
| --- | --- | --- | --- |
| **1. Aucun mandat** | Agir **pour le compte** d'une partie | art. 412 CO — l'activité | Égal |
| **2. Aucune négociation** | Servir d'**intermédiaire** dans la négociation, indiquer une occasion de conclure | art. 412 CO — l'activité | Égal |
| **3. Aucune rémunération conditionnée** | Un prix dont le montant ou l'exigibilité dépend de la conclusion | art. 413 CO — le salaire | Égal |
| **4. Jamais dépositaire des fonds** | Détenir les fonds des utilisateurs | hors courtage — voir §6.1 | Égal |

**Conséquence tenue dans tout le chantier.** Les quatre règles apparaissent
**ensemble**, dans cet ordre, partout où l'une d'elles apparaît : §2 des
nouvelles conditions générales, pied de `/vendre`, panneau de flux d'argent,
`/demo`, page de tarifs. Aucun écran ne cite la règle 3 seule. Et aucune
formulation ne laisse entendre que la gratuité ou l'absence de commission
suffirait à écarter le courtage : ce qui l'écarte, c'est de ne signer aucun
mandat et de ne négocier aucun prix.

**Effet pratique le plus visible.** Sur `/vendre`, route « accompagné », la
phrase n'est pas seulement « E-Dome ne touche rien sur cette commission » —
elle est « E-Dome ne signe aucun mandat, ne négocie aucun prix, et ne touche
rien sur cette commission ». C'est la formulation exacte ; la version courte
était trompeuse par omission.

### 1.1 La règle 3 est reformulée — D1

**Options.** (a) Garder la règle telle quelle. (b) La reformuler autour de la
conditionnalité.

**Décidé : (b).** L'agent juridique a démontré que B.2 raisonne à l'envers.
L'art. 412 CO définit le courtage par l'**activité** — indiquer une occasion de
conclure, ou négocier, contre salaire. Il ne dit rien du mode de calcul.
L'art. 413 règle le droit au salaire ; il ne qualifie rien. Donc :

- un **forfait conditionné à la vente** (« 2 500 CHF si le bien se vend ») est
  du courtage, et c'est le montage **le plus dangereux des trois** — celui que
  la règle actuelle laisse passer ;
- un **pourcentage non conditionné** (un prix indexé sur le stock de biens ou
  de sièges) n'est pas du courtage, et la règle actuelle l'interdit sans
  raison.

Formulation retenue, à substituer mot pour mot dans les CGU, dans `pricing.ts`
et dans le discours :

> E-Dome ne perçoit aucune rémunération dont le **montant** ou l'**exigibilité**
> dépend de la conclusion d'une vente ou d'un bail d'habitation ou de locaux
> commerciaux. Ses prix sont fixés à l'avance, dus indépendamment du résultat,
> et identiques pour tous les utilisateurs d'une même formule.

**Portée exacte, après la réserve du fondateur.** Cette reformulation est plus
protectrice et plus permissive que la règle d'origine **sur le versant de la
rémunération uniquement**. Elle ne dit rien de l'activité, et elle ne remplace
donc ni la règle 1 ni la règle 2 — voir §1.0. Présentée seule, elle donnerait
un faux sentiment de sécurité : un forfait parfaitement inconditionnel versé
pour avoir mis deux parties en relation resterait du courtage.

Elle rend en revanche défendable, par ricochet, le mot « gratuit » sans
astérisque que réclame l'agent marketing : la gratuité du particulier devient
inconditionnelle *de construction*, pas par bonne volonté.

**Ce qu'on perd.** Le produit « vous ne payez que si ça marche », meilleur
argument commercial du marché immobilier. L'agent marketing le voudra ; c'est
fermé.

**Corollaire exécutable.** L'en-tête de `pricing.ts` — « un pourcentage sur le
prix de vente d'un bien immobilier est l'assiette de rémunération d'un
courtier » — est faux et sera réécrit. Surtout, la règle cesse d'être un
commentaire : le type `CommissionPole` **exclut** `vente` et `location-lt`, si
bien qu'une commission sur un bien immobilier devient une erreur de
compilation.

### 1.2 Le revenue share sur commission d'agence est supprimé — D2

**Options.** (a) Le garder, éventuellement plafonné. (b) Le supprimer.

**Décidé : (b), sans remplacement.** C'est un pourcentage conditionné à la
conclusion d'une vente immobilière, encaissé par E-Dome : le cœur exact de
l'interdit. Il est aujourd'hui écrit à trois endroits, dont `pricing.ts:88`.

**Ce qu'on perd.** L'agent comptable l'a nommé « de loin la plus grosse assiette
disponible ». Une agence facture typiquement 2 à 3 % d'un prix de vente ; 10 à
15 % de cela sur un bien à un million représente 2 000 à 4 500 CHF par
transaction — plus qu'une année d'abonnement. C'est un renoncement coûteux et
assumé.

**Ce qui reste, et qui est différent.** L'outil de suivi des commissions de
l'agence demeure, sans prélèvement. E-Dome n'affiche aucun barème, ne calcule
rien, ne garantit rien, n'encaisse rien : l'outil enregistre ce que l'agence
déclare.

### 1.3 Les taux — D3, amendé

**Amendement du fondateur : les taux à 15 % sont refusés en l'état, et le motif
iOS est écarté pour le lancement.** Il a raison sur les deux points.

L'achat intégré d'Apple s'applique aux **biens numériques vendus dans une
application iOS native distribuée par l'App Store**. Le MVP est une application
web installable : elle n'est pas distribuée par l'App Store, et l'achat intégré
ne s'y applique pas. J'avais importé cette contrainte du comptable sans
vérifier qu'elle concernait le produit d'aujourd'hui. **Elle est reportée, pas
fausse** — et l'artefact qui la déclencherait existe déjà dans le dépôt :
`mobile/`, un conteneur Expo natif qui charge la maquette dans une vue web.
Publier ce conteneur avec du contenu payant à l'intérieur fait entrer Apple
dans l'équation.

**Décidé : les taux du comptable, ramenés à 10 % sur les deux pôles de
créateurs, avec un tarif fondateur et une révision datée.**

| Pôle | B.3 | Comptable | **Retenu** | Comparable vérifié |
| --- | --- | --- | --- | --- |
| Courte durée | ≈8 % | 12 % | **12 %** hôte, tout compris | Airbnb **15,5 %** hôte seul |
| Services | ≈7 % | 10 / 5 % | **10 %** 1ʳᵉ mission, **5 %** ensuite | — |
| Événements | ≈6 % | 5 % + 1 CHF | **5 % + 1.00 CHF** par billet payant | Eventbrite **≈10,2 %** effectifs |
| **Lives** | ≈10 % | ~~15 %~~ | **10 %** | Patreon 8–12 % *[à vérifier]* ; YouTube 30 % |
| **Formations** | ≈10 % | ~~15 / 5 %~~ | **10 %** acheteur E-Dome / **5 %** acheteur créateur | Udemy **63 % / 3 %** ; Teachable 0–3 % |
| Boutique | ≈6 % | 0 % | **0 %** — affiliation seule | Etsy 6,5 % ; Amazon 15 % |
| — | — | 3 CHF | **Plancher 3.00 CHF** par transaction | — |

#### Comparaison par catégorie, puisque c'est là que se joue l'acquisition

**Hébergement.** Airbnb applique **15,5 %** à l'hôte seul, modèle généralisé en
Suisse et dans l'EEE au 13.10.2026 ; Booking prend 10 à 25 %, ~15 % en moyenne.
Nos **12 %** sont 23 % moins chers que le seul modèle réellement en vigueur.
Riposte imposée en démonstration : comparer au 15,5 %, jamais aux 3 % de
l'ancien modèle partagé, qui n'existe plus.

**Billetterie.** Eventbrite facture 3,7 % + 1.79 USD **plus** 2,9 % de
traitement, soit **≈10,2 % effectifs** sur un billet à 50 USD et **13,8 %** à
25 USD. Notre structure donne **7,9 %** effectifs à 35 CHF et **5,7 %** à
150 CHF : moins cher qu'Eventbrite à tous les niveaux de prix. La part fixe
d'1 CHF n'est pas une gourmandise — un pourcentage pur sur un billet à 35 CHF
laisse 0.78 CHF après le prestataire de paiement.

**Formation.** C'est le marché le plus dur, et le plus favorable à notre
argument. Udemy garde **63 %** sur une vente issue de sa propre recherche et
**3 %** sur une vente amenée par le formateur ; Teachable prend 0 à 3 % mais
facture un abonnement mensuel **avant la première vente**. Nos **10 % / 5 %**
reprennent la logique d'Udemy — on facture l'audience qu'on fournit
réellement — à une fraction du prix, et **sans rien facturer avant la première
vente**. C'est la phrase qui doit être dite à un créateur : *zéro avant votre
première vente, 5 % si vous amenez votre audience.*

**Lives et coaching.** Patreon se situe autour de 8 à 12 % *[à vérifier]*,
YouTube prend 30 % sur les Super Chats. À 10 % nous sommes dans le bas de la
fourchette du comparable le plus proche. Le comptable défendait 15 % pour
couvrir le support d'un pôle à risque opérationnel ; c'est vrai, et c'est
précisément ce que la révision datée ci-dessous rattrapera si nécessaire.

#### Tarif fondateur créateur

**Les 30 premiers créateurs : 5 % sur tous les pôles de contenu — formations,
lives, événements — pendant 24 mois**, puis le taux standard. Le badge
Fondateur reste acquis définitivement.

**Pourquoi 24 mois, et pas 12.** Un créateur doit d'abord produire son contenu.
Entre l'inscription et la première vente, il s'écoule des mois ; un tarif de
12 mois expirerait à peu près au moment où son catalogue commence à produire,
ce qui se lit comme un appât. Vingt-quatre mois couvrent deux cycles annuels
complets et laissent le temps d'un verdict honnête. **C'est délibérément plus
long que les 12 mois du tarif fondateur agence** : une agence juge E-Dome sur
le flux de demandes, mesurable en un trimestre ; un créateur juge sur des
ventes qui n'existent pas encore au moment où il signe.

**Écarté : 0 % pendant 12 mois.** Plus spectaculaire, et défendable. Rejeté
pour une raison propre à ce projet : la maquette doit **démontrer** le modèle
économique, et un pôle créateur à 0 % afficherait un panneau de flux d'argent
où E-Dome ne touche rien. Un demi-taux visible vaut mieux qu'un taux nul
invisible.

**À l'expiration des 24 mois : passage automatique à 10 %, avec préavis.** Pas
de renégociation individuelle, pour trois raisons. Un tarif négocié au cas par
cas contredirait la règle « prix identiques pour tous les utilisateurs d'une
même formule » du §1.1, qui est une **condition juridique** et non une
commodité. Trente négociations simultanées au même moment consommeraient un
temps qu'une équipe de cette taille n'a pas. Et un tarif fondateur dont
l'expiration se discute n'est plus un tarif fondateur : c'est une remise
permanente qui ne dit pas son nom.

Le mécanisme : la date d'expiration est **écrite sur l'abonnement dès la
souscription** et visible en permanence sur l'écran du créateur — jamais une
surprise. Préavis de **30 jours**, cohérent avec celui déjà prévu pour toute
modification tarifaire (§5.7 des nouvelles conditions). Le créateur qui part à
ce moment-là garde son contenu et ses acheteurs : aucune clause de sortie, ce
qui est la contrepartie honnête d'un passage automatique.

Ce que cela n'exclut pas : un **nouveau** tarif promotionnel, ouvert à tous et
publié, décidé plus tard sur la base des chiffres réels. C'est une décision
commerciale future, pas une renégociation privée.

S'y ajoutent les exonérations de lancement du marketing, qui restent : six
premiers mois ou vingt premières transactions offerts à chaque vendeur, trois
mois offerts sur la formule Mandats.

#### Révision à la sortie de l'application native

**À rouvrir le jour où `mobile/` est publié sur l'App Store avec du contenu
payant accessible à l'intérieur.** Apple prélève alors 15 à 30 % du brut, avant
nous. L'arithmétique, pour préserver à la fois le net du créateur et notre
marge :

| Taux Apple | Hausse du prix affiché dans l'application |
| --- | --- |
| 15 % (petites entreprises) | **+20 %** |
| 30 % (standard) | **+50 %** |

**Position recommandée : prix différencié, net créateur identique.** Le prix
affiché dans l'application native est supérieur au prix web, et l'écran dit
pourquoi. Ce qui ne doit **jamais** varier, c'est ce que touche le créateur :
un créateur ne doit pas être pénalisé parce que son acheteur a utilisé un
téléphone. L'alternative — absorber la ponction — rend le pôle déficitaire à
10 %, ce qui était l'argument initial du comptable et le redeviendra à ce
moment-là.

Ce point est reporté dans `JURIDIQUE-A-VALIDER.md` et dans le plan : il ne se
décide pas maintenant, il se décide avec une date.

**Deux trouvailles du comptable qui restent, et qui changent des décisions.**

1. **L'art. 20a LTVA** réputerait E-Dome fournisseur des biens de la boutique
   dès qu'elle facilite une livraison au point que vendeur et acheteur y
   concluent le contrat. E-Dome devrait alors facturer le prix entier avec TVA
   et en répondre — ce qui ruine l'économie du pôle **et** la règle 4. C'est le
   **motif principal** de garder la boutique en affiliation ; voir §1.8.
2. **Le plancher de 3.00 CHF** n'est pas cosmétique : sous ~25 CHF de panier,
   le prestataire de paiement prend plus de 4,9 %. Conséquence à assumer et à
   afficher : sur une micro-formation à 40 CHF au tarif fondateur, le taux
   effectif n'est pas 5 % mais 7,5 %. Le panneau de flux d'argent l'affichera
   tel quel — c'est exactement ce à quoi il sert.

**Ce qu'on perd en descendant à 10 %.** Environ un tiers de la marge unitaire
sur les deux pôles de créateurs, et le coussin que le comptable réservait au
support. Contrepartie assumée, et c'est l'arbitrage du fondateur : les
créateurs sont le segment à acquérir en premier, et un taux est une raison de
venir avant d'être une ligne de revenu.

### 1.4 L'Espace agence : quatre paliers, trois au lancement — D4

**Options.** (a) Trois formules payantes (comptable). (b) Deux payantes sur un
socle gratuit (marketing). (c) Deux au maximum (produit).

**Décidé : une synthèse.** Quatre paliers, dont le plus haut en statut
« Ensuite », donc gris et hors de la grille de comparaison.

| Palier | Prix HT/mois | Statut | Pour qui |
| --- | --- | --- | --- |
| **Présence** | gratuit | Au lancement | Agent qui découvre — 3 biens actifs |
| **Vitrine** | **89** | Au lancement | Indépendant, petite agence |
| **Mandats** | **290** | Au lancement | Agence avec une équipe |
| **Régie** | **690** | **Ensuite** | Multi-entités, import de flux, SLA |

**Pourquoi cette forme.** Le comptable a raison sur le marché : 42 % des
sociétés de services immobilières suisses ont au maximum cinq biens au
portefeuille, et un prix unique en perd une moitié ou l'autre. Le marketing a
raison sur la démonstration : trois paliers payants invitent le prospect à
attendre le moins cher. Le produit a raison sur l'écran : la Partie C impose
une colonne de statut, et deux formules × deux statuts font déjà quatre choses
à comparer. Mettre Régie en « Ensuite » satisfait les trois — et c'est la
proposition de compromis que le produit avait lui-même formulée.

Les noms viennent du marketing, et la raison est bonne : *Vitrine* est le mot
que le métier emploie déjà pour ce qu'il achète aux portails ; *Mandats* nomme
la seule chose qu'une agence gère et qu'aucun portail ne gère, donc il nomme le
moment de la bascule.

**Fondateur n'est pas une formule.** C'est un tarif gelé sur l'abonnement plus
un marqueur de profil. L'agent architecture a raison : en faire un plan
doublerait le catalogue à chaque changement de prix.

**Ce qu'on perd.** Le revenu des agences de plus de 250 biens au lancement :
elles seront sur Mandats à 290 au lieu de Régie à 690. Et la possibilité de
tester l'élasticité du prix sur trois points simultanément.

**Le seuil de rentabilité, à connaître.** Le comptable l'établit à **161
agences** sur la formule Mandats pour couvrir 45 000 CHF de charges mensuelles,
soit 4,6 % des ~3 500 agences suisses. Vingt-quatre à trente-six mois. Pendant
cette période, l'abonnement agence n'est pas « la principale source de revenu
récurrent » : c'est la seule.

### 1.5 Patrimoine, 19 CHF, pour le bailleur — D5

**Options.** (a) « Propriétaire », ~10 CHF, pour le particulier de B.3.
(b) « Patrimoine », 19 CHF, pour le multipropriétaire bailleur.

**Décidé : (b).** Les deux agents concernés convergent, pour deux raisons
distinctes qui se renforcent. Le marketing : un particulier qui vend tous les
douze ans ne s'abonne pas au mois, et « Propriétaire » désigne tout le monde,
donc personne ne s'y reconnaît. Le comptable : un bailleur a une douleur
mensuelle réelle — baux, échéances, indexation, charges, décompte, rendement —
là où un vendeur a un besoin épisodique qui garantit l'attrition.

Un seul niveau, contrainte du produit. Déclencheur : l'échéancier des baux avec
indexation, le décompte de charges, et un export que la fiduciaire accepte.
L'IA de rédaction est un agrément, pas un motif d'achat — et son coût réel est
négligeable (0.30 à 1.04 CHF par mois et par abonné), à condition de plafonner
les usages : deux cents estimations dans le mois coûteraient le double de
l'abonnement.

**Contrainte juridique reportée sur l'écran** : B.6 interdit la promesse de
rendement. L'analyse calcule donc un **réalisé**, jamais une projection.

**Ce qu'on perd.** Le vendeur décennal, qui ne s'abonnera jamais. Il est
monétisé autrement, par la mise en avant (§1.6).

### 1.6 Un seul forfait ponctuel survit comme produit de masse

**Décidé.** Oui à des forfaits ponctuels, aux trois conditions du juridique et
du comptable : payés d'avance, **jamais conditionnés** à la conclusion d'une
transaction immobilière, **jamais proportionnels** au prix d'un bien. Jamais
sous 25 CHF, en dessous desquels le prestataire de paiement prend plus de
4,9 %.

Mise en avant 7 jours **79 CHF** / 30 jours **199 CHF** · Dossier de vente
**149 CHF** · Visite virtuelle **249 CHF** · Estimation supplémentaire
**2 CHF**.

La mise en avant est le produit à **75,8 % de marge** de la plateforme, à coût
marginal nul, et 60 % moins cher qu'une annonce premium du réseau SMG. Elle ne
doit **jamais** conditionner la publication : ce serait le retour déguisé du
modèle 500 / 2 500 CHF.

### 1.7 Le programme apporteurs

**Décidé.** Les trois cas de B.3 sont validés avec deux durcissements et une
correction structurelle.

- **Assiette** : le revenu **net encaissé, hors TVA, après frais de paiement** —
  pas la commission brute. Sinon la part de l'apporteur peut dépasser la marge,
  et l'on expose indirectement le prix payé par le client.
- **Barème** : 25 % sur les douze premiers mois d'un abonnement · 15 % sur les
  commissions pendant douze mois · prime **60 CHF** pour un hôte activé, versée
  **après son premier encaissement** · prime **15 CHF** par nouvel utilisateur
  actif, plafonnée. Le `HOST_BOUNTY_CHF = 100` versé à l'activation est
  supprimé : on ne paie jamais avant que le revenu existe. La fraude
  d'auto-parrainage est un coût, pas une hypothèse.
- **Plafond de douze mois**, non négociable : sans lui on paie une rente
  perpétuelle sur un revenu récurrent. Avec lui, le coût d'acquisition d'une
  agence est de 842 CHF pour une valeur vie estimée à ~10 100 CHF.
- **Pas de parrainage à deux niveaux** : `referralDepth` borné à 1 par
  construction. Une prime liée au recrutement d'autres apporteurs relèverait de
  la vente en boule de neige.
- **Déclaration obligatoire avant le premier lien**, trois champs : pays de
  résidence fiscale, particulier ou entreprise avec IDE, engagement de ne pas
  négocier ni représenter. Sans ces trois champs, aucun lien n'est généré.
- **La restriction géographique est refaite en `pays × type d'apport`.** C'est
  la correction la plus utile du juridique : telle qu'écrite, B.3 bloque aussi
  l'apport d'un créateur de formation ou d'un annonceur, qui n'a rien
  d'immobilier et ne relève d'aucune autorisation. Défaut retenu : apports
  immobiliers bloqués, apports non immobiliers autorisés.

**Ce que l'apporteur doit lire, sans repli.** Le juridique a rédigé quatre
formulations ; elles entrent telles quelles dans `src/content/legal.ts`. La plus
importante dit ce que **lui** risque, et non ce qu'E-Dome n'est pas : s'il
négocie ou représente une partie, il agit comme courtier pour son propre
compte.

### 1.8 La boutique perd son statut de pôle

**Décidé.** La tuile reste, visible et grise ; le pôle disparaît ; affiliation
seule, aucun stock, aucun envoi, aucun fonds détenu.

**Motif principal — fiscal, et non stratégique.** Depuis le 1ᵉʳ janvier 2025,
l'**art. 20a LTVA** répute l'exploitant d'une plateforme **fournisseur de la
prestation** dès lors qu'il facilite une **livraison de biens** au point que
vendeur et acheteur concluent le contrat sur la plateforme. E-Dome devrait
alors facturer le prix entier avec la TVA, en répondre, et assumer les
obligations d'un vendeur — ce qui détruit l'économie du pôle **et** contredit
la règle 4. Les services, l'hébergement et les formations ne sont pas visés,
l'article ciblant les biens ; ce point figure dans `JURIDIQUE-A-VALIDER.md`.

En affiliation, E-Dome ne facilite aucune livraison, ne conclut aucun contrat
de vente de biens et n'encaisse rien : l'article ne s'applique pas.

**Motifs secondaires**, qui convergent sans être décisifs : c'est le seul pôle
dont l'objet n'est ni un bien immobilier, ni une personne, ni une compétence ;
il importerait la logistique, les retours, la garantie et le droit de la
consommation ; et à ~6 % sur du mobilier, il ne paierait pas sa propre
modération.

**Ce qu'on perd.** Un pôle sur l'organigramme, et la marge d'une marketplace
propre si le volume la justifiait un jour. Le clic sur la tuile l'explique :
affiliation d'abord, marketplace seulement si le volume le prouve.

---

## 2. Le produit

### 2.1 `/demo` devient la porte d'entrée

**Décidé.** Un écran d'entrée `/demo`, destination de `demo.href` et du bandeau
« En savoir plus ». Aujourd'hui « Explorer la démo » mène à `/feed` : un fil
social de 3 130 lignes, déjà connecté sous le nom d'un inconnu. En trente
secondes, **aucune** des trois questions du critère ultime n'a de réponse.

Trois blocs, une hauteur d'écran, sans défilement sur un téléphone : une phrase
et le plan des sept pôles avec leur statut · **qui paie quoi en quatre lignes** ·
trois portes, pas six. Plus la légende des statuts et l'interrupteur du mode
explicatif, expliqués ici une fois pour toutes.

Le bloc « qui paie quoi » passe **avant** les fonctionnalités : c'est la seule
des trois questions qu'une capture d'écran ne peut pas résoudre.

**Conséquence non demandée, à acter.** `mobile/` est une application Expo
suivie par git, simple conteneur WebView pointant sur
`https://edome-demo.vercel.app/feed`. Elle contourne donc la landing **et**
contournera `/demo`. Son URL doit suivre, sinon la démonstration mobile reste
sans contexte. (À noter par ailleurs : un conteneur WebView autour d'un site est
ce que la règle 4.2 de l'App Store rejette. Hors périmètre ici.)

### 2.2 `/vendre` : deux routes, plus une en complément

**Options.** (a) Trois cartes symétriques, comme le décrit B.4. (b) Deux routes
plus un bloc rattaché.

**Décidé : (b).** « Seul » et « accompagné » s'excluent ; « à la carte » ne
s'exclut de rien — on prend un photographe qu'on vende seul ou accompagné.
Trois cartes de même taille mentiraient sur la nature du choix.

Chaque carte porte **les mêmes six lignes dans le même ordre** : c'est la règle
qui rend le coût lisible, parce que l'œil compare des lignes alignées et non des
paragraphes. Et le point contre-intuitif de tout le modèle reçoit le plus gros
caractère de l'écran : **0 CHF à E-Dome, des deux côtés.** Le différenciateur
n'est pas E-Dome, c'est la ligne « à un tiers ».

Atterrissages : `/publier` **sans l'étape de frais**, `/vendre/accompagnement`,
`/services`. Et une phrase sans laquelle personne ne clique : « vous pouvez
changer d'avis ».

### 2.3 Les demandes d'accompagnement ne sont jamais vendues

**Décidé.** Le mécanisme du produit, confirmé comme **condition de validité
juridique** et non comme positionnement.

Une agence ne reçoit jamais un contact : elle voit une **fiche anonyme** et elle
y répond. L'inversion du sens de circulation est le point — dans un marché de
leads la plateforme pousse une identité vers celui qui paie ; ici l'identité ne
bouge que par un acte du particulier.

Cinq temps : le particulier décrit son bien et choisit un rayon · la demande
devient anonyme et visible par **toutes** les agences vérifiées du rayon, dans
un ordre **chronologique** · les agences **postulent** avec quatre champs
imposés (taux, inclus, délai, deux références locales) · le particulier compare
trois propositions et **ouvre le contact** lui-même · sous trois réponses en
72 h, le rayon s'élargit d'un cran.

Aucun paiement pour voir, aucun paiement pour postuler, aucune pondération par
le montant de l'abonnement. L'abonnement limite un **volume** de propositions
ouvertes simultanément, jamais un **accès**.

**Ce qu'il faut assumer, et écrire.** Une agence peut payer et ne gagner aucun
mandat. La promesse de l'Espace agence n'est donc **jamais** « des demandes » :
c'est les outils et la page publique. Sur l'écran d'abonnement, la ligne
« demandes d'accompagnement » figure **sans chiffre**.

### 2.4 Statuts, mode explicatif, sélecteur de rôle, flux d'argent

**Décidé, conceptions du produit adoptées telles quelles.** Quatre points
méritent d'être relevés parce qu'ils s'écartent d'une lecture littérale du
cahier des charges.

**Le gris n'est pas une opacité.** `opacity: .5` casse le contraste et échoue en
AA. Un jeton dédié, une bordure en tirets, un fond neutre à 4 %, **et le mot
écrit**. Jamais la couleur seule.

**Le mode explicatif est actif par défaut mais replié.** La Partie C demande
« actif par défaut à la première visite ». Six bulles ouvertes d'office rendent
le premier écran illisible. Retenu : les puces sont visibles, **une seule** bulle
est ouverte, avec « 1 / 6 » et deux flèches. Plafond dur de six puces par écran —
si un écran en demande plus, c'est l'écran qu'il faut découper.

**Le sélecteur de rôle change le point de vue, jamais les données.** Contrat à
ne pas dépasser : les entrées de navigation, la page d'accueil du rôle, le
tableau de bord, l'action primaire d'une fiche, la ligne « vous » du panneau de
flux. Et `viewingAs` est découplé des droits détenus : changer de vue ne donne
aucun droit.

**Le panneau de flux d'argent n'est jamais un camembert.** Cinq lignes, toujours
dans le même ordre : on doit pouvoir vérifier que la somme est juste, et un
camembert ne se vérifie pas. Quand E-Dome ne touche rien, la ligne le dit en
gras au lieu d'afficher zéro. Règle de pliage unique : déployé quand
l'utilisateur est sur le point de payer ou d'encaisser, et partout tant que le
mode explicatif est actif.

### 2.5 Le garde-fou qui protège la démonstration

L'agent produit a identifié la demande de la Partie C la plus dangereuse : « une
fonctionnalité future reste visible et cliquable », combinée à « montrer toute
la plateforme ». Mal réalisée, elle produit un écran où la moitié des éléments
est grise et où chaque clic ouvre une explication au lieu d'un écran. Le
visiteur apprend en une minute à ne plus cliquer.

**L'effet secondaire est pire que l'effet principal** : il devient tentant de
« livrer » l'Espace agence sous forme de carré gris cliquable — le plus coûteux
à construire, et la principale source de revenu. Une maquette où l'Espace
agence est gris ne démontre pas le modèle économique, elle le décrit.

**Quatre garde-fous, sans exception.** Jamais plus d'un quart des éléments d'un
écran en gris, au-delà c'est l'écran entier qui est marqué « Ensuite » · **l'Espace
agence se construit pour de vrai, au lancement** · un seul composant
d'explication, qui ne remplace jamais un écran qui aurait dû exister · tout
élément gris a un voisin non gris qui fait quelque chose de proche.

### 2.6 Ce qui est au lancement

**Au lancement** — Biens, Services et prestataires, Apporteurs, **et l'Espace
agence** (qui n'est pas un pôle mais la source de revenu : le repousser, c'est
lancer sans revenu). **Ensuite** — Formations, puis Événements. **Vision** —
Lives, et Boutique en affiliation.

---

## 3. La technique

### 3.1 Le rôle éclate en trois axes — D6

**Options.** (a) Élargir l'union de 13 chaînes à 15. (b) Trois axes distincts.

**Décidé : (b).** Le code actuel mélange des capacités (`agence`, `apporteur`,
`admin`) et des métiers (`photographe`, `architecte`, `notaire`, `promoteur`).
Élargir l'union ne résout rien : le code continuerait à demander « quel
rôle ? » là où la question est « quel droit, dans quelle agence ? ».

- `PlatformRole` — **11 valeurs, exactement celles de B.5**.
- `ProviderTrade` — les métiers, qui ne sont pas des rôles : un notaire et un
  photographe ont les mêmes droits, ils vendent autre chose.
- `RoleGrant` — un rôle détenu, daté, avec une **portée** : `agent` n'existe
  qu'au sein d'une agence.

**Deux suppressions, sur avis juridique.** `courtier` disparaît : le rôle n'est
pas illicite en soi, mais un badge « Courtier » à côté du logo E-Dome crée
l'**apparence** qu'E-Dome exerce ou organise le courtage, et l'apparence suffit
à nourrir un litige. Un courtier indépendant est une agence d'une personne, ou
un agent : le métier reste couvert. Je vais un cran plus loin que l'agent
architecture, qui en faisait un `ProviderTrade` : **`courtage` ne figure pas non
plus dans les métiers**, et le mot « courtier » n'apparaît nulle part dans
l'interface.

**`investisseur` quitte les rôles mais devient un centre d'intérêt — amendement
du fondateur, retenu.** Ma version initiale le supprimait purement et
simplement ; c'était une erreur de périmètre. Ce qui est dangereux, c'est un
**espace** « investisseur » avec ses droits et son tableau de bord, chemin le
plus court vers la promesse de rendement que B.6 interdit. Ce qui est utile, et
sans risque, c'est de savoir qu'une personne **s'intéresse** à l'investissement,
pour le ciblage du fil, la segmentation et le formulaire de la landing.

D'où un **quatrième axe**, distinct des trois autres :

```ts
/** Centre d'intérêt déclaré. Ne confère AUCUN droit, ne change aucun écran,
    ne crée aucun tableau de bord : sert au ciblage du fil, à la segmentation
    et au formulaire de manifestation d'intérêt. */
export type ProfileInterest =
  | "investisseur" | "vendeur" | "bailleur" | "acheteur" | "locataire"
  | "voyageur" | "formation" | "evenements";
```

La règle qui le rend sûr : **un centre d'intérêt n'ouvre jamais un écran.** Si
un jour « investisseur » doit donner accès à quelque chose, c'est qu'il est
redevenu un rôle, et il repasse par cette décision.

**Même traitement pour tout public retiré des rôles mais qui reste une cible de
contenu** — c'est la généralisation demandée par le fondateur, et elle a une
conséquence heureuse que je n'avais pas vue : elle **protège la couche leads**.
Le `ProfileId` de `src/content/landing.ts` porte les six profils du formulaire,
dont `investisseur`, et il est importé par `leads/types.ts`, `schema.ts`,
`score.ts` et `supabase-store.ts`. Le renommer casserait la console
`/admin/leads` **et** la correspondance des colonnes Supabase, comme l'avait
signalé l'agent architecture. En faisant des profils de la landing des centres
d'intérêt plutôt que des rôles, les deux systèmes cessent d'être en tension.

(La route `/investisseurs`, qui s'adresse aux investisseurs d'E-Dome et non à un
rôle d'utilisateur, subsiste sans changement.)

`notaire`, `architecte`, `photographe`, `promoteur` deviennent
`prestataire` + métier + métier vérifié. Un badge « Notaire » non vérifié contre
le registre cantonal serait une allégation trompeuse.

**Ce qu'on perd.** Une migration de données de démonstration, et un
`localStorage` qui contient peut-être `"courtier"` — d'où la validation
obligatoire au chargement, absente aujourd'hui (`context.tsx:137` fait
`storedRole as Role` sans vérifier).

### 3.2 `pricing.ts` change de signature avant tout écran neuf

**Options.** (a) Ajouter un pôle « abonnement ». (b) Une notion séparée.
(c) Changer le discriminant.

**Décidé : (c).** Le comptable et l'architecture y arrivent par deux chemins et
se rejoignent : `edomeRevenue(pole, price)` **suppose une transaction avec un
prix**, alors qu'un abonnement a un plan, une période et un titulaire qui peut
être une agence et non un compte. `edomeRevenue("abonnement-agence", 290)` ne
veut rien dire.

Le discriminant devient la **mécanique**, pas le domaine :

```
Charge = subscription | commission | oneOff | cpm | bounty
```

Un point d'entrée unique, `quote(charge) → Quote`, dont le `MoneyFlow` alimente
le panneau de la Partie C tel quel — brut, frais de paiement, part E-Dome, part
apporteur, net, bénéficiaire — avec l'invariant vérifié dans la fonction. Les
formules sont des **lignes de données**, jamais des variantes d'un type : passer
de deux à quatre paliers devient une édition de données, et aucun composant ne
branche sur un nom de formule.

**C'est la décision qu'il serait le plus coûteux de reporter.** Dix fichiers
importent `pricing.ts`. Tout écran écrit contre l'ancienne signature devra être
réécrit, et le panneau de flux d'argent ne peut pas être écrit **du tout** contre
elle : elle n'a aucune notion de payeur, de période ni de titulaire.

### 3.3 Un journal unique pour les chiffres de démonstration

**Options.** (a) Corriger les valeurs divergentes. (b) Rebrancher
`dashboard-data` et `revenue-data` sur le catalogue existant. (c) Un journal
d'écritures, agrégats dérivés, invariants levés à l'import.

**Décidé : (c), avec la substance de (b) et les contrôles de la qualité.**

Ni `dashboard-data.ts` ni `revenue-data.ts` ne fait foi. Le premier **se
contredit en interne** : sa valeur de décembre, 24 850, est le total des biens
seuls, alors que sa répartition par source en ajoute cinq autres — et son
commentaire des lignes 217-219 l'assume par écrit. Le second a la bonne
granularité mais pas la discipline. Corriger les valeurs ne servirait à rien :
elles divergeraient à nouveau le jour où l'Espace agence ajoute du revenu
d'abonnement.

Le mécanisme : un journal, et lui seul contient des chiffres ; des agrégats
dérivés par fonctions pures ; des **invariants levés à l'import**, ce qui fait
échouer `next build`. Ce choix est délibéré : il n'y a **pas de lanceur de tests
unitaires** dans ce dépôt, `npm test` est Playwright. Une assertion à l'import
bloque le commit sans ajouter ni dépendance ni porte de qualité.

S'y ajoutent les **douze assertions d'intégrité** de l'agent qualité, via
`node --test`, intégré à Node 24 : zéro dépendance nouvelle. Elles auraient
attrapé les vingt-trois incohérences qu'il a trouvées. Et la douzième est la
règle de fond : **aucun montant en CHF littéral hors du module de tarification**.

### 3.4 Les textes : cinq fichiers neufs d'emblée, le reste au fil des routes

**Décidé.** La règle qui évite trois semaines de chantier avant le premier
écran : *les textes d'une route sortent quand on touche cette route, jamais dans
une passe dédiée.* Pas de commit « extraction de 48 routes ».

Sont écrits d'emblée parce que ce sont des textes **neufs** et non des
extractions : `common.ts`, `demo.ts`, `explain.ts`, `roles.ts`, `offer.ts` — un
après-midi, et le mode explicatif comme la légende des statuts deviennent
possibles immédiatement. `legal.ts` suit dès que les textes juridiques sont
prêts, puisque `/conditions`, `/aide` et `/publier` seront réécrits de toute
façon.

**Une contrainte de Next 16 à connaître.** 44 des 46 pages sous `(app)` portent
`"use client"`. Le patron d'internationalisation de Next — `getDictionary`,
`import()` dynamique, `server-only` — **ne s'applique donc pas** : il repose
explicitement sur des composants serveur. La forme correcte est celle de
`landing.ts` : des modules de constantes importés statiquement, valides des deux
côtés de la frontière.

**Limite assumée.** Aucune règle de lint ne garantira l'absence de texte en
dur : `react/jsx-no-literals` produirait des milliers d'avertissements et serait
désactivé dans la semaine. Le garde-fou réel est que `@/content` soit le seul
chemin d'import de texte.

### 3.5 `/feed` est découpé avant le premier écran neuf

**Décidé.** Pas pour le gain de lignes : parce que ce fichier de 3 130 lignes
contient sept utilisateurs en dur dont l'identité courante contradictoire, un
tableau de posts de 474 lignes, six composants de carte — et que les étapes
identité, rôles, contenu et journal doivent **toutes** y passer. Le découper une
fois transforme quatre commits « éditer 3 130 lignes » en quatre commits
« éditer le bon fichier de 200 lignes ».

Déplacement pur, sans changement de comportement, en un commit. Puis
`/creer-post` — non pas à découper mais à **fusionner** : il redéclare le
composer du feed et un troisième catalogue de biens. Ce commit **supprime** du
code.

### 3.6 La dette technique : ce qu'on traite, ce qu'on laisse

| Dette | Décision |
| --- | --- |
| `middleware` → `proxy` | **Étape 1.** Codemod fourni. Et dans le même commit : restreindre le matcher à `/admin` et `/dashboard`, sans quoi le jour où la clé anonyme Supabase apparaît, **toute la maquette redirige vers l'écran de connexion** |
| Triple déclaration `appleWebApp` | **Étape 1.** Cinq minutes |
| 6 `rules-of-hooks` | **Étape 1.** C'est **un seul bug, dans un seul fichier** : `formations/[id]/page.tsx` sort en `return` avant ses `useState`. Hooks conditionnels — un plantage qui attend un mauvais identifiant |
| CSS orphelin, collision des jetons de texte | **Étape où l'on touche déjà les jetons.** Le correctif de la collision est d'une ligne par thème, zéro site d'appel : 372 usages de l'un, 641 de l'autre, la hiérarchie est déjà écrite dans le balisage |
| 174 autres avertissements ESLint | **Laissés.** Les 88 `no-img-element` sont un chantier de performance ; les 30 `no-unused-vars` et 23 `set-state-in-effect` sont dans les gros fichiers que les étapes suivantes réécrivent — les corriger maintenant, c'est les corriger deux fois |
| `maplibre-gl` (XSS critique) | **Après les étapes, commit isolé.** Correctif en version majeure, un seul consommateur, et le vecteur est du HTML de popup non fiable dont la maquette n'a aucun. Mais c'est un « critique » sur un dépôt montré à des investisseurs : pas question de l'oublier |

**Un test de fumée est ajouté dès l'étape 1** sur `/`, `/merci`,
`/confidentialite` et `/admin/leads`. Quatre assertions, et la consigne A.3
cesse de reposer sur l'attention. Ces routes sont les plus susceptibles de
casser en silence, parce que personne ne les regarde — et le danger précis est
le renommage `Role` → `PlatformRole` combiné au `storedRole as Role` non validé.

---

## 4. La crédibilité de la démonstration

### 4.1 L'utilisateur courant n'est plus le fondateur

**Décidé.** `profile-data.DEFAULT_PROFILE` fait foi — seule source éditable,
persistée et typée par un schéma. Son identifiant passe de `"me"` à
**`user-001`**, pour que l'utilisateur courant soit une ligne du même annuaire
que les autres : sans cela, aucun test ne peut vérifier qu'il est bien l'auteur
de ce qu'il publie.

**Et ce n'est plus le fondateur d'E-Dome.** Les deux agents concernés y
arrivent séparément, avec le même argument décisif : la règle de tri de la
Partie C — « les données d'un utilisateur sont normales » — **ne tient que si
l'utilisateur n'est pas la plateforme**. Chaque chiffre du tableau de bord du
fondateur devient une affirmation sur E-Dome. S'y ajoute qu'un investisseur qui
bascule en rôle agence verrait le fondateur jouer l'agence, et que c'est le seul
profil complet — donc E-Dome a l'air d'une plateforme à un utilisateur, son
fondateur.

Retenu : un **particulier de Lausanne, deux biens, trois rôles cumulés** —
bailleur, hôte, apporteur. Trois et non deux : `/vendre` et l'écran de la
formule officielle du loyer initial ont besoin d'un bailleur pour être
démontrables. Le fondateur, s'il apparaît, apparaît comme un profil tiers
consultable.

### 4.2 Les chiffres de traction restants

**Décidé.**

- **Le post épinglé ne porte aucun compteur** — pas un nombre plus modeste :
  aucun. Et ses trois commentaires, qui sont des témoignages sur E-Dome signés
  d'utilisateurs inventés, deviennent des **questions produit**. C'est plus
  honnête et meilleur pour le produit : le post sert alors à lever les
  objections. Les vingt-six autres posts gardent leurs compteurs.
- **Les brèves de marché** : le bloc reste, les affirmations partent. Les
  entrées deviennent des catégories de veille sans chiffre ni horodatage ; deux
  sortent purement et simplement. Le motif du juridique est plus large que la
  règle « pas de traction » : une affirmation factuelle non sourcée sur le monde
  réel relève de l'art. 3 LCD. Et ce traitement est **déjà celui du fil
  d'activité du même fichier**, dont l'en-tête documente ce raisonnement vingt
  lignes plus haut.
- **Les indicateurs de `/admin`** sont dérivés des tableaux de la page, et la
  route est protégée. Le bandeau « Données d'exemple » ne suffit pas tant
  qu'elle est publique.
- **Les deux classements nominatifs de commissions** disparaissent.
- **Les ROI en vert sur les 22 biens** deviennent des projections indicatives,
  avec leur base de calcul et une mention de non-garantie — ou disparaissent.
- **Les encarts de réservation** qui promettent « notre équipe support » et
  pointent vers cinq adresses inexistantes : supprimés ou marqués « Ensuite ».
- **Plafond de contenu** : aucun compteur d'audience à quatre chiffres. L'ordre
  de grandeur crédible pour un réseau qui se lance est 0 à 50.

### 4.3 Les boutons morts

**Décidé.** Les 14 boutons sans gestionnaire sont traités dans l'étape qui
touche leur écran, pas dans une passe séparée. Priorité aux quatre
« Exporter » : l'agent qualité les classe deuxième défaut qu'un investisseur
verra, et son argument est juste — un bouton qui ne répond pas ne se lit pas
« pas encore fait », il se lit « rien ne marche derrière ».

Et l'épreuve `no-dead-buttons` est le seul contrôle qui tienne la consigne A.3
dans le temps.

---

## 5. Les données de démonstration

**Décidé**, sur proposition de l'agent qualité : **un annuaire de 18 personnes**,
`user-001` à `user-018`, couvrant les onze rôles sans en inventer — dont trois
agences, l'une avec trois agents nommés pour que la gestion d'équipe ait un
support. Douze en Suisse, trois en France, trois aux Émirats : juste assez pour
démontrer la restriction géographique du programme apporteurs.

**Douze biens et non vingt-deux**, dont trois appartenant à l'utilisateur
courant — exactement ceux que pilote son tableau de bord, par identifiant. Un
catalogue plus petit et entièrement traversable vaut mieux qu'un catalogue de
22 biens dont 21 n'ont pas d'histoire. Les dix biens retirés sont ceux
qu'aucune page ne référence.

**Cinq histoires vérifiables de bout en bout dans les deux sens** : le
particulier accompagné · l'hôte courte durée · **l'agence abonnée** (seule
histoire à revenu récurrent, donc la plus soignée : c'est celle qui intéresse
l'investisseur) · le créateur · l'apporteur, dont la commission est **calculée**
depuis le revenu E-Dome de ses apports.

Et une constante `DEMO_TODAY` dont toutes les dates dérivent : le mois courant
de la démonstration change aujourd'hui selon l'écran — juin, mars, avril 2026 —
alors que la date réelle est septembre 2026.

---

## 6. Ce que je n'ai pas tranché

Ces points ne sont pas tranchés ici. Ils sont nommés, documentés, et repris un
par un dans [`JURIDIQUE-A-VALIDER.md`](JURIDIQUE-A-VALIDER.md) avec ce qui
change si ma position tombe.

### 6.1 Frais directs ou frais destinataires — arbitrage réservé à l'avocat

**Amendement du fondateur, retenu.** Ma première version tranchait en faveur des
frais destinataires et renvoyait la confirmation à un avocat. C'était traiter
comme une formalité un choix qui **touche la règle 4 elle-même**. Avec les frais
destinataires, les fonds transitent par le compte de plateforme et E-Dome
devient **vendeur apparent** : cela fragilise la règle 4 et rapproche du
traitement de plateforme réputée fournisseur — le même mécanisme que celui qui
condamne le pôle boutique au §1.8. Je retire mon arbitrage.

Les deux options, avec leurs conséquences :

| | **Frais directs** | **Frais destinataires** |
| --- | --- | --- |
| **Flux** | L'acheteur paie le vendeur ; E-Dome prélève sa commission | L'acheteur paie E-Dome, qui reverse au vendeur |
| **Règle 4** | **Respectée au sens strict** : les fonds ne touchent jamais un compte E-Dome | **Fragilisée** : transit par le solde de plateforme, même bref |
| **Vendeur apparent** | Le vendeur | **E-Dome**, ce qui est le critère qui déclenche l'art. 20a LTVA sur les biens |
| **TVA** | Chacun facture sa part | Risque de devoir facturer le prix entier et d'en répondre |
| **Responsabilité** | Litige entre acheteur et vendeur | E-Dome plus exposée, y compris sur la conformité de la prestation |
| **Frais du prestataire** | **Débités au vendeur** | Absorbés par E-Dome sur sa part |
| **Promesse « tout compris »** | **Tombe** — le vendeur voit deux prélèvements | Tenable — un taux unique annoncé |
| **Effet sur les taux** | Il faut retirer ~3,15 points du taux perçu, ou les afficher séparément | Taux du §1.3 tels quels |

**Ce que cela change si l'avocat impose les frais directs** : la ligne « frais
de paiement » apparaît séparément sur chaque écran de transaction et dans le
panneau de flux d'argent — ce que le panneau sait déjà faire, puisqu'il porte
une ligne `psp` dédiée. Le discours change : non plus « 12 %, tout compris »
mais « 12 % pour E-Dome, plus les frais de votre prestataire de paiement ».
C'est moins élégant et plus honnête.

**Position de travail en attendant** : **frais directs par défaut**, parce que
c'est l'option qui respecte la règle 4 au sens strict et que le modèle de
données sait représenter les deux — `MoneyFlow` porte déjà `psp` comme ligne
distincte. Passer aux frais destinataires plus tard ne coûte qu'un changement
de configuration ; l'inverse exigerait de réécrire les écrans de prix.

**Formulation exacte de la règle 4**, en remplacement de la version catégorique.
« E-Dome ne détient jamais les fonds » est faux ou vrai selon le schéma retenu,
et le dire catégoriquement avant l'arbitrage est précisément ce que le fondateur
reproche :

> **Règle 4.** E-Dome n'est jamais dépositaire des fonds de ses utilisateurs.
> Les paiements sont exécutés par un prestataire agréé. E-Dome ne dispose
> librement d'aucune somme appartenant à un utilisateur, ne verse aucun intérêt
> et ne conserve aucun solde : tout montant destiné à un tiers lui est reversé
> sans délai.

Cette formulation est vraie dans les deux schémas, et elle porte la ligne rouge
au chiffre que fixe l'agent juridique — aucun intérêt, exécution sous 60 jours,
faute de quoi ce sont des dépôts du public au sens de l'ordonnance sur les
banques.

### 6.2 Le régime d'autorisation du courtage à Genève et Vaud

L'agent juridique
n'a identifié avec certitude que le Tessin. Consigne stricte : **ne pas écrire
dans les conditions qu'une autorisation est requise à Genève ou Vaud.**

### 6.3 Le seuil de bascule entre hébergement de courte durée et bail

Il décide
si une location de plusieurs mois reste commissionnable. Le champ est prévu au
modèle, la valeur est à confirmer.

La liste complète des points à faire confirmer par un avocat est au §11 de
`analyse/juridique.md`. Un point de calendrier s'en détache : le numéro
d'enregistrement pour un bien situé dans l'UE est **exigible depuis le 20 mai
2026**, et c'est la plateforme qui doit le vérifier. Nous sommes en septembre
2026 : ce n'est pas un champ « après le lancement ».

---

## 7. Les désaccords, et comment je les ai tranchés

### 7.1 Juridique contre comptable — le revenue share d'agence

**Le seul désaccord où l'enjeu chiffré est majeur.** Le juridique : « je refuse
sans discussion, c'est la règle 3 et c'est le seul point où l'interdit est
net ». Le comptable : « de loin la plus grosse assiette disponible, et déjà
écrite au §5 ».

**Tranché pour le juridique.** Et le comptable avait concédé d'avance — ce qui
rend le désaccord moins vif qu'il n'y paraît. Ce qui reste est le coût : §1.2.

À signaler, parce que c'est le contraire du réflexe attendu : sur les **taux
marketplace**, le juridique n'a **aucune objection**, même élevés. Il n'existe
pas de plafond légal sur une commission de service. Sa seule exigence est un
taux publié, unique par formule, non négocié au cas par cas. L'agent juridique
n'est donc pas le frein sur les prix : il l'est sur les **assiettes**.

### 7.2 Marketing contre juridique — le mot « gratuit »

Le marketing : « *gratuit* reste sans astérisque dans le hero, une gratuité
qualifiée n'est pas une gratuité, et le moteur d'acquisition meurt avec
l'astérisque ». Le juridique : jamais de taux sans son assiette dans la même
phrase, et pas de « sans commission » seul, qui est une comparaison implicite
dénigrante.

**Tranché : les deux ont raison, et la décision D1 les réconcilie.** « Gratuit »
reste sans astérisque **parce que la reformulation de la règle 3 rend la
gratuité inconditionnelle de construction** — le mot est littéralement vrai, il
n'y a rien à qualifier. Ce qui est refusé, c'est « sans commission » employé
seul comme comparaison ; la forme retenue est une affirmation sur nous :
« E-Dome ne prend aucune commission sur votre vente ».

Le marketing concède la comparaison nominative avec l'abonnement que les
portails facturent aux locataires. Elle devient « nous ne facturons jamais le
locataire », ce qui perd en tranchant et reste le meilleur argument défendable
du dossier : c'est une promesse que le concurrent ne peut pas copier sans
renoncer à une ligne de revenu.

**Verrouillage demandé par le marketing, et accordé** : si une option payante
touche un jour la publication d'un particulier, nous briserons une phrase écrite
en gros caractères. L'engagement est donc pris ici, dans `DECISIONS.md`, et pas
seulement sur une page.

### 7.3 Comptable contre marketing et produit — le nombre de formules

Trois paliers contre deux. Tranché au §1.4 par un quatrième palier en statut
« Ensuite » : chacun obtient ce qui lui importe, et la condition de
l'architecture — des formules en données, aucun `if` sur un nom de formule —
rend le compromis peu coûteux.

### 7.4 Qualité contre architecture — l'ordre, et un malentendu

L'agent qualité écrit : « il voudra un schéma unique, probablement Supabase, et
refondre les six fichiers d'un coup ; rebrancher d'abord, refondre ensuite ».

**Le désaccord repose en partie sur une lecture erronée.** L'agent architecture
ne propose pas Supabase : il propose un module local de journal, sans
dépendance, avec des invariants levés à l'import. Une fois ce point corrigé,
les deux positions convergent presque entièrement — et l'objection de fond du
qualité (« corriger les chiffres ne sert à rien sans mécanisme ») est
exactement l'argument de l'architecture.

**Tranché : le journal de l'architecture, avec les douze assertions du
qualité dans la même étape.** Ce qui reste du désaccord est réel : l'étape dure
un jour au lieu de quelques heures, et les deux fichiers réduits à des
enveloppes se liront comme une régression dans un diff.

### 7.5 Produit contre architecture et qualité — quand livrer du visible

Le produit : « une maquette invisible ne démontre rien ». L'architecture :
« aucune route neuve avant l'étape 2 ». Le qualité : « le sélecteur de rôle et
le mode explicatif **multiplient** les incohérences au lieu de les révéler ».

L'argument du qualité est le plus fort des trois, et il est concret : un
sélecteur qui bascule sur « agence » alors que quatre pages seulement lisent le
rôle produira une navigation d'agence et un tableau de bord d'hôte. Et le mode
explicatif, qui annote chaque chiffre, pointera du doigt les sept indicateurs
discordants.

**Tranché pour l'architecture et le qualité sur l'ordre, pour le produit sur le
délai.** Aucune route neuve avant que le journal et l'identité unique existent —
mais `/demo`, le bandeau-légende et les statuts arrivent à l'étape 4, soit
après trois commits et non quinze. Ce qu'on perd : environ deux jours avant le
premier écran neuf.

### 7.6 Juridique contre produit — les mentions à l'écran

Le juridique réclame quatre mentions visibles **sans interaction** : l'assiette
accolée à toute estimation de gain d'apporteur · l'étiquette du contenu
sponsorisé · ce qu'un badge ne garantit pas · « aucun frais à la charge du
locataire ». Le produit conteste non le fond mais la **place**, et n'autorise
que trois emplacements : une phrase au point exact de décision, le panneau de
flux d'argent, un lien nommé vers les conditions. Aucun bloc d'avertissement en
tête de parcours.

**Tranché : les quatre mentions du juridique, aux trois emplacements du
produit.** Elles y entrent toutes les quatre — vérification faite, aucune ne
requiert un bloc de tête. Et le produit cède déjà entièrement sur le cas qui
l'exigeait : la formule officielle du loyer initial s'affiche dans le corps de
l'écran de publication, parce que c'est une obligation cantonale et non un
avertissement.

### 7.7 Marketing contre qualité — ce qui rend la maquette vivante

Le qualité refuse les quatre à la fois : le fondateur comme utilisateur type,
les 4 521 « j'aime », les témoignages, les classements nominatifs. Le marketing
ne défend en réalité que la vivacité du feed — et propose lui-même de retirer
les compteurs du post épinglé et de remplacer les témoignages.

**Tranché pour le qualité sur les quatre.** Le désaccord attendu ne s'est pas
matérialisé : les deux agents convergent. Ce qu'on perd est réel — un feed plus
désert et un post d'accueil moins chaleureux. La contrepartie proposée par le
qualité est bonne : le seul compteur autorisé serait le nombre de personnes sur
la liste d'attente, parce que c'est un chiffre **vrai**, que la couche leads
sait produire.

### 7.8 Architecture contre marketing — Fondateur

Le marketing veut un statut « Fondateur » ; l'architecture refuse d'en faire une
formule. **Tranché pour l'architecture** : un tarif gelé plus un badge. Le
marketing obtient ce qu'il voulait — la promesse commerciale — sans le coût
structurel.

---

## 8. Le risque numéro un, tel que l'a nommé le comptable

Je ne le reformule pas, parce que sa version est juste et qu'il faut la lire
avant de valider le plan :

> E-Dome vend aux agences la visibilité qu'elle n'a pas. Le logiciel est la
> seule moitié de l'offre livrable le premier jour, et cette moitié affronte des
> CRM installés depuis quinze ans, dont les données sont coûteuses à migrer, et
> un duopole de portails qui vient de *baisser* ses prix en avril 2026 sous
> l'œil du Surveillant des prix. Une agence ne cessera pas de payer 9 278 CHF
> par an à SMG pour payer E-Dome : E-Dome **s'ajoute** au budget, elle ne s'y
> substitue pas, tant qu'elle n'amène pas d'acheteurs. Il faut donc atteindre
> 161 agences payantes en vendant un supplément, sans preuve d'audience. Et
> l'autre moteur ne compense pas : 45 000 CHF de marge mensuelle en commissions
> de courte durée exigent ~500 000 CHF de réservations par mois. **Les deux
> moteurs ont besoin du même ingrédient manquant — la demande — et aucun prix
> ne l'achète.**

Ce que cela change pour la maquette, et c'est la raison pour laquelle je le
place ici : la démonstration ne doit pas prétendre que ce risque n'existe pas.
Le panneau de flux d'argent et la légende des statuts sont précisément ce qui
permet de dire « nous n'avons pas encore d'utilisateurs » sans que cela
affaiblisse quoi que ce soit — parce que tout le reste est démontrable.
