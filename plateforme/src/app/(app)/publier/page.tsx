"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Camera,
  Video,
  Upload,
  X,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Eye,
  Star,
  Waves,
  Car,
  TreePine,
  Mountain,
  Wind,
  Flame,
  Sofa,
  Anchor,
  Fence,
  CableCar,
  DoorClosed,
  Warehouse,
  Snowflake,
  Palmtree,
  FileText,
  Sparkles,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Calculator,
  Sun,
  Leaf,
  Flower2,
  Play,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";
import type { TransactionType, PropertyType, PaidOption } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────

// Analytics step (step 4) is only shown for "vente" transactions

const transactionTypes: { value: TransactionType; label: string; desc: string }[] = [
  { value: "vente", label: "Vente", desc: "Vendre votre bien immobilier" },
  {
    value: "location-lt",
    label: "Location longue durée",
    desc: "Louer sur plusieurs mois ou années",
  },
  {
    value: "location-ct",
    label: "Location courte durée",
    desc: "Location saisonnière ou courte durée",
  },
];

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "villa", label: "Villa" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft" },
  { value: "chalet", label: "Chalet" },
  { value: "terrain", label: "Terrain" },
  { value: "commercial", label: "Commercial" },
];

const currencies = ["CHF", "EUR"];

interface EquipmentItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const equipmentOptions: EquipmentItem[] = [
  { id: "piscine", label: "Piscine", icon: Waves },
  { id: "parking", label: "Parking", icon: Car },
  { id: "jardin", label: "Jardin", icon: TreePine },
  { id: "terrasse", label: "Terrasse", icon: Mountain },
  { id: "ascenseur", label: "Ascenseur", icon: CableCar },
  { id: "balcon", label: "Balcon", icon: Fence },
  { id: "cave", label: "Cave", icon: DoorClosed },
  { id: "garage", label: "Garage", icon: Warehouse },
  { id: "climatisation", label: "Climatisation", icon: Snowflake },
  { id: "cheminee", label: "Cheminée", icon: Flame },
  { id: "meuble", label: "Meublé", icon: Sofa },
  { id: "vue-mer", label: "Vue mer", icon: Anchor },
  { id: "vue-montagne", label: "Vue montagne", icon: Mountain },
];

const dpeOptions = ["A", "B", "C", "D", "E", "F", "G"];
const etatOptions = ["Neuf", "Excellent", "Bon", "À rénover", "À rénover entièrement"];
const potentielOptions = ["Faible", "Moyen", "Élevé", "Très élevé"];
const saisonOptions = [
  { id: "ete", label: "Été", icon: Sun },
  { id: "hiver", label: "Hiver", icon: Snowflake },
  { id: "printemps", label: "Printemps", icon: Flower2 },
  { id: "automne", label: "Automne", icon: Leaf },
];

// ─── Form State Types ───────────────────────────────────

interface AnalyticsData {
  rendementBrut: string;
  rendementNet: string;
  chargesAnnuelles: string;
  taxeFonciere: string;
  revenusLocatifs: string;
  potentielPlusValue: string;
  anneeConstruction: string;
  dpe: string;
  etatGeneral: string;
  travauxEstimes: string;
  tauxOccupation: string;
  revenusAnnuels: string;
  saisonHaute: string[];
  prixHauteSaison: string;
  prixBasseSaison: string;
  roi5ans: string;
  roi10ans: string;
  notesInvestisseur: string;
}

const defaultAnalytics: AnalyticsData = {
  rendementBrut: "",
  rendementNet: "",
  chargesAnnuelles: "",
  taxeFonciere: "",
  revenusLocatifs: "",
  potentielPlusValue: "",
  anneeConstruction: "",
  dpe: "",
  etatGeneral: "",
  travauxEstimes: "",
  tauxOccupation: "",
  revenusAnnuels: "",
  saisonHaute: [],
  prixHauteSaison: "",
  prixBasseSaison: "",
  roi5ans: "",
  roi10ans: "",
  notesInvestisseur: "",
};

interface FormData {
  // Step 1
  transactionType: TransactionType | "";
  propertyType: PropertyType | "";
  address: string;
  city: string;
  country: string;
  price: string;
  currency: string;
  // Step 2
  bedrooms: string;
  bathrooms: string;
  area: string;
  floor: string;
  title: string;
  description: string;
  // Step 3
  photos: File[];
  photoPreviewUrls: string[];
  video: File | null;
  equipment: Set<string>;
  documents: File[];
  // Step 4 — Analytics
  analytics: AnalyticsData;
  // Step 5
  customOptions: CustomOption[];
  termsAccepted: boolean;
}

interface CustomOption {
  id: string;
  name: string;
  price: string;
  perDay: boolean;
}

type FieldErrors = Record<string, string>;

// ─── Validation ─────────────────────────────────────────

function validateStep(step: number, data: FormData): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1) {
    if (!data.transactionType) errors.transactionType = "Sélectionnez un type de transaction";
    if (!data.propertyType) errors.propertyType = "Sélectionnez un type de bien";
    if (!data.address.trim()) errors.address = "Adresse requise";
    if (!data.city.trim()) errors.city = "Ville requise";
    if (!data.country.trim()) errors.country = "Pays requis";
    if (!data.price.trim() || isNaN(Number(data.price)) || Number(data.price) <= 0)
      errors.price = "Prix valide requis";
  }

  if (step === 2) {
    if (!data.title.trim()) errors.title = "Titre requis";
    if (!data.description.trim()) errors.description = "Description requise";
    if (!data.area.trim() || isNaN(Number(data.area)) || Number(data.area) <= 0)
      errors.area = "Surface valide requise";
  }

  if (step === 5) {
    if (!data.termsAccepted) errors.terms = "Vous devez accepter les conditions";
  }

  return errors;
}

// ─── Main Component ─────────────────────────────────────

const STORAGE_KEY = "edome_publish_form";

function loadFormFromStorage(): Partial<FormData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Restore Set from array
    if (Array.isArray(parsed.equipment)) {
      parsed.equipment = new Set(parsed.equipment);
    }
    // Restore analytics saisonHaute as array
    if (parsed.analytics && !Array.isArray(parsed.analytics.saisonHaute)) {
      parsed.analytics.saisonHaute = [];
    }
    // Files cannot be stored; reset them
    parsed.photos = [];
    parsed.photoPreviewUrls = [];
    parsed.video = null;
    parsed.documents = [];
    return parsed;
  } catch {
    return null;
  }
}

function saveFormToStorage(data: FormData) {
  if (typeof window === "undefined") return;
  try {
    const serializable = {
      ...data,
      equipment: Array.from(data.equipment),
      photos: [],
      photoPreviewUrls: [],
      video: null,
      documents: [],
      _documentsCount: data.documents.length,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // silently fail
  }
}

export default function PublierPage() {
  const { availableRoles } = useApp();
  const REQUIRED_ROLES = ['hote', 'agence', 'promoteur', 'proprietaire'];
  const hasAccess = REQUIRED_ROLES.some(r => availableRoles.includes(r as any));

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = loadFormFromStorage();
    return {
      transactionType: "",
      propertyType: "",
      address: "",
      city: "",
      country: "Suisse",
      price: "",
      currency: "CHF",
      bedrooms: "0",
      bathrooms: "1",
      area: "",
      floor: "",
      title: "",
      description: "",
      photos: [],
      photoPreviewUrls: [],
      video: null,
      equipment: new Set<string>(),
      documents: [],
      analytics: { ...defaultAnalytics },
      customOptions: [],
      termsAccepted: false,
      ...saved,
    };
  });

  // Persist form data to localStorage on every change
  useEffect(() => {
    saveFormToStorage(formData);
  }, [formData]);

  // ─── Update helpers ─────────────────────────────────

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const updateAnalytics = (key: keyof AnalyticsData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      analytics: { ...prev.analytics, [key]: value },
    }));
  };

  const toggleEquipment = (id: string) => {
    setFormData((prev) => {
      const next = new Set(prev.equipment);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, equipment: next };
    });
  };

  // ─── Photo handling ────────────────────────────────

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const newFiles = Array.from(files);
      const newUrls = newFiles.map((f) => URL.createObjectURL(f));
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newFiles],
        photoPreviewUrls: [...prev.photoPreviewUrls, ...newUrls],
      }));
    },
    []
  );

  const removePhoto = (index: number) => {
    setFormData((prev) => {
      URL.revokeObjectURL(prev.photoPreviewUrls[index]);
      return {
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
        photoPreviewUrls: prev.photoPreviewUrls.filter((_, i) => i !== index),
      };
    });
  };

  const handleFileDrop = useCallback((files: File[]) => {
    const newUrls = files.map((f) => URL.createObjectURL(f));
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
      photoPreviewUrls: [...prev.photoPreviewUrls, ...newUrls],
    }));
  }, []);

  const movePhoto = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.photos.length) return prev;
      const photos = [...prev.photos];
      const urls = [...prev.photoPreviewUrls];
      [photos[index], photos[newIndex]] = [photos[newIndex], photos[index]];
      [urls[index], urls[newIndex]] = [urls[newIndex], urls[index]];
      return { ...prev, photos, photoPreviewUrls: urls };
    });
  };

  // ─── Document handling ──────────────────────────────

  const handleDocumentUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }));
    },
    []
  );

  const handleDocumentDrop = useCallback((files: File[]) => {
    const accepted = files.filter((f) => {
      const ext = f.name.toLowerCase().split(".").pop();
      return ext === "pdf" || ext === "doc" || ext === "docx";
    });
    if (accepted.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...accepted],
    }));
  }, []);

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // ─── Custom options ────────────────────────────────

  const addCustomOption = () => {
    setFormData((prev) => ({
      ...prev,
      customOptions: [
        ...prev.customOptions,
        { id: `custom-${Date.now()}`, name: "", price: "", perDay: false },
      ],
    }));
  };

  const updateCustomOption = (id: string, field: keyof CustomOption, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      customOptions: prev.customOptions.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const removeCustomOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customOptions: prev.customOptions.filter((opt) => opt.id !== id),
    }));
  };

  // ─── Navigation ────────────────────────────────────

  const isVente = formData.transactionType === "vente";

  const goNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (currentStep < 5) {
      let next = currentStep + 1;
      // Skip analytics step (4) for non-vente
      if (!isVente && next === 4) next = 5;
      setCurrentStep(next);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setErrors({});
      let prev = currentStep - 1;
      // Skip analytics step (4) for non-vente
      if (!isVente && prev === 4) prev = 3;
      setCurrentStep(prev);
    }
  };

  const handlePublish = () => {
    const stepErrors = validateStep(5, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublished(true);
      localStorage.removeItem(STORAGE_KEY);
    }, 2000);
  };

  // ─── Success view ──────────────────────────────────

  const resetForm = () => {
    setPublished(false);
    setCurrentStep(1);
    const blank: FormData = {
      transactionType: "",
      propertyType: "",
      address: "",
      city: "",
      country: "Suisse",
      price: "",
      currency: "CHF",
      bedrooms: "0",
      bathrooms: "1",
      area: "",
      floor: "",
      title: "",
      description: "",
      photos: [],
      photoPreviewUrls: [],
      video: null,
      equipment: new Set(),
      documents: [],
      analytics: { ...defaultAnalytics },
      customOptions: [],
      termsAccepted: false,
    };
    setFormData(blank);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Auto-redirect countdown
  const [countdown, setCountdown] = useState(10);
  useEffect(() => {
    if (!published) return;
    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/explorer");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [published, router]);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Accès restreint</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">Cette page est réservée aux hôtes, agences, promoteurs et propriétaires. Activez ce rôle dans vos paramètres.</p>
          <Link href="/parametres" className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold">Gérer mes rôles</Link>
        </div>
      </div>
    );
  }

  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]"
      >
        {/* Animated checkmark with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative"
        >
          {/* Glow effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[#C4956A] blur-3xl"
            style={{ transform: "scale(3)" }}
          />
          {/* Confetti particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="confetti-particle" />
            <span className="confetti-particle" />
            <span className="confetti-particle" />
            <span className="confetti-particle" />
            <span className="confetti-particle" />
            <span className="confetti-particle" />
            <span className="confetti-particle" />
            <span className="confetti-particle" />
          </div>
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#C4956A]/10 ring-2 ring-[#C4956A]/30">
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CheckCircle2 className="h-14 w-14 text-[#C4956A]" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-3xl font-bold text-[var(--foreground)] sm:text-4xl"
        >
          Votre bien a été publié !
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-3 max-w-md text-center text-[var(--text-secondary)]"
        >
          Il sera visible après validation par notre équipe. Vous recevrez une notification dès qu&apos;il sera en ligne.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-4"
        >
          <button
            onClick={() => router.push("/explorer")}
            className="rounded-xl bg-[#C4956A] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574]"
          >
            Voir mon bien
          </button>
          <button
            onClick={resetForm}
            className="rounded-xl border border-[var(--card-border)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white/5"
          >
            Publier un autre
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-xs text-[var(--text-muted)]"
        >
          Redirection automatique dans {countdown} seconde{countdown > 1 ? "s" : ""}...
        </motion.p>
      </motion.div>
    );
  }

  // ─── Step labels ───────────────────────────────────

  const stepLabels = isVente
    ? [
        "Type & Localisation",
        "Caractéristiques",
        "Médias & Équipements",
        "Données Analytiques",
        "Options & Validation",
      ]
    : [
        "Type & Localisation",
        "Caractéristiques",
        "Médias & Équipements",
        "Options & Validation",
      ];

  // Map display index to actual step number
  const stepNumbers = isVente ? [1, 2, 3, 4, 5] : [1, 2, 3, 5];
  const currentDisplayIndex = stepNumbers.indexOf(currentStep);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl space-y-8 pb-8"
    >
      {/* ─── Header ────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Publier un bien</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Remplissez les informations pour mettre votre bien en ligne
        </p>
      </div>

      {/* ─── Step Indicator ────────────────────────────── */}
      <div className="space-y-3">
        {/* Progress bar */}
        <div className="h-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#C4956A] to-[#D4A574]"
            initial={false}
            animate={{ width: `${((currentDisplayIndex + 1) / stepLabels.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
        {/* Step labels */}
        <div className="flex justify-between">
          {stepLabels.map((label, i) => {
            const stepNum = stepNumbers[i];
            const isCurrent = stepNum === currentStep;
            const isCompleted = currentDisplayIndex > i;
            return (
              <button
                key={i}
                onClick={() => {
                  if (isCompleted) {
                    setCurrentStep(stepNum);
                    setErrors({});
                  }
                }}
                className={cn(
                  "flex items-center gap-2 text-xs font-medium transition-colors",
                  isCurrent
                    ? "text-[#C4956A]"
                    : isCompleted
                      ? "cursor-pointer text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                      : "cursor-default text-[var(--text-muted)]"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                    isCurrent
                      ? "bg-[#C4956A] text-black"
                      : isCompleted
                        ? "bg-[#C4956A]/20 text-[#C4956A]"
                        : "bg-white/5 text-[var(--text-muted)]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Step Content ──────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {currentStep === 1 && (
            <Step1
              data={formData}
              errors={errors}
              onChange={updateField}
            />
          )}
          {currentStep === 2 && (
            <Step2
              data={formData}
              errors={errors}
              onChange={updateField}
            />
          )}
          {currentStep === 3 && (
            <Step3
              data={formData}
              errors={errors}
              onChange={updateField}
              onPhotoUpload={handlePhotoUpload}
              onRemovePhoto={removePhoto}
              onMovePhoto={movePhoto}
              onFileDrop={handleFileDrop}
              onToggleEquipment={toggleEquipment}
              onDocumentUpload={handleDocumentUpload}
              onDocumentDrop={handleDocumentDrop}
              onRemoveDocument={removeDocument}
            />
          )}
          {currentStep === 4 && isVente && (
            <Step4Analytics
              data={formData}
              onUpdateAnalytics={updateAnalytics}
            />
          )}
          {currentStep === 5 && (
            <Step5
              data={formData}
              errors={errors}
              onChange={updateField}
              onAddOption={addCustomOption}
              onUpdateOption={updateCustomOption}
              onRemoveOption={removeCustomOption}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Navigation Buttons ────────────────────────── */}
      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-6">
        {currentStep > 1 ? (
          <button
            onClick={goPrev}
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-2 rounded-xl bg-[#C4956A] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574]"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <motion.button
            onClick={handlePublish}
            disabled={isPublishing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-8 py-3 text-sm font-bold text-black shadow-lg shadow-[#C4956A]/20",
              isPublishing && "opacity-70"
            )}
          >
            {isPublishing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                Publication...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Publier
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Field Components ───────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
      {children}
      {required && <span className="ml-1 text-[#C4956A]">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50",
          error ? "border-red-400/50" : "border-[var(--card-border)]"
        )}
      />
      <FieldError message={error} />
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
}

function VideoDuration({ file }: { file: File }) {
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const mins = Math.floor(video.duration / 60);
      const secs = Math.floor(video.duration % 60);
      setDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
      URL.revokeObjectURL(url);
    };
    video.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!duration) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-[#C4956A]">
      <Play className="h-3 w-3" />
      Durée : {duration}
    </p>
  );
}

// ─── Step 1: Type & Localisation ────────────────────────

function Step1({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: FieldErrors;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Transaction type */}
      <div>
        <FieldLabel required>Type de transaction</FieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {transactionTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange("transactionType", t.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                data.transactionType === t.value
                  ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                  : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--card-border)]"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    data.transactionType === t.value
                      ? "border-[#C4956A] bg-[#C4956A]"
                      : "border-white/20"
                  )}
                >
                  {data.transactionType === t.value && (
                    <Check className="h-3 w-3 text-black" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{t.label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{t.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <FieldError message={errors.transactionType} />
      </div>

      {/* Property type */}
      <div>
        <FieldLabel required>Type de bien</FieldLabel>
        <select
          value={data.propertyType}
          onChange={(e) => onChange("propertyType", e.target.value as PropertyType)}
          className={cn(
            "w-full rounded-xl border bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/50",
            errors.propertyType ? "border-red-400/50" : "border-[var(--card-border)]"
          )}
        >
          <option value="" className="bg-[var(--card)]">
            Sélectionnez un type
          </option>
          {propertyTypes.map((t) => (
            <option key={t.value} value={t.value} className="bg-[var(--card)]">
              {t.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.propertyType} />
      </div>

      {/* Address */}
      <div>
        <FieldLabel required>Adresse</FieldLabel>
        <TextInput
          value={data.address}
          onChange={(v) => onChange("address", v)}
          placeholder="Rue, numéro..."
          error={errors.address}
        />
      </div>

      {/* City & Country */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel required>Ville</FieldLabel>
          <TextInput
            value={data.city}
            onChange={(v) => onChange("city", v)}
            placeholder="Genève"
            error={errors.city}
          />
        </div>
        <div>
          <FieldLabel required>Pays</FieldLabel>
          <TextInput
            value={data.country}
            onChange={(v) => onChange("country", v)}
            placeholder="Suisse"
            error={errors.country}
          />
        </div>
      </div>

      {/* Price & Currency */}
      <div>
        <FieldLabel required>Prix</FieldLabel>
        <div className="flex gap-3">
          <div className="flex-1">
            <TextInput
              value={data.price}
              onChange={(v) => onChange("price", v)}
              placeholder={
                data.transactionType === "location-ct"
                  ? "Prix par nuit"
                  : data.transactionType === "location-lt"
                    ? "Prix par mois"
                    : "Prix de vente"
              }
              type="number"
              error={errors.price}
            />
          </div>
          <select
            value={data.currency}
            onChange={(e) => onChange("currency", e.target.value)}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/50"
          >
            {currencies.map((c) => (
              <option key={c} value={c} className="bg-[var(--card)]">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Caractéristiques ───────────────────────────

function Step2({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: FieldErrors;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Numbers row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Bedrooms */}
        <div>
          <FieldLabel>Chambres</FieldLabel>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onChange(
                  "bedrooms",
                  String(Math.max(0, Number(data.bedrooms) - 1))
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors hover:bg-white/5"
            >
              -
            </button>
            <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-sm font-medium text-[var(--foreground)]">
              {data.bedrooms}
            </span>
            <button
              onClick={() =>
                onChange("bedrooms", String(Number(data.bedrooms) + 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors hover:bg-white/5"
            >
              +
            </button>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <FieldLabel>Salles de bain</FieldLabel>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onChange(
                  "bathrooms",
                  String(Math.max(0, Number(data.bathrooms) - 1))
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors hover:bg-white/5"
            >
              -
            </button>
            <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-sm font-medium text-[var(--foreground)]">
              {data.bathrooms}
            </span>
            <button
              onClick={() =>
                onChange("bathrooms", String(Number(data.bathrooms) + 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors hover:bg-white/5"
            >
              +
            </button>
          </div>
        </div>

        {/* Surface */}
        <div>
          <FieldLabel required>Surface m²</FieldLabel>
          <TextInput
            value={data.area}
            onChange={(v) => onChange("area", v)}
            placeholder="120"
            type="number"
            error={errors.area}
          />
        </div>

        {/* Floor */}
        <div>
          <FieldLabel>Étage</FieldLabel>
          <TextInput
            value={data.floor}
            onChange={(v) => onChange("floor", v)}
            placeholder="3"
            type="number"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <FieldLabel required>Titre du bien</FieldLabel>
        <TextInput
          value={data.title}
          onChange={(v) => onChange("title", v)}
          placeholder="Ex: Appartement lumineux avec vue lac"
          error={errors.title}
        />
      </div>

      {/* Description */}
      <div>
        <FieldLabel required>Description</FieldLabel>
        <textarea
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Décrivez votre bien en détail : caractéristiques, ambiance, quartier, transports..."
          rows={8}
          className={cn(
            "w-full resize-none rounded-xl border bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50",
            errors.description ? "border-red-400/50" : "border-[var(--card-border)]"
          )}
        />
        <div className="mt-1 flex items-center justify-between">
          <FieldError message={errors.description} />
          <span className="text-xs text-[var(--text-muted)]">
            {data.description.length} caractères
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Médias & Équipements ───────────────────────

function Step3({
  data,
  errors,
  onChange,
  onPhotoUpload,
  onRemovePhoto,
  onMovePhoto,
  onFileDrop,
  onToggleEquipment,
  onDocumentUpload,
  onDocumentDrop,
  onRemoveDocument,
}: {
  data: FormData;
  errors: FieldErrors;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
  onMovePhoto: (index: number, direction: "up" | "down") => void;
  onFileDrop: (files: File[]) => void;
  onToggleEquipment: (id: string) => void;
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentDrop: (files: File[]) => void;
  onRemoveDocument: (index: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDocDragging, setIsDocDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) return;
    onFileDrop(files);
  };

  const handleDocDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDocDragging(true);
  };

  const handleDocDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDocDragging(false);
  };

  const handleDocDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDocDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onDocumentDrop(files);
  };

  return (
    <div className="space-y-6">
      {/* Photo upload */}
      <div>
        <FieldLabel>Photos</FieldLabel>

        {/* Upload zone with drag & drop */}
        <label
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all",
            isDragging
              ? "border-[#C4956A] bg-[#C4956A]/10"
              : "border-white/[0.1] bg-[var(--card)] hover:border-[#C4956A]/30 hover:bg-[#C4956A]/5"
          )}
        >
          <Upload className={cn("h-8 w-8 transition-colors", isDragging ? "text-[#C4956A]" : "text-[var(--text-muted)]")} />
          <div className="text-center">
            <p className={cn("text-sm font-medium transition-colors", isDragging ? "text-[#C4956A]" : "text-[var(--text-secondary)]")}>
              {isDragging ? "Déposez vos photos ici" : "Glissez vos photos ici ou cliquez"}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              JPG, PNG, WebP - Max 10 Mo par photo
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPhotoUpload}
            className="hidden"
          />
        </label>

        {/* Photo thumbnails with reorder */}
        {data.photoPreviewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {data.photoPreviewUrls.map((url, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--card-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                {/* Overlay with controls */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {i > 0 && (
                    <button
                      onClick={() => onMovePhoto(i, "up")}
                      className="rounded-full bg-black/60 p-1 text-[var(--foreground)] transition-colors hover:bg-black/80"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {i < data.photoPreviewUrls.length - 1 && (
                    <button
                      onClick={() => onMovePhoto(i, "down")}
                      className="rounded-full bg-black/60 p-1 text-[var(--foreground)] transition-colors hover:bg-black/80"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => onRemovePhoto(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[var(--foreground)] shadow-lg transition-all hover:bg-red-600 opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-[#C4956A] px-1.5 py-0.5 text-[9px] font-bold text-black">
                    Principale
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video upload */}
      <div>
        <FieldLabel>Vidéo</FieldLabel>
        {data.video ? (
          <div className="group relative rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <div className="flex items-start gap-4">
              <div className="relative h-28 w-44 flex-shrink-0 overflow-hidden rounded-lg bg-black">
                <video
                  src={URL.createObjectURL(data.video)}
                  controls
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">{data.video.name}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {(data.video.size / (1024 * 1024)).toFixed(1)} Mo
                </p>
                <VideoDuration file={data.video} />
              </div>
              <button
                onClick={() => onChange("video", null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-[var(--foreground)] shadow-lg transition-all hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/[0.1] bg-[var(--card)] p-6 transition-colors hover:border-[#C4956A]/30">
            <Video className="h-6 w-6 text-[var(--text-muted)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Ajouter une vidéo de visite
              </p>
              <p className="text-xs text-[var(--text-muted)]">MP4, MOV - Max 100 Mo</p>
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onChange("video", file);
              }}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Equipment checkboxes */}
      <div>
        <FieldLabel>Équipements</FieldLabel>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {equipmentOptions.map((item) => {
            const Icon = item.icon;
            const selected = data.equipment.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggleEquipment(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  selected
                    ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                    : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--card-border)]"
                )}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors",
                    selected
                      ? "border-[#C4956A] bg-[#C4956A]"
                      : "border-white/20"
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-black" />}
                </div>
                <Icon
                  className={cn(
                    "h-4 w-4",
                    selected ? "text-[#C4956A]" : "text-[var(--text-muted)]"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    selected ? "font-medium text-[var(--foreground)]" : "text-[var(--text-secondary)]"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document upload */}
      <div>
        <FieldLabel>Documents (optionnel)</FieldLabel>

        <label
          onDragEnter={handleDocDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDocDragLeave}
          onDrop={handleDocDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all",
            isDocDragging
              ? "border-[#C4956A] bg-[#C4956A]/10"
              : "border-white/[0.1] bg-[var(--card)] hover:border-[#C4956A]/30 hover:bg-[#C4956A]/5"
          )}
        >
          <FileText className={cn("h-7 w-7 transition-colors", isDocDragging ? "text-[#C4956A]" : "text-[var(--text-muted)]")} />
          <div className="text-center">
            <p className={cn("text-sm font-medium transition-colors", isDocDragging ? "text-[#C4956A]" : "text-[var(--text-secondary)]")}>
              {isDocDragging ? "Déposez vos documents ici" : "Glissez vos documents ici (PDF, plans, diagnostics)"}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              PDF, DOC, DOCX
            </p>
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={onDocumentUpload}
            className="hidden"
          />
        </label>

        {/* Document list */}
        {data.documents.length > 0 && (
          <div className="mt-3 space-y-2">
            {data.documents.map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3"
              >
                <FileText className="h-5 w-5 flex-shrink-0 text-[#C4956A]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">
                    {doc.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {formatFileSize(doc.size)}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveDocument(i)}
                  className="flex-shrink-0 rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Données Analytiques ────────────────────────

function Step4Analytics({
  data,
  onUpdateAnalytics,
}: {
  data: FormData;
  onUpdateAnalytics: (key: keyof AnalyticsData, value: string | string[]) => void;
}) {
  const a = data.analytics;
  const isVenteOrLT = data.transactionType === "vente" || data.transactionType === "location-lt";
  const isCT = data.transactionType === "location-ct";

  // Auto-calculated prix au m²
  const prixAuM2 =
    data.price && data.area && Number(data.area) > 0
      ? (Number(data.price) / Number(data.area)).toFixed(0)
      : null;

  const toggleSaison = (id: string) => {
    const current = a.saisonHaute || [];
    if (current.includes(id)) {
      onUpdateAnalytics("saisonHaute", current.filter((s) => s !== id));
    } else {
      onUpdateAnalytics("saisonHaute", [...current, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4956A]/10">
          <BarChart3 className="h-5 w-5 text-[#C4956A]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">Données Analytiques & Investissement</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Ces données aideront les investisseurs à évaluer votre bien
          </p>
        </div>
      </div>

      {/* ── Vente / Location LT fields ── */}
      {isVenteOrLT && (
        <div className="space-y-5">
          {/* Rendement */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#C4956A]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Rendement</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Rendement brut estimé (%)</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={a.rendementBrut}
                    onChange={(e) => onUpdateAnalytics("rendementBrut", e.target.value)}
                    placeholder="5.2"
                    step="0.1"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">%</span>
                </div>
              </div>
              <div>
                <FieldLabel>Rendement net estimé (%)</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={a.rendementNet}
                    onChange={(e) => onUpdateAnalytics("rendementNet", e.target.value)}
                    placeholder="3.8"
                    step="0.1"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">%</span>
                </div>
              </div>
            </div>

            {/* Prix au m² — auto */}
            {prixAuM2 && (
              <div className="flex items-center gap-3 rounded-lg bg-[#C4956A]/5 px-4 py-3">
                <Calculator className="h-4 w-4 text-[#C4956A]" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Prix au m² (auto-calculé)</p>
                  <p className="text-sm font-semibold text-[#C4956A]">
                    {Number(prixAuM2).toLocaleString("fr-CH")} {data.currency}/m²
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Charges & Fiscalité */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Charges & Fiscalité</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Charges annuelles ({data.currency})</FieldLabel>
                <input
                  type="number"
                  value={a.chargesAnnuelles}
                  onChange={(e) => onUpdateAnalytics("chargesAnnuelles", e.target.value)}
                  placeholder="3600"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
              <div>
                <FieldLabel>Taxe foncière ({data.currency})</FieldLabel>
                <input
                  type="number"
                  value={a.taxeFonciere}
                  onChange={(e) => onUpdateAnalytics("taxeFonciere", e.target.value)}
                  placeholder="1200"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
            </div>
            {data.transactionType === "vente" && (
              <div>
                <FieldLabel>Revenus locatifs annuels estimés ({data.currency})</FieldLabel>
                <input
                  type="number"
                  value={a.revenusLocatifs}
                  onChange={(e) => onUpdateAnalytics("revenusLocatifs", e.target.value)}
                  placeholder="24000"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
            )}
            <div>
              <FieldLabel>Potentiel de plus-value</FieldLabel>
              <select
                value={a.potentielPlusValue}
                onChange={(e) => onUpdateAnalytics("potentielPlusValue", e.target.value)}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/50"
              >
                <option value="" className="bg-[var(--card)]">Sélectionnez</option>
                {potentielOptions.map((p) => (
                  <option key={p} value={p} className="bg-[var(--card)]">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* État du bien */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">État du bien</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Année de construction</FieldLabel>
                <input
                  type="number"
                  value={a.anneeConstruction}
                  onChange={(e) => onUpdateAnalytics("anneeConstruction", e.target.value)}
                  placeholder="1995"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
              <div>
                <FieldLabel>Dernier DPE</FieldLabel>
                <select
                  value={a.dpe}
                  onChange={(e) => onUpdateAnalytics("dpe", e.target.value)}
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/50"
                >
                  <option value="" className="bg-[var(--card)]">Sélectionnez</option>
                  {dpeOptions.map((d) => (
                    <option key={d} value={d} className="bg-[var(--card)]">{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <FieldLabel>État général</FieldLabel>
              <select
                value={a.etatGeneral}
                onChange={(e) => onUpdateAnalytics("etatGeneral", e.target.value)}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[#C4956A]/50"
              >
                <option value="" className="bg-[var(--card)]">Sélectionnez</option>
                {etatOptions.map((e) => (
                  <option key={e} value={e} className="bg-[var(--card)]">{e}</option>
                ))}
              </select>
            </div>
            {(a.etatGeneral === "À rénover" || a.etatGeneral === "À rénover entièrement") && (
              <div>
                <FieldLabel>Travaux estimés ({data.currency})</FieldLabel>
                <input
                  type="number"
                  value={a.travauxEstimes}
                  onChange={(e) => onUpdateAnalytics("travauxEstimes", e.target.value)}
                  placeholder="50000"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Location CT fields ── */}
      {isCT && (
        <div className="space-y-5">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Performance locative</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Taux d&apos;occupation estimé (%)</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={a.tauxOccupation}
                    onChange={(e) => onUpdateAnalytics("tauxOccupation", e.target.value)}
                    placeholder="75"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">%</span>
                </div>
              </div>
              <div>
                <FieldLabel>Revenus annuels estimés ({data.currency})</FieldLabel>
                <input
                  type="number"
                  value={a.revenusAnnuels}
                  onChange={(e) => onUpdateAnalytics("revenusAnnuels", e.target.value)}
                  placeholder="36000"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Charges annuelles ({data.currency})</FieldLabel>
              <input
                type="number"
                value={a.chargesAnnuelles}
                onChange={(e) => onUpdateAnalytics("chargesAnnuelles", e.target.value)}
                placeholder="4800"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
              />
            </div>
          </div>

          {/* Saisons & Prix */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Saisons & Tarification</h3>
            <div>
              <FieldLabel>Saison haute</FieldLabel>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {saisonOptions.map((s) => {
                  const Icon = s.icon;
                  const selected = (a.saisonHaute || []).includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSaison(s.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all",
                        selected
                          ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                          : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--card-border)]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors",
                          selected ? "border-[#C4956A] bg-[#C4956A]" : "border-white/20"
                        )}
                      >
                        {selected && <Check className="h-2.5 w-2.5 text-black" />}
                      </div>
                      <Icon className={cn("h-3.5 w-3.5", selected ? "text-[#C4956A]" : "text-[var(--text-muted)]")} />
                      <span className={cn("text-xs", selected ? "font-medium text-[var(--foreground)]" : "text-[var(--text-secondary)]")}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Prix haute saison ({data.currency}/nuit)</FieldLabel>
                <input
                  type="number"
                  value={a.prixHauteSaison}
                  onChange={(e) => onUpdateAnalytics("prixHauteSaison", e.target.value)}
                  placeholder="250"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
              <div>
                <FieldLabel>Prix basse saison ({data.currency}/nuit)</FieldLabel>
                <input
                  type="number"
                  value={a.prixBasseSaison}
                  onChange={(e) => onUpdateAnalytics("prixBasseSaison", e.target.value)}
                  placeholder="120"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Investment projection (all types) ── */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#C4956A]" />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Projection d&apos;investissement</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>ROI estimé à 5 ans (%)</FieldLabel>
            <div className="relative">
              <input
                type="number"
                value={a.roi5ans}
                onChange={(e) => onUpdateAnalytics("roi5ans", e.target.value)}
                placeholder="25"
                step="0.1"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">%</span>
            </div>
          </div>
          <div>
            <FieldLabel>ROI estimé à 10 ans (%)</FieldLabel>
            <div className="relative">
              <input
                type="number"
                value={a.roi10ans}
                onChange={(e) => onUpdateAnalytics("roi10ans", e.target.value)}
                placeholder="55"
                step="0.1"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">%</span>
            </div>
          </div>
        </div>
        <div>
          <FieldLabel>Notes investisseur</FieldLabel>
          <textarea
            value={a.notesInvestisseur}
            onChange={(e) => onUpdateAnalytics("notesInvestisseur", e.target.value)}
            placeholder="Informations supplémentaires pour les investisseurs"
            rows={4}
            className="w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/50"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Options & Validation ───────────────────────

function Step5({
  data,
  errors,
  onChange,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: {
  data: FormData;
  errors: FieldErrors;
  onChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onAddOption: () => void;
  onUpdateOption: (id: string, field: keyof CustomOption, value: string | boolean) => void;
  onRemoveOption: (id: string) => void;
}) {
  const { formatPrice } = useApp();
  const transLabel =
    data.transactionType === "vente"
      ? "Vente"
      : data.transactionType === "location-lt"
        ? "Location longue durée"
        : "Location courte durée";

  const a = data.analytics;

  return (
    <div className="space-y-6">
      {/* Custom paid options (for location-ct) */}
      {data.transactionType === "location-ct" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Options payantes
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Ajoutez des services additionnels pour vos locataires
              </p>
            </div>
            <button
              onClick={onAddOption}
              className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-[var(--foreground)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </button>
          </div>

          {data.customOptions.length === 0 && (
            <div className="rounded-xl border border-dashed border-[var(--card-border)] bg-[var(--card)] p-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">
                Aucune option ajoutée. Cliquez sur &quot;Ajouter&quot; pour créer une option payante.
              </p>
            </div>
          )}

          <AnimatePresence>
            {data.customOptions.map((opt) => (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) =>
                        onUpdateOption(opt.id, "name", e.target.value)
                      }
                      placeholder="Nom de l'option (ex: Petit-déjeuner)"
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A]/50"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={opt.price}
                        onChange={(e) =>
                          onUpdateOption(opt.id, "price", e.target.value)
                        }
                        placeholder="Prix"
                        className="w-32 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A]/50"
                      />
                      <span className="text-xs text-[var(--text-secondary)]">
                        {data.currency}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateOption(opt.id, "perDay", !opt.perDay)
                        }
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          opt.perDay
                            ? "bg-[#C4956A]/10 text-[#C4956A]"
                            : "bg-white/5 text-[var(--text-secondary)]"
                        )}
                      >
                        {opt.perDay ? "Par jour" : "Forfait"}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveOption(opt.id)}
                    className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Preview card */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
          Aperçu de votre annonce
        </h3>
        <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
          {/* Preview image area */}
          <div className="relative aspect-[16/10] bg-white/5">
            {data.photoPreviewUrls.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.photoPreviewUrls[0]}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
                <Camera className="h-12 w-12" />
              </div>
            )}
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] backdrop-blur-sm">
                {transLabel}
              </span>
              {data.propertyType && (
                <span className="rounded-full bg-[#C4956A]/80 px-2.5 py-1 text-[11px] font-semibold text-black backdrop-blur-sm">
                  {propertyTypes.find((t) => t.value === data.propertyType)?.label}
                </span>
              )}
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {data.photoPreviewUrls.length > 1 && (
                <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] text-[var(--foreground)] backdrop-blur-sm">
                  <Camera className="h-3 w-3" />
                  {data.photoPreviewUrls.length}
                </div>
              )}
              {data.video && (
                <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] text-[var(--foreground)] backdrop-blur-sm">
                  <Video className="h-3 w-3" />
                  1
                </div>
              )}
              {data.documents.length > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] text-[var(--foreground)] backdrop-blur-sm">
                  <FileText className="h-3 w-3" />
                  {data.documents.length}
                </div>
              )}
            </div>
          </div>

          {/* Preview info */}
          <div className="p-5">
            {data.price && (
              <p className="text-xl font-bold text-[#C4956A]">
                {formatPrice(Number(data.price), data.currency as "CHF" | "EUR")}
                {data.transactionType !== "vente" && (
                  <span className="text-sm font-normal text-[var(--text-secondary)]">
                    {data.transactionType === "location-ct"
                      ? "/nuit"
                      : "/mois"}
                  </span>
                )}
              </p>
            )}
            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {data.title || "Titre du bien"}
            </p>
            {(data.city || data.address) && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <MapPin className="h-3 w-3" />
                {[data.address, data.city, data.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              {Number(data.bedrooms) > 0 && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" /> {data.bedrooms} ch.
                </span>
              )}
              {Number(data.bathrooms) > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" /> {data.bathrooms} sdb
                </span>
              )}
              {data.area && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5" /> {data.area}m²
                </span>
              )}
            </div>

            {/* Analytics preview badges */}
            {(a.rendementBrut || a.dpe || a.etatGeneral) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {a.rendementBrut && (
                  <span className="flex items-center gap-1 rounded-full bg-[#C4956A]/10 px-2.5 py-1 text-[11px] font-medium text-[#C4956A]">
                    <TrendingUp className="h-3 w-3" />
                    Rendement: {a.rendementBrut}%
                  </span>
                )}
                {a.dpe && (
                  <span className="rounded-full bg-[#C4956A]/10 px-2.5 py-1 text-[11px] font-medium text-[#C4956A]">
                    DPE: {a.dpe}
                  </span>
                )}
                {a.etatGeneral && (
                  <span className="rounded-full bg-[#C4956A]/10 px-2.5 py-1 text-[11px] font-medium text-[#C4956A]">
                    État: {a.etatGeneral}
                  </span>
                )}
              </div>
            )}

            {data.equipment.size > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Array.from(data.equipment).slice(0, 5).map((id) => {
                  const eq = equipmentOptions.find((e) => e.id === id);
                  return eq ? (
                    <span
                      key={id}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[var(--text-secondary)]"
                    >
                      {eq.label}
                    </span>
                  ) : null;
                })}
                {data.equipment.size > 5 && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">
                    +{data.equipment.size - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terms */}
      <div>
        <button
          onClick={() => onChange("termsAccepted", !data.termsAccepted)}
          className="flex items-start gap-3 text-left"
        >
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors",
              data.termsAccepted
                ? "border-[#C4956A] bg-[#C4956A]"
                : errors.terms
                  ? "border-red-400/50"
                  : "border-white/20"
            )}
          >
            {data.termsAccepted && (
              <Check className="h-3.5 w-3.5 text-black" />
            )}
          </div>
          <span className="text-sm text-[var(--text-secondary)]">
            J&apos;accepte les{" "}
            <span className="text-[#C4956A] underline-offset-2 hover:underline">
              conditions générales d&apos;utilisation
            </span>{" "}
            et je certifie que les informations fournies sont exactes.
          </span>
        </button>
        <FieldError message={errors.terms} />
      </div>
    </div>
  );
}
