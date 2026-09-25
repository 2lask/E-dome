# AUDIT-2 — Mission 2 : « rendre la plateforme vivante »

*Synthèse du CEO à partir de 18 notes dans `analyse2/` : 10 testeurs-personas, 2 designers, 6 agents de domaine. Chaque testeur a joué son parcours en vrai (Playwright contre `localhost:3002`) et lu le code. Les notes individuelles gardent le détail ; ce document relie, priorise, et conserve les désaccords.*

**Date :** 2026-09-25 · **Branche :** `feat/plateforme-v2` · **Rien n'est modifié** (audit en lecture seule).

---

## Le verdict en un paragraphe

La Mission 1 a laissé un socle sain là où elle a travaillé : le journal d'argent (`demo/ledger.ts`), le point d'entrée unique des biens (`data/properties.ts`), le moteur tarifaire (`pricing/quote.ts`), la palette et le système de cartes. Mais **la Mission 2 bute sur une seule faille structurelle, dont presque tout le reste découle : la PERSONNE n'a jamais reçu le traitement « source unique » que l'argent et le bien ont reçu.** Il existe aujourd'hui **six à sept annuaires de gens concurrents et contradictoires**, au point que le même identifiant désigne des personnes différentes selon l'écran. Tant que ce point n'est pas réglé, B.1 (« un profil identique partout ») est structurellement impossible, et tout profil ajouté aggrave la contradiction. Autour de cette racine, quatre familles de problèmes reviennent chez presque tous les testeurs : **les parcours de création ne persistent rien**, **la messagerie ne relie personne**, **l'argent se contredit de nouveau** (le « facteur 5 » est revenu, à ~×50 sur l'écran apporteurs), et **la Boutique contredit le modèle d'affiliation** — juridiquement et économiquement. Le critère des dix minutes ne passe pas aujourd'hui, surtout sur mobile.

---

## Les dix thèmes, du plus structurant au plus local

### Thème 1 — L'IDENTITÉ FRAGMENTÉE, la racine [BLOQUANT]

*Sources : architecture, marketing, comptable, + testeurs agent/prestataire/formateur/locataire.*

- **Sept annuaires de personnes indépendants.** `mock-data.ts` (`users[]`, 16), `profile-data.ts` (`PUBLIC_SEEDS`, 11), `demo/posts.ts` (`u1`…`u4`/`u-yasmin`, 6 auteurs du fil), `messages/page.tsx` (contacts locaux u1–u4), `content/agence.ts` (`agencyTeam`, 6 noms hors modèle), les suggestions de `reseau`, et le seul propre — `demo/identity.ts` (Léo). Le type cible `Account`/`RoleGrant` existe dans `model/identity.ts` mais est **vide** (`model/agency.ts:7-9` le dit).
- **Le même id = des personnes différentes** (ce ne sont pas des chiffres qui divergent, ce sont des identités échangées) :
  - `user-007` = « Pierre Gonçalves » (Lisbonne) dans `mock-data.ts:144-158` vs « Camille Rochat » (Fribourg) dans `profile-data.ts:231-242`.
  - `user-005` = photographe dans `mock-data.ts:111-126` vs « Promoteur » dans `profile-data.ts:191-203`.
  - `user-012` = « Clémence Moreau » messagère (`conv-004`, `mock-data.ts:1306-1317`) vs « Omar Haddad » sur `/profil/user-012` (`profile-data.ts:291-302`).
  - Sophie Durand (`user-002`) : 3100 abonnés / 134 avis (`mock-data.ts:64-78`) vs 890 / 42 (`profile-data.ts:150-163` + `profile-posts.ts:39-44`).
- **Cause technique racine :** `types.ts` embarque `User` **par valeur** dans `Property.host`, `SocialPost.author`, `Conversation.participant`, `Review.author`… au lieu de référencer par id. `getUserById()` existe (`mock-data.ts:305`) mais rien n'oblige à l'utiliser.
- **Conséquences vécues :** cliquer un auteur récurrent du fil → « Profil introuvable » (`profil/[id]/page.tsx:105-121`) ; `/profil/user-016` introuvable ; le widget « qui suivre » propose de **se suivre soi-même** (`posts.ts:719,727`).

**→ C'est le préalable non négociable.** Comptable et architecture le disent tous deux : aucun branchement financier ni aucun nouveau profil avant un annuaire unique.

### Thème 2 — LES PARCOURS DE CRÉATION SONT DES CULS-DE-SAC [BLOQUANT]

*Sources : testeurs vendeur, prestataire, formateur, patron.*

Chaque « Publier » se contente d'un `setPublished(true)` local et n'écrit nulle part :
- Bien : `publier/page.tsx:181-186` ; « Voir l'annonce » pointe vers `/explorer` générique (`:199`) ; `dashboard/annonces` lit un `MOCK_LISTINGS` codé en dur (`:85-94`) déconnecté.
- Service : `services/proposer/page.tsx:60-62` (message de succès factuellement faux — vérifié : 0 résultat après).
- Formation : `formations/creer/page.tsx:147-150` (jamais ajoutée à `formations`).
- Live : `live/page.tsx:459-468` (toast honnête « (démonstration) » — mais incohérent avec les autres qui ne préviennent pas).
- **Aucune validation** dans le wizard `/publier` : on avance les 7 étapes vides, on publie « Sans titre / Prix à définir / 0 photo » (seule la case CGU bloque, `:664`).

### Thème 3 — LA MESSAGERIE NE RELIE PERSONNE [BLOQUANT]

*Sources : testeurs locataire, vendeur, prestataire, agent.*

- Les formulaires de contact affichent un toast de succès mais **ne créent aucune conversation** : `explorer/[id]/page.tsx:275-278` (`setContactSent(true)` local), devis service (`services/page.tsx:99-109`), « Ouvrir le contact » agence (`vendre/accompagnement/page.tsx:24-28`).
- Les deep-links `/messages?to=<id>` échouent en silence : `messages/page.tsx:320-327` ne gère que u1–u4 codés en dur ; même bug depuis `/reseau` (`reseau/page.tsx:56`) et `/profil/[id]:139`.
- La modale « Nouvelle conversation » ne propose que 3 personnes en dur (`messages/page.tsx:850-859`).
- Plus trompeur qu'une absence : « ça a l'air de marcher » (toast), donc le visiteur croit avoir écrit.

### Thème 4 — L'ARGENT SE CONTREDIT DE NOUVEAU (le facteur-5 est revenu) [BLOQUANT]

*Sources : comptable, apporteur, hôte, vendeur, qualité.*

- **Écran apporteurs, ~facteur ×50 :** `/dashboard/apporteurs` affiche ~187 CHF (dérivé du journal, `dashboard-data.ts:428-433`) et, juste dessous, 9 500 CHF (`leaderboard` en dur, `:418-423`) — même personne, même écran. Une 3e source, `/apporteurs` (`MOCK_APPORTS`, `page.tsx:125-132`), dit 1 034 CHF, et les cartes de liens totalisent 770 CHF (`referral-links.ts:17-48`).
- **Le barème aboli (500/2 500 CHF) est encore VIVANT** via `estimateEarning()` (`pricing/legacy.ts`), appelé par `recommend-button.tsx:41-43`, `attach-cards.tsx:279/342`, `post-viewer.tsx:132`, et resurgit dans le wizard `/publier` (`:523`) — contredisant « 0 CHF à E-Dome » deux étapes plus loin.
- **Réservations, 8 % vs 12 % :** `reservations/page.tsx:96-98` calcule `revenue = total*0.92` alors que `catalog.ts:31` dit `location-ct: 0.12`. L'hôte croit toucher 8,5 % de trop.
- **Trois jeux de réservations incompatibles** pour les mêmes biens (`/dashboard/reservations` dérivé correct vs `/reservations` prix inventés vs `/dashboard/annonces` biens fantômes).
- **`/paiement` est codé en dur** (`paiement/page.tsx:9-18`) et sans `MoneyFlow` : on réserve le chalet à 850 CHF/nuit et on paie « 180 × 5 = 995 CHF » d'un autre bien.
- **Simulateur hypothécaire sans garde-fou :** durée 0 → « Infinity / NaN », apport > prix → montants négatifs (`explorer/[id]:657-682`).
- **Moteur mort à supprimer :** `mock-data.ts:2315-2328` (`monthlyRevenue`, s'arrête mars 2026).

### Thème 5 — LA BOUTIQUE CONTREDIT L'AFFILIATION [BLOQUANT — juridique + éco]

*Sources : juridique, comptable, produit.*

`RATES.boutique = {min:0,max:0}` (affiliation pure, motif art. 20a LTVA, `DECISIONS.md §1.8`). Mais la Boutique déployée est un marketplace eBay :
- Commission « 4-8 % » codée en dur, checkout intégré « Passer commande » → Stripe Connect chez E-Dome, sans redirection vendeur ni « vous quittez E-Dome » (`boutique/[id]/page.tsx:482,633-696`, `boutique/vendre/page.tsx:102,259,275-284`).
- Modération et **garantie acheteur E-Dome**, avis « Achat vérifié » **sans `transactionId`** partagés entre produits.
- `content/explain.ts:100-107` dit « aucune commission, affiliation » — l'inverse du reste du pôle.
- Le journal **crédite Léo** du chiffre plein d'un produit tiers (`ledger.ts:146-152`, `products.ts:517`), pour une commission qui vaut **0** → un apporteur y est promis « une part » de 0.
- Le schéma de conformité `ReviewCompliance` (`model/compliance.ts:122-131`, `transactionId` + `incentivized` obligatoires) existe mais **n'est câblé nulle part**.

### Thème 6 — « VISITER EN TANT QUE » ET LA VISITE GUIDÉE (B.4 / B.5) [IMPORTANT → structurant]

*Sources : visiteur, produit.*

- **B.4 tranché : ce n'est PAS le tutoriel demandé.** `guided-tour.tsx` est une carte fixe en bas qui **navigue elle-même** (`router.push`, `:67`) — aucun halo, aucun assombrissement, aucune action attendue, un seul parcours plat de 6 arrêts, **aucun auto-lancement**, et lanceur **`hidden md:inline-flex`** (invisible sur mobile — le trou le plus grave côté accueil). Le « mode explicatif » que le fondateur rejette (`explainMode`/`POLE_EXPLAIN`) existe encore, confiné à `/demo`.
- **B.5 tranché pour l'option 2 (« être un profil »).** `viewingAs` n'est lu que par sa propre plomberie ; aucune page (nav, dashboard, fil, messagerie) ne réagit au rôle. Pour les rôles que Léo détient déjà, le sélecteur montre déjà ses vraies données ; « Agence » montre une entité **sans visage**. Le code penche déjà à moitié vers l'option 2.

### Thème 7 — CHAQUE PÔLE A DES TROUS [IMPORTANT]

- **Agence :** l'**upgrade d'abonnement est un no-op** (`tarifs:69-75` → `/agence/abonnement` relit `demoAgency.plan` statique) ; la **vitrine publique affiche Nice + Marrakech** (`agence/[slug]/page.tsx:32`, `slice(0,3)` du catalogue global) sous une tagline « arc lémanique » ; **aucun garde-fou de formule** (Équipe/Mandats accessibles en Vitrine 89 CHF) ; « Postuler » ne collecte **aucun** des 4 champs promis (`agence/demandes/page.tsx:22-25`) ; « 23 demandes » annoncées, 4 affichées.
- **Services :** pas de fiche `/services/[id]` (confirmé `recherche/page.tsx:30-31`), aucune commission montrée (asymétrie avec apporteurs), noms non cliquables, devis dans le vide.
- **Formations :** lecteur de leçon `/formations/[id]/lecon/[n]` **lié depuis nulle part** ; `TOTAL_LESSONS=12` et titres **globaux** identiques pour toutes ; **une seule vidéo YouTube** pour toutes les leçons de toutes les formations (`formations/[id]:279`) ; certificat cochable sans rien regarder, « Télécharger PDF » = `window.print()` sans `@media print` ; progression contradictoire (65 % catalogue vs 17 % fiche).
- **Investisseurs :** `/investisseurs` **lié depuis nulle part** (absent de la sidebar et de `roles.ts`) ; CTA Patrimoine (19 CHF) → `/agence/abonnement` (agence) ; KPI codés en dur sans rapport avec Léo ; badge rendement aux couleurs inversées (orange > vert).
- **Location longue durée :** 2 biens seulement, **tous deux à Neuchâtel**, aucun sur l'arc lémanique (que le produit suggère pourtant) ; « Réserver » boucle sur « Sélectionnez vos dates » (pas de calendrier location-lt) ; prix sans « /mois » ; « biens similaires » absurdes (villa 1,45 M à côté d'un loyer).
- **Réservations :** aucun séjour **futur** n'est généré (`ledger.ts:190-232`, jamais au-delà de `DEMO_TODAY`) → 12/12 « Terminée », boutons Confirmer/Refuser **jamais visibles** ; calendrier de dispo `day % 7 === 0` sans lien avec les vraies résas (`explorer/[id]:820`).

### Thème 8 — BOUTONS MORTS, LIENS FICTIFS, COMPTEURS INCOHÉRENTS [IMPORTANT]

*Source : qualité (balayage exhaustif).*

- **8 boutons morts** (sans `onClick`/`submit`) : `admin/page.tsx:423`, `boutique/[id]:428,437`, `dashboard/annonces:278,285`, `explorer/[id]:961` (QR), `feed/page.tsx:847` (J'aime commentaire), `investisseurs:227`.
- **0 lien interne cassé**, mais **5 liens externes fictifs** `cal.com/edome/*` (`components/ui/calendar.tsx`, le « cinq » de `TODO.md`).
- **Notifications à 3 comptes** : badge sidebar « 3 » en dur (`sidebar.tsx:113`), header « Aucune » (`header.tsx:334`), page 10 items / 5 non-lus.
- **`/reseau` « Abonnés » = tout l'annuaire** (`reseau:76-90`) — aucun modèle de follower réel.
- Totaux de vues disjoints (`dashboard/annonces` 13 322 vs dérivé ≈5 060).

### Thème 9 — DESIGN & MOBILE [IMPORTANT]

*Sources : directeur artistique, designer interaction, visiteur.*

- **Boutique : 4 images produit en 404**, et `BlurImage` (`blur-image.tsx:21-38`) n'a **pas de fallback `onError`** → skeleton figé à vie (`products.ts:564,592,675`).
- **Vides de composition** sur les écrans qui vendent le pro : `/agence` (~40 % de blanc), `/tarifs` (carte Patrimoine seule dans une grille 4 colonnes), `/messages` (65 % vide sans CTA).
- **Filigrane « surjo.aep »** (nom de projet After Effects) incrusté dans un reel du fil (`public/videos/feed/`).
- **Le H1 serif éditorial manque exactement sur `/demo`, `/agence`, `/tarifs`** — les 3 écrans commerciaux.
- **`<Link>` imbriqué dans `<Link>`** sur `/formations` (`page.tsx:205+220`) → erreur d'hydratation, HTML invalide.
- **`/feed` : erreur d'hydratation** depuis `Date.now()` en plein rendu (`poll-block.tsx:13,60` ; aussi `demo/posts.ts:122`) — correspond au badge « 1 Issue » de l'overlay Next visible partout.
- **Mobile 360 px :** carte « Objectifs du mois » du dashboard **tronque les chiffres** (« 14'641 / 30'000 C ») ; le 404 de `boutique/[id]` est **recouvert par le bouton flottant Expert IA** (`ai-assistant.tsx:117`).
- **Accessibilité :** `globals.css:359-361` supprime tout focus visible en PWA installée ; anneau de focus par défaut quasi invisible (`--ring:#d4d4d8`) ; deux `placeholder="Rechercher…"` sans `aria-label` distinct dans `/messages`.
- **États « introuvable » : 4-5 implémentations différentes** à factoriser ; `/formations/[id-inexistant]` est un cul-de-sac sans retour.
- Positifs crédités : palette sémantique cohérente, étoiles ambrées (bug « étoiles bleues » corrigé), cartes/boutons unifiés, `dashboard` et `explorer/[id]` les plus aboutis, `MoneyFlow` arithmétiquement exact là où il apparaît. Aucun débordement horizontal sur 18 routes mobiles.

### Thème 10 — SÉCURITÉ & DETTES M1 (B.7) [BLOQUANT pour la sécurité]

*Sources : juridique, produit, hôte, investisseur.*

- **`/admin` publiquement atteignable** en production (`proxy.ts:17-26` laisse tout passer sans Supabase ; `TODO.md:142-152` le dit). Expose emails, signalements nominatifs (dont un de harcèlement), onglet paramètres éditable. **Contredit `DECISIONS.md §4.2`** qui l'affirme « protégée » — à corriger en premier (B.7 dette #1).
- **Panneau de flux d'argent (B.7 dette #2)** absent des écrans prévus : `/paiement` (le plus grave), modale « Faire une offre », et son propre en-tête (`money-flow.tsx:9-14`) survend « chaque écran de transaction ».

---

## Les désaccords (le fondateur voulait les voir)

1. **Relocaliser ou non les profils étrangers (marketing).** Le marketing a déplacé Amina/Yasmin/Omar de Marrakech/Dubaï vers Genève/Sion pour la cohérence « plateforme suisse », au prix du glamour international. **À trancher par le fondateur** : portée mondiale assumée explicitement, ou casting 100 % suisse romand.
2. **B.5 — ne PAS finir de câbler l'option 1 (produit, architecture).** Le code penche déjà vers l'option 2 ; continuer l'option 1 (rôle qui change tout) irait contre l'existant et coûterait plus pour un résultat moins honnête. Aligne la préférence du fondateur.
3. **B.1 n'est pas « corriger des chiffres » (architecture).** Ce sont des identités échangées : il faut la **structure** (référence unique par id), pas une passe de correction de valeurs — sinon ça reviendra.
4. **Refonte incrémentale, pas big-bang (architecture, comptable).** Envelopper `mock-data.ts` derrière un annuaire dérivé (comme `data/properties.ts` l'a fait pour les biens), sans tout réécrire d'un coup.
5. **La Boutique/affiliation est un défaut d'implémentation déjà tranché, pas une question ouverte (juridique).** `JURIDIQUE-A-VALIDER.md` la présente comme « à confirmer » ; en réalité le produit déployé a tranché **dans le mauvais sens** (`DECISIONS.md §1.8`). Prioritaire sur tout ajout de contenu.
6. **`DECISIONS.md §4.2` est factuellement faux (juridique).** Il dit `/admin` protégée ; elle ne l'est pas. À ne pas croire réglé.
7. **Le mécanisme des demandes d'accompagnement est sous-vendu, pas faible (patron d'agence).** L'anonymat + ordre chronologique + sans classement payant est un argument de confiance juridique fort — à mettre en valeur, pas à « réparer ».
8. **`/reservations` : supprimer plutôt que réparer (hôte).** Deux écrans « Réservations » qui se contredisent — en garder un seul, dérivé du journal.
9. **Ventes d'agence : montant affiché ou simple statut ? (comptable) — non tranché**, à décider avant de brancher les millions de GMV (qui ne doivent jamais entrer dans le revenu commissionnable d'E-Dome).
10. **Ordre de migration `Profile.roles` → `PlatformRole` (architecture) — non tranché** : avant ou après avoir peuplé l'annuaire. À décider avant d'écrire le module d'annuaire.

---

## Ce qui va bien (à ne pas casser)

Le journal d'argent + invariants (`demo/`), le point d'entrée unique des biens (`data/properties.ts`), le moteur tarifaire auto-vérifié (`pricing/quote.ts`), le `MoneyFlow` exact, le « mode explicatif » de `/demo` (les 4 champs quoi/qui/revenu/quand), les textes de `roles.ts` et `explain.ts` (le meilleur contenu de la maquette), la palette sémantique, `dashboard` et `explorer/[id]`, le double opt-in apporteur dans `/publier`, `prixM2` exact, les états vides de `/favoris`, `/messages` (recherche vide) et `/notifications`.

---

## Ce que l'audit implique pour la suite

L'ordre est dicté par les dépendances, pas par la gravité seule :

1. **Sécuriser `/admin`** (B.7 #1) — indépendant, une heure, avant tout.
2. **Un annuaire de personnes unique et dérivé** (Thème 1) — le préalable de B.1, dont dépendent les profils, le fil, la messagerie, les avis, l'argent par profil.
3. **Étendre le journal par `ownerId`** (Thème 4) — pour que 15 profils portent des montants cohérents sans recréer le facteur-5, et **retirer le barème aboli** (`legacy.ts`).
4. **Rendre les parcours de création et de contact réels** (Thèmes 2, 3) — persistance en session + messagerie qui relie.
5. **Refonder la Boutique en affiliation** (Thème 5) et la messagerie/réservations/paiement cohérents (Thèmes 3, 4, 7).
6. **Reconstruire la visite guidée en vrai tutoriel + trancher « visiter en tant que » en option 2** (Thème 6).
7. **Reprendre chaque pôle, les boutons morts, le design faible et le mobile** (Thèmes 7, 8, 9).

Le détail chiffré et séquencé ira dans `PLAN-2.md` ; les arbitrages (dont les 10 désaccords) dans `DECISIONS-2.md`.
