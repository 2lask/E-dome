# Questions à valider par un avocat

Document destiné à un conseil juridique suisse. Chaque point porte : la
question précise, l'enjeu, la position retenue à ce jour, et **ce qui change si
elle tombe**.

Le raisonnement complet est dans [`analyse/juridique.md`](analyse/juridique.md),
les arbitrages dans [`DECISIONS.md`](DECISIONS.md). Rien de ce qui suit n'a été
validé par un professionnel : ce sont des positions de travail, prises pour
pouvoir avancer, et conçues pour être réversibles.

**Contexte.** E-Dome est une plateforme immobilière suisse en construction,
sans société constituée à ce jour. Elle se présente comme un réseau
professionnel avec une couche transactionnelle, et non comme une agence. Quatre
règles fondent le modèle :

1. E-Dome ne signe aucun mandat.
2. E-Dome ne négocie aucun prix.
3. E-Dome ne perçoit aucune rémunération dont le montant ou l'exigibilité
   dépend de la conclusion d'une vente ou d'un bail.
4. E-Dome n'est jamais dépositaire des fonds de ses utilisateurs.

---

## 1. La reformulation de la règle 3 — et le rang des règles 1 et 2

**Question.** La formulation suivante protège-t-elle effectivement du
requalification en courtage, et les règles 1 et 2 suffisent-elles à couvrir le
critère de l'activité ?

> E-Dome ne perçoit aucune rémunération dont le **montant** ou l'**exigibilité**
> dépend de la conclusion d'une vente ou d'un bail d'habitation ou de locaux
> commerciaux. Ses prix sont fixés à l'avance, dus indépendamment du résultat,
> et identiques pour tous les utilisateurs d'une même formule.

**Enjeu.** Tout le modèle économique. Si E-Dome est courtier : responsabilité
pour conseil (art. 398 CO), révocabilité du mandat (art. 404 CO), réduction
judiciaire des commissions excessives sur les ventes d'immeubles (art. 417 CO,
droit impératif), double courtage quasi systématique (art. 415 CO), autorisation
cantonale dans certains cantons — et position de concurrente de ses propres
clientes agences.

**Position retenue.** Le cahier des charges initial affirmait qu'« une
rémunération proportionnelle et conditionnée à la conclusion correspond au
courtage (art. 412 et 413 CO) ». Notre analyse conclut que c'est inexact :
l'art. 412 CO définit le courtage par l'**activité** — indiquer une occasion de
conclure, ou servir d'intermédiaire pour la négociation, moyennant salaire — et
ne dit rien du mode de calcul ; l'art. 413 CO règle le droit au salaire et ne
qualifie rien. Conséquences retenues :

- un **forfait conditionné à la vente** est du courtage, et c'est le montage le
  plus dangereux — celui que la règle d'origine laissait passer ;
- un **pourcentage non conditionné**, assis sur un stock (biens actifs, sièges,
  volume publié) et non sur le produit de transactions conclues, n'est pas du
  courtage ;
- **la règle 3 ne protège de rien à elle seule.** Ce sont les règles 1 et 2 qui
  portent le critère de l'activité. Un forfait non conditionné versé à
  quelqu'un qui sert d'intermédiaire resterait du courtage.

**Sous-questions.**

- La qualification d'un **abonnement indexé sur le volume** (nombre de biens
  actifs, nombre d'agents) est-elle bien hors courtage, dès lors qu'il est dû
  indépendamment de toute conclusion ?
- L'argument « E-Dome fait comme les portails suisses, qui vendent de la
  visibilité à prix fixe » tient-il, sachant que les portails **n'organisent pas**
  de programme d'apporteurs rémunérés, **n'attribuent pas** de demandes
  d'accompagnement et **ne délivrent pas** de badge professionnel ?
- Un abonnement d'agence présenté comme donnant « accès aux vendeurs qui nous
  ont sollicités » redevient-il une rémunération pour l'indication d'occasions
  de conclure — payée par l'agence au lieu du particulier ?

**Si la position tombe.** Trois issues, par ordre de coût croissant : retirer le
prix indexé au volume du catalogue de formules (coût limité, il n'est pas encore
vendu) ; revoir la distribution des demandes d'accompagnement, dont dépend
l'argument de vente numéro un de l'Espace agence (coût élevé — voir §5) ;
assumer le statut de courtier, ce qui contredit le positionnement entier et la
promesse faite aux agences.

---

## 2. Frais directs ou frais destinataires — le choix le plus structurant

**Question.** Lequel des deux schémas d'encaissement est compatible avec la
règle 4, et quelles en sont les conséquences en matière de TVA et de
responsabilité ?

**Enjeu.** Avec les **frais destinataires**, les fonds transitent par le compte
de plateforme et E-Dome devient **vendeur apparent**. C'est exactement le
critère qui, sur les biens, déclenche l'art. 20a LTVA (§3). Avec les **frais
directs**, la promesse commerciale « taux tout compris » tombe : le prestataire
débite le vendeur, qui voit deux prélèvements.

| | Frais directs | Frais destinataires |
| --- | --- | --- |
| Règle 4 | Respectée au sens strict | Fragilisée : transit, même bref |
| Vendeur apparent | Le vendeur | **E-Dome** |
| TVA | Chacun facture sa part | Risque de facturer le prix entier |
| Responsabilité | Entre acheteur et vendeur | E-Dome exposée |
| Frais du prestataire | Au vendeur | Absorbés par E-Dome |
| Promesse « tout compris » | Tombe | Tenable |

**Position retenue.** **Frais directs par défaut**, parce que c'est l'option qui
respecte la règle 4 au sens strict. Le modèle de données représente les deux :
le panneau de flux d'argent porte une ligne « frais de paiement » distincte.

**Sous-questions.**

- Un transit de quelques secondes par le solde d'un prestataire agréé, sans
  libre disposition, sans intérêt et avec reversement immédiat, est-il
  compatible avec la règle 4 et hors du champ des dépôts du public ? Notre
  lecture retient les bornes de l'art. 5 al. 3 let. c de l'ordonnance sur les
  banques — aucun intérêt, exécution sous 60 jours. **À confirmer.**
- Le statut de vendeur apparent emporte-t-il, hors biens physiques, une
  responsabilité sur la conformité de la prestation ?
- La formulation de la règle 4 ci-dessous est-elle exacte dans les deux
  schémas ?

> E-Dome n'est jamais dépositaire des fonds de ses utilisateurs. Les paiements
> sont exécutés par un prestataire agréé. E-Dome ne dispose librement d'aucune
> somme appartenant à un utilisateur, ne verse aucun intérêt et ne conserve
> aucun solde : tout montant destiné à un tiers lui est reversé sans délai.

**Si la position tombe** (c'est-à-dire si les frais destinataires sont imposés
ou interdits) : dans un sens, la ligne « frais de paiement » apparaît séparément
sur chaque écran et le discours passe de « 12 %, tout compris » à « 12 % plus
les frais de votre prestataire » — environ **3,15 points** de taux perçu en
moins sur chaque pôle, ou un taux affiché plus élevé. Dans l'autre, il faut
réexaminer l'exposition TVA et de responsabilité sur l'ensemble des pôles, pas
seulement la boutique.

---

## 3. TVA — formations et boutique

**Question a) — art. 20a LTVA et boutique.** L'article répute l'exploitant
d'une plateforme fournisseur de la prestation lorsqu'il facilite une
**livraison de biens** au point que vendeur et acheteur concluent le contrat sur
la plateforme. Confirmez-vous qu'il vise les **biens** et non les services,
l'hébergement et les formations ?

**Enjeu.** Si l'article s'étend au-delà des biens, E-Dome devrait facturer le
prix entier avec TVA sur plusieurs pôles et en répondre — ce qui détruit
l'économie du modèle et contredit la règle 4.

**Position retenue.** La boutique reste en **affiliation seule** : E-Dome ne
facilite aucune livraison, ne conclut aucun contrat de vente de biens et
n'encaisse rien. C'est le **motif principal** de cette décision, avant tout
motif stratégique.

**Question b) — formations et prestataires étrangers.** La commission d'E-Dome
est une prestation de services, taxée à 8,1 % lorsque le destinataire est en
Suisse. Pour un créateur ou un hôte domicilié hors de Suisse, notre lecture
place la prestation au lieu du destinataire, donc **hors champ suisse**, avec
auto-liquidation chez lui. **À confirmer**, y compris la base d'article.

**Question c) — assujettissement et impôt sur les acquisitions.** Nous
envisageons un assujettissement volontaire dès le premier jour : une trentaine
d'abonnements d'agence franchissent déjà le seuil de 100 000 CHF, et l'impôt sur
les acquisitions frappe les services électroniques achetés à l'étranger — les
factures d'API d'intelligence artificielle comprises — au-delà d'un seuil que
nous croyons être de 10 000 CHF par an. **À confirmer.**

**Question d) — TTC ou HT.** Notre position : prix **TTC** aux particuliers
(prix effectivement à payer), **HT avec TVA séparée** aux professionnels, qui la
déduisent. Confirmez-vous l'obligation d'afficher TTC au consommateur, et sa
base ?

**Si la position tombe.** Sur (a) : le pôle boutique disparaît entièrement au
lieu de rester en affiliation, et l'exposition doit être réexaminée sur les
autres pôles. Sur (b) : il faut un traitement TVA **par transaction** et non un
taux global — le modèle de données le prévoit déjà par un champ dédié, mais les
écrans de prix changent. Sur (d) : tous les prix affichés changent de base.

---

## 4. Le programme apporteurs

**Question.** Le dispositif ci-dessous expose-t-il E-Dome à être regardée comme
organisant du courtage, et les formulations affichées sont-elles suffisantes ?

**Enjeu.** Notre analyse retient qu'un apporteur rémunéré pour avoir amené un
vendeur à une agence **est lui-même courtier** (courtage d'indication). Le
risque pour E-Dome n'est pas d'être courtière : c'est **d'organiser et
d'outiller** du courtage et d'en percevoir une part.

**Position retenue.**

- **Assiette** : le revenu **net encaissé par E-Dome, hors TVA, après frais de
  paiement**. Jamais un pourcentage du prix payé par le client.
- **Sur une commission d'agence, E-Dome ne prélève rien et ne reverse rien.**
  Elle ne calcule pas, ne suggère aucun barème, n'affiche aucune estimation, ne
  garantit rien, n'encaisse rien : l'outil enregistre ce que l'agence déclare.
- **Prime fixe** admise, mais versée seulement après un premier encaissement
  réel, et sur un critère d'activation objectif, vérifiable et **affiché avant
  l'apport**.
- **Pas de parrainage à deux niveaux** : profondeur bornée à 1 par
  construction. Base invoquée : la vente en boule de neige visée par la LCD —
  **lettre exacte à vérifier**.
- **Déclaration obligatoire avant le premier lien** : pays de résidence fiscale,
  particulier ou entreprise avec numéro IDE, engagement de ne pas négocier ni
  représenter.
- **Restriction géographique en `pays × type d'apport`** : Suisse ouvert (avec
  avertissement au Tessin) ; France et Émirats arabes unis, apport lié à une
  transaction **immobilière** désactivé ; ailleurs, apports immobiliers bloqués
  par défaut, apports non immobiliers ouverts.

**Sous-questions.**

- L'apporteur doit-il un statut ou une déclaration réglementaire ? Au-delà de
  quel seuil un numéro IDE devient-il exigible ?
- Sa rémunération relève-t-elle de l'AVS si l'activité est régulière, et de la
  TVA ?
- Le blocage en France est-il justifié ? Notre analyse relève un arrêt de la
  Cour d'appel de Dijon du 19 février 2009 jugeant qu'un site diffusant des
  annonces, rémunéré 1 % du prix en cas de vente, ne faisait pas d'entremise au
  sens de la loi Hoguet — mais c'est une cour d'appel, en 2009, avant ALUR, et
  l'exercice illégal est pénalement sanctionné. Nous maintenons le blocage par
  prudence, en tant qu'**organisateur** du réseau depuis la Suisse.
- Aux Émirats, le règlement de Dubaï n° 85 de 2006 prévoit une catégorie
  « International Broker » au registre RERA : est-ce une voie de conformité
  praticable, et le régime est-il bien émirat par émirat ?
- Des obligations de filtrage des sanctions (SECO) s'appliquent-elles à une
  plateforme non financière qui verse des sommes à des personnes physiques à
  l'étranger ?

**Les quatre formulations que nous prévoyons d'afficher** figurent au §3 de
`analyse/juridique.md`. Elles disent à l'apporteur ce que **lui** risque, et non
ce qu'E-Dome n'est pas. Merci de les relire mot pour mot.

**Si la position tombe.** Le programme apporteurs est le plan d'acquisition
principal. Si l'assiette ou le mécanisme sont jugés insuffisants, il faut soit
le restreindre aux apports non immobiliers — ce qui en retire l'essentiel de la
valeur —, soit le suspendre jusqu'à mise en conformité.

---

## 5. Les demandes d'accompagnement

**Question.** Le mécanisme ci-dessous évite-t-il la qualification de vente de
contacts, et par là le retour du courtage par la porte de l'abonnement ?

**Enjeu.** C'est l'argument de vente numéro un de l'Espace agence, principale
source de revenu récurrent. Notre analyse retient que la phrase « on ne vend pas
des contacts » n'est pas du positionnement mais **une condition de validité du
modèle**, et qu'elle doit figurer dans les conditions générales.

**Position retenue.** Une agence ne reçoit jamais un contact : elle voit une
**fiche anonyme** — type de bien, surface, fourchette de prix, commune,
échéance — et elle y **postule**. Les fiches sont visibles par **toutes** les
agences vérifiées du rayon, dans un ordre **chronologique**, jamais pondéré par
l'abonnement. Aucun paiement pour voir, aucun paiement pour postuler. Le
particulier compare et **ouvre le contact** lui-même : l'identité ne circule
qu'à cet instant. L'abonnement limite un **volume** de candidatures ouvertes
simultanément, jamais un **accès**.

**Sous-question.** Le critère de distribution doit-il être publié dans les
conditions générales pour être opposable ?

**Si la position tombe.** L'Espace agence perd son argument principal. Il
resterait les outils et la page publique — ce qui est vendable, mais contre des
logiciels métier installés depuis quinze ans.

---

## 6. Points de conformité à confirmer, sans position arrêtée

| Point | Ce que nous croyons | Statut |
| --- | --- | --- |
| **Autorisation cantonale du courtage** | Identifiée avec certitude au **Tessin** (LFid, RL 953.100). **Genève et Vaud : non vérifié** | **Ne rien écrire** dans les conditions à leur sujet |
| **Seuil hébergement / bail** | Une location de courte durée bascule vers le bail au-delà d'une certaine durée | Champ prévu au modèle, **valeur inconnue** |
| **Formule officielle du loyer initial** | Obligatoire dans NW, ZG, FR, VD, NE, GE, ZH, parfois seulement dans certaines communes selon la pénurie | Table éditable prévue ; **liste à confirmer** |
| **Numéro d'enregistrement UE, courte durée** | Exigible **depuis le 20 mai 2026** (règlement (UE) 2024/1028), et c'est la **plateforme** qui doit vérifier | **Urgent** : nous sommes en septembre 2026. Ce n'est pas un champ « après le lancement » |
| **Garantie de loyer** | Plafonnée à 3 mois (art. 257e CO), sur un compte au nom du locataire, **jamais détenue par E-Dome** | Aucun champ de détention ne doit exister au schéma |
| **Frais à la charge du locataire** | Interdits ; base invoquée art. 254 CO (transaction couplée) | Rendu **impossible par le schéma**, pas seulement par le code |
| **Avis** | Aucun avis sans transaction rattachée ; avantage reçu à déclarer | Champ obligatoire au modèle |
| **DSA / P2B** | Suspension motivée avec voie de recours ; paramètres de classement publiés | **Articles à vérifier** ; applicable seulement à l'ouverture de l'UE |
| **DAC7 / DPI** | Déclaration par les plateformes | Confirmation trouvée **seulement** pour les crypto-actifs (CARF, dès 2026). **À vérifier** pour l'immobilier |
| **Lex Koller (LFAIE)** | Information des acheteurs domiciliés à l'étranger sur les biens résidentiels suisses. Contingents cantonaux pour les logements de vacances | **Base d'article à vérifier** pour les contingents. Ne jamais écrire qu'un bien est « éligible aux acheteurs étrangers » |
| **Achat intégré iOS** | Ne s'applique pas à une application web installable. S'appliquerait à une application native distribuée par l'App Store vendant du contenu numérique | Décision reportée, **datée**. Échéance ferme : le prix différencié web / iOS doit être **prêt avant la première soumission** de `mobile/` à l'App Store, pas après. Une application soumise avec du contenu numérique payant et sans achat intégré est rejetée au titre de la règle 3.1.1 ; la corriger après un rejet coûte un cycle de revue complet |

> **Les conditions générales réécrites (étape 7).** `/conditions` passe de dix
> à treize sections, et les **quatre règles sont en §2, avant toute clause
> tarifaire, en toutes lettres** — composées depuis `PLATFORM_RULES`, donc
> impossibles à faire diverger de l'interface. Deux corrections de fond
> révélées à la rédaction : l'ancien glossaire définissait « Commission » comme
> « pourcentage prélevé par la Plateforme sur les transactions réalisées »
> (la règle 3 contredite dans les définitions), et confondait l'hôte de courte
> durée avec le vendeur. Le barème du §6 est **généré depuis `RATES`**. Tout
> ceci reste soumis à votre relecture — c'est un texte de maquette, pas un
> document validé.

> **Où ces points apparaissent dans la maquette (étape 5).** L'étape finale de
> `/publier` n'affiche plus de frais pour la vente et la location longue durée :
> c'est un **écran d'obligations** (`src/content/publier-obligations.ts`) qui
> rappelle au vendeur ou au bailleur la formule officielle du loyer initial, le
> droit de vendre/louer, la garantie de loyer, l'information Lex Koller, et —
> pour la courte durée — le numéro d'enregistrement. **Ces textes sont
> indicatifs et attendent votre relecture** ; ils ne prétendent pas être
> exhaustifs ni juridiquement définitifs.

---

## 7. Ce que nous nous interdisons déjà

Liste tenue à jour dans `analyse/juridique.md` §10. Les points les plus
structurants, pour que le conseil sache ce qui est **déjà** exclu :

- toute rémunération, forfait compris, due seulement si la vente ou le bail se
  conclut — y compris un « frais de dossier remboursé si ça ne se vend pas » ;
- tout prélèvement sur la commission d'une agence ;
- le mot « courtier », le rôle correspondant, et tout badge suggérant qu'E-Dome
  mandate quelqu'un ;
- vendre, réserver, prioriser ou pondérer contre paiement l'attribution d'une
  demande d'accompagnement ;
- un taux d'apporteur sans son assiette dans la même phrase ;
- le parrainage à deux niveaux ;
- toute promesse ou projection de rendement présentée comme un résultat
  attendu ;
- un avis sans transaction, ou sollicité contre avantage non déclaré ;
- du contenu sponsorisé non étiqueté, un classement modifié par paiement sans
  mention ;
- tout écran suggérant qu'E-Dome détient, séquestre ou garantit des fonds.
