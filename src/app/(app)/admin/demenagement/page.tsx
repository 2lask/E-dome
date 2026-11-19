import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listAllMoveRequests } from "@/lib/supabase/move-actions";
import { MoveAdminRow } from "@/components/demenagement/move-admin-row";
import { frDay } from "@/lib/my-property";
import { MOVE_STATUS_LABEL, SERVICE_LABEL, type MoveStatus } from "@/lib/demenagement";

export const metadata: Metadata = { title: "Conciergerie déménagement", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/* ── /admin/demenagement — la conciergerie (phase pilote) ────────────────────
   L'équipe transmet chaque demande à trois artisans au plus et note la suite.
   Quand le volume le justifie : espace artisans et transmission automatique. */

export default async function MoveAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Fadmin%2Fdemenagement");
  const { requests, ready, allowed } = await listAllMoveRequests();
  if (!allowed) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="text-[20px] font-semibold">Accès réservé</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">Réservé à l&apos;équipe (variable EDOME_ADMIN_EMAILS).</p>
      </div>
    );
  }
  const open = requests.filter((r) => r.status === "nouvelle").length;
  const byStatus = (Object.keys(MOVE_STATUS_LABEL) as MoveStatus[]).map((s) => [s, requests.filter((r) => r.status === s).length] as const);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="eyebrow">Pilotage</p>
      <h1 className="page-heading mt-1.5 text-[30px]">Conciergerie déménagement</h1>
      <p className="mt-1 text-[14px] text-muted-foreground">
        {ready ? `${open} demande${open > 1 ? "s" : ""} à transmettre.` : "Migration 007 à appliquer."}{" "}
        {byStatus.filter(([, n]) => n > 0).map(([s, n]) => `${MOVE_STATUS_LABEL[s]} : ${n}`).join(" · ")}
      </p>

      <ul className="mt-6 space-y-3">
        {requests.map((r) => (
          <li key={r.id} className={r.status === "nouvelle" ? "rounded-2xl border border-laiton-border bg-card p-5" : "rounded-2xl border bg-card p-5"}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-[15px] font-semibold">{r.services.map((s) => SERVICE_LABEL[s]).join(", ")}</p>
              <span className="text-[12px] text-muted-foreground">reçue le {frDay(r.createdAt)}</span>
            </div>
            <p className="mt-1 text-[13.5px]">
              {r.fromCity}{r.toCity ? ` → ${r.toCity}` : ""}{r.moveDate ? ` · le ${frDay(r.moveDate)}` : ""}{r.rooms ? ` · ${r.rooms} pièces` : ""}
            </p>
            {r.details && <p className="mt-2 whitespace-pre-line text-[13px] text-foreground/80">{r.details}</p>}
            <p className="mt-2 text-[13px]">
              <strong>{r.name}</strong>
              {r.email && <> · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a></>}
              {r.phone && <> · <a className="underline" href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a></>}
            </p>
            <MoveAdminRow r={r} />
          </li>
        ))}
      </ul>
      {ready && requests.length === 0 && <p className="mt-8 text-[14px] text-muted-foreground">Aucune demande pour l&apos;instant.</p>}
    </div>
  );
}
