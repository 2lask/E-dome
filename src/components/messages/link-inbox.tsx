"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CheckCheck, Coins, Home, Loader2, MessageSquare, Send, ShieldCheck, Sparkles } from "lucide-react";
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
    return <p role="status" className="mt-6 rounded-xl border border-laiton-border bg-warning-soft px-4 py-3 text-[13.5px]">La messagerie s&apos;active avec la mise à jour de la base (migration 012).</p>;
  }

  if (threads.length === 0) {
    return (
      <div className="relative mt-6 overflow-hidden rounded-[1.25rem] border border-dashed bg-card px-6 py-14 text-center">
        <div aria-hidden className="v3-dots" />
        <span className="v3-icon relative mx-auto h-12 w-12"><MessageSquare className="h-5 w-5" aria-hidden /></span>
        <p className="relative mt-4 text-[16px] font-semibold">Aucune conversation pour l&apos;instant</p>
        <p className="relative mx-auto mt-1 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          Une conversation s&apos;ouvre dès qu&apos;un apporteur prend son lien sur l&apos;un de vos biens, ou que vous prenez le
          vôtre sur un bien à commission.
        </p>
        <Link href="/apporteurs#biens" className="relative mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-leman px-5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-px dark:text-[#0d1513]">
          Trouver un bien à recommander <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid h-[calc(100dvh-220px)] min-h-[500px] overflow-hidden rounded-[1.25rem] border bg-card shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_24px_60px_-30px_rgb(0_0_0/0.5)] md:grid-cols-[340px_minmax(0,1fr)]">
      {/* ── Liste ── */}
      <div className={cn("flex min-h-0 flex-col border-r bg-[color-mix(in_oklab,var(--foreground)_1.5%,var(--card))]", active && "hidden md:flex")}>
        <div className="flex items-center justify-between border-b px-4 py-3.5">
          <p className="text-[13.5px] font-semibold">Conversations</p>
          <span className="rounded-full bg-subtle px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-muted-foreground">{threads.length}</span>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto p-2" aria-label="Conversations">
          {threads.map((t) => {
            const on = t.linkId === active;
            return (
              <li key={t.linkId}>
                <button type="button" onClick={() => setActive(t.linkId)} aria-current={on ? "true" : undefined}
                  className={cn("relative flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                    on ? "bg-subtle shadow-[inset_0_0_0_1px_var(--border)]" : "hover:bg-subtle/60")}>
                  {on && <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-leman" />}
                  <Avatar name={t.other} cover={t.cover} gold={t.role === "vendeur"} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate text-[14px]", t.unread ? "font-bold" : "font-semibold")}>{t.other}</span>
                      {t.last && <span className={cn("shrink-0 text-[11.5px]", t.unread ? "font-semibold text-laiton" : "text-muted-foreground")}>{time(t.last.createdAt)}</span>}
                    </span>
                    <span className="block truncate text-[12px] text-muted-foreground">{t.propertyTitle}</span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className={cn("min-w-0 flex-1 truncate text-[12.5px]", t.unread ? "font-medium text-foreground" : "text-muted-foreground")}>
                        {t.last ? `${t.last.mine ? "Vous : " : ""}${t.last.body}` : t.role === "vendeur" ? "A pris son lien sur votre bien" : "Écrivez au propriétaire"}
                      </span>
                      {t.unread > 0 && <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-laiton px-1.5 text-[11px] font-bold tabular-nums text-white shadow-[0_0_12px_color-mix(in_oklab,var(--laiton)_60%,transparent)] dark:text-[#1a1408]">{t.unread}</span>}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Fil ── */}
      {thread ? (
        <section className={cn("flex min-h-0 flex-col", !active && "hidden md:flex")} aria-label={`Conversation avec ${thread.other}`}>
          <header className="flex items-center gap-3 border-b px-3 py-3 sm:px-5">
            <button type="button" onClick={() => setActive(null)} className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-subtle md:hidden" aria-label="Retour aux conversations"><ArrowLeft className="h-5 w-5" aria-hidden /></button>
            <Avatar name={thread.other} gold={thread.role === "vendeur"} />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2">
                <span className="truncate text-[15px] font-semibold">{thread.other}</span>
                <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em]",
                  thread.role === "vendeur" ? "border-laiton-border bg-laiton-soft text-laiton" : "border-leman/30 bg-leman-soft text-leman")}>
                  {thread.role === "vendeur" ? "Apporteur" : "Propriétaire"}
                </span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12px] text-muted-foreground">
                {thread.role === "vendeur" ? <><Coins className="h-3.5 w-3.5 shrink-0 text-laiton" aria-hidden />Apporteur sur</> : <><Home className="h-3.5 w-3.5 shrink-0" aria-hidden />Propriétaire de</>}
                <Link href={`/explorer/${thread.propertyId}`} className="truncate font-medium text-foreground/85 underline-offset-2 hover:underline">{thread.propertyTitle}</Link>
              </p>
            </div>
            {thread.cover && (
              <Link href={`/explorer/${thread.propertyId}`} className="hidden shrink-0 sm:block" aria-label={`Voir le bien : ${thread.propertyTitle}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thread.cover} alt="" className="h-11 w-16 rounded-lg object-cover ring-1 ring-border" />
              </Link>
            )}
          </header>

          <div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6">
            <div aria-hidden className="v3-dots opacity-50" />
            {loading ? (
              <div className="relative space-y-3" role="status" aria-label="Chargement…">
                {[62, 44, 70].map((w, i) => (
                  <div key={w} className={cn("flex", i === 1 ? "justify-end" : "justify-start")}>
                    <span className="h-11 animate-pulse rounded-2xl bg-subtle" style={{ width: `${w}%` }} />
                  </div>
                ))}
                <p className="flex items-center gap-2 text-[13px] text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Chargement…</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="relative mx-auto max-w-sm py-8 text-center">
                <span className="v3-icon mx-auto h-11 w-11"><Sparkles className="h-5 w-5" aria-hidden /></span>
                <p className="mt-4 text-[14px] font-semibold">Aucun message</p>
                <p className="mt-1 text-[13px] text-muted-foreground">Lancez la conversation :</p>
                <div className="mt-4 flex flex-col gap-2">
                  {SUGGESTIONS[thread.role].map((sug) => (
                    <button key={sug} type="button" onClick={() => setDraft(sug)}
                      className="group flex min-h-11 items-center gap-2 rounded-xl border bg-card px-3.5 py-2 text-left text-[13px] transition-[border-color,transform] hover:-translate-y-px hover:border-leman/50">
                      <span className="flex-1">{sug}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-leman" aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ol className="relative space-y-1.5">
                {messages.map((m, i) => {
                  const prev = messages[i - 1];
                  const day = new Date(m.createdAt).toDateString();
                  const newDay = !prev || new Date(prev.createdAt).toDateString() !== day;
                  const grouped = !newDay && prev && prev.mine === m.mine;
                  return (
                    <li key={m.id}>
                      {newDay && (
                        <p className="my-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                          <span className="h-px flex-1 bg-border" aria-hidden />
                          {dayLabel(m.createdAt)}
                          <span className="h-px flex-1 bg-border" aria-hidden />
                        </p>
                      )}
                      <div className={cn("flex", m.mine ? "justify-end" : "justify-start", grouped ? "mt-0.5" : "mt-3")}>
                        <div className={cn("max-w-[82%] whitespace-pre-wrap break-words rounded-[1.15rem] px-3.5 py-2 text-[14px] leading-relaxed sm:max-w-[70%]",
                          m.mine
                            ? "rounded-br-md bg-gradient-to-b from-leman to-[color-mix(in_oklab,var(--leman)_85%,black)] text-white shadow-[0_8px_20px_-10px_var(--leman)] dark:text-[#0d1513]"
                            : "rounded-bl-md border bg-subtle")}>
                          {m.body}
                          <span className={cn("mt-0.5 flex items-center justify-end gap-1 text-[10.5px]", m.mine ? "text-white/75 dark:text-[#0d1513]/70" : "text-muted-foreground")}>
                            {time(m.createdAt)}
                            {m.mine && (m.readAt ? <><CheckCheck className="h-3 w-3" aria-hidden /> lu</> : <Check className="h-3 w-3" aria-hidden />)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t bg-[color-mix(in_oklab,var(--foreground)_1.5%,var(--card))] p-3 sm:px-5">
            {error && <p role="alert" className="mb-2 text-[12.5px] text-[var(--danger-text)]">{error}</p>}
            <div className="flex items-end gap-2 rounded-2xl border border-input bg-background p-1.5 pl-3 shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] transition-colors focus-within:border-leman focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--leman)_35%,transparent)]">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Votre message</span>
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={1} maxLength={2000}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Écrire un message…" data-focus-ring="none"
                  className="block max-h-40 min-h-[44px] w-full resize-none bg-transparent py-2.5 text-[14px] outline-none placeholder:text-muted-foreground" />
              </label>
              <button type="submit" disabled={isPending || !draft.trim()} aria-label="Envoyer"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leman text-white shadow-[0_8px_20px_-10px_var(--leman)] transition-transform active:scale-95 disabled:opacity-45 disabled:shadow-none dark:text-[#0d1513]">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              </button>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" aria-hidden />Ne partagez pas ici les coordonnées d&apos;un acheteur sans son accord.</p>
          </form>
        </section>
      ) : (
        <div className="relative hidden items-center justify-center p-8 text-center md:flex">
          <div aria-hidden className="v3-dots" />
          <div className="relative">
            <span className="v3-icon mx-auto h-12 w-12"><MessageSquare className="h-5 w-5" aria-hidden /></span>
            <p className="mt-4 text-[15px] font-semibold">Choisissez une conversation.</p>
            <p className="mt-1 text-[13px] text-muted-foreground">Une conversation par lien d&apos;apporteur.</p>
          </div>
        </div>
      )}
    </div>
  );
}

const dayLabel = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Aujourd'hui";
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" });
};

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

/* Avatar : initiales (aucune photo de profil inventée) ; vignette du bien en pastille. */
function Avatar({ name, cover, gold = false }: { name: string; cover?: string | null; gold?: boolean }) {
  return (
    <span className="relative shrink-0">
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-full text-[13.5px] font-semibold",
        gold ? "bg-laiton-soft text-laiton ring-1 ring-laiton-border" : "bg-leman-soft text-leman ring-1 ring-leman/30")}>
        {initials(name)}
      </span>
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="absolute -bottom-1 -right-1 h-5 w-5 rounded-md object-cover ring-2 ring-card" />
      )}
    </span>
  );
}
