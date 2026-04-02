"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import type { Property, User, SocialPost } from "@/lib/types";
import { formatCount, timeAgo } from "@/lib/utils";

// ─── Mock data ──────────────────────────────────────────────────────────────

const currentUser: User = {
  id: "me",
  firstName: "Léo",
  lastName: "Martin",
  email: "leo@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  city: "Lausanne",
  country: "Suisse",
  roles: ["hote", "formateur", "apporteur", "investisseur"],
  activeRole: "hote",
  stats: {
    followers: 1200,
    following: 320,
    properties: 8,
    reviews: 56,
    rating: 4.9,
    transactions: 124,
    revenue: 185000,
  },
  bio: "Passionné d'immobilier depuis 15 ans. Spécialisé dans les biens de prestige en Suisse romande et sur la Riviera. Toujours à la recherche de nouvelles opportunités pour mes clients.",
  languages: ["Français", "Anglais", "Allemand"],
  certifications: ["Courtier certifié USPI", "Expert immobilier diplômé", "Formation continue 2025"],
  responseTime: "< 1 heure",
};

const mockProperties: Property[] = [
  {
    id: "p1", title: "Chalet Alpin Premium", description: "", type: "chalet", transactionType: "location-ct",
    price: 350, currency: "CHF", location: { city: "Verbier", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop"],
    host: currentUser, bedrooms: 4, bathrooms: 3, area: 180, amenities: [], rating: 4.9, reviewCount: 28,
  },
  {
    id: "p2", title: "Appartement Vue Lac", description: "", type: "appartement", transactionType: "vente",
    price: 1250000, currency: "CHF", location: { city: "Montreux", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"],
    host: currentUser, bedrooms: 3, bathrooms: 2, area: 120, amenities: [], rating: 4.7, reviewCount: 15,
  },
  {
    id: "p3", title: "Villa Prestige", description: "", type: "villa", transactionType: "vente",
    price: 3200000, currency: "CHF", location: { city: "Lausanne", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"],
    host: currentUser, bedrooms: 6, bathrooms: 4, area: 320, amenities: [], rating: 5.0, reviewCount: 8,
  },
  {
    id: "p4", title: "Studio Zurich Centre", description: "", type: "appartement", transactionType: "location-ct",
    price: 180, currency: "CHF", location: { city: "Zurich", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
    host: currentUser, bedrooms: 1, bathrooms: 1, area: 45, amenities: [], rating: 4.6, reviewCount: 12,
  },
];

const mockPosts: SocialPost[] = [
  {
    id: "sp1", author: currentUser, content: "Nouvelle acquisition exceptionnelle sur les hauts de Lausanne ! Vue panoramique à couper le souffle.",
    media: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop"],
    type: "post", likes: 87, comments: [], createdAt: "2026-03-28T14:00:00",
  },
  {
    id: "sp2", author: currentUser, content: "Visite exclusive du nouveau projet immobilier à Montreux. Places limitées !",
    media: [], type: "post", likes: 42, comments: [], createdAt: "2026-03-25T09:00:00",
  },
];

const mockReviews = [
  { id: "r1", author: "Sophie B.", rating: 5, text: "Expérience parfaite ! Léo est très professionnel et réactif.", date: "2026-03-20", reply: "Merci Sophie, ce fut un plaisir !" },
  { id: "r2", author: "Jean D.", rating: 5, text: "Le chalet était magnifique et très bien entretenu.", date: "2026-03-15", reply: null },
  { id: "r3", author: "Marie L.", rating: 4, text: "Très bon service. La communication pourrait être un peu plus rapide.", date: "2026-03-10", reply: "Merci Marie, je prends note pour m'améliorer." },
  { id: "r4", author: "Paul M.", rating: 5, text: "Excellent ! Je recommande vivement.", date: "2026-03-05", reply: null },
  { id: "r5", author: "Claire R.", rating: 4, text: "Bonne expérience globale, bien situé.", date: "2026-02-28", reply: null },
];

const ratingBreakdown = [
  { stars: 5, count: 42 },
  { stars: 4, count: 10 },
  { stars: 3, count: 3 },
  { stars: 2, count: 1 },
  { stars: 1, count: 0 },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProfilPage() {
  const { formatPrice } = useApp();
  const [tab, setTab] = useState<"biens" | "publications" | "formations" | "avis" | "apropos">("biens");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    photo: currentUser.avatar,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    bio: currentUser.bio,
    city: currentUser.city,
    country: currentUser.country,
    website: "",
  });

  const totalReviews = ratingBreakdown.reduce((s, r) => s + r.count, 0);
  const propertyCount = mockProperties.length;

  const roleBadges = [
    { key: "hote", label: "Hôte" },
    { key: "formateur", label: "Formateur" },
    { key: "apporteur", label: "Apporteur" },
    { key: "investisseur", label: "Investisseur" },
  ];

  const tabs = [
    { key: "biens" as const, label: "Mes Biens" },
    { key: "publications" as const, label: "Publications" },
    { key: "formations" as const, label: "Formations" },
    { key: "avis" as const, label: "Avis" },
    { key: "apropos" as const, label: "À propos" },
  ];

  const mockFormations = [
    {
      id: "mf1",
      title: "Investir en Suisse romande",
      students: 1280,
      rating: 4.9,
      price: 197,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    },
    {
      id: "mf2",
      title: "Gestion locative avancée",
      students: 850,
      rating: 4.8,
      price: 149,
      image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Cover + Avatar */}
      <div className="relative h-48 md:h-56 rounded-b-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C4956A] via-[#C4956A]/60 to-[var(--background)]" />
      </div>
      <div className="px-4 md:px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-28 h-28 rounded-full object-cover border-4 border-[var(--background)]"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {currentUser.firstName} {currentUser.lastName}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {currentUser.city}, {currentUser.country}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {roleBadges.map((r) => (
                <span
                  key={r.key}
                  className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#C4956A]/10 text-[#C4956A]"
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-5 py-2 text-sm rounded-xl border border-[var(--card-border)] text-[var(--foreground)] hover:border-[#C4956A]/50 transition-colors self-start md:self-auto"
          >
            Modifier le profil
          </button>
        </div>

        {/* Certifications / Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { emoji: "\u{1F3C6}", label: "Superh\u00F4te E-Dome" },
            { emoji: "\u2705", label: "Identit\u00E9 v\u00E9rifi\u00E9e" },
            { emoji: "\u{1F4DA}", label: "Formateur certifi\u00E9" },
            { emoji: "\u{1F91D}", label: "Apporteur Bronze" },
          ].map((b) => (
            <span
              key={b.label}
              className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)]"
            >
              {b.emoji} {b.label}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 flex-wrap">
          {[
            { label: "Biens", value: propertyCount },
            { label: "Abonn\u00E9s", value: currentUser.stats.followers },
            { label: "Suivis", value: currentUser.stats.following },
            { label: "Note", value: `${currentUser.stats.rating}/5` },
            { label: "\u00C9tudiants", value: 2130 },
            { label: "Commissions", value: "2\u2009400 CHF" },
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
                tab === t.key
                  ? "text-[#C4956A]"
                  : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4956A] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {tab === "biens" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProperties.map((p) => (
                <Link
                  key={p.id}
                  href={`/explorer/${p.id}`}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden hover:border-[#C4956A]/30 transition-colors"
                >
                  <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[var(--foreground)] truncate">{p.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {p.location.city}, {p.location.country}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-[#C4956A]">
                        {formatPrice(p.price, p.currency)}
                        {p.transactionType === "location-ct" ? "/nuit" : ""}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {p.rating} ({p.reviewCount})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "publications" && (
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <p className="text-sm text-[var(--foreground)]">{post.content}</p>
                  {post.media.length > 0 && (
                    <img src={post.media[0]} alt="" className="w-full h-48 object-cover rounded-lg mt-3" />
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                    <span>{post.likes} likes</span>
                    <span>{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "formations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFormations.map((f) => (
                <Link
                  key={f.id}
                  href={`/formations/${f.id}`}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden hover:border-[#C4956A]/30 transition-colors"
                >
                  <img src={f.image} alt={f.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{f.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                      <span>{f.students} étudiants</span>
                      <span>★ {f.rating}</span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-[#C4956A]">
                      {formatPrice(f.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "avis" && (
            <div className="space-y-6">
              {/* Rating breakdown */}
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[var(--foreground)]">{currentUser.stats.rating}</div>
                    <div className="text-sm text-[var(--text-muted)]">{totalReviews} avis</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-muted)] w-3">{r.stars}</span>
                        <div className="flex-1 h-2 bg-[var(--input-bg)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C4956A] rounded-full"
                            style={{ width: `${totalReviews > 0 ? (r.count / totalReviews) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)] w-6 text-right">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review cards */}
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">{review.author}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`}>
                          ★
                        </span>
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
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{currentUser.bio}</p>
              </div>
              {currentUser.languages && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Langues</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.languages.map((l) => (
                      <span key={l} className="px-3 py-1 text-xs rounded-full bg-[#C4956A]/10 text-[#C4956A]">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {currentUser.certifications && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Certifications</h3>
                  <ul className="space-y-2">
                    {currentUser.certifications.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[#C4956A]">✓</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentUser.responseTime && (
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Temps de réponse</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{currentUser.responseTime}</p>
                </div>
              )}
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Membre depuis</h3>
                <p className="text-sm text-[var(--text-secondary)]">Janvier 2024</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Modifier le profil</h3>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <img src={editForm.photo} alt="" className="w-16 h-16 rounded-full object-cover" />
                <button className="px-4 py-2 text-sm rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]">
                  Changer la photo
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Prénom</label>
                  <input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Nom</label>
                  <input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Ville</label>
                  <input
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Pays</label>
                  <input
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Site web</label>
                <input
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  placeholder="https://"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 text-sm rounded-xl bg-[#C4956A] text-white hover:bg-[#b8845a]"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
