# PLAN-2 — construction de la Mission 2

*Plan de chantier issu de `AUDIT-2.md` et `DECISIONS-2.md`. Un thème par étape, un ou plusieurs commits par étape, poussé après chaque commit, portes de qualité vertes à chaque fois. L'ordre suit les **dépendances**, pas la seule gravité. **Arrêt de validation obligatoire après l'étape 3** (Partie D, étape 4).*

---

## POINT DE REPRISE (pour une session neuve)

- **Où on en est (maj 2026-09-25).** Étapes **0, 1, 1.5, 2, 3 FAITES** et poussées. **⛔ ARRÊT DE VALIDATION après l'étape 3** : en attente du feu vert du fondateur sur les 3 premiers profils (Sophie user-002, Marc user-003, Jean-Luc user-015) avant de construire les 12 autres. Suite prévue sans autre arrêt : 4 (profils+fil) → 5 (tutoriel+être-un-profil) → 6 (affiliation+freemium+boutique) → 7 (pôles) → 8 (design/mobile/tests).
- **Historique.** Audit fait (`AUDIT-2.md`, 18 notes dans `analyse2/`), arbitrages faits (`DECISIONS-2.md`), **go du fondateur reçu** (2026-09-25) avec géographie et cadence tranchées. **Changement de modèle intégré** : affiliation à deux mécaniques (D14) + freemium (D15), challengé par 4 agents (`analyse2/*-modele.md`), reflété ici et dans `JURIDIQUE-A-VALIDER.md §0`. **Il reste à montrer au fondateur le diff de ce PLAN avant l'étape 0** (et deux questions ouvertes : part E-Dome sur la prime biens 0 %/12 %, frontière freemium).
- **Branche.** `feat/plateforme-v2`, rien de fusionné, landing figée.
- **Serveur de dev** sur `:3002` (`npm run dev`). Gates : `npm run typecheck` / `lint` / `build` / `test` (Playwright) / `test:data`.
- **Prochaine action concrète :** étape 0 (sécurité `/admin` + nettoyages), puis étape 1 (annuaire unique), puis étape 1.5 (moteur pricing).

---

## Barre de qualité (Partie C — vraie à chaque commit)

Aucune donnée contradictoire · aucun bouton mort · états vides/chargement/erreur traités · parfait de 360 px au grand écran (testé en vrai) · accessible (clavier, focus visible, libellés, contrastes) · tous les textes dans des fichiers éditables · bandeau « données fictives » présent · zéro affirmation de traction · gates vertes.

---

## Étape 0 — Sécurité et nettoyages qui débloquent [indépendant, en premier]

*Petits, sûrs, sans dépendance ; ils retirent le poison avant qu'on construise dessus. (Le retrait du barème aboli passe à l'étape 1.5, avec la refonte pricing qui touche les mêmes fichiers — reco architecture.)*

- **Protéger `/admin`** par mot de passe serveur (comme `/admin/leads`) — B.7 #1 (D9). Corriger `DECISIONS.md §4.2`.
- **Supprimer** le moteur mort `monthlyRevenue` (`mock-data.ts:2315-2328`).
- **Corriger les deux erreurs d'hydratation** : `Date.now()` en rendu (`poll-block.tsx`, `demo/posts.ts` → dater sur `DEMO_TODAY`), `<Link>` imbriqué sur `/formations`.
- **`BlurImage` : fallback `onError`** (fin des skeletons figés en Boutique).

**Livrable :** 1-2 commits. Gate : build vert, `/feed` sans « 1 Issue ».

## Étape 1 — L'ANNUAIRE UNIQUE (la racine) [D1, D11]

*Le préalable de tout B.1. On ne crée aucun nouveau profil ici — on unifie le casting existant sur une seule source et on prouve la cohérence.*

- `DIRECTORY: Account[]` dans `demo/identity.ts` ; `demo/directory.ts` avec vues pures (`accountById`, `personSummary`, `publicProfile`, `requireAccount`).
- **Référence par id** partout : `Property.host`, `SocialPost.author`, `Conversation.participant`, `Review.author` cessent d'embarquer `User` par valeur.
- **Supprimer les annuaires concurrents** : `PUBLIC_SEEDS`, les `C_*`/`U_*` du fil, `agencyTeam`, contacts locaux de `messages`.
- Migrer `Profile.roles` → `PlatformRole` (les rôles retirés `courtier`/`investisseur` ne réapparaissent pas).
- **Invariant** : tout id référencé existe au `DIRECTORY`, aucun id à deux identités (build casse sinon).

**Livrable :** 1-2 commits. Gate : `test:data` étendu, plus aucune « Profil introuvable » depuis le fil/la messagerie.

## Étape 1.5 — LE MOTEUR DE PRICING À DEUX MÉCANIQUES [D14, D4] — NOUVELLE

*Prérequis de l'étape 2 : l'argent par owner (D4) a besoin de `quote().flow` pour générer les écritures d'affiliation. On refond le pricing et on retire le barème aboli d'un seul geste (mêmes fichiers).*

- **Retirer le barème aboli** 500/2 500 CHF : supprimer `pricing/legacy.ts` et remplacer `estimateEarning()` chez ses 4 appelants (`recommend-button`, `attach-cards`, `post-viewer`, `/publier`) par `quote()`.
- **Mécanique BIENS** : nouveau `Charge.kind = "bien-introduction"` avec `PrimeMoney` de marque (via `primeChf()`, borné **50–3 000 CHF**), verrouillé au type — « prime en % du prix » ne compile pas. Part E-Dome **12 % (`EDOME_PRIME_SHARE`, paramétrable → 0 % sans refonte)**, plancher 3 CHF, prélevée **à l'intérieur** de la prime. Déclencheur = mise en relation acceptée.
- **Préciser le garde-fou** (décision fondateur, D14) : dans `model/rules.ts`, les CGU (`content/conditions.ts`) et le glossaire, rendre explicite qu'une **prime de mise en relation, fixe et indépendante de la conclusion, n'est pas une commission** — la règle 3 et le garde-fou « E-Dome ne prélève rien sur une commission » visent la commission d'agence sur une vente, pas la prime.
- **Mécanique MARKETPLACE** : champ `affiliation?: { rate }` sur les charges marketplace (refusé sur biens), taux borné aux fourchettes (formations/lives 20–50 %, événements 10–25 %, services 5–15 %, courte durée 3–10 %), prélevé **sur la marge vendeur**, commission E-Dome inchangée.
- **`MoneyFlow`** gagne `affiliate` (distinct de `apporteur`) ; `quote()` garde son invariant vérifié (brut = bénéficiaire + affilié + part E-Dome + PSP).
- **Apporteur abonnement** : barème par formule (15 % Patrimoine / 25 % Vitrine & Mandats / 30 % Régie), fin du label générique « 10–30 % ».
- **Constantes** dans `catalog.ts` : `EDOME_PRIME_SHARE`, `PRIME_FLOOR`, `PRIME_MIN=50`, `PRIME_MAX=3000`, fourchettes marketplace, `APPORTEUR_SHARE` réservé à `subscription`.

**Livrable :** 1-2 commits. Gate : `test:data` couvre les deux mécaniques ; « 0 CHF à E-Dome » redevient vrai partout pour les biens ; aucun `estimateEarning`.

## Étape 2 — L'ARGENT PAR PROFIL [D4, D10]

- `ownerId` sur `Entry`, table `PROFILES`, `derive.ts` filtré par `ownerId`, **invariants bouclés par owner**.
- GMV agence = écriture non-commissionnable (volume affiché, jamais dans le revenu E-Dome).
- Réservations dérivées du journal (fin 8 % vs 12 %) ; `/reservations` autonome supprimée (D8).
- `/paiement` : vraie commande + `MoneyFlow` ; simulateur hypothécaire validé (fin des NaN/Infinity/négatifs).

**Livrable :** 1-2 commits. Gate : un seul montant par fait, sur tous les écrans.

## Étape 3 — LES TROIS PREMIERS PROFILS COMPLETS  →  **⛔ ARRÊT VALIDATION** [B.1]

*Partie D, étape 4 : « Arrêt après les trois premiers profils complets, pour que je valide la direction avant que tu en fasses quinze. »*

Trois personnes **complètes et cohérentes partout** (page profil, posts du fil, messages, avis reçus/donnés, dashboard, biens/services/formations selon le rôle, appartenance d'agence) : par ex. **Sophie** (courtière, Lausanne), **Marc** (investisseur, Genève), **Jean-Luc** (patron d'agence, Neuchâtel) — en plus de Léo déjà en place. Chaque chiffre dérivé du journal, chaque relation réciproque.

**→ Je m'arrête et te livre l'URL avec ces trois profils à regarder. Tu valides la direction (ton, densité, crédibilité, géographie D7) avant que je fasse les douze autres.**

---

*(Suite après ta validation — sans autre arrêt si tu confirmes la cadence, ou avec les points de contrôle que tu fixes.)*

## Étape 4 — LES 12 PROFILS RESTANTS + LE FIL VIVANT [B.1, B.2]

- Les ~12 profils restants (distribution selon D7 validé), avec histoires, anciennetés, **relations réciproques** (commentaires, recommandations, avis croisés, messages).
- **Refonte du fil** : variété (texte/photo/sondage/bien/formation/événement/question/retour d'expérience), rythme (dates sur `DEMO_TODAY`, pas toutes le même jour), longueurs variées, commentaires **non unanimement élogieux**, contenu des pôles Services et « particulier ». Fin du « se suivre soi-même ».
- **Messagerie qui relie** : contact/devis/ouverture créent une vraie conversation (persistance de session, D6) ; deep-links `/messages?to=<id>` fonctionnent ; notifications cohérentes (un seul compteur).

## Étape 5 — LA VISITE GUIDÉE TUTORIEL + « ÊTRE UN PROFIL » [B.4, B.5 / D2, D3]

- **Spotlight** : portail + `getBoundingClientRect` + masque assombri + action attendue + « étape n/N » + « Passer » + reprise + **parcours multiples** (découverte + par rôle) + auto-lancement 1re visite + relance permanente **visible sur mobile**. Textes dans un fichier unique.
- **Sélecteur → « être un profil »** : on entre dans la peau de Sophie/Marc/… (compte, biens, messages, dashboard, identité feed/messagerie réels). Le « mode explicatif » annotations redescend en glossaire.

## Étape 6 — L'AFFILIATION, LE FREEMIUM ET LA BOUTIQUE [B.6 / D5, D6, D14, D15]

*La grosse étape du changement de modèle. Plusieurs commits. Dépend du moteur (1.5) et des profils (3-4).*

- **Activation biens sur `/publier`** : bloc « faites-vous amener des acheteurs » — carte enregistrée + budget, **rien prélevé à l'activation**, prime en CHF (50–3 000), modifiable/retirable/désactivable sans frais ; prime plus élevée = meilleur classement.
- **`/apporteurs` refondu** : un **commutateur Biens / Marketplace** en tête (jamais les deux mécaniques dans la même grille — c'est le bug actuel). Biens = toujours une **prime en CHF** ; marketplace = toujours résolu au **net en CHF** affiché à l'apporteur (le % n'explique que). Suivi visible des deux côtés (le vendeur voit ce qu'il a payé, l'apporteur ce qu'il a amené). Fin du funnel mort et des 3 chiffres contradictoires (audit thème 4/apporteur).
- **Marketplace** : ouverture à l'affiliation **par produit**, taux borné, **aperçu chiffré avant activation** (prix, part affilié, commission E-Dome, ce que le vendeur garde), anti-cold-start (taux pré-rempli, mise en avant des produits affiliés, taux minimum pour figurer).
- **Protection & anti-fraude biens** : « ce contact n'était pas sérieux » sous 48 h (remboursement plafonné), apporteur trop contesté perd l'accès ; paliers KYC (<1 000 auto, au-delà vérification renforcée + validation manuelle) ; détection de collusion **par paire de comptes et par cumul** (pas le seul seuil de 1 000).
- **Boutique en affiliation** (D5) : référencement + redirection marchand (« vous quittez E-Dome »), fin du checkout/garantie/modération-vendeur E-Dome, avis avec `transactionId`.
- **Freemium** (D15) : `/tarifs` régénéré avec le découpage gratuit/payant **par rôle** ; gating par rôle (plafonds d'inventaire généreux, fonctions de réussite payantes, quota gratuit sur les demandes d'accompagnement) — **tous les plafonds gratuits et le quota d'accompagnement sont des valeurs de `catalog.ts`**, ajustables sans toucher au code ; **CGU (`conditions`), `/aide` et toute la copie** réécrits pour les **deux mécaniques** + le freemium — correction partout de l'ancien « apporteur 10–30 % sur tous les pôles » (désormais abonnements seulement).
- **Restriction géographique visible** (D7) : sur la fiche d'un profil étranger et dans son espace apporteur, une mention explicite dit *pourquoi* il ne touche rien sur le pôle biens (« affiliation biens indisponible dans son pays »).
- **Persistance de session** (D6) : créations (bien, service, formation, live, offre) et contacts **persistent** et apparaissent là où ils doivent ; validation des formulaires ; « Voir l'annonce » mène à la fiche.

## Étape 7 — REPRISE PÔLE PAR PÔLE [B.6]

Pour chaque pôle, la question « donne envie / clair / complet / sonne vrai » :
- **Agence** : upgrade d'abonnement réel, vitrine filtrée sur la géo de l'agence, garde-fous de formule, formulaire « Postuler » à 4 champs, « statistiques complètes » distinctes.
- **Services** : fiche `/services/[id]`, commission affichée, cycle devis→paiement→avis, noms cliquables.
- **Formations** : lecteur de leçon lié, leçons/vidéos **par formation**, certificat réel, progression cohérente.
- **Investisseurs** : entrée dans la nav, CTA Patrimoine → bon écran, KPI dérivés, badge rendement lisible.
- **Location longue durée** : des biens sur l'arc lémanique, « Réserver » adapté (visite, pas nuits), prix « /mois », similaires pertinents.

## Étape 8 — DESIGN, MOBILE, ACCESSIBILITÉ, FINITIONS [Partie C / Thèmes 8-9]

- Boutons morts (8) réveillés ou retirés ; liens `cal.com` fictifs (5) corrigés ou retirés ; compteurs de notifications unifiés ; `/reseau` avec un vrai modèle de follower.
- **Design** : H1 serif sur `/demo`, `/agence`, `/tarifs` ; vides de composition (agence, tarifs, messages) comblés ; filigrane « surjo.aep » retiré ; badges d'état produit sémantiques.
- **Mobile 360 px** : troncatures du dashboard, 404 recouvert par « Expert IA », safe-area de la nav.
- **Accessibilité** : anneau de focus visible (dont PWA), `aria-label` distincts, état « introuvable » factorisé.
- **`MoneyFlow`** sur les écrans de transaction restants.
- **Tests neufs** : `no-dead-buttons`, cohérence de l'annuaire (aucun id à deux identités), invariants d'argent par owner, deep-links messagerie.

---

## Récapitulatif des dépendances

```
Étape 0 (sécurité/nettoyage) ─┐
                              ├─► Étape 1 (annuaire) ─► Étape 1.5 (moteur pricing 2 mécaniques)
                              │                              │
                              │                              ▼
                              │                        Étape 2 (argent/owner) ─► Étape 3 (3 profils) ⛔VALIDATION
                              └───────────────────────────────────────────────────────┘
Étape 3 validée ─► Étape 4 (profils+fil) ─► Étape 5 (tutoriel + être-un-profil)
                                          ─► Étape 6 (affiliation + freemium + boutique)
                                          ─► Étape 7 (pôles) ─► Étape 8 (design/mobile/tests)
```

L'étape 1.5 (moteur de pricing à deux mécaniques) s'intercale entre l'annuaire (1) et l'argent par owner (2) : D4 a besoin de `quote().flow` pour générer les écritures d'affiliation. Cadence confirmée par le fondateur : **un seul arrêt, après l'étape 3**, puis tout s'enchaîne sans autre pause.
