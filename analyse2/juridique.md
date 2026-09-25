# Audit juridique — Mission 2 (« rendre E-Dome vivante »)

Lecture seule. Sources croisées : `JURIDIQUE-A-VALIDER.md`, `DECISIONS.md`,
`src/lib/model/rules.ts`, `src/lib/model/compliance.ts`, `src/content/conditions.ts`,
`src/proxy.ts`, `TODO.md`, et le code effectif de `src/app/(app)/boutique/`,
`src/app/(app)/admin/`, `src/lib/pricing/*`, `src/lib/profile-*`.

Verdict en une phrase : **les quatre règles tiennent dans les textes et dans le
moteur de tarification, mais la Boutique les contredit dans le produit
lui-même** — c'est la trouvaille principale de cet audit, antérieure à toute
question posée par la Mission 2, et elle doit être corrigée **avant** d'ajouter
les 15 profils, parce que des avis croisés sur des fiches produit qui promettent
déjà un modèle interdit aggraveraient le problème plutôt que de le révéler.

---

## 1. Les quatre règles — tenues ou trahies, écran par écran

### 1.1 Contradiction majeure : la Boutique dément sa propre CGU — GRAVITÉ CRITIQUE

`src/content/conditions.ts:50` génère le barème du §6 des CGU depuis `RATES` et
affiche, pour la boutique : `RATES.boutique.max === 0 ? "Rien — affiliation" :
...` → avec `src/lib/pricing/catalog.ts:39` (`boutique: { min: 0, max: 0 }`),
les CGU disent au lecteur, noir sur blanc : **E-Dome ne prélève rien sur la
boutique, c'est de l'affiliation.**

Le produit dit le contraire, à trois endroits, et **aucun des trois
n'importe `RATES` ni aucun module de `@/lib/pricing`** :

- `src/app/(app)/boutique/page.tsx:38-39` (commentaire d'en-tête) et
  `:219-221` (bandeau visible) : *« E-Dome fournit la vitrine + paiement +
  visibilité. Vendeurs responsables de produits, expéditions et SAV.
  Commission marketplace 4–8 %, jamais ajoutée au prix payé. »* — 4-8 % est un
  **littéral en dur**, contraire à la règle posée dans `DECISIONS.md` §3.3
  (« aucun montant en CHF [ou taux] littéral hors du module de tarification »)
  et au chiffre réel du catalogue (0 %).
- `src/app/(app)/boutique/vendre/page.tsx:102` (cadrage) et `:275-284`
  (récapitulatif de commission) : calcule *en direct* `form.prix * 0.08` et
  affiche *« Commission E-Dome (8 % indicatif) »* — un vendeur voit un chiffre
  concret, pas une fourchette, qui n'existe dans aucune source de vérité.
- `src/app/(app)/boutique/vendre/page.tsx:259` : promet aux apporteurs *« Leur
  part (10–30 %) est prélevée sur la commission marketplace d'E-Dome »* — or
  cette commission vaut 0 par construction (`RATES.boutique`), donc **la
  promesse faite à l'apporteur sur cet écran est structurellement
  impayable**. C'est une affirmation vérifiable et fausse adressée à un tiers
  qui prend une décision commerciale dessus (art. 3 LCD, pratique commerciale
  trompeuse).
- `src/app/(app)/boutique/[id]/page.tsx:633-634` reprend le même texte 4-8 %
  au pied de la fiche produit.

**Ce que cela signifie pour le modèle.** `DECISIONS.md` §1.8 a choisi
l'affiliation **pour un motif fiscal précis** : sous l'art. 20a LTVA, dès
qu'E-Dome facilite une livraison de biens au point que vendeur et acheteur
concluent le contrat *sur la plateforme*, elle devient fournisseur réputé et
doit facturer le prix entier. Or le code fait exactement ce que la décision
voulait éviter :

- **Checkout intégré** : `boutique/page.tsx:671-675` — le bouton « Passer
  commande » déclenche une alerte *« Paiement (démo) : Stripe Connect sera
  intégré en Phase 4 V1.0 »*. C'est un paiement **chez E-Dome**, pas une
  redirection vers la boutique du vendeur. Aucun composant de `boutique/` ne
  contient de mention « vous quittez E-Dome » ou de lien sortant vers un site
  tiers (`src/components/affiliate/` vérifié — aucune occurrence).
- **Modération et mise en ligne par la plateforme** : `boutique/vendre/page.tsx:69`
  — *« Votre produit est en cours de validation par l'équipe E-Dome »* : un
  opérateur d'affiliation ne valide pas les fiches d'un catalogue qu'il ne
  vend pas ; c'est un comportement de marketplace-opérateur.
- **Garantie acheteur portée par E-Dome** : `boutique/[id]/page.tsx:482` —
  *« Paiement sécurisé E-Dome. Protection acheteur incluse (remboursement si
  produit non conforme ou non reçu). »* C'est une obligation de résultat sur
  la conformité de la prestation d'un tiers, exactement le risque que
  `JURIDIQUE-A-VALIDER.md` §2 pose comme question ouverte (« le statut de
  vendeur apparent emporte-t-il une responsabilité sur la conformité de la
  prestation ? ») — sauf qu'ici il n'est pas posé, il est **déjà répondu par
  l'affirmative dans l'interface**, avant même que la question soit tranchée.
- **Avis non rattachés, badge « Achat vérifié » non adossé** :
  `boutique/[id]/page.tsx:56-62` (`COMMON_REVIEWS`) — cinq avis fictifs,
  génériques, partagés par **tous** les produits (le commentaire ligne 40 le
  dit explicitement : « pas spécifiques par produit en maquette »), dont
  trois portent `verified: true` → badge affiché *« Achat vérifié »*
  (`:691-696`). Aucun `transactionId`, aucun rattachement réel. Cela viole
  frontalement `src/lib/model/compliance.ts:116-131` (`ReviewCompliance`,
  `transactionId` **obligatoire**) et `conditions.ts` §9 (« un avis ne peut
  être publié que par un utilisateur ayant réalisé une transaction
  rattachée »). Voir §3 ci-dessous : ce type déjà existe dans le code mais
  n'est câblé nulle part — la Boutique est la preuve que le risque n'est pas
  théorique.

**Verdict boutique/affiliation.** Le modèle économique affiché au fondateur et
à l'avocat (0 %, affiliation, aucun stock, aucun envoi, aucun fonds détenu —
`DECISIONS.md:411-436`) et le modèle que rencontre un utilisateur réel sur
`/boutique` sont **deux produits différents**. Le second est un marketplace
eBay classique, jusque dans son commentaire de code (« esprit eBay »,
`boutique/page.tsx:30`) et sa checklist SAV (garantie légale, droit de
rétractation, TVA — `vendre/page.tsx:99`, qui reconnaît elle-même les
obligations d'un vendeur classique). Ce n'est pas un détail de texte : c'est
la reconstruction complète du risque fiscal et de responsabilité que la
décision §1.8 avait pour but exact d'éliminer. **Ne pas construire par-dessus
tant que ce point n'est pas corrigé** — toute nouvelle fonctionnalité posée
sur ces trois fichiers (avis croisés, profils vendeurs enrichis) hérite du
même vice et l'ancre plus profondément dans le produit.

**Recommandation minimale de mise en cohérence** (hors périmètre d'écriture de
cet audit, à transmettre à qui code) : soit (a) réécrire les trois écrans pour
refléter l'affiliation réelle — clic sortant vers la boutique du vendeur,
aucun paiement chez E-Dome, aucune garantie E-Dome, commission 0 affichée
comme telle ou disparition du chiffre — soit (b) si le fondateur veut
vraiment un checkout intégré, rouvrir §1.8 de `DECISIONS.md` en connaissance
de cause : ce n'est alors plus un choix par défaut, c'est un renoncement
explicite à l'argument fiscal qui a justifié l'affiliation.

### 1.2 Le reste des textes actuels — cohérent

`src/lib/model/rules.ts`, `src/content/conditions.ts` (CGU réécrites) et
`src/content/publier-obligations.ts` tiennent les quatre règles ensemble,
sans isoler la règle 3 (l'erreur que `DECISIONS.md` §1.0 corrige
explicitement). Le mot « courtier » n'apparaît pas dans le code applicatif
grep'é. `PLATFORM_RULES` est un tuple figé de 4 (`rules.ts:50`) : aucun écran
ne peut afficher une règle seule. Rien à signaler hors boutique.

---

## 2. Protection de `/admin` — B.7, dette n°1

**Gravité : élevée, déjà documentée, pas corrigée.**

`src/proxy.ts:46-52` place `/admin/:path*` dans le matcher — en apparence
protégé. Mais le proxy lui-même le dit noir sur blanc (`proxy.ts:17-26`) :
`updateSession` **sort immédiatement tant que Supabase n'est pas configuré**,
ce qui est actuellement le cas partout, y compris — le commentaire le précise
— **en production**. `TODO.md:142-152` confirme et date le constat : *« Le
middleware laisse tout passer tant que Supabase n'est pas configuré, ce qui
est le cas en production. La console d'administration — adresses e-mail,
signalements de harcèlement — est donc publique. »*

Ce que `/admin/page.tsx` expose aujourd'hui à quiconque a l'URL, sans compte :

- un tableau de 10 « utilisateurs » avec email, rôle, statut (`:11-22`) ;
- des signalements nommés, dont un de « harcèlement » avec l'identité de la
  cible et de l'auteur (`:32-38`, `MOCK_SIGNALEMENTS`) ;
- un onglet Paramètres avec des champs de barème éditables et un bouton
  « Sauvegarder » (`:350-425`) — non câblé à un vrai backend en l'état, mais
  visuellement une console de configuration tarifaire ouverte à tous.

Le bandeau ajouté (`:177-187`, « Données d'exemple ») répond au risque
**réputationnel** (ne pas laisser croire que les chiffres sont réels) mais pas
au risque **structurel** : une console d'administration nommément
« Administration », accessible sans authentification, sur un dépôt montré à
des investisseurs et — le jour où Supabase est réellement branché pour
d'autres écrans — potentiellement sur des données utilisateurs réelles tant
que ce fichier n'a pas sa propre porte. `TODO.md:150-152` propose la
correction correcte : réutiliser le mécanisme mot de passe serveur déjà
construit pour `/admin/leads` (`src/lib/leads/admin-auth.ts`), ou retirer
`/admin` de la démonstration publique. Aucune des deux n'est faite.

**Pour la Mission 2** : si les 15 nouveaux profils ou les avis croisés
alimentent des compteurs visibles dans `/admin` (signalements de faux avis,
par exemple — voir `MOCK_SIGNALEMENTS` id `S005`, déjà « Faux avis » comme
catégorie), cela resterait dans une page non protégée. Pas une raison de
retarder la Mission 2, mais une raison de ne pas router de nouvelles données
sensibles (adresses, motifs de signalement nominatifs) vers cet écran sans
régler la porte d'abord.

---

## 3. Garde-fous pour les 15 profils et les avis croisés (B.1)

Le modèle de conformité existe déjà, mais **n'est câblé nulle part** — c'est
le deuxième trou structurel trouvé par cet audit, distinct de la Boutique.

**Ce qui existe et doit être réutilisé, pas réinventé :**

- `src/lib/model/compliance.ts:122-131` — `ReviewCompliance` : `transactionId`
  **obligatoire** (pas optionnel), `authorRole`, `moderationState`,
  `incentivized: boolean` obligatoire (si l'auteur a reçu un avantage,
  l'avis doit le dire). C'est exactement le schéma qu'exige `conditions.ts`
  §9 et le §6 de `JURIDIQUE-A-VALIDER.md`.
- Mais `src/lib/profile-types.ts:163-168` (`Profile.stats`) ne porte que des
  **compteurs** (`rating`, `reviewsCount`) — aucun tableau d'avis structuré,
  aucun lien vers `ReviewCompliance`. Et `grep` sur tout `src/` ne trouve
  **aucun import** de `ReviewCompliance` en dehors de sa propre définition :
  le type est un vœu pieux, pas une contrainte appliquée.
- Les avis qui existent déjà dans le produit (`dashboard/avis` via
  `@/lib/dashboard-data`, et `boutique/[id]/page.tsx` `COMMON_REVIEWS`)
  **n'utilisent pas ce schéma** et n'ont donc pas de `transactionId`. La
  Boutique (§1.1 ci-dessus) est la preuve concrète que sans ce câblage, la
  règle « pas d'avis sans transaction » est déjà violée dans le dépôt actuel.

**Garde-fous à respecter en construisant les 15 profils et leurs avis
croisés :**

1. **Chaque avis pointe une transaction précise et existante dans les
   données de démo**, pas un profil en général. Concrètement : si Marie
   laisse un avis à Bruno, c'est parce qu'une réservation / un mandat / une
   commande identifiable les relie déjà dans le jeu de données (biens,
   formations, réservations courte durée — les catalogues existants de
   `src/lib/data/`). Un avis « gratuit », posé pour rendre un profil plus
   vivant sans transaction sous-jacente, recrée exactement le défaut de la
   Boutique.
2. **`incentivized` doit être pensé, pas oublié** : si un profil reçoit
   un avantage (accès anticipé, remise) en échange d'un avis, il faut le
   dire à l'écran — sinon ne pas fabriquer ce cas de figure du tout dans la
   démo.
3. **Aucun avis ne doit porter, même indirectement, sur E-Dome elle-même** —
   pas de témoignage type « E-Dome m'a trouvé 3 acheteurs », qui serait une
   affirmation de traction non vérifiable, exactement ce que `DECISIONS.md`
   §4.2 a retiré du post épinglé et des brèves de marché. Les avis croisés
   portent sur les *utilisateurs entre eux* (le vendeur, l'hôte, le
   prestataire), jamais sur la plateforme.
4. **Le bandeau « données fictives » doit accompagner tout écran qui les
   affiche**, sur le modèle déjà posé par `src/lib/demo/identity.ts:1-29` et
   `admin/page.tsx:177-187` — ce module documente déjà la discipline voulue
   (une seule source de vérité, chiffres d'audience modestes, jamais le
   fondateur). Les 15 profils devraient suivre la même discipline qu'a
   suivie `user-001` : pas de doublons de chiffres entre fichiers, pas de
   compteur à quatre chiffres (`DECISIONS.md` §4.2 : « l'ordre de grandeur
   crédible pour un réseau qui se lance est 0 à 50 »).
5. **Aucun des 15 profils ne doit se présenter comme mandaté, courtier, ou
   agissant pour le compte d'E-Dome.** Le rôle `courtier` a été supprimé du
   modèle sur avis juridique précisément pour cette raison
   (`DECISIONS.md:583-590`) — un profil qui réintroduirait le mot ou la
   fonction dans son `headline` ou son `about` romprait ce garde-fou par un
   simple champ de texte libre, hors de portée du système de types.
6. **Respecter la restriction géographique de l'apporteur** si l'un des 15
   profils porte le rôle `apporteur` : la répartition déjà actée
   (`DECISIONS.md` §5 : 12 Suisse, 3 France, 3 Émirats) existe pour
   démontrer le blocage `pays × type d'apport`. Un profil français ou
   émirati ne doit **jamais** afficher un avis, un post ou une commission
   *touchée* sur un apport **immobilier** — seulement, le cas échéant, le
   message de restriction lui-même, ou une activité non immobilière.
7. **Vérifier que la matière première visuelle (avatars/photos) n'emprunte
   pas le visage d'une personne réelle identifiable** sans autorisation.
   Ce point n'est pas dans `JURIDIQUE-A-VALIDER.md` — c'est un risque propre
   à la Mission 2 (15 profils « crédibles » invite à chercher des photos
   réalistes) : le droit à l'image (art. 28 CC) et le RGPD/nLPD (portrait =
   donnée personnelle) s'appliquent à une photo de stock montrant un vrai
   visage associé à une fausse biographie professionnelle et de faux avis.
   Préférer des sources dont la licence couvre explicitement cet usage, ou
   des visuels génératifs / stylisés qui ne visent aucune personne réelle.

---

## 4. Points neufs à surveiller pour la Mission 2 (Lex Koller, loyer initial, courte durée, RGPD/nLPD)

Rien de nouveau sur le fond par rapport à `JURIDIQUE-A-VALIDER.md` §6, mais
deux points prennent un relief différent une fois qu'on ajoute des profils et
de l'activité :

- **Numéro d'enregistrement courte durée (UE, depuis le 20 mai 2026).**
  `JURIDIQUE-A-VALIDER.md:271-274` le marque « urgent » depuis septembre 2026.
  Si l'un des 15 nouveaux profils est un hôte de courte durée avec un bien
  situé dans l'UE (à vérifier selon la liste de biens que la Mission 2
  choisit), sa fiche ne doit pas apparaître « complète et crédible » sans ce
  champ — cela rendrait plus visible, pas moins, l'absence déjà connue du
  champ dans le modèle de données.
- **Lex Koller.** `JURIDIQUE-A-VALIDER.md:279` : ne jamais écrire qu'un bien
  est « éligible aux acheteurs étrangers ». Si l'un des profils est présenté
  comme acheteur domicilié à l'étranger (pour rendre le réseau crédible à
  l'international), vérifier qu'aucun texte d'activité ou avis généré ne lui
  fait affirmer avoir acheté un bien résidentiel suisse sans que
  l'information Lex Koller n'ait été montrée dans son parcours.
- **RGPD/nLPD — rien de neuf en droit, mais un risque neuf en volume.**
  Quinze profils avec avis croisés, historique, localisation et rôle
  multiplient les champs qui ressemblent à des données personnelles réelles
  (email, ville, numéro IDE le cas échéant). Le risque n'est pas la nLPD en
  tant que telle (ce sont des personnes fictives), mais la **confusion**
  pour un visiteur qui ne saurait pas distinguer une fiche réelle d'une fiche
  de démonstration — d'où l'importance du bandeau constant (§3.4) plutôt
  qu'un rappel isolé sur une seule page.

Rien à signaler de neuf sur la formule du loyer initial au-delà de ce qui est
déjà tracé en `JURIDIQUE-A-VALIDER.md` §6 (table à confirmer) — les 15 profils
n'ajoutent pas de risque propre sur ce point tant qu'aucun ne prétend afficher
un montant de loyer initial sans la mention deja prévue par
`src/lib/model/compliance.ts:82-90` (`ListingCompliance.initialRentNotice`).

---

## 5. Récapitulatif des gravités

| # | Constat | Fichier(s) | Gravité |
| --- | --- | --- | --- |
| 1 | Boutique : commission 4–8 % affichée alors que `RATES.boutique = 0` | `boutique/page.tsx:38-39,219-221`, `boutique/vendre/page.tsx:102,275-284`, `boutique/[id]/page.tsx:633-634` | **Critique** |
| 2 | Boutique : checkout intégré, modération E-Dome, garantie acheteur E-Dome → reconstruit le risque art. 20a LTVA / vendeur apparent que §1.8 visait à éliminer | `boutique/page.tsx:671-675`, `boutique/vendre/page.tsx:69`, `boutique/[id]/page.tsx:482` | **Critique** |
| 3 | Boutique : promesse de commission apporteur 10–30 % d'une assiette nulle | `boutique/vendre/page.tsx:259` | Élevée |
| 4 | Boutique : avis génériques partagés entre produits, badge « Achat vérifié » sans `transactionId` | `boutique/[id]/page.tsx:56-62,691-696` | Élevée |
| 5 | `ReviewCompliance` (transactionId obligatoire) défini mais câblé nulle part dans le produit réel | `src/lib/model/compliance.ts:122-131` vs `profile-types.ts`, `dashboard-data`, boutique | Élevée (structurel, à régler avant B.1) |
| 6 | `/admin` publiquement atteignable (le proxy ne protège rien tant que Supabase n'est pas configuré, y compris en prod) | `src/proxy.ts:17-26`, `admin/page.tsx` | Élevée, déjà documentée (`TODO.md:142-152`) |
| 7 | Droit à l'image des avatars des 15 nouveaux profils | à construire | Moyenne — préventif |

---

## 6. Désaccords / points où je m'écarte des documents existants

- `DECISIONS.md` §4.2 affirme : *« Les indicateurs de `/admin` sont dérivés
  des tableaux de la page, et la route est protégée. »* Cette dernière
  affirmation est **inexacte à ce jour** : `proxy.ts` et `TODO.md`
  eux-mêmes disent le contraire. Je le signale comme désaccord factuel avec
  un document de décision plutôt que comme une découverte isolée, parce que
  quiconque relit `DECISIONS.md` sans lire `TODO.md` croira le problème
  réglé.
- Je vais plus loin que `JURIDIQUE-A-VALIDER.md` sur la boutique : ce
  document pose la question fiscale (art. 20a LTVA) comme un point à
  confirmer par l'avocat sur le **modèle**. Je constate que le **produit
  déployé** a déjà tranché dans l'autre sens, en silence, avant même que la
  question soit posée à l'avocat. Ce n'est plus une question de position
  juridique à valider ; c'est un défaut d'implémentation par rapport à une
  décision déjà prise dans `DECISIONS.md` §1.8. Je le traite donc comme
  prioritaire sur toute nouvelle donnée de démonstration (profils, avis)
  qui viendrait peupler ces mêmes écrans.
