import { NextResponse } from "next/server";
import { z } from "zod";
import { isAiConfigured, runAssistant, type ChatMessage } from "@/lib/ai/provider";
import { checkAndConsume } from "@/lib/ai/entitlements";
import { contextBlock } from "@/lib/ai/prompt";

/* Route de l'assistant IA. Ordre : validation → quota (server-side) →
   LLM + outils. La clé API reste server-only ; si elle est absente, on
   renvoie une réponse claire (200) pour que la démo continue de fonctionner.

   Clé de quota : `sessionId` fourni par le client (démo). En Phase 3, on la
   remplace par l'user_id Supabase issu de la session authentifiée — sans
   changer la logique d'application des quotas. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) }))
    .min(1)
    .max(30),
  sessionId: z.string().min(1).max(100).optional(),
  plan: z.enum(["free", "pro", "business", "enterprise"]).optional(),
  context: z
    .object({ currentPropertyId: z.string().optional(), route: z.string().optional() })
    .optional(),
});

export async function POST(req: Request) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const key = body.sessionId ?? "anon";
  const plan = body.plan ?? "free";

  // Quota appliqué côté serveur, avant tout appel LLM.
  const quota = checkAndConsume(key, plan);
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: "quota_exceeded",
        message: `Quota IA atteint pour la formule ${quota.plan.name} (${quota.plan.monthlyQuota}/mois). Passez à une formule supérieure pour continuer.`,
        plan: quota.plan.id,
      },
      { status: 429 },
    );
  }

  // Fallback gracieux si la clé n'est pas configurée (démo).
  if (!isAiConfigured()) {
    return NextResponse.json({
      text:
        "🔑 L'assistant IA n'est pas encore activé sur cet environnement (clé API manquante). " +
        "Une fois la variable `ANTHROPIC_API_KEY` configurée côté serveur, je pourrai estimer des biens, calculer des rentabilités et analyser des investissements à partir des données réelles d'E-Dome.",
      toolTrace: [],
      configured: false,
      usage: { used: quota.used, remaining: quota.remaining === Infinity ? null : quota.remaining, plan: quota.plan.id },
    });
  }

  const messages: ChatMessage[] = body.messages.slice(-16);
  const systemExtra = contextBlock({
    currentPropertyId: body.context?.currentPropertyId,
    route: body.context?.route,
    plan: quota.plan.name,
  });

  try {
    const result = await runAssistant({ messages, systemExtra, maxToolCalls: quota.plan.maxToolCalls });
    return NextResponse.json({
      text: result.text || "Je n'ai pas de réponse à formuler pour cette demande.",
      toolTrace: result.toolTrace,
      configured: true,
      model: result.model,
      usage: { used: quota.used, remaining: quota.remaining === Infinity ? null : quota.remaining, plan: quota.plan.id },
    });
  } catch (e) {
    console.error("[ai/chat] erreur:", e);
    return NextResponse.json(
      { error: "ai_error", message: "L'assistant a rencontré une erreur. Réessayez dans un instant." },
      { status: 502 },
    );
  }
}
