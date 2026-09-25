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

## D7 — Géographie des profils **[À VALIDER par le fondateur]**

**Recommandation du CEO :** **majorité Suisse romande** (Lausanne, Genève, Fribourg, Neuchâtel, Nyon, Vevey, Sion, Montreux) pour la crédibilité « plateforme suisse », **plus deux profils à portée internationale explicitement assumée** (réseau Maroc / Golfe), affichés comme tels, pas découverts par hasard. Cela garde un peu du glamour international sans l'incohérence actuelle (casting à moitié étranger sous une bannière suisse).

**Alternatives que le fondateur peut choisir :** (a) **100 % Suisse romand** (cohérence maximale, zéro portée internationale affichée) ; (b) **garder une vraie portée mondiale** (Marrakech/Dubaï/Lisbonne conservés), mais alors **l'assumer dans le contenu**. **C'est le désaccord #1 de l'audit — je ne le tranche pas seul.**

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

## D13 — Garde-fous permanents (juridique) [RETENU]

Le bandeau « données fictives » reste partout ; **aucune** affirmation de traction sur E-Dome ; **aucun** profil ne se présente comme courtier mandaté par E-Dome ; tout avis est rattaché à une transaction (`ReviewCompliance`) et déclare `incentivized` ; la restriction apporteur `pays × type d'apport` (12 CH / 3 FR / 3 UAE, jamais de commission immobilière touchée depuis FR/UAE) est respectée ; vigilance **droit à l'image** sur les avatars des 15 profils (photos libres de droits, pas de personnes réelles identifiables).

---

## Les deux questions qui attendent ta validation

1. **D7 — géographie des profils** : ma reco = majorité suisse romande + 2 profils internationaux assumés. Tu peux préférer 100 % suisse, ou garder une portée mondiale explicite.
2. **Cadence de la construction** : Partie D prévoit un **arrêt après les trois premiers profils complets** pour que tu valides la direction avant que j'en fasse quinze. Je le respecte. Confirme-moi juste que le reste (persistance de session, refonte boutique, nouvelle visite guidée) peut avancer **sans autre arrêt** une fois la direction des profils validée, comme en Mission 1 — ou dis-moi où tu veux d'autres points de contrôle.
