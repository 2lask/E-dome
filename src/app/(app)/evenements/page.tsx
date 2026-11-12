"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { PageHeader } from "@/components/ui/page-header";
import { MoneyFlow } from "@/components/pricing/money-flow";
import { useToast } from "@/components/ui/toast";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { EVENT_TYPE_COLORS as TYPE_COLORS, allEvents, eventDateLabel, isPastEvent, type AppEvent } from "@/lib/data/events";
import { registeredIds, registrationCharge, sessionRegistrationCount } from "@/lib/demo/agenda";
import { DEMO_TODAY } from "@/lib/demo/clock";

/* ── /evenements (chantier P6c) ───────────────────────────────────────────────

   Données et couleurs : `@/lib/data/events` (+ les événements publiés pendant
   la visite). Chaque événement a un organisateur de l'annuaire ; le temps est
   celui de la démonstration (`DEMO_TODAY`), jamais `new Date()` au rendu —
   les passés sont rangés à part et ne sont plus réservables.

   S'inscrire écrit `event.registered` au journal de session : l'organisateur
   est notifié, le compteur de places bouge, et pour un billet payant le flux
   d'argent de `quote()` s'affiche avant la confirmation. */

const TABS = ["À venir", "Passés"] as const;
type Tab = (typeof TABS)[number];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function formatDateBadge(dateStr: string) {
  const m = Number(dateStr.slice(5, 7));
  return { day: Number(dateStr.slice(8, 10)), month: MONTHS[m - 1]?.substring(0, 3).toUpperCase() };
}

function shareEmail(title: string) {
  window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Découvrez cet événement sur E-Dome : ${title}`)}`, "_blank");
}

export default function EvenementsPage() {
  const { formatPrice, actorRoles } = useApp();
  const { addToast } = useToast();
  const { state, actorId } = useSession();
  const canCreateEvent = (["hote", "agence", "agent", "prestataire", "createur"] as const).some((r) => actorRoles.includes(r));
  const [activeTab, setActiveTab] = useState<Tab>("À venir");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  /* Le calendrier s'ouvre sur le mois qui suit le « aujourd'hui » de la démo
     (octobre 2026), là où sont les événements à venir. */
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const m = DEMO_TODAY.getUTCMonth() + 1;
    return m > 11 ? { month: 0, year: DEMO_TODAY.getUTCFullYear() + 1 } : { month: m, year: DEMO_TODAY.getUTCFullYear() };
  });
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);

  const events = useMemo(() => allEvents(state), [state]);
  const registered = useMemo(() => registeredIds(state, actorId), [state, actorId]);
  const filtered = useMemo(
    () =>
      events
        .filter((e) => (activeTab === "Passés" ? isPastEvent(e) : !isPastEvent(e)))
        .sort((a, b) => (activeTab === "Passés" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))),
    [events, activeTab],
  );
  const featured = events.find((e) => e.featured && !isPastEvent(e));

  const remainingOf = (ev: AppEvent) => Math.max(0, ev.spotsRemaining - sessionRegistrationCount(state, ev.id));

  const calendarDays = useMemo(() => {
    const first = new Date(Date.UTC(calendarMonth.year, calendarMonth.month, 1));
    const startDay = (first.getUTCDay() + 6) % 7; // Lundi = 0
    const daysInMonth = new Date(Date.UTC(calendarMonth.year, calendarMonth.month + 1, 0)).getUTCDate();
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calendarMonth]);

  const eventsInMonth = useMemo(
    () => events.filter((e) => Number(e.date.slice(5, 7)) - 1 === calendarMonth.month && Number(e.date.slice(0, 4)) === calendarMonth.year),
    [events, calendarMonth],
  );

  const handleRegister = (ev: AppEvent) => {
    recordSessionEvent({
      kind: "event.registered",
      data: { eventId: ev.id, target: "evenement", title: ev.titre, organizerId: ev.organizerId, date: ev.date, priceChf: ev.prix },
    });
    setRegisteringId(null);
    addToast(`Inscription confirmée. ${ev.intervenant || "L'organisateur"} est prévenu·e.`, "success");
  };

  const copyLink = (id: string) => {
    navigator.clipboard?.writeText(`${window.location.origin}/evenements/${id}`);
    addToast("Lien copié.", "success");
  };

  const registering = registeringId ? events.find((e) => e.id === registeringId) : undefined;
  const registeringCharge = registering ? registrationCharge("evenement", registering.prix) : null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <PageHeader
          title="Événements"
          description="Les rencontres, ateliers et webinaires des membres d'E-Dome"
          variant="serif"
          actions={
            <>
              <button onClick={() => setViewMode("list")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === "list" ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] text-[var(--text-secondary)]"}`}>
                Liste
              </button>
              <button onClick={() => setViewMode("calendar")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === "calendar" ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] text-[var(--text-secondary)]"}`}>
                Calendrier
              </button>
              {canCreateEvent && (
                <Link href="/evenements/creer" className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl text-sm font-medium transition-colors">
                  + Créer
                </Link>
              )}
            </>
          }
        />

        {/* À la une */}
        {featured && viewMode === "list" && (
          <Link href={`/evenements/${featured.id}`} className="relative block rounded-2xl overflow-hidden">
            <img src={featured.thumbnail} alt={featured.titre} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${TYPE_COLORS[featured.type] || "bg-gray-500/20 text-gray-400"}`}>{featured.type}</span>
              <h2 className="text-2xl font-bold text-white mb-1">{featured.titre}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/80 text-sm">
                <span>{eventDateLabel(featured.date)} à {featured.heure}</span>
                <span>{featured.lieu}</span>
                <span>Par {featured.intervenant}</span>
                <span className="text-white font-semibold">{featured.prix > 0 ? formatPrice(featured.prix) : "Gratuit"}</span>
              </div>
            </div>
          </Link>
        )}

        {viewMode === "list" && (
          <>
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((ev) => {
                const db = formatDateBadge(ev.date);
                const past = isPastEvent(ev);
                const remaining = remainingOf(ev);
                const spotsPercent = ((ev.spots - remaining) / ev.spots) * 100;
                const isFull = remaining === 0;
                const isRegistered = registered.has(ev.id);
                const isMine = ev.organizerId === actorId;
                return (
                  <div key={ev.id} className={`bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:border-[var(--primary)]/40 transition-colors relative ${past ? "opacity-80" : ""}`}>
                    <div className="relative">
                      <img src={ev.thumbnail} alt={ev.titre} className={`w-full h-44 object-cover ${past ? "grayscale-[40%]" : ""}`} />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center">
                        <div className="text-lg font-bold text-[var(--primary)] leading-tight">{db.day}</div>
                        <div className="text-[10px] font-medium text-[var(--text-muted)] uppercase">{db.month}</div>
                      </div>
                      <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[ev.type] || "bg-gray-500/20 text-gray-400"}`}>{ev.type}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <Link href={`/evenements/${ev.id}`} className="font-semibold line-clamp-2 hover:text-[var(--primary)] transition-colors block">{ev.titre}</Link>
                      <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                        <p>
                          Par <Link href={`/profil/${ev.organizerId}`} className="hover:underline text-[var(--foreground)]">{ev.intervenant}</Link>
                        </p>
                        <p>{ev.heure} &middot; {ev.duree} &middot; {ev.lieu}</p>
                      </div>
                      {past ? (
                        <p className="text-xs text-[var(--text-muted)]">Événement passé · {ev.spots - remaining} participants</p>
                      ) : (
                        <div>
                          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                            <span>{remaining} places restantes</span>
                            <span>{ev.spots - remaining}/{ev.spots}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-[var(--primary)]"}`} style={{ width: `${spotsPercent}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--primary)]">{ev.prix > 0 ? formatPrice(ev.prix) : "Gratuit"}</span>
                        <div className="flex gap-2">
                          <div className="relative">
                            <button onClick={() => setShareOpenId(shareOpenId === ev.id ? null : ev.id)} aria-label="Partager" className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors text-[var(--text-muted)]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                            {shareOpenId === ev.id && (
                              <div className="absolute right-0 top-full mt-1 bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-lg py-1 z-10 min-w-[150px] animate-scale-in">
                                <button onClick={() => { shareEmail(ev.titre); setShareOpenId(null); }} className="w-full px-4 py-2 text-sm text-left hover:bg-[var(--hover-bg)] text-[var(--foreground)]">Email</button>
                                <button onClick={() => { copyLink(ev.id); setShareOpenId(null); }} className="w-full px-4 py-2 text-sm text-left hover:bg-[var(--hover-bg)] text-[var(--foreground)]">Copier le lien</button>
                              </div>
                            )}
                          </div>
                          {past ? (
                            <span className="px-3 py-1.5 bg-[var(--background)] text-[var(--text-muted)] rounded-lg text-sm font-medium">Passé</span>
                          ) : isMine ? (
                            <span className="px-3 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-sm font-medium">Vous organisez</span>
                          ) : isRegistered ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-500 rounded-lg text-sm font-medium">
                              <Check size={14} strokeWidth={2.5} /> Inscrit·e
                            </span>
                          ) : isFull ? (
                            <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">Complet</span>
                          ) : (
                            <button onClick={() => setRegisteringId(ev.id)} className="px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-lg text-sm font-medium transition-colors">
                              S&apos;inscrire
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-[var(--text-muted)] py-12">Aucun événement dans cette catégorie.</p>
            )}
          </>
        )}

        {viewMode === "calendar" && (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button aria-label="Mois précédent" onClick={() => setCalendarMonth((p) => { const m = p.month - 1; return m < 0 ? { month: 11, year: p.year - 1 } : { ...p, month: m }; })} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-lg font-semibold">{MONTHS[calendarMonth.month]} {calendarMonth.year}</h2>
              <button aria-label="Mois suivant" onClick={() => setCalendarMonth((p) => { const m = p.month + 1; return m > 11 ? { month: 0, year: p.year + 1 } : { ...p, month: m }; })} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => <div key={d} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">{d}</div>)}
              {calendarDays.map((day, i) => {
                const eventsOnDay = day ? eventsInMonth.filter((e) => Number(e.date.slice(8, 10)) === day) : [];
                return (
                  <div key={i} className={`min-h-[80px] p-1.5 rounded-lg border ${day ? "border-[var(--card-border)]" : "border-transparent"}`}>
                    {day && (
                      <>
                        <span className="text-xs text-[var(--text-secondary)]">{day}</span>
                        {eventsOnDay.map((ev) => (
                          <Link key={ev.id} href={`/evenements/${ev.id}`} className={`mt-1 block px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${isPastEvent(ev) ? "bg-[var(--hover-bg)] text-[var(--text-muted)]" : "bg-[var(--primary)]/20 text-[var(--primary)]"}`} title={ev.titre}>
                            {ev.titre}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Inscription : le flux d'argent avant la confirmation d'un billet payant */}
      {registering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setRegisteringId(null)}>
          <div role="dialog" aria-modal="true" aria-label="S'inscrire à l'événement" className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full animate-scale-in space-y-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <h2 className="text-xl font-bold mb-1">S&apos;inscrire à l&apos;événement</h2>
              <h3 className="text-[var(--primary)] font-medium">{registering.titre}</h3>
            </div>
            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
              <p>Organisé par {registering.intervenant}</p>
              <p>Date : {eventDateLabel(registering.date)} à {registering.heure}</p>
              <p>Lieu : {registering.lieu}</p>
              <p>Prix : {registering.prix > 0 ? `${formatPrice(registering.prix)} (paiement simulé)` : "Gratuit"}</p>
              <p>Places restantes : {remainingOf(registering)}</p>
            </div>
            {registeringCharge && (
              <MoneyFlow charge={registeringCharge} grossLabel="Ce que vous payez" beneficiaryLabel="L'organisateur reçoit" defaultOpen={false} />
            )}
            <div className="flex gap-3">
              <button onClick={() => setRegisteringId(null)} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                Annuler
              </button>
              <button onClick={() => handleRegister(registering)} className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors">
                Confirmer{registering.prix > 0 ? ` · ${formatPrice(registering.prix)}` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
