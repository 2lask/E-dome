# DECISIONS-2 — arbitrages de la Mission 2

*Le CEO tranche à partir de `AUDIT-2.md` et des 18 notes. Chaque décision dit ce qui est retenu, ce qui est écarté, et pourquoi. Deux points sont laissés ouverts pour le fondateur — signalés **[À VALIDER]**. Rien n'est construit avant le feu vert (Partie D, étape 2).*

---

## D1 — La racine : un annuaire de personnes UNIQUE et dérivé [RETENU]

**Décision.** On donne à la PERSONNE le traitement que la Mission 1 a donné à l'argent et au bien : une source unique dont tout le reste dérive. Concrètement — un `DIRECTORY: Account[]` unique (le type `Account`/`RoleGrant` existe déjà, vide, dans `model/identity.ts`), un nouveau `demo/directory.ts` avec des **vues pures** (`accountById`, `personSummary`, `publicProfile`, `requireAccount` qui échoue au build comme `propRef()` pour les biens), et **référence par id** partout où `types.ts` embarque aujourd'hui `User` par valeur (`Property.host`, `SocialPost.author`, `Conversation.participant`, `Review.author`).

**Écarté :**
- *Corriger les valeurs divergentes sur place* — l'audit (architecture) est formel : ce sont des **identités échangées**, pas des chiffres qui divergent. Une passe de correction reviendrait au premier ajout de profil.
- *Réécrire `mock-data.ts` d'un bloc* — trop risqué. On **enveloppe** l'existant derrière l'annuaire, comme `data/properties.ts` l'a fait pour les biens (patron déjà prouvé).

**Garde-fou :** un invariant supplémentaire dans `demo/invariants.ts` — tout id référencé (conversations, avis, posts, `AgencyMember.accountId`) existe au `DIRECTORY`, et aucun id ne porte deux identités. Le build casse sinon.

**Résout les désaccords #3 et #4 de l'audit.**

## D2 — B.5 « Visiter en tant que » : option 2, « ÊTRE un profil » [RETENU]

**Décision.** On remplace « visiter en tant que rôle » par « entrer dans la peau d'un profil existant » : on **est** Sophie, courtière à Lausanne, avec son compte, ses biens, ses messages, son tableau de bord, son identité dans le fil et la messagerie. Le sélecteur liste des personnes (les profils de B.1), pas des rôles abstraits.

**Écarté :** *option 1 (le rôle change tout)*. `viewingAs` n'est lu par aucune page aujourd'hui ; câbler la réactivité complète (nav, dashboard, contenus, identité) coûterait plus cher pour un résultat **moins** honnête (un rôle sans visage). Le code penche déjà à moitié vers l'option 2. **Aligne la préférence du fondateur** (B.5) et le désaccord #2 de l'audit.

## D3 — B.4 Le mode explicatif : un vrai tutoriel guidé [RETENU]

**Décision.** On reconstruit la visite guidée comme le fondateur la décrit : un **spotlight** (portail React + `getBoundingClientRect` sur l'élément cible + masque assombri autour + bulle qui **attend une action réelle** « cliquez ici »), une **progression** (« étape 4 sur 12 »), un bouton **« Passer »** toujours visible, une **reprise** là où on s'est arrêté, **plusieurs parcours** (découverte générale + un par rôle : « comment je vends », « comment je gère mon agence », « comment je gagne avec les apporteurs »), un **déclenchement auto à la première visite** et un **bouton permanent** de relance — **visible sur mobile** (le lanceur actuel est `hidden md:inline-flex`). Tous les textes dans **un seul fichier** éditable.

**Écarté :** *garder le panneau-qui-navigue actuel* (`guided-tour.tsx`) et *l'interrupteur d'annotations* `explainMode`/`POLE_EXPLAIN` que le fondateur rejette explicitement — ce dernier redescend en glossaire secondaire, il ne partage plus le rang de la visite guidée.

## D4 — L'argent par profil, sans recréer le facteur-5 [RETENU]

**Décision.** On étend le journal unique : `ownerId` sur `Entry` (`ledger.ts:58-72`), une table `PROFILES` remplace les constantes `OWNED_*` (`identity.ts:50,53`), `derive.ts` prend un filtre par `ownerId`, et **les invariants bouclent par `ownerId`** (une passe globale masquerait un profil vide/faux). Les **ventes d'agence** (millions de GMV) entrent comme un **second type d'écriture non-commissionnable** — affiché comme volume, **jamais** sommé dans le revenu d'E-Dome (`vente` est déjà exclu de `CommissionPole`, `charge.ts`).

**Nettoyages liés :** suppression du barème aboli 500/2 500 CHF encore vivant via `estimateEarning()` (`pricing/legacy.ts`, appelé par `recommend-button`, `attach-cards`, `post-viewer`, `/publier`) ; suppression du moteur mort `monthlyRevenue` (`mock-data.ts:2315-2328`) ; réservations dérivées du journal (fin des 8 % vs 12 %) ; `/paiement` reçoit la vraie commande + un `MoneyFlow`.

**Aligne les désaccords #9 (GMV agence : volume affiché, jamais commissionnable — tranché ici) et confirme la reco comptable.**

## D5 — La Boutique refondée en AFFILIATION [RETENU]

**Décision.** La Boutique cesse d'être un marketplace eBay et devient de l'**affiliation** conforme à `DECISIONS.md §1.8` (art. 20a LTVA) : E-Dome **référence** des produits, **redirige vers le marchand** (« vous quittez E-Dome »), **ne tient pas** le checkout, **ne garantit pas** l'achat, **n'est pas** vendeur apparent. La rémunération suit le modèle (`RATES.boutique` — affiliation, payée **par le marchand**, jamais un pourcentage marketplace ajouté à l'acheteur). Les avis produits exigent un `transactionId` (`ReviewCompliance`).

**Écarté :** *garder le marketplace intégré* — l'audit juridique est clair : le produit déployé a tranché **dans le mauvais sens** une décision déjà prise (désaccord #5). Le corriger est **prioritaire sur tout ajout de contenu** dans la Boutique, sinon la Mission 2 ancre le vice.

## D6 — Persistance « le temps de la session » [RETENU]

**Décision.** Sans backend (Supabase reste gelé, réservé aux leads), les actions de création et de contact **persistent dans un magasin de session** (contexte React + `localStorage`, enveloppé de `try/catch`) : publier un bien/service/formation, envoyer un devis, ouvrir un contact **se reflètent immédiatement** ailleurs dans l'app pendant la visite. C'est ce qui rend la plateforme « vivante » au sens du fondateur.

**Écarté :** *un vrai backend* (hors périmètre, gelé) ; *laisser les culs-de-sac* (échoue « vivant » et « chaque clic mène quelque part »).

## D7 — Géographie des profils [TRANCHÉ par le fondateur]

**Décision (fondateur, 2026-09-25) :** **majorité Suisse romande, plus quelques
profils internationaux assumés dans le contenu.** Contrainte ajoutée par le
fondateur : **les profils étrangers doivent refléter les restrictions locales du
programme apporteurs** — un profil France/Allemagne/Portugal ne touche jamais de
prime immobilière (volet biens exclu dans ces pays, cf. `JURIDIQUE-A-VALIDER.md`
§0.5), seulement de l'affiliation marketplace. La cohérence géographique et la
cohérence juridique se rejoignent ici.

**Précision (fondateur) :** la restriction doit être **visible dans
l'interface**, pas seulement dans la donnée — en regardant un profil étranger,
on comprend *pourquoi* il ne touche rien sur le pôle biens (mention explicite sur
la fiche et dans son espace apporteur, du type « affiliation biens indisponible
dans son pays »).

## D8 — `/reservations` : un seul écran, dérivé du journal [RETENU]

**Décision.** On supprime la page `/reservations` autonome (prix inventés, 8 %) et on garde **un seul** écran de réservations, dérivé de `dashboard-data.ts`/journal. **Aligne le désaccord #8.**

## D9 — `/admin` protégé, en premier [RETENU]

**Décision.** Avant tout le reste : protéger `/admin` par mot de passe serveur, comme `/admin/leads` déjà (solution simple, sans dépendance Supabase). Corriger `DECISIONS.md §4.2` qui l'affirme faussement protégé (désaccord #6). **B.7 dette #1.**

## D10 — Panneau de flux d'argent sur les écrans restants [RETENU]

**Décision.** Poser `MoneyFlow` sur `/paiement`, la modale « Faire une offre » et les autres écrans de transaction prévus, et corriger son en-tête qui survend sa couverture. **B.7 dette #2.**

## D11 — Ordre de migration `Profile.roles` → `PlatformRole` [TRANCHÉ]

**Décision** (désaccord #10 de l'audit, non tranché par l'agent) : on **peuple d'abord l'annuaire** avec le type `Account`/`RoleGrant`, puis on migre `Profile.roles` → `PlatformRole` **dans la foulée du même chantier D1**, pour que les rôles retirés sur avis juridique (`courtier`, `investisseur` — `DECISIONS.md D6`) **ne réapparaissent pas** dans l'UI de profil. Pas deux chantiers séparés.

## D12 — Branche et déploiement [RETENU]

**Décision.** On continue sur **`feat/plateforme-v2`** (URL de préproduction stable, rien de fusionné). Un commit par étape, poussé après chaque commit. La landing et ses annexes restent **figées**.

## D14 — Le nouveau modèle d'affiliation à DEUX mécaniques [RETENU, chiffres révisés]

*Changement de modèle introduit par le fondateur le 2026-09-25, pressenti puis
challengé par les agents juridique, comptable, marketing et architecture
(`analyse2/*-modele.md`). Le principe transverse : E-Dome et l'apporteur se
servent **à l'intérieur** de ce que le vendeur annonce, jamais en plus, et
l'apporteur voit toujours son **gain net** avant de recommander.*

**Deux mécaniques, verrouillées par le type, jamais confondues :**

- **BIENS (vente + location longue durée) — une PRIME EN FRANCS.** Le vendeur
  fixe une prime en CHF, payée quand il **accepte** une mise en relation
  (demande de visite acceptée). **Jamais** un % du prix, **jamais** indexée
  dessus, **jamais** conditionnée à la vente. Type-safe : nouveau
  `Charge.kind = "bien-introduction"` avec un `PrimeMoney` de marque (construit
  seulement via `primeChf()`, borné) — « prime en % du prix du bien » ne
  compile pas (architecture, `analyse2/architecture-modele.md`).
- **MARKETPLACE (formations, lives, événements, services, courte durée,
  boutique) — un POURCENTAGE.** Le vendeur ouvre son produit à l'affiliation par
  produit et fixe un taux **sortant de sa marge** ; la commission d'E-Dome reste
  inchangée ; déclencheur = **vente** du produit. Un champ `affiliation?` sur les
  charges marketplace, **refusé** sur les charges biens.
- **ABONNEMENTS — inchangé.** Apporter une agence/un propriétaire abonné = une
  part de ce qu'E-Dome encaisse sur 12 mois.

**⚠️ Ceci REMPLACE l'ancien « apporteur = 10–30 % du revenu E-Dome sur tous les
pôles ».** Cette règle ne vaut plus **que pour les abonnements**. À corriger
partout : `pricing/`, CGU, `/tarifs`, `/aide`, `/apporteurs`, et toute la copie
d'interface (aujourd'hui fausse pour les biens — l'apporteur touche désormais la
**majorité** de la prime, pas 10–30 %).

**Chiffres — révisés après challenge du comptable (`analyse2/comptable-modele.md`),
valeurs de travail à confirmer :**

| Hypothèse fondateur | Retenu (comptable) | Raison |
| --- | --- | --- |
| E-Dome 15 % de la prime | **12 %** | Aligné sur `location-ct` (déjà défendu) ; 15 % serait le taux le plus élevé du catalogue sur le pôle le plus risqué |
| Plancher 3 CHF | **3 CHF** (inchangé) | = `MIN_COMMISSION` existant |
| Prime min 1 CHF | **min pratique 50 CHF** (net apporteur ≈42) | En dessous de ~30 CHF, le plancher de 3 CHF dépasse la prime ; à 1 CHF le net devient négatif |
| Plage 1–10 000 CHF | **50–3 000 CHF** | 10 000 ≈ 1–2 % d'un bien romand → indiscernable d'une commission déguisée (rejoint le risque « 1 % » juridique) |
| Affiliation marketplace 20–50 / 10–25 / 5–15 / 3–10 % | **mêmes fourchettes, bornées dans l'UI**, appliquées au prix brut, commission E-Dome non diluée | Sans plafond, le taux peut vider la marge vendeur |
| Apporteur abonnement « 10–30 % » (générique) | **barème par formule : 15 % Patrimoine / 25 % Vitrine & Mandats / 30 % Régie** | Le label générique ne correspond à rien de réel dans le code aujourd'hui |

`MoneyFlow` gagne un champ **`affiliate`** distinct de `apporteur` (sémantiques
opposées : `apporteur` se prélève sur la part E-Dome, `affiliate` sur la marge
vendeur) — les mélanger recréerait le facteur-5 (thème 4 de l'audit). Un seul
moteur `quote()`, un seul flux vérifié.

**[TRANCHÉ — fondateur, 2026-09-25] : E-Dome prélève 12 % sur la prime biens.**
Le raisonnement du fondateur, retenu : le risque de qualification en courtage
(art. 412) pèse sur **l'apporteur**, pas sur E-Dome ; or en Suisse **le courtage
est une activité libre**, donc facturer un service à quelqu'un qui exerce une
activité légale n'expose pas E-Dome. Passer à 0 % reviendrait à renoncer à un
revenu pour couvrir un risque qui n'est pas le nôtre, et à montrer un pôle sans
modèle économique.

Sur la contradiction avec le garde-fou « sur une commission, E-Dome ne prélève
rien » : on **précise** le garde-fou, on n'abandonne pas le revenu. Ce garde-fou
vise la **commission d'une agence sur une vente immobilière** ; une **prime de
mise en relation, fixe et indépendante de la conclusion, n'est pas une
commission**. Cette distinction est à rendre explicite dans `rules.ts`, les CGU
et le glossaire, pour qu'on ne puisse plus les confondre (travail intégré à
l'étape 1.5 de `PLAN-2.md`).

**Paramétrable :** `EDOME_PRIME_SHARE = 0.12` reste une constante du catalogue —
passer à 0 % (ou toute autre valeur) si l'avocat tranche autrement ne demande
aucune refonte. L'analyse complète reste en `JURIDIQUE-A-VALIDER.md §0`, avec la
question ajoutée par le fondateur : *le fait que l'apporteur puisse être qualifié
de courtier expose-t-il E-Dome, en Suisse, à un titre quelconque — complicité,
organisation d'une activité soumise à autorisation, ou autre ?*

## D15 — Le virage FREEMIUM [RETENU en principe, frontière **[À VALIDER]**]

**Décision de principe (fondateur) :** l'abonnement n'est plus un droit d'entrée.
Tout le monde — particuliers, propriétaires, agents **et agences** — peut
utiliser la plateforme gratuitement et **vraiment travailler**. Le payant, c'est
« aller plus loin » : volume, visibilité, équipe, statistiques avancées, mise en
avant, automatisations. La bonne limite **gêne quand on réussit**, pas au
démarrage.

**Désaccord d'experts à trancher par le fondateur** (les deux notes sont dans
`analyse2/`) :
- **Marketing** (`marketing-modele.md`) : élargir le gratuit — Présence de 3 à
  **10 biens** (à 3, on exclut 42 % des agences suisses), et **demandes
  d'accompagnement gratuites et illimitées pour tous** (c'est le canal
  d'acquisition de mandats d'une agence gratuite).
- **Comptable** (`comptable-modele.md`) : **ne pas** élargir le plafond de biens
  (3 couvre déjà les agences à ≤5 biens = 42 % du marché) et **garder payantes**
  les quatre lignes qui justifient Vitrine (accompagnement, mise-en-avant,
  badge-vérifié, statistiques). Sinon le tunnel exige une conversion irréaliste
  (46 % à >100 % du marché suisse en comptes gratuits actifs) pour atteindre les
  161 agences payantes visées (`DECISIONS.md §8`).

**Synthèse de CEO — VALIDÉE par le fondateur (2026-09-25).** On découple deux
choses. (1) **Les plafonds d'inventaire peuvent être généreux** (une agence
gratuite publie plusieurs biens) — c'est l'acquisition, et ça sert le mot
d'ordre. (2) **Les fonctions « de réussite » restent payantes** (2e
utilisateur/équipe, sous-domaine, mise en avant, stats avancées, automatisations,
volume illimité) — la limite qui gêne quand on grandit. (3) **Les demandes
d'accompagnement : un quota gratuit** (petit nombre de candidatures actives à la
fois) et **illimité en payant**.

**Précisions du fondateur :**
- **Tous les plafonds gratuits et le quota d'accompagnement sont des valeurs du
  catalogue** (`pricing/catalog.ts`), modifiables sans toucher au code — le
  fondateur veut les ajuster après ses entretiens avec les agences.
- **Ce que chaque expert perd dans ce compromis, et l'indicateur qui dirait
  qu'on s'est trompé de côté :**
  - *Le marketing perd* l'accompagnement gratuit et illimité (son levier
    d'acquisition le plus fort). **Indicateur qu'on a serré de trop :** peu de
    créations de comptes agence / peu de premières candidatures d'accompagnement,
    ou un taux d'abandon élevé au moment où le quota gratuit se ferme.
  - *Le comptable perd* la protection stricte des quatre lignes qui justifient
    Vitrine ; un quota gratuit ouvre une brèche vers l'accompagnement.
    **Indicateur qu'on a ouvert de trop :** des agences décrochent des mandats
    via le quota gratuit et **restent gratuites** (conversion vers Vitrine trop
    basse) — le tunnel de `DECISIONS.md §8` ne se referme pas.

## D13 — Garde-fous permanents (juridique) [RETENU]

Le bandeau « données fictives » reste partout ; **aucune** affirmation de traction sur E-Dome ; **aucun** profil ne se présente comme courtier mandaté par E-Dome ; tout avis est rattaché à une transaction (`ReviewCompliance`) et déclare `incentivized` ; la restriction apporteur `pays × type d'apport` (12 CH / 3 FR / 3 UAE, jamais de commission immobilière touchée depuis FR/UAE) est respectée ; vigilance **droit à l'image** sur les avatars des 15 profils (photos libres de droits, pas de personnes réelles identifiables).

---

## État des questions ouvertes

**Tranchées par le fondateur le 2026-09-25 :**
- **D7 géographie** → majorité suisse romande + quelques profils internationaux assumés, reflétant les restrictions apporteurs par pays.
- **Cadence** → un seul arrêt, après les trois premiers profils complets ; ensuite je vais au bout sans autre pause.

**Tranchées par le fondateur le 2026-09-25 (2e tour) :**
1. **D14 — part E-Dome sur la prime biens → 12 %** (paramétrable, cf. D14), avec reformulation du garde-fou dans `rules.ts`/CGU/glossaire, et une question ajoutée en `JURIDIQUE-A-VALIDER.md §0.2` (l'apporteur-courtier expose-t-il E-Dome ?).
2. **D15 — freemium → la synthèse de CEO** (plafonds généreux + fonctions de réussite payantes + quota gratuit d'accompagnement), plafonds et quota **en valeurs de catalogue**, avec le « ce que chaque expert perd + l'indicateur d'erreur » documenté en D15.

**Toutes les questions du chantier sont tranchées.** Prochaine action : construction, étape 0 → 1 → 1.5 → 2 → 3, **arrêt après les 3 profils**.
