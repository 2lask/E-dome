"use client";

import { useEffect } from "react";
import type { TrackKind } from "@/lib/tracking";

/* ── Suivi côté navigateur ───────────────────────────────────────────────────
   Une vue à l'arrivée sur la fiche (avec le code d'apporteur de l'URL s'il y en
   a un), et `track()` pour les partages, lectures de vidéo, clics de contact.
   `keepalive` : l'événement part même si l'on quitte la page. */

export function track(propertyId: string, kind: TrackKind, ref?: string | null, origin?: { s?: string | null; r?: string | null }) {
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p: propertyId, k: kind, ...(ref ? { ref } : {}), ...(origin?.s ? { s: origin.s } : {}), ...(origin?.r ? { r: origin.r } : {}) }),
      keepalive: true,
    });
  } catch {
    /* le suivi ne doit jamais gêner la page */
  }
}

export function TrackView({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const ref = qs.get("ref");
    /* Origine : le paramètre `src` de nos partages, sinon le seul nom d'hôte
       de la page précédente (jamais son adresse complète). */
    let host = "";
    try { host = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* référent illisible */ }
    track(propertyId, "vue", ref && /^[a-z0-9]{6,12}$/.test(ref) ? ref : null, { s: qs.get("src")?.slice(0, 20) ?? null, r: host });
  }, [propertyId]);
  return null;
}
