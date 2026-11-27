"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, Loader2, Wrench, ArrowUpRight } from "lucide-react";

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

/* Ce que le Copilote sait vraiment faire (outils de src/lib/ai/tools.ts). */
const SUGGESTIONS = [
  "Quels biens avec commission sont en ligne ?",
  "Puis-je acheter un bien à 900'000 CHF avec 200'000 CHF de fonds propres et 150'000 CHF de revenu ?",
  "Comment se portent mes annonces ce mois-ci ?",
  "Calcule le rendement d'un bien à 500'000 CHF loué 1'800 CHF par mois",
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

/* `hideTrigger` : la coquille de la nouvelle génération (REBUILD.md) ouvre le
   copilote par le menu ⌘K, le menu du compte et des boutons en contexte — le
   bouton flottant, qui chevauchait le contenu, n'est plus affiché. */
export function AiAssistant({ hideTrigger = false }: { hideTrigger?: boolean } = {}) {
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
      {!open && !hideTrigger && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir l'assistant IA"
          data-tour="ai-assistant"
          className="fixed bottom-24 right-5 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-4 text-[var(--primary-foreground)] shadow-xl transition-transform hover:-translate-y-0.5 md:bottom-8"
        >
          <Sparkles className="h-5 w-5" aria-hidden />
          <span className="hidden text-sm font-medium sm:inline">Expert&nbsp;IA</span>
        </button>
      )}

      {/* Tiroir */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Assistant Expert E-Dome">
          <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-full w-full animate-slide-in-right flex-col overflow-hidden border-l border-[var(--card-border)] bg-[var(--card)] shadow-[-30px_0_80px_-30px_rgb(0_0_0/0.6)] sm:w-[440px]">
            {/* En-tête : panneau sombre, comme les en-têtes membres */}
            <div className="cine v3-grain relative shrink-0 overflow-hidden px-4 pb-4 pt-4">
              <div aria-hidden className="cine-aurora opacity-70" />
              <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c]/50 to-transparent" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[rgb(227_184_92/0.4)] bg-[rgb(227_184_92/0.14)] text-[#f2c66b] shadow-[0_0_24px_-4px_rgb(227_184_92/0.6)]">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-tight text-white">Expert E-Dome</p>
                    <p className="mt-0.5 text-[12px] text-white/60">Annonces · financement · vos chiffres</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Fermer" className="flex h-11 w-11 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b85c]">
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="relative flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.length === 0 && (
                <div className="space-y-5">
                  <div className="flex items-start gap-2.5">
                    <BotMark />
                    <div className="rounded-2xl rounded-tl-md border border-[var(--card-border)] bg-[var(--background)] px-3.5 py-3">
                      <p className="text-[14px] leading-relaxed text-[var(--foreground)]">
                        Bonjour, je suis le Copilote d&apos;E-Dome. Je m&apos;appuie sur les annonces réelles et sur vos propres chiffres pour <b>trouver un bien</b>, <b>vérifier un financement</b>, <b>calculer un rendement</b> ou <b>faire le point sur vos annonces</b>.
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Essayez</p>
                    <div className="grid gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="group flex min-h-11 w-full items-center gap-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-left text-[13.5px] text-[var(--text-secondary)] transition-[border-color,transform,color] hover:-translate-y-px hover:border-[var(--leman)] hover:text-[var(--foreground)]"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--leman-soft)] text-[var(--leman)]">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          <span className="flex-1">{s}</span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex items-start gap-2.5"}>
                  {m.role === "assistant" && <BotMark />}
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-gradient-to-b from-[var(--leman)] to-[color-mix(in_oklab,var(--leman)_85%,black)] text-white shadow-[0_8px_20px_-10px_var(--leman)] dark:text-[#0d1513]"
                        : "rounded-tl-md border border-[var(--card-border)] bg-[var(--background)] text-[var(--foreground)]"
                    }`}
                  >
                    {m.content}
                    {m.tools && m.tools.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1 border-t border-[var(--card-border)] pt-2">
                        {m.tools.map((t, j) => (
                          <span key={j} className="inline-flex items-center gap-1 rounded-full border border-[var(--laiton-border)] bg-[var(--laiton-soft)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--laiton)]">
                            <Wrench className="h-2.5 w-2.5" aria-hidden />{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2.5" role="status">
                  <BotMark />
                  <div className="inline-flex items-center gap-2.5 rounded-2xl rounded-tl-md border border-[var(--card-border)] bg-[var(--background)] px-3.5 py-3 text-[13px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1" aria-hidden>
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 rounded-full bg-[var(--leman)] motion-safe:animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </span>
                    L&apos;expert réfléchit…
                  </div>
                </div>
              )}
            </div>

            {/* Saisie */}
            <div className="shrink-0 border-t border-[var(--card-border)] p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-end gap-2 rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] p-1.5 pl-3 transition-colors focus-within:border-[var(--leman)] focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--leman)_35%,transparent)]"
              >
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Votre question</span>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                    placeholder="Posez votre question immobilière…"
                    rows={1}
                    data-focus-ring="none"
                    className="block max-h-32 min-h-[44px] w-full resize-none bg-transparent py-2.5 text-[14px] text-[var(--foreground)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Envoyer"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--leman)] text-white shadow-[0_8px_20px_-10px_var(--leman)] transition-transform active:scale-95 disabled:opacity-40 disabled:shadow-none dark:text-[#0d1513]"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                </button>
              </form>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                <Wrench className="h-3 w-3" aria-hidden /> Calculs indicatifs, à vérifier : ce n'est pas un conseil financier.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Pastille de l'assistant devant ses réponses. */
function BotMark() {
  return (
    <span aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--laiton-border)] bg-[var(--laiton-soft)] text-[var(--laiton)]">
      <Sparkles className="h-3.5 w-3.5" />
    </span>
  );
}
