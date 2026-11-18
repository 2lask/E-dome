# REBUILD — E-Dome, nouvelle génération

*Document central de la reconception (ouvert le 2026-11-18). Il ne remplace pas
[MODELE.md](MODELE.md), qui reste la loi économique et juridique : il décide
**comment le produit l'incarne**. Chaque décision ci-dessous a sa raison ; une
décision sans raison n'a rien à faire ici.*

---

## 0. Le diagnostic en une phrase

**E-Dome a un modèle clair — l'apport, la transaction directe, puis le
paiement — et un produit qui n'en reflète rien.**

## 1. Ce qu'on a constaté (inspection réelle, pas supposée)

Code (66 pages, ~61 500 lignes), captures écran bureau + mobile, lecture des
dépôts de référence, recherche marché suisse.

| # | Constat | Pourquoi c'est grave |
|---|---------|----------------------|
| 1 | **66 pages** : fil social, reels, lives, boutique, formations, événements, visio, investisseurs, CRM d'agence, apport, transaction. | Un « tout-en-un » ne dit rien. `MODELE.md` place formations/événements/boutique en secondaire ; le produit les met au même rang que le cœur. |
| 2 | **Un visiteur non connecté voit le compte fictif de « Léo »** : « Bonjour Léo », 4 notifications, 4 messages, un groupe. | Le produit ment dès la première seconde. Rédhibitoire pour un pro exigeant. |
| 3 | **Preuve sociale inventée** sur la connexion (« 4.14 · 487 avis ») ; « 23 biens vérifiés » sur l'Explorer. | Contraire à la règle « zéro affirmation de traction ». Risque légal (LCD) et de crédibilité. |
| 4 | **Aucun système pour les demandes.** Un contact, une demande de visite, une mise en relation d'apporteur n'arrivent dans aucun lieu commun ; le vendeur **ne peut pas accepter** une mise en relation. | La boucle d'apport — le cœur du modèle — est **coupée** : la prime ne peut jamais devenir due. |
| 5 | **Photos non persistées** : `/publier` crée des URL `blob:` locales, perdues au rechargement. | Une annonce sans photo ne vend rien. |
| 6 | **Deux systèmes de design** superposés (tokens shadcn + alias « legacy ») ; identité = shadcn par défaut + un serif décoratif aléatoire. | Aucune identité, incohérences partout (le `#b8845a` orphelin, étoiles bleues…). |
| 7 | **Navigation à 15 entrées** dans 4 groupes ; « Fil » social en 2ᵉ position. | Un réseau social immobilier est un piège de démarrage à froid : vide, il tue la perception. |
| 8 | Fiche bien : prix affiché deux fois, « Publier un post » sur une annonce, photo sans rapport avec le titre (donnée fictive). | La page qui convertit est encombrée de fonctions sociales. |
| 9 | Filtres de l'Explorer qui débordent à 1440 px ; accents manquants (« Acces », « gerer »). | Finition non professionnelle. |

Ce qui est **bon et qu'on garde** : la stack (Next 16, React 19, Tailwind 4,
Radix, Supabase, zod) est moderne et juste ; le moteur de prix `quote()` ; le
modèle juridique ; les tables Supabase et la RLS ; le copilote IA ; le pattern
« connecté → base, sinon repli » des chantiers C3–C5.

## 2. Ce que la recherche a appris

### 2.1 Le terrain suisse (le vrai concurrent)
- **SMG possède les portails** (ImmoScout24, Homegate, Flatfox) **et** Casasoft,
  le CRM des petites agences. Affronter SMG comme portail = suicide.
  → E-Dome n'est **pas** un portail. Le bien n'existe chez nous que comme
  support d'une prime ou d'une transaction directe.
- **Les propriétaires sont frustrés** : abonnements premium +15 %,
  intervention du Surveillant des prix, renouvellements automatiques critiqués.
  → « Publier est gratuit » est un levier d'acquisition, pas un cadeau.
- **L'apport existe mais il est morcelé et opaque** : chaque agence a son
  programme (Millenium, Luxity, RE/MAX, Swiss Sun Valais…), contrat séparé,
  % de commission **payé seulement si la vente aboutit**, invérifiable par
  l'apporteur. → **Le trou de marché d'E-Dome** : un réseau ouvert, des primes
  **fixes, visibles d'avance, dues à l'acceptation du contact, traçables**.
- **La barre des outils pro est posée par Nestermind** (CRM « IA d'abord »,
  ~350 pros, seed à sept chiffres) : chaque demande répondue avec le contexte du
  bien, conversations reliées entre annonces, activité journalisée
  automatiquement. → Le centre de gravité d'un outil pro, c'est **la boîte des
  demandes**, pas un tableau de bord de chiffres.

### 2.2 Les dépôts examinés (code lu, jamais exécuté)
| Dépôt | Ce qu'il apprend | Réutilisable ? |
|---|---|---|
| ayyan656/Real-estate-SaaS-CRM | La primitive d'un CRM immo : **le lead** avec statut de pipeline + **journal d'activités**. | Non — **aucune licence** (tous droits réservés). Idée seulement. |
| ahmedsaadawi13/splash-lead-router | Routage par zone/budget/type et surtout **`routing_logs`** : chaque attribution est tracée et explicable. | Non — aucune licence. Idée : **la traçabilité est l'ossature juridique de l'apport** (qui a amené qui, quand, pour quel bien). |
| Cyrus-CS/real-estate (Laravel, MIT) | La **demande** (message + date) comme objet lié au bien ; favoris persistés par utilisateur. | MIT, mais PHP : on garde l'idée. |
| Shreyas-29/propease | Une landing + un tableau de bord vide. | Aucune licence ; peu de valeur. |
| java110/MicroCommunity (Apache 2.0) | Gestion d'immeuble (charges, réparations, propriétaires). | Verticale **régie/PPE** : piste V4+, hors périmètre. |
| twenty, plane, frappe/crm, nocodb | Objets + vues (table/kanban), fiche = champs + **timeline**, commande ⌘K. | **AGPL / mixtes** : incompatible avec un SaaS propriétaire. Idées seulement. |
| nextcrm-app, next-shadcn-dashboard-starter, next-saas-stripe-starter (MIT) | Patterns Next + shadcn. | Oui, mais notre stack les couvre déjà : rien à importer. |

### 2.3 Les idées transposées d'autres secteurs
| Référence | Ce qu'elle fait de mieux | Ce qu'E-Dome en tire |
|---|---|---|
| **Linear** (Inbox, ⌘K) | L'accueil = ce qui exige ton action ; tout est à une commande. | Accueil « À faire » + menu de commande global. |
| **Attio / Twenty** | Peu d'objets, bien définis ; chaque fiche a sa timeline. | 3 objets cœur : **Bien**, **Demande**, **Prime**. Chaque demande a son historique. |
| **Front / Intercom / Follow Up Boss** | Une boîte unique, des statuts, la vitesse de réponse. | **Demandes** : directes + apportées, un pipeline, une décision. |
| **Airbnb** (inbox liée à l'annonce, qualité d'annonce) | La conversation vit *dans* le contexte du bien ; on guide l'hôte vers une meilleure annonce. | Messages fusionnés dans les Demandes ; score de complétude d'annonce. |
| **Stripe / Shopify / Vercel** (onboarding) | Une checklist d'activation, mesurable. | Checklist « Démarrer » sur l'accueil d'un compte neuf. |
| **Whop / Gumroad affiliates** | L'affilié voit son gain *avant* de partager, un lien en un clic. | Module « Recommander ce bien · prime X CHF » sur chaque fiche. |
| **Zillow / Idealista** | La fiche bien est une page de conversion : prix une fois, faits clés, un appel à l'action. | Fiche bien recentrée : Contacter / Visiter / Recommander. |
| **Malt / Upwork** | La confiance se gagne par la transaction réelle. | Avis liés à une transaction (déjà la règle), identité vérifiée (V2). |

## 3. La reconception produit

### 3.1 Trois objets, une boucle
```
          publie                     recommande (lien traçable)
Vendeur ────────► BIEN ◄──────────────────────────── Apporteur
   ▲              │  pose une PRIME (CHF fixe)            │
   │              ▼                                       │ propose un contact
   │          DEMANDE ◄───────────────────────────────────┘
   │   (directe ou apportée — un pipeline, un historique)
   └── accepte → prime due (apportée)   ·   avance → visite → offre → conclu
```
Tout le reste est une **vue** sur ces trois objets, ou n'existe pas en V1.

### 3.2 La navigation (de 15 entrées à 5)
| Entrée | Rôle | Remplace |
|---|---|---|
| **Accueil** | Ce qui exige ton action + checklist de démarrage | Accueil marketing, tableau de bord de chiffres |
| **Explorer** | Les biens réels, filtrables | Explorer (sans services/formations) |
| **Demandes** | Boîte unique : contacts, visites, mises en relation ; décision du vendeur | Messages, notifications, « mises en relation » éparses |
| **Mes biens** | Mes annonces, leur qualité, leurs primes | Mes annonces, vitrine |
| **Gagner** | Recommander des biens à prime ; mes gains | Espace apporteur (x2) |

Le compte (profil, réglages, déconnexion) vit dans le **menu du compte**. Le
**menu de commande ⌘K** donne accès à tout, au clavier. Mobile : barre de 5
onglets, « Publier » au centre.

**Parqués hors navigation (code conservé, aucun point d'entrée)** : fil
social, reels, lives, boutique, événements, formations, visio, investisseurs,
services, espace agence. Raison : aucun n'alimente la boucle Bien–Demande–Prime ;
chacun est vide au lancement (démarrage à froid) et dilue la promesse. Ils
reviendront s'ils servent la boucle (ex. services = partenaires de la
transaction, V3).

### 3.3 Visiteur ≠ membre (fin du compte fictif)
- **Visiteur** : en-tête public (Explorer, Gagner, Se connecter, Publier un
  bien). Il voit les biens, une fiche, peut faire une demande, comprend comment
  gagner. **Jamais** de compte « Léo ».
- **Membre** : son compte réel, ses données. Rien d'inventé : un compte neuf est
  vide, et l'accueil le guide (checklist).
- **Données fictives retirées** des surfaces publiques. Un Explorer vide est
  honnête ; on soigne l'état vide plutôt que de le remplir de faux.

### 3.4 Les systèmes manquants à construire
1. **Demandes** — table `inquiries` (contact, visite, avec message, statut,
   historique) ; les `introductions` y apparaissent comme demandes
   « apportées ». Le vendeur **accepte** (prime due) ou **refuse** (rien dû).
   Chaque changement de statut est journalisé (traçabilité = preuve).
2. **Photos réelles** — Supabase Storage (bucket `property-images`), plus de
   `blob:`.
3. **Liens de recommandation traçables** — `referral_links` + redirection
   publique qui compte les clics et attribue la demande à l'apporteur.

## 4. L'identité visuelle

**Principe : la précision suisse, chaude.** Un outil sérieux, calme, lisible,
où l'argent qu'on gagne a sa couleur.

- **Trois couleurs, trois rôles — jamais mélangés** :
  - **Encre** `#15130F` : texte, boutons principaux. La force.
  - **Léman** `#0B5D57` : sélection, liens, focus, navigation active. La
    confiance (le lac, la pierre mouillée).
  - **Laiton** `#9A6B12` sur `#F7EDD6` : **réservé à l'argent à gagner** —
    primes, gains d'apporteur. Où que tu le voies, il y a quelque chose à
    gagner. C'est la signature d'E-Dome.
- **Papier chaud** : fond `#FAF9F6`, surfaces blanches, bordures `#E8E3DA`.
  Moins clinique que le zinc de shadcn, plus « pierre et bois ».
- **Typographie** : **Geist** (interface) + **Geist Mono** (montants,
  références). Une seule famille ; l'identité vient de la discipline (graisses,
  approche serrée sur les titres, chiffres tabulaires), pas d'un serif
  décoratif. Chargée par `next/font` (auto-hébergée, plus de requête Google
  Fonts bloquante).
- **Forme** : rayon 10 px (cartes 14 px), bordure 1 px, ombres quasi nulles ;
  la hiérarchie se fait par l'espace et la typographie.
- **Mouvement** : 150–200 ms, sortie douce, `prefers-reduced-motion` respecté.
- **Sombre** : même rôles, valeurs recalculées pour le contraste AA.

## 5. Décisions techniques
| Décision | Raison |
|---|---|
| **Garder** Next 16 / React 19 / Tailwind 4 / Radix / Supabase / zod. | Modernes, adaptés, déjà en place. Réécrire = risque sans gain. |
| **Une seule couche de tokens** ; les alias « legacy » pointent vers elle. | Les 61 500 lignes adoptent la nouvelle identité d'un coup ; migration progressive ensuite, sans casse. |
| `next/font` pour Geist. | Auto-hébergement, pas de FOIT, pas de dépendance réseau tierce. |
| Nouvelles tables via **migrations SQL versionnées** (`supabase/migrations/`). | Reproductible, relisible, appliqué en une étape par le fondateur. |
| Écritures par **actions serveur** + RLS, comme C3–C5. | Pattern éprouvé ici ; la RLS reste la vraie barrière. |
| Pas de nouvelle dépendance sauf nécessité prouvée. | Chaque dépendance est une dette. |

## 6. Plan d'exécution (un commit par étape, portes vertes, poussé)
1. **Fondation** — tokens, polices, primitives (bouton, carte, champ, badge,
   puce « prime »). *L'app entière change d'identité.*
2. **Coquille** — navigation à 5 entrées, menu du compte, ⌘K, en-tête
   visiteur ; fin du compte fictif pour les visiteurs.
3. **Demandes** — migration `inquiries` + boîte unique + décision du vendeur
   sur les mises en relation + demande depuis la fiche bien.
4. **Accueil** — « À faire » + checklist pour le membre ; accueil public pour le
   visiteur.
5. **Explorer & fiche bien** — biens réels, fiche de conversion, module
   « Recommander · prime ».
6. **Publier & Mes biens** — photos réelles (Storage), parcours raccourci,
   qualité d'annonce, primes.
7. **Gagner** — liens traçables, partage, gains.
8. **Inspection finale** — captures 390 px → 1440 px, a11y, contrastes,
   textes, cohérence ; corrections.

## 7. Journal de la reconstruction
*(mis à jour à chaque étape — 2026-11-18)*

| Étape | Commit | Ce qui a changé |
|---|---|---|
| 0 · Vision | `af5c4f6` | Ce document. |
| 1 · Fondation | `f3f7f72` | Une couche de tokens (Encre/Léman/Laiton, papier chaud, sombre AA), Geist via `next/font`, primitives, code mort CSS retiré. |
| 2 · Coquille | `1b6ff75` | Une seule coquille, 5 entrées, visiteur ≠ membre, ⌘K, menu du compte, marque, pôles parqués (307), routes de membre fermées. |
| 3 · Demandes | `946a9eb` | **Faille RLS corrigée** (un apporteur pouvait s'auto-accepter), mise en relation anonyme → acceptation → coordonnées, boîte unique + pipeline + historique. *Migration 002 à appliquer.* |
| 4 · Accueil | `9be3297` | Accueil visiteur (promesse, vrais biens) / membre (« À faire », checklist) ; auth honnête (fausse note retirée, e-mail de confirmation géré). |
| 5 · Explorer & fiche | `1d74b4f` | Biens réels uniquement, filtre « Avec prime », fiche de conversion + module prime ; montants déterministes ; `maplibre-gl` retiré. |
| 6 · Publier & Mes biens | `554cdf1` | **Vraies photos** (stockage, URL signées), formulaire en une page avec aperçu et qualité, modification, retrait (photos effacées, verrou si prime acceptée). |
| 7 · Gagner | `c3b4889` | Page publique honnête (fin des gains fictifs), partage, espace apporteur aligné. |
| 8 · Inspection | `3401cd2` | Aide et À propos réécrits (affirmations non vérifiées retirées), agences fictives parquées, nouvelle suite e2e. |

**Vérifié** : typecheck, lint (0 erreur ; avertissements 156 → 114), 106 tests de données,
build à froid, 32 tests e2e (routes, honnêteté, ⌘K), parcours réel de publication
(compte → 3 photos → prime → modification → retrait → stockage nettoyé, 0 erreur JS),
captures 390 px et 1440 px de chaque écran reconstruit, en visiteur et en membre.
**Non vérifié visuellement** : le thème sombre (tokens définis, rendu non inspecté).

### Ce qui reste — par ordre d'impact
1. **Appliquer `supabase/migrations/002_demandes.sql`** (fondateur, 1 minute) : sans elle,
   la boîte Demandes affiche « base à mettre à jour » et la faille RLS reste ouverte.
2. **E-mails de notification** : un vendeur ne sait pas qu'une demande est arrivée tant
   qu'il n'ouvre pas l'app. Prochain chantier (SMTP Supabase ou Resend).
3. **Versement des primes** par un PSP agréé (Stripe Connect / Payrexx) — aujourd'hui la
   prime acceptée est enregistrée et horodatée, réglée hors plateforme (dit dans l'aide).
4. **Liens de recommandation traçables** (`referral_links` + redirection + attribution).
5. **Tarifs pro** : `/tarifs` montre encore la grille de l'ancienne stratégie « Pro »
   (Vitrine 89, Mandats 290…). Fixer ou retirer ces prix est une **décision du fondateur**.
6. Profil public réel (`/profil/[id]` pour un vrai compte), favoris en base, profils vérifiés.
7. Code des pôles parqués (fil, formations, boutique, lives, agence…) : conservé ; à
   supprimer définitivement une fois la direction confirmée dans la durée.

---

### Sources (recherche du 2026-11-18)
- SMG / Casasoft–IAZI : https://swissmarketplace.group/media-release/2024-07-casasoft-iazi-en/
- Analyse SMG (trois monopoles) : https://moatsandmultiples.substack.com/p/swiss-marketplace-group-three-monopolies
- Hausse des abonnements SMG (Comparis) : https://www.comparis.ch/publikationen/mitteilungen/2026/10/bei-comparis-gibt-es-die-wohnungsinserate-fuer-die-user-weiterhin-gratis-und-sofort
- Surveillant des prix — SMG : https://www.preisueberwacher.admin.ch/dam/pue/fr/dokumente/presse/Final_MM_SMG_F.pdf.download.pdf/Final_MM_SMG_F.pdf
- Abonnements critiqués : https://www.onlinemarketplaces.com/articles/nasty-rip-off-subscriptions-bring-homegate-and-immoscout24-into-disrepute/
- Flatfox (à propos) : https://flatfox.ch/en/about
- Nestermind (seed, fonctions) : https://www.moneycab.com/finanz/nestermind-schliesst-siebenstellige-seed-finanzierungsrunde-ab/amp/ · https://www.maison.work/en/blog/ki-in-der-immobiliensuche-wo-die-schweizer-landschaft-heute-steht
- Programmes d'apport en Suisse romande : https://leedy.ch/apporteur-affaires/ · https://www.milleniumproperties.ch/apporteur-affaires-immobilier/ · https://www.luxity.ch/apporteur-daffaires/ · https://www.swisssunvalais.ch/ssv/apporteur-d-affaires-bien-immobilier-agence-immobiliere-sion-sierre-martigny-monthey-valais-suisse-swiss-sun-valais-%C2%AE-1er-reseau-immobilier-valais-%C2%AE-meilleur
- Dépôts : github.com/Shreyas-29/propease · Cyrus-CS/real-estate · ayyan656/Real-estate-SaaS-CRM · ahmedsaadawi13/splash-lead-router · java110/MicroCommunity · twentyhq/twenty · makeplane/plane · frappe/crm · pdovhomilja/nextcrm-app
