"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, Loader2, Wrench } from "lucide-react";

/* ─── Assistant « Expert E-Dome » (drawer global) ─────────────────────────
   UI client de la Couche 1. Envoie l'historique à /api/ai/chat (qui applique
   quotas + LLM + outils côté serveur). S'ouvre partout via le bouton flottant
   ou l'événement window `edome:ai-open` (détail: { prompt }) — utilisé par les
   accroches contextuelles (ex: « Analyser ce bien » sur la fiche). */

interface Msg {
  role: "user" | "assistant";
  content: string;
  tools?: string[];
}

const SUGGESTIONS = [
  "Estime un 3 pièces de 90 m² à Lausanne",
  "Quel est le meilleur rendement du catalogue ?",
  "Calcule le rendement d'un bien à 500 000 CHF loué 1 800 CHF/mois",
  "Compare investir à Genève ou à Marrakech",
];

function useSessionId(): string {
  const [id, setId] = useState("");
  useEffect(() => {
    try {
      let sid = localStorage.getItem("edome_ai_sid");
      if (!sid) {
        sid = `sid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("edome_ai_sid", sid);
      }
      setId(sid);
    } catch {
      setId("anon");
    }
  }, []);
  return id;
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useSessionId();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentPropertyId = pathname?.startsWith("/explorer/")
    ? pathname.split("/")[2] || undefined
    : undefined;

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const nextMessages: Msg[] = [...messages, { role: "user", content: trimmed }];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
            sessionId: sessionId || "anon",
            context: { currentPropertyId, route: pathname },
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessages((m) => [
            ...m,
            { role: "assistant", content: data.message || "Une erreur est survenue. Réessayez." },
          ]);
        } else {
          setMessages((m) => [
            ...m,
            { role: "assistant", content: data.text, tools: (data.toolTrace ?? []).map((t: { name: string }) => t.name) },
          ]);
        }
      } catch {
        setMessages((m) => [...m, { role: "assistant", content: "Connexion à l'assistant impossible. Réessayez." }]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, sessionId, currentPropertyId, pathname],
  );

  // Ouverture + envoi via événement global (accroches contextuelles).
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ prompt?: string }>).detail;
      setOpen(true);
      if (detail?.prompt) setTimeout(() => send(detail.prompt!), 50);
    };
    window.addEventListener("edome:ai-open", handler as EventListener);
    return () => window.removeEventListener("edome:ai-open", handler as EventListener);
  }, [send]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      {/* Bouton flottant */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir l'assistant IA"
          className="fixed bottom-24 md:bottom-8 right-5 z-40 inline-flex items-center gap-2 h-12 px-4 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xl hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Expert&nbsp;IA</span>
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Assistant Expert E-Dome">
          <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full sm:w-[420px] h-full bg-[var(--card)] border-l border-[var(--card-border)] flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/12 text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">Expert E-Dome</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Immobilier · estimation · rentabilité</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-bg)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-3">
                    <p className="text-sm text-[var(--foreground)]">
                      Bonjour 👋 Je suis votre expert immobilier E-Dome. Je m'appuie sur les données réelles du catalogue pour <b>estimer</b>, <b>calculer une rentabilité</b> ou <b>analyser un investissement</b>.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Essayez</p>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full text-left text-sm px-3 py-2 rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40 hover:text-[var(--foreground)] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                      m.role === "user"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)]"
                    }`}
                  >
                    {m.content}
                    {m.tools && m.tools.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[var(--card-border)] flex flex-wrap gap-1">
                        {m.tools.map((t, j) => (
                          <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-3.5 py-2.5 bg-[var(--background)] border border-[var(--card-border)] text-[var(--text-muted)] inline-flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> L'expert réfléchit…
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-[var(--card-border)] p-3 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-end gap-2"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  placeholder="Posez votre question immobilière…"
                  rows={1}
                  className="flex-1 resize-none max-h-32 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Envoyer"
                  className="w-10 h-10 shrink-0 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="mt-2 text-[10px] text-[var(--text-muted)] inline-flex items-center gap-1">
                <Wrench className="w-3 h-3" /> Estimations pédagogiques à vérifier — pas un conseil financier.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
