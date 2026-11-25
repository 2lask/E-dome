"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Inbox, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ── Alerte « nouveau lead », partout dans l'application ─────────────────────
   Tant que les e-mails ne sont pas branchés, c'est ainsi qu'un vendeur
   apprend qu'un lead vient d'arriver : une carte apparaît sur n'importe quelle
   page (Supabase Realtime, filtré par la RLS sur SES demandes), le compteur
   « Demandes » se met à jour, et, s'il l'a autorisé, le navigateur l'alerte
   quand l'onglet est en arrière-plan. Le nom de l'expéditeur n'est affiché
   qu'au vendeur, destinataire légitime de la demande. */

type Alert = { id: string; name: string; at: number };

export function LeadAlerts({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const pathRef = useRef(pathname);
  useEffect(() => { pathRef.current = pathname; }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled || !data.session) return;
      await supabase.realtime.setAuth(data.session.access_token);
      channel = supabase
        .channel(`leads-${userId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "inquiries", filter: `seller_id=eq.${userId}` }, (p) => {
          const row = p.new as { id: string; sender_name?: string | null };
          const name = (row.sender_name ?? "").trim() || "Quelqu'un";
          router.refresh();
          if (pathRef.current.startsWith("/demandes")) return; // déjà sous les yeux
          setAlerts((cur) => [{ id: row.id, name, at: Date.now() }, ...cur].slice(0, 3));
          if (typeof document !== "undefined" && document.hidden && "Notification" in window && Notification.permission === "granted") {
            try { new Notification("Nouveau lead sur E-Dome", { body: `${name} vous a écrit.`, tag: row.id }); } catch { /* navigateur restrictif */ }
          }
        })
        .subscribe();
    })();
    return () => { cancelled = true; if (channel) void supabase.removeChannel(channel); };
  }, [userId, router]);

  /* Les cartes disparaissent seules après 20 secondes. */
  useEffect(() => {
    if (alerts.length === 0) return;
    const t = setTimeout(() => setAlerts((cur) => cur.filter((a) => Date.now() - a.at < 20_000)), 20_500);
    return () => clearTimeout(t);
  }, [alerts]);

  if (alerts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-[84px] z-50 flex flex-col items-end gap-2 md:inset-x-auto md:bottom-6 md:right-6" aria-live="polite">
      {alerts.map((a) => (
        <div key={a.id} className="live-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-[rgb(227_184_92/0.45)] bg-card/95 p-4 shadow-[0_20px_50px_-15px_rgb(217_164_65/0.45)] backdrop-blur">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-laiton-soft text-laiton"><Inbox className="h-4 w-4" aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold">Nouveau lead</p>
            <p className="truncate text-[13px] text-muted-foreground">{a.name} vous a écrit à l&apos;instant.</p>
            <Link href="/demandes" onClick={() => setAlerts((cur) => cur.filter((x) => x.id !== a.id))}
              className="mt-2 inline-flex h-8 items-center rounded-lg bg-leman px-3 text-[12.5px] font-semibold text-white dark:text-[#0d1513]">
              Voir la demande
            </Link>
          </div>
          <button type="button" aria-label="Fermer" onClick={() => setAlerts((cur) => cur.filter((x) => x.id !== a.id))} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}

/* Bouton pour autoriser les alertes du navigateur (à placer dans Demandes). */
export function BrowserAlertsButton() {
  const [state, setState] = useState<"unsupported" | "default" | "granted" | "denied">("unsupported");
  useEffect(() => {
    if ("Notification" in window) setState(Notification.permission as "default" | "granted" | "denied");
  }, []);
  if (state === "unsupported" || state === "granted") return null;
  return (
    <button type="button" disabled={state === "denied"}
      onClick={async () => setState((await Notification.requestPermission()) as "default" | "granted" | "denied")}
      className="inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-[13px] font-medium hover:border-foreground/25 disabled:opacity-60">
      <Bell className="h-4 w-4 text-laiton" aria-hidden />
      {state === "denied" ? "Alertes bloquées par le navigateur" : "Être alerté des nouveaux leads"}
    </button>
  );
}
