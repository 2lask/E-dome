# Note juridique — E-Dome

Droit suisse. Chaque affirmation est marquée **certain**, **probable** ou **à confirmer par un avocat**. Aucune référence donnée de mémoire : URL en fin de note. Là où je n'ai pas pu vérifier, j'écris « à vérifier » plutôt que d'affirmer.

---

## 1. Le raisonnement de B.2 : bonne conclusion, mauvais motif

B.2 écrit : « une rémunération proportionnelle et conditionnée à la conclusion d'une transaction correspond au courtage (art. 412 et 413 CO) ». **C'est inexact, et l'erreur induit la règle 3 en erreur.**

- **Certain.** L'art. 412 CO définit le courtage par l'**activité** — indiquer une occasion de conclure, ou servir d'intermédiaire pour la négociation, moyennant salaire. Il ne dit rien du mode de calcul. Un **forfait** est du courtage tout autant qu'un pourcentage.
- **Certain.** L'art. 413 CO ne qualifie rien : il règle le **droit au salaire** (conclusion effective + lien de causalité). La conditionnalité au succès est la *conséquence* légale du courtage, pas son critère.
- **Donc le fondateur raisonne à l'envers.** Ce qui crée le courtage, c'est d'agir **pour le compte** d'une partie avec une mission d'indiquer ou de négocier. Le mode de rémunération n'est qu'un **indice** — puissant en pratique, parce qu'un honoraire de succès trahit l'intérêt au résultat, mais un indice.
- **Certain.** Art. 417 CO, texte exact : « Lorsqu'un salaire excessif a été stipulé soit pour avoir indiqué une occasion de conclure un contrat individuel de travail ou une vente d'immeuble, soit pour avoir négocié l'un de ces contrats, il peut être, à la requête du débiteur, équitablement réduit par le juge. » Donc **vente d'immeuble seulement, pas la location** : B.2 écrit « commissions excessives sur les immeubles », c'est trop large. Droit impératif, pas de renonciation anticipée.
- **Certain, mais à resserrer.** L'autorisation cantonale existe (art. 418 CO réserve le droit cantonal), et je n'en ai identifié **qu'une** avec certitude : le **Tessin**, loi sur l'exercice des professions de fiduciaire (LFid, RL 953.100), qui soumet le « fiduciario immobiliare » — médiation d'achat, de vente et d'échange comprise — à une autorisation personnelle. **Genève et Vaud : à vérifier** ; une source secondaire les cite, je n'ai trouvé aucune base légale, et Vaud ne réglemente dans la LEAE que le courtage matrimonial et de crédit. **Ne pas écrire dans les CGU qu'une autorisation est requise à Genève ou Vaud.**

**Ce que B.2 oublie, et qui pèse plus lourd.** (a) **Probable** — par renvoi de l'art. 412 al. 2 CO aux règles du mandat : art. 404 CO (révocabilité en tout temps) et art. 398 CO (diligence et fidélité). Le vrai risque du courtage n'est pas la réduction de commission, c'est la **responsabilité pour conseil** : un courtier répond de ce qu'il dit du bien. (b) **Probable** — art. 415 CO : une plateforme touche les deux côtés ; courtier, elle serait en double courtage quasi systématique, avec perte du droit au salaire et cumul des rémunérations pour apprécier l'excès. (c) **Le trou principal** : B.2 ne parle que du courtage. Le risque réel et quotidien d'E-Dome est ailleurs — **LCD** (badges, avis, classement, contenu sponsorisé, conditions abusives : art. 3 et 8 LCD), **nLPD**, modération. Un dossier qui ne parle que de l'art. 412 CO protège contre l'accident rare et ignore l'accident fréquent. (d) L'argument « concurrente de ses propres clientes » est le meilleur du dossier, mais il est **stratégique**, pas juridique ; le dire comme tel lui donne plus de force.

---

## 2. Règle 3 : à reformuler — ce n'est pas le pourcentage, c'est la conditionnalité

| Montage | Qualification | Verdict |
| --- | --- | --- |
| **Forfait conditionné à la vente** (« 2 500 CHF si le bien se vend ») | Courtage, très probablement | **Le plus dangereux des trois.** Le forfait ne sauve rien : art. 412 CO ignore l'assiette. Économiquement, c'est un honoraire de succès. |
| **Pourcentage non conditionné** (abonnement indexé sur le volume de biens, d'annonces ou d'agents) | Pas du courtage | **Autorisé**, aux trois conditions ci-dessous. |
| **Pourcentage conditionné à une vente ou un bail** | Courtage | Interdit. C'est le seul cas que la règle 3 décrive correctement. |

Conditions du pourcentage non conditionné : (i) dû indépendamment de toute conclusion ; (ii) assiette = un **stock** (biens actifs, sièges, volume publié), pas le **produit de transactions conclues** ; (iii) E-Dome ne reçoit rien de plus si la vente se fait. Un « abonnement » égal à 1 % des ventes du mois est du courtage déguisé : l'étiquette ne change pas l'assiette.

**Reformulation à substituer mot pour mot** dans les CGU, `pricing.ts` et le pitch :

> « E-Dome ne perçoit aucune rémunération dont le **montant** ou l'**exigibilité** dépend de la conclusion d'une vente ou d'un bail d'habitation ou de locaux commerciaux. Ses prix sont fixés à l'avance, dus indépendamment du résultat, et identiques pour tous les utilisateurs d'une même formule. »

Cette version est **plus protectrice** (elle ferme le forfait de succès, que la règle actuelle laisse passer) et **plus permissive** (elle ouvre le prix indexé au volume, que la règle actuelle interdit sans raison). Elle couvre la location longue durée en disant *pourquoi*, ce que la règle actuelle ne fait pas. **Ce qu'on perd :** le produit « vous ne payez que si ça marche », meilleur argument commercial du marché immobilier. L'agent marketing le demandera ; je ne céderai pas.

**Conséquence pour le code.** Le commentaire d'en-tête de `src/lib/pricing.ts` — « un pourcentage sur le prix de vente d'un bien immobilier est l'assiette de rémunération d'un courtier » — est **faux tel quel** et doit être réécrit. Chaque pôle porte un `contingentOnClosing: boolean`, et le module échoue en exécution si un pôle immobilier le passe à `true`. La règle doit être vérifiable par une machine, pas confiée à un commentaire.

**Location de courte durée.** D'accord avec B.3 : prestation d'hébergement, pas transaction immobilière, commissionnable sans contredire la règle 3 (**probable** — la qualification bascule vers le bail au-delà d'une certaine durée ; seuil **à vérifier**, à porter dans le modèle de données).

---

## 3. Programme apporteurs

**Un apporteur rémunéré pour avoir amené un vendeur à une agence est un courtier** (courtage d'indication, art. 412 CO) — **probable, et je le traite comme certain**. Conséquences : art. 417 CO applicable si l'affaire est une vente d'immeuble ; autorisation LFid probable au Tessin s'il agit professionnellement ; revenu imposable, et AVS si l'activité est régulière (**à confirmer par le comptable**).

Le risque pour E-Dome n'est pas d'être courtier : c'est **d'organiser et d'outiller du courtage** et d'en percevoir une part. Le cas 3 de B.3 est donc la bonne réponse, et je la **durcis** : sur une commission d'agence, E-Dome ne calcule pas, ne suggère aucun barème, n'affiche aucune estimation, ne garantit rien, n'encaisse rien. L'outil enregistre ce que l'agence déclare, point.

**Les trois cas, validés avec corrections.** (1) *Part du revenu E-Dome* — **valide**, mais l'assiette doit être le **revenu net encaissé, hors TVA, après frais du prestataire de paiement**, pas la commission brute : sinon la part de l'apporteur peut dépasser la marge, et l'on expose indirectement le prix payé par le client. (2) *Prime fixe à l'activation* — **le plus sûr des trois**, à condition que « actif » soit **objectif, vérifiable et affiché avant l'apport** (p. ex. compte vérifié niveau 1 + une annonce publiée + 30 jours) ; une promesse indéterminée est une allégation trompeuse (art. 3 LCD). (3) *Commission d'agence* — **valide, durci** ci-dessus.

**Ligne rouge structurelle : pas de parrainage à deux niveaux.** Une prime dépendant du recrutement d'autres apporteurs relève de la vente en boule de neige, visée par la LCD (**lettre exacte à vérifier**). Dans le modèle : `referralDepth` borné à 1, par construction.

**Statut et déclaration.** Aucun statut réglementaire à créer. Mais **oui à une déclaration obligatoire** avant la génération du premier lien, en trois champs : pays de résidence fiscale · particulier ou entreprise (+ IDE si entreprise) · engagement de ne pas négocier ni représenter. Sans ces trois champs, aucun lien n'est généré. Au-delà d'un seuil annuel cumulé (à fixer avec le comptable), exiger un IDE.

### Formulations exactes à afficher à l'apporteur

**(A) Écran de déclaration, avant le premier lien — non repliable :**

> Vous recommandez E-Dome, pas un bien et pas une agence.
> Vous êtes rémunéré par E-Dome, sur ce qu'E-Dome encaisse grâce à vous. Jamais par la personne que vous amenez, et jamais en supplément du prix qu'elle paie.
> Vous ne devez ni négocier un prix, ni représenter un vendeur, un acheteur, un bailleur ou un locataire. Si vous le faites, vous agissez comme courtier pour votre propre compte : c'est votre responsabilité, pas celle d'E-Dome, et certains cantons — le Tessin notamment — soumettent cette activité à autorisation.
> Les sommes que vous recevez sont un revenu. Vous devez les déclarer aux autorités fiscales de votre domicile. E-Dome ne retient aucun impôt et ne déclare rien à votre place.

**(B) Accolée à toute estimation de gain, dans la même phrase que le montant :**

> Estimation. X % de ce qu'E-Dome encaisse, hors TVA et après frais de paiement. Rien n'est dû si E-Dome n'encaisse rien.

**(C) Sur les apports dirigés vers une agence :**

> E-Dome ne prélève rien sur la commission d'une agence et ne vous reverse donc rien sur cette vente. Si l'agence a convenu de vous rémunérer, c'est un accord entre elle et vous : E-Dome n'en fixe pas le montant, ne le garantit pas, ne l'encaisse pas.

**(D) Type d'apport indisponible :**

> Indisponible depuis votre pays de résidence. Être rémunéré pour avoir amené une transaction immobilière suppose, en France comme aux Émirats arabes unis, une autorisation professionnelle que ni vous ni E-Dome ne détenons. Les autres types d'apport restent ouverts.

« E-Dome n'est pas courtier » ne doit **pas** être servi à l'apporteur : ce qui le concerne, c'est ce que **lui** risque.

---

## 4. Restriction géographique : bon principe, trois erreurs de calibrage

- **Suisse « tout autorisé » — trop absolu.** Le Tessin est un régime distinct (LFid). Je ne bloque pas, mais le canton doit être un champ, et un apport immobilier tessinois doit afficher l'avertissement d'autorisation.
- **France — trop sévère, mal motivée ; je maintiens tout de même le blocage.** La loi Hoguet (n° 70-9 du 2 janvier 1970) vise l'**entremise**. La Cour d'appel de Dijon, 19 février 2009, a jugé qu'un site diffusant des annonces, **rémunéré 1 % du prix de vente en cas de vente**, ne faisait pas d'entremise faute de s'immiscer dans les relations. Mais c'est une cour d'appel, en 2009, avant ALUR, et l'exercice illégal est pénalement sanctionné. Je maintiens la désactivation non parce que c'est illicite, mais parce qu'organiser depuis la Suisse un réseau d'apporteurs rémunérés en France nous place en position d'**organisateur**. À réexaminer avec un avocat français si la France devient un marché.
- **Émirats — correct, et mieux fondé que la France.** Le règlement de Dubaï n° 85 de 2006 subordonne toute activité de courtage à l'inscription au registre RERA, avec une catégorie dédiée aux apporteurs étrangers (« International Broker »). Ce n'est pas un doute, c'est une licence identifiée — et une voie de conformité si on la veut un jour. Deux corrections de rédaction : dire « Émirats arabes unis » et non « Dubaï », et savoir que le régime est **émirat par émirat**.
- **« Autres pays bloqués » — la vraie erreur.** Bloquer *tous* les types d'apport dans tous les autres pays bloque aussi l'apport d'un créateur de formation ou d'un annonceur, qui n'a rien d'immobilier et ne relève d'aucune autorisation. **Le découpage correct est à deux dimensions : `pays × type d'apport`**, avec pour défaut « apports immobiliers bloqués, apports non immobiliers autorisés ». C'est la correction la plus utile de cette section, et elle est structurante pour le modèle.
- **Manque total : sanctions et embargos.** Verser de l'argent à des personnes physiques à l'étranger impose de filtrer les pays et les personnes listés (SECO). Un champ et un contrôle, pas une option. **Étendue de l'obligation pour une plateforme non financière : à confirmer par un avocat.**

---

## 5. Champs imposés par les règles — pour l'agent architecture

**Vérification (3 niveaux).** `verification.level : none | identity | professional | qualification` · `identity.{method, verifiedAt}` — ne pas conserver la copie du document au-delà du nécessaire (minimisation, nLPD) · `professional.{ide, ideCheckedAt, registryStatus}`, IDE au format `CHE-###.###.###` : **le badge doit être adossé au registre IDE, sinon c'est une allégation trompeuse (art. 3 LCD)** · `qualification.selfDeclared: true` **obligatoire** — c'est une déclaration, pas une vérification, et le badge doit le dire · `verification.disclaimerKey` → le texte de ce que le badge ne garantit pas.

**Consentements.** `consents[] = {purpose, textVersion, grantedAt, withdrawnAt, source, locale}` — par finalité, versionné, révocable. Distinct de `terms.{version, acceptedAt}` : accepter des CGU n'est pas un consentement au sens des données. `marketing.optIn` séparé. `accessRequests[]` / `deletionRequests[]` avec délai (droits d'accès et de remise, nLPD). Pour les agences : `processorAgreement {signedAt, version, subprocessors[]}` — E-Dome **sous-traitant** — et un export réellement exécutable, pas un bouton mort.

**Location longue durée.** `rental.canton` **et** `rental.commune` : la formule officielle du loyer initial (art. 270 al. 2 CO) est obligatoire dans **NW, ZG, FR, VD, NE, GE, ZH**, parfois **seulement dans certaines communes** selon la pénurie — d'où la commune, et une table éditable tenue à jour depuis la liste de l'Office fédéral du logement. Puis `initialRentFormRequired` (dérivé), `initialRentFormProvidedAt`, `previousRent`, `increaseReason`. À afficher : l'absence de formule peut entraîner la **nullité du loyer initial** — obligation du **bailleur**, pas d'E-Dome, qui informe et fournit le lien mais ne remplit pas. `deposit.months ≤ 3` (art. 257e CO, habitation), sur un compte au nom du locataire ; **`depositHeldByPlatform` doit être absent du schéma**, rien à modéliser, jamais. `fees.chargedToTenant` typé impossible — base : **art. 254 CO**, la transaction couplée au bail est nulle lorsque le locataire contracte, envers le bailleur ou un tiers, une obligation sans rapport direct avec l'usage de la chose louée. Le code respecte déjà la règle ; c'est le **schéma** qui doit l'interdire.

**Courte durée.** `str.hostIsTenant` → si vrai, `landlordAuthorizationProvided` + `authorizationDocumentId`, et **pas de publication sans** (sous-location, art. 262 CO). `str.{registrationNumber, registrationAuthority, registrationCheckedAt}` : **obligatoire pour tout bien situé dans l'UE depuis le 20 mai 2026** (règlement (UE) 2024/1028), et c'est la **plateforme** qui doit vérifier et afficher — nous sommes en septembre 2026, ce champ n'est donc pas « après le lancement ». `str.localRulesAckAt` (régimes communaux très variables : ne pas les énumérer dans les CGU) · `stay.nights` + seuil de bascule vers le bail (**à vérifier**) · `stay.visitorTax`.

**Avis.** `review.transactionId` **non nul, obligatoire** — pas d'avis sans transaction ; un avis sans transaction est une allégation sur un concurrent (art. 3 LCD). Puis `verifiedPurchase` (dérivé), `authorRole`, `moderationState`, `moderationLog[]` (pas de suppression sans trace), `rebuttal` (droit de réponse) et **`incentivized`** : si l'auteur a reçu quelque chose, l'avis doit le dire.

**Contenu payant et classement.** `content.{sponsored, advertiserId, labelKey}` — étiquetage **visible sans interaction**, au-dessus du contenu, jamais dans un repli. `boost.{type, paidAt, rankingEffect}` et `listing.ranking.explanationKey` : un classement modifié par paiement doit être signalé, et les paramètres publiés si l'UE s'ouvre (règlement P2B 2019/1150 — **numéro d'article à vérifier**). **Pas de champ `expectedReturn` ni `yieldPromise`** : `indicativeYield` avec `basisKey` et `disclaimerKey`, sinon c'est une promesse de rendement.

**Lex Koller (LFAIE).** `user.domicileCountry` + `user.isPersonAbroadSelfDeclared` · `lexKollerNoticeShownAt` horodaté à la première mise en relation sur un bien **résidentiel** suisse · `property.useClass : residential | commercial | mixed | land` — l'assujettissement dépend de l'affectation · `property.{isSecondaryResidence, touristCommune}` (contingents cantonaux pour logements de vacances — **base d'article à vérifier**). On **informe** qu'une autorisation peut être nécessaire ; on ne dit **jamais** qu'un bien est « éligible aux acheteurs étrangers ».

**Transverse.** `payment.{psp, flow}` : les fonds ne transitent jamais par un compte E-Dome. Si un compte de passage existait un jour, la ligne rouge est chiffrée — **aucun intérêt et exécution sous 60 jours** (ordonnance sur les banques, art. 5 al. 3 let. c), faute de quoi ce sont des dépôts du public et il faut une autorisation. `country` + `canton` + `commune` sur toute annonce, `residenceCountry` sur tout compte : c'est ce qui rend exécutables toutes les règles ci-dessus, et rien de cela n'existe aujourd'hui. Réutiliser `featureStatus (launch | later | vision)` de `src/content/landing.ts`, y compris pour marquer une obligation légale non encore implémentée.

---

## 6. Q2 — la réécriture va bien au-delà du §5

**Le §5 est le symptôme.** Sur les dix sections de `src/app/(app)/conditions/page.tsx`, six posent problème :

- **§2, définitions** : « *Commission* : pourcentage prélevé par la Plateforme sur les transactions réalisées » — **contredit frontalement la règle 3, dans les définitions**. Et « Hôte : Utilisateur proposant un bien à la vente ou à la location » confond l'hôte courte durée et le vendeur : c'est faux, et ça brouille exactement la distinction sur laquelle tout le modèle repose.
- **§5, ligne « Partenariat agences (B2B) — revenue share négocié, ~10 à 15 % de la commission de l'agence »** : c'est un **pourcentage conditionné à la conclusion d'une vente immobilière, perçu par E-Dome**. C'est littéralement ce que la règle 3 interdit, et c'est écrit dans les conditions générales. **C'est la contradiction la plus grave du dépôt — plus grave que le barème 500 / 2 500 CHF, et l'audit ne l'a pas relevée.** À supprimer sans remplacement.
- **§3** : « un seul compte par utilisateur » est incompatible avec les rôles cumulables de B.5 ; « suspendre sans préavis ni indemnité » est indéfendable (motif et voie de recours exigés sous DSA — **articles à vérifier** — et contestable en Suisse de toute façon).
- **§8** : « responsabilité limitée au montant des commissions perçues au cours des 12 derniers mois » vaut **zéro franc** pour un utilisateur qui ne paie rien. Une exclusion totale envers un consommateur est probablement abusive (art. 8 LCD), et l'exclusion de la faute grave est nulle (art. 100 CO).
- **§9** : la LPD citée doit être la version **révisée, en vigueur depuis le 1er septembre 2023**, et le rôle de **sous-traitant** pour les données des clients d'agence doit être nommé.
- **§1** : « siège social en Suisse » est insuffisant — adresse complète et adresse électronique (art. 3 al. 1 let. s LCD, commerce électronique). Si la société n'existe pas encore, le dire.

**Structure proposée — 13 sections, les quatre règles avant les prix.** 1. Qui nous sommes, ce que ce document régit · 2. **Ce qu'E-Dome est et n'est pas — les quatre règles en toutes lettres** · 3. Définitions · 4. Compte, rôles cumulables, et ce qu'un badge garantit · 5. Prix et rémunération d'E-Dome · 6. Paiements : qui encaisse, et pourquoi jamais nous · 7. Publier un bien — les obligations qui restent les vôtres · 8. Programme apporteurs · 9. Contenu, avis, publicité et classement · 10. Modération, suspension, recours · 11. Données personnelles, et les données de vos clients si vous êtes une agence · 12. Responsabilité · 13. Droit applicable, for, version.

### Texte de remplacement du §5

> **5. Prix et rémunération d'E-Dome**
>
> **5.1 Ce qui est gratuit.** Le compte, le profil, le fil, la messagerie, la recherche, les favoris et la publication de vos propres biens — vente, location longue durée, location de courte durée — sont gratuits et sans limite de nombre pour un particulier. Demander l'accompagnement d'une agence ou un devis à un prestataire est gratuit.
>
> **5.2 Ce que nous ne facturons jamais.** E-Dome ne perçoit aucune rémunération dont le montant ou l'exigibilité dépend de la conclusion d'une vente ou d'un bail. Il n'existe aucun frais de publication, aucun frais de dossier, aucune commission sur le prix d'un bien vendu ou loué à long terme. Aucun frais n'est jamais mis à la charge d'un locataire.
>
> **5.3 Ce que nous facturons.** [table générée depuis le module de tarification : produit · qui paie · nature · assiette · *dû même si aucune transaction n'a lieu*]
>
> **5.4 Comment un prix est fixé.** Les prix sont publiés à l'avance, identiques pour tous les utilisateurs d'une même formule, et dus indépendamment du résultat obtenu. Les commissions de la location de courte durée, des services, des événements, des lives, des formations et de la boutique portent sur une prestation déjà fournie ou une réservation déjà encaissée par le prestataire de paiement — jamais sur le prix d'un bien immobilier.
>
> **5.5 TVA.** Les prix sont indiqués [hors / toutes] taxes ; la TVA suisse s'ajoute au taux légal lorsqu'elle est due. *[à arrêter avec l'agent comptable]*
>
> **5.6 Part des apporteurs.** Prélevée sur ce qu'E-Dome encaisse, jamais ajoutée au prix que vous payez. Détail au §8.
>
> **5.7 Modification.** Annoncée 30 jours à l'avance, sans effet sur une période déjà payée.

**`/aide`** : la réponse unique sur le barème éclate en trois questions — « Que paie-je si je vends mon bien ? » (rien) · « Comment E-Dome gagne-t-il de l'argent ? » · « E-Dome prend-il une commission sur ma vente ? » (non, et pourquoi). Générées depuis le module.

**`/publier`** : ce n'est pas une réécriture, c'est un **changement de nature**. L'écran de tarification disparaît pour la vente et la location longue durée, et devient un écran d'**obligations** : formule officielle du loyer initial si le canton ou la commune l'exigent, autorisation du bailleur si l'hôte est locataire, numéro d'enregistrement si le bien est dans l'UE, information Lex Koller. C'est le seul écran de la démo qui passe d'un discours de prix à un discours de conformité.

---

## 7. Q3 — le rôle `courtier` : je le supprime

`src/lib/types.ts` porte `courtier` dans un jeu de 13 rôles. **Position tranchée : supprimé.** (1) Le rôle décrit un utilisateur, pas E-Dome : il n'est pas illicite en soi. Mais un badge « Courtier » à côté du logo E-Dome crée l'**apparence** qu'E-Dome exerce ou organise le courtage, et l'apparence suffit à nourrir un litige ou une réclamation LCD d'un concurrent. (2) Il est **redondant** : B.5 prévoit `agence` et `agent` ; un courtier indépendant est une agence d'une personne, ou un agent. Le métier reste couvert. (3) Le jeu de rôles est à refondre de toute façon (audit §4) : c'est le moment.

Si on insiste pour le garder : **`agent`**, libellé « Agent immobilier » et jamais « Courtier », avec sur le profil « Mandaté directement par ses clients. E-Dome ne signe aucun mandat et n'est pas partie aux mandats de ses utilisateurs. »

**Même traitement pour `notaire`, `architecte`, `photographe`, `promoteur`.** Notaire : monopole cantonal ; architecte : titre protégé dans plusieurs cantons (**à vérifier**). Un badge « Notaire » non vérifié contre le registre cantonal est une allégation trompeuse. Ils deviennent `prestataire` + `profession` + `professionVerified`, ou ils disparaissent. Je retire aussi **`investisseur`** comme rôle : un espace « investisseur » est le chemin le plus court vers la promesse de rendement.

---

## 8. La gratuité change-t-elle quelque chose ? Oui, dans les deux sens

**B.3 a raison sur le fond, tort sur le raccourci.** Ce que la gratuité apporte réellement : plus aucune somme perçue par E-Dome n'est liée à une mise en relation sur un bien, donc plus de « salaire » au sens de l'art. 412 CO à propos d'une vente — la question du courtage **cesse de se poser** pour le pôle vente. Elle écarte aussi le dossier consommateur le plus exposé (2 500 CHF payés par un particulier pour une promesse de visibilité).

Ce que l'argument « c'est le modèle des portails suisses » ne couvre pas :

- **La gratuité n'immunise pas.** E-Dome perçoit des abonnements d'agences. Vendu comme « l'accès aux vendeurs qui nous ont sollicités », l'abonnement redevient une rémunération pour l'indication d'occasions de conclure — payée par l'agence au lieu du particulier. C'est pourquoi la phrase de B.3 « on ne vend pas des contacts » n'est pas du positionnement : **c'est la condition de validité du modèle**, et elle doit figurer dans les CGU, pas seulement dans le pitch.
- **La question 5 de l'audit est une question juridique**, pas seulement produit. Distribuer les demandes d'accompagnement exige un critère **objectif, publié et non payant** (périmètre géographique déclaré + tour de rôle + capacité). Toute pondération par le montant de l'abonnement recrée la vente de contacts.
- **Le risque se déplace**, il ne disparaît pas : vers la LCD, la nLPD et la modération. Et la comparaison avec les portails ne vaut que pour le pôle annonces — les portails n'organisent pas de programme d'apporteurs rémunérés, n'attribuent pas de demandes d'accompagnement et ne délivrent pas de badge professionnel. Ce sont ces trois briques qui rapprochent E-Dome de l'intermédiaire. « Comme les portails » n'est pas un blanc-seing.

---

## 9. Désaccords attendus

**Agent marketing.** Il voudra « vendez sans commission », « gagnez jusqu'à 30 % », « agences vérifiées ». Je refuse « sans commission » seul — comparaison implicite et dénigrante envers les agences (art. 3 LCD) ; j'accepte « E-Dome ne prend aucune commission sur votre vente ». Je refuse tout taux sans son assiette **dans la même phrase**. « Agence vérifiée » : d'accord seulement si le badge est adossé au registre IDE et si l'interface dit ce qu'il ne garantit pas. *Ce qu'on perd :* des titres plus courts et une promesse plus percutante. **Sur l'assiette accolée au taux, je ne céderai jamais.**

**Agent comptable.** Il voudra des taux plus élevés et, tôt ou tard, un revenue share sur les commissions d'agence — de loin la plus grosse assiette disponible, et déjà écrite au §5. Je refuse sans discussion : c'est la règle 3, et c'est le seul point où l'interdit est net. Sur les taux marketplace, **aucune objection juridique** même à un niveau élevé : il n'existe pas de plafond légal sur une commission de service. Seule limite : un taux publié, unique par formule, non négocié au cas par cas pour un même service. *Ce qu'on perd :* la plus grosse source de revenu imaginable, et de la flexibilité commerciale.

**Agent produit.** Il voudra moins de mentions et plus de replis. Je cède sur presque tout, sauf **quatre** mentions visibles sans interaction : (i) l'assiette accolée à toute estimation de gain d'apporteur ; (ii) l'étiquette du contenu sponsorisé ; (iii) ce qu'un badge ne garantit pas ; (iv) « aucun frais à la charge du locataire », sur l'écran de location. *Ce qu'on perd :* quatre écrans un peu plus chargés.

**Agent architecture.** Il voudra un schéma souple. Je demande trois **interdits par construction**, pas par validation : `fees.chargedToTenant` non représentable, `referralDepth` borné à 1, aucun champ permettant de détenir une garantie de loyer.

---

## 10. Ce que je refuse

Aucune de ces formulations ni de ces mécanismes ne doit apparaître dans l'interface, quelle qu'en soit la valeur commerciale.

1. « Commission E-Dome sur la vente », « part d'E-Dome sur la transaction », « revenue share sur la commission de l'agence » — y compris la ligne qui figure **aujourd'hui** au §5 des CGU.
2. Tout prix, **forfait compris**, dû seulement si la vente ou le bail se conclut — y compris un « frais de dossier remboursé si ça ne se vend pas ».
3. « Nos courtiers », « notre équipe de courtage », le rôle `courtier`, et tout badge suggérant qu'E-Dome mandate quelqu'un.
4. Vendre, réserver, prioriser ou pondérer contre paiement l'attribution d'une demande d'accompagnement. Pas de « pack de contacts », pas de « leads premium », pas de file d'attente payante.
5. Un taux d'apporteur sans son assiette dans la même phrase.
6. Le parrainage à deux niveaux, et toute prime liée au recrutement d'autres apporteurs.
7. Toute promesse ou projection de rendement présentée comme un résultat attendu. Une estimation porte le mot « indicative », sa base de calcul, et n'engage pas.
8. Un avis sans transaction rattachée ; un avis sollicité contre avantage sans que l'avantage soit indiqué ; la suppression d'un avis négatif sans trace.
9. Du contenu sponsorisé non étiqueté ; un classement modifié par paiement sans mention ; un « choix de la rédaction » qui est un placement payé.
10. Tout écran suggérant qu'E-Dome détient, séquestre ou garantit des fonds : pas de « compte E-Dome », pas de « garantie de loyer E-Dome », pas de « paiement sécurisé par E-Dome ». C'est « par notre prestataire de paiement ».
11. Les brèves de marché inventées de `market-pulse.tsx` (Q8 de l'audit) : des chiffres sans source sur le taux de la BNS ou le prix du m² à Genève sont des allégations sur le marché réel. Source réelle, ou texte manifestement illustratif. Ce n'est pas la règle « pas de chiffres de traction » : c'est l'art. 3 LCD.
12. Toute phrase « E-Dome vérifie que… » là où E-Dome ne vérifie pas — en particulier sur la Lex Koller : jamais « éligible aux acheteurs étrangers ».

---

## 11. À faire confirmer par un avocat avant toute mise en production

Régime d'autorisation du courtage à Genève et Vaud · seuil de bascule entre hébergement de courte durée et bail · qualification de l'apporteur au regard de l'AVS et de la TVA · lettre exacte de la LCD sur la vente en boule de neige et sur la publicité de masse · articles du DSA sur la suspension de compte et du P2B sur le classement, si l'UE s'ouvre · applicabilité à la Suisse des règles OCDE de déclaration par les plateformes (DPI/DAC7) — je n'ai trouvé confirmation que pour les crypto-actifs (CARF, dès 2026) · base exacte des contingents cantonaux LFAIE pour les logements de vacances · étendue des obligations de sanctions (SECO) pour une plateforme non financière.

## Sources consultées

- [Art. 417 CO — texte bilingue](https://www.droit-bilingue.ch/fr-en/2/22/220-417-611.html)
- [Contrat de courtage, art. 412 ss CO](https://juriup.ch/terme-juridique/le-contrat-de-courtage/)
- [Réduction de la rémunération du courtier — CEDIDAC, bulletin 82](https://www.unil.ch/files/live/sites/ecolededroit/files/02-centres/cedidac/publications/bulletins/Bulletin_no_82.pdf)
- [Tessin, LFid 953.100 — professions de fiduciaire](https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/pdfatto/atto/618)
- [Formule officielle du loyer initial — Office fédéral du logement](https://www.bwo.admin.ch/fr/formule-officielle-loyer-initial)
- [Art. 270 CO](https://justement.ch/fr/doc/act/ch/220/part_2/tit_8/chap_2/lvl_E/lvl_I/lvl_1/art_270)
- [Transaction couplée, art. 254 CO](https://juriup.ch/terme-juridique/transaction-couplee-bail-a-loyer/)
- [Ordonnance sur les banques, art. 5 — dépôts du public](https://www.droit-bilingue.ch/de-fr/9/95/952.02-5-9.html)
- [LFAIE / Lex Koller](https://www.ubs.com/ch/fr/services/guide/mortgages-and-financing/articles/lex-koller.html)
- [Règlement (UE) 2024/1028 — locations de courte durée](https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX:32024R1028)
- [Loi Hoguet et diffusion d'annonces en ligne — CA Dijon, 19.02.2009](https://www.alain-bensoussan.com/avocats/la-publication-dannonces-immobiliere-en-ligne-et-la-loi-hoguet/2010/02/26/)
- [Dubaï, règlement n° 85 de 2006 — registre des courtiers immobiliers](https://legaladviceme.com/legislation/115/bylaw-85-of-2006-regulating-real-estate-brokers-register-in-dubai)
