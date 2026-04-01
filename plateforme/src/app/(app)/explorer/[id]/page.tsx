"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Heart, Share2, Star, MapPin, Bed, Bath, Maximize,
  ChevronLeft, ChevronRight, X, Play, Pause, Printer,
  Calendar as CalendarIcon, ChevronDown, ChevronUp,
  TrendingUp, BarChart3, Shield, Check, Send, Flag,
  Facebook, Mail, Copy, Phone, MessageCircle, Users,
  Building2, Layers, DollarSign, Percent, Award,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { timeAgo, formatDate } from "@/lib/utils";
import { roleBadgeColors, roleLabels } from "@/lib/types";
import type { Property, PropertyAnalytics, User, Currency } from "@/lib/types";

// ─── Mock property data ──────────────────────────────────────────────────────

const MOCK_HOST: User = {
  id: "u1", firstName: "Sophie", lastName: "Martin", email: "sophie@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
  stats: { followers: 1240, following: 380, properties: 12, reviews: 89, rating: 4.8, transactions: 45, revenue: 125000 },
  bio: "Hôte passionnée, spécialiste de l'immobilier de luxe en Suisse romande. Réponse rapide garantie.",
  languages: ["Français", "Anglais", "Allemand"],
  certifications: ["Superhôte E-Dome", "Identité vérifiée"],
  responseTime: "< 1h",
};

const MOCK_PROPERTIES: Record<string, Property> = {
  prop1: {
    id: "prop1", title: "Villa moderne avec piscine infinity et vue lac", description: "Découvrez cette villa d'exception située sur les hauteurs de Lausanne, offrant une vue panoramique imprenable sur le lac Léman et les Alpes.\n\nCette propriété de standing comprend 5 chambres spacieuses, 3 salles de bains luxueuses, un salon double hauteur baigné de lumière naturelle, une cuisine gastronomique entièrement équipée Gaggenau, et une suite parentale avec dressing et salle de bains privative.\n\nL'extérieur est tout aussi remarquable avec sa piscine infinity chauffée, son jardin paysager de 800m², sa terrasse couverte et son garage double. Les finitions haut de gamme incluent du parquet en chêne massif, de la pierre naturelle et des menuiseries en aluminium.\n\nSituée dans un quartier résidentiel prisé, à proximité des écoles internationales et du centre-ville, cette villa représente un investissement exceptionnel.",
    type: "villa", transactionType: "vente", price: 1850000, currency: "CHF",
    location: { city: "Lausanne", country: "Suisse", address: "Route de Berne 45" },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
    ],
    videos: ["https://example.com/visite-virtuelle.mp4"],
    host: MOCK_HOST, bedrooms: 5, bathrooms: 3, area: 320, floor: 0,
    amenities: ["Piscine infinity", "Jardin paysager", "Garage double", "Cuisine Gaggenau", "Domotique", "Alarme", "Parquet chêne", "Cave à vin", "Buanderie", "Terrasse couverte", "Vue lac", "Cheminée"],
    rating: 4.9, reviewCount: 24, featured: true,
    analytics: { rendementBrut: 5.2, rendementNet: 3.8, prixM2: 5781, dpe: "A", etatGeneral: "Neuf", anneeConstruction: 2023, potentielPlusValue: 15, roi5ans: 32, roi10ans: 72, tauxOccupation: 95 },
  },
  prop2: {
    id: "prop2", title: "Appartement vue lac - Montreux", description: "Superbe appartement avec vue imprenable sur le lac Léman.",
    type: "appartement", transactionType: "location-ct", price: 250, currency: "CHF",
    location: { city: "Montreux", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"],
    host: MOCK_HOST, bedrooms: 3, bathrooms: 2, area: 120,
    amenities: ["Vue lac", "Balcon", "Parking", "WiFi", "Cuisine équipée", "Lave-linge"],
    rating: 4.7, reviewCount: 56,
  },
};

const MOCK_REVIEWS = [
  { id: "r1", author: { name: "Jean-Pierre M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" }, rating: 5, content: "Villa absolument magnifique ! La vue sur le lac est à couper le souffle. Sophie est une hôte exceptionnelle.", date: "2026-03-15" },
  { id: "r2", author: { name: "Marie L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80" }, rating: 5, content: "Finitions impeccables, emplacement idéal. Je recommande vivement.", date: "2026-02-28" },
  { id: "r3", author: { name: "Thomas K.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80" }, rating: 4, content: "Très belle propriété, conforme aux photos. Le jardin est magnifique.", date: "2026-01-10" },
];

const SIMILAR_PROPERTIES = [
  { id: "prop4", title: "Penthouse panoramique", price: 3200000, currency: "CHF" as Currency, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", city: "Genève", bedrooms: 4, area: 280, rating: 5.0, transactionType: "vente" as const },
  { id: "prop8", title: "Maison familiale Neuchâtel", price: 980000, currency: "CHF" as Currency, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", city: "Neuchâtel", bedrooms: 4, area: 180, rating: 4.6, transactionType: "vente" as const },
  { id: "prop5", title: "Chalet alpin Verbier", price: 350, currency: "CHF" as Currency, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", city: "Verbier", bedrooms: 6, area: 400, rating: 4.9, transactionType: "location-ct" as const },
];

const PAID_OPTIONS = [
  { id: "o1", label: "Nettoyage professionnel", price: 150 },
  { id: "o2", label: "Transfert aéroport", price: 80 },
  { id: "o3", label: "Panier de bienvenue", price: 45 },
  { id: "o4", label: "Late checkout (14h)", price: 60 },
  { id: "o5", label: "Chef privé (dîner)", price: 350 },
];

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { formatPrice, toggleFavorite, isFavorite } = useApp();

  const property = MOCK_PROPERTIES[id] || MOCK_PROPERTIES.prop1;

  // Gallery
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);

  // Description
  const [descExpanded, setDescExpanded] = useState(false);

  // Video
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Investment simulator
  const [simApport, setSimApport] = useState(property.price * 0.2);
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
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Share
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Track recently viewed
  useEffect(() => {
    try {
      const stored = localStorage.getItem("edome_recently_viewed");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      const updated = [property.id, ...ids.filter((i) => i !== property.id)].slice(0, 10);
      localStorage.setItem("edome_recently_viewed", JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [property.id]);

  // Keyboard nav for gallery
  useEffect(() => {
    if (!showFullGallery) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setGalleryIndex((prev) => (prev + 1) % property.images.length);
      if (e.key === "ArrowLeft") setGalleryIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
      if (e.key === "Escape") setShowFullGallery(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showFullGallery, property.images.length]);

  const optionsTotal = PAID_OPTIONS.filter((o) => selectedOptions.has(o.id)).reduce((sum, o) => sum + o.price, 0);

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

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Back button */}
      <Link
        href="/explorer"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

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
          <div className="flex-1 flex items-center justify-center relative">
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
                  i === galleryIndex ? "border-[#C4956A]" : "border-transparent opacity-50"
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
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4" />
                  {property.location.address && `${property.location.address}, `}
                  {property.location.city}, {property.location.country}
                </span>
                <span className="flex items-center gap-1 text-[#C4956A]">
                  <Star className="w-4 h-4 fill-[#C4956A]" />
                  {property.rating} ({property.reviewCount} avis)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl md:text-3xl font-bold text-[#C4956A]">
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
            <span className="px-3 py-1 rounded-lg bg-[#C4956A]/10 text-[#C4956A] text-sm font-medium">
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm">
              {property.transactionType === "vente" ? "Vente" : property.transactionType === "location-ct" ? "Location courte durée" : "Location longue durée"}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-lg bg-[#C4956A] text-white text-sm font-medium flex items-center gap-1">
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
                  <button onClick={() => { window.open(`https://www.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}`); setShowShare(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)]">
                    <Facebook className="w-4 h-4" /> Facebook
                  </button>
                  <button onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(property.title + " " + window.location.href)}`); setShowShare(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)]">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
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
                <Icon className="w-6 h-6 text-[#C4956A] mx-auto mb-2" />
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
              className="mt-2 text-sm text-[#C4956A] hover:underline flex items-center gap-1"
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

          {/* Video section */}
          {property.videos && property.videos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Visite virtuelle</h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--card-border)]">
                <video
                  src={property.videos[0]}
                  className="w-full h-full object-cover"
                  controls={videoPlaying}
                  poster={property.images[0]}
                />
                {!videoPlaying && (
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#C4956A] flex items-center justify-center">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Investment analytics - ONLY for vente */}
          {property.transactionType === "vente" && property.analytics && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C4956A]" />
                Analyse d&apos;investissement
              </h2>
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Rendement brut", value: `${property.analytics.rendementBrut.toFixed(1)}%`, color: "text-green-400" },
                    { label: "Rendement net", value: `${property.analytics.rendementNet.toFixed(1)}%`, color: "text-green-400" },
                    { label: "Prix/m²", value: formatPrice(property.analytics.prixM2, property.currency), color: "text-[#C4956A]" },
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
                    <DollarSign className="w-4 h-4 text-[#C4956A]" />
                    Simulateur hypothécaire
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Apport</label>
                      <input
                        type="number"
                        value={simApport}
                        onChange={(e) => setSimApport(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[#C4956A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Durée (ans)</label>
                      <input
                        type="number"
                        value={simDuree}
                        onChange={(e) => setSimDuree(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[#C4956A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Taux (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={simTaux}
                        onChange={(e) => setSimTaux(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[#C4956A]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--hover-bg)]">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Mensualité estimée</p>
                      <p className="text-xl font-bold text-[#C4956A]">
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
            </div>
          )}

          {/* Paid options */}
          {property.transactionType === "location-ct" && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Options supplémentaires</h2>
              <div className="space-y-2">
                {PAID_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      selectedOptions.has(opt.id)
                        ? "border-[#C4956A] bg-[#C4956A]/10"
                        : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedOptions.has(opt.id)}
                        onChange={() => {
                          setSelectedOptions((prev) => {
                            const next = new Set(prev);
                            if (next.has(opt.id)) next.delete(opt.id);
                            else next.add(opt.id);
                            return next;
                          });
                        }}
                        className="w-4 h-4 rounded accent-[#C4956A]"
                      />
                      <span className="text-sm text-[var(--foreground)]">{opt.label}</span>
                    </div>
                    <span className="text-sm font-medium text-[#C4956A]">
                      {formatPrice(opt.price, property.currency)}
                    </span>
                  </label>
                ))}
              </div>
              {selectedOptions.size > 0 && (
                <div className="mt-3 p-4 rounded-xl bg-[var(--hover-bg)] flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Total options</span>
                  <span className="text-lg font-bold text-[#C4956A]">{formatPrice(optionsTotal, property.currency)}</span>
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
                    const isAvailable = day % 7 !== 0; // Mock availability
                    return (
                      <button
                        key={day}
                        disabled={!isAvailable}
                        className={`py-2 rounded-lg text-sm transition-colors ${
                          isAvailable
                            ? "text-[var(--foreground)] hover:bg-[#C4956A]/20 cursor-pointer"
                            : "text-[var(--text-muted)] opacity-30 cursor-not-allowed line-through"
                        } ${checkIn === dateStr || checkOut === dateStr ? "bg-[#C4956A] text-white" : ""}`}
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
                {/* Availability request */}
                <div className="mt-6 pt-6 border-t border-[var(--card-border)]">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Demande de disponibilité</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Arrivée</label>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[#C4956A]" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Départ</label>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[#C4956A]" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Voyageurs</label>
                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[#C4956A] appearance-none cursor-pointer">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n} voyageur{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Message pour l'hôte (optionnel)..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:border-[#C4956A] mb-3"
                  />
                  <button className="w-full py-3 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors">
                    Demander la disponibilité
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#C4956A] text-[#C4956A]" />
              {property.rating} · {property.reviewCount} avis
            </h2>

            {/* Review submission */}
            {!reviewSubmitted ? (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-6">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Laisser un avis</h3>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)}>
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= reviewRating ? "fill-[#C4956A] text-[#C4956A]" : "text-[var(--text-muted)]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:border-[#C4956A] mb-3"
                />
                <button
                  onClick={() => setReviewSubmitted(true)}
                  disabled={!reviewRating || !reviewText.trim()}
                  className="px-5 py-2 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white text-sm font-medium transition-colors disabled:opacity-40"
                >
                  Publier l&apos;avis
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 mb-6 animate-fade-in">
                <p className="text-sm text-green-400 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Merci pour votre avis !
                </p>
              </div>
            )}

            {/* Existing reviews */}
            <div className="space-y-4">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={review.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{review.author.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-[#C4956A] text-[#C4956A]" : "text-[var(--text-muted)]"}`} />
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

          {/* Similar properties */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Biens similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SIMILAR_PROPERTIES.map((sp) => (
                <Link
                  key={sp.id}
                  href={`/explorer/${sp.id}`}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden card-hover"
                >
                  <img src={sp.image} alt="" className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{sp.title}</p>
                    <p className="text-sm font-bold text-[#C4956A] mt-1">
                      {formatPrice(sp.price, sp.currency)}
                      {sp.transactionType === "location-ct" && <span className="text-xs text-[var(--text-muted)]">/nuit</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                      <span>{sp.city}</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-[#C4956A] text-[#C4956A]" /> {sp.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Host card */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 lg:sticky lg:top-20">
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
                <Star className="w-4 h-4 fill-[#C4956A] text-[#C4956A]" /> {property.host.stats.rating}
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
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A]"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Votre email"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A]"
                />
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Votre message..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:border-[#C4956A]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors flex items-center justify-center gap-2"
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

      {/* Sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-[var(--card-border)] bg-[var(--card)] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-[#C4956A]">
            {formatPrice(property.price, property.currency)}
          </p>
          {property.transactionType === "location-ct" && (
            <span className="text-xs text-[var(--text-muted)]">par nuit</span>
          )}
        </div>
        <button className="px-6 py-3 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors">
          {property.transactionType === "vente" ? "Contacter" : "Réserver"}
        </button>
      </div>
    </div>
  );
}
