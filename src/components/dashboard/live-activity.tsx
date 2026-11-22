"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Share2, PlayCircle, Inbox, Handshake } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LiveBadge } from "./glow-card";

/* ── Activité en direct (Supabase Realtime) ──────────────────────────────────
   Écoute les nouveaux événements de suivi et les leads. La RLS s'applique au
   temps réel : on ne reçoit que ce qui concerne SES biens ou SES liens. Chaque
   arrivée s'affiche aussitôt ; les indicateurs sont recalculés côté serveur
   (rafraîchissement regroupé, au plus toutes les 4 secondes). */

type Item = { id: string; kind: string; title: string; at: number };

const ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  vue: Eye, partage: Share2, video: PlayCircle, lead: Inbox, contact: Inbox, vente: Handshake,
};
const LABEL: Record<string, string> = {
  vue: "Nouvelle visite", partage: "Annonce partagée", video: "Vidéo regardée", lead: "Nouveau lead", contact: "Clic sur contact", vente: "Vente conclue",
};

export function LiveActivity({ titles, linkIds }: { titles: Record<string, string>; linkIds: string[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [connected, setConnected] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titlesRef = useRef(titles);
  useEffect(() => { titlesRef.current = titles; }, [titles]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const refresh = () => {
      if (timer.current) return;
      timer.current = setTimeout(() => { timer.current = null; router.refresh(); }, 4000);
    };
    const push = (kind: string, propertyId: string) => {
      setItems((cur) => [{ id: `${Date.now()}-${Math.random()}`, kind, title: titlesRef.current[propertyId] ?? "Un de vos biens", at: Date.now() }, ...cur].slice(0, 12));
      refresh();
    };
    /* La session doit être chargée AVANT l'abonnement : sinon le temps réel
       s'ouvre en anonyme et la RLS filtre tout (aucun événement reçu). */
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) await supabase.realtime.setAuth(data.session.access_token);
      channel = supabase
        .channel("tableau-de-bord")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "property_events" }, (p) => {
          const row = p.new as { kind: string; property_id: string; link_id: string | null };
          if (row.kind === "lead") return; // le lead arrive aussi par `inquiries`
          push(row.kind, row.property_id);
        })
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "inquiries" }, (p) => {
          push("lead", (p.new as { property_id: string }).property_id);
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "inquiries" }, (p) => {
          const row = p.new as { status: string; property_id: string };
          if (row.status === "conclue") push("vente", row.property_id);
          else refresh();
        })
        .subscribe((status) => setConnected(status === "SUBSCRIBED"));
    })();
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [router, linkIds.length]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[14px] font-semibold">Activité en direct</p>
        <LiveBadge on={connected} />
      </div>
      {items.length === 0 ? (
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Les visites, partages et leads s&apos;affichent ici à l&apos;instant où ils arrivent. Partagez une annonce pour voir le premier.
        </p>
      ) : (
        <ul className="space-y-1.5" aria-live="polite">
          {items.map((it) => {
            const Icon = ICON[it.kind] ?? Eye;
            return (
              <li key={it.id} className="live-in flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] hover:bg-subtle">
                <span className={it.kind === "lead" || it.kind === "vente" ? "flex h-7 w-7 items-center justify-center rounded-full bg-laiton-soft text-laiton" : "flex h-7 w-7 items-center justify-center rounded-full bg-leman-soft text-leman"}>
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1"><span className="font-medium">{LABEL[it.kind] ?? it.kind}</span> <span className="text-muted-foreground">· {it.title}</span></span>
                <span className="text-[11.5px] text-muted-foreground">à l&apos;instant</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
