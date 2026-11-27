"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Share2, PlayCircle, Inbox, Handshake, Radio } from "lucide-react";
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
  const linkIdsRef = useRef(linkIds);
  useEffect(() => { linkIdsRef.current = linkIds; }, [linkIds]);

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
          /* Lead : le vendeur le reçoit par `inquiries` ; l'apporteur (qui ne lit
             pas les demandes, nLPD) le voit par l'événement de SON lien. */
          if (row.kind === "lead" && !(row.link_id && linkIdsRef.current.includes(row.link_id) && !titlesRef.current[row.property_id])) return;
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
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="min-w-0 text-[15px] font-semibold tracking-[-0.01em]">Activité en direct</h2>
        <LiveBadge on={connected} />
      </div>
      {items.length === 0 ? (
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-4 py-8 text-center">
          <div aria-hidden className="v3-dots" />
          {/* Radar décoratif : ondes qui s'éloignent (transform + opacity). */}
          <span aria-hidden className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-leman/40 motion-safe:animate-ping [animation-duration:2.4s]" />
            <span className="absolute inset-2 rounded-full border border-leman/25" />
            <span className="absolute inset-4 rounded-full bg-leman-soft" />
            <Radio className="relative h-5 w-5 text-leman" />
          </span>
          <p className="relative mt-4 text-[13.5px] font-medium">À l&apos;écoute</p>
          <p className="relative mt-1 max-w-[30ch] text-[12.5px] leading-relaxed text-muted-foreground">
            Les visites, partages et leads s&apos;affichent ici à l&apos;instant où ils arrivent. Partagez une annonce pour voir le premier.
          </p>
        </div>
      ) : (
        <div className="relative">
        <span aria-hidden className="absolute bottom-3 left-[22px] top-3 w-px bg-gradient-to-b from-border via-border to-transparent" />
        <ul className="relative space-y-1" aria-live="polite">
          {items.map((it) => {
            const Icon = ICON[it.kind] ?? Eye;
            const gold = it.kind === "lead" || it.kind === "vente";
            return (
              <li key={it.id} className="live-in relative flex items-center gap-3 rounded-xl px-2 py-2 text-[13px] transition-colors hover:bg-subtle">
                <span className={gold
                  ? "relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-laiton-soft text-laiton ring-4 ring-card"
                  : "relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-leman-soft text-leman ring-4 ring-card"}>
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={gold ? "block font-semibold text-laiton" : "block font-medium"}>{LABEL[it.kind] ?? it.kind}</span>
                  <span className="block truncate text-[12px] text-muted-foreground">{it.title}</span>
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">à l&apos;instant</span>
              </li>
            );
          })}
        </ul>
        </div>
      )}
    </div>
  );
}
