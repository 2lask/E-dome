"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  HeartOff,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowUpDown,
  BookOpen,
  ThumbsUp,
  Share2,
  Bookmark,
  Building2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, timeAgo } from "@/lib/utils";
import {
  mockProperties,
  mockPosts,
  favoritePostIds,
} from "@/lib/mock-data";
import { useApp } from "@/lib/context";

type Tab = "biens" | "publications";
type SortKey = "recent" | "price-asc" | "price-desc";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Plus récent" },
  { key: "price-asc", label: "Prix croissant" },
  { key: "price-desc", label: "Prix décroissant" },
];

const transactionLabels: Record<string, string> = {
  vente: "Vente",
  "location-lt": "Location longue durée",
  "location-ct": "Location courte durée",
};

export default function FavorisPage() {
  const { favorites, toggleFavorite, formatPrice } = useApp();
  const [tab, setTab] = useState<Tab>("biens");
  const [sort, setSort] = useState<SortKey>("recent");
  const [favPosts, setFavPosts] = useState<string[]>(favoritePostIds);
  const [removingProp, setRemovingProp] = useState<string | null>(null);
  const [removingPost, setRemovingPost] = useState<string | null>(null);

  const favoriteProps = useMemo(() => {
    const items = mockProperties.filter((p) => favorites.has(p.id));

    switch (sort) {
      case "price-asc":
        return [...items].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...items].sort((a, b) => b.price - a.price);
      default:
        return [...items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [favorites, sort]);

  const favoritePosts = useMemo(() => {
    return mockPosts.filter((p) => favPosts.includes(p.id));
  }, [favPosts]);

  const removeProp = useCallback((id: string) => {
    setRemovingProp(id);
    setTimeout(() => {
      toggleFavorite(id);
      setRemovingProp(null);
    }, 400);
  }, [toggleFavorite]);

  const removePost = useCallback((id: string) => {
    setRemovingPost(id);
    setTimeout(() => {
      setFavPosts((prev) => prev.filter((pid) => pid !== id));
      setRemovingPost(null);
    }, 400);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold md:text-3xl">Favoris</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Retrouvez vos biens et publications sauvegardés
        </p>
      </motion.div>

      {/* Tabs + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1">
          {(["biens", "publications"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                tab === t
                  ? "text-[#C4956A]"
                  : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              )}
            >
              {t === "biens" ? `Biens (${favorites.size})` : `Publications (${favPosts.length})`}
              {tab === t && (
                <motion.div
                  layoutId="favtab"
                  className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-[#C4956A]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Sort (only for biens tab) */}
        {tab === "biens" && (
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-[var(--text-secondary)]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none focus:border-[#C4956A]/30"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ─── Biens Tab ───────────────────────────────────── */}
      {tab === "biens" && (
        <AnimatePresence mode="popLayout">
          {favoriteProps.length === 0 ? (
            <motion.div
              key="empty-props"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-20"
            >
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#C4956A]/10">
                <Heart className="h-10 w-10 text-[#C4956A]/40" />
              </div>
              <p className="text-lg font-medium text-[var(--text-secondary)]">Vous n&apos;avez pas encore de favoris</p>
              <p className="mt-2 max-w-sm text-center text-sm text-[var(--text-muted)]">
                Explorez les biens et ajoutez-les à vos favoris
              </p>
              <Link href="/explorer">
                <button className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90">
                  <Search className="h-4 w-4" />
                  Explorer
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid-props"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {favoriteProps.map((property, i) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: removingProp === property.id ? 0 : 1,
                    y: removingProp === property.id ? -10 : 0,
                    scale: removingProp === property.id ? 0.95 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.9, height: 0 }}
                  transition={{ delay: removingProp === property.id ? 0 : i * 0.06, duration: 0.3 }}
                  className="group overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[var(--card-border)]"
                >
                  <Link href={`/explorer/${property.id}`}>
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
                    {property.images && property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                        <Building2 className="h-12 w-12" />
                      </div>
                    )}
                    {/* Badge */}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-lg bg-[#C4956A]/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {transactionLabels[property.transactionType]}
                      </span>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeProp(property.id); }}
                      className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-red-400 backdrop-blur-sm transition-colors hover:bg-black/70"
                    >
                      <HeartOff className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold leading-snug">
                        {property.title}
                      </h3>
                    </div>

                    <p className="mb-3 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                      <MapPin className="h-3.5 w-3.5" />
                      {property.location.city}, {property.location.country}
                    </p>

                    {/* Stats */}
                    <div className="mb-4 flex gap-4 text-sm text-[var(--text-secondary)]">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Maximize2 className="h-3.5 w-3.5" /> {property.area} m²
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3">
                      <p className="text-lg font-bold text-[#C4956A]">
                        {formatPrice(property.price, property.currency)}
                      </p>
                      {property.pricePerNight && (
                        <span className="text-xs text-[var(--text-secondary)]">
                          {formatPrice(property.pricePerNight, property.currency)}/nuit
                        </span>
                      )}
                    </div>
                  </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ─── Publications Tab ────────────────────────────── */}
      {tab === "publications" && (
        <AnimatePresence mode="popLayout">
          {favoritePosts.length === 0 ? (
            <motion.div
              key="empty-posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-20"
            >
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#C4956A]/10">
                <BookOpen className="h-10 w-10 text-[#C4956A]/40" />
              </div>
              <p className="text-lg font-medium text-[var(--text-secondary)]">Aucune publication sauvegardée</p>
              <p className="mt-2 max-w-sm text-center text-sm text-[var(--text-muted)]">
                Sauvegardez des publications depuis le fil d&apos;actualité
              </p>
            </motion.div>
          ) : (
            <motion.div key="list-posts" className="space-y-4">
              {favoritePosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: removingPost === post.id ? 0 : 1,
                    y: removingPost === post.id ? -10 : 0,
                    scale: removingPost === post.id ? 0.95 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ delay: removingPost === post.id ? 0 : i * 0.06, duration: 0.3 }}
                  className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--card-border)]"
                >
                  {/* Author row */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C4956A]/10 text-sm font-semibold text-[#C4956A]">
                        {post.author.firstName[0]}
                        {post.author.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {post.author.firstName} {post.author.lastName}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {timeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removePost(post.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      <HeartOff className="h-3.5 w-3.5" />
                      Retirer
                    </button>
                  </div>

                  {/* Content */}
                  <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {post.content.length > 200
                      ? post.content.slice(0, 200) + "..."
                      : post.content}
                  </p>

                  {/* Engagement stats */}
                  <div className="flex gap-5 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" /> {post.shares}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="h-3.5 w-3.5" /> {post.saves}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
