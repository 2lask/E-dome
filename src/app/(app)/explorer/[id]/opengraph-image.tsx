import { ImageResponse } from "next/og";
import { getPublicProperty } from "@/lib/supabase/property-actions";
import { coverOf, frDay, isDbPropertyId, repriseOf } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";

/* ── Aperçu partagé d'une annonce (WhatsApp, iMessage, Facebook, LinkedIn) ───
   Le levier d'acquisition n°1 : c'est cette image qui s'affiche quand un lien
   d'apporteur est collé dans une conversation. Format standard 1200×630,
   photo en plein cadre, et par-dessus : type · ville, titre, prix et la
   commission en laiton. Le texte reste dans la moitié gauche et le bas, où le
   dégradé garantit le contraste quelle que soit la photo. */

export const alt = "Annonce immobilière sur E-Dome";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const UNIT: Record<string, string> = { vente: "", "location-lt": " / mois", "location-ct": " / nuit" };

/* Coupe au dernier mot entier : « …et vue… » plutôt que « …et vue pano… ». */
const clip = (s: string, n: number) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > n * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:·–-]+$/, "")}…`;
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = isDbPropertyId(id) ? await getPublicProperty(id) : null;

  if (!p) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#15130f", color: "#faf9f6", fontSize: 72, fontWeight: 700 }}>
          E-Dome
        </div>
      ),
      size,
    );
  }

  const reprise = repriseOf(p);
  const label = reprise ? "Reprise de bail" : p.transactionType === "vente" ? "À vendre" : "À louer";
  const facts = [p.area > 0 ? `${p.area} m²` : null, p.bedrooms > 0 ? `${p.bedrooms} ch.` : null].filter(Boolean).join(" · ");
  const commission = p.activePrimeChf
    ? p.commission?.kind === "pourcentage"
      ? `Commission ${String(p.commission.ratePct).replace(".", ",")} % du prix`
      : `Commission ${formatNumber(p.activePrimeChf)} CHF`
    : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#15130f" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverOf(p)} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(15,13,10,0.9) 0%, rgba(15,13,10,0.7) 45%, rgba(15,13,10,0.1) 80%)" }} />
        <div style={{ position: "absolute", left: 0, top: 370, width: 1200, height: 260, display: "flex", backgroundImage: "linear-gradient(0deg, rgba(15,13,10,0.8) 0%, rgba(15,13,10,0) 100%)" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "52px 60px", color: "#faf9f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#faf9f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: "#d9a441" }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.8 }}>E-Dome</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ display: "flex", fontSize: 24, textTransform: "uppercase", letterSpacing: 3, color: "#d8d1c4" }}>{`${label} · ${p.city}`}</div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 58, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.8 }}>{clip(p.title, 52)}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 22 }}>
              <div style={{ fontSize: 50, fontWeight: 700, letterSpacing: -1 }}>{`CHF ${formatNumber(p.price)}${UNIT[p.transactionType] ?? ""}`}</div>
              {facts ? <div style={{ fontSize: 26, color: "#d8d1c4" }}>{facts}</div> : null}
            </div>
            {reprise?.availableFrom ? <div style={{ display: "flex", marginTop: 10, fontSize: 26, color: "#7fd3c8" }}>{`Libre dès le ${frDay(reprise.availableFrom)}`}</div> : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {commission ? (
              <div style={{ display: "flex", alignItems: "center", background: "#f7edd6", color: "#8a5d0c", borderRadius: 16, padding: "14px 22px", fontSize: 28, fontWeight: 700 }}>
                {commission}
              </div>
            ) : null}
            <div style={{ display: "flex", fontSize: 24, color: "#e9e4da" }}>Sans commission d&apos;agence</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
