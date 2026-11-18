"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_OPEN_EVENT } from "@/lib/nav";

/** Ouvre le copilote IA (écouté par `AiAssistant`, monté dans la coquille). */
export function CopilotButton({ prompt, label = "Copilote IA" }: { prompt?: string; label?: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => window.dispatchEvent(new CustomEvent(AI_OPEN_EVENT, { detail: prompt ? { prompt } : undefined }))}
    >
      <Sparkles className="h-4 w-4 text-leman" aria-hidden />
      {label}
    </Button>
  );
}
