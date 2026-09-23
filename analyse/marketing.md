# Marketing et croissance — note de l'agent

Positionnement, acquisition, conversion, valeur perçue. Aucune recommandation ci-dessous ne propose d'afficher un chiffre de traction. Les tarifs concurrents cités sont vérifiés, sources en fin de note.

**Les six décisions que je demande au CEO de trancher dans mon sens :**

1. L'angle « trois mondes réunis » est un discours d'investisseur, pas un argument de vente. On le garde là, on le démonte ailleurs.
2. La gratuité du particulier est le bon moteur, mais « gratuit » seul ne différencie plus rien en Suisse. Le claim tient en trois termes : *gratuit, illimité, et jamais un franc au locataire*.
3. Deux formules d'Espace agence — **Vitrine** et **Mandats** — sur un socle gratuit **Présence**. Aucun frais à l'annonce, nulle part, jamais.
4. L'abonnement Propriétaire tel que décrit ne se vendra pas. On le recentre sur le multipropriétaire bailleur et on le nomme **Patrimoine**.
5. L'écran d'accueil de la maquette montre *qui paie quoi* avant les fonctionnalités, et `demo.href` ne doit plus pointer sur `/feed`.
6. La boutique perd son statut de pôle, garde sa tuile, et reste en affiliation.

---

## 1. Le positionnement, en une phrase

L'angle de B.1 — « les portails ont les annonces mais pas de communauté ; les réseaux sociaux ont la communauté mais pas les transactions » — est **vrai comme constat et fragile comme positionnement**. Trois raisons.

**Il décrit un vide, pas une raison de changer d'outil.** Une agence n'achète pas une communauté : elle achète de la visibilité, des mandats et du temps. « Communauté » ne figure dans aucune de ses lignes budgétaires.

**La question posée est juste : Homegate et ImmoScout24 ont les annonces et l'argent.** Et depuis le 1ᵉʳ avril 2026, ils ont aussi la clarté. Sous l'accord conclu avec le Surveillant des prix, les six portails du groupe SMG proposent un « Flex-Angebot » à **44 CHF/mois de base + 505 CHF par annonce de vente et 370 CHF par annonce de location**, durée illimitée ([WBF](https://www.wbf.admin.ch/de/newnsb/VBq8KYe4FvGcTWA3qMxqd)). Le flanc « leurs prix sont opaques » vient d'être refermé : il ne faut plus l'attaquer.

**Le terrain de l'agrégation par le bas est déjà occupé.** Flatfox accepte deux annonces gratuites puis facture 99 CHF l'unité ; newhome offre deux annonces simultanées au particulier. « Gratuit pour le particulier » n'est pas un territoire vierge.

**Ce qui reste, et qui est défendable.** Deux choses, structurelles et non rhétoriques.

*Un :* le modèle à l'annonce punit la rotation et les petits portefeuilles. 505 CHF par bien mis en vente est un coût variable que nous remplaçons par un coût fixe. C'est une arithmétique, pas une promesse — et elle se vérifie devant le prospect en dix secondes.

*Deux, et c'est le meilleur :* Homegate et ImmoScout24 vendent au **locataire** un abonnement « MieterPlus » à 29.95–54.95 CHF/mois pour trois jours d'accès anticipé, pratique publiquement contestée par l'ASLOCA et Kassensturz ([SRF](https://www.srf.ch/sendungen/kassensturz-espresso/espresso/umstrittenes-exklusiv-abo-homegate-schlaegt-profit-aus-der-wohnungsnot)). La règle B.6 — jamais de frais à la charge du locataire — cesse alors d'être une contrainte de conformité et devient **une promesse que le concurrent ne peut pas copier sans renoncer à une ligne de revenu**. C'est la définition d'un positionnement défendable.

**La phrase, pour le professionnel :**

> **« Les portails vous louent une annonce. E-Dome vous donne une place. »**

Pour l'investisseur, la version descriptive : *le réseau professionnel de l'immobilier romand, outils métier et encaissement intégrés — abonnement côté professionnel, gratuité côté particulier, aucun pourcentage sur la vente d'un bien.*

### Ce qui doit changer dans `src/content/landing.ts`

La landing est **mieux positionnée que B.1** sur le versant professionnel : son constat (« une dizaine d'outils qui ne se parlent pas ») est l'histoire de l'agrégation, qui est la vraie douleur du métier. Je la garde. Quatre corrections :

- `hero` — ajouter une ligne : « Gratuit pour les particuliers. Abonnement pour les professionnels. » C'est la seule information que le visiteur ne peut pas déduire d'une capture d'écran, et elle est absente.
- `faq.items.prix` — « Le modèle n'est pas encore arrêté […] [À CONFIRMER] » doit tomber dès `DECISIONS.md`. Rester flou sur le prix d'une page qui demande un engagement coûte des inscriptions : le visiteur suppose le pire.
- `founding.pricingNote`, vide aujourd'hui — « Tarif fondateur garanti douze mois après l'ouverture. » C'est l'avantage le plus convertissant des cinq, et le seul qui manque.
- `audience.profiles.agence.benefit` — « exister comme professionnel » est mou. Le remplacer par la promesse arithmétique : publier sans payer à l'annonce.

---

## 2. La gratuité totale du particulier

**C'est le bon moteur.** Le bien du particulier est l'inventaire qui attire l'acheteur, donc l'investisseur, donc l'agence : le facturer serait taxer notre propre approvisionnement. Et la version conditionnée à la vente nous ferait basculer dans le courtage.

Mais **« gratuit » seul ne vend plus**, puisque les deux concurrents ci-dessus donnent déjà deux annonces. Le claim utile est en trois termes indissociables : **gratuit, illimité, et jamais un franc au locataire.** C'est le troisième qui est neuf.

**Afflux d'annonces médiocres.** La réponse n'est pas de la modération humaine — on ne peut pas la financer. C'est le **classement** : publier est gratuit, être vu est mérité. Une annonce n'entre dans la recherche et le fil qu'avec adresse, surface, prix, trois photos et une identité vérifiée. Une ligne dans le parcours : « Publication gratuite. Visibilité selon la complétude. » Effet secondaire utile : cette barre de complétude est le meilleur argument de vente de la mise en avant et de Patrimoine.

**Dévalorisation perçue.** Ne jamais dire « gratuit » seul. Toujours dans la même phrase : *gratuit pour le particulier, payant pour les professionnels.* La gratuité doit se lire comme un arbitrage sur qui paie, jamais comme un rabais.

**Cannibalisation des agences.** C'est le risque réel, et le plus dangereux, puisqu'il touche la population qui paie. Contention : les deux populations ne partagent pas la même étagère. L'annonce de particulier porte le label « Particulier — vend sans agence » et ouvre le parcours de demande d'accompagnement ; l'agence obtient ce que le particulier ne peut structurellement pas avoir — équipe, mandats, badge vérifié, page d'agence, statistiques, demandes entrantes. Et surtout on **retourne l'argument** : les annonces gratuites de particuliers ne sont pas votre concurrence, elles sont votre pipeline. Elles n'existent nulle part ailleurs avec un bouton « je veux être accompagné ».

---

## 3. Ce qui fait souscrire à l'Espace agence — réponse à **Q4**

**Argument numéro un : les vendeurs particuliers arrivent chez vous, et vous n'avez acheté aucun contact.** C'est le seul bénéfice qu'aucun portail ni aucun logiciel métier ne peut fournir, parce qu'il naît de la gratuité du particulier. Argument numéro deux, arithmétique : vos annonces illimitées contre 505 CHF l'annonce de vente ailleurs.

**Ce qui ne marchera pas, et qu'il faut cesser de mettre en avant :**

- *« Remplacez votre logiciel métier. »* Une agence équipée de CASAONE (200 CHF/mois en Basic, 350 en Pro+, plus 1 000–2 000 CHF de mise en service — [Casasoft](https://casasoft.ch/fr/prix/casaone-logiciel-immobilier/)) ou d'ImmoTop2 (dès 149 CHF/mois) ne migre pas ses mandats et sa comptabilité vers une plateforme sans historique. Vendre le « suivi des commissions » comme motif de souscription, c'est attaquer l'adversaire sur son point fort — la captivité des données — et gonfler notre propre coût d'adoption. On garde la fonction, on la rétrograde dans le discours (« vous suivez vos commissions ici aussi ») et on l'affiche « ensuite » dans la maquette.
- *« Badge Agence vérifiée. »* Un badge est une conséquence, pas un achat : outil de confiance et de rétention, jamais levier de conversion.

**Q4 — deux formules payantes, sur un socle gratuit.** Pas trois : sur une plateforme sans traction, trois paliers invitent le prospect à attendre le moins cher et encombrent la démonstration. Pas une : un indépendant et une agence de douze collaborateurs ne peuvent pas payer le même prix, et un prix unique tue l'un ou laisse l'argent de l'autre sur la table.

| Formule | Pour qui | Contenu et déclencheur |
| --- | --- | --- |
| **Présence** (gratuit) | Agent qui découvre | Profil pro, 3 biens actifs, réseau, messagerie. Rampe d'accès, pas une offre. |
| **Vitrine** | Indépendant, petite agence | Biens illimités, page publique, mise en avant incluse, statistiques, badge vérifié, **réception des demandes d'accompagnement**. |
| **Mandats** | Agence avec une équipe | Tout Vitrine + agents et droits, attribution des biens et des clients, mandats, agenda des visites, sous-domaine, suivi des commissions, export. |

Pourquoi ces noms. *Vitrine* est le mot que le métier emploie déjà pour ce qu'il achète aux portails : aucune traduction nécessaire. *Mandats* nomme la seule chose qu'une agence gère et qu'aucun portail ne gère — donc il nomme exactement le moment de la bascule : on passe à Mandats quand on a des mandats et des gens, pas quand on a plus d'annonces. *Présence* évite que le gratuit se lise comme « pas sérieux ». À signaler pour plus tard : en allemand la paire s'affaiblit (« Auftritt / Mandate ») ; non bloquant pour un lancement romand.

**Contraintes marketing sur le prix** (les montants sont au comptable) : l'entrée payante doit être *arithmétiquement inférieure à deux annonces de vente Homegate par an*, pour que la comparaison se fasse de tête ; et ce doit être un montant qu'un indépendant décide seul, sans en parler à son associé.

Enfin un statut, pas une formule : **Fondateur** — tarif garanti douze mois, marqueur permanent sur le profil. C'est le contenu de `founding.pricingNote`.

---

## 4. L'abonnement Propriétaire est-il assez désirable ?

**Non, et je le dis sans détour : tel qu'il est décrit, il ne se vendra pas.** La liste de B.3 (suivi, statistiques, IA de rédaction, estimation, alertes) est un inventaire de fonctions, pas un déclencheur. Un particulier qui vend un appartement tous les douze ans ne prend pas un abonnement mensuel pour un tableau de bord. Le mot « Propriétaire » aggrave le problème : tout le monde en est un, donc personne ne s'y reconnaît.

**La cible n'est pas le vendeur, c'est le multipropriétaire bailleur** — deux à huit lots, une douleur mensuelle réelle : baux, échéances, indexation, charges, décompte, rendement réel. Un seul niveau, nommé **Patrimoine** : le mot nomme ce que l'acheteur croit posséder, il est récurrent par nature, et il ne heurte pas les agences auxquelles nous vendons par ailleurs. (« Régie perso » serait plus vendeur et nous coûterait la relation agence — je ne le propose pas.)

**Le déclencheur est une seule chose qui économise une heure vraie :** l'échéancier des baux avec indexation, le décompte de charges, et un export que la fiduciaire accepte. L'IA de rédaction est un agrément, pas un motif d'achat. Attention sur « analyse de rendement » : B.6 interdit la promesse de rendement, donc l'écran calcule un réalisé, jamais une projection.

**Sur le prix : une dizaine de francs est trop bas.** À ce niveau le produit se lit comme un gadget et l'écart avec le gratuit paraît cosmétique. Repère vérifié : Homegate fait payer 29.95–54.95 CHF/mois à des *locataires* pour trois jours d'avance. Nous vendons de l'outillage à des propriétaires, ce qui est plus justifiable que de la rareté. La zone défendable est nettement au-dessus du seuil symbolique des dix francs ; le montant est au comptable.

**Et un forfait ponctuel doit subsister — exactement un : la mise en avant.** C'est la seule façon de monétiser un vendeur décennal qui ne s'abonnera jamais, et le seul achat dont la valeur est lisible dans l'instant. Elle ne doit jamais conditionner la publication : ce serait le retour déguisé du modèle 500 / 2 500 que B.3 abandonne. Cela répond aussi à la question ouverte de B.7 sur le frais fixe ponctuel : oui, une place, une seule, celle-là.

---

## 5. La hiérarchie des messages

| Audience | Ouverture | Preuve | Objection à lever |
| --- | --- | --- | --- |
| **Investisseur** | « Les portails vendent l'annonce à l'unité ; nous vendons l'abonnement et l'encaissement autour. » | Le panneau de flux d'argent, cliquable sur chaque transaction ; la page de tarifs générée depuis le module unique. | « Homegate a les annonces et l'argent. » → On n'attaque pas la diffusion, on attaque la facturation à l'annonce et la couche métier qu'aucun portail ne vend. Et nous ne facturons jamais le locataire ; eux si. |
| **Agence** | « Vos annonces illimitées, et les vendeurs qui cherchent une agence arrivent ici. » | L'écran de demande d'accompagnement ; l'arithmétique des 505 CHF. | « Je paie déjà Homegate et mon logiciel. » → La première année nous ne remplaçons ni l'un ni l'autre : nous remplaçons votre ligne « annonces supplémentaires » et nous ajoutons une entrée de clients. L'admettre convainc mieux que prétendre tout remplacer. |
| **Créateur** | « Une audience venue pour l'immobilier, et l'encaissement dedans. » | La page formation et son panneau de flux d'argent. | « 10 %, c'est plus que Kajabi qui prend 0 %. » → Kajabi ne fournit pas l'audience et coûte un abonnement mensuel avant la première vente. Ici, zéro avant la première vente. |
| **Développeur / équipe** | « Le modèle économique est écrit, exécutable et testé — pas un slide. » | `src/lib/pricing.ts` comme source unique ; la couche leads (schéma partagé, limite en base, test de bout en bout) ; les portes de qualité. | « Encore une marketplace. » → Les quatre règles inviolables sont une contrainte d'architecture, pas un slogan : elles se lisent dans le code. |
| **Particulier vendeur** | « Publiez gratuitement, autant de biens que vous voulez. » | L'écran des trois routes, avec le coût de chacune affiché au franc. | « Gratuit, où est le piège ? » → Réponse à l'écran : ce sont les professionnels qui paient, et nous ne prenons jamais un pourcentage sur votre vente. |

---

## 6. Les trente secondes — écran d'accueil de la maquette

Le critère de la Partie D suppose trois réponses, dans cet ordre : *ce que c'est*, *qui paie quoi*, *ce qui existe contre ce qui viendra*.

1. **0–5 s — une phrase et un sous-titre qui dit qui paie.** « E-Dome — le réseau professionnel de l'immobilier. Gratuit pour les particuliers, abonnement pour les professionnels. » Plus le bandeau « données fictives » déjà exigé.
2. **5–12 s — trois cartes « qui paie quoi »**, pas sept pôles : *Particulier — 0 CHF* · *Professionnel — abonnement* · *Marketplace — commission sur ce qui est encaissé*. Chacune mène à la page de tarifs. Ce bloc passe **avant** les fonctionnalités : c'est la seule des trois questions qu'une capture d'écran ne peut pas résoudre.
3. **12–20 s — la légende des statuts, avec le décompte d'écrans** par statut (au lancement / ensuite / vision). Le décompte est ce qui rend la légende crédible ; sans lui, le gris passe pour une décoration. C'est un décompte d'écrans de maquette, pas un chiffre de traction : licite.
4. **20–27 s — le sélecteur de rôle**, visible sans défilement, libellé à l'impératif, trois rôles préremplis (particulier vendeur, agence, apporteur). C'est le contrôle qui transforme un spectateur en explorateur.
5. **27–30 s — un seul bouton primaire : « Visite guidée (2 min) ».** Le mode explicatif est actif par défaut : l'écran l'annonce en une ligne, il ne le propose pas comme un choix.

**Ce qui ne doit surtout pas y être** : la grille des sept pôles (elle se lit comme un catalogue et ne répond à aucune des trois questions), un compteur quelconque, le bandeau défilant (du mouvement avant la compréhension), un écran de connexion.

**Correction concrète sur la landing :** `demo.href` vaut `/feed`. C'est une erreur au regard de ce critère — un fil social peuplé de personnes fictives ne répond à aucune des trois questions, et c'est la première chose que voit un visiteur venu de `/`. `demo.href` doit pointer sur cet écran explicatif, avec `/feed` à un clic.

---

## 7. **Q8** — les brèves de marché et les 4 521 « j'aime »

**Les cinq brèves de `NEWS`.** Je ne les supprime pas et je ne les remplace pas par de vraies dépêches sourcées : supprimer vide la colonne droite et fait paraître le fil maigre, ce qui coûte aussi de la crédibilité ; sourcer crée une dette de maintenance et date la démonstration au jour où on la montre.

La règle que j'applique : sur une maquette publique, une affirmation factuelle sur le monde réel, non sourcée et horodatée, est une fausse affirmation — même quand elle ne porte pas sur E-Dome. **On garde le bloc, on retire les affirmations.** Les entrées deviennent des *catégories de veille* et non des dépêches : titre « Veille — exemple », aucun horodatage (« 2 h », « 5 h », « 1 j » disparaissent), aucun chiffre. « Taux — décision de la BNS et effet sur les hypothèques », sans le « 1,5 % ». « Règle — Lex Koller : ce qui change pour les acheteurs non-résidents », sans millésime. Le bloc montre alors ce que la fonctionnalité fera sans rien affirmer.

Deux entrées sortent purement et simplement : « Genève : le m² dépasse 14 500 CHF », qui est un indice de marché maison — exactement ce que la Partie C proscrit ; et « Dubaï lance un visa investisseur de 10 ans », affirmation vérifiable sur un État tiers.

Argument décisif : ce traitement est **déjà celui du bandeau `LIVE` du même fichier**, dont l'en-tête documente ce raisonnement et a délibérément supprimé les horodatages relatifs. Ce n'est pas une doctrine nouvelle, c'est l'application d'une décision déjà prise dans le code.

**Les 4 521 « j'aime ».** Ce n'est pas une affirmation de traction au sens strict, mais elle se lit comme telle : le post est le message de bienvenue d'E-Dome signé du fondateur. Position — **le post épinglé ne porte aucun compteur.** Pas un nombre plus modeste : aucun. Techniquement, un indicateur `pinned` sur le type de post qui masque la rangée de compteurs et laisse une seule action « Commenter ». Les vingt-six autres posts gardent leurs compteurs : de l'engagement fictif sur du contenu d'utilisateurs fictifs est une donnée de démonstration normale, exactement selon la règle de tri de la Partie C.

**Ce que l'audit n'a pas vu, et qui est plus grave.** Les trois commentaires de ce post sont des **témoignages sur E-Dome écrits par des personnes fictives** : « Tellement fier de faire partie de l'aventure depuis le jour 1 », « La meilleure plateforme pour les investisseurs sérieux ». C'est un faux avis sur nous-mêmes — la seule pratique que B.6 interdit nommément. Je recommande de les remplacer par des **questions** (« Les annonces de particuliers sont vraiment illimitées ? »), ce qui est honnête et meilleur pour le produit : le post épinglé sert alors à lever les objections.

---

## 8. Le pôle boutique mérite-t-il d'exister ?

**Tranché : la tuile reste, le statut de pôle disparaît, on n'opère jamais de stock.**

Contre : c'est le seul pôle dont l'objet n'est ni un bien, ni une personne, ni une compétence — il ne partage donc pas l'identité qui fait tenir l'ensemble. Il importe la logistique, les retours, la garantie et le droit de la consommation. Et à ~6 % sur du mobilier, il ne paie pas sa propre modération. Devant un investisseur, sept pôles c'est un de trop pour trente secondes ; celui-là est le candidat évident.

Pour : le moment qui précède une vente ou suit un achat — home staging, ameublement, matériaux — est le moment de plus forte intention commerciale de la plateforme. Le jeter serait perdre de l'argent facile.

**Donc :** la boutique devient une rubrique de Services, « Équiper », **en affiliation seule** — liens marchands, commission payée par le marchand, aucun stock, aucun envoi, aucun fonds détenu, surface opérationnelle nulle. La tuile reste visible et grise dans la maquette, et son clic explique précisément cela : affiliation d'abord, marketplace propre seulement si le volume le prouve. Correction de contenu : `solution.poles.boutique.description` doit dire l'affiliation, ce qu'elle ne dit pas aujourd'hui.

---

## 9. Mes désaccords attendus

**Avec l'agent juridique.** Il voudra border « estimation indicative », qualifier « gratuit » (« gratuit sous conditions ») et retirer la comparaison MieterPlus au titre du dénigrement (LCD art. 3).
*Où je ne céderai pas :* **« Gratuit » reste sans astérisque dans le hero et sur le bouton de publication.** Une gratuité qualifiée n'est pas une gratuité, et le moteur d'acquisition meurt avec l'astérisque. J'accepte la précision dans le panneau de détail et sur la page de tarifs, jamais dans la promesse.
*Ma concession :* la comparaison devient une affirmation sur nous (« nous ne facturons jamais le locataire ») et non sur eux, nommément. Cela nous coûte la version la plus tranchante de la ligne.
*Ce qu'on perd en me suivant :* la promesse devient un engagement produit irréversible. Si un jour une option payante touche la publication d'un particulier, nous briserons une phrase écrite en gros caractères. Je demande donc qu'elle soit verrouillée dans `DECISIONS.md`, pas seulement écrite sur la page.

**Avec l'agent comptable.** Il voudra un prix d'entrée plus élevé, trois paliers, et probablement garder une option à l'annonce « pour les grosses agences ».
*Où je ne céderai pas :* **aucun frais à l'annonce, jamais, et deux paliers, pas trois.** Le frais à l'annonce est précisément ce contre quoi nous nous positionnons ; le réintroduire pour les gros comptes met le modèle de l'adversaire dans notre propre grille tarifaire et transforme chaque négociation en discussion de prix unitaire — que nous perdons, puisque le volume est chez eux.
*Ma concession :* un supplément selon la taille du portefeuille au-delà d'un seuil, exactement comme CASAONE le pratique (10 à 350 CHF/mois selon le nombre d'objets). Ce n'est pas un frais à l'annonce : il ne facture pas l'acte de publier.
*Ce qu'on perd :* du revenu réel sur les agences à plus de 250 biens, qui sous un abonnement plat sont nos clientes les moins rentables par annonce.

**Avec l'agent produit et UX.** Il voudra fusionner les deux formules d'agence et masquer le sélecteur de rôle pour simplifier la démonstration.
*Où je ne céderai pas :* **le sélecteur de rôle reste visible sans défilement sur le premier écran** — c'est la seule fonctionnalité qui rend le critère des trente secondes atteignable, et le ranger dans un menu ramène la démo à une visite de captures d'écran. Et **les deux formules restent** : Mandats est là où se trouve le revenu d'évolution, et un palier unique rend la montée invisible.
*Ce qu'on perd :* un premier écran plus chargé, et une page de tarifs avec un tableau comparatif au lieu d'un seul nombre.

---

## 10. Le mensonge facile que je refuse

**Le compteur.** « Rejoignez 1 200 professionnels romands » ferait monter la conversion de la landing, de façon mesurable. C'est un mensonge qu'on ne peut jamais retirer : chaque membre fondateur aurait adhéré sur une fausse prémisse, et un seul prospect qui demande « lesquels ? » met fin à la relation définitivement. L'audit montre que cette phrase existait déjà dans le code (« +4 500 inscrits ») et qu'elle a été retirée : la remettre, même en plus petit, serait une décision de mentir, plus un oubli.

**Le faux témoignage.** « La meilleure plateforme pour les investisseurs sérieux », sous notre propre post de bienvenue, signé d'un utilisateur inventé. Un avis fabriqué sur nous-mêmes.

**L'indice maison.** Un « Indice E-Dome » ou un prix au m² genevois est le moyen le moins cher de passer pour une autorité, et le plus rapide de se faire prendre : quelqu'un vérifiera.

**Le mur de logos.** Aucun logo de partenaire avant signature. C'est le mensonge le plus répandu des présentations d'amorçage, et le plus facile à démonter.

**Ce qu'on montre à la place** : le panneau de flux d'argent et la légende des statuts. Un mécanisme crédible bat un faux chiffre auprès des trois seuls publics qui comptent aujourd'hui — l'investisseur qui fera sa diligence, l'agence qui appellera un confrère, et le développeur qui lira `pricing.ts`. Notre avantage de discours, à ce stade, c'est de pouvoir dire « nous n'avons pas encore d'utilisateurs » sans que cela affaiblisse rien, parce que tout le reste est démontrable.

---

## Sources vérifiées

- **Accord du Surveillant des prix avec SMG** — « Flex-Angebot » : 44 CHF/mois + 505 CHF (vente) / 370 CHF (location) par annonce, dès le 1ᵉʳ avril 2026, sur Homegate.ch, ImmoScout24.ch, Acheter-Louer.ch, ImmoStreet.ch, alle-immobilien.ch et home.ch — https://www.wbf.admin.ch/de/newnsb/VBq8KYe4FvGcTWA3qMxqd
- **Homegate MieterPlus** — abonnement payé par le locataire, 29.95–54.95 CHF/mois selon la durée, et les critiques publiques — https://www.srf.ch/sendungen/kassensturz-espresso/espresso/umstrittenes-exklusiv-abo-homegate-schlaegt-profit-aus-der-wohnungsnot
- **Flatfox** — deux annonces gratuites, puis 99 CHF l'annonce — https://flatfox.ch/c/en/post-listing/
- **newhome.ch** — deux annonces simultanées gratuites pour les particuliers, puis CLASSIC 139 / 179 / 249 CHF selon la durée — https://www.newhome.ch/blog/en/services/prices-and-special-offers/
- **CASASOFT CASAONE** — Basic 200 CHF/mois, Pro+ 350 CHF/mois, par entreprise, utilisateurs illimités, supplément 10–350 CHF/mois selon le nombre d'objets, mise en service 1 000–2 000 CHF — https://casasoft.ch/fr/prix/casaone-logiciel-immobilier/
- **Airbnb** — commission hôte seule 15.5 % (ancien modèle partagé : 3 % hôte + 14.1–16.5 % voyageur) — https://www.airbnb.com/help/article/1857
- **Eventbrite** — 3.7 % + 1.79 USD par billet, plus 2.9 % de traitement du paiement — https://www.eventcloud.io/blog/how-much-does-eventbrite-charge-2026
