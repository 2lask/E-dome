# Audit — profil Prestataire (photographe / home staging / diagnostic)

Périmètre testé : `/services`, `/services/proposer`, fiche prestataire publique, `/dashboard` (et
sous-pages), `/messages`, `/dashboard/apporteurs`, `src/lib/pricing/catalog.ts` (commission service).
Méthode : lecture de code + sessions Playwright réelles sur `http://localhost:3002` (remplissage du
formulaire « Proposer un service », navigation `/services` → `/profil/user-005`, `/profil/user-016`,
`/messages`). Captures dans `SCRATCH/presta-*.png`.

---

## 1. Impossible d'« être » un prestataire dans la démo — CRITIQUE

Le seul compte jouable de la maquette (`CURRENT_USER`, Léo Martin) a pour rôles
`["proprietaire", "hote", "apporteur", "formateur"]` (`src/lib/demo/identity.ts:95`). Aucun
`photographe`/`prestataire` nulle part. L'onboarding propose bien de cocher « Photographe »
(`src/app/(app)/onboarding/page.tsx:34`, ça écrit dans `profile.roles` via `updateProfile`), mais
`/dashboard` (`src/app/(app)/dashboard/page.tsx:26-35`) importe ses données **statiquement** depuis
`src/lib/dashboard-data.ts`, indexées sur `CURRENT_USER` — jamais sur `profile.roles` du contexte.
Cocher « Photographe » à l'onboarding ne change donc strictement rien à l'écran qui suit : le dashboard
reste un cockpit propriétaire/hôte (revenus locatifs, occupation, biens, réservations de logement). En
tant que photographe qui veut « essayer » E-Dome, je n'ai littéralement aucun écran qui me ressemble.

**Gravité : critique** — contredit le cœur de la mission (« chaque profil existe »).

## 2. Le pipeline de devis existe dans les données... et n'est affiché nulle part — CRITIQUE

`src/lib/dashboard-data.ts:136-145` définit un type `ServiceLead` (devis/planifié/terminé) et
`serviceLeads` (lignes 252-255) contient des leads *spécifiquement calibrés sur mon métier* :
`{ id: "sl-1", service: "Photographe immobilier", client: "Marc Dupont", amount: 480, status: "devis" }`.
`grep -rn "serviceLeads" src` ne retourne que des usages internes au même fichier : agrégation dans
`activeListingsCount.services` (ligne 457) et dans `forecastServices` (ligne 467). **Aucune page** ne
boucle sur `serviceLeads` pour afficher une liste « Mes demandes de devis ». Le chiffre existe dans un
total agrégé quelque part sur `/dashboard`, mais je ne peux jamais voir *qui* m'a demandé un devis, pour
*quoi*, ni répondre. C'est l'écran le plus attendu pour ce persona, et il n'existe pas alors que les
données sont prêtes pour lui.

**Gravité : critique.**

## 3. « Publier un service » ne publie rien — CRITIQUE, vérifié en direct

`src/app/(app)/services/proposer/page.tsx:60-62` : `handlePublish` fait uniquement `setPublished(true)`.
Aucune écriture dans `SERVICES` (`src/app/(app)/services/page.tsx:39-53`, `const` en dur), aucun contexte
partagé, aucun `localStorage`. Test Playwright réel : formulaire rempli avec « Shooting photo pro + drone
», catégorie Photographie, 350 CHF/séance → écran de succès **« Votre service "Shooting photo pro +
drone" est maintenant disponible sur la plateforme »** (ligne 71-72) → retour sur `/services` →
`NEW_SERVICE_IN_CATALOG_COUNT: 0`. Le message de confirmation est factuellement faux : mon service n'est
disponible nulle part. Comparable au même défaut déjà relevé côté formateur (`analyse2/testeur-formateur.md`
point 6) — mais ici sans même le tempérament « (démonstration) » que `/live` affiche honnêtement.

**Gravité : critique** (faux/vide) — c'est la tâche centrale du rôle testé.

## 4. Aucune trace de la commission service nulle part dans l'UI — MAJEUR

`src/lib/pricing/catalog.ts:30-52` modélise soigneusement la commission service : 5 à 10 % selon que je
ramène mon propre client (`SELLER_SOURCED_RATE.service = 0.05`) ou que c'est E-Dome qui me l'apporte
(`PLATFORM_SOURCED_RATE.service = 0.10`), plus les frais du prestataire de paiement (`PSP`, ligne 285-290 :
3.15 % + 0.30 CHF, à ma charge) et un plancher `MIN_COMMISSION` de 3 CHF. Test Playwright :
`MENTIONS_COMMISSION: false` sur `/services/proposer` — recherche confirmée sur tout `src/app/(app)/services`
(`grep -rn "commission" ...` → 0 résultat). Avant de publier une prestation à 350 CHF, je n'ai *aucun*
moyen de savoir combien E-Dome va prélever. Comparer avec `/dashboard/apporteurs`, où les parts
apporteur sont, elles, explicitement chiffrées à l'écran — l'asymétrie de transparence entre les deux
pôles saute aux yeux dès qu'on regarde les deux dashboards côte à côte.

**Gravité : majeure.**

## 5. « Prestataires vérifiés » est une promesse sans vérification — MAJEUR

`src/app/(app)/services/page.tsx:56` promet : « Parcourez notre catalogue de **prestataires vérifiés** ».
Aucune carte de service n'affiche de badge vérifié/checkmark (relu tout le JSX de la carte,
lignes 159-239), et le formulaire `/services/proposer` ne demande ni pièce d'identité, ni numéro
IDE/SIRET, ni assurance RC pro, ni aucune étape de contrôle avant de pouvoir publier — n'importe quel
visiteur en rôle « Particulier » (mon état pendant tout le test) peut se déclarer prestataire et publier
en trois champs. Le mot « vérifiés » n'est donc adossé à rien de vérifiable dans le produit.

**Gravité : majeure** — désaccord entre la promesse affichée au client et ce que le parcours prestataire
exige réellement.

## 6. Les deux seuls profils « photographe » de toute la plateforme sont soit contradictoires, soit cassés — CRITIQUE

- **user-005, Lucas Renaud** : `src/lib/mock-data.ts:111-126` le décrit comme « Photographe immobilier et
  hôte sur la Côte d'Azur... Drone & Matterport », certification « Pilote Drone (DGAC 2023) ». Mais sa
  fiche publique réelle (`/profil/user-005`, vérifié en direct par Playwright) est construite depuis une
  **source totalement différente et non synchronisée**, `src/lib/profile-data.ts:191-203`, qui le décrit
  comme « **Promoteur immobilier** · Villas de prestige Côte d'Azur... Développement foncier, Immobilier
  de luxe » — aucune mention de photo, drone ou home staging. Deux identités contradictoires pour le même
  `user-005`.
- **user-016, Carlos Rivera** : `src/lib/mock-data.ts:287-302` « Hôte et photographe immobilier à
  Barcelone. Spécialiste home staging et vidéo cinématique », et il apparaît dans les suggestions de
  connexion (`src/lib/mock-data.ts:2600`, libellé « Hôte & Photographe »). Mais `profile-data.ts` n'a
  **aucune entrée** pour lui : `/profil/user-016` retourne « Profil introuvable — Cet utilisateur n'existe
  pas dans la maquette » (vérifié en direct).

En tant que photographe qui cherche « à quoi ressemble un confrère bien référencé sur E-Dome », les deux
seuls exemples possibles sont soit un menteur (se présente comme promoteur), soit un lien mort.

**Gravité : critique** (faux/artificiel, incohérence de données entre deux fichiers sources).

## 7. Le nom/avatar du prestataire dans `/services` n'est jamais cliquable — MAJEUR

`src/app/(app)/services/page.tsx:170-173` : le bloc `<img>` + `<span>{service.provider}</span>` n'est
entouré d'aucun `<a>`/`<Link>`. Vérifié en direct (`PROVIDER_NAME_CLICKABLE: NO_LINK`). Un client qui
veut « voir qui est PixelHome » avant de demander un devis ne peut pas — et symétriquement, en tant que
prestataire je n'ai aucune idée de ce que verrait un client qui voudrait cliquer sur ma carte, puisque
personne ne peut jamais essayer.

**Gravité : majeure.**

## 8. La demande de devis d'un client disparaît dans le vide côté prestataire — MAJEUR

`handleSendDevis` (`src/app/(app)/services/page.tsx:99-109`) ne fait qu'ajouter l'id à un `Set` en state
local et afficher un toast 3 secondes. Rien n'est écrit dans `/messages` ni dans `serviceLeads`. Vérifié :
la boîte de réception `/messages` (capture `SCRATCH/presta-messages.png`) ne contient que des fils sans
rapport (réservation logement, apporteur qui « active son lien ») — aucun thread de type « devis
service ». Combiné au point 2, cela signifie qu'un devis envoyé par un client n'a **aucune destination
observable** dans toute l'application : ni notification, ni message, ni ligne dans un tableau de bord.

**Gravité : majeure** — cohérent avec le point 2, même symptôme vu du côté client cette fois.

## 9. Catégories et unités du formulaire de création ne couvrent pas le catalogue réel — MOYEN

- Catégories : `/services` en propose 10 (`src/app/(app)/services/page.tsx:13-25`), dont « Architecture &
  Design » et « Construction & Gros œuvre » (catégories réellement peuplées : services s10, s12, s13).
  `/services/proposer` n'en propose que 8 (`src/app/(app)/services/proposer/page.tsx:19`) — ces deux-là
  manquent. Un architecte ou une entreprise de gros œuvre ne peut pas se catégoriser correctement.
- Unités : le `<select>` d'unité (`proposer/page.tsx:122-129`) n'offre que /h, /séance, /jour, /projet,
  /mois. Le catalogue réel utilise aussi /trajet, /pièce, /m², /déménagement, /accueil
  (`services/page.tsx:41-52`) — un déménageur ou un décorateur « à la pièce » ne peut pas exprimer son
  vrai tarif.

**Gravité : moyenne** — révèle, comme chez le formateur, que le formulaire de création n'a pas été écrit
à partir de la même source de vérité que le catalogue affiché.

## 10. Le bounty « apporteur qui m'amène » ne correspond à aucune ligne du modèle de commission — MOYEN, désaccord

`src/app/(app)/apporteurs/page.tsx:113` promet, pour « Amener un prestataire » (photographe, architecte,
notaire) : « Bounty fixe 100–500 CHF ». Mais `src/lib/pricing/catalog.ts:137-140` (`BOUNTIES`, présenté
dans le code comme la source de vérité, avec sa justification anti-fraude) ne définit que
`host-activated` (60 CHF) et `user-activated` (15 CHF) — **aucune** entrée pour un prestataire qualifié.
Même la ligne « Amener un hôte » (ligne 110 de la page apporteurs, 100 CHF) ne colle pas au chiffre
canonique (60 CHF). Si un apporteur me recrute comme photographe sur la promesse affichée à l'écran, le
moteur de commission qui devrait le payer n'a pas cette case.

**Gravité : moyenne** — désaccord entre le contenu marketing de `/dashboard/apporteurs` et le modèle
économique documenté dans `catalog.ts`.

---

## Réponses aux 4 questions

1. **Cherché / trouvé ?** Le catalogue `/services` se trouve et se filtre bien (recherche + 10
   catégories). Mais dès qu'on cherche *au-delà* du catalogue — qui est ce prestataire, quel est mon
   pipeline de devis, combien je vais toucher net — rien n'est trouvable : ces écrans n'existent pas ou
   ne sont jamais reliés (points 2, 4, 7).
2. **Perdu / bloqué ?** Le parcours "Proposer un service" ne bloque jamais visuellement (4 champs, un
   bouton, un écran de succès) — mais c'est une impasse silencieuse : rien de ce que je publie ne
   réapparaît nulle part, sans le moindre message d'erreur (point 3). Idem pour un devis reçu : la
   demande part, et je n'ai aucun endroit où la retrouver (points 2 et 8).
3. **Faux / vide / artificiel ?** Oui, et c'est le problème central de ce persona : « prestataires
   vérifiés » sans vérification (point 5), un service publié qui ment sur sa propre disponibilité
   (point 3), et surtout les deux seuls confrères photographes de toute la base — l'un devient promoteur
   immobilier sur sa propre fiche publique, l'autre n'a pas de fiche du tout (point 6).
4. **Manque ?** Un rôle prestataire réellement jouable (dashboard, pas juste un badge de profil) ; une
   page « Mes devis reçus » qui boucle sur `serviceLeads` (la donnée existe déjà) ; l'affichage de la
   commission service avant publication ; un lien cliquable vers la fiche du prestataire depuis chaque
   carte `/services` ; une synchronisation entre `mock-data.ts` et `profile-data.ts` pour au moins les
   deux profils tagués photographe ; l'alignement des catégories/unités entre catalogue et formulaire de
   création.
