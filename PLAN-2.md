# PLAN-2 — construction de la Mission 2

*Plan de chantier issu de `AUDIT-2.md` et `DECISIONS-2.md`. Un thème par étape, un ou plusieurs commits par étape, poussé après chaque commit, portes de qualité vertes à chaque fois. L'ordre suit les **dépendances**, pas la seule gravité. **Arrêt de validation obligatoire après l'étape 3** (Partie D, étape 4).*

---

## POINT DE REPRISE (pour une session neuve)

- **Où on en est.** Audit fait (`AUDIT-2.md`, 18 notes dans `analyse2/`), arbitrages faits (`DECISIONS-2.md`). **En attente du feu vert du fondateur** avant toute construction (Partie D, étape 2 : « Arrêt, j'valide »). Deux questions ouvertes pour lui : géographie des profils (D7) et cadence (une seule pause après l'étape 3, ou davantage).
- **Branche.** `feat/plateforme-v2`, rien de fusionné, landing figée.
- **Serveur de dev** sur `:3002` (`npm run dev`). Gates : `npm run typecheck` / `lint` / `build` / `test` (Playwright) / `test:data`.
- **Prochaine action concrète une fois validé :** étape 0 (sécurité + nettoyages), puis étape 1 (l'annuaire unique).

---

## Barre de qualité (Partie C — vraie à chaque commit)

Aucune donnée contradictoire · aucun bouton mort · états vides/chargement/erreur traités · parfait de 360 px au grand écran (testé en vrai) · accessible (clavier, focus visible, libellés, contrastes) · tous les textes dans des fichiers éditables · bandeau « données fictives » présent · zéro affirmation de traction · gates vertes.

---

## Étape 0 — Sécurité et nettoyages qui débloquent [indépendant, en premier]

*Petits, sûrs, sans dépendance ; ils retirent le poison avant qu'on construise dessus.*

- **Protéger `/admin`** par mot de passe serveur (comme `/admin/leads`) — B.7 #1 (D9). Corriger `DECISIONS.md §4.2`.
- **Retirer le barème aboli** 500/2 500 CHF : neutraliser `pricing/legacy.ts` et ses appelants (`recommend-button`, `attach-cards`, `post-viewer`, `/publier`) — D4.
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

## Étape 6 — BOUTIQUE EN AFFILIATION + PERSISTANCE DES CRÉATIONS [B.6 / D5, D6]

- Boutique : référencement + redirection marchand (« vous quittez E-Dome »), fin du checkout/garantie/modération-vendeur E-Dome, rémunération d'affiliation conforme au modèle, avis avec `transactionId`.
- Parcours de création (bien, service, formation, live, offre) **persistent en session** et apparaissent ensuite là où ils doivent ; validation des formulaires ; « Voir l'annonce » mène à la fiche.

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
                              ├─► Étape 1 (annuaire) ─► Étape 2 (argent/profil) ─► Étape 3 (3 profils) ⛔VALIDATION
                              │                                                          │
                              └──────────────────────────────────────────────────────────┘
Étape 3 validée ─► Étape 4 (profils+fil) ─► Étape 5 (tutoriel+être-un-profil)
                                          ─► Étape 6 (boutique+persistance)
                                          ─► Étape 7 (pôles) ─► Étape 8 (design/mobile/tests)
```

Les étapes 5-8 dépendent surtout de l'annuaire (1) et de l'argent (2) ; elles peuvent s'enchaîner après la validation de l'étape 3, dans cet ordre, sans autre arrêt si la cadence est confirmée (D7 / question 2).
