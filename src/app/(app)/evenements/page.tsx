"use client";

import React, { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { PageHeader } from "@/components/ui/page-header";
import { EVENTS, EVENT_TYPE_COLORS as TYPE_COLORS } from "@/lib/data/events";

/* Donnees et couleurs de badge : voir '@/lib/data/events' — ce fichier
   dupliquait le tableau de la page fiche avec des descriptions plus courtes. */

const TABS = ["À venir", "En cours", "Passés"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getTab(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d > today) return "À venir";
  if (d.toDateString() === today.toDateString()) return "En cours";
  return "Passés";
}

function formatDateBadge(dateStr: string) {
  const d = new Date(dateStr);
  return { day: d.getDate(), month: MONTHS[d.getMonth()]?.substring(0, 3).toUpperCase() };
}

/* ─── Share helpers ──────────────────────────────────────────────────────── */

function shareEmail(title: string) {
  window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Découvrez cet événement sur E-Dome: ${title}`)}`, "_blank");
}

function copyLink(id: string) {
  navigator.clipboard.writeText(`${window.location.origin}/evenements/${id}`);
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function EvenementsPage() {
  const { formatPrice, activeRole } = useApp();
  const canCreateEvent = ["hote", "agence", "promoteur", "formateur"].includes(activeRole);
  const [activeTab, setActiveTab] = useState("À venir");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState(() => { const d = new Date(); return { month: d.getMonth(), year: d.getFullYear() }; });
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [spotsUsed, setSpotsUsed] = useState<Record<string, number>>({});

  const filtered = useMemo(() => EVENTS.filter((e) => getTab(e.date) === activeTab), [activeTab]);

  const featured = EVENTS.find((e) => e.featured);

  /* Calendar helpers */
  const calendarDays = useMemo(() => {
    const first = new Date(calendarMonth.year, calendarMonth.month, 1);
    const startDay = (first.getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calendarMonth]);

  const eventsInMonth = useMemo(() => {
    return EVENTS.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === calendarMonth.month && d.getFullYear() === calendarMonth.year;
    });
  }, [calendarMonth]);

  const handleRegister = (eventId: string) => {
    setRegisteredIds((prev) => { const n = new Set(prev); n.add(eventId); return n; });
    setSpotsUsed((prev) => ({ ...prev, [eventId]: (prev[eventId] ?? 0) + 1 }));
    setRegisteringId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <PageHeader
          title="Événements"
          description="Découvrez les événements de la communauté"
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
                <a href="/evenements/creer" className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl text-sm font-medium transition-colors">
                  + Créer
                </a>
              )}
            </>
          }
        />

        {/* ── Featured banner ──────────────────────────────────────────── */}
        {featured && viewMode === "list" && (
          <div className="relative rounded-2xl overflow-hidden">
            <img src={featured.thumbnail} alt={featured.titre} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${TYPE_COLORS[featured.type] || "bg-gray-500/20 text-gray-400"}`}>{featured.type}</span>
              <h2 className="text-2xl font-bold text-white mb-1">{featured.titre}</h2>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>{new Date(featured.date).toLocaleDateString("fr-CH")} à {featured.heure}</span>
                <span>{featured.lieu}</span>
                <span className="text-[var(--primary)] font-semibold">{featured.prix > 0 ? formatPrice(featured.prix) : "Gratuit"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        {viewMode === "list" && (
          <>
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"}`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Event Cards ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((ev) => {
                const db = formatDateBadge(ev.date);
                const effectiveRemaining = Math.max(0, ev.spotsRemaining - (spotsUsed[ev.id] ?? 0));
                const spotsPercent = ((ev.spots - effectiveRemaining) / ev.spots) * 100;
                const isFull = effectiveRemaining === 0;
                const isRegistered = registeredIds.has(ev.id);
                return (
                  <div key={ev.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:border-[var(--primary)]/40 transition-colors relative">
                    <div className="relative">
                      <img src={ev.thumbnail} alt={ev.titre} className="w-full h-44 object-cover" />
                      {/* Date badge */}
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center">
                        <div className="text-lg font-bold text-[var(--primary)] leading-tight">{db.day}</div>
                        <div className="text-[10px] font-medium text-[var(--text-muted)] uppercase">{db.month}</div>
                      </div>
                      {/* Type badge */}
                      <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[ev.type] || "bg-gray-500/20 text-gray-400"}`}>{ev.type}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <a href={`/evenements/${ev.id}`} className="font-semibold line-clamp-2 hover:text-[var(--primary)] transition-colors block">{ev.titre}</a>
                      <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>{ev.heure} &middot; {ev.duree}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{ev.lieu}</span>
                        </div>
                      </div>
                      {/* Spots progress */}
                      <div>
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                          <span>{effectiveRemaining} places restantes</span>
                          <span>{ev.spots - effectiveRemaining}/{ev.spots}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-[var(--primary)]"}`} style={{ width: `${spotsPercent}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--primary)]">{ev.prix > 0 ? formatPrice(ev.prix) : "Gratuit"}</span>
                        <div className="flex gap-2">
                          {/* Share button */}
                          <div className="relative">
                            <button onClick={() => setShareOpenId(shareOpenId === ev.id ? null : ev.id)} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors text-[var(--text-muted)]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                            {shareOpenId === ev.id && (
                              <div className="absolute right-0 top-full mt-1 bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-lg py-1 z-10 min-w-[150px] animate-scale-in">
                                <button onClick={() => { shareEmail(ev.titre); setShareOpenId(null); }} className="w-full px-4 py-2 text-sm text-left hover:bg-[var(--hover-bg)] text-[var(--foreground)]">Email</button>
                                <button onClick={() => { copyLink(ev.id); setShareOpenId(null); }} className="w-full px-4 py-2 text-sm text-left hover:bg-[var(--hover-bg)] text-[var(--foreground)]">Copier le lien</button>
                              </div>
                            )}
                          </div>
                          {/* Register */}
                          {isRegistered ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                              <Check size={14} strokeWidth={2.5} /> Inscrit
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

        {/* ── Calendar View ────────────────────────────────────────────── */}
        {viewMode === "calendar" && (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCalendarMonth((p) => { const m = p.month - 1; return m < 0 ? { month: 11, year: p.year - 1 } : { ...p, month: m }; })} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-lg font-semibold">{MONTHS[calendarMonth.month]} {calendarMonth.year}</h2>
              <button onClick={() => setCalendarMonth((p) => { const m = p.month + 1; return m > 11 ? { month: 0, year: p.year + 1 } : { ...p, month: m }; })} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => <div key={d} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">{d}</div>)}
              {calendarDays.map((day, i) => {
                const eventsOnDay = day ? eventsInMonth.filter((e) => new Date(e.date).getDate() === day) : [];
                return (
                  <div key={i} className={`min-h-[80px] p-1.5 rounded-lg border ${day ? "border-[var(--card-border)]" : "border-transparent"}`}>
                    {day && (
                      <>
                        <span className="text-xs text-[var(--text-secondary)]">{day}</span>
                        {eventsOnDay.map((ev) => (
                          <div key={ev.id} className="mt-1 px-1.5 py-0.5 bg-[var(--primary)]/20 text-[var(--primary)] rounded text-[10px] font-medium truncate cursor-pointer" title={ev.titre}>
                            {ev.titre.substring(0, 15)}...
                          </div>
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

      {/* ── Registration Modal ───────────────────────────────────────────── */}
      {registeringId && (() => {
        const ev = EVENTS.find((e) => e.id === registeringId);
        if (!ev) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full animate-scale-in">
              <h2 className="text-xl font-bold mb-2">S&apos;inscrire à l&apos;événement</h2>
              <h3 className="text-[var(--primary)] font-medium mb-4">{ev.titre}</h3>
              <div className="space-y-2 text-sm text-[var(--text-secondary)] mb-6">
                <p>Date : {new Date(ev.date).toLocaleDateString("fr-CH")} à {ev.heure}</p>
                <p>Lieu : {ev.lieu}</p>
                <p>Prix : {ev.prix > 0 ? formatPrice(ev.prix) : "Gratuit"}</p>
                <p>Places restantes : {ev.spotsRemaining}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRegisteringId(null)} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                  Annuler
                </button>
                <button onClick={() => handleRegister(ev.id)} className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors">
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
