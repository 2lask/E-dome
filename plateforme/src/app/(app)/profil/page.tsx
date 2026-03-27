"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  BadgeCheck,
  Star,
  Edit,
  Share2,
  Plus,
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  Mail,
  Phone,
  Globe,
  Bed,
  Bath,
  Maximize,
  Save,
  Check,
  X,
  Reply,
  Languages,
  Award,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, timeAgo } from "@/lib/utils";
import { currentUser, mockProperties, mockPosts, mockReviews } from "@/lib/mock-data";
import { roleLabels } from "@/lib/types";
import type { Role } from "@/lib/types";
import { useApp } from "@/lib/context";

// ─── Role badge colors ─────────────────────────────────

const roleBgColors: Record<Role, string> = {
  client: "bg-gray-500/15 text-gray-400",
  hote: "bg-blue-500/15 text-blue-400",
  proprietaire: "bg-green-500/15 text-green-400",
  agence: "bg-violet-500/15 text-violet-400",
  promoteur: "bg-orange-500/15 text-orange-400",
  apporteur: "bg-yellow-500/15 text-yellow-400",
  investisseur: "bg-red-500/15 text-red-400",
  formateur: "bg-teal-500/15 text-teal-400",
  courtier: "bg-indigo-500/15 text-indigo-400",
  admin: "bg-white/10 text-white",
};

// ─── Tabs ───────────────────────────────────────────────

const tabs = [
  { id: "biens", label: "Mes Biens" },
  { id: "publications", label: "Publications" },
  { id: "apropos", label: "A propos" },
] as const;

type Tab = (typeof tabs)[number]["id"];

// ─── Component ──────────────────────────────────────────

export default function ProfilPage() {
  const { availableRoles, formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("biens");
  const user = currentUser;

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(`${user.firstName} ${user.lastName}`);
  const [editBio, setEditBio] = useState(user.bio || "");
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [repliedIds, setRepliedIds] = useState<Set<string>>(new Set());
  const [replies, setReplies] = useState<Record<string, string>>({});

  useEffect(() => { setMounted(true); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    showToast("Profil sauvegardé !");
  };

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    setReplies((prev) => ({ ...prev, [reviewId]: replyText }));
    setRepliedIds((prev) => new Set(prev).add(reviewId));
    setReplyingTo(null);
    setReplyText("");
    showToast("Réponse publiée !");
  };

  const userProperties = mockProperties.filter((p) => p.host.id === user.id);
  const userPosts = mockPosts.filter((p) => p.author.id === user.id);

  // Rating breakdown
  const ratingCounts = [0, 0, 0, 0, 0];
  mockReviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++;
  });
  const totalReviews = mockReviews.length;
  const avgRating =
    totalReviews > 0
      ? mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* ── Toast ── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed right-6 top-6 z-50 rounded-xl border border-[#C4956A]/30 bg-[var(--card)] px-6 py-3 text-sm font-medium text-[#C4956A] shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {toast}
          </div>
        </motion.div>
      )}

      {/* ─── Cover + Avatar ─── */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop"
          alt="Cover"
          className="h-[200px] w-full rounded-t-2xl object-cover"
        />
        <div className="absolute -bottom-[60px] left-8">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-[120px] w-[120px] rounded-full border-4 border-[#C4956A] object-cover"
            />
          ) : (
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 border-[#C4956A] bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-3xl font-bold text-black">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
          )}
        </div>
      </div>

      {/* ─── User Info ─── */}
      <div className="mt-[70px] px-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-lg border border-[#C4956A]/30 bg-[var(--card)] px-3 py-1 text-2xl font-bold text-[var(--foreground)] outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-[var(--foreground)]">
                  {user.firstName} {user.lastName}
                </h1>
              )}
              {user.verified && <BadgeCheck className="h-5 w-5 text-[#C4956A]" />}
            </div>

            {/* Role badges */}
            <div className="mt-2 flex flex-wrap gap-2">
              {availableRoles.map((role) => (
                <span
                  key={role}
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    roleBgColors[role]
                  )}
                >
                  {roleLabels[role]}
                </span>
              ))}
            </div>

            {/* Location */}
            <div className="mt-2 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <MapPin className="h-4 w-4" />
              <span>
                {user.city}, {user.country}
              </span>
            </div>

            {/* Editable bio */}
            {isEditing && (
              <div className="mt-3">
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Votre biographie..."
                  className="w-full max-w-lg resize-none rounded-lg border border-[#C4956A]/30 bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 rounded-lg bg-[#C4956A] px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#D4A574]"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--card-border)]"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--card-border)]"
                >
                  <Edit className="h-4 w-4" />
                  Modifier le profil
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--card-border)]">
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-8">
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--foreground)]">{user.stats.properties}</p>
            <p className="text-xs text-[var(--text-secondary)]">Biens</p>
          </div>
          <div className="h-8 w-px bg-[var(--card)]" />
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--foreground)]">{user.stats.followers.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)]">Abonnes</p>
          </div>
          <div className="h-8 w-px bg-[var(--card)]" />
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--foreground)]">{user.stats.following}</p>
            <p className="text-xs text-[var(--text-secondary)]">Suivis</p>
          </div>
          <div className="h-8 w-px bg-[var(--card)]" />
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-[#C4956A] text-[#C4956A]" />
            <span className="text-xl font-bold text-[var(--foreground)]">{user.stats.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="mt-8 border-b border-[var(--card-border)] px-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative pb-3 text-sm font-medium transition",
                activeTab === tab.id ? "text-[#C4956A]" : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-[#C4956A]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="px-8 py-6">
        {/* Mes Biens */}
        {activeTab === "biens" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userProperties.map((property) => (
              <Link key={property.id} href={`/explorer/${property.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition hover:border-[var(--card-border)]"
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
                    {property.images && property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
                        <Maximize className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          property.status === "active"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        )}
                      >
                        {property.status === "active" ? "Actif" : property.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="truncate text-sm font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">{property.title}</h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {property.location.city}, {property.location.country}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="h-3 w-3" /> {property.area}m2
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#C4956A]">
                        {formatPrice(property.price, property.currency)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Eye className="h-3 w-3" /> {property.views}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}

            {/* Add property card */}
            <Link href="/publier">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full min-h-[280px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--card-border)] bg-transparent transition hover:border-[#C4956A]/40 hover:bg-[#C4956A]/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--card)]">
                  <Plus className="h-6 w-6 text-[#C4956A]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">Ajouter un bien</span>
              </motion.div>
            </Link>
          </div>
        )}

        {/* Publications */}
        {activeTab === "publications" && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-12 text-center">
                <p className="text-[var(--text-secondary)]">Aucune publication pour le moment</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5"
                >
                  <p className="text-sm leading-relaxed text-[var(--foreground)]">{post.content}</p>
                  {post.hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="text-xs text-[#C4956A]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-6 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {post.comments.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" /> {post.shares}
                    </span>
                    <span className="ml-auto">{timeAgo(post.createdAt)}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Avis déplacés vers les pages des biens (/explorer/[id]) */}

        {/* A propos */}
        {activeTab === "apropos" && (
          <div className="space-y-6">
            {/* Bio */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
              <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Biographie</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {user.bio || "Aucune biographie renseignee."}
              </p>
            </div>

            {/* Contact info */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Informations de contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-secondary)]">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">
                    {user.city}, {user.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Specialisations</h3>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((role) => (
                  <span
                    key={role}
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                      roleBgColors[role]
                    )}
                  >
                    {roleLabels[role]}
                  </span>
                ))}
              </div>
            </div>

            {/* Member since */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)]">
                  Membre depuis {formatDate(user.joinedAt)}
                </span>
              </div>
            </div>

            {/* Langues parlées */}
            {user.languages && user.languages.length > 0 && (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Languages className="h-4 w-4 text-[#C4956A]" />
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Langues parl&eacute;es</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center rounded-full border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {user.certifications && user.certifications.length > 0 && (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#C4956A]" />
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Certifications</h3>
                </div>
                <div className="space-y-3">
                  {user.certifications.map((cert) => (
                    <div
                      key={cert.title}
                      className="rounded-lg border border-[#C4956A]/30 bg-[var(--background)] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/10">
                          <Award className="h-5 w-5 text-[#C4956A]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">{cert.title}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{cert.issuer}</p>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">{cert.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Temps de réponse moyen */}
            {user.responseTime !== undefined && (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C4956A]" />
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Temps de r&eacute;ponse moyen</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                      user.responseTime <= 2
                        ? "bg-green-500/15 text-green-400"
                        : user.responseTime <= 6
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-red-500/15 text-red-400"
                    )}
                  >
                    ~{user.responseTime} heure{user.responseTime > 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {user.responseTime <= 2
                      ? "Rapide"
                      : user.responseTime <= 6
                      ? "Moyen"
                      : "Lent"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
