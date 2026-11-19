import { ImageResponse } from "next/og";
import { getSearch } from "@/lib/supabase/search-actions";
import { formatNumber } from "@/lib/format";
import { searchTitle } from "@/lib/recherches";

/* ── Aperçu partagé d'une recherche ──────────────────────────────────────────
   Ce qui circule dans les groupes : « Récompense 500 CHF — Logement à louer ·
   Lausanne ». Pas de photo : la récompense est le visuel. Léger par nature. */

export const alt = "Recherche à récompense sur E-Dome";
export const size = { width: 900, height: 473 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getSearch(id);
  const title = s ? searchTitle(s) : "Recherche à récompense";
  const reward = s ? `${formatNumber(s.rewardChf)} CHF` : "";
  const line = s ? s.description.slice(0, 120) + (s.description.length > 120 ? "…" : "") : "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#15130f", color: "#faf9f6", padding: "40px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#faf9f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: "#d9a441" }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>E-Dome</div>
          <div style={{ marginLeft: "auto", fontSize: 18, color: "#a39c90" }}>Recherche à récompense</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reward ? (
            <div style={{ display: "flex", alignSelf: "flex-start", background: "#f7edd6", color: "#8a5d0c", borderRadius: 16, padding: "10px 20px", fontSize: 44, fontWeight: 700 }}>
              {`Récompense ${reward}`}
            </div>
          ) : null}
          <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          <div style={{ fontSize: 22, color: "#c9c3b8", lineHeight: 1.35 }}>{line}</div>
        </div>
        <div style={{ fontSize: 20, color: "#63bdb2" }}>Vous connaissez la bonne personne ou le bon bien ? Proposez-le sur E-Dome.</div>
      </div>
    ),
    size,
  );
}
