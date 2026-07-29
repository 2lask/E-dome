"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { BackButton } from "@/components/ui/back-button";
import { RecommendButton } from "@/components/affiliate/recommend-button";
import { ReferralBanner } from "@/components/affiliate/referral-banner";

/* ─── Mock Data (same as evenements list) ──────────────────────────────── */

/* Exporté pour alimenter le catalogue d'annonces de la page /apporteurs
   (mêmes ids que la route pour que les redirections ?ref= tombent juste). */
export const EVENTS = [
  { id: "e1", titre: "Salon de l'immobilier Suisse 2026", type: "Conférence", date: "2026-05-15", heure: "09:00", duree: "8h", lieu: "Palexpo, Genève", description: "Le plus grand salon immobilier de Suisse romande. Retrouvez plus de 200 exposants, des conférences thématiques et des ateliers pratiques pour tous les profils : investisseurs, propriétaires, courtiers et passionnés d'immobilier.", thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop", spots: 500, spotsRemaining: 127, prix: 45, featured: true, intervenant: "Plusieurs experts", programme: ["09:00 — Ouverture des portes", "10:00 — Keynote : Tendances immobilières 2026", "11:30 — Table ronde : Investir en Suisse romande", "14:00 — Ateliers pratiques (3 salles)", "16:00 — Networking & cocktail", "17:00 — Clôture"] },
  { id: "e2", titre: "Webinaire : Optimiser son rendement locatif", type: "Webinaire", date: "2026-04-20", heure: "18:00", duree: "1h30", lieu: "En ligne", description: "Stratégies concrètes pour maximiser la rentabilité de vos biens locatifs. Calcul du rendement net, optimisation fiscale, gestion des charges et conseils pour réduire la vacance locative.", thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=400&fit=crop", spots: 200, spotsRemaining: 84, prix: 0, featured: false, intervenant: "Sophie Martin", programme: ["18:00 — Introduction et objectifs", "18:15 — Calcul du rendement net réel", "18:45 — Optimisation fiscale", "19:15 — Questions / Réponses", "19:30 — Fin"] },
  { id: "e3", titre: "Atelier : Home staging pratique", type: "Atelier", date: "2026-04-10", heure: "14:00", duree: "3h", lieu: "Lausanne, Centre Flon", description: "Apprenez les techniques de home staging pour vendre plus vite et au meilleur prix. Mise en scène, photographie, dépersonnalisation et conseils de décoration accessibles à tous.", thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop", spots: 30, spotsRemaining: 8, prix: 89, featured: false, intervenant: "Claire Bernard", programme: ["14:00 — Accueil", "14:15 — Les bases du home staging", "15:00 — Exercice pratique en binôme", "16:00 — Retours et astuces avancées", "17:00 — Fin"] },
  { id: "e4", titre: "Networking investisseurs romands", type: "Networking", date: "2026-04-05", heure: "19:00", duree: "2h", lieu: "Hôtel Royal, Montreux", description: "Rencontrez les investisseurs les plus actifs de Suisse romande dans un cadre exclusif. Échangez vos stratégies, partagez vos deals et créez des partenariats durables.", thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop", spots: 80, spotsRemaining: 22, prix: 35, featured: false, intervenant: "Marc Dupont", programme: ["19:00 — Accueil & cocktail", "19:30 — Présentations flash (5 investisseurs)", "20:15 — Networking libre", "21:00 — Fin"] },
  { id: "e5", titre: "Formation live : Fiscalité immobilière", type: "Formation live", date: "2026-03-20", heure: "10:00", duree: "4h", lieu: "En ligne", description: "Comprendre la fiscalité liée aux investissements immobiliers en Suisse. Impôt sur le revenu locatif, plus-values, déductions et optimisation via les sociétés immobilières.", thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop", spots: 150, spotsRemaining: 0, prix: 120, featured: false, intervenant: "Jean Leroy", programme: ["10:00 — Introduction", "10:30 — Fiscalité des revenus locatifs", "11:30 — Pause", "11:45 — Plus-values et déductions", "13:00 — Questions / Réponses", "14:00 — Fin"] },
  { id: "e6", titre: "Conférence : Marché immobilier 2026", type: "Conférence", date: "2026-03-10", heure: "17:00", duree: "2h", lieu: "EPFL, Lausanne", description: "Analyse approfondie et perspectives du marché immobilier suisse pour 2026. Données exclusives, tendances régionales et prévisions d'experts reconnus.", thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop", spots: 300, spotsRemaining: 0, prix: 0, featured: false, intervenant: "Prof. A. Blanc", programme: ["17:00 — Ouverture", "17:15 — État des lieux du marché", "18:00 — Prévisions régionales", "18:30 — Débat avec le public", "19:00 — Fin"] },
];

const TYPE_COLORS: Record<string, string> = {
  "Webinaire": "bg-blue-500/20 text-blue-400",
  "Conférence": "bg-purple-500/20 text-purple-400",
  "Atelier": "bg-green-500/20 text-green-400",
  "Networking": "bg-amber-500/20 text-amber-400",
  "Formation live": "bg-rose-500/20 text-rose-400",
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function EvenementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { formatPrice } = useApp();
  const [registered, setRegistered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const event = useMemo(() => EVENTS.find((e) => e.id === params.id), [params.id]);

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

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isFull = event.spotsRemaining === 0;

  const handleRegister = () => {
    setRegistered(true);
    setShowConfirm(false);
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
          <h1 className="text-2xl sm:text-3xl page-heading text-white mb-2">{event.titre}</h1>
          <p className="text-white/80 text-sm">Par {event.intervenant}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Bannière de confiance si on arrive via un lien d'apporteur (?ref=) */}
        <ReferralBanner kind="evenement" id={event.id} />
        {/* Info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
            <div className="text-sm text-[var(--text-muted)] mb-1">Date</div>
            <div className="font-semibold">{eventDate.toLocaleDateString("fr-CH")}</div>
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
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-semibold">À propos</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{event.description}</p>
            </section>

            {/* Programme */}
            {event.programme && event.programme.length > 0 && (
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

          {/* Right column — registration card */}
          <div className="space-y-4">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 space-y-4 sticky top-24">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-1">
                  {event.prix > 0 ? formatPrice(event.prix) : "Gratuit"}
                </div>
                <p className="text-sm text-[var(--text-muted)]">par participant</p>
              </div>

              {/* Spots */}
              <div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                  <span>{event.spotsRemaining} places restantes</span>
                  <span>{event.spots - event.spotsRemaining}/{event.spots}</span>
                </div>
                <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-[var(--primary)]"}`}
                    style={{ width: `${((event.spots - event.spotsRemaining) / event.spots) * 100}%` }}
                  />
                </div>
              </div>

              {/* CTA */}
              {registered ? (
                <div className="flex items-center justify-center gap-1.5 py-3 bg-green-500/20 text-green-400 rounded-xl font-medium">
                  <Check size={16} strokeWidth={2.5} /> Inscrit
                </div>
              ) : isPast ? (
                <div className="text-center py-3 bg-[var(--background)] text-[var(--text-muted)] rounded-xl font-medium">
                  Événement passé
                </div>
              ) : isFull ? (
                <div className="text-center py-3 bg-red-500/20 text-red-400 rounded-xl font-medium">
                  Complet
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors"
                >
                  S&apos;inscrire
                </button>
              )}

              {/* Intervenant */}
              <div className="pt-4 border-t border-[var(--card-border)]">
                <div className="text-sm text-[var(--text-muted)] mb-1">Intervenant</div>
                <div className="font-medium">{event.intervenant}</div>
              </div>

              {/* Partager */}
              <div className="pt-4 border-t border-[var(--card-border)]">
                <div className="text-sm text-[var(--text-muted)] mb-2">Partager</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`mailto:?subject=${encodeURIComponent(event.titre)}&body=${encodeURIComponent(`Découvrez cet événement sur E-Dome: ${event.titre}`)}`, "_blank")}
                    className="flex-1 py-2 bg-[var(--background)] hover:bg-[var(--hover-bg)] rounded-lg text-sm text-[var(--text-secondary)] transition-colors"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/evenements/${event.id}`)}
                    className="flex-1 py-2 bg-[var(--background)] hover:bg-[var(--hover-bg)] rounded-lg text-sm text-[var(--text-secondary)] transition-colors"
                  >
                    Lien
                  </button>
                </div>
              </div>

              {/* Recommander & gagner (apporteur d'affaires) */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h2 className="text-xl font-bold mb-2">Confirmer l&apos;inscription</h2>
            <h3 className="text-[var(--primary)] font-medium mb-4">{event.titre}</h3>
            <div className="space-y-2 text-sm text-[var(--text-secondary)] mb-6">
              <p>Date : {eventDate.toLocaleDateString("fr-CH")} à {event.heure}</p>
              <p>Lieu : {event.lieu}</p>
              <p>Prix : {event.prix > 0 ? formatPrice(event.prix) : "Gratuit"}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                Annuler
              </button>
              <button onClick={handleRegister} className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
