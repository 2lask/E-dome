"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Home,
  GraduationCap,
  Users,
  Calendar,
  MapPin,
  Star,
  Clock,
  BookOpen,
  BedDouble,
  Bath,
  Maximize2,
} from "lucide-react";
import { useApp } from "@/lib/context";
import {
  mockProperties,
  mockFormations,
  mockUsers,
  mockEventsExtended,
} from "@/lib/mock-data";

// ─── Page ───────────────────────────────────────────────

export default function RecherchePage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl flex items-center justify-center py-20">
        <div className="text-[var(--text-secondary)] text-sm">Chargement...</div>
      </div>
    }>
      <RechercheContent />
    </Suspense>
  );
}

function RechercheContent() {
  const { formatPrice } = useApp();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const results = useMemo(() => {
    if (!query.trim()) {
      return { properties: [], formations: [], users: [], events: [] };
    }

    const properties = mockProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.location.city.toLowerCase().includes(query) ||
        p.location.country.toLowerCase().includes(query)
    );

    const formations = mockFormations.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query)
    );

    const users = mockUsers.filter(
      (u) =>
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(query)
    );

    const events = mockEventsExtended.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
    );

    return { properties, formations, users, events };
  }, [query]);

  const totalResults =
    results.properties.length +
    results.formations.length +
    results.users.length +
    results.events.length;

  const hasNoResults = query.trim() && totalResults === 0;
  const hasNoQuery = !query.trim();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Recherche</h1>
        {query.trim() && (
          <p className="mt-2 text-[var(--text-secondary)]">
            {totalResults} résultat{totalResults !== 1 ? "s" : ""} pour{" "}
            <span className="font-semibold text-[#C4956A]">
              &laquo; {searchParams.get("q")} &raquo;
            </span>
          </p>
        )}
      </motion.div>

      {/* Empty states */}
      {hasNoQuery && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--card)]">
            <Search className="h-8 w-8 text-[var(--text-muted)]" />
          </div>
          <p className="mt-4 text-lg font-medium text-[var(--text-secondary)]">
            Lancez une recherche
          </p>
          <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
            Utilisez la barre de recherche pour trouver des biens, formations,
            utilisateurs ou événements
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C4956A] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574]"
            >
              <Home className="h-4 w-4" />
              Explorer les biens
            </Link>
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white/[0.03]"
            >
              <GraduationCap className="h-4 w-4" />
              Formations
            </Link>
          </div>
        </div>
      )}

      {hasNoResults && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--card)]">
            <Search className="h-8 w-8 text-[var(--text-muted)]" />
          </div>
          <p className="mt-4 text-lg font-medium text-[var(--text-secondary)]">
            Aucun résultat trouvé
          </p>
          <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
            Aucun résultat ne correspond à &laquo; {searchParams.get("q")} &raquo;. Essayez un autre terme de recherche.
          </p>
          <Link
            href="/explorer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#C4956A]/30 px-5 py-2.5 text-sm font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/5"
          >
            <Home className="h-4 w-4" />
            Explorer les biens
          </Link>
        </div>
      )}

      {/* ── Biens immobiliers ── */}
      {results.properties.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-[#C4956A]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Biens immobiliers
            </h2>
            <span className="rounded-full bg-[#C4956A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C4956A]">
              {results.properties.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.properties.slice(0, 6).map((property) => (
              <Link key={property.id} href={`/explorer/${property.id}`}>
                <div className="group overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[#C4956A]/20">
                  <div className="relative h-40 overflow-hidden bg-white/[0.02]">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-bold text-[#C4956A]">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-[var(--foreground)]">
                      {property.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                      <MapPin className="h-3 w-3" />
                      {property.location.city}, {property.location.country}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3.5 w-3.5" />{" "}
                          {property.bedrooms}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="h-3.5 w-3.5" /> {property.area}m²
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Formations ── */}
      {results.formations.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#C4956A]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Formations</h2>
            <span className="rounded-full bg-[#C4956A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C4956A]">
              {results.formations.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.formations.slice(0, 6).map((formation) => (
              <Link key={formation.id} href={`/formations/${formation.id}`}>
                <div className="group overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[#C4956A]/20">
                  <div className="relative h-36 overflow-hidden bg-white/[0.02]">
                    <img
                      src={formation.thumbnail}
                      alt={formation.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
                    <div className="absolute left-3 top-3">
                      <span className="rounded-md bg-[var(--background)]/80 px-2 py-0.5 text-[10px] font-semibold text-[#C4956A] backdrop-blur-sm">
                        {formation.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">
                      {formation.title}
                    </h3>
                    <div className="mb-2 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formation.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {formation.modules.length} modules
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-3.5 w-3.5 text-yellow-400"
                          fill="currentColor"
                        />
                        <span className="font-medium text-[var(--foreground)]">
                          {formation.rating}
                        </span>
                      </div>
                      <span className="font-bold text-[var(--foreground)]">
                        {formation.isFree
                          ? "Gratuit"
                          : formatPrice(formation.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Utilisateurs ── */}
      {results.users.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#C4956A]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Utilisateurs</h2>
            <span className="rounded-full bg-[#C4956A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C4956A]">
              {results.users.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.users.slice(0, 8).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[#C4956A]/20"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-sm font-bold text-black">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{user.city}</p>
                </div>
                <Link
                  href={`/profil/${user.id}`}
                  className="flex-shrink-0 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/5"
                >
                  Voir profil
                </Link>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Événements ── */}
      {results.events.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#C4956A]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Événements</h2>
            <span className="rounded-full bg-[#C4956A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C4956A]">
              {results.events.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.events.slice(0, 6).map((event) => (
              <Link key={event.id} href="/evenements">
                <div className="group rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 transition-colors hover:border-[#C4956A]/20">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-white">
                      <span className="text-sm font-bold leading-none">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-[8px] font-medium uppercase">
                        {new Date(event.date).toLocaleDateString("fr-CH", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">{event.time}</p>
                    </div>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs text-[var(--text-secondary)]">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.registered}/{event.spots}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
