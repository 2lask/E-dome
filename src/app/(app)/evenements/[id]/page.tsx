"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, CalendarPlus, Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { BackButton } from "@/components/ui/back-button";
import { RecommendButton } from "@/components/affiliate/recommend-button";
import { ReferralBanner } from "@/components/affiliate/referral-banner";
import { MoneyFlow } from "@/components/pricing/money-flow";
import { useToast } from "@/components/ui/toast";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { personById } from "@/lib/demo/directory";
import { EVENT_TYPE_COLORS as TYPE_COLORS, allEvents, eventDateLabel, isPastEvent } from "@/lib/data/events";
import { agendaIds, registeredIds, registrationCharge, sessionRegistrationCount } from "@/lib/demo/agenda";

/* ── Fiche événement (chantier P6c) ──────────────────────────────────────────

   L'organisateur est une personne de l'annuaire (son visage, sa fiche) ; la
   date se lit sur l'horloge de la démonstration (passé = plus réservable) ;
   s'inscrire écrit `event.registered` (l'organisateur est notifié, le flux
   d'argent de `quote()` est montré pour un billet payant) ; « Ajouter à mon
   agenda » laisse une trace dans l'application — aucun lien externe. */

export default function EvenementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { formatPrice } = useApp();
  const { addToast } = useToast();
  const { state, actorId } = useSession();
  const [showConfirm, setShowConfirm] = useState(false);

  const event = useMemo(() => allEvents(state).find((e) => e.id === params.id), [state, params.id]);
  const registered = useMemo(() => registeredIds(state, actorId), [state, actorId]);
  const agenda = useMemo(() => agendaIds(state, actorId), [state, actorId]);

  if (!event) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
            <Calendar size={32} strokeWidth={1.6} />
          </div>
          <h1 className="text-2xl page-heading text-[var(--foreground)]">Événement introuvable</h1>
          <p className="text-[var(--text-secondary)]">Cet événement n&apos;existe pas ou a été supprimé.</p>
          <button onClick={() => router.push("/evenements")} className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors">
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  const organizer = personById(event.organizerId);
  const isPast = isPastEvent(event);
  const remaining = Math.max(0, event.spotsRemaining - sessionRegistrationCount(state, event.id));
  const isFull = remaining === 0;
  const isRegistered = registered.has(event.id);
  const isMine = event.organizerId === actorId;
  const charge = registrationCharge("evenement", event.prix);

  const handleRegister = () => {
    recordSessionEvent({
      kind: "event.registered",
      data: { eventId: event.id, target: "evenement", title: event.titre, organizerId: event.organizerId, date: event.date, priceChf: event.prix },
    });
    setShowConfirm(false);
    addToast(`Inscription confirmée. ${event.intervenant || "L'organisateur"} est prévenu·e.`, "success");
  };

  const handleUnregister = () => {
    recordSessionEvent({ kind: "event.unregistered", data: { eventId: event.id, target: "evenement", title: event.titre, organizerId: event.organizerId } });
    addToast("Inscription annulée.", "info");
  };

  const handleAgenda = () => {
    if (!agenda.has(event.id)) {
      recordSessionEvent({
        kind: "agenda.added",
        data: { eventId: event.id, target: "evenement", title: event.titre, organizerId: event.organizerId, date: event.date },
      });
    }
    addToast(`Ajouté à votre agenda : ${eventDateLabel(event.date)} à ${event.heure}.`, "success");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <div className="relative h-72 sm:h-96">
        <img src={event.thumbnail} alt={event.titre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-4 left-4 z-10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <BackButton fallbackHref="/evenements" variant="circle" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${TYPE_COLORS[event.type] || "bg-gray-500/20 text-gray-400"}`}>
            {event.type}
          </span>
          {isPast && <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 bg-white/20 text-white">Passé</span>}
          <h1 className="text-2xl sm:text-3xl page-heading text-white mb-2">{event.titre}</h1>
          <p className="text-white/80 text-sm">Organisé par {event.intervenant}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Bannière de confiance si on arrive via un lien d'apporteur (?ref=) */}
        <ReferralBanner kind="evenement" id={event.id} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
            <div className="text-sm text-[var(--text-muted)] mb-1">Date</div>
            <div className="font-semibold">{eventDateLabel(event.date)}</div>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
            <div className="text-sm text-[var(--text-muted)] mb-1">Heure</div>
            <div className="font-semibold">{event.heure} ({event.duree})</div>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
            <div className="text-sm text-[var(--text-muted)] mb-1">Lieu</div>
            <div className="font-semibold text-sm">{event.lieu}</div>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
            <div className="text-sm text-[var(--text-muted)] mb-1">Prix</div>
            <div className="font-semibold text-[var(--primary)]">{event.prix > 0 ? formatPrice(event.prix) : "Gratuit"}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-semibold">À propos</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{event.description}</p>
            </section>

            {event.programme.length > 0 && (
              <section className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">Programme</h2>
                <div className="space-y-3">
                  {event.programme.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[var(--primary)] flex-shrink-0" />
                      <p className="text-[var(--text-secondary)] text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 space-y-4 sticky top-24">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-1">{event.prix > 0 ? formatPrice(event.prix) : "Gratuit"}</div>
                <p className="text-sm text-[var(--text-muted)]">par participant</p>
              </div>

              {!isPast && (
                <div>
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                    <span>{remaining} places restantes</span>
                    <span>{event.spots - remaining}/{event.spots}</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-[var(--primary)]"}`} style={{ width: `${((event.spots - remaining) / event.spots) * 100}%` }} />
                  </div>
                </div>
              )}

              {isPast ? (
                <div className="text-center py-3 bg-[var(--background)] text-[var(--text-muted)] rounded-xl font-medium">Événement passé</div>
              ) : isMine ? (
                <div className="text-center py-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl font-medium">Vous organisez cet événement</div>
              ) : isRegistered ? (
                <button onClick={handleUnregister} title="Annuler mon inscription" className="w-full flex items-center justify-center gap-1.5 py-3 bg-green-500/20 text-green-500 rounded-xl font-medium hover:bg-green-500/30 transition-colors">
                  <Check size={16} strokeWidth={2.5} /> Inscrit·e
                </button>
              ) : isFull ? (
                <div className="text-center py-3 bg-red-500/20 text-red-400 rounded-xl font-medium">Complet</div>
              ) : (
                <button onClick={() => setShowConfirm(true)} className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors">
                  S&apos;inscrire
                </button>
              )}

              {!isPast && (
                <button
                  onClick={handleAgenda}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--card-border)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <CalendarPlus size={15} /> {agenda.has(event.id) ? "Dans mon agenda" : "Ajouter à mon agenda"}
                </button>
              )}

              {/* L'organisateur : une personne de l'annuaire */}
              <div className="pt-4 border-t border-[var(--card-border)]">
                <div className="text-sm text-[var(--text-muted)] mb-2">Organisateur</div>
                {organizer ? (
                  <Link href={`/profil/${organizer.id}`} className="flex items-center gap-3 group">
                    <img src={organizer.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <span>
                      <span className="block font-medium group-hover:underline">{event.intervenant}</span>
                      <span className="block text-xs text-[var(--text-muted)]">{organizer.city}</span>
                    </span>
                  </Link>
                ) : (
                  <div className="font-medium">{event.intervenant}</div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--card-border)]">
                <div className="text-sm text-[var(--text-muted)] mb-2">Partager</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`mailto:?subject=${encodeURIComponent(event.titre)}&body=${encodeURIComponent(`Découvrez cet événement sur E-Dome : ${event.titre}`)}`, "_blank")}
                    className="flex-1 py-2 bg-[var(--background)] hover:bg-[var(--hover-bg)] rounded-lg text-sm text-[var(--text-secondary)] transition-colors"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(`${window.location.origin}/evenements/${event.id}`);
                      addToast("Lien copié.", "success");
                    }}
                    className="flex-1 py-2 bg-[var(--background)] hover:bg-[var(--hover-bg)] rounded-lg text-sm text-[var(--text-secondary)] transition-colors"
                  >
                    Lien
                  </button>
                </div>
              </div>

              {/* Recommander (et gagner, si le billet est payant et ouvert à l'affiliation) */}
              {!isPast && (
                <div className="pt-4 border-t border-[var(--card-border)]">
                  <RecommendButton
                    kind="evenement"
                    id={event.id}
                    title={event.titre}
                    image={event.thumbnail}
                    price={event.prix}
                    currency="CHF"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--primary)]/40 text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/10 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowConfirm(false)}>
          <div role="dialog" aria-modal="true" aria-label="Confirmer l'inscription" className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full animate-scale-in space-y-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <h2 className="text-xl font-bold mb-1">Confirmer l&apos;inscription</h2>
              <h3 className="text-[var(--primary)] font-medium">{event.titre}</h3>
            </div>
            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
              <p>Organisé par {event.intervenant}</p>
              <p>Date : {eventDateLabel(event.date)} à {event.heure}</p>
              <p>Lieu : {event.lieu}</p>
              <p>Prix : {event.prix > 0 ? `${formatPrice(event.prix)} (paiement simulé)` : "Gratuit"}</p>
            </div>
            {charge && <MoneyFlow charge={charge} grossLabel="Ce que vous payez" beneficiaryLabel="L'organisateur reçoit" defaultOpen={false} />}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                Annuler
              </button>
              <button onClick={handleRegister} className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors">
                Confirmer{event.prix > 0 ? ` · ${formatPrice(event.prix)}` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
