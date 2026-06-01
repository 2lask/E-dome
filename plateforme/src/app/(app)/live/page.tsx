"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Bell, CalendarPlus, Radio, Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { CameraPreview } from "@/components/live/camera-preview";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const UPCOMING_LIVES = [
  { id: "L1", titre: "Investir dans l'immobilier suisse en 2026", speaker: "Marc Bonnard", role: "Formateur", date: "5 avril 2026 à 18h00", inscrits: 124 },
  { id: "L2", titre: "Visite virtuelle : Villa Montreux", speaker: "Sophie Meier", role: "Agence", date: "8 avril 2026 à 14h00", inscrits: 87 },
  { id: "L3", titre: "Optimiser son annonce immobilière", speaker: "Laura Fischer", role: "Hôte", date: "12 avril 2026 à 10h00", inscrits: 56 },
];

const PAST_REPLAYS = [
  { id: "R1", titre: "Les tendances du marché Q1 2026", speaker: "Jean-Pierre Dumont", date: "20 mars 2026", vues: 1240, duree: "1h12", youtubeId: "FqjDgXlE2nQ" },
  { id: "R2", titre: "Comment fixer le bon prix de location", speaker: "Nadia Silva", date: "15 mars 2026", vues: 890, duree: "45min", youtubeId: "E0dyHPjiJDo" },
  { id: "R3", titre: "Fiscalité immobilière en Suisse", speaker: "Patrick Leroy", date: "10 mars 2026", vues: 2100, duree: "1h30", youtubeId: "_DtWLPqqnwU" },
  { id: "R4", titre: "Home staging : avant/après", speaker: "Amina Koné", date: "5 mars 2026", vues: 670, duree: "38min", youtubeId: "p5Kk_HBASHg" },
  { id: "R5", titre: "Droit du bail : vos obligations", speaker: "Thomas Roth", date: "28 février 2026", vues: 1560, duree: "55min", youtubeId: "NBjn9FkvpCQ" },
  { id: "R6", titre: "Photographie immobilière pro", speaker: "Amina Koné", date: "20 février 2026", vues: 780, duree: "42min", youtubeId: "FqjDgXlE2nQ" },
];

const MOCK_CHAT = [
  { user: "Marc D.", message: "Très intéressant, merci pour ces chiffres !", time: "18:02" },
  { user: "Sophie M.", message: "Quelle est la meilleure région pour investir ?", time: "18:04" },
  { user: "Laura F.", message: "Les rendements à Lausanne sont encore bons ?", time: "18:05" },
  { user: "Jean P.", message: "Merci pour la présentation !", time: "18:07" },
  { user: "Nadia S.", message: "Est-ce que vous pouvez parler du Valais ?", time: "18:08" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function LivePage() {
  const { activeRole } = useApp();
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
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-1.5 px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-medium shadow-lg animate-fade-in">
          <Check size={14} strokeWidth={2.5} /> Live programmé ! (démonstration)
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e9df1] text-white text-sm font-medium hover:opacity-90 transition"
          >
            <Radio size={16} /> Programmer un live
          </button>
        </div>
      </div>

      <CameraPreview open={showCameraPreview} onClose={() => setShowCameraPreview(false)} />

      {/* Live Viewer (when live) */}
      {isLive ? (
        <section className="grid lg:grid-cols-3 gap-6">
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
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Investir dans l&apos;immobilier suisse en 2026</h2>
                <p className="text-sm text-[var(--text-secondary)]">Par Marc Bonnard — Formateur</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setHandRaised(!handRaised)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    handRaised ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)]"
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
                  <span className="text-xs text-[#1e9df1] font-medium">{msg.user}</span>
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
                className="px-3 py-2 rounded-lg bg-[#1e9df1] text-white text-sm font-medium hover:opacity-90 transition"
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
              style={{ background: "linear-gradient(135deg, #1e9df1 0%, #5ec1ff 50%, #1e9df1 100%)" }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

              <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-2">Prochain Live E-Dome</p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{countdown.title}</h2>
              <p className="text-white/70 text-sm mb-6">Investir dans l&apos;immobilier suisse en 2026</p>

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
                    const firstLive = UPCOMING_LIVES[0];
                    if (firstLive && !inscriptions.has(firstLive.id)) handleInscription(firstLive.id);
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-[#1e9df1] font-semibold text-sm hover:bg-white/90 transition shadow-lg flex items-center gap-2"
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
          {UPCOMING_LIVES.map((live) => (
            <div key={live.id} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-3 hover:border-[#1e9df1]/40 transition">
              <h3 className="font-medium text-[var(--foreground)]">{live.titre}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{live.speaker} — {live.role}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">{live.date}</span>
                <span className="text-[#1e9df1] font-medium">{liveInscrits[live.id] ?? live.inscrits} inscrits</span>
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
                  className="w-full px-4 py-2 rounded-lg border border-[#1e9df1] text-[#1e9df1] text-sm font-medium hover:bg-[#1e9df1]/10 transition"
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
            Par {replayItem.speaker} — {replayItem.date} — {replayItem.vues.toLocaleString("fr-CH")} vues
          </p>
        </section>
      )}

      {/* Replays Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Replays</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAST_REPLAYS.map((replay, idx) => (
            <Link
              key={replay.id}
              href={`/live/replay/${idx + 1}`}
              className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden hover:border-[#1e9df1]/40 transition cursor-pointer block"
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
                  <span>{replay.vues.toLocaleString("fr-CH")} vues</span>
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
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#1e9df1] transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-[var(--text-secondary)]">Date / Heure</label>
                  <input
                    type="datetime-local"
                    value={newLive.date}
                    onChange={(e) => setNewLive({ ...newLive, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[#1e9df1] transition"
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
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[#1e9df1] transition"
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
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#1e9df1] transition resize-none"
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
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[#1e9df1] transition"
                />
                {newLive.prix === "0" && (
                  <p className="text-xs text-green-500 mt-1">Gratuit</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--hover-bg)] transition"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setToastVisible(true);
                  setTimeout(() => setToastVisible(false), 3000);
                }}
                className="px-4 py-2 rounded-lg bg-[#1e9df1] text-white text-sm font-medium hover:opacity-90 transition"
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
