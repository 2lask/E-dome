"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  BadgeCheck,
  Star,
  UserPlus,
  UserCheck,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  Calendar,
  Mail,
  Phone,
  Globe,
  Bed,
  Bath,
  Maximize,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, timeAgo } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { mockUsers, mockProperties, mockPosts, mockReviews } from "@/lib/mock-data";
import { roleLabels } from "@/lib/types";
import type { Role } from "@/lib/types";

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
  { id: "biens", label: "Biens" },
  { id: "publications", label: "Publications" },
  { id: "apropos", label: "A propos" },
] as const;

type Tab = (typeof tabs)[number]["id"];

// ─── Component ──────────────────────────────────────────

export default function PublicProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { formatPrice } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("biens");
  const [isFollowing, setIsFollowing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const user = mockUsers.find((u) => u.id === id) || mockUsers[1];

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
          className="fixed right-6 top-6 z-50 rounded-xl border border-[#C4956A]/30 bg-[#0e0e0e] px-6 py-3 text-sm font-medium text-[#C4956A] shadow-2xl"
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
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              {user.verified && <BadgeCheck className="h-5 w-5 text-[#C4956A]" />}
            </div>

            {/* Role badges */}
            <div className="mt-2 flex flex-wrap gap-2">
              {user.roles.map((role) => (
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
            <div className="mt-2 flex items-center gap-1 text-sm text-[#888]">
              <MapPin className="h-4 w-4" />
              <span>
                {user.city}, {user.country}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition",
                isFollowing
                  ? "border border-[#C4956A]/30 bg-transparent text-[#C4956A] hover:bg-[#C4956A]/5"
                  : "bg-[#C4956A] text-black hover:bg-[#D4A574]"
              )}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4" />
                  Suivi
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Suivre
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/messages")}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-5 py-2 text-sm font-medium text-white transition hover:bg-white/[0.05]"
            >
              <MessageCircle className="h-4 w-4" />
              Contacter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-8">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{user.stats.properties}</p>
            <p className="text-xs text-[#888]">Biens</p>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">{(user.stats.followers + (isFollowing ? 1 : 0)).toLocaleString()}</p>
            <p className="text-xs text-[#888]">Abonnes</p>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">{user.stats.following}</p>
            <p className="text-xs text-[#888]">Suivis</p>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-[#C4956A] text-[#C4956A]" />
            <span className="text-xl font-bold text-white">{user.stats.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="mt-8 border-b border-white/[0.06] px-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative pb-3 text-sm font-medium transition",
                activeTab === tab.id ? "text-[#C4956A]" : "text-[#888] hover:text-white"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="public-profile-tab"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-[#C4956A]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="px-8 py-6">
        {/* Biens */}
        {activeTab === "biens" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userProperties.length === 0 ? (
              <div className="col-span-full rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-12 text-center">
                <p className="text-[#888]">Aucun bien publié pour le moment</p>
              </div>
            ) : (
              userProperties.map((property) => (
                <Link key={property.id} href={`/explorer/${property.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group overflow-hidden rounded-xl border border-white/[0.06] bg-[#0e0e0e] transition hover:border-white/[0.1]"
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
                        <div className="absolute inset-0 flex items-center justify-center text-[#444]">
                          <Maximize className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="truncate text-sm font-semibold text-white group-hover:text-[#C4956A] transition-colors">{property.title}</h3>
                      <p className="mt-1 text-xs text-[#888]">
                        {property.location.city}, {property.location.country}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-[#666]">
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
                        <span className="flex items-center gap-1 text-xs text-[#666]">
                          <Eye className="h-3 w-3" /> {property.views}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Publications */}
        {activeTab === "publications" && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-12 text-center">
                <p className="text-[#888]">Aucune publication pour le moment</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-5"
                >
                  <p className="text-sm leading-relaxed text-white">{post.content}</p>
                  {post.hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="text-xs text-[#C4956A]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-6 text-xs text-[#888]">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> {post.comments.length}
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
            <div className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6">
              <h3 className="mb-3 text-sm font-semibold text-white">Biographie</h3>
              <p className="text-sm leading-relaxed text-[#ccc]">
                {user.bio || "Aucune biographie renseignee."}
              </p>
            </div>

            {/* Contact info */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Informations</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-[#888]" />
                  <span className="text-[#ccc]">
                    {user.city}, {user.country}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-[#888]" />
                  <span className="text-[#ccc]">
                    Membre depuis {formatDate(user.joinedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Specialisations</h3>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
