import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompt";
import { getToolDefinitions, runTool } from "./tools";

/* ─── Couche 1 : provider LLM (Claude), server-only ───────────────────────
   Orchestration de l'assistant : boucle d'appel d'outils (tool use) jusqu'à
   la réponse finale. La clé API ne quitte jamais le serveur.
   · Modèle par défaut claude-opus-5-5, surchargé par AI_MODEL
     (ex : claude-sonnet-5-5 ou claude-haiku-5-5 pour réduire le coût).
   · Repli côté serveur (`fallbacks: "default"`) : si le modèle décline une
     demande par prudence, l'API la relance sur un modèle de repli.
   · Mise en cache automatique du préfixe stable (instructions + outils). */

const MODEL = process.env.AI_MODEL || "claude-opus-5-5";
const BETAS: Anthropic.Beta.AnthropicBeta[] = ["server-side-fallback-2026-07-01"];
const MAX_TOKENS = 4096;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantResult {
  text: string;
  toolTrace: { name: string }[];
  stopReason: string | null;
  model: string;
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function extractText(content: Anthropic.Beta.BetaContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function runAssistant(opts: {
  messages: ChatMessage[];
  systemExtra?: string | null;
  maxToolCalls: number;
}): Promise<AssistantResult> {
  const client = new Anthropic(); // lit ANTHROPIC_API_KEY
  const system = opts.systemExtra ? `${SYSTEM_PROMPT}\n\n${opts.systemExtra}` : SYSTEM_PROMPT;
  const tools = getToolDefinitions() as unknown as Anthropic.Beta.BetaToolUnion[];

  const messages: Anthropic.Beta.BetaMessageParam[] = opts.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const toolTrace: { name: string }[] = [];
  let calls = 0;

  while (true) {
    const resp = await client.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      betas: BETAS,
      fallbacks: "default",
      cache_control: { type: "ephemeral" },
      system,
      tools,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      messages,
    });

    if (resp.stop_reason === "refusal") {
      return { text: "Désolé, je ne peux pas traiter cette demande.", toolTrace, stopReason: "refusal", model: resp.model };
    }

    if (resp.stop_reason === "tool_use") {
      // Rejoue le contenu de l'assistant tel quel (blocs thinking + tool_use).
      messages.push({ role: "assistant", content: resp.content });

      /* Appels parallèles exécutés ensemble, résultats renvoyés dans UN seul
         message utilisateur. */
      const uses = resp.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      const results = await Promise.all(uses.map((b) => runTool(b.name, (b.input ?? {}) as Record<string, unknown>)));
      const toolResults: Anthropic.Beta.BetaToolResultBlockParam[] = uses.map((b, i) => {
        calls++;
        toolTrace.push({ name: b.name });
        const r = results[i];
        const failed = !!r && typeof r === "object" && "erreur" in r;
        return { type: "tool_result", tool_use_id: b.id, content: JSON.stringify(r), ...(failed ? { is_error: true } : {}) };
      });
      messages.push({ role: "user", content: toolResults });

      // Garde-fou de profondeur : au-delà du quota d'outils, on force une
      // réponse finale sans nouveaux appels d'outils.
      if (calls >= opts.maxToolCalls) {
        const final = await client.beta.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          betas: BETAS,
          fallbacks: "default",
          cache_control: { type: "ephemeral" },
          system,
          tools,
          tool_choice: { type: "none" },
          thinking: { type: "adaptive" },
          output_config: { effort: "medium" },
          messages,
        });
        return { text: extractText(final.content), toolTrace, stopReason: final.stop_reason, model: final.model };
      }
      continue;
    }

    // end_turn | max_tokens | stop_sequence
    return { text: extractText(resp.content), toolTrace, stopReason: resp.stop_reason, model: resp.model };
  }
}
