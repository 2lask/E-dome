import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompt";
import { getToolDefinitions, runTool } from "./tools";

/* ─── Couche 1 : provider LLM (Claude), server-only ───────────────────────
   Orchestration de l'assistant : boucle d'appel d'outils (tool use) jusqu'à
   la réponse finale. La clé API ne quitte jamais le serveur. Modèle par
   défaut claude-opus-5, surchargé par AI_MODEL (ex: claude-sonnet-5 /
   claude-haiku-4-5 pour réduire le coût). */

const MODEL = process.env.AI_MODEL || "claude-opus-5";
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

function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
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
  const tools = getToolDefinitions() as unknown as Anthropic.Tool[];

  const messages: Anthropic.MessageParam[] = opts.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const toolTrace: { name: string }[] = [];
  let calls = 0;

  while (true) {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
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

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of resp.content) {
        if (block.type === "tool_use") {
          calls++;
          const result = runTool(block.name, (block.input ?? {}) as Record<string, unknown>);
          toolTrace.push({ name: block.name });
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }
      }
      messages.push({ role: "user", content: toolResults });

      // Garde-fou de profondeur : au-delà du quota d'outils, on force une
      // réponse finale sans nouveaux appels d'outils.
      if (calls >= opts.maxToolCalls) {
        const final = await client.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
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
