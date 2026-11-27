"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/* Adresse e-mail cliquable, avec un bouton pour la copier. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-background p-1.5 pl-4">
      <a href={`mailto:${email}`} className="min-w-0 flex-1 truncate font-mono text-[14px] text-foreground hover:text-laiton">{email}</a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            /* presse-papiers indisponible : le lien mailto reste utilisable */
          }
        }}
        aria-label={copied ? "Adresse copiée" : "Copier l'adresse"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Adresse copiée" : ""}</span>
    </div>
  );
}
