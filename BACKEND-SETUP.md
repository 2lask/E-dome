# Backend réel — mise en place et plan

*Objectif : passer de la maquette (données fictives, mémoire de session) à une
vraie plateforme (comptes, base de données, persistance). Décidé ensemble :
**Supabase** (Postgres + Auth + Stockage), connexion **e-mail/mot de passe +
Google**, **paiements simulés** tant que le modèle d'affiliation n'est pas
validé juridiquement.*

> **Principe directeur : aucune régression.** L'application continue de
> fonctionner **sans** backend (mode démonstration). Dès que Supabase est
> configuré, les écrans basculent sur les vraies données, un par un. À aucun
> moment la plateforme n'est cassée.

---

## Où on en est

**Déjà en place (fait) :**
- Toute la plomberie Supabase (clients navigateur/serveur/admin, rafraîchissement
  de session, callback OAuth) — elle existait déjà pour le formulaire de la
  landing, on la réutilise.
- **L'authentification complète** : pages `/auth/connexion` et
  `/auth/inscription`, connexion e-mail/mot de passe **et** Google, déconnexion,
  protection de `/admin` et `/dashboard`. Fonctionnel dès que les clés sont
  renseignées.
- **Le schéma de la base** : `supabase/schema.sql` — le modèle complet de la
  plateforme (profils, biens, formations, services, événements, messagerie,
  notifications, réseau, avis, apporteurs/primes, journal des flux), avec la
  sécurité au niveau des lignes (RLS) activée partout et le profil créé
  automatiquement à l'inscription.
- Le pont code ↔ auth : `getCurrentUser()` renvoie le profil de la personne
  connectée (ou `null` en mode démo).

**Ce qui reste (phases suivantes, côté développement) :** voir le plan plus bas.

---

## Ce que tu dois faire une seule fois (≈ 20 minutes)

Je ne peux pas créer le projet Supabase à ta place : il tient à ton compte.

1. **Crée un projet** sur https://supabase.com (formule gratuite). Note le mot
   de passe de la base.
2. **Récupère les clés** : Project Settings → API → copie *Project URL*, *anon
   public* et *service_role*.
3. **Renseigne `.env.local`** (copie `.env.local.example`) :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   Et sur **Vercel** : les mêmes variables dans Project Settings → Environment
   Variables (pense aussi à `ADMIN_PASSWORD`, encore à vérifier).
4. **Exécute le schéma** : Supabase → SQL Editor → New query → colle le contenu
   de `supabase/leads.sql`, Run ; puis idem avec `supabase/schema.sql`.
5. **Active Google** (optionnel mais recommandé) : Authentication → Providers →
   Google. Crée un identifiant OAuth sur Google Cloud Console et ajoute l'URI de
   redirection `https://<ton-projet>.supabase.co/auth/v1/callback`.

Dès l'étape 4 faite et les clés en place, **l'inscription et la connexion
marchent** : un compte créé apparaît dans Supabase → Authentication → Users, et
un profil est créé automatiquement dans la table `profiles`.

---

## Le plan, par phases

- **Phase 1 — Fondation ✅ (faite).** Auth réelle + schéma de la base + RLS +
  création du profil à l'inscription + pont `getCurrentUser()`.
- **Phase 2 — Amorce et profils.** Un script qui charge les seize personnes et
  leur contenu dans la base (`seed.sql`), pour ne pas démarrer sur une base
  vide ; l'écran `/profil` et l'annuaire lisent les vrais profils ; l'en-tête
  montre la personne connectée.
- **Phase 3 — Contenu et publication.** Biens, formations, services, événements :
  lecture depuis la base, et la publication (`/publier`, créations) écrit en base
  au lieu de la seule mémoire de session.
- **Phase 4 — Interactions.** Messagerie, notifications, favoris, abonnements,
  avis, candidatures : persistés en base, partagés entre comptes et appareils
  (plus seulement le temps d'une session).
- **Phase 5 — Apporteurs et flux.** Liens de parrainage, primes, mises en
  relation, journal des flux — en base, paiements toujours **simulés**.
- **Phase 6 — Paiements réels.** Stripe, **après** la validation juridique du
  modèle d'affiliation. Bloqué tant que le juridique n'est pas tranché.

Le sélecteur « être un profil » de la démonstration reste tant que la base n'est
pas peuplée ; il s'efface naturellement une fois qu'on se connecte comme
soi-même avec de vraies données.

---

## Le point qui conditionne tout

Les **paiements réels** (phase 6) attendent la **validation juridique** du
modèle (`JURIDIQUE-A-VALIDER.md`). Encaisser de l'argent sur une mise en
relation est exactement l'activité dont la légalité n'est pas confirmée. On
construit tout le reste en vrai d'ici là ; on ne branche pas Stripe avant.
