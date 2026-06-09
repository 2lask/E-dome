"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── <BackButton /> ──────────────────────────────────────────────────────
   Bouton retour standardisé pour les pages détail (formations/[id],
   boutique/[id], evenements/[id], live/replay/[id], etc.).

   Comportement :
   - Par défaut : router.back() (préserve l'historique de navigation).
   - Si `fallbackHref` fourni : utilisé si window.history n'a pas de
     précédent (cas direct-link, share URL ouvert dans un nouvel onglet).
   - Touch target 44x44 (Apple HIG) sur mobile via min-h-[44px] min-w-[44px].

   Style : variant "ghost" par défaut (texte + chevron), "circle" pour
   les overlays au-dessus d'une image (gallery, splash).
   ─────────────────────────────────────────────────────────────────── */

export interface BackButtonProps {
  /** Route de repli si window.history est vide. */
  fallbackHref?: string;
  /** Texte du bouton (défaut: "Retour"). */
  label?: string;
  /** Apparence : "ghost" (texte + chevron) ou "circle" (cercle opaque). */
  variant?: "ghost" | "circle";
  className?: string;
}

export function BackButton({
  fallbackHref,
  label = "Retour",
  variant = "ghost",
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = React.useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    } else {
      router.push("/feed");
    }
  }, [router, fallbackHref]);

  if (variant === "circle") {
    return (
      <button
        type="button"
        onClick={handleBack}
        aria-label={label}
        className={cn(
          "flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full",
          "bg-black/40 backdrop-blur-md text-white",
          "hover:bg-black/60 active:opacity-80 transition",
          className
        )}
      >
        <ChevronLeft size={22} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center gap-1 -ml-2 px-2 min-h-[44px] text-sm font-medium",
        "text-[var(--text-secondary)] hover:text-[var(--foreground)]",
        "active:opacity-60 transition-colors",
        className
      )}
    >
      <ChevronLeft size={18} />
      {label}
    </button>
  );
}
