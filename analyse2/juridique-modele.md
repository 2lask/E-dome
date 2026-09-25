# Analyse juridique — le nouveau modèle d'affiliation

Droit suisse d'abord (art. 412-413 CO et les quatre règles de `src/lib/model/rules.ts`), puis
droit comparé pour la liste pays. Chaque affirmation est marquée **certain**, **probable** ou
**à vérifier/confirmer par un avocat** — même discipline que `analyse/juridique.md` et
`analyse2/juridique.md`, que cette note prolonge sans les répéter.

Sources lues : `src/lib/model/rules.ts`, `DECISIONS.md` (§1.0, §1.1, §1.7, §1.8, §6.1),
`DECISIONS-2.md` (D5, D13), `JURIDIQUE-A-VALIDER.md` (§1, §2, §4), `analyse/juridique.md`,
`analyse2/juridique.md`, `src/content/conditions.ts`, `src/lib/pricing/catalog.ts`. Le nouveau
modèle décrit par le fondateur n'existe dans aucun de ces fichiers ni dans le code : c'est une
proposition à analyser **avant** construction, conformément à la mission.

---

## Constat central — à lire avant tout le reste

Le programme apporteurs actuel (`DECISIONS.md` §1.7) tient sa relative sécurité juridique d'une
règle précise : *« Sur une commission d'agence, E-Dome ne prélève rien et ne reverse rien. »*
C'est cette abstention qui permet de dire qu'E-Dome **organise** du courtage sans **en tirer une
part** — le risque reste réel (`JURIDIQUE-A-VALIDER.md` §4 : « le risque pour E-Dome n'est pas
d'être courtière : c'est d'organiser et d'outiller du courtage »), mais il est contenu.

**Le mécanisme BIENS du nouveau modèle inverse exactement cette garde-fou.** E-Dome prélève
désormais un pourcentage (hyp. 15 %) **à l'intérieur** d'une prime versée par un vendeur à un
apporteur pour avoir amené un acheteur — une rémunération qui, à l'analyse de la Question A,
est très probablement elle-même du courtage. E-Dome ne se contente plus d'outiller une activité
d'intermédiation immobilière tierce : **elle en devient bénéficiaire direct et systématique**,
à hauteur d'un pourcentage fixe de chaque opération. C'est un changement de nature, pas de degré,
et c'est le point sur lequel cette note revient le plus souvent.

---

## A. « Mise en relation acceptée » et courtage (art. 412-413 CO)

### Le cadre, rappelé une fois

Art. 412 CO qualifie le courtage par l'**activité** : indiquer à autrui l'occasion de conclure
un contrat, ou lui servir d'intermédiaire pour le négocier, moyennant un salaire. Art. 413 CO ne
qualifie rien — il règle le **droit au salaire** du courtier, né en principe de la conclusion du
contrat visé. C'est du droit **dispositif** : rien n'empêche un contrat de courtage de prévoir un
salaire dû pour la seule indication, encaissable même si le contrat visé ne se conclut jamais.
Un tel arrangement reste un contrat de courtage — plus protecteur du courtier que le régime
légal par défaut, mais un courtage tout de même. C'est exactement la logique déjà actée dans
`rules.ts:20-21` : *« un forfait non conditionné versé à quelqu'un qui sert d'intermédiaire reste
du courtage. »* La question A demande si le nouveau mécanisme y échappe ; la réponse doit
partir de cette prémisse déjà posée par le dépôt, pas la rouvrir.

Il faut distinguer **deux positions différentes** dans le mécanisme : celle de l'apporteur, et
celle d'E-Dome.

### L'apporteur

**POUR (distinct du courtage).**
- L'objet rémunéré n'est pas la vente mais une étape antérieure et plus modeste : l'acceptation
  d'une visite. On peut soutenir qu'il s'agit d'un service de **mise en relation qualifiée**
  (matching), analogue à une prestation de génération de contacts vendue à prix fixe — un
  service que des portails vendent déjà à des agences sans être courtiers.
- Le montant est plafonné (1-10 000 CHF), jamais calculé en fonction du prix du bien : l'indice
  le plus visible d'un honoraire de succès déguisé (la proportionnalité) est structurellement
  absent, si le verrou de la Question B est effectif.
- Le paiement n'est dû ni exigible en fonction de la conclusion de la vente : sur le seul terrain
  de l'art. 413 CO (le droit au salaire), l'arrangement s'en écarte délibérément.

**CONTRE (courtage).**
- **C'est l'argument qui l'emporte.** Une demande de visite acceptée par un vendeur **est**
  l'occasion de conclure, au sens le plus littéral de l'art. 412 CO : le vendeur se retrouve en
  présence d'un acheteur potentiel identifié, par l'entremise de l'apporteur, contre rémunération.
  Il n'y a pas de différence de nature entre « indiquer un acheteur » et « faire accepter une
  visite à ce même acheteur » — la seconde formulation est même une preuve plus forte de
  l'activité d'indication que la première, puisqu'elle démontre que l'occasion a été
  **concrétisée**, non simplement suggérée.
- La non-conditionnalité au succès ne sauve rien, pour la raison exposée ci-dessus (art. 413 CO
  dispositif) et déjà actée dans `rules.ts` et `DECISIONS.md` §1.0. C'est un contresens de
  present la déconnexion d'avec la vente comme *la* réponse à la question du courtage : elle
  répond à une question différente (l'exigibilité du salaire), pas à celle de la qualification
  du contrat.
- Par analogie stricte avec ce que `analyse/juridique.md` §3 pose déjà comme **probable et traité
  comme certain** — *« un apporteur rémunéré pour avoir amené un vendeur à une agence est
  lui-même courtier »* — un apporteur rémunéré pour avoir amené un **acheteur** à un **vendeur**,
  sur une transaction immobilière directe, satisfait exactement le même critère. Le nouveau
  mécanisme est structurellement identique au cas déjà tranché ; il ne fait que déplacer le
  destinataire du service (le vendeur particulier au lieu d'une agence) et la forme du paiement
  (une prime en francs au lieu d'un pourcentage sur la commission).

**Verdict apporteur : probable, pas distinct.** L'apporteur agit très probablement comme
courtier (courtage d'indication) pour cette opération, indépendamment du verrouillage CHF et de
la déconnexion d'avec la conclusion. Les conséquences déjà identifiées pour le programme
apporteurs général s'appliquent : imposition du revenu, AVS si l'activité est régulière,
autorisation LFid probable au Tessin si l'apporteur y opère professionnellement, exposition à
l'art. 417 CO si le prix du bien est un immeuble et que le montant est jugé excessif au regard du
service rendu (peu probable vu le plafond de 10 000 CHF, mais pas à exclure pour les biens de
faible valeur).

### E-Dome

Les règles 1 et 2 (`rules.ts`) protègent formellement E-Dome tant qu'elle ne signe aucun mandat
et ne négocie ni ne sélectionne les parties elle-même — le mécanisme décrit (le vendeur fixe la
prime, accepte ou refuse lui-même la visite) respecte cela au sens strict, **si** E-Dome ne fait
que distribuer les demandes selon un critère objectif, sans jamais recommander tel acheteur à tel
vendeur. Sur ce point précis (mandat, négociation), le mécanisme est **distinct**.

Mais E-Dome ne s'arrête pas à outiller la relation : elle **prélève un pourcentage de la
rémunération de l'apporteur** — c'est-à-dire, si le paragraphe précédent est exact, un
pourcentage d'une rémunération de courtage. Prélever une part de la rémunération d'un tiers pour
un service de courtage qu'il a rendu est une configuration connue en droit du courtage — le
partage d'honoraires entre courtiers, ou entre un courtier et un apporteur d'affaires — et elle
n'est pas neutre : elle rapproche E-Dome d'un rôle de **courtier principal qui sous-traite
l'indication et se rémunère sur elle**, plutôt que d'un simple outil technique sans intérêt dans
l'issue. C'est un pas de plus que le programme apporteurs actuel, où la règle *« E-Dome ne
prélève rien sur une commission d'agence »* évitait précisément cette configuration.

**Verdict E-Dome : formellement distincte sur le mandat/négociation, mais exposée sur la
perception d'un pourcentage de ce qui est, en substance, une rémunération de courtage.** C'est un
risque d'organisation et de participation économique, pas d'exercice direct du courtage — mais
c'est un risque réel, plus élevé que celui déjà accepté pour le programme apporteurs vers les
agences, et il mérite d'être présenté à l'avocat comme tel, pas comme une variante mineure d'un
risque déjà validé.

---

## B. Le risque « 1 % »

Il faut séparer deux risques que la question, telle que posée, a tendance à confondre.

**Risque 1 — la qualification de courtage (Question A).** Il ne dépend pas du pourcentage
implicite que représente la prime. Un vendeur qui fixe spontanément sa prime à 1 % du prix ne
change rien à la nature de l'activité de l'apporteur (indiquer une occasion de conclure) : même à
250 CHF fixes sur un bien à 2,5 millions, l'apporteur reste probablement courtier au sens de
l'art. 412 CO. **Verrouiller le design contre le motif « 1 % » ne résout donc pas la Question A.**
C'est le point sur lequel cette note insiste : les mesures ci-dessous répondent au risque 2, pas
au risque 1.

**Risque 2 — la preuve de simulation et la loyauté commerciale.** Si les primes se regroupent
spontanément autour de 1 % du prix, un juge ou une autorité peut retenir, sur la base de l'art. 18
CO (interprétation selon la réelle et commune intention des parties, au-delà des termes
employés), que la forme « prime CHF non conditionnée » est un **habillage** d'une commission de
vente au pourcentage — surtout si en pratique les vendeurs n'acceptent que les visites des
acheteurs qu'ils jugent déjà sérieux, ce qui rapproche de facto l'« acceptation » de la
« probabilité de vente ». Ce risque-là s'ajoute au premier, il ne le remplace pas : même
totalement écarté par le design, la question A reste ouverte pour l'apporteur.

**Ce risque 2 est réel et le design peut l'écarter, concrètement :**

1. **Verrou structurel, pas seulement contractuel.** Le champ de saisie de la prime ne doit
   jamais accepter ni afficher un pourcentage, et surtout **ne doit jamais être pré-rempli,
   suggéré ou calculé à partir du prix du bien** — y compris à titre « indicatif » ou
   « d'aide à la décision ». Le moindre calcul serveur ou client reliant `prime` à `price` recrée
   le lien que le verrou doit rompre, même si le champ final reste un nombre en CHF.
2. **Plafond qui casse la corrélation, pas qui l'entérine.** 10 000 CHF représente environ 1 %
   d'un bien à un million — soit très exactement le prix médian suisse évoqué dans
   `DECISIONS.md` §1.4. Le plafond actuel **invite** à la lecture en pourcentage plutôt qu'il ne
   l'écarte. Deux options : (a) un plafond nettement plus bas et sans rapport avec les paliers de
   prix usuels (par exemple 2 000-3 000 CHF, qui ne « fait » 1 % que pour un bien à 200-300 000
   CHF, hors marché pour l'essentiel du parc suisse) ; (b) un plafond conservé mais accompagné
   d'un jeu de montants **préréglés et arrondis sans rapport avec des paliers de prix ronds**
   (ex. 180 / 420 / 890 / 1 800 CHF plutôt que 100 / 500 / 1 000 / 5 000 / 10 000), pour casser
   le réflexe mental de calcul en pourcentage. La seconde option est moins protectrice mais plus
   réaliste commercialement ; à trancher avec le fondateur, pas seule.
3. **Une seule prime par annonce, fixée à la publication, jamais par acheteur.** Si un vendeur
   pouvait fixer une prime différente selon l'acheteur (plus élevée pour un acheteur jugé
   sérieux), la prime deviendrait un indicateur de probabilité de vente — un pas de plus vers le
   succès déguisé. Le modèle doit imposer un montant unique, visible avant toute demande de
   visite, non modifiable une fois une demande en cours.
4. **Aucun mécanisme de complément.** Aucun écran, aucune fonctionnalité ne doit permettre un
   paiement additionnel « si la vente se conclut » — ni à l'apporteur, ni entre vendeur et
   acheteur via la plateforme. Les CGU doivent le dire explicitement : tout complément versé hors
   plateforme, conditionné à la conclusion, prive l'apporteur de l'accès au programme (sanction
   contractuelle, cohérente avec la logique anti-collusion déjà retenue pour les apporteurs trop
   contestés).
5. **Aucun affichage en pourcentage, nulle part** — ni pour le vendeur qui fixe la prime, ni pour
   l'apporteur qui estime son gain (à la différence du barème apporteur classique, dont
   `analyse/juridique.md` §3 exige au contraire l'assiette en pourcentage **dans la même
   phrase** ; ici c'est l'inverse qui protège, précisément parce que l'assiette n'est *pas* un
   pourcentage et ne doit jamais le devenir à l'écran).
6. **Traçabilité de la conception**, pour la défense en cas de litige : documenter (commit,
   décision) que le plafond et l'absence de suggestion en % sont des choix délibérés destinés à
   éviter la requalification — utile si un jour un juge examine l'intention du concepteur du
   système, pas seulement celle du vendeur individuel.

---

## C. Angles morts

### C1 — Le déclencheur « visite acceptée » est-il robuste ?

Il est robuste **contre le risque de conditionnalité** (art. 413 CO) : payer sur acceptation et
non sur conclusion évite mécaniquement qu'E-Dome ou l'apporteur touchent un honoraire de succès.
Il n'est **pas robuste comme garde-fou anti-contournement** :

- Un vendeur peut accepter une visite qu'il sait déjà acquise (accord informel préexistant avec
  l'acheteur) pour faire percevoir à un apporteur complice une prime sans rapport avec un
  véritable travail d'indication — la « visite » devient un prétexte purement formel. Rien dans
  le mécanisme décrit ne distingue une visite réellement provoquée par l'apporteur d'une visite
  déjà décidée entre vendeur et acheteur avant l'apport.
- « Acceptée » doit être un événement vérifiable et daté (confirmation de créneau, pas une simple
  case cochée), sinon le mécanisme ne résiste à aucune contestation — ni celle d'un vendeur qui
  nie avoir accepté, ni celle d'un régulateur qui voudrait vérifier qu'une transaction a
  réellement eu lieu.
- Rien n'est dit sur les visites multiples avec le même acheteur, ou sur la re-soumission d'une
  demande refusée puis acceptée plus tard sous une autre forme : sans règle « une prime par
  couple annonce-acheteur », le mécanisme peut être répété pour drainer plusieurs primes sur un
  même acheteur réel.

### C2 — Collusion vendeur/apporteur : qui paie qui, et pourquoi

Le flux décrit est clair sur un point : **c'est le vendeur qui paie**, E-Dome prélève sa part à
l'intérieur, l'apporteur reçoit le net. La collusion n'est donc pas un moyen d'extraire de
l'argent d'E-Dome (rien n'est subventionné dans le mécanisme lui-même) — elle est un moyen, pour
un vendeur, de **faire sortir de l'argent de son propre patrimoine vers un tiers complice sous
couvert d'un service légitime**. Trois motifs concrets, à couvrir par la détection :

1. **Blanchiment ou évasion informelle.** Le vendeur et l'« apporteur » sont en réalité liés
   (même personne via deux comptes, proches, prête-nom) ; la prime sert à faire transiter une
   somme sous une qualification commerciale couverte par une plateforme légitime, plutôt qu'un
   virement direct. Le seuil unique de 1 000 CHF ne l'arrête pas : plusieurs primes sous le seuil,
   entre le même couple de comptes ou un réseau de comptes liés, cumulent le même effet sans
   jamais déclencher la vérification renforcée. **Il faut une détection par paire et par
   cumul dans le temps, pas seulement par transaction isolée.**
2. **Fabrication de preuve sociale.** Un vendeur paie un apporteur complice pour générer des
   « demandes de visite acceptées » à répétition sur sa propre annonce, afin de la faire
   apparaître plus demandée qu'elle ne l'est auprès des acheteurs réels — l'inverse de
   l'extraction d'argent (le vendeur dépense), mais un motif réel : le coût (prime nette de la
   part d'E-Dome) est un investissement marketing détourné, potentiellement une pratique
   commerciale trompeuse (art. 3 LCD) si l'affichage du nombre de visites sert d'argument de
   crédibilité.
3. **Gonflement du profil d'un apporteur** (volume, badge, ancienneté) en vue d'obtenir un accès
   privilégié futur (paliers, visibilité) — motif indirect, à surveiller via les mêmes signaux
   de concentration.

**Recommandation concrète, au-delà du seuil de 1 000 CHF déjà prévu** : détection par
concentration (un même couple vendeur-apporteur revient anormalement souvent), par empreinte
partagée (IP, appareil, coordonnées de paiement communes entre comptes formellement distincts),
et par ratio prime/valeur affichée (qui recoupe aussi la Question B). La validation manuelle
au-dessus de 1 000 CHF est nécessaire mais insuffisante seule.

### C3 — Protection des données

- **Timing de l'identité de l'acheteur.** Le modèle des demandes d'accompagnement (`DECISIONS.md`
  §2.3) protège en gardant l'acheteur anonyme jusqu'à ce que le vendeur agisse, puis n'ouvre
  l'identité qu'à ce moment. Le nouveau mécanisme doit suivre le **même patron** : le vendeur doit
  pouvoir juger la demande de visite (type de bien recherché, sérieux déclaré, financement) sans
  voir l'identité complète de l'acheteur avant d'accepter — sinon le nouveau mécanisme expose plus
  de données, plus tôt, que celui déjà validé pour un cas structurellement proche. À confirmer
  dans la conception produit, pas seulement dans cette note.
- **KYC renforcé au-dessus de 1 000 CHF.** Minimisation à observer (ne pas conserver les copies de
  pièces d'identité au-delà du nécessaire, comme déjà noté dans `analyse/juridique.md` §5) ;
  finalité déclarée et distincte du consentement CGU.
- **Score de contestation de l'apporteur** (« trop contesté perd l'accès ») : c'est un traitement
  de données qui produit un effet sur l'accès d'une personne à un service, sur la base d'un
  historique de litiges — il doit reposer sur un critère objectif et publié, avec une possibilité
  de contester la décision avant la perte d'accès (loyauté contractuelle ordinaire ; pas
  spécifiquement de la nLPD tant qu'il n'y a pas de décision automatisée au sens strict, mais le
  principe de bonne foi et l'art. 8 LCD sur les pratiques déloyales imposent la même rigueur).
- **Transferts transfrontières.** Les données KYC d'apporteurs ou de vendeurs domiciliés hors de
  Suisse et hors zone reconnue équivalente par le PFPDT (les Émirats arabes unis n'y figurent pas,
  **à vérifier** pour le Maroc) exigent une base de transfert (clauses contractuelles types ou
  équivalent) — point neuf par rapport à `analyse/juridique.md`, qui ne traitait pas de KYC
  transfrontière.
- **Filtrage des sanctions (SECO)** déjà signalé comme question ouverte pour le programme
  apporteurs général ; il s'applique avec une acuité accrue ici, puisque des sommes plus élevées
  (jusqu'à 10 000 CHF) transitent vers des personnes physiques, potentiellement à l'étranger.

### C4 — Marketplace % conditionnée à la vente d'une formation/prestation : pas du courtage immobilier

**Confirmé, avec une nuance à ne pas perdre.** Une commission d'affiliation payée par un créateur
à un apporteur, déclenchée par la vente d'une formation, d'un live, d'un événement ou d'une
prestation, satisfait certes la définition générale de l'art. 412 CO au sens le plus large (« une
occasion de conclure **un contrat** », sans restriction à l'immobilier) — mais **le régime
protecteur qui rend le courtage immobilier sensible ne s'y applique pas** :

- Art. 417 CO (réduction judiciaire du salaire excessif) vise, texte à l'appui, **la vente
  d'immeuble et le contrat individuel de travail**, et rien d'autre — pas une formation, pas un
  abonnement à un live.
- Les régimes cantonaux d'autorisation identifiés (LFid tessinoise notamment) visent le
  « fiduciario immobiliare » — la médiation immobilière — pas le marketing d'affiliation de
  produits numériques ou d'événements.
- Aucune protection spécifique de l'acheteur d'un immeuble (Lex Koller, formule du loyer initial,
  garantie de loyer) ne trouve à s'appliquer à la vente d'une formation.

C'est donc, juridiquement, de l'**affiliation commerciale ordinaire** — un mécanisme aussi répandu
et non spécifiquement réglementé que celui de Whop, Amazon Associates ou Awin — soumise au droit
commun (LCD sur l'étiquetage du contenu sponsorisé/affilié, fiscalité du revenu de l'apporteur,
et le cas échéant déclaration DAC7/plateforme dans l'UE, déjà signalée comme point ouvert dans
`JURIDIQUE-A-VALIDER.md` §6 pour un autre sujet et qu'il faut étendre à ce mécanisme). Seule
réserve : si un « service » de la marketplace se rapprochait d'une prestation immobilière (par
exemple, home staging vendu comme « service » à un vendeur en cours de mise en vente), la
frontière avec le volet BIENS redeviendrait floue et mériterait un contrôle au cas par cas — pas
un problème aujourd'hui, mais un point de vigilance pour le catalogue futur de `services`.

---

## D. Cohérence avec les quatre règles et avec D5 (boutique/affiliation)

**Règle 1 (aucun mandat).** Tenue au sens strict pour E-Dome tant que la distribution des
demandes de visite reste automatique et non discrétionnaire (même logique que §2.3 pour les
demandes d'accompagnement). Point de vigilance : la validation manuelle des transactions
> 1 000 CHF ne doit porter que sur la conformité anti-fraude (KYC, cohérence, collusion), jamais
sur une appréciation du bien-fondé de la mise en relation — sinon E-Dome commence à exercer un
jugement qui ressemble à celui d'une partie au dossier.

**Règle 2 (aucune négociation).** Tenue tant qu'E-Dome ne sélectionne ni ne recommande d'acheteur
à un vendeur. La procédure de contestation (« contact pas sérieux », remboursement plafonné)
doit rester procédurale et fondée sur des critères objectifs et publiés — pas un arbitrage au cas
par cas sur le fond du différend, qui glisserait vers un rôle de médiateur de la relation
commerciale sous-jacente.

**Règle 3 (rémunération non conditionnée à la vente/au bail).** Respectée **à la lettre** : la
part d'E-Dome est due dès l'acceptation de la visite, jamais liée à la conclusion. Mais c'est ici
que le Constat central reprend toute son importance : la règle 3 protège la rémunération
**d'E-Dome**, elle ne dit rien sur la nature de ce sur quoi E-Dome se rémunère. E-Dome peut
respecter la règle 3 à la lettre tout en prélevant un pourcentage d'une rémunération qui, elle,
est probablement du courtage (Question A). La cohérence formelle avec la règle 3 ne doit pas être
lue comme une validation du mécanisme dans son ensemble.

**Règle 4 (jamais dépositaire des fonds).** C'est le point le plus concrètement fragilisé par le
nouveau modèle, et il n'est **pas couvert** par l'arbitrage encore ouvert en `DECISIONS.md` §6.1
(qui porte sur les pôles marketplace/abonnements). La validation manuelle obligatoire au-dessus de
1 000 CHF implique, par construction, qu'E-Dome (ou son prestataire) retienne les fonds **le
temps de l'examen** — pas les « quelques secondes de transit » que la position de travail
(frais directs) tolère au sens de l'art. 5 al. 3 let. c de l'ordonnance sur les banques. Un examen
manuel peut durer des heures, voire des jours en cas de contrôle anti-collusion approfondi.
**C'est un point neuf à ajouter explicitement à l'arbitrage frais directs/frais destinataires** :
le mécanisme prime-CHF ne peut probablement pas fonctionner en frais directs purs si une
validation humaine s'intercale avant le paiement — il faut soit un flux où le vendeur paie
directement l'apporteur avec E-Dome facturant sa part séparément (frais réellement directs, mais
alors la KYC/collusion doit être faite **avant** que le vendeur puisse payer, pas après), soit
assumer un transit contrôlé et le documenter précisément (durée maximale, absence d'intérêt,
absence de libre disposition) pour rester dans les bornes de l'ordonnance sur les banques.

**Cohérence avec D5 (boutique en affiliation, `DECISIONS-2.md`).** Le mécanisme MARKETPLACE
(% fixé par le vendeur, sortant de sa marge, déclenché par la vente) est compatible avec la
logique de D5 pour les pôles déjà commissionnés par E-Dome (formations, lives, événements,
services, courte durée) : E-Dome traite déjà ces paiements, ajouter une part d'affiliation ne
change rien à son statut de vendeur apparent, déjà assumé pour ces pôles. **Pour la Boutique
spécifiquement, la compatibilité n'est pas automatique.** D5 tient précisément parce qu'E-Dome ne
touche aucun fonds et ne conclut aucun contrat de vente de biens (art. 20a LTVA). Si le mécanisme
d'affiliation par produit exige qu'E-Dome **encaisse** la commission du marchand pour la reverser
à l'apporteur, E-Dome redevient un point de passage de fonds sur la Boutique — exactement ce que
D5 a été conçu pour éviter. La solution technique existe (suivi de conversion par lien traçable
ou pixel, à la manière d'un réseau d'affiliation classique, sans qu'E-Dome ne touche l'argent :
le marchand règle l'apporteur directement, ou via son propre prestataire de paiement) mais elle
doit être choisie **explicitement**, pas seulement supposée, sans quoi la Boutique retombe dans
le même défaut que celui déjà relevé dans `analyse2/juridique.md` §1.1 (le produit contredit sa
propre décision de conception).

**Un problème transversal, indépendant du fond juridique.** Le mot « apporteur » recouvre
désormais **trois mécanismes de nature différente** : le partage de revenu sur abonnement
(10-30 % du revenu net d'E-Dome, 12 mois — inchangé), la prime CHF sur mise en relation immobilière
(nouveau, probablement du courtage pour l'apporteur), et la commission d'affiliation marketplace
(fixée par le vendeur, hors assiette E-Dome — affiliation commerciale ordinaire). Les traiter sous
une seule section de CGU ou un seul écran de déclaration, comme le fait aujourd'hui
`src/content/conditions.ts` §7, **effacerait des distinctions que cette note vient d'établir avec
soin**. Les formulations exactes déjà rédigées pour l'apporteur (`analyse/juridique.md` §3, formules
A à D) ont été écrites pour le mécanisme d'abonnement/commission d'agence ; elles ne couvrent pas,
telles quelles, le risque spécifique de la prime immobilière (qui devrait dire à l'apporteur,
explicitement, qu'il agit probablement comme courtier sur cette opération précise — une mise en
garde plus directe que celles déjà rédigées).

---

## E. Liste pays

Deux volets distincts : BIENS = la prime CHF sur mise en relation immobilière (exposée à la
réglementation du courtage) ; MARKETPLACE = la commission d'affiliation sur formations, lives,
événements, services, courte durée, boutique (affiliation commerciale ordinaire, hors courtage
immobilier — Question C4).

| Pays | BIENS (prime CHF) | MARKETPLACE (%) |
| --- | --- | --- |
| **Suisse** | À adapter. Probable courtage pour l'apporteur (Question A) ; LFid tessinoise si l'apporteur y opère professionnellement ; Genève/Vaud non vérifiés (ne rien affirmer dans les CGU, cf. `DECISIONS.md` §6.2). Praticable seulement avec les verrous de la Question B, une mise en garde spécifique à l'apporteur, et validation avocat — pas un simple prolongement du programme apporteurs déjà accepté. | OK. Affiliation ordinaire, fiscalité et AVS via la déclaration apporteur déjà prévue. |
| **France** | Exclu. Loi Hoguet (carte T) : l'« entremise » couvre l'activité de mise en relation active pour une transaction immobilière contre rémunération, indépendamment de la conditionnalité au succès. Le mécanisme (demande de visite provoquée, acceptée, payée) est plus proche de l'entremise que le cas déjà tranché (portail à 1 %, CA Dijon 2009, antérieur à ALUR) qui a justifié le blocage actuel des apports immobiliers français — ce nouveau mécanisme doit rester couvert par ce même blocage, sans exception. Exercice illégal pénalement sanctionné. | OK. Affiliation hors champ Hoguet ; étiquetage publicitaire (Code de la consommation) et déclaration DAC7 pour un apporteur résident français (à confirmer — voir aussi le point DAC7/DPI déjà ouvert dans `JURIDIQUE-A-VALIDER.md` §6, à étendre à ce mécanisme). |
| **Allemagne** | Exclu par défaut. Activité de courtage soumise à autorisation professionnelle (§34c GewO, **à vérifier** le libellé exact) et la vente immobilière résidentielle est spécifiquement encadrée depuis 2020 (répartition légale des frais de courtage acheteur/vendeur, **à vérifier** la référence exacte) — un régime taillé pour empêcher justement ce que la prime ferait indirectement. | OK. Affiliation courante et licite (Affiliate-Marketing), étiquetage publicitaire (UWG) et déclaration plateforme (PStTG, transposition allemande de DAC7 — à confirmer). |
| **Portugal** | Exclu par défaut. Médiation immobilière soumise à licence AMI (Lei n.º 15/2013, **à vérifier** la référence exacte) délivrée par l'IMPIC ; pas de voie de conformité identifiée sans licence locale. | OK. Affiliation ordinaire, droit de la consommation portugais et DAC7 (Portugal, membre UE). |
| **UK** | À adapter, prudence forte. Estate Agents Act 1979 : le « estate agency work » couvre l'introduction d'acheteurs potentiels contre rémunération dans le cadre d'une activité commerciale — obligation d'adhérer à un schéma de recours (ex. The Property Ombudsman) et Money Laundering Regulations 2017 (secteur régulé, enregistrement HMRC). Pas de carte professionnelle comme en France/au Portugal, mais un cadre de conformité réel — à traiter comme bloqué par défaut jusqu'à confirmation locale, non comme automatiquement praticable. | OK. Affiliate marketing très répandu, encadré par le CAP Code (étiquetage) et le régime britannique de déclaration des plateformes (équivalent DAC7, effectif depuis les revenus 2024 — à confirmer). |
| **UAE (RERA)** | À adapter — voie identifiée, pas ouverte par défaut. Catégorie « International Broker » au registre RERA (règlement de Dubaï n° 85 de 2006) potentiellement praticable pour l'apporteur ou pour E-Dome elle-même en tant qu'organisatrice, mais **par émirat** (Dubaï ≠ Abou Dhabi ≠ Sharjah) et à confirmer avec un avocat local avant toute ouverture. Rester sur le blocage déjà retenu (`DECISIONS.md` §1.7) pour ce nouveau mécanisme aussi. | OK, avec vigilance. Pas de régime spécifique pour l'affiliation de produits numériques ; PDPL (loi fédérale sur les données) pour les données de l'apporteur ; filtrage sanctions recommandé par prudence sur les flux de paiement sortants. |
| **Maroc** | À adapter — à vérifier spécifiquement. Régulation de la profession d'agent immobilier en évolution (carte professionnelle en discussion/introduite selon les sources, **à vérifier précisément**) ; marché historiquement peu formalisé, ce qui n'est pas une garantie d'absence de risque. Conserver le blocage par défaut déjà retenu pour les apports immobiliers hors Suisse/France/UAE. | OK, avec un point opérationnel. Affiliation non spécifiquement réglementée ; réglementation des changes marocaine (Office des Changes) à vérifier pour le versement de commissions à des apporteurs marocains — point de flux plus qu'un point de courtage. |

**Lecture d'ensemble.** Le volet MARKETPLACE est praticable dans les sept pays sans obstacle de
principe : c'est de l'affiliation commerciale ordinaire, et la seule discipline à tenir est
fiscale/déclarative (DAC7 et équivalents) et publicitaire (étiquetage). Le volet BIENS est, à
l'inverse, praticable **nulle part sans réserve** : même en Suisse, où le mécanisme est le plus
proche de ce qu'E-Dome pratique déjà, la Question A conclut à un risque de courtage probable pour
l'apporteur. Les Émirats arabes unis sont le seul pays hors Suisse où une **voie de conformité**
est identifiée (RERA) plutôt qu'un blocage pur — mais elle reste à activer, pas déjà ouverte.

---

## Désaccords et corrections que j'apporte au cadrage de la question

1. **La Question A, telle que posée, présuppose que la déconnexion d'avec la conclusion de la
   vente pourrait suffire à distinguer le mécanisme du courtage.** Ce n'est pas le cas, et le
   dépôt le sait déjà (`rules.ts`, `DECISIONS.md` §1.0) : c'est l'activité, pas l'exigibilité, qui
   qualifie. Je corrige le cadrage plutôt que de le suivre : la bonne question n'est pas « la
   prime échappe-t-elle au courtage parce qu'elle n'est pas conditionnée ? » (non), mais
   « l'activité de l'apporteur (indiquer/provoquer une visite acceptée) échappe-t-elle au
   courtage ? » (probablement non non plus).
2. **La Question B traite le risque « 1 % » comme LE risque du mécanisme.** Ce n'en est qu'un
   des deux, et le second (simulation/preuve) plutôt que le premier (qualification). Écarter le
   risque 1 % par le design est nécessaire mais ne rend pas le mécanisme sûr — je le dis
   explicitement pour éviter que les mesures de la Question B soient lues comme une réponse à la
   Question A.
3. **Le mécanisme BIENS n'est pas une extension mineure du programme apporteurs existant : c'est
   un changement de risque de nature**, parce qu'E-Dome, pour la première fois, prélève un
   pourcentage direct sur une rémunération d'intermédiation immobilière plutôt que de s'en tenir
   à l'écart (comme elle le fait pour les commissions d'agence). Je place ce point en tête de
   cette note plutôt qu'en conclusion, parce que c'est la conclusion la plus importante, pas un
   détail parmi d'autres.
4. **Le nom unique « apporteur » recouvre trois mécanismes de risque différent** (abonnement,
   prime biens, affiliation marketplace) ; les traiter comme une seule catégorie contractuelle,
   avec une seule déclaration et une seule section de CGU, dilue des distinctions que cette
   analyse — et les précédentes — ont pris soin d'établir.
5. **Le seuil unique de 1 000 CHF pour la vérification renforcée est insuffisant seul** contre la
   collusion : il faut une détection par paire de comptes et par cumul, pas seulement par
   transaction. Je le signale comme correction plutôt que comme option, parce que le seuil isolé
   donne une fausse impression de couverture.

---

## Bloc prêt à coller en tête de `JURIDIQUE-A-VALIDER.md`

*(à insérer avant la section « 1. La reformulation de la règle 3 », comme nouvelle section
« 0. Le nouveau modèle d'affiliation — prime CHF (biens) et pourcentage (marketplace) »)*

> ## 0. Le nouveau modèle d'affiliation — prime CHF (biens) et pourcentage (marketplace)
>
> **Contexte.** Un nouveau mécanisme est envisagé, distinct du programme apporteurs actuel.
> Sur les biens (vente et location longue durée), le vendeur fixe une prime en francs
> (1 à 10 000 CHF) versée à un apporteur lorsqu'il **accepte** une demande de visite que
> l'apporteur lui a amenée — jamais un pourcentage du prix, jamais conditionné à la conclusion
> de la vente. E-Dome prélève un pourcentage (hypothèse 15 %) à l'intérieur de cette prime. Sur
> la marketplace (formations, lives, événements, services, courte durée, boutique), le vendeur
> ouvre son produit à l'affiliation et fixe un taux sortant de sa propre marge, déclenché par la
> vente du produit — inchangé dans sa logique par rapport à la commission E-Dome existante.
>
> **Question 1 — la prime biens est-elle distincte du courtage (art. 412-413 CO) ?** Notre
> analyse de travail conclut que non, très probablement, **pour l'apporteur** : une demande de
> visite acceptée est l'indication d'une occasion de conclure au sens de l'art. 412 CO, et la
> déconnexion d'avec la conclusion de la vente (art. 413 CO) n'écarte pas la qualification — elle
> écarte seulement la conditionnalité du salaire, question distincte, comme déjà établi pour la
> règle 3 (`rules.ts`). Pour E-Dome elle-même, les règles 1 et 2 (aucun mandat, aucune
> négociation) tiennent formellement, **mais** E-Dome prélève désormais un pourcentage direct
> d'une rémunération d'apporteur qui est elle-même probablement du courtage — une configuration
> distincte, et plus exposée, du programme apporteurs actuel, où E-Dome ne prélève rien sur les
> commissions d'agence. **À confirmer, en particulier : l'apporteur doit-il être averti qu'il
> agit probablement comme courtier sur cette opération précise ? E-Dome, en prélevant un
> pourcentage de la prime, prend-elle un risque de participation au courtage distinct de celui
> déjà accepté pour le programme apporteurs vers les agences ?**
>
> **Question 2 — le risque « 1 % ».** Si les vendeurs fixent spontanément leur prime autour de
> 1 % du prix du bien, le mécanisme peut être lu comme une commission de vente déguisée
> (art. 18 CO, simulation). Des verrous de conception sont envisagés : montant en CHF non
> indexable au prix, sans suggestion ni calcul basé sur le prix ; plafond dont la valeur ne doit
> pas correspondre à un pourcentage rond des prix usuels du marché suisse (10 000 CHF sur un
> bien à un million EST 1 %, ce qui doit être corrigé) ; une seule prime par annonce, fixée à la
> publication, jamais ajustée par acheteur ; aucun mécanisme de complément conditionné à la
> vente ; aucun affichage, nulle part dans l'interface, d'un pourcentage équivalent. **À
> confirmer : ces verrous suffisent-ils à écarter le risque de requalification par simulation ?
> Étant entendu qu'ils ne répondent pas à la Question 1, qui reste ouverte même avec des verrous
> parfaits.**
>
> **Question 3 — liste pays.** Volet biens (prime) : praticable en Suisse seulement avec les
> verrous ci-dessus et une mise en garde spécifique à l'apporteur (risque analysé comme probable
> courtage) ; à exclure en France (loi Hoguet, carte T — le mécanisme de mise en relation active
> est plus exposé que le cas de portail à 1 % déjà écarté par prudence) et au Portugal (licence
> AMI) ; à exclure par défaut en Allemagne (§34c GewO et régime spécifique de répartition des
> frais de courtage résidentiel — références à vérifier) et au Royaume-Uni (Estate Agents Act
> 1979, Money Laundering Regulations 2017 pour le secteur immobilier) sauf confirmation locale ;
> aux Émirats arabes unis, une voie de conformité existe (catégorie « International Broker »,
> registre RERA de Dubaï — à vérifier émirat par émirat) mais n'est pas ouverte par défaut ; au
> Maroc, régime en évolution, à vérifier spécifiquement avant toute ouverture. Volet marketplace
> (pourcentage) : praticable dans les sept pays sans obstacle de principe identifié — affiliation
> commerciale ordinaire, hors régime spécifique du courtage immobilier ; réserves fiscales et
> déclaratives seulement (DAC7 et équivalents nationaux pour les pays de l'UE/UK, à confirmer
> pour chaque juridiction). **À confirmer, pays par pays, en particulier Allemagne, Royaume-Uni
> et Maroc, où aucune source de première main n'a été vérifiée dans cette analyse de travail.**
