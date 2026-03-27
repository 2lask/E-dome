"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Users,
  Clock,
  BookOpen,
  Play,
  GraduationCap,
  Filter,
  Video,
  ArrowRight,
} from "lucide-react";
import { cn, formatCount } from "@/lib/utils";
import { mockFormations, mockUsers } from "@/lib/mock-data";
import { useApp } from "@/lib/context";

// ─── Constants ──────────────────────────────────────────

const categories = [
  "Tous",
  "Investissement",
  "Gestion",
  "Juridique",
  "Marketing",
  "Photographie",
  "Location",
  "Apport d'affaires",
  "Vente",
  "Luxe",
  "Rénovation",
];

const popularInstructors = [mockUsers[8], mockUsers[6], mockUsers[3]].filter(Boolean);

// IDs of formations the user has "started" (local simulation)
const STARTED_IDS = new Set(["f1", "f2"]);

// ─── Page ───────────────────────────────────────────────

export default function FormationsPage() {
  const { availableRoles, formatPrice } = useApp();
  const isFormateur = availableRoles.includes("formateur");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = useMemo(() => {
    return mockFormations.filter((f) => {
      const matchCategory =
        activeCategory === "Tous" || f.category === activeCategory;
      const matchSearch =
        !search ||
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase()) ||
        f.instructor.firstName.toLowerCase().includes(search.toLowerCase()) ||
        f.instructor.lastName.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  const featured = mockFormations[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Formations &amp; Cours</h1>
          <p className="mt-1 text-[var(--text-secondary)]">
            Développez vos compétences immobilières
          </p>
        </div>
        {isFormateur && (
          <Link href="/formations/creer" className="px-5 py-2.5 rounded-xl bg-[#C4956A] text-black text-sm font-semibold hover:bg-[#D4A574] transition-colors whitespace-nowrap">
            Créer une formation
          </Link>
        )}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[#C4956A]/40"
          />
        </div>
      </motion.div>

      {/* ── Mes formations en cours ── */}
      {(() => {
        const startedFormations = mockFormations.filter((f) => STARTED_IDS.has(f.id));
        if (startedFormations.length === 0) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-[#C4956A]" />
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Mes formations en cours</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {startedFormations.map((formation) => {
                const completedModules = formation.modules.filter((m) => m.completed).length;
                const progress = Math.max(completedModules / formation.modules.length, 0.05);
                const currentModuleIdx = Math.min(completedModules, formation.modules.length - 1);
                const currentModule = formation.modules[currentModuleIdx];

                return (
                  <div
                    key={formation.id}
                    className="rounded-xl border border-[#C4956A]/20 bg-[var(--card)] p-5 transition-colors hover:border-[#C4956A]/30"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/10">
                        <BookOpen className="h-5 w-5 text-[#C4956A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--foreground)]">{formation.title}</p>
                        <Link href={`/profil/${formation.instructor.id}`} className="text-xs text-[var(--text-secondary)] hover:text-[#C4956A] transition-colors">{formation.instructor.firstName} {formation.instructor.lastName}</Link>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Progression</span>
                        <span className="font-semibold text-[#C4956A]">{Math.round(progress * 100)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--card)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#C4956A] to-[#D4A574] transition-all"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Current module */}
                    <div className="mb-4 rounded-lg bg-white/[0.02] border border-[var(--card-border)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Module en cours</p>
                      <p className="text-xs font-medium text-[var(--text-secondary)] truncate">{currentModule?.title || "Module 1"}</p>
                    </div>

                    <Link href={`/formations/${formation.id}`}>
                      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90">
                        Continuer
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })()}

      {/* ── Category Tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all",
              activeCategory === cat
                ? "bg-[#C4956A]/15 text-[#C4956A]"
                : "bg-[var(--card)] text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]"
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* ── Featured Formation ── */}
      {activeCategory === "Tous" && !search && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail */}
              <div className="relative h-56 w-full overflow-hidden md:h-auto md:w-1/2">
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#C4956A]/30 to-[#0e0e0e]/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-lg bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                    Gratuit
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#C4956A]">
                  Formation vedette
                </span>
                <h2 className="mb-3 text-2xl font-bold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">
                  {featured.title}
                </h2>
                <p className="mb-4 line-clamp-2 text-sm text-[var(--text-secondary)]">
                  {featured.description}
                </p>
                <div className="mb-4 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <Link href={`/profil/${featured.instructor.id}`} className="flex items-center gap-1 hover:text-[#C4956A] transition-colors">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-[9px] font-bold text-black">
                      {featured.instructor.firstName[0]}{featured.instructor.lastName[0]}
                    </div>
                    <span>{featured.instructor.firstName} {featured.instructor.lastName}</span>
                  </Link>
                  <span className="text-[var(--text-muted)]">|</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" />
                    <span>{featured.rating}</span>
                  </div>
                  <span className="text-[var(--text-muted)]">|</span>
                  <span>{formatCount(featured.studentsCount)} étudiants</span>
                </div>
                <Link href={`/formations/${featured.id}`}>
                  <button className="w-fit rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90">
                    Commencer
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Aperçu vidéo ── */}
      {activeCategory === "Tous" && !search && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 text-[#C4956A]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Aperçu vidéo</h2>
          </div>
          <div className="overflow-hidden rounded-xl">
            <video
              poster={featured.thumbnail}
              controls
              preload="metadata"
              className="w-full aspect-video bg-black"
            >
              <source src="/videos/training.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Découvrez un extrait de la formation &laquo; {featured.title} &raquo;
          </p>
        </motion.div>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((formation, i) => {
          const startedProgress = STARTED_IDS.has(formation.id);
          const completedModules = formation.modules.filter((m) => m.completed).length;
          const progress = startedProgress
            ? Math.max(completedModules / formation.modules.length, 0.05)
            : completedModules / formation.modules.length;
          const hasStarted = startedProgress || progress > 0;

          return (
            <motion.div
              key={formation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link href={`/formations/${formation.id}`}>
                <div className="group overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[#C4956A]/20">
                  {/* Thumbnail */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={formation.thumbnail}
                      alt={formation.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </div>
                    </div>
                    <div className="absolute left-3 top-3 flex gap-2">
                      <span className="rounded-md bg-[var(--background)]/80 px-2 py-0.5 text-[10px] font-semibold text-[#C4956A] backdrop-blur-sm">
                        {formation.category}
                      </span>
                      {formation.isFree && (
                        <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400 backdrop-blur-sm">
                          Gratuit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">
                      {formation.title}
                    </h3>

                    {/* Instructor */}
                    <Link href={`/profil/${formation.instructor.id}`} className="mb-3 flex items-center gap-2 hover:text-[#C4956A] transition-colors" onClick={(e) => e.stopPropagation()}>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-[8px] font-bold text-black">
                        {formation.instructor.firstName[0]}{formation.instructor.lastName[0]}
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] hover:text-[#C4956A] transition-colors">
                        {formation.instructor.firstName} {formation.instructor.lastName}
                      </span>
                    </Link>

                    {/* Meta */}
                    <div className="mb-3 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formation.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {formation.modules.length} modules
                      </div>
                    </div>

                    {/* Rating + Students */}
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" />
                        <span className="font-medium text-[var(--foreground)]">{formation.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Users className="h-3 w-3" />
                        {formatCount(formation.studentsCount)}
                      </div>
                    </div>

                    {/* Progress bar if started */}
                    {hasStarted && (
                      <div className="mb-3">
                        <div className="mb-1 flex justify-between text-[10px]">
                          <span className="text-[var(--text-secondary)]">Progression</span>
                          <span className="text-[#C4956A]">{Math.round(progress * 100)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--card)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#C4956A] to-[#D4A574]"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3">
                      <span className="text-lg font-bold text-[var(--foreground)]">
                        {formation.isFree ? "Gratuit" : formatPrice(formation.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <GraduationCap className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <p className="text-lg font-medium text-[var(--text-secondary)]">Aucune formation trouvée</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Essayez un autre terme de recherche ou une autre catégorie</p>
        </div>
      )}

      {/* ── Popular Instructors ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="mb-5 text-xl font-semibold text-[var(--foreground)]">
          Formateurs populaires
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...popularInstructors, mockUsers[2]].filter(Boolean).map((instructor) => {
            const courseCount = mockFormations.filter(
              (f) => f.instructor.id === instructor.id
            ).length;
            return (
              <Link
                key={instructor.id}
                href={`/profil/${instructor.id}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[#C4956A]/20"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-sm font-bold text-black">
                  {instructor.firstName[0]}{instructor.lastName[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {instructor.firstName} {instructor.lastName}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {courseCount} formation{courseCount > 1 ? "s" : ""} &middot;{" "}
                    <Star className="mb-0.5 inline h-3 w-3 text-yellow-400" fill="currentColor" />{" "}
                    {instructor.stats.rating.toFixed(1)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
