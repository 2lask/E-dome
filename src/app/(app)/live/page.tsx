"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Video, Bell, CalendarPlus, Radio, Check, Mic } from "lucide-react";
import { useApp } from "@/lib/context";
import { CameraPreview } from "@/components/live/camera-preview";
import { MoneyFlow } from "@/components/pricing/money-flow";
import { useToast } from "@/components/ui/toast";
import { REPLAYS } from "@/lib/replays";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { useActor } from "@/lib/use-actor";
import { AffiliationToggle, type AffiliationValue } from "@/components/business/affiliation-toggle";
import { defaultAffiliationRate } from "@/lib/pricing";
import { groupThousands } from "@/lib/demo/session-views";
import { UPCOMING_LIVES, nextLive, timeUntil, type UpcomingLive } from "@/lib/data/lives";
import { eventDateLabel } from "@/lib/data/events";
import { agendaIds, canHost, registeredIds, registrationCharge, sessionRegistrationCount } from "@/lib/demo/agenda";

/* ── /live — les lives de la communauté (chantier P6c) ───────────────────────

   Ce que la page supposait : un « rôle actif » global (`activeRole`) qui ne
   servait à rien, un bouton « Programmer » visible de tous, un compte à
   rebours sur l'heure RÉELLE et un lien Google Agenda externe.

   Ce qu'elle fait : elle suit la personne INCARNÉE (`useSession().actorId`).
   - L'animateur d'un live (une personne de l'annuaire) voit « Vous animez »
     et ouvre son studio (aperçu caméra local), il ne s'inscrit pas à son
     propre live.
   - Les autres s'inscrivent : un événement de session `event.registered`,
     une notification chez l'animateur, et pour un live payant le flux
     d'argent de `quote()` avant de confirmer.
   - « Ajouter à mon agenda » laisse une trace dans l'application
     (`agenda.added`) et un toast — aucun lien externe.
   - Seules les personnes qui créent, accueillent, vendent une prestation ou
     représentent une agence programment un live (`canHost`). */

/* `useSearchParams` exige une frontière Suspense en App Router (Next 16). */
export default function LivePage() {
  return (
    <React.Suspense fallback={null}>
      <LivePageInner />
    </React.Suspense>
  );
}

const FORMAT_LABEL: Record<string, string> = { masterclass: "Masterclass", qa: "Questions-réponses", webinaire: "Webinaire" };

function LivePageInner() {
  const { formatPrice } = useApp();
  const { addToast } = useToast();
  const focusId = useSearchParams().get("focus");
  const { state, actorId, lives: scheduled } = useSession();
  const actor = useActor();
  const mayHost = canHost(actor.roles);

  /* Les lives programmés pendant la visite passent en tête ; leur animateur
     est la personne qui les a programmés. */
  const upcoming = useMemo<UpcomingLive[]>(
    () => [
      ...scheduled.map((l) => ({
        id: l.id,
        titre: l.title,
        organizerId: l.speakerId,
        startsAt: l.date,
        durationMin: l.durationMin,
        price: l.price,
        inscrits: 0,
        speaker: l.speaker,
        role: FORMAT_LABEL[l.format] ?? "Webinaire",
        date: l.date,
        dateLabel: eventDateLabel(l.date),
        isNew: true,
      })),
      ...UPCOMING_LIVES,
    ],
    [scheduled],
  );

  const registered = useMemo(() => registeredIds(state, actorId), [state, actorId]);
  const agenda = useMemo(() => agendaIds(state, actorId), [state, actorId]);
  const inscritsOf = (l: UpcomingLive) => l.inscrits + sessionRegistrationCount(state, l.id);

  const next = nextLive(UPCOMING_LIVES);
  const until = next ? timeUntil(next.startsAt) : null;

  const [confirmLive, setConfirmLive] = useState<UpcomingLive | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [affiliation, setAffiliation] = useState<AffiliationValue>({ open: false, rate: defaultAffiliationRate("live") });
  const [newLive, setNewLive] = useState({ titre: "", type: "webinaire", date: "", duree: "60", description: "", prix: "0" });

  const register = (l: UpcomingLive) => {
    recordSessionEvent({
      kind: "event.registered",
      data: { eventId: l.id, target: "live", title: l.titre, organizerId: l.organizerId, date: l.date, priceChf: l.price },
    });
    setConfirmLive(null);
    addToast(`Inscription confirmée : ${l.titre}. ${l.speaker} est prévenu·e.`, "success");
  };

  const unregister = (l: UpcomingLive) => {
    recordSessionEvent({ kind: "event.unregistered", data: { eventId: l.id, target: "live", title: l.titre, organizerId: l.organizerId } });
    addToast("Inscription annulée.", "info");
  };

  const askRegister = (l: UpcomingLive) => {
    if (l.price > 0) setConfirmLive(l);
    else register(l);
  };

  const addToAgenda = (l: UpcomingLive) => {
    if (!agenda.has(l.id)) {
      recordSessionEvent({ kind: "agenda.added", data: { eventId: l.id, target: "live", title: l.titre, organizerId: l.organizerId, date: l.date } });
    }
    addToast(`Ajouté à votre agenda : ${l.dateLabel}.`, "success");
  };

  const confirmCharge = confirmLive ? registrationCharge("live", confirmLive.price) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl page-heading text-[var(--foreground)]">Live</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowCameraPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
            title="Allume votre caméra pour un aperçu local — aucune diffusion"
          >
            <Video size={16} />
            Tester ma caméra
          </button>
          {mayHost && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
            >
              <Radio size={16} /> Programmer un live
            </button>
          )}
        </div>
      </div>

      <CameraPreview open={showCameraPreview} onClose={() => setShowCameraPreview(false)} />

      {/* Prochain live — temps restant figé sur l'horloge de la démonstration */}
      {next && until && (
        <section
          className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
          style={{ background: "linear-gradient(135deg, var(--primary) 0%, #5ec1ff 50%, var(--primary) 100%)" }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

          <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-2">Prochain live</p>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{next.titre}</h2>
          <p className="text-white/80 text-sm mb-6">
            {next.organizerId === actorId ? "Animé par vous" : `Par ${next.speaker}`} · {next.dateLabel}
          </p>

          <div className="flex items-center justify-center gap-3 md:gap-6 mb-8">
            {[
              { value: until.days, label: "Jours" },
              { value: until.hours, label: "Heures" },
            ].map((unit, i) => (
              <React.Fragment key={unit.label}>
                {i > 0 && <span className="text-white/60 text-2xl md:text-3xl font-light -mt-4">:</span>}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                    <span className="text-2xl md:text-4xl font-bold text-white tabular-nums">{String(unit.value).padStart(2, "0")}</span>
                  </div>
                  <span className="text-white/70 text-xs mt-1.5 font-medium">{unit.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {next.organizerId === actorId ? (
              <button
                onClick={() => setShowCameraPreview(true)}
                className="px-6 py-3 rounded-xl bg-white text-[var(--primary)] font-semibold text-sm hover:bg-white/90 transition shadow-lg flex items-center gap-2"
              >
                <Mic size={16} /> Ouvrir mon studio
              </button>
            ) : registered.has(next.id) ? (
              <span className="px-6 py-3 rounded-xl bg-white/90 text-emerald-700 font-semibold text-sm flex items-center gap-2">
                <Check size={16} /> Inscrit·e
              </span>
            ) : (
              <button
                onClick={() => askRegister(next)}
                className="px-6 py-3 rounded-xl bg-white text-[var(--primary)] font-semibold text-sm hover:bg-white/90 transition shadow-lg flex items-center gap-2"
              >
                <Bell size={16} /> S&apos;inscrire{next.price > 0 ? ` · ${formatPrice(next.price)}` : ""}
              </button>
            )}
            <button
              onClick={() => addToAgenda(next)}
              className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/30 transition border border-white/30 flex items-center gap-2"
            >
              <CalendarPlus size={16} /> {agenda.has(next.id) ? "Dans mon agenda" : "Ajouter à mon agenda"}
            </button>
          </div>
        </section>
      )}

      {/* Prochains lives */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Prochains lives</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map((live) => {
            const isHost = live.organizerId === actorId;
            const isIn = registered.has(live.id);
            return (
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
                  <Link href={`/profil/${live.organizerId}`} className="hover:underline">{live.speaker}</Link>
                  {live.role ? ` — ${live.role}` : ""}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">{live.dateLabel}</span>
                  <span className="text-[var(--primary)] font-medium">{inscritsOf(live)} inscrits</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{live.price > 0 ? `${formatPrice(live.price)} par participant` : "Gratuit"} · {live.durationMin} min</p>
                {isHost ? (
                  <div className="flex gap-2">
                    <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium">
                      <Mic size={14} /> Vous animez
                    </span>
                    <button
                      onClick={() => setShowCameraPreview(true)}
                      className="px-3 py-2 rounded-lg border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition"
                    >
                      Studio
                    </button>
                  </div>
                ) : isIn ? (
                  <button
                    onClick={() => unregister(live)}
                    title="Annuler mon inscription"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/20 text-green-500 text-sm font-medium hover:bg-green-500/30 transition"
                  >
                    <Check size={14} strokeWidth={2.5} /> Inscrit·e
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => askRegister(live)}
                      className="flex-1 px-4 py-2 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/10 transition"
                    >
                      S&apos;inscrire
                    </button>
                    <button
                      onClick={() => addToAgenda(live)}
                      aria-label="Ajouter à mon agenda"
                      title="Ajouter à mon agenda"
                      className="px-3 py-2 rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition"
                    >
                      <CalendarPlus size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Replays */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Replays</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPLAYS.map((replay) => (
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

      {/* Confirmation d'un live payant : le flux d'argent avant de payer */}
      {confirmLive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] p-4" onClick={() => setConfirmLive(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmer l'inscription"
            className="w-full max-w-md p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Confirmer l&apos;inscription</h2>
            <div className="text-sm text-[var(--text-secondary)] space-y-1">
              <p className="font-medium text-[var(--foreground)]">{confirmLive.titre}</p>
              <p>Par {confirmLive.speaker} · {confirmLive.dateLabel}</p>
              <p>Prix : {formatPrice(confirmLive.price)} (paiement simulé)</p>
            </div>
            {confirmCharge && (
              <MoneyFlow charge={confirmCharge} grossLabel="Ce que vous payez" beneficiaryLabel="L'animateur reçoit" defaultOpen={false} />
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmLive(null)}
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--hover-bg)] transition"
              >
                Annuler
              </button>
              <button
                onClick={() => register(confirmLive)}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                Confirmer · {formatPrice(confirmLive.price)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Programmer un live — réservé à qui peut animer */}
      {showCreateModal && mayHost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)]" onClick={() => setShowCreateModal(false)}>
          <div
            className="w-full max-w-lg mx-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-[var(--foreground)]">
              <Radio size={20} /> Programmer un live
            </h2>
            <p className="text-xs text-[var(--text-muted)]">Animé par {actor.name}.</p>
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
                {newLive.prix === "0" && <p className="text-xs text-green-500 mt-1">Gratuit</p>}
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
                  addToast("Live programmé : il figure dans « Prochains lives ».", "success");
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
