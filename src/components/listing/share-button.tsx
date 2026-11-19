"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Partager une annonce ────────────────────────────────────────────────────
   Le levier d'acquisition n°1 : les gens partagent déjà des logements sur
   WhatsApp et dans les groupes Facebook. Partage natif sur mobile (feuille de
   partage du téléphone), copie du lien sinon. L'aperçu (photo, prix, prime)
   est produit par `opengraph-image.tsx`. */

export function ShareButton({ path, title, text }: { path: string; title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Partage annulé : rien à signaler. */
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={() => void share()} aria-live="polite">
      {copied ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      {copied ? "Lien copié" : "Partager"}
    </Button>
  );
}
