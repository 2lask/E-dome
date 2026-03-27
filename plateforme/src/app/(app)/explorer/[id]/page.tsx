"use client";

import { use, useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Heart,
  Share2,
  BedDouble,
  Bath,
  Maximize2,
  Building2,
  Check,
  X,
  Eye,
  Calendar,
  Clock,
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  Camera,
  Play,
  Video,
  Wifi,
  Car,
  Waves,
  TreePine,
  Wind,
  Flame,
  Sofa,
  Mountain,
  Anchor,
  Home,
  Sparkles,
  CircleCheck,
  CircleDot,
  Link2,
  Mail,
  Send,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  Calculator,
  Facebook,
  Flag,
  Copy,
  Printer,
  Loader2,
} from "lucide-react";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { useApp } from "@/lib/context";
import {
  getPropertyById,
  getSimilarProperties,
  getReviewsForProperty,
  mockProperties,
  currentUser,
} from "@/lib/mock-data";
import type { Property, PaidOption } from "@/lib/types";

// ─── Equipment icon mapping ─────────────────────────────

const equipmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Piscine: Waves,
  Parking: Car,
  Jardin: TreePine,
  Terrasse: Mountain,
  Ascenseur: Building2,
  Balcon: Home,
  Climatisation: Wind,
  "Cheminée": Flame,
  "Meublé": Sofa,
  Cave: Home,
  Garage: Car,
  "Wi-Fi": Wifi,
  Jacuzzi: Waves,
  Sauna: Flame,
  "Vue lac": Eye,
  "Vue mer": Anchor,
  "Vue montagne": Mountain,
};

// ─── Equipment grouping ─────────────────────────────────

function groupEquipment(equipment: string[]) {
  const interior = [
    "Climatisation", "Cheminée", "Meublé", "Ascenseur", "Cave",
    "Wi-Fi", "TV écran plat", "Coffre-fort", "Fer à repasser",
    "Lave-vaisselle", "Machine à laver", "Sèche-linge",
    "Home cinéma", "Cave à vin", "Domotique", "Sauna",
  ];
  const exterior = [
    "Piscine", "Parking", "Jardin", "Terrasse", "Balcon",
    "Garage", "Jacuzzi", "Portail électrique", "Parking vélo",
    "Ski-in/Ski-out",
  ];
  const views = [
    "Vue lac", "Vue mer", "Vue montagne",
  ];

  const groups: { title: string; items: string[] }[] = [];
  const intItems = equipment.filter((e) => interior.includes(e));
  const extItems = equipment.filter((e) => exterior.includes(e));
  const viewItems = equipment.filter((e) => views.includes(e));
  const otherItems = equipment.filter(
    (e) => !interior.includes(e) && !exterior.includes(e) && !views.includes(e)
  );

  if (intItems.length) groups.push({ title: "Intérieur", items: intItems });
  if (extItems.length) groups.push({ title: "Extérieur", items: extItems });
  if (viewItems.length) groups.push({ title: "Vues & Services", items: viewItems });
  if (otherItems.length) groups.push({ title: "Autres", items: otherItems });

  return groups;
}

// ─── Transaction labels ─────────────────────────────────

const transactionLabels: Record<string, string> = {
  vente: "Vente",
  "location-lt": "Location longue durée",
  "location-ct": "Location courte durée",
};

// ─── Calendar Component ─────────────────────────────────

function AvailabilityCalendar({
  availabilities,
  month,
  year,
}: {
  availabilities: { start: string; end: string }[];
  month: number;
  year: number;
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const dayNames = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];

  const isAvailable = (day: number) => {
    const date = new Date(year, month, day);
    return availabilities.some((a) => {
      const start = new Date(a.start);
      const end = new Date(a.end);
      return date >= start && date <= end;
    });
  };

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const available = isAvailable(d);
    const today = new Date();
    const isPast =
      new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    days.push(
      <div
        key={d}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors",
          isPast
            ? "text-[var(--text-muted)]"
            : available
              ? "bg-[#C4956A]/20 text-[#C4956A] font-medium"
              : "bg-red-500/10 text-red-400/60"
        )}
      >
        {d}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-center text-sm font-semibold text-[var(--foreground)]">
        {monthNames[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((d) => (
          <div key={d} className="flex h-9 w-9 items-center justify-center text-xs text-[var(--text-secondary)]">
            {d}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}

// ─── Star Rating Component ──────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            s <= Math.round(rating)
              ? "fill-[#C4956A] text-[#C4956A]"
              : "text-[var(--text-muted)]"
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

// ─── Property Card (for similar) ────────────────────────

function PropertyMiniCard({ property }: { property: Property }) {
  const { formatPrice } = useApp();
  return (
    <Link href={`/explorer/${property.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group min-w-[280px] overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[var(--card-border)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
            <Camera className="h-8 w-8" />
          </div>
          <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {transactionLabels[property.transactionType]}
          </div>
        </div>
        <div className="p-4">
          <p className="text-lg font-bold text-[#C4956A]">
            {formatPrice(property.price, property.currency)}
            {property.transactionType !== "vente" && (
              <span className="text-sm font-normal text-[var(--text-secondary)]">
                {property.transactionType === "location-ct" ? "/nuit" : "/mois"}
              </span>
            )}
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
                <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
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
      </motion.div>
    </Link>
  );
}

// ─── DPE Badge ──────────────────────────────────────────

const dpeBadgeColors: Record<string, string> = {
  A: "bg-green-500/20 text-green-400 border-green-500/30",
  B: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  D: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  E: "bg-red-500/20 text-red-400 border-red-500/30",
  F: "bg-red-700/20 text-red-500 border-red-700/30",
  G: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const potentielColors: Record<string, string> = {
  Faible: "bg-gray-500/20 text-gray-400",
  Moyen: "bg-yellow-500/20 text-yellow-400",
  "Élevé": "bg-orange-500/20 text-orange-400",
  "Très élevé": "bg-green-500/20 text-green-400",
};

// ─── Investment Analytics Component ─────────────────────

function InvestmentAnalytics({ property }: { property: Property }) {
  const { formatPrice } = useApp();
  const a = property.analytics!;
  const [showSimulator, setShowSimulator] = useState(false);
  const [apport, setApport] = useState(Math.round(property.price * 0.2));
  const [tauxCredit, setTauxCredit] = useState(1.5);
  const [duree, setDuree] = useState(25);

  const mensualite = useMemo(() => {
    if (property.transactionType !== "vente") return 0;
    const capital = property.price - apport;
    if (capital <= 0) return 0;
    const tauxMensuel = tauxCredit / 100 / 12;
    if (tauxMensuel === 0) return capital / (duree * 12);
    return (capital * tauxMensuel * Math.pow(1 + tauxMensuel, duree * 12)) /
      (Math.pow(1 + tauxMensuel, duree * 12) - 1);
  }, [apport, tauxCredit, duree, property.price, property.transactionType]);

  const coutTotalCredit = mensualite * duree * 12;
  const cashFlowMensuel = a.rendementNet
    ? (property.price * (a.rendementNet / 100)) / 12 - mensualite
    : 0;

  // formatPrice is provided by useApp() context above

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
        <TrendingUp className="h-5 w-5 text-[#C4956A]" />
        Données d&apos;Investissement
      </h2>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
        {/* Grid of analytics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Rendement brut */}
          {a.rendementBrut != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">Rendement brut</p>
              <p className="text-lg font-bold text-[#C4956A]">{a.rendementBrut}%</p>
            </div>
          )}

          {/* Rendement net */}
          {a.rendementNet != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">Rendement net</p>
              <p className="text-lg font-bold text-[#C4956A]">{a.rendementNet}%</p>
            </div>
          )}

          {/* Prix au m² */}
          {a.prixM2 != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">Prix au m²</p>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {formatPrice(a.prixM2)}
              </p>
            </div>
          )}

          {/* DPE */}
          {a.dpe && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">DPE</p>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold border",
                  dpeBadgeColors[a.dpe] || dpeBadgeColors.G
                )}
              >
                {a.dpe}
              </span>
            </div>
          )}

          {/* Charges annuelles */}
          {a.chargesAnnuelles != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">Charges annuelles</p>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {formatPrice(a.chargesAnnuelles)}
              </p>
            </div>
          )}

          {/* Etat general */}
          {a.etatGeneral && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">État général</p>
              <p className="text-sm font-semibold text-[var(--foreground)]">{a.etatGeneral}</p>
            </div>
          )}

          {/* Annee construction */}
          {a.anneeConstruction != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">Année de construction</p>
              <p className="text-sm font-semibold text-[var(--foreground)]">{a.anneeConstruction}</p>
            </div>
          )}

          {/* Potentiel plus-value */}
          {a.potentielPlusValue && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">Potentiel plus-value</p>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold",
                  potentielColors[a.potentielPlusValue] || "bg-gray-500/20 text-gray-400"
                )}
              >
                {a.potentielPlusValue === "Très élevé" ? "Très élevé" : a.potentielPlusValue}
              </span>
            </div>
          )}

          {/* ROI 5 ans */}
          {a.roi5ans != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">ROI estimé 5 ans</p>
              <p className="text-sm font-semibold text-green-400">+{a.roi5ans}%</p>
            </div>
          )}

          {/* ROI 10 ans */}
          {a.roi10ans != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">ROI estimé 10 ans</p>
              <p className="text-sm font-semibold text-green-400">+{a.roi10ans}%</p>
            </div>
          )}

          {/* Taux d'occupation */}
          {a.tauxOccupation != null && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">Taux d&apos;occupation</p>
              <p className="text-lg font-bold text-[#C4956A]">{a.tauxOccupation}%</p>
            </div>
          )}
        </div>

        {/* Investment simulator (vente only) */}
        {property.transactionType === "vente" && (
          <div className="border-t border-[var(--card-border)] pt-4">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="flex w-full items-center justify-between rounded-lg bg-white/[0.04] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/[0.06] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#C4956A]" />
                Simuler mon investissement
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[var(--text-secondary)] transition-transform",
                  showSimulator && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {showSimulator && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4">
                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                          Apport personnel (CHF)
                        </label>
                        <input
                          type="number"
                          value={apport}
                          onChange={(e) => setApport(Number(e.target.value))}
                          className="w-full rounded-lg bg-white/[0.04] border border-[var(--card-border)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[#C4956A]/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                          Taux crédit (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={tauxCredit}
                          onChange={(e) => setTauxCredit(Number(e.target.value))}
                          className="w-full rounded-lg bg-white/[0.04] border border-[var(--card-border)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[#C4956A]/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                          Durée (années)
                        </label>
                        <input
                          type="number"
                          value={duree}
                          onChange={(e) => setDuree(Number(e.target.value))}
                          className="w-full rounded-lg bg-white/[0.04] border border-[var(--card-border)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[#C4956A]/40"
                        />
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-[#C4956A]/5 border border-[#C4956A]/20 p-4">
                      <div className="space-y-1">
                        <p className="text-xs text-[var(--text-secondary)]">Mensualité</p>
                        <p className="text-lg font-bold text-[#C4956A]">
                          {formatPrice(Math.round(mensualite))}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[var(--text-secondary)]">Coût total crédit</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {formatPrice(Math.round(coutTotalCredit))}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[var(--text-secondary)]">Cash-flow mensuel estimé</p>
                        <p
                          className={cn(
                            "text-lg font-bold",
                            cashFlowMensuel >= 0 ? "text-green-400" : "text-red-400"
                          )}
                        >
                          {cashFlowMensuel >= 0 ? "+" : ""}
                          {formatPrice(Math.abs(Math.round(cashFlowMensuel)))}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Page Component ────────────────────────────────

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const property = getPropertyById(id);

  if (!property) {
    return <NotFoundView />;
  }

  return <PropertyDetail property={property} />;
}

// ─── 404 View ───────────────────────────────────────────

function NotFoundView() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
          <Home className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Bien introuvable</h1>
        <p className="text-[var(--text-secondary)]">
          Ce bien n&apos;existe pas ou a été retiré de la plateforme.
        </p>
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#C4956A] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574]"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour à l&apos;exploration
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Property Detail View ───────────────────────────────

function PropertyDetail({ property }: { property: Property }) {
  const { formatPrice } = useApp();
  const [currentImage, setCurrentImage] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Availability request state (Task 7)
  const [availCheckIn, setAvailCheckIn] = useState("");
  const [availCheckOut, setAvailCheckOut] = useState("");
  const [availGuests, setAvailGuests] = useState(2);
  const [availMessage, setAvailMessage] = useState("");
  const [availSent, setAvailSent] = useState(false);
  const [availSubmitting, setAvailSubmitting] = useState(false);

  // Fullscreen gallery state
  const [fullscreenGallery, setFullscreenGallery] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [userReviews, setUserReviews] = useState<Array<{
    id: string;
    author: { firstName: string; lastName: string };
    rating: number;
    content: string;
    date: string;
  }>>([]);
  const [reviewToast, setReviewToast] = useState(false);

  // Task 5: Recently viewed tracking
  useEffect(() => {
    try {
      const key = "recentlyViewed";
      const stored = localStorage.getItem(key);
      let ids: string[] = stored ? JSON.parse(stored) : [];
      ids = ids.filter((v: string) => v !== property.id);
      ids.unshift(property.id);
      ids = ids.slice(0, 5);
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {}
  }, [property.id]);

  // Fullscreen gallery keyboard navigation
  const handleGalleryKey = useCallback((e: KeyboardEvent) => {
    if (!fullscreenGallery) return;
    if (e.key === "Escape") setFullscreenGallery(false);
    if (e.key === "ArrowRight") setFullscreenIndex((p) => (p + 1) % property.images.length);
    if (e.key === "ArrowLeft") setFullscreenIndex((p) => (p - 1 + property.images.length) % property.images.length);
  }, [fullscreenGallery, property.images.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleGalleryKey);
    return () => window.removeEventListener("keydown", handleGalleryKey);
  }, [handleGalleryKey]);

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setFullscreenGallery(true);
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) return;
    setReviewSubmitting(true);
    setTimeout(() => {
      setUserReviews((prev) => [
        {
          id: `user-review-${Date.now()}`,
          author: { firstName: currentUser.firstName, lastName: currentUser.lastName },
          rating: reviewRating,
          content: reviewComment,
          date: new Date().toISOString(),
        },
        ...prev,
      ]);
      setReviewRating(0);
      setReviewComment("");
      setReviewSubmitting(false);
      setReviewToast(true);
      setTimeout(() => setReviewToast(false), 3000);
    }, 800);
  };

  const handleAvailSubmit = () => {
    if (!availCheckIn || !availCheckOut) return;
    setAvailSubmitting(true);
    setTimeout(() => {
      setAvailSubmitting(false);
      setAvailSent(true);
    }, 1200);
  };

  // Save to recently viewed in localStorage
  useEffect(() => {
    try {
      const key = "edome_recently_viewed";
      const stored = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      const filtered = stored.filter((id) => id !== property.id);
      filtered.unshift(property.id);
      localStorage.setItem(key, JSON.stringify(filtered.slice(0, 5)));
    } catch {
      // ignore localStorage errors
    }
  }, [property.id]);

  const reviews = getReviewsForProperty(property.id);
  const similar = getSimilarProperties(property);
  const equipmentGroups = groupEquipment(property.equipment);

  // Options price calculation
  const optionsTotal = useMemo(() => {
    return property.paidOptions
      .filter((opt) => selectedOptions.has(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);
  }, [selectedOptions, property.paidOptions]);

  const basePrice =
    property.transactionType === "location-ct"
      ? property.pricePerNight || property.price
      : property.price;

  const toggleOption = (optId: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(optId)) next.delete(optId);
      else next.add(optId);
      return next;
    });
  };

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () =>
    setCurrentImage(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );

  const ctaLabel =
    property.transactionType === "location-ct"
      ? "Réserver"
      : property.transactionType === "vente"
        ? "Demander une visite"
        : "Contacter";

  // Calendar months to show (dynamic based on calendarOffset)
  const now = new Date();
  const calendarMonths = useMemo(() => {
    return [0, 1, 2].map((i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + calendarOffset + i, 1);
      return { month: d.getMonth(), year: d.getFullYear() };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarOffset]);

  // Share helpers
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = property.title;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl space-y-8 pb-32"
    >
      {/* ─── Back nav ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link
          href="/explorer"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Explorer
        </Link>
        <span className="text-[var(--text-muted)]">/</span>
        <span className="text-sm text-[var(--text-secondary)]">{property.title}</span>
      </div>

      {/* ─── Image Gallery ──────────────────────────────── */}
      <section className="space-y-3">
        {/* Main image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full cursor-pointer"
              onClick={() => openFullscreen(currentImage)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={property.images[currentImage]}
                alt={`${property.title} - Photo ${currentImage + 1}`}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {currentImage + 1}/{property.images.length}
          </div>

          {/* Actions top-right */}
          <div className="absolute right-4 top-4 flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="rounded-full bg-black/60 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              title="Imprimer la fiche"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                "rounded-full p-2.5 backdrop-blur-sm transition-colors",
                liked
                  ? "bg-red-500/20 text-red-400"
                  : "bg-black/60 text-[var(--foreground)] hover:bg-black/80"
              )}
            >
              <Heart className={cn("h-5 w-5", liked && "fill-current")} />
            </button>
            <div className="relative" ref={shareRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="rounded-full bg-black/60 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-2xl"
                  >
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setShowShareMenu(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                    >
                      <Link2 className="h-4 w-4" />
                      Copier le lien
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowShareMenu(false)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
                      onClick={() => setShowShareMenu(false)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Video badge */}
          {property.videos.length > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Play className="h-3.5 w-3.5" />
              Visite virtuelle
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {property.images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border transition-all",
                currentImage === i
                  ? "border-[#C4956A] ring-1 ring-[#C4956A]"
                  : "border-[var(--card-border)] hover:border-[var(--card-border)]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Miniature ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
          {property.images.length > 5 && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--card-border)] hover:text-[var(--foreground)]"
            >
              +{property.images.length - 5} photos
            </button>
          )}
          {/* Video thumbnails in gallery strip */}
          {property.videos.map((vid, i) => (
            <button
              key={`vid-${i}`}
              onClick={() => {
                const el = document.getElementById("video-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--card-border)] hover:border-[#C4956A]/40 transition-all group"
            >
              <video
                src={vid}
                className="h-full w-full object-cover"
                preload="metadata"
                muted
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <Play className="h-5 w-5 text-white fill-white" />
              </div>
            </button>
          ))}
        </div>

        {/* "See all photos" button */}
        <button
          onClick={() => openFullscreen(0)}
          className="flex items-center gap-2 text-sm font-medium text-[#C4956A] transition-colors hover:text-[#D4A574]"
        >
          <Camera className="h-4 w-4" />
          Voir toutes les photos ({property.images.length})
        </button>

        {/* ─── Visite virtuelle (Video Section) ─────────────── */}
        {property.videos.length > 0 && (
          <div id="video-section" className="mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[var(--foreground)]">
              <Video className="w-5 h-5 text-[#C4956A]" />
              Visite virtuelle
            </h3>
            <div className="rounded-2xl overflow-hidden border border-[var(--card-border)]">
              <video
                src={property.videos[0]}
                className="w-full aspect-video bg-black"
                controls
                preload="metadata"
                playsInline
                poster={property.images[0]}
              />
            </div>
            {property.videos.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {property.videos.slice(1).map((vid, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const mainVideo = document.querySelector("#video-section video") as HTMLVideoElement;
                      if (mainVideo) {
                        mainVideo.src = vid;
                        mainVideo.load();
                      }
                    }}
                    className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--card-border)] hover:border-[#C4956A]/40 transition-all group"
                  >
                    <video
                      src={vid}
                      className="h-full w-full object-cover"
                      preload="metadata"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                    <span className="absolute bottom-1 left-1 text-[10px] text-[var(--text-secondary)] bg-black/60 px-1.5 py-0.5 rounded">
                      Vidéo {i + 2}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── Main content + Sidebar layout ──────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: content */}
        <div className="space-y-8 lg:col-span-2">
          {/* ─── Price & Info ───────────────────────────── */}
          <section className="space-y-4">
            {/* Price */}
            <div>
              <p className="text-3xl font-bold text-[#C4956A] sm:text-4xl">
                {formatPrice(basePrice, property.currency)}
                {property.transactionType !== "vente" && (
                  <span className="text-lg font-normal text-[var(--text-secondary)]">
                    {property.transactionType === "location-ct" ? "/nuit" : "/mois"}
                  </span>
                )}
              </p>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[var(--foreground)]">{property.title}</h1>

            {/* Address */}
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <MapPin className="h-4 w-4 text-[#C4956A]" />
              <span className="text-sm">
                {property.location.address}, {property.location.city},{" "}
                {property.location.country}
              </span>
              <button
                onClick={() => {
                  const el = document.getElementById("map-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="ml-1 text-xs text-[#C4956A] underline-offset-2 hover:underline"
              >
                Voir sur la carte
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={property.rating} />
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {property.rating.toFixed(1)}/5
              </span>
              <span className="text-sm text-[var(--text-secondary)]">
                ({property.reviewCount} avis)
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {property.status === "active" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  <CircleCheck className="h-3.5 w-3.5" />
                  Disponible
                </span>
              )}
              {property.videos.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  <Play className="h-3.5 w-3.5" />
                  Visite virtuelle
                </span>
              )}
              {property.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C4956A]/10 px-3 py-1 text-xs font-medium text-[#C4956A]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Coup de coeur
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                <Eye className="h-3.5 w-3.5" />
                {property.views} vues
              </span>
            </div>

            {/* Characteristics grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
                  <BedDouble className="h-5 w-5 text-[#C4956A]" />
                  <div>
                    <p className="text-lg font-bold text-[var(--foreground)]">{property.bedrooms}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Chambres</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
                <Bath className="h-5 w-5 text-[#C4956A]" />
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{property.bathrooms}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Salle{property.bathrooms > 1 ? "s" : ""} de bain</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
                <Maximize2 className="h-5 w-5 text-[#C4956A]" />
                <div>
                  <p className="text-lg font-bold text-[var(--foreground)]">{property.area}</p>
                  <p className="text-xs text-[var(--text-secondary)]">m² surface</p>
                </div>
              </div>
              {property.floor !== undefined && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
                  <Building2 className="h-5 w-5 text-[#C4956A]" />
                  <div>
                    <p className="text-lg font-bold text-[var(--foreground)]">{property.floor}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{property.floor === 0 ? "Rez-de-ch." : `${property.floor}ème étage`}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ─── Description ────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Description</h2>
            <div className="relative">
              <p
                className={cn(
                  "whitespace-pre-line text-sm leading-relaxed text-[var(--text-secondary)]",
                  !descExpanded && "line-clamp-5"
                )}
              >
                {property.description}
              </p>
              {!descExpanded && property.description.length > 300 && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#080808] to-transparent" />
              )}
            </div>
            {property.description.length > 300 && (
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="text-sm font-medium text-[#C4956A] transition-colors hover:text-[#D4A574]"
              >
                {descExpanded ? "Voir moins" : "Lire plus"}
              </button>
            )}
          </section>

          {/* ─── Équipements ────────────────────────────── */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Équipements</h2>
            {equipmentGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">{group.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((item) => {
                    const Icon = equipmentIcons[item] || Check;
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3"
                      >
                        <Icon className="h-4 w-4 text-[#C4956A]" />
                        <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          {/* ─── Paid Options ───────────────────────────── */}
          {property.paidOptions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Services & Options Additionnelles
              </h2>
              <div className="space-y-3">
                {property.paidOptions.map((opt) => (
                  <motion.button
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                      selectedOptions.has(opt.id)
                        ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                        : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--card-border)]"
                    )}
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors",
                        selectedOptions.has(opt.id)
                          ? "border-[#C4956A] bg-[#C4956A]"
                          : "border-white/20"
                      )}
                    >
                      {selectedOptions.has(opt.id) && (
                        <Check className="h-3.5 w-3.5 text-black" />
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--foreground)]">{opt.name}</span>
                        <span className="text-sm font-semibold text-[#C4956A]">
                          {formatPrice(opt.price, property.currency)}
                          {opt.perDay && (
                            <span className="font-normal text-[var(--text-secondary)]">/jour</span>
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{opt.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Sticky total bar */}
              <motion.div
                layout
                className="rounded-xl border border-[#C4956A]/20 bg-[#C4956A]/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-[var(--text-secondary)]">Total estimé</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span>
                        {formatPrice(basePrice, property.currency)}
                        {property.transactionType === "location-ct" ? "/nuit" : ""}
                      </span>
                      {optionsTotal > 0 && (
                        <>
                          <span className="text-[var(--text-muted)]">+</span>
                          <span className="text-[#C4956A]">
                            {formatPrice(optionsTotal, property.currency)} options
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#C4956A]">
                    {formatPrice(basePrice + optionsTotal, property.currency)}
                  </p>
                </div>
              </motion.div>
            </section>
          )}

          {/* ─── Investment Analytics (vente & terrain only) ── */}
          {property.analytics && (property.transactionType === "vente" || property.type === "terrain") && (
            <InvestmentAnalytics property={property} />
          )}

          {/* ─── Map Placeholder ────────────────────────── */}
          <section id="map-section" className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Localisation</h2>
            <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
              <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                <MapPin className="h-10 w-10" />
                <p className="text-sm">
                  {property.location.address}, {property.location.city}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.location.address}, ${property.location.city}, ${property.location.country}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-white/5 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-[var(--foreground)]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </section>

          {/* ─── Availability Calendar ──────────────────── */}
          {property.transactionType === "location-ct" && property.availabilities && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Disponibilités</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-[#C4956A]/20" />
                    Disponible
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-red-500/10" />
                    Indisponible
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCalendarOffset((o) => Math.max(0, o - 1))}
                    disabled={calendarOffset === 0}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--card-border)] transition-colors",
                      calendarOffset === 0
                        ? "cursor-not-allowed text-[var(--text-muted)]"
                        : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCalendarOffset((o) => o + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {calendarMonths.map(({ month, year }) => (
                  <div
                    key={`${month}-${year}`}
                    className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4"
                  >
                    <AvailabilityCalendar
                      availabilities={property.availabilities!}
                      month={month}
                      year={year}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Reviews ────────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Avis ({property.reviewCount})
              </h2>
              <div className="flex items-center gap-2">
                <StarRating rating={property.rating} size={14} />
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {property.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {/* User-submitted reviews */}
              {userReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[#C4956A]/20 bg-[#C4956A]/5 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-sm font-bold text-black">
                      {review.author.firstName[0]}
                      {review.author.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)] hover:text-[#C4956A] transition-colors">
                            {review.author.firstName} {review.author.lastName}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {timeAgo(review.date)}
                          </p>
                        </div>
                        <StarRating rating={review.rating} size={12} />
                      </div>
                      {review.content && (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {review.content}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Link href={`/profil/${review.author.id}`} className="flex items-center gap-3 shrink-0">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-sm font-bold text-black">
                        {review.author.firstName[0]}
                        {review.author.lastName[0]}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link href={`/profil/${review.author.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:text-[#C4956A] transition-colors">
                            {review.author.firstName} {review.author.lastName}
                          </Link>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {timeAgo(review.date)}
                          </p>
                        </div>
                        <StarRating rating={review.rating} size={12} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ─── Review Submission Form ──────────────────── */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 space-y-4">
              <h3 className="text-base font-semibold text-[var(--foreground)]">Laisser un avis</h3>

              {/* Star rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setReviewRating(s)}
                    onMouseEnter={() => setReviewHover(s)}
                    onMouseLeave={() => setReviewHover(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors",
                        s <= (reviewHover || reviewRating)
                          ? "fill-[#C4956A] text-[#C4956A]"
                          : "text-[var(--text-muted)]"
                      )}
                    />
                  </button>
                ))}
                {reviewRating > 0 && (
                  <span className="ml-2 text-sm text-[var(--text-secondary)]">{reviewRating}/5</span>
                )}
              </div>

              {/* Comment textarea */}
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                rows={4}
                className="w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 outline-none transition-colors focus:border-[#C4956A]/50"
              />

              {/* Submit button */}
              <button
                onClick={handleSubmitReview}
                disabled={reviewRating === 0 || reviewSubmitting}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all",
                  reviewSubmitting
                    ? "bg-[#C4956A]/30 text-black/50 cursor-wait"
                    : reviewRating === 0
                    ? "bg-[#C4956A]/20 text-black/30 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                )}
              >
                {reviewSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Publication...</>
                ) : (
                  "Publier l'avis"
                )}
              </button>
            </div>
          </section>

          {/* ─── Similar Properties ─────────────────────── */}
          {similar.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Biens similaires</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {similar.map((p) => (
                  <PropertyMiniCard key={p.id} property={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ─── Right Sidebar ────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Host/Agency Card */}
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-lg font-bold text-black">
                    {property.host.firstName[0]}
                    {property.host.lastName[0]}
                  </div>
                  {property.host.online && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0e0e0e] bg-green-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/profil/${property.host.id}`} className="font-semibold text-[var(--foreground)] hover:text-[#C4956A] transition-colors">
                      {property.host.firstName} {property.host.lastName}
                    </Link>
                    {property.host.verified && (
                      <ShieldCheck className="h-4 w-4 text-[#C4956A]" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                    <Star className="h-3 w-3 fill-[#C4956A] text-[#C4956A]" />
                    {property.host.stats.rating.toFixed(1)} ({property.host.stats.reviewCount} avis)
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-[var(--card-border)] pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Membre depuis</span>
                  <span className="text-[var(--text-secondary)]">{formatDate(property.host.joinedAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Taux de réponse</span>
                  <span className="text-[var(--text-secondary)]">98%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Temps de réponse</span>
                  <span className="text-[var(--text-secondary)]">&lt; 1 heure</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Biens publiés</span>
                  <span className="text-[var(--text-secondary)]">{property.host.stats.properties}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/profil/${property.host.id}`}
                  className="flex-1 rounded-xl border border-[var(--card-border)] py-2.5 text-center text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white/5"
                >
                  Voir profil
                </Link>
                <button
                  onClick={() => {
                    setShowContactForm(!showContactForm);
                    setContactSent(false);
                  }}
                  className="flex-1 rounded-xl bg-[#C4956A] py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574]"
                >
                  Contacter
                </button>
              </div>

              {/* Inline Contact Form */}
              <AnimatePresence>
                {showContactForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 overflow-hidden border-t border-[var(--card-border)] pt-5"
                  >
                    {contactSent ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-2 py-4 text-center"
                      >
                        <CheckCircle2 className="h-8 w-8 text-green-400" />
                        <p className="text-sm font-semibold text-green-400">
                          Message envoyé !
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {property.host.firstName} vous répondra bientôt.
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder={`Écrire un message à ${property.host.firstName}...`}
                          rows={4}
                          className="w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 outline-none transition-colors focus:border-[#C4956A]/50"
                        />
                        <button
                          onClick={() => {
                            if (contactMessage.trim()) {
                              setContactSent(true);
                              setContactMessage("");
                            }
                          }}
                          disabled={!contactMessage.trim()}
                          className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors",
                            contactMessage.trim()
                              ? "bg-[#C4956A] text-black hover:bg-[#D4A574]"
                              : "cursor-not-allowed bg-white/5 text-[var(--text-muted)]"
                          )}
                        >
                          <Send className="h-4 w-4" />
                          Envoyer
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transaction type badge */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-center">
              <p className="text-xs text-[var(--text-secondary)]">Type de transaction</p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {transactionLabels[property.transactionType]}
              </p>
            </div>

            {/* Availability request form (location-ct only) */}
            {property.transactionType === "location-ct" && (
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#C4956A]" />
                  Demander la disponibilité
                </h3>

                {availSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-6 text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">
                      Demande envoyée !
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {property.host.firstName} vous répondra dans les plus brefs délais.
                    </p>
                    <button
                      onClick={() => {
                        setAvailSent(false);
                        setAvailCheckIn("");
                        setAvailCheckOut("");
                        setAvailGuests(2);
                        setAvailMessage("");
                      }}
                      className="mt-2 text-xs text-[#C4956A] hover:underline"
                    >
                      Nouvelle demande
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {/* Check-in */}
                    <div>
                      <label className="mb-1 block text-xs text-[var(--text-secondary)]">Arrivée</label>
                      <input
                        type="date"
                        value={availCheckIn}
                        onChange={(e) => setAvailCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/50 [color-scheme:dark]"
                      />
                    </div>
                    {/* Check-out */}
                    <div>
                      <label className="mb-1 block text-xs text-[var(--text-secondary)]">Départ</label>
                      <input
                        type="date"
                        value={availCheckOut}
                        onChange={(e) => setAvailCheckOut(e.target.value)}
                        min={availCheckIn || new Date().toISOString().split("T")[0]}
                        className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/50 [color-scheme:dark]"
                      />
                    </div>
                    {/* Guests */}
                    <div>
                      <label className="mb-1 block text-xs text-[var(--text-secondary)]">Voyageurs</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAvailGuests(Math.max(1, availGuests - 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-[var(--text-secondary)] transition hover:border-[#C4956A]/30 hover:text-[var(--foreground)]"
                        >
                          -
                        </button>
                        <span className="min-w-[40px] text-center text-sm font-medium text-[var(--foreground)]">
                          {availGuests}
                        </span>
                        <button
                          onClick={() => setAvailGuests(Math.min(20, availGuests + 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-[var(--text-secondary)] transition hover:border-[#C4956A]/30 hover:text-[var(--foreground)]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Message */}
                    <div>
                      <label className="mb-1 block text-xs text-[var(--text-secondary)]">Message (optionnel)</label>
                      <textarea
                        value={availMessage}
                        onChange={(e) => setAvailMessage(e.target.value)}
                        placeholder="Précisez votre demande..."
                        rows={3}
                        className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 outline-none transition-colors focus:border-[#C4956A]/50"
                      />
                    </div>
                    {/* Submit */}
                    <button
                      onClick={handleAvailSubmit}
                      disabled={!availCheckIn || !availCheckOut || availSubmitting}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
                        availCheckIn && availCheckOut && !availSubmitting
                          ? "bg-[#C4956A] text-black hover:bg-[#D4A574]"
                          : "cursor-not-allowed bg-white/5 text-[var(--text-muted)]"
                      )}
                    >
                      {availSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Demander la disponibilité
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Published date */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-center">
              <p className="text-xs text-[var(--text-secondary)]">Publié le</p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {formatDate(property.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Partager ce bien ─────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Partager ce bien</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " - " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-green-500/30 hover:bg-green-500/5 hover:text-green-400"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent("Découvrez ce bien sur E-Dome : " + shareTitle)}&body=${encodeURIComponent("Regardez ce bien immobilier sur E-Dome :\n\n" + shareTitle + "\n" + shareUrl)}`}
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-purple-500/30 hover:bg-purple-500/5 hover:text-purple-400"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setLinkCopied(true);
              setTimeout(() => setLinkCopied(false), 2000);
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors",
              linkCopied
                ? "border-green-500/30 bg-green-500/5 text-green-400"
                : "border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] hover:border-[#C4956A]/30 hover:bg-[#C4956A]/5 hover:text-[#C4956A]"
            )}
          >
            {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {linkCopied ? "Lien copié !" : "Copier le lien"}
          </button>
        </div>
      </section>

      {/* ─── Signaler ce bien ─────────────────────────── */}
      <div className="text-center pb-8">
        <button
          onClick={() => { setShowReportModal(true); setReportSent(false); setReportReason(""); setReportDetails(""); }}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] transition-colors hover:text-red-400"
        >
          <Flag className="h-3 w-3" />
          Signaler ce bien
        </button>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
            >
              {reportSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                  <p className="text-lg font-semibold text-[var(--foreground)]">Signalement envoyé</p>
                  <p className="text-sm text-[var(--text-secondary)]">Merci pour votre signalement. Notre équipe examinera cette annonce.</p>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="mt-4 rounded-xl bg-white/5 px-6 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white/10"
                  >
                    Fermer
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">Signaler cette annonce</h3>
                    <button onClick={() => setShowReportModal(false)} className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-3 mb-5">
                    {[
                      "Contenu inapproprié",
                      "Prix incorrect",
                      "Information trompeuse",
                      "Bien déjà vendu/loué",
                      "Autre",
                    ].map((reason) => (
                      <label
                        key={reason}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                          reportReason === reason
                            ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                            : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--card-border)]"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border",
                            reportReason === reason
                              ? "border-[#C4956A] bg-[#C4956A]"
                              : "border-white/20"
                          )}
                        >
                          {reportReason === reason && (
                            <div className="h-1.5 w-1.5 rounded-full bg-black" />
                          )}
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">{reason}</span>
                        <input
                          type="radio"
                          name="report-reason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={() => setReportReason(reason)}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Détails supplémentaires (facultatif)..."
                    rows={3}
                    className="mb-5 w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 outline-none transition-colors focus:border-[#C4956A]/50"
                  />
                  <button
                    onClick={() => {
                      if (reportReason) setReportSent(true);
                    }}
                    disabled={!reportReason}
                    className={cn(
                      "w-full rounded-xl py-3 text-sm font-semibold transition-colors",
                      reportReason
                        ? "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                        : "cursor-not-allowed bg-white/5 text-[var(--text-muted)]"
                    )}
                  >
                    Envoyer le signalement
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Sticky Footer CTA ────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-2xl font-bold text-[#C4956A]">
              {formatPrice(basePrice + optionsTotal, property.currency)}
              {property.transactionType !== "vente" && (
                <span className="text-sm font-normal text-[var(--text-secondary)]">
                  {property.transactionType === "location-ct" ? "/nuit" : "/mois"}
                </span>
              )}
            </p>
            {optionsTotal > 0 && (
              <p className="text-xs text-[var(--text-secondary)]">
                dont {formatPrice(optionsTotal, property.currency)} d&apos;options
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-8 py-3 text-sm font-bold text-black shadow-lg shadow-[#C4956A]/20 transition-shadow hover:shadow-[#C4956A]/30"
          >
            {ctaLabel}
          </motion.button>
        </div>
      </div>

      {/* ─── Review Toast ────────────────────────────── */}
      <AnimatePresence>
        {reviewToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--foreground)] shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Avis publié avec succès !
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Fullscreen Photo Gallery Modal ──────────────── */}
      <AnimatePresence>
        {fullscreenGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm"
            onClick={() => setFullscreenGallery(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setFullscreenGallery(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-[var(--foreground)] transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-[var(--foreground)] backdrop-blur-sm">
              {fullscreenIndex + 1} / {property.images.length}
            </div>

            {/* Main image area */}
            <div
              className="flex flex-1 items-center justify-center px-16 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left arrow */}
              {property.images.length > 1 && (
                <button
                  onClick={() => setFullscreenIndex((p) => (p - 1 + property.images.length) % property.images.length)}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-[var(--foreground)] transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={fullscreenIndex}
                  src={property.images[fullscreenIndex]}
                  alt={`${property.title} - Photo ${fullscreenIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[75vh] max-w-full rounded-lg object-contain"
                />
              </AnimatePresence>

              {/* Right arrow */}
              {property.images.length > 1 && (
                <button
                  onClick={() => setFullscreenIndex((p) => (p + 1) % property.images.length)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-[var(--foreground)] transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Thumbnail strip */}
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto px-4 pb-4 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setFullscreenIndex(i)}
                  className={cn(
                    "h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    fullscreenIndex === i
                      ? "border-[#C4956A] opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Miniature ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── All Photos Modal ──────────────────────────── */}
      <AnimatePresence>
        {showAllPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-sm"
          >
            <div className="w-full max-w-4xl py-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Toutes les photos ({property.images.length})
                </h3>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="rounded-full bg-white/10 p-2 text-[var(--foreground)] transition-colors hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {property.images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setCurrentImage(i);
                      setShowAllPhotos(false);
                    }}
                    className="aspect-video cursor-pointer overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[var(--card-border)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Photo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
