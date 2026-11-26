"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Coins, Home, Loader2, MessageSquare, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getThreadMessages, markThreadRead, sendLinkMessage, type LinkMessage, type LinkThread,
} from "@/lib/supabase/link-message-actions";
import { cn } from "@/lib/utils";

/* ── Messages vendeur ↔ apporteur ────────────────────────────────────────────
   Inspiré des messageries « programme ↔ partenaire » : une conversation par
   lien, à gauche la liste, à droite le fil. Les nouveaux messages arrivent en
   direct (Supabase Realtime, filtré par la RLS). Sur téléphone, liste et fil
   s'affichent l'un après l'autre. */

const time = (iso: string) => {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return today ? d.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString("fr-CH", { day: "numeric", month: "short" });
};

const SUGGESTIONS: Record<LinkThread["role"], string[]> = {
  apporteur: [
    "Bonjour, j'ai une personne intéressée. Le bien est-il encore disponible ?",
    "Des visites sont-elles possibles cette semaine ?",
    "Pouvez-vous me préciser les charges annuelles ?",
  ],
  vendeur: [
    "Merci pour votre recommandation !",
    "Des visites sont possibles samedi matin.",
    "Le bien est toujours disponible.",
  ],
};

export function LinkInbox({ threads, ready, initial, userId }: { threads: LinkThread[]; ready: boolean; initial: string | null; userId: string }) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(initial && threads.some((t) => t.linkId === initial) ? initial : null);
  const [messages, setMessages] = useState<LinkMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);
  const thread = threads.find((t) => t.linkId === active) ?? null;
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  /* Ouverture d'une conversation : messages, puis « lu ». */
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError("");
      const res = await getThreadMessages(active);
      if (cancelled) return;
      setLoading(false);
      if (!res.ok) { setError(res.error); setMessages([]); return; }
      setMessages(res.messages);
      await markThreadRead(active);
      router.refresh();
    })();
    return () => { cancelled = true; };
  }, [active, router]);

  /* Temps réel : tout message qui me concerne (la RLS filtre). */
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
        .channel(`link-messages-${userId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "link_messages" }, (p) => {
          const m = p.new as { id: string; link_id: string; sender_id: string; body: string; created_at: string; read_at: string | null };
          if (m.sender_id === userId) return; // mes propres messages sont déjà affichés
          if (activeRef.current === m.link_id) {
            setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, { id: m.id, mine: false, body: m.body, createdAt: m.created_at, readAt: null }]));
            void markThreadRead(m.link_id);
          }
          router.refresh();
        })
        .subscribe();
    })();
    return () => { cancelled = true; if (channel) void supabase.removeChannel(channel); };
  }, [userId, router]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages.length, active]);

  const send = (text = draft) => {
    if (!active || !text.trim()) return;
    startTransition(async () => {
      const res = await sendLinkMessage(active, text);
      if (!res.ok) { setError(res.error); return; }
      setMessages((list) => [...list, res.message]);
      setDraft("");
      setError("");
      router.refresh();
    });
  };

  if (!ready) {
    return <p role="status" className="mt-6 rounded-xl bg-warning-soft px-4 py-3 text-[13.5px]">La messagerie s&apos;active avec la mise à jour de la base (migration 012).</p>;
  }

  if (threads.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
        <MessageSquare className="mx-auto h-6 w-6 text-leman" aria-hidden />
        <p className="mt-3 text-[15px] font-medium">Aucune conversation pour l&apos;instant</p>
        <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted-foreground">
          Une conversation s&apos;ouvre dès qu&apos;un apporteur prend son lien sur l&apos;un de vos biens, ou que vous prenez le
          vôtre sur un bien à commission.
        </p>
        <Link href="/apporteurs#biens" className="mt-5 inline-flex h-10 items-center rounded-xl bg-leman px-4 text-[13.5px] font-semibold text-white dark:text-[#0d1513]">Trouver un bien à recommander</Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid h-[calc(100dvh-260px)] min-h-[460px] overflow-hidden rounded-2xl border bg-card md:grid-cols-[320px_minmax(0,1fr)]">
      {/* ── Liste ── */}
      <ul className={cn("overflow-y-auto border-r", active && "hidden md:block")} aria-label="Conversations">
        {threads.map((t) => (
          <li key={t.linkId}>
            <button type="button" onClick={() => setActive(t.linkId)} aria-current={t.linkId === active ? "true" : undefined}
              className={cn("flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors", t.linkId === active ? "bg-subtle" : "hover:bg-subtle/60")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {t.cover ? <img src={t.cover} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" /> : <span className="h-11 w-11 shrink-0 rounded-lg bg-subtle" />}
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] font-semibold">{t.other}</span>
                  {t.last && <span className="shrink-0 text-[11.5px] text-muted-foreground">{time(t.last.createdAt)}</span>}
                </span>
                <span className="block truncate text-[12px] text-muted-foreground">{t.propertyTitle}</span>
                <span className={cn("mt-0.5 block truncate text-[12.5px]", t.unread ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {t.last ? `${t.last.mine ? "Vous : " : ""}${t.last.body}` : t.role === "vendeur" ? "A pris son lien sur votre bien" : "Écrivez au propriétaire"}
                </span>
              </span>
              {t.unread > 0 && <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-laiton px-1.5 text-[11px] font-semibold text-white dark:text-[#1a1408]">{t.unread}</span>}
            </button>
          </li>
        ))}
      </ul>

      {/* ── Fil ── */}
      {thread ? (
        <section className={cn("flex min-h-0 flex-col", !active && "hidden md:flex")} aria-label={`Conversation avec ${thread.other}`}>
          <header className="flex items-center gap-3 border-b px-4 py-3">
            <button type="button" onClick={() => setActive(null)} className="md:hidden" aria-label="Retour aux conversations"><ArrowLeft className="h-5 w-5" aria-hidden /></button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold">{thread.other}</p>
              <p className="flex items-center gap-1.5 truncate text-[12px] text-muted-foreground">
                {thread.role === "vendeur" ? <><Coins className="h-3.5 w-3.5 text-laiton" aria-hidden />Apporteur sur</> : <><Home className="h-3.5 w-3.5" aria-hidden />Propriétaire de</>}
                <Link href={`/explorer/${thread.propertyId}`} className="truncate hover:underline">{thread.propertyTitle}</Link>
              </p>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4">
            {loading ? (
              <p className="flex items-center gap-2 text-[13px] text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Chargement…</p>
            ) : messages.length === 0 ? (
              <div className="mx-auto max-w-sm py-6 text-center">
                <p className="text-[13.5px] text-muted-foreground">Aucun message. Lancez la conversation :</p>
                <div className="mt-3 flex flex-col gap-2">
                  {SUGGESTIONS[thread.role].map((s) => (
                    <button key={s} type="button" onClick={() => setDraft(s)} className="rounded-xl border px-3 py-2 text-left text-[13px] transition-colors hover:border-foreground/25">{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[78%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed",
                    m.mine ? "rounded-br-md bg-leman text-white dark:text-[#0d1513]" : "rounded-bl-md bg-subtle")}>
                    {m.body}
                    <span className={cn("mt-0.5 block text-right text-[10.5px]", m.mine ? "text-white/70 dark:text-[#0d1513]/70" : "text-muted-foreground")}>
                      {time(m.createdAt)}{m.mine && m.readAt ? " · lu" : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t p-3">
            {error && <p role="alert" className="mb-2 text-[12.5px] text-[var(--danger-text)]">{error}</p>}
            <div className="flex items-end gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Votre message</span>
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={1} maxLength={2000}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Écrire un message…"
                  className="max-h-40 min-h-[42px] w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-[14px] outline-none focus:border-leman" />
              </label>
              <button type="submit" disabled={isPending || !draft.trim()} aria-label="Envoyer"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-leman text-white transition-transform active:scale-95 disabled:opacity-50 dark:text-[#0d1513]">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              </button>
            </div>
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">Ne partagez pas ici les coordonnées d&apos;un acheteur sans son accord.</p>
          </form>
        </section>
      ) : (
        <div className="hidden items-center justify-center p-8 text-center md:flex">
          <div>
            <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
            <p className="mt-2 text-[14px] text-muted-foreground">Choisissez une conversation.</p>
          </div>
        </div>
      )}
    </div>
  );
}
