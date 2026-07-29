"use client";

import React, { useState, useEffect, useCallback, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Heart, Share2, Star, MapPin, Bed, Bath, Maximize,
  ChevronLeft, ChevronRight, X, Printer, PenSquare,
  Calendar as CalendarIcon, ChevronDown, ChevronUp,
  TrendingUp, BarChart3, Shield, Check, Send, Flag,
  Mail, Copy, Phone, MessageCircle, Users,
  Building2, Layers, DollarSign, Percent, Award, Rocket,
  Handshake, QrCode, Wallet, Info,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useToast } from "@/components/ui/toast";
import { timeAgo, formatDate } from "@/lib/utils";
import { roleBadgeColors, roleLabels } from "@/lib/types";
import type { Property, PropertyAnalytics, User, Currency } from "@/lib/types";
import {
  properties as allProperties,
  getPropertyById,
  getSimilarProperties,
  getReviewsForProperty,
} from "@/lib/mock-data";
import type { Review } from "@/lib/mock-data";
import { RecommendButton } from "@/components/affiliate/recommend-button";
import { ReferralBanner } from "@/components/affiliate/referral-banner";
import { REFERRAL_ID } from "@/lib/referral-links";

// ─── Paid options (applicable to location-ct) ───────────────────────────────

const PAID_OPTIONS = [
  { id: "o1", emoji: "\u2615", label: "Café de bienvenue", price: 0, included: true },
  { id: "o2", emoji: "\uD83C\uDF7E", label: "Champagne à l'arrivée", price: 50 },
  { id: "o3", emoji: "\uD83D\uDC86", label: "Massage 1h à domicile", price: 80 },
  { id: "o4", emoji: "\uD83D\uDC68\u200D\uD83C\uDF73", label: "Chef privé (dîner)", price: 200 },
  { id: "o5", emoji: "\uD83D\uDE97", label: "Transfert aéroport", price: 60 },
  { id: "o6", emoji: "\uD83E\uDDF9", label: "Nettoyage professionnel", price: 150 },
  { id: "o7", emoji: "\u23F0", label: "Late checkout (14h)", price: 60 },
  { id: "o8", emoji: "\uD83E\uDDFA", label: "Pack linge premium", price: 35 },
];

// ─── Floor plans per property ──────────────────────────────────────────────────

const FLOOR_PLANS: Record<string, { rooms: { name: string; area: number }[]; levels?: string[] }> = {
  prop1: { rooms: [{ name: "Salon/Séjour", area: 45 }, { name: "Cuisine", area: 15 }, { name: "Ch.1", area: 18 }, { name: "Ch.2", area: 16 }, { name: "Ch.3", area: 14 }, { name: "SDB", area: 12 }, { name: "WC", area: 4 }, { name: "Entrée", area: 6 }, { name: "Balcon", area: 5 }] },
  prop2: { rooms: [{ name: "Pièce principale", area: 22 }, { name: "Cuisine ouverte", area: 5 }, { name: "SDB", area: 4 }, { name: "Entrée", area: 1 }] },
  prop3: { rooms: [{ name: "Salon", area: 55 }, { name: "Cuisine", area: 25 }, { name: "Ch. amis", area: 20 }, { name: "SDB", area: 10 }, { name: "Garage", area: 40 }, { name: "Ch. maître", area: 30 }, { name: "Dressing", area: 12 }, { name: "SDB suite", area: 14 }, { name: "Ch.2", area: 18 }, { name: "Ch.3", area: 16 }, { name: "Terrasse", area: 40 }], levels: ["RDC", "Étage"] },
  prop4: { rooms: [{ name: "Patio central", area: 30 }, { name: "Salon", area: 35 }, { name: "Cuisine", area: 20 }, { name: "Suite 1", area: 25 }, { name: "Suite 2", area: 22 }, { name: "Suite 3", area: 20 }, { name: "Suite 4", area: 18 }, { name: "Hammam", area: 15 }, { name: "Terrasse", area: 35 }] },
  prop5: { rooms: [{ name: "Salon", area: 60 }, { name: "Cuisine", area: 30 }, { name: "Ch.1", area: 25 }, { name: "SDB", area: 15 }, { name: "Ski room", area: 20 }, { name: "Ch.2", area: 20 }, { name: "Ch.3", area: 18 }, { name: "Ch.4", area: 20 }, { name: "Ch. maître", area: 30 }, { name: "Sauna", area: 10 }, { name: "Terrasse", area: 50 }], levels: ["RDC", "Étage 1", "Étage 2"] },
  prop6: { rooms: [{ name: "Salon", area: 80 }, { name: "Salle à manger", area: 40 }, { name: "Cuisine", area: 30 }, { name: "Bureau", area: 25 }, { name: "Ch. maître", area: 50 }, { name: "Dressing", area: 20 }, { name: "SDB suite", area: 25 }, { name: "Ch.2", area: 30 }, { name: "Ch.3", area: 28 }, { name: "Piscine privée", area: 40 }, { name: "Terrasse", area: 67 }], levels: ["Niveau 41", "Niveau 42", "Rooftop"] },
  prop7: { rooms: [{ name: "Séjour", area: 28 }, { name: "Cuisine", area: 12 }, { name: "Ch.1", area: 15 }, { name: "Ch.2", area: 13 }, { name: "SDB", area: 8 }, { name: "WC", area: 3 }, { name: "Balcon", area: 6 }] },
  prop8: { rooms: [{ name: "Salon", area: 45 }, { name: "Cuisine", area: 20 }, { name: "Ch.1", area: 25 }, { name: "Ch.2", area: 20 }, { name: "Ch.3", area: 18 }, { name: "Ch.4", area: 16 }, { name: "SDB1", area: 12 }, { name: "SDB2", area: 10 }, { name: "SDB3", area: 8 }, { name: "Terrasse", area: 46 }], levels: ["RDC", "Étage"] },
  prop9: { rooms: [{ name: "Salon", area: 35 }, { name: "Cuisine", area: 18 }, { name: "Ch.1", area: 22 }, { name: "Ch.2", area: 18 }, { name: "Ch.3", area: 15 }, { name: "SDB1", area: 10 }, { name: "SDB2", area: 8 }, { name: "Terrasse caldera", area: 54 }] },
  prop12: { rooms: [{ name: "Salon", area: 35 }, { name: "Cuisine", area: 18 }, { name: "Ch.1", area: 22 }, { name: "Ch.2", area: 18 }, { name: "Ch.3", area: 15 }, { name: "SDB1", area: 10 }, { name: "SDB2", area: 8 }, { name: "Terrasse caldera", area: 54 }] },
};

// ─── Resolve property by ID (handles multiple ID formats) ───────────────────

function resolveProperty(id: string): Property | undefined {
  // 1) Direct lookup (e.g. "prop1")
  let found = getPropertyById(id);
  if (found) return found;

  // 2) Map legacy IDs like "prop-001" -> "prop1"
  const legacyMatch = id.match(/^prop-0*(\d+)$/);
  if (legacyMatch) {
    const num = parseInt(legacyMatch[1], 10);
    found = getPropertyById(`prop${num}`);
    if (found) return found;

    // 3) Fallback: find by index (1-based)
    if (num >= 1 && num <= allProperties.length) {
      return allProperties[num - 1];
    }
  }

  // 4) Map short IDs like "prop1" -> index lookup
  const shortMatch = id.match(/^prop(\d+)$/);
  if (shortMatch) {
    const num = parseInt(shortMatch[1], 10);
    if (num >= 1 && num <= allProperties.length) {
      return allProperties[num - 1];
    }
  }

  // 5) Search by partial match
  return allProperties.find((p) => p.id.includes(id) || id.includes(p.id));
}

// ─── Unified review type for local state ────────────────────────────────────

interface DisplayReview {
  id: string;
  author: { name: string; avatar: string };
  rating: number;
  content: string;
  date: string;
}

function mapMockReviewToDisplay(r: Review): DisplayReview {
  return {
    id: r.id,
    author: {
      name: `${r.author.firstName} ${r.author.lastName.charAt(0)}.`,
      avatar: r.author.avatar,
    },
    rating: r.rating,
    content: r.comment,
    date: r.createdAt.split("T")[0],
  };
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { formatPrice, toggleFavorite, isFavorite, activeRole } = useApp();
  const { addToast } = useToast();
  const router = useRouter();

  const property = resolveProperty(id);

  // Load reviews from mock-data for this property
  const mockPropertyReviews = property
    ? getReviewsForProperty(property.id).map(mapMockReviewToDisplay)
    : [];

  // Similar properties from mock-data (excludes current property)
  const similarProperties = property ? getSimilarProperties(property) : [];

  // Gallery
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Description
  const [descExpanded, setDescExpanded] = useState(false);

  // Video (YouTube embed — no local state needed)

  // Investment simulator
  const [simApport, setSimApport] = useState(0);
  const [simDuree, setSimDuree] = useState(20);
  const [simTaux, setSimTaux] = useState(1.5);

  // Paid options
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  // Calendar (for location-ct)
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [requestMessage, setRequestMessage] = useState("");

  // Contact form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  // Report modal
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Review form
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<DisplayReview[]>(mockPropertyReviews);

  // Share
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Boost modal
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostDuration, setBoostDuration] = useState<7 | 14 | 30>(7);

  // Vente modals
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("10:00");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(0);
  const [offerConditions, setOfferConditions] = useState("");

  // Initialize price-dependent state when property changes
  useEffect(() => {
    if (property) {
      setSimApport(property.price * 0.2);
      setOfferAmount(property.price);
    }
  }, [property?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update reviews when property changes
  useEffect(() => {
    if (property) {
      const propReviews = getReviewsForProperty(property.id).map(mapMockReviewToDisplay);
      setReviews(propReviews);
    }
  }, [property?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track recently viewed
  useEffect(() => {
    if (!property) return;
    try {
      const stored = localStorage.getItem("edome_recently_viewed");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      const updated = [property.id, ...ids.filter((i) => i !== property.id)].slice(0, 10);
      localStorage.setItem("edome_recently_viewed", JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [property?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard nav for gallery
  useEffect(() => {
    if (!property || !showFullGallery) return;
    const imgCount = property.images.length;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setGalleryIndex((prev) => (prev + 1) % imgCount);
      if (e.key === "ArrowLeft") setGalleryIndex((prev) => (prev - 1 + imgCount) % imgCount);
      if (e.key === "Escape") setShowFullGallery(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showFullGallery, property?.images?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Computed average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  // If property not found, show a not-found state
  if (!property) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-2xl page-heading text-[var(--foreground)] mb-4">Bien introuvable</h1>
        <p className="text-[var(--text-secondary)] mb-6">Le bien avec l&apos;identifiant &quot;{id}&quot; n&apos;existe pas.</p>
        <Link href="/explorer" className="px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors">
          Retour à l&apos;explorer
        </Link>
      </div>
    );
  }

  const optionsTotal = PAID_OPTIONS.filter((o) => selectedOptions.has(o.id) && !o.included).reduce((sum, o) => sum + o.price, 0);

  // Calendar
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  const MONTH_NAMES = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  // Mortgage calculation
  const loanAmount = property.price - simApport;
  const monthlyRate = simTaux / 100 / 12;
  const numPayments = simDuree * 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments;
  const totalCost = monthlyPayment * numPayments;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* Clearance mobile : bottom-nav 64 px + sticky CTA 64 px + safe-area
     (sinon le dernier contenu finit sous les deux barres). Sur lg+
     la CTA est masquée — on revient à un pb-20 standard. */
  return (
    <div className="max-w-5xl mx-auto pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pb-20">
      {/* Back button */}
      <Link
        href="/explorer"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      {/* Bannière de confiance si on arrive via un lien d'apporteur (?ref=) */}
      <div className="mb-4">
        <ReferralBanner kind="bien" id={property.id} />
      </div>

      {/* Gallery */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-1 h-[400px] md:h-[500px]">
          <div
            className="col-span-2 row-span-2 relative cursor-pointer"
            onClick={() => { setGalleryIndex(0); setShowFullGallery(true); }}
          >
            <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
          </div>
          {property.images.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative cursor-pointer"
              onClick={() => { setGalleryIndex(i + 1); setShowFullGallery(true); }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {i === 3 && property.images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{property.images.length - 5}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen gallery */}
      {showFullGallery && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-white text-sm">{galleryIndex + 1} / {property.images.length}</span>
            <button onClick={() => setShowFullGallery(false)} className="text-white/80 hover:text-white">
              <X className="w-8 h-8" />
            </button>
          </div>
          <div
            className="flex-1 flex items-center justify-center relative"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(diff) > 50) {
                if (diff < 0) setGalleryIndex((prev) => (prev + 1) % property.images.length);
                else setGalleryIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
              }
              touchStartX.current = null;
            }}
          >
            <button
              onClick={() => setGalleryIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={property.images[galleryIndex]}
              alt=""
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg"
            />
            <button
              onClick={() => setGalleryIndex((prev) => (prev + 1) % property.images.length)}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 justify-center p-4 overflow-x-auto no-scrollbar">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                  i === galleryIndex ? "border-[var(--primary)]" : "border-transparent opacity-50"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title, price, badges */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl page-heading text-[var(--foreground)] mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4" />
                  {property.location.address && `${property.location.address}, `}
                  {property.location.city}, {property.location.country}
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {property.rating} ({reviews.length > 0 ? reviews.length : property.reviewCount} avis)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                {formatPrice(property.price, property.currency)}
              </p>
              {property.transactionType === "location-ct" && (
                <span className="text-sm text-[var(--text-muted)]">par nuit</span>
              )}
              {property.transactionType === "location-lt" && (
                <span className="text-sm text-[var(--text-muted)]">par mois</span>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="px-3 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium">
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm">
              {property.transactionType === "vente" ? "Vente" : property.transactionType === "location-ct" ? "Location courte durée" : "Location longue durée"}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-lg bg-[var(--primary)] text-white text-sm font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> En vedette
              </span>
            )}
          </div>

          {/* Share + Print + Favorite */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                isFavorite(property.id)
                  ? "border-red-400/30 bg-red-400/10 text-red-400"
                  : "border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)]"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite(property.id) ? "fill-current" : ""}`} />
              {isFavorite(property.id) ? "Sauvegardé" : "Sauvegarder"}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShare(!showShare)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors"
              >
                <Share2 className="w-4 h-4" /> Partager
              </button>
              {showShare && (
                <div className="absolute top-12 left-0 w-52 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden">
                  <button onClick={() => { window.open(`mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(window.location.href)}`); setShowShare(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)]">
                    <Mail className="w-4 h-4" /> Email
                  </button>
                  <button onClick={() => { handleCopyLink(); setShowShare(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)]">
                    <Copy className="w-4 h-4" /> {copied ? "Copié !" : "Copier le lien"}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors"
            >
              <Printer className="w-4 h-4" /> Imprimer
            </button>
            <Link
              href={`/feed?bien=${property.id}`}
              onClick={() => addToast(`Partagez "${property.title}" avec votre communauté.`, "info")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <PenSquare className="w-4 h-4" /> Publier un post
            </Link>
            <RecommendButton
              kind="bien"
              id={property.id}
              title={property.title}
              image={property.images?.[0]}
              price={property.price}
              currency={property.currency}
              transactionType={property.transactionType}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
            />
            {(activeRole === "hote" || activeRole === "agence" || activeRole === "promoteur") && (
              <button
                onClick={() => setShowBoostModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
              >
                <Rocket className="w-4 h-4" /> Booster
              </button>
            )}
          </div>

          {/* Characteristics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Bed, label: "Chambres", value: `${property.bedrooms}` },
              { icon: Bath, label: "Salles de bain", value: `${property.bathrooms}` },
              { icon: Maximize, label: "Surface", value: `${property.area}m²` },
              { icon: Layers, label: "Étage", value: property.floor !== undefined ? `${property.floor === 0 ? "RdC" : property.floor}` : "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-center">
                <Icon className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                <p className="text-lg font-bold text-[var(--foreground)]">{value}</p>
                <p className="text-xs text-[var(--text-muted)]">{label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Description</h2>
            <div className={`text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed ${!descExpanded ? "max-h-32 overflow-hidden relative" : ""}`}>
              {property.description}
              {!descExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--background)] to-transparent" />
              )}
            </div>
            <button
              onClick={() => setDescExpanded(!descExpanded)}
              className="mt-2 text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              {descExpanded ? (
                <>Voir moins <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Voir plus <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* Equipment */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Équipements</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span key={amenity} className="px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-sm text-[var(--text-secondary)]">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Floor plan - dynamic per property */}
          {FLOOR_PLANS[property.id] && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Plan du bien</h2>
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                <div className="space-y-3">
                  {FLOOR_PLANS[property.id].levels && (
                    <p className="text-xs text-[var(--text-muted)]">{FLOOR_PLANS[property.id].levels!.join(" · ")}</p>
                  )}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {FLOOR_PLANS[property.id].rooms.map((room) => (
                      <div key={room.name} className="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-center">
                        <p className="text-xs font-semibold text-[var(--foreground)]">{room.name}</p>
                        <p className="text-[10px] text-[var(--primary)] font-medium">{room.area} m²</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Surface totale : {FLOOR_PLANS[property.id].rooms.reduce((s, r) => s + r.area, 0)} m²
                  </p>
                </div>
                <p className="text-xs text-[var(--text-muted)] text-center mt-3">
                  Plan indicatif — Les surfaces sont approximatives
                </p>
              </div>
            </div>
          )}

          {/* Video section */}
          {property.videos && property.videos.length > 0 && property.videos.some((v) => v && !v.includes("example.com")) && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Visite virtuelle</h2>
              <div className="relative rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--card-border)]">
                <iframe
                  className="w-full aspect-video rounded-xl"
                  src="https://www.youtube.com/embed/FqjDgXlE2nQ"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Investment analytics - ONLY for vente.
              IMPORTANT : ces chiffres sont DECLARES par le vendeur.
              E-Dome ne les certifie pas — etiquetage explicite en tete
              et mention de verification en pied de bloc. */}
          {property.transactionType === "vente" && property.analytics && (
            <div className="mb-8">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                  Analyse d&apos;investissement
                </h2>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                  title="Ces chiffres sont déclarés par le vendeur. E-Dome ne les certifie pas."
                >
                  Données communiquées par le vendeur
                </span>
              </div>
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Rendement brut", value: `${property.analytics.rendementBrut.toFixed(1)}%`, color: "text-green-400" },
                    { label: "Rendement net", value: `${property.analytics.rendementNet.toFixed(1)}%`, color: "text-green-400" },
                    { label: "Prix/m²", value: formatPrice(property.analytics.prixM2, property.currency), color: "text-[var(--primary)]" },
                    { label: "DPE", value: property.analytics.dpe, color: "text-blue-400" },
                    { label: "État", value: property.analytics.etatGeneral, color: "text-[var(--foreground)]" },
                    { label: "Construction", value: `${property.analytics.anneeConstruction}`, color: "text-[var(--foreground)]" },
                    { label: "ROI 5 ans", value: `+${property.analytics.roi5ans}%`, color: "text-green-400" },
                    { label: "ROI 10 ans", value: `+${property.analytics.roi10ans}%`, color: "text-green-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center">
                      <p className={`text-lg font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-[var(--text-muted)]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Mortgage simulator */}
                <div className="border-t border-[var(--card-border)] pt-6">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[var(--primary)]" />
                    Simulateur hypothécaire
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Apport</label>
                      <input
                        type="number"
                        value={simApport}
                        onChange={(e) => setSimApport(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Durée (ans)</label>
                      <input
                        type="number"
                        value={simDuree}
                        onChange={(e) => setSimDuree(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Taux (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={simTaux}
                        onChange={(e) => setSimTaux(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--hover-bg)]">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Mensualité estimée</p>
                      <p className="text-xl font-bold text-[var(--primary)]">
                        {formatPrice(Math.round(monthlyPayment), property.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-muted)]">Coût total</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {formatPrice(Math.round(totalCost), property.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mention juridique : ces chiffres ne sont pas certifies par E-Dome */}
              <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Informations déclarées par le vendeur, à vérifier par l&apos;acheteur. E-Dome ne garantit pas ces chiffres.
              </p>
            </div>
          )}

          {/* Paid options */}
          {property.transactionType === "location-ct" && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Options & services</h2>
              <div className="space-y-2">
                {PAID_OPTIONS.map((opt) => {
                  const isSelected = selectedOptions.has(opt.id);
                  const isIncluded = !!(opt as { included?: boolean }).included;
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        isSelected || isIncluded
                          ? "border-[var(--primary)] bg-[var(--primary)]/10"
                          : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--text-muted)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.emoji}</span>
                        <div>
                          <span className="text-sm font-medium text-[var(--foreground)]">{opt.label}</span>
                          <span className="ml-2 text-sm text-[var(--text-muted)]">
                            {isIncluded ? "— Gratuit / Inclus" : `— +${formatPrice(opt.price, property.currency)}`}
                          </span>
                        </div>
                      </div>
                      {isIncluded ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                          Inclus
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOptions((prev) => {
                              const next = new Set(prev);
                              if (next.has(opt.id)) next.delete(opt.id);
                              else next.add(opt.id);
                              return next;
                            });
                          }}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isSelected
                              ? "bg-[var(--primary)] text-white"
                              : "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                          }`}
                        >
                          {isSelected ? "Ajouté \u2713" : "Ajouter"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {selectedOptions.size > 0 && (
                <div className="mt-3 p-4 rounded-xl bg-[var(--hover-bg)] flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Total options</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{formatPrice(optionsTotal, property.currency)}</span>
                </div>
              )}
            </div>
          )}

          {/* Calendar for location-ct */}
          {property.transactionType === "location-ct" && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Disponibilités</h2>
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                {/* Calendar nav */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </h3>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                {/* Days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => (
                    <div key={d} className="text-center text-xs text-[var(--text-muted)] py-1">{d}</div>
                  ))}
                </div>
                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: (getFirstDayOfMonth(calMonth, calYear) + 6) % 7 }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: getDaysInMonth(calMonth, calYear) }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const cellDate = new Date(calYear, calMonth, day);
                    const isPast = cellDate < today;
                    const isBooked = day % 7 === 0; // Mock: booked dates
                    const isDisabled = isPast || isBooked;
                    return (
                      <button
                        key={day}
                        disabled={isDisabled}
                        className={`py-2 rounded-lg text-sm transition-colors ${
                          isDisabled
                            ? "text-[var(--text-muted)] opacity-30 cursor-not-allowed line-through"
                            : "text-[var(--foreground)] hover:bg-[var(--primary)]/20 cursor-pointer"
                        } ${checkIn === dateStr || checkOut === dateStr ? "bg-[var(--primary)] text-white" : ""}`}
                        onClick={() => {
                          if (!checkIn || (checkIn && checkOut)) {
                            setCheckIn(dateStr);
                            setCheckOut("");
                          } else {
                            setCheckOut(dateStr);
                          }
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[var(--card-border)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <div className="w-3 h-3 rounded bg-[var(--primary)]/20" />
                    Disponible
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <div className="w-3 h-3 rounded bg-[var(--text-muted)]/20 line-through" />
                    Indisponible
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              {averageRating} · {reviews.length} avis
            </h2>

            {/* Review submission */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Laisser un avis</h3>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewRating(star)} className="cursor-pointer">
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Partagez votre expérience (min. 20 caractères)..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:border-[var(--primary)] mb-1"
              />
              <p className={`text-xs mb-3 ${reviewText.length >= 20 ? "text-green-400" : "text-[var(--text-muted)]"}`}>
                {reviewText.length}/20 caractères minimum
              </p>
              <button
                onClick={() => {
                  const newReview = {
                    id: `r-new-${Date.now()}`,
                    author: { name: "Vous", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80" },
                    rating: reviewRating,
                    content: reviewText,
                    date: new Date().toISOString().split("T")[0],
                  };
                  setReviews((prev) => [newReview, ...prev]);
                  setReviewRating(0);
                  setReviewText("");
                  addToast("Avis publié avec succès !", "success");
                }}
                disabled={!reviewRating || reviewText.trim().length < 20}
                className="px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white text-sm font-medium transition-colors disabled:opacity-40"
              >
                Publier
              </button>
            </div>

            {/* Existing reviews */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={review.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{review.author.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{review.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Apporteurs */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 space-y-4 mb-8">
            <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Handshake size={18} className="text-[var(--primary)]" />
              Devenez apporteur sur ce bien
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Partagez ce bien avec votre réseau et touchez une commission automatique si une transaction se conclut via votre lien.
            </p>

            {/* Lien de parrainage */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-xs text-[var(--text-secondary)] truncate">
                edome.world/ref/bien/{property.id}/{REFERRAL_ID}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(`https://edome.world/ref/bien/${property.id}/${REFERRAL_ID}`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--primary)]">
                {copyFeedback ? <><Check size={12} strokeWidth={2.5} /> Copié</> : <><Copy size={12} /> Copier</>}
              </button>
            </div>

            {/* Share buttons */}
            <div className="flex gap-2">
              <a href={`mailto:?subject=Bien E-Dome&body=${encodeURIComponent("Découvrez ce bien : https://edome.world/ref/bien/" + property.id + "/" + REFERRAL_ID)}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--card-border)] text-xs hover:bg-[var(--card-border)] transition-colors">
                <Mail size={12} /> Email
              </a>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--card-border)] text-xs hover:bg-[var(--card-border)] transition-colors">
                <QrCode size={12} /> QR Code
              </button>
            </div>

            {/* Rémunération apporteur V1.0 — différencié par pôle.
                · Vente entre particuliers : base = frais fixe E-Dome
                  (500 ou 2 500 CHF selon prix).
                · Location courte durée : base = commission marketplace E-Dome
                  (8 % indicatif).
                · Location longue durée : base = frais fixe E-Dome
                  (250 CHF tarif médian).
                Part apporteur : 10–30 % de cette base (fourchette V1.0). */}
            <div className="p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
              {(() => {
                let edomeRevenue = 0;
                let baseLabel = "";
                if (property.transactionType === "vente") {
                  edomeRevenue = property.price < 1_000_000 ? 500 : 2500;
                  baseLabel = property.price < 1_000_000
                    ? "Frais fixe plateforme : 500 CHF (vente < 1 M)"
                    : "Frais fixe plateforme : 2 500 CHF (vente ≥ 1 M)";
                } else if (property.transactionType === "location-ct") {
                  edomeRevenue = property.price * 7 * 0.08;
                  baseLabel = "Commission marketplace E-Dome : 8 % d'une réservation 7 nuits";
                } else {
                  edomeRevenue = 250;
                  baseLabel = "Frais fixe plateforme : 250 CHF (bail médian 6–12 mois)";
                }
                const apporteurLow = Math.round(edomeRevenue * 0.10);
                const apporteurHigh = Math.round(edomeRevenue * 0.30);
                return (
                  <>
                    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
                      <Wallet size={14} /> Rémunération apporteur : 10 à 30 % de la part E-Dome
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      → {baseLabel}<br />
                      → Soit potentiellement {formatPrice(apporteurLow, property.currency as any)} à {formatPrice(apporteurHigh, property.currency as any)} pour vous
                    </p>
                    <p className="inline-flex items-start gap-1.5 text-[10px] text-[var(--text-muted)] mt-2">
                      <Info size={11} className="mt-px shrink-0" />
                      <span>La part de l&apos;apporteur est prélevée sur les revenus de plateforme d&apos;E-Dome — frais fixe pour les ventes et la location longue durée, commission marketplace pour la location courte. Jamais ajoutée au prix payé par l&apos;hôte ou le client. Vous ne représentez aucune partie et n&apos;êtes ni agent ni courtier.</span>
                    </p>
                  </>
                );
              })()}
            </div>

            <a href="/apporteurs" className="text-xs text-[var(--primary)] hover:underline">
              En savoir plus sur le programme →
            </a>
          </div>

          {/* Similar properties */}
          {similarProperties.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Biens similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarProperties.slice(0, 3).map((sp) => (
                <Link
                  key={sp.id}
                  href={`/explorer/${sp.id}`}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden card-hover"
                >
                  <img src={sp.images[0]} alt="" className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{sp.title}</p>
                    <p className="text-sm font-bold text-[var(--primary)] mt-1">
                      {formatPrice(sp.price, sp.currency)}
                      {sp.transactionType === "location-ct" && <span className="text-xs text-[var(--text-muted)]">/nuit</span>}
                      {sp.transactionType === "location-lt" && <span className="text-xs text-[var(--text-muted)]">/mois</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                      <span>{sp.location.city}</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {sp.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Booking widget for location-ct */}
          {property.transactionType === "location-ct" && (() => {
            const nights = checkIn && checkOut
              ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
              : 0;
            const subtotal = nights * property.price;
            const fraisEdome = Math.round(subtotal * 0.08);
            const total = subtotal + fraisEdome + optionsTotal;
            return (
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 lg:sticky lg:top-20">
                <p className="text-2xl font-bold text-[var(--primary)] mb-1">
                  {formatPrice(property.price, property.currency)} <span className="text-sm font-normal text-[var(--text-muted)]">/ nuit</span>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Arrivée</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Départ</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Voyageurs</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] appearance-none cursor-pointer">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} voyageur{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-[var(--foreground)]">Options</p>
                  {PAID_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex items-center justify-between text-sm cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedOptions.has(opt.id)}
                          onChange={() => {
                            setSelectedOptions((prev) => {
                              const next = new Set(prev);
                              if (next.has(opt.id)) next.delete(opt.id); else next.add(opt.id);
                              return next;
                            });
                          }}
                          className="w-4 h-4 rounded accent-[var(--primary)]" />
                        <span className="text-[var(--text-secondary)]">{opt.label}</span>
                      </span>
                      <span className="text-[var(--primary)] text-xs">{formatPrice(opt.price, property.currency)}</span>
                    </label>
                  ))}
                </div>
                {nights > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--card-border)] space-y-2">
                    <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                      <span>{nights} nuit{nights > 1 ? "s" : ""} x {formatPrice(property.price, property.currency)}</span>
                      <span>{formatPrice(subtotal, property.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                      <span>Frais E-Dome</span>
                      <span>{formatPrice(fraisEdome, property.currency)}</span>
                    </div>
                    {optionsTotal > 0 && (
                      <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span>Options</span>
                        <span>{formatPrice(optionsTotal, property.currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-[var(--foreground)] pt-2 border-t border-[var(--card-border)]">
                      <span>Total</span>
                      <span className="text-[var(--primary)]">{formatPrice(total, property.currency)}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!checkIn || !checkOut) { addToast("Veuillez sélectionner les dates.", "warning"); return; }
                    router.push("/paiement");
                  }}
                  className="w-full mt-4 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors"
                >
                  Réserver
                </button>
                <Link href="/messages" className="block text-center mt-3 text-sm text-[var(--primary)] hover:underline">
                  Contacter l&apos;hôte
                </Link>
              </div>
            );
          })()}

          {/* Vente CTAs */}
          {property.transactionType === "vente" && (
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 lg:sticky lg:top-20 space-y-3">
              <p className="text-2xl font-bold text-[var(--primary)] mb-4">
                {formatPrice(property.price, property.currency)}
              </p>
              <button
                onClick={() => setShowVisitModal(true)}
                className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" /> Planifier une visite
              </button>
              <button
                onClick={() => setShowOfferModal(true)}
                className="w-full py-3 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" /> Faire une offre
              </button>
              <Link
                href="/messages"
                className="w-full py-3 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Contacter l&apos;agent
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full py-3 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Télécharger la fiche PDF
              </button>
            </div>
          )}

          {/* Host card */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/profil/${property.host.id}`}>
                <img src={property.host.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
              </Link>
              <div>
                <Link href={`/profil/${property.host.id}`} className="font-semibold text-[var(--foreground)] hover:underline">
                  {property.host.firstName} {property.host.lastName}
                </Link>
                <span className={`block text-xs mt-0.5 px-2 py-0.5 rounded-full w-fit ${roleBadgeColors[property.host.activeRole]}`}>
                  {roleLabels[property.host.activeRole]}
                </span>
              </div>
            </div>
            {property.host.bio && (
              <p className="text-sm text-[var(--text-secondary)] mb-4">{property.host.bio}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {property.host.stats.rating}
              </span>
              <span>{property.host.stats.reviews} avis</span>
              {property.host.responseTime && <span>Rép. {property.host.responseTime}</span>}
            </div>
            {property.host.languages && (
              <p className="text-xs text-[var(--text-muted)] mb-4">
                Langues : {property.host.languages.join(", ")}
              </p>
            )}
            {property.host.certifications && (
              <div className="flex flex-wrap gap-2 mb-4">
                {property.host.certifications.map((cert) => (
                  <span key={cert} className="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {cert}
                  </span>
                ))}
              </div>
            )}

            {/* Contact form */}
            {contactSent ? (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-fade-in">
                <p className="text-sm text-green-400 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Message envoyé avec succès !
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Votre email"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                />
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Votre message..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:border-[var(--primary)]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Contacter l&apos;hôte
                </button>
              </form>
            )}

            {/* Report */}
            <button
              onClick={() => setShowReport(true)}
              className="w-full mt-3 py-2 text-xs text-[var(--text-muted)] hover:text-red-400 flex items-center justify-center gap-1 transition-colors"
            >
              <Flag className="w-3 h-3" /> Signaler cette annonce
            </button>
          </div>
        </aside>
      </div>

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--foreground)]">Signaler l&apos;annonce</h3>
              <button onClick={() => setShowReport(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {["Contenu inapproprié", "Photos trompeuses", "Prix incorrect", "Arnaque suspectée", "Autre"].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    reportReason === reason ? "border-red-400 bg-red-400/10" : "border-[var(--card-border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="report"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="accent-red-400"
                  />
                  <span className="text-sm text-[var(--foreground)]">{reason}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowReport(false)}
              disabled={!reportReason}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-40"
            >
              Envoyer le signalement
            </button>
          </div>
        </div>
      )}

      {/* Visit scheduling modal (vente) */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowVisitModal(false)}>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--foreground)]">Planifier une visite</h3>
              <button onClick={() => setShowVisitModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Date souhaitée</label>
                <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Heure</label>
                <select value={visitTime} onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] appearance-none cursor-pointer">
                  {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Message (optionnel)</label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Précisez vos disponibilités ou questions..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:border-[var(--primary)]"
                />
              </div>
              <button
                onClick={() => {
                  if (!visitDate) { addToast("Veuillez sélectionner une date.", "warning"); return; }
                  addToast("Demande de visite envoyée avec succès !", "success");
                  setShowVisitModal(false);
                  setVisitDate("");
                  setRequestMessage("");
                }}
                className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors"
              >
                Envoyer la demande
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer modal (vente) */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowOfferModal(false)}>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--foreground)]">Faire une offre</h3>
              <button onClick={() => setShowOfferModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Prix demandé</label>
                <p className="text-sm text-[var(--foreground)] font-semibold">{formatPrice(property.price, property.currency)}</p>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Montant de votre offre ({property.currency})</label>
                <input type="number" value={offerAmount} onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Conditions (optionnel)</label>
                <textarea value={offerConditions} onChange={(e) => setOfferConditions(e.target.value)}
                  placeholder="Ex: sous réserve de financement, date de remise souhaitée..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:border-[var(--primary)]" />
              </div>
              <button
                onClick={() => {
                  if (!offerAmount || offerAmount <= 0) { addToast("Veuillez saisir un montant valide.", "warning"); return; }
                  addToast("Offre envoyée avec succès !", "success");
                  setShowOfferModal(false);
                  setOfferConditions("");
                }}
                className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors"
              >
                Soumettre l&apos;offre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boost modal */}
      {showBoostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowBoostModal(false)}>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[var(--primary)]" /> Booster ce bien
              </h3>
              <button onClick={() => setShowBoostModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              Le bien apparaitra en premier dans l&apos;Explorer avec un badge &laquo;Mis en avant&raquo;.
            </p>
            <div className="space-y-2 mb-6">
              {([
                { days: 7 as const, price: 99 },
                { days: 14 as const, price: 179 },
                { days: 30 as const, price: 299 },
              ] as const).map((opt) => (
                <label
                  key={opt.days}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    boostDuration === opt.days ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--card-border)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="boost"
                      checked={boostDuration === opt.days}
                      onChange={() => setBoostDuration(opt.days)}
                      className="accent-[var(--primary)]"
                    />
                    <span className="text-sm font-medium text-[var(--foreground)]">{opt.days} jours</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--primary)]">{formatPrice(opt.price)}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => {
                addToast("Boost active !", "success");
                setShowBoostModal(false);
              }}
              className="w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              <Rocket className="w-4 h-4" /> Confirmer le boost
            </button>
          </div>
        </div>
      )}

      {/* Sticky CTA bar — décalée AU-DESSUS de la bottom-nav mobile
          (64 px nav + safe-area iOS). Sans ce décalage, le prix + CTA
          se retrouvent sous la nav et le bouton "Réserver" devient
          inatteignable au doigt. */}
      <div
        className="fixed left-0 right-0 z-30 lg:hidden border-t border-[var(--card-border)] bg-[var(--card)] px-4 py-3 flex items-center justify-between"
        style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }}
      >
        <div>
          <p className="text-lg font-bold text-[var(--primary)]">
            {formatPrice(property.price, property.currency)}
          </p>
          {property.transactionType === "location-ct" && (
            <span className="text-xs text-[var(--text-muted)]">par nuit</span>
          )}
        </div>
        {property.transactionType === "vente" ? (
          <div className="flex gap-2">
            <button onClick={() => setShowVisitModal(true)} className="px-4 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors text-sm">
              Visite
            </button>
            <button onClick={() => setShowOfferModal(true)} className="px-4 py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] font-semibold transition-colors text-sm">
              Offre
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!checkIn || !checkOut) { addToast("Sélectionnez vos dates.", "warning"); return; }
              router.push("/paiement");
            }}
            className="px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors"
          >
            Réserver
          </button>
        )}
      </div>
    </div>
  );
}
