"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setMoveRequestStatus } from "@/lib/supabase/move-actions";
import { MOVE_STATUS_LABEL, type MoveRequest, type MoveStatus } from "@/lib/demenagement";

/* Suivi d'une demande par l'équipe : statut + note (à quels artisans transmise). */
export function MoveAdminRow({ r }: { r: MoveRequest }) {
  const router = useRouter();
  const [status, setStatus] = useState<MoveStatus>(r.status);
  const [note, setNote] = useState(r.adminNote);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const dirty = status !== r.status || note !== r.adminNote;

  const save = () =>
    startTransition(async () => {
      const res = await setMoveRequestStatus(r.id, status, note);
      setMsg(res.ok ? "Enregistré" : res.error);
      if (res.ok) router.refresh();
    });

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <select value={status} onChange={(e) => setStatus(e.target.value as MoveStatus)} aria-label="Statut"
        className="h-9 rounded-lg border border-input bg-card px-2 text-[13px]">
        {(Object.keys(MOVE_STATUS_LABEL) as MoveStatus[]).map((s) => <option key={s} value={s}>{MOVE_STATUS_LABEL[s]}</option>)}
      </select>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note : artisans contactés, suite…" aria-label="Note interne"
        maxLength={1000} className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-card px-3 text-[13px] outline-none focus:border-leman" />
      <Button size="sm" variant="outline" onClick={save} disabled={!dirty || isPending}>Enregistrer</Button>
      {msg && <span role="status" className="text-[12px] text-muted-foreground">{msg}</span>}
    </div>
  );
}
