"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { roleLabels } from "@/lib/types";
import type { Property, User } from "@/lib/types";
import { formatCount, timeAgo } from "@/lib/utils";

// ─── Mock data ──────────────────────────────────────────────────────────────

const mockUsers: Record<string, User> = {
  u1: {
    id: "u1", firstName: "Sophie", lastName: "Bernard", email: "sophie@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    city: "Genève", country: "Suisse", roles: ["hote", "courtier"], activeRole: "hote",
    stats: { followers: 890, following: 210, properties: 5, reviews: 42, rating: 4.9, transactions: 89, revenue: 120000 },
    bio: "Agente immobilière passionnée avec 10 ans d'expérience à Genève et environs. Spécialisée dans les biens de luxe.",
    languages: ["Français", "Anglais", "Italien"],
    certifications: ["Courtière certifiée USPI", "Experte en estimation"],
    responseTime: "< 30 min",
  },
  u2: {
    id: "u2", firstName: "Jean", lastName: "Dupont", email: "jean@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    city: "Zürich", country: "Suisse", roles: ["promoteur"], activeRole: "promoteur",
    stats: { followers: 2100, following: 150, properties: 15, reviews: 78, rating: 4.7, transactions: 200, revenue: 450000 },
    bio: "Promoteur immobilier depuis 20 ans. Projets résidentiels et commerciaux en Suisse alémanique.",
    languages: ["Français", "Allemand"],
    certifications: ["Promoteur agréé"],
    responseTime: "< 2 heures",
  },
};

const mockProperties: Record<string, Property[]> = {
  u1: [
    {
      id: "p10", title: "Penthouse Genève", description: "", type: "penthouse", transactionType: "vente",
      price: 2800000, currency: "CHF", location: { city: "Genève", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"],
      host: mockUsers.u1, bedrooms: 4, bathrooms: 3, area: 200, amenities: [], rating: 4.9, reviewCount: 12,
    },
    {
      id: "p11", title: "Studio Carouge", description: "", type: "studio", transactionType: "location-ct",
      price: 120, currency: "CHF", location: { city: "Carouge", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
      host: mockUsers.u1, bedrooms: 1, bathrooms: 1, area: 35, amenities: [], rating: 4.6, reviewCount: 22,
    },
  ],
  u2: [
    {
      id: "p20", title: "Résidence Neuve Zürich", description: "", type: "appartement", transactionType: "vente",
      price: 980000, currency: "CHF", location: { city: "Zürich", country: "Suisse" },
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      host: mockUsers.u2, bedrooms: 3, bathrooms: 2, area: 95, amenities: [], rating: 4.8, reviewCount: 5,
    },
  ],
};

const mockReviews: Record<string, { id: string; author: string; rating: number; text: string; date: string; reply: string | null }[]> = {
  u1: [
    { id: "r10", author: "Marc T.", rating: 5, text: "Sophie est incroyable, très professionnelle.", date: "2026-03-18", reply: null },
    { id: "r11", author: "Laura K.", rating: 5, text: "Service impeccable du début à la fin.", date: "2026-03-10", reply: "Merci beaucoup Laura !" },
  ],
  u2: [
    { id: "r20", author: "Pierre N.", rating: 4, text: "Bon promoteur, projets de qualité.", date: "2026-03-12", reply: null },
  ],
};

const ratingBreakdowns: Record<string, { stars: number; count: number }[]> = {
  u1: [{ stars: 5, count: 35 }, { stars: 4, count: 5 }, { stars: 3, count: 2 }, { stars: 2, count: 0 }, { stars: 1, count: 0 }],
  u2: [{ stars: 5, count: 50 }, { stars: 4, count: 20 }, { stars: 3, count: 5 }, { stars: 2, count: 2 }, { stars: 1, count: 1 }],
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function PublicProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isFollowing, toggleFollow, formatPrice } = useApp();
  const [tab, setTab] = useState<"biens" | "publications" | "avis" | "apropos">("biens");

  const user = mockUsers[id];
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Profil introuvable.</p>
      </div>
    );
  }

  const properties = mockProperties[id] || [];
  const reviews = mockReviews[id] || [];
  const breakdown = ratingBreakdowns[id] || [];
  const totalReviews = breakdown.reduce((s, r) => s + r.count, 0);
  const following = isFollowing(id);

  const tabs = [
    { key: "biens" as const, label: "Biens" },
    { key: "publications" as const, label: "Publications" },
    { key: "avis" as const, label: "Avis" },
    { key: "apropos" as const, label: "A propos" },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Cover */}
      <div className="relative h-48 md:h-56 rounded-b-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C4956A] via-[#C4956A]/60 to-[var(--background)]" />
      </div>

      <div className="px-4 md:px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <img src={user.avatar} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-[var(--background)]" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {roleLabels[user.activeRole]} - {user.city}, {user.country}
            </p>
          </div>
          <div className="flex gap-2 self-start md:self-auto">
            <button
              onClick={() => toggleFollow(id)}
              className={`px-5 py-2 text-sm rounded-xl transition-colors ${
                following
                  ? "bg-[var(--card)] border border-[#C4956A] text-[#C4956A]"
                  : "bg-[#C4956A] text-white hover:bg-[#b8845a]"
              }`}
            >
              {following ? "Suivi" : "Suivre"}
            </button>
            <Link
              href="/messages"
              className="px-5 py-2 text-sm rounded-xl border border-[var(--card-border)] text-[var(--foreground)] hover:border-[#C4956A]/50 transition-colors"
            >
              Contacter
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 flex-wrap">
          {[
            { label: "Biens", value: user.stats.properties },
            { label: "Abonnés", value: user.stats.followers },
            { label: "Suivis", value: user.stats.following },
            { label: "Note", value: `${user.stats.rating}/5` },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold text-[var(--foreground)]">
                {typeof s.value === "number" ? formatCount(s.value) : s.value}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 mt-8">
        <div className="flex gap-1 border-b border-[var(--card-border)]">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                tab === t.key ? "text-[#C4956A]" : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t.label}
              {tab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4956A] rounded-full" />}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "biens" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.length === 0 ? (
                <p className="text-[var(--text-muted)] col-span-full text-center py-12">Aucun bien publié.</p>
              ) : (
                properties.map((p) => (
                  <Link
                    key={p.id}
                    href={`/explorer/${p.id}`}
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden hover:border-[#C4956A]/30 transition-colors"
                  >
                    <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] truncate">{p.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{p.location.city}, {p.location.country}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-[#C4956A]">
                          {formatPrice(p.price, p.currency)}
                          {p.transactionType === "location-ct" ? "/nuit" : ""}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{p.rating} ({p.reviewCount})</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {tab === "publications" && (
            <div className="text-center py-12 text-[var(--text-muted)]">Aucune publication pour le moment.</div>
          )}

          {tab === "avis" && (
            <div className="space-y-6">
              {breakdown.length > 0 && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[var(--foreground)]">{user.stats.rating}</div>
                      <div className="text-sm text-[var(--text-muted)]">{totalReviews} avis</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {breakdown.map((r) => (
                        <div key={r.stars} className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-muted)] w-3">{r.stars}</span>
                          <div className="flex-1 h-2 bg-[var(--input-bg)] rounded-full overflow-hidden">
                            <div className="h-full bg-[#C4956A] rounded-full" style={{ width: `${totalReviews > 0 ? (r.count / totalReviews) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-[var(--text-muted)] w-6 text-right">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">{review.author}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{review.text}</p>
                  <div className="text-xs text-[var(--text-muted)] mt-2">{review.date}</div>
                  {review.reply && (
                    <div className="mt-3 pl-4 border-l-2 border-[#C4956A]/30">
                      <p className="text-sm text-[var(--text-secondary)] italic">{review.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "apropos" && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Bio</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{user.bio}</p>
              </div>
              {user.languages && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Langues</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((l) => (
                      <span key={l} className="px-3 py-1 text-xs rounded-full bg-[#C4956A]/10 text-[#C4956A]">{l}</span>
                    ))}
                  </div>
                </div>
              )}
              {user.certifications && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Certifications</h3>
                  <ul className="space-y-2">
                    {user.certifications.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[#C4956A]">✓</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {user.responseTime && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Temps de réponse</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{user.responseTime}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
