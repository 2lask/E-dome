/* ─── Abonnements & quotas IA (appliqués CÔTÉ SERVEUR) ────────────────────
   Source unique des formules et de leurs limites. La vérification de quota
   est faite dans la route /api/ai/chat, jamais côté client.

   Phase démo : le compteur d'usage vit en mémoire process (par identifiant
   de session anonyme). Conçu pour être remplacé par une table Supabase
   `ai_usage(user_id, period, count)` sans changer l'interface publique
   (checkAndConsume). Le fournisseur de facturation (Stripe) se branchera
   derrière `PLANS` via une simple correspondance price_id → plan. */

export type PlanId = "free" | "pro" | "business" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  monthlyQuota: number; // requêtes IA / mois (Infinity = illimité)
  maxToolCalls: number; // profondeur d'orchestration par requête
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: { id: "free", name: "Gratuit", monthlyQuota: 20, maxToolCalls: 4, features: ["chat", "estimation", "rendement"] },
  pro: { id: "pro", name: "Pro", monthlyQuota: 500, maxToolCalls: 8, features: ["chat", "estimation", "rendement", "cashflow", "analyse", "rapports"] },
  business: { id: "business", name: "Business", monthlyQuota: 5000, maxToolCalls: 12, features: ["chat", "estimation", "rendement", "cashflow", "analyse", "rapports", "collaboratif"] },
  enterprise: { id: "enterprise", name: "Enterprise", monthlyQuota: Infinity, maxToolCalls: 16, features: ["*"] },
};

export function getPlan(id: string | undefined | null): Plan {
  return PLANS[(id as PlanId) ?? "free"] ?? PLANS.free;
}

// ─── Store d'usage (mock in-memory ; → Supabase en Phase 3) ────────────────

interface UsageRecord {
  period: string; // "YYYY-MM"
  count: number;
}
const usageStore = new Map<string, UsageRecord>();

function currentPeriod(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export interface QuotaResult {
  allowed: boolean;
  plan: Plan;
  used: number;
  remaining: number;
}

/* Vérifie le quota et, si autorisé, incrémente l'usage. À appeler une fois
   par requête IA acceptée, côté serveur. `key` = user_id (Supabase) ou un id
   de session anonyme en démo. */
export function checkAndConsume(key: string, planId: string | undefined): QuotaResult {
  const plan = getPlan(planId);
  const period = currentPeriod();
  const rec = usageStore.get(key);
  const used = rec && rec.period === period ? rec.count : 0;

  if (used >= plan.monthlyQuota) {
    return { allowed: false, plan, used, remaining: 0 };
  }
  usageStore.set(key, { period, count: used + 1 });
  return {
    allowed: true,
    plan,
    used: used + 1,
    remaining: plan.monthlyQuota === Infinity ? Infinity : plan.monthlyQuota - (used + 1),
  };
}

export function peekUsage(key: string, planId: string | undefined): QuotaResult {
  const plan = getPlan(planId);
  const period = currentPeriod();
  const rec = usageStore.get(key);
  const used = rec && rec.period === period ? rec.count : 0;
  return {
    allowed: used < plan.monthlyQuota,
    plan,
    used,
    remaining: plan.monthlyQuota === Infinity ? Infinity : Math.max(0, plan.monthlyQuota - used),
  };
}
