# E-Dome — architecture (doc vivante)

Plateforme immobilière/sociale (feed, explorer, formations, événements,
boutique, apporteurs, dashboard) avec une **IA immobilière** comme cœur
différenciant (voir `docs/AI.md`).

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4** · **zod**.
- **Supabase** (auth + Postgres + Storage) **optionnel** : gaté par
  `isSupabaseConfigured()` (`src/lib/supabase/`). Sans env, l'app tourne en
  **mode démo** sur données mock. Middleware (`src/middleware.ts`) rafraîchit la
  session et protège les routes quand Supabase est configuré.
- **IA** : `@anthropic-ai/sdk` (Claude), server-only.
- Cartes : `maplibre-gl`. 3D/anim : three, gsap, framer-motion, remotion.

## Structure

```
src/
  app/(app)/            Routes applicatives (feed, explorer, formations, evenements,
                        boutique, apporteurs, dashboard, profil, messages, …)
  app/api/ai/chat/      Endpoint IA (server)
  components/           UI (layout, ui, dashboard, affiliate, ai, …)
  lib/
    mock-data.ts        Données de démo (Property, Formation, Event, User, …)
    types.ts            Modèle de domaine (Property, PropertyAnalytics, …)
    context.tsx         État client global (favoris, suivis, panier, liens d'apporteur)
    referral-links.ts   Système d'apporteurs / liens d'affiliation
    rewards.ts          Estimation de commission (affiliation)
    ai/                 Couche IA (voir docs/AI.md)
    supabase/           Clients Supabase (optionnels)
```

## Données

Aujourd'hui : `src/lib/mock-data.ts` (biens riches avec analytics : rendement
brut/net, prix/m², DPE, ROI, occupation). Les fonctions de calcul financier ne
vivaient nulle part — elles sont désormais dans **`src/lib/ai/calc.ts`** (moteur
pur, réutilisable par l'UI *et* l'IA). Cible : Supabase (Phase 3).

## Domaines fonctionnels

- **Feed** : réseau social + composer + espace apporteur (recommandations).
- **Explorer** : recherche de biens (filtres en pills, carte+liste, recos perso).
- **Apporteurs** : liens d'affiliation rattachés aux annonces + redirection + suivi.
- **Formations / Événements / Boutique** : marketplace + billetterie + e-commerce.
- **Dashboard** : analytics (revenus, audience, apporteurs, réservations).
- **IA** : assistant expert immobilier (estimation, rentabilité, analyse).

## Conventions

- Ne pas casser l'existant ; réutiliser composants et services.
- Calcul financier → `src/lib/ai/calc.ts` (source unique).
- Secrets (clés API) : server-only, jamais exposés au client.
- Limitations/quotas : appliqués côté serveur.

Détails IA : `docs/AI.md`.
