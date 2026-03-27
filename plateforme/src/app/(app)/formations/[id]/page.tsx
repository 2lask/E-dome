"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  BookOpen,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Award,
  Download,
  Share2,
  X,
} from "lucide-react";
import { cn, formatCount } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { getFormationById, getSimilarFormations, mockFormations } from "@/lib/mock-data";
import { mockReviews } from "@/lib/mock-data";

// ─── Page ───────────────────────────────────────────────

export default function FormationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { formatPrice } = useApp();
  const { id } = use(params);
  const formation = getFormationById(id);
  const [descExpanded, setDescExpanded] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<string>>(() => {
    if (!formation) return new Set();
    return new Set(formation.modules.filter((m) => m.completed).map((m) => m.id));
  });
  const [enrollState, setEnrollState] = useState<"idle" | "loading" | "enrolled">("idle");
  const [showVideo, setShowVideo] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certToast, setCertToast] = useState<string | null>(null);

  const toggleModule = useCallback((moduleId: string) => {
    setCompletedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  const handleEnroll = () => {
    if (enrollState !== "idle") return;
    setEnrollState("loading");
    setTimeout(() => {
      setEnrollState("enrolled");
    }, 1500);
  };

  if (!formation) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-lg text-[var(--text-secondary)]">Formation introuvable</p>
        <Link href="/formations" className="mt-4 text-sm text-[#C4956A] hover:underline">
          Retour aux formations
        </Link>
      </div>
    );
  }

  const similar = getSimilarFormations(formation);
  const completedCount = completedModules.size;
  const progress = completedCount / formation.modules.length;
  const hasStarted = progress > 0;
  const allCompleted = completedCount === formation.modules.length && formation.modules.length > 0;
  const instructor = formation.instructor;
  const instructorCourseCount = mockFormations.filter(
    (f) => f.instructor.id === instructor.id
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Back */}
      <Link
        href="/formations"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux formations
      </Link>

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]"
      >
        {/* Thumbnail / Video player */}
        <div className="relative h-56 overflow-hidden md:h-72">
          {showVideo ? (
            <video
              src="/videos/training.mp4"
              poster={formation.thumbnail}
              controls
              autoPlay
              preload="metadata"
              className="h-full w-full object-cover bg-black"
            />
          ) : (
            <>
              <img
                src={formation.thumbnail}
                alt={formation.title}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <button
                  onClick={() => setShowVideo(true)}
                  className="group/play flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:scale-105 hover:border-[#C4956A]/50 hover:bg-[#C4956A]/20"
                >
                  <Play className="h-10 w-10 text-white transition-colors group-hover/play:text-[#C4956A]" fill="white" />
                </button>
                <span className="mt-3 text-sm font-medium text-[var(--text-secondary)]">Regarder l&apos;aper&ccedil;u</span>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-[#C4956A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C4956A]">
              {formation.category}
            </span>
            <span className="rounded-md bg-white/5 px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
              {formation.level}
            </span>
          </div>

          <h1 className="mb-4 text-2xl font-bold text-[var(--foreground)] md:text-3xl">
            {formation.title}
          </h1>

          {/* Meta row */}
          <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            <Link href={`/profil/${instructor.id}`} className="flex items-center gap-2 hover:text-[#C4956A] transition-colors">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-[10px] font-bold text-black">
                {instructor.firstName[0]}{instructor.lastName[0]}
              </div>
              <span>{instructor.firstName} {instructor.lastName}</span>
            </Link>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <span className="font-medium text-[var(--foreground)]">{formation.rating}</span>
              <span>({formation.studentsCount} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {formatCount(formation.studentsCount)} etudiants
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formation.duration}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-3xl font-bold text-[var(--foreground)]">
              {formation.isFree ? "Gratuit" : formatPrice(formation.price)}
            </span>
            <button
              onClick={handleEnroll}
              disabled={enrollState === "enrolled"}
              className={cn(
                "rounded-xl px-8 py-3 text-sm font-semibold transition-all",
                enrollState === "enrolled"
                  ? "bg-emerald-500/20 text-emerald-400 cursor-default"
                  : enrollState === "loading"
                  ? "bg-[#C4956A]/50 text-black/50 cursor-wait"
                  : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
              )}
            >
              {enrollState === "enrolled" ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Inscrit
                </span>
              ) : enrollState === "loading" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Inscription...
                </span>
              ) : hasStarted ? (
                "Continuer"
              ) : (
                "S'inscrire"
              )}
            </button>
          </div>

          {/* Progress */}
          {hasStarted && (
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">{completedCount}/{formation.modules.length} modules completes</span>
                <span className="text-[#C4956A]">{Math.round(progress * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--card)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#C4956A] to-[#D4A574]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Certificate Modal ── */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            key="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative mx-4 w-full max-w-2xl"
            >
              <button
                onClick={() => setShowCertificate(false)}
                className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card)] text-[var(--text-secondary)] transition-colors hover:text-[var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Certificate design */}
              <div className="rounded-2xl border-4 border-[#C4956A]/60 bg-[var(--card)] p-8 md:p-12">
                <div className="rounded-xl border-2 border-[#C4956A]/30 p-6 md:p-10 text-center">
                  {/* Logo */}
                  <div className="mb-2 text-3xl font-black tracking-wider text-[#C4956A]">E-DOME</div>
                  <div className="mb-6 h-px bg-gradient-to-r from-transparent via-[#C4956A]/50 to-transparent" />

                  {/* Title */}
                  <h2 className="mb-1 text-sm font-medium uppercase tracking-widest text-[var(--text-secondary)]">Certificat de r&eacute;ussite</h2>
                  <div className="mb-6 flex justify-center">
                    <Award className="h-12 w-12 text-[#C4956A]" />
                  </div>

                  <p className="mb-1 text-sm text-[var(--text-secondary)]">D&eacute;cern&eacute; &agrave;</p>
                  <p className="mb-4 text-2xl font-bold text-[var(--foreground)]">Karim Benali</p>

                  <p className="mb-1 text-sm text-[var(--text-secondary)]">Pour avoir compl&eacute;t&eacute; avec succ&egrave;s</p>
                  <p className="mb-6 text-xl font-semibold text-[#C4956A]">{formation.title}</p>

                  <div className="mb-6 h-px bg-gradient-to-r from-transparent via-[#C4956A]/30 to-transparent" />

                  <div className="flex items-center justify-around text-sm text-[var(--text-secondary)]">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Date</p>
                      <p className="font-medium text-[var(--foreground)]">{new Date().toLocaleDateString('fr-CH')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Formateur</p>
                      <p className="font-medium text-[var(--foreground)]">{instructor.firstName} {instructor.lastName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setCertToast("Certificat t\u00e9l\u00e9charg\u00e9 !");
                    setTimeout(() => setCertToast(null), 3000);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  T&eacute;l&eacute;charger en PDF
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: `Certificat E-Dome - ${formation.title}`, text: `J'ai obtenu mon certificat pour la formation "${formation.title}" sur E-Dome !` });
                    } else {
                      setCertToast("Lien copi\u00e9 !");
                      setTimeout(() => setCertToast(null), 3000);
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Certificate Toast ── */}
      <AnimatePresence>
        {certToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--foreground)] shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              {certToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Celebration Banner ── */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#C4956A]/30 bg-gradient-to-r from-[#C4956A]/15 via-[#0e0e0e] to-[#C4956A]/15 p-6 text-center"
        >
          <div className="mb-3 text-4xl">{"\uD83C\uDF89"}</div>
          <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
            F&eacute;licitations ! Vous avez termin&eacute; cette formation
          </h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Vous avez compl&eacute;t&eacute; les {formation.modules.length} modules avec succ&egrave;s.
          </p>
          <button
            onClick={() => setShowCertificate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Award className="h-4 w-4" />
            T&eacute;l&eacute;charger le certificat
          </button>
        </motion.div>
      )}

      {/* ── Description ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6"
      >
        <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Description</h2>
        <p className={cn("text-sm leading-relaxed text-[var(--text-secondary)]", !descExpanded && "line-clamp-3")}>
          {formation.description}
        </p>
        <button
          onClick={() => setDescExpanded(!descExpanded)}
          className="mt-2 flex items-center gap-1 text-sm text-[#C4956A] hover:underline"
        >
          {descExpanded ? (
            <>Voir moins <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>Voir plus <ChevronDown className="h-4 w-4" /></>
          )}
        </button>
      </motion.div>

      {/* ── Modules List (Accordion) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
          Programme ({formation.modules.length} modules)
        </h2>
        <div className="space-y-2">
          {formation.modules.map((mod, i) => {
            const isCompleted = completedModules.has(mod.id);
            const isActive = activeModuleId === mod.id;
            return (
              <div
                key={mod.id}
                className={cn(
                  "overflow-hidden rounded-lg border transition-colors",
                  isCompleted
                    ? "border-green-500/20 bg-green-500/5"
                    : isActive
                    ? "border-[#C4956A]/30 bg-[var(--background)]"
                    : "border-[var(--card-border)] bg-[var(--background)] hover:border-[#C4956A]/20"
                )}
              >
                {/* Module header — clickable */}
                <button
                  onClick={() => setActiveModuleId(isActive ? null : mod.id)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left"
                >
                  {/* Number / Check circle */}
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                      isCompleted
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/5 text-[var(--text-secondary)]"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium",
                      isCompleted ? "text-green-400 line-through" : "text-[var(--foreground)]"
                    )}>
                      {mod.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">{mod.duration}</p>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 flex-shrink-0 text-[var(--text-secondary)] transition-transform duration-200",
                      isActive && "rotate-180 text-[#C4956A]"
                    )}
                  />
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--card-border)] px-4 py-4 space-y-4">
                        {/* Video player */}
                        <div className="overflow-hidden rounded-lg bg-black aspect-video">
                          <video
                            src="/videos/training.mp4"
                            controls
                            preload="metadata"
                            className="h-full w-full"
                          />
                        </div>

                        {/* Module description */}
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {mod.title} — Apprenez les concepts fondamentaux de ce module et mettez en pratique les connaissances acquises au travers d&apos;exercices concrets.
                        </p>

                        {/* Mark complete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModule(mod.id);
                          }}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                            isCompleted
                              ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                              : "bg-[#C4956A]/15 text-[#C4956A] hover:bg-[#C4956A]/25"
                          )}
                        >
                          <Check className="h-4 w-4" />
                          {isCompleted ? "Termine" : "Marquer comme termine"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Instructor Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Formateur</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href={`/profil/${instructor.id}`} className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
            {instructor.avatar ? (
              <img src={instructor.avatar} alt={`${instructor.firstName} ${instructor.lastName}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-lg font-bold text-black">
                {instructor.firstName[0]}{instructor.lastName[0]}
              </div>
            )}
          </Link>
          <div>
            <Link href={`/profil/${instructor.id}`} className="text-lg font-semibold text-[var(--foreground)] hover:text-[#C4956A] transition-colors">
              {instructor.firstName} {instructor.lastName}
            </Link>
            <p className="mb-3 text-sm text-[var(--text-secondary)]">{instructor.bio || "Formateur sur E-Dome"}</p>
            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
                {instructor.stats.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatCount(instructor.stats.followers)} abonnes
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {instructorCourseCount} formation{instructorCourseCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Reviews ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Avis</h2>
        <div className="space-y-4">
          {mockReviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full">
                    {review.author.avatar ? (
                      <img src={review.author.avatar} alt={`${review.author.firstName} ${review.author.lastName}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-[10px] font-bold text-black">
                        {review.author.firstName[0]}{review.author.lastName[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {review.author.firstName} {review.author.lastName}
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn("h-3 w-3", i < review.rating ? "text-yellow-400" : "text-[var(--text-muted)]")}
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{review.content}</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">{review.date}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Similar Formations ── */}
      {similar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            Formations similaires
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {similar.map((f) => (
              <Link key={f.id} href={`/formations/${f.id}`} className="w-64 flex-shrink-0">
                <div className="group overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[#C4956A]/20">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={f.thumbnail}
                      alt={f.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="mb-1 line-clamp-2 text-sm font-semibold text-[var(--foreground)]">
                      {f.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
                        {f.rating}
                      </span>
                      <span className="font-medium text-[var(--foreground)]">
                        {f.isFree ? "Gratuit" : formatPrice(f.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
