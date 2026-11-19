import { ImageResponse } from "next/og";
import { getPublicProperty } from "@/lib/supabase/property-actions";
import { coverOf, frDay, isDbPropertyId, repriseOf } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";

/* ── Aperçu partagé d'une annonce (WhatsApp, Facebook, iMessage…) ────────────
   Le levier d'acquisition n°1 : quand un lien d'annonce est collé dans un
   groupe, c'est cette image qui s'affiche — photo, prix, ville et, s'il y en a
   une, la PRIME en laiton : « 500 CHF pour qui trouve ». */

export const alt = "Annonce sur E-Dome";
/* 900×473 (même format que 1200×630) : une image photographique plus légère,
   que les messageries affichent volontiers en grand. */
export const size = { width: 675, height: 355 };
export const contentType = "image/png";

const UNIT: Record<string, string> = { vente: "", "location-lt": " / mois", "location-ct": " / nuit" };

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = isDbPropertyId(id) ? await getPublicProperty(id) : null;

  if (!p) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#15130f", color: "#faf9f6", fontSize: 48, fontWeight: 700 }}>
          E-Dome
        </div>
      ),
      size,
    );
  }

  const reprise = repriseOf(p);
  const label = reprise ? "Reprise de bail" : p.transactionType === "vente" ? "À vendre" : "À louer";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#15130f" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverOf(p)} alt="" width={525} height={473} style={{ width: 525, height: 473, objectFit: "cover" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "36px 33px", color: "#faf9f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#faf9f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 9, height: 9, borderRadius: 4, background: "#d9a441" }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>E-Dome</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: 2, color: "#a39c90" }}>{`${label} · ${p.city}`}</div>
            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.15, letterSpacing: -1 }}>{p.title.slice(0, 70)}</div>
            <div style={{ fontSize: 27, fontWeight: 700, color: "#ffffff" }}>{`CHF ${formatNumber(p.price)}${UNIT[p.transactionType] ?? ""}`}</div>
            {reprise?.availableFrom ? <div style={{ fontSize: 18, color: "#63bdb2" }}>{`Libre dès le ${frDay(reprise.availableFrom)}`}</div> : null}
          </div>

          {p.activePrimeChf ? (
            <div style={{ display: "flex", flexDirection: "column", background: "#f7edd6", color: "#8a5d0c", borderRadius: 14, padding: "14px 17px" }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{`Prime ${formatNumber(p.activePrimeChf)} CHF`}</div>
              <div style={{ fontSize: 16 }}>pour qui trouve la bonne personne</div>
            </div>
          ) : (
            <div style={{ fontSize: 16, color: "#a39c90" }}>Sans commission d&apos;agence</div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
