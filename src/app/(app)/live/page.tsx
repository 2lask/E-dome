"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Bell, CalendarPlus, Radio, Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { CameraPreview } from "@/components/live/camera-preview";
import { REPLAYS } from "@/lib/replays";
import { useSearchParams } from "next/navigation";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { AffiliationToggle, type AffiliationValue } from "@/components/business/affiliation-toggle";
import { defaultAffiliationRate } from "@/lib/pricing";
import { groupThousands } from "@/lib/demo/session-views";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

/* Les prochains lives, animés par des personnes du casting, à des dates
   postérieures au « aujourd'hui » de la démonstration (30 septembre 2026).
   Un réseau qui se lance : des dizaines d'inscrits, pas des centaines. Les
   lives programmés pendant la visite (mémoire de session) s'ajoutent en tête. */
interface UpcomingLive {
  id: string;
  titre: string;
  speaker: string;
  speakerId?: string;
  role: string;
  date: string;
  inscrits: number;
  isNew?: boolean;
}

const UPCOMING_LIVES: UpcomingLive[] = [
  { id: "L1", titre: "Pricing dynamique : préparer l'hiver en courte durée", speaker: "Amina El Idrissi", speakerId: "user-016", role: "Créatrice de formations", date: "8 octobre 2026 à 18h00", inscrits: 24 },
  { id: "L2", titre: "Visite commentée : la maison vigneronne de Riex", speaker: "Céline Bovard", speakerId: "user-002", role: "Agente immobilière", date: "14 octobre 2026 à 12h30", inscrits: 17 },
  { id: "L3", titre: "Déclarer un bien loué dans un autre canton", speaker: "Sandrine Monnier", speakerId: "user-011", role: "Créatrice de formations", date: "21 octobre 2026 à 19h00", inscrits: 31 },
];

/* Les replays viennent de @/lib/replays : la fiche /live/replay/[id] lit le
   même tableau, et le lien porte l'identifiant plutôt que la position. */
const PAST_REPLAYS = REPLAYS;

const MOCK_CHAT = [
  { user: "Marc D.", message: "Très intéressant, merci pour ces chiffres !", time: "18:02" },
  { user: "Sophie M.", message: "Quelle est la meilleure région pour investir ?", time: "18:04" },
  { user: "Laura F.", message: "Les rendements à Lausanne sont encore bons ?", time: "18:05" },
  { user: "Jean P.", message: "Merci pour la présentation !", time: "18:07" },
  { user: "Nadia S.", message: "Est-ce que vous pouvez parler du Valais ?", time: "18:08" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

/* `useSearchParams` exige une frontière Suspense en App Router (Next 16). */
export default function LivePage() {
  return (
    <React.Suspense fallback={null}>
      <LivePageInner />
    </React.Suspense>
  );
}

function LivePageInner() {
  const { activeRole } = useApp();
  const focusId = useSearchParams().get("focus");
  const { lives: scheduled } = useSession();
  const upcoming = React.useMemo<UpcomingLive[]>(
    () => [
      ...scheduled.map((l) => ({
        id: l.id,
        titre: l.title,
        speaker: l.speaker,
        speakerId: l.speakerId,
        role: l.format === "masterclass" ? "Masterclass" : l.format === "qa" ? "Questions-réponses" : "Webinaire",
        date: l.dateLabel,
        inscrits: 0,
        isNew: true,
      })),
      ...UPCOMING_LIVES,
    ],
    [scheduled],
  );
  const [createError, setCreateError] = useState<string | null>(null);
  const [isLive] = useState(false);
  const [viewingReplay, setViewingReplay] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT);
  const [handRaised, setHandRaised] = useState(false);
  const [inscriptions, setInscriptions] = useState<Set<string>>(new Set());
  const [liveInscrits, setLiveInscrits] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    UPCOMING_LIVES.forEach((l) => { map[l.id] = l.inscrits; });
    return map;
  });

  // Create modal state
  const [affiliation, setAffiliation] = useState<AffiliationValue>({ open: false, rate: defaultAffiliationRate("live") });
  const [newLive, setNewLive] = useState({ titre: "", type: "webinaire", date: "", duree: "60", description: "", prix: "0" });

  const [toastVisible, setToastVisible] = useState(false);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  // Button visible to all users in demo mode
  const canCreateLive = true;

  const handleInscription = (liveId: string) => {
    setInscriptions((prev) => {
      const next = new Set(prev);
      if (next.has(liveId)) {
        next.delete(liveId);
        setLiveInscrits((p) => ({ ...p, [liveId]: (p[liveId] ?? 0) - 1 }));
      } else {
        next.add(liveId);
        setLiveInscrits((p) => ({ ...p, [liveId]: (p[liveId] ?? 0) + 1 }));
      }
      return next;
    });
  };

  // Parse French date format helper
  const parseFrDate = (d: string) => {
    const months: Record<string, number> = { janvier: 0, "février": 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, "août": 7, septembre: 8, octobre: 9, novembre: 10, "décembre": 11 };
    const m = d.match(/(\d+)\s+(\w+)\s+(\d{4})(?:\s+à\s+(\d{2})h(\d{2}))?/);
    if (!m) return new Date(0);
    return new Date(+m[3], months[m[2].toLowerCase()] ?? 0, +m[1], +(m[4] ?? 0), +(m[5] ?? 0));
  };

  // Live countdown with real-time ticking
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; title: string } | null>(null);

  useEffect(() => {
    if (isLive) return;
    const tick = () => {
      const now = new Date();
      const upcoming = UPCOMING_LIVES
        .map((l) => ({ ...l, dateObj: parseFrDate(l.date) }))
        .filter((l) => l.dateObj > now)
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
      if (upcoming.length === 0) { setCountdown(null); return; }
      const diff = upcoming[0].dateObj.getTime() - now.getTime();
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        title: upcoming[0].titre,
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [...prev, { user: "Vous", message: chatMessage, time: new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" }) }]);
    setChatMessage("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://edome.world/live/current");
    alert("Lien copié dans le presse-papiers !");
  };

  const replayItem = viewingReplay ? PAST_REPLAYS.find((r) => r.id === viewingReplay) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-1.5 px-5 py-3 rounded-xl toast-success text-sm font-medium shadow-lg animate-fade-in">
          <Check size={14} strokeWidth={2.5} /> Live programmé : il figure dans « Prochains lives ».
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl page-heading text-[var(--foreground)]">Live</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowCameraPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              border: "1px solid var(--card-border)",
              background: "var(--card)",
              color: "var(--foreground)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
            title="Allume votre caméra pour un aperçu local — aucune diffusion"
          >
            <Video size={16} />
            Tester ma caméra
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
          >
            <Radio size={16} /> Programmer un live
          </button>
        </div>
      </div>

      <CameraPreview open={showCameraPreview} onClose={() => setShowCameraPreview(false)} />

      {/* Live Viewer (when live) */}
      {isLive ? (
        <section className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Video area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold animate-pulse">LIVE</span>
                <span className="px-2 py-1 rounded bg-black/50 text-white text-xs">247 spectateurs</span>
              </div>
              <p className="text-white/50 text-lg">Vidéo en direct</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Pricing dynamique : préparer l&apos;hiver en courte durée</h2>
                <p className="text-sm text-[var(--text-secondary)]">Par Amina El Idrissi — Créatrice de formations</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setHandRaised(!handRaised)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    handRaised ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)]"
                  }`}
                >
                  {handRaised ? "Main levée" : "Lever la main"}
                </button>
                <button
                  onClick={handleShare}
                  className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--hover-bg)] transition"
                >
                  Partager
                </button>
              </div>
            </div>
          </div>

          {/* Chat sidebar */}
          <div className="flex flex-col rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)]">
              <h3 className="font-semibold text-[var(--foreground)]">Chat en direct</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 lg:max-h-[400px]">
              {chatMessages.map((msg, idx) => (
                <div key={idx}>
                  <span className="text-xs text-[var(--primary)] font-medium">{msg.user}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2">{msg.time}</span>
                  <p className="text-sm text-[var(--foreground)]">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-[var(--card-border)] flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="Votre message..."
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] text-sm placeholder:text-[var(--text-muted)] outline-none"
              />
              <button
                onClick={handleSendChat}
                className="px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                Envoyer
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Empty state when no live + Countdown Banner */
        <section className="space-y-6">
          {/* Countdown Banner */}
          {countdown && (
            <div
              className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
              style={{ background: "linear-gradient(135deg, var(--primary) 0%, #5ec1ff 50%, var(--primary) 100%)" }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

              <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-2">Prochain Live E-Dome</p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{countdown.title}</h2>
              <p className="text-white/70 text-sm mb-6">Les lives de la communauté E-Dome</p>

              {/* Countdown numbers */}
              <div className="flex items-center justify-center gap-3 md:gap-6 mb-8">
                {[
                  { value: countdown.days, label: "Jours" },
                  { value: countdown.hours, label: "Heures" },
                  { value: countdown.minutes, label: "Minutes" },
                  { value: countdown.seconds, label: "Secondes" },
                ].map((unit, i) => (
                  <React.Fragment key={unit.label}>
                    {i > 0 && <span className="text-white/60 text-2xl md:text-3xl font-light -mt-4">:</span>}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                        <span className="text-2xl md:text-4xl font-bold text-white tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {String(unit.value).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-white/70 text-xs mt-1.5 font-medium">{unit.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const firstLive = upcoming[0];
                    if (firstLive && !inscriptions.has(firstLive.id)) handleInscription(firstLive.id);
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-[var(--primary)] font-semibold text-sm hover:bg-white/90 transition shadow-lg flex items-center gap-2"
                >
                  <Bell size={16} /> S&apos;inscrire
                </button>
                <button
                  onClick={() => {
                    const calDate = "20260405T180000";
                    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Live E-Dome: " + (countdown?.title || ""))}&dates=${calDate}/${calDate}`;
                    window.open(url, "_blank");
                  }}
                  className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/30 transition border border-white/30 flex items-center gap-2"
                >
                  <CalendarPlus size={16} /> Ajouter au calendrier
                </button>
              </div>
            </div>
          )}

          {/* Standard empty state */}
          <div className="text-center py-10 space-y-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--hover-bg)] text-[var(--text-muted)] flex items-center justify-center">
              <Radio size={28} strokeWidth={1.8} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Aucun live en cours</h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto text-sm">
              Il n&apos;y a pas de diffusion en direct pour le moment. Consultez les prochains lives programm&eacute;s ou regardez les replays.
            </p>
          </div>
        </section>
      )}

      {/* Upcoming Lives */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Prochains lives</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map((live) => (
            <div
              key={live.id}
              className={`p-5 rounded-xl bg-[var(--card)] border space-y-3 hover:border-[var(--primary)]/40 transition ${
                focusId === live.id ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30" : "border-[var(--card-border)]"
              }`}
            >
              <h3 className="font-medium text-[var(--foreground)]">
                {live.titre}
                {live.isNew && (
                  <span className="ml-2 align-middle inline-block px-2 py-0.5 bg-emerald-500/15 text-emerald-500 rounded-full text-[11px] font-medium">Nouveau</span>
                )}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {live.speakerId ? (
                  <Link href={`/profil/${live.speakerId}`} className="hover:underline">{live.speaker}</Link>
                ) : (
                  live.speaker
                )}{" "}
                — {live.role}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">{live.date}</span>
                <span className="text-[var(--primary)] font-medium">{liveInscrits[live.id] ?? live.inscrits} inscrits</span>
              </div>
              {inscriptions.has(live.id) ? (
                <button
                  onClick={() => handleInscription(live.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition"
                >
                  <Check size={14} strokeWidth={2.5} /> Inscrit
                </button>
              ) : (
                <button
                  onClick={() => handleInscription(live.id)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/10 transition"
                >
                  S&apos;inscrire
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Replay viewer */}
      {replayItem && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Replay: {replayItem.titre}</h2>
            <button
              onClick={() => setViewingReplay(null)}
              className="px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition"
            >
              Fermer
            </button>
          </div>
          <div className="rounded-xl overflow-hidden bg-gray-900">
            <iframe
              className="w-full aspect-video rounded-xl"
              src={`https://www.youtube.com/embed/${replayItem.youtubeId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Par {replayItem.speaker} — {replayItem.date} — {groupThousands(replayItem.vues)} vues
          </p>
        </section>
      )}

      {/* Replays Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Replays</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAST_REPLAYS.map((replay) => (
            <Link
              key={replay.id}
              href={`/live/replay/${replay.id}`}
              className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden hover:border-[var(--primary)]/40 transition cursor-pointer block"
            >
              <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                <div className="text-3xl text-white/40">▶</div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs">{replay.duree}</span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-medium text-[var(--foreground)] text-sm">{replay.titre}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{replay.speaker}</p>
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>{replay.date}</span>
                  <span>{groupThousands(replay.vues)} vues</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Create Live Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)]" onClick={() => setShowCreateModal(false)}>
          <div
            className="w-full max-w-lg mx-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-[var(--foreground)]">
              <Radio size={20} /> Programmer un live
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Titre</label>
                <input
                  type="text"
                  value={newLive.titre}
                  onChange={(e) => setNewLive({ ...newLive, titre: e.target.value })}
                  placeholder="Titre du live..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-[var(--text-secondary)]">Date / Heure</label>
                  <input
                    type="datetime-local"
                    value={newLive.date}
                    onChange={(e) => setNewLive({ ...newLive, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-[var(--text-secondary)]">Durée (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newLive.duree}
                    onChange={(e) => setNewLive({ ...newLive, duree: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Description</label>
                <textarea
                  value={newLive.description}
                  onChange={(e) => setNewLive({ ...newLive, description: e.target.value })}
                  placeholder="Décrivez votre live..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Prix (CHF) — 0 = Gratuit</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={newLive.prix}
                  onChange={(e) => setNewLive({ ...newLive, prix: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
                />
                {newLive.prix === "0" && (
                  <p className="text-xs text-green-500 mt-1">Gratuit</p>
                )}
              </div>
              <AffiliationToggle pole="live" priceChf={Math.max(0, Number(newLive.prix) || 0)} value={affiliation} onChange={setAffiliation} priceLabel="par participant" />
            </div>
            {createError && (
              <p role="alert" className="text-sm text-red-400">{createError}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--hover-bg)] transition"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  /* Le live entre au journal de session : il apparaît dans
                     « Prochains lives », et une notification le confirme. */
                  if (newLive.titre.trim().length < 5 || !newLive.date) {
                    setCreateError("Indiquez un titre (cinq caractères au moins) et une date.");
                    return;
                  }
                  recordSessionEvent({
                    kind: "live.scheduled",
                    data: {
                      title: newLive.titre.trim(),
                      format: newLive.type,
                      date: newLive.date.slice(0, 10),
                      durationMin: Math.max(15, Math.round(Number(newLive.duree) || 60)),
                      description: newLive.description.trim(),
                      price: Math.max(0, Math.round(Number(newLive.prix) || 0)),
                      affiliationRate: affiliation.open && Number(newLive.prix) > 0 ? affiliation.rate : undefined,
                    },
                  });
                  setCreateError(null);
                  setNewLive({ titre: "", type: "webinaire", date: "", duree: "60", description: "", prix: "0" });
                  setShowCreateModal(false);
                  setToastVisible(true);
                  setTimeout(() => setToastVisible(false), 3000);
                }}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
