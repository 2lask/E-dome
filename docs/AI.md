# IA immobilière E-Dome — architecture

> Doc vivante. Mise à jour à chaque évolution de la couche IA.

L'IA « Expert E-Dome » est un assistant immobilier ancré dans les données et les
fonctionnalités du SaaS. Principe directeur : **le LLM n'est jamais la source des
données** — il orchestre des outils qui lisent les données réelles, et une base
documentaire (RAG, à venir). Toutes les limitations (quotas, formules) sont
appliquées **côté serveur**.

## Les 4 couches

1. **LLM (provider)** — `src/lib/ai/provider.ts`. Client Claude *server-only*
   (`@anthropic-ai/sdk`), boucle d'appel d'outils (tool use), gestion `refusal`.
   Modèle par défaut `claude-opus-5`, surchargé par `AI_MODEL`.
2. **RAG (retrieval)** — *à venir (Phase 2)*. Base doc (SaaS, fiscalité, guides)
   → recherche in-repo, puis pgvector Supabase (Phase 3).
3. **Outils (tools)** — `src/lib/ai/tools.ts`. Chaque capacité métier = un outil
   typé (JSON Schema) sur données réelles + moteur de calcul. Ajouter une
   capacité = ajouter un outil ici, jamais de logique dans le prompt.
4. **Mémoire** — préférences / conversations. Démo : état client + localStorage.
   Phase 3 : tables Supabase.

## Fichiers

| Fichier | Rôle |
|---|---|
| `src/lib/ai/calc.ts` | Moteur de calcul immobilier pur (rendement, cash-flow, mensualité, ROI, prix/m², estimation par comparables). Réutilisable par l'UI. |
| `src/lib/ai/tools.ts` | Outils : `search_properties`, `get_property`, `search_comparable_sales`, `estimate_property`, `calculate_yield`, `calculate_cashflow`, `analyse_investment`. |
| `src/lib/ai/prompt.ts` | System prompt « Expert E-Dome » + injection de contexte de session. |
| `src/lib/ai/entitlements.ts` | Formules (free/pro/business/enterprise) + quotas, store d'usage. |
| `src/lib/ai/provider.ts` | Client LLM + orchestration tool-use. |
| `src/app/api/ai/chat/route.ts` | Endpoint : validation → quota (server) → LLM+outils → réponse. |
| `src/components/ai/ai-assistant.tsx` | Drawer d'assistant global + accroches contextuelles. |

## Flux d'une requête

```
UI (ai-assistant) ──POST /api/ai/chat──▶ route
  route: valider (zod) → checkAndConsume(quota, server-side)
       → si clé absente: message de repli (200)
       → runAssistant(messages) : LLM ↔ outils (données réelles) ↔ LLM
       ◀── { text, toolTrace, usage }
```

## Abonnements & quotas

`src/lib/ai/entitlements.ts` définit `PLANS` et `checkAndConsume(key, plan)`.
Le contrôle est **serveur uniquement** (jamais de confiance au client). Store
d'usage en mémoire en démo ; interface prête pour une table Supabase
`ai_usage(user_id, period, count)`. Facturation : Stripe (Phase 4), branché
derrière `PLANS` via une correspondance `price_id → plan`.

## Configuration

`.env.local` :

```
ANTHROPIC_API_KEY=sk-ant-...   # server-only ; sans elle, l'assistant renvoie un message de repli
AI_MODEL=claude-opus-5         # optionnel (claude-sonnet-5 / claude-haiku-4-5 pour réduire le coût)
```

## Garde-fous

- Le prompt interdit d'inventer des données : toute donnée factuelle passe par un outil.
- Les analytics des fiches sont « communiquées par le vendeur » → l'IA le rappelle.
- L'IA n'est pas un conseiller réglementé : mentions pédagogiques systématiques.

## Feuille de route

- **Phase 1 (fait)** : module IA + calc + outils + prompt + route + quotas (mock) + assistant global + accroche fiche bien.
- **Phase 2** : RAG (fiscalité/guides/doc SaaS), génération de rapports, plus d'accroches contextuelles.
- **Phase 3** : bascule Supabase (auth réelle, conversations, quotas persistés, pgvector).
- **Phase 4** : Stripe (formules, essais, upgrades).
