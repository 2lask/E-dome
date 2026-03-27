"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Home,
  Building2,
  Briefcase,
  TrendingUp,
  Star,
  GraduationCap,
  Check,
  Link2,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { roleLabels } from "@/lib/types";
import type { Role } from "@/lib/types";

// ─── Types ──────────────────────────────────────────────

type IconComponent = React.ComponentType<{ className?: string }>;

interface RoleOption {
  role: Role;
  icon: IconComponent;
  description: string;
}

// ─── Config ─────────────────────────────────────────────

const steps = [
  { id: 1, label: "Identité" },
  { id: 2, label: "Coordonnées" },
  { id: 3, label: "Role" },
];

const roleOptions: RoleOption[] = [
  { role: "client", icon: User, description: "Je cherche un bien à acheter ou louer" },
  { role: "hote", icon: Home, description: "Je propose mes biens en location courte durée" },
  { role: "proprietaire", icon: Building2, description: "Je gère mes propriétés et locataires" },
  { role: "agence", icon: Briefcase, description: "Je gère un portefeuille d'agence" },
  { role: "promoteur", icon: TrendingUp, description: "Je vends des programmes neufs" },
  { role: "apporteur", icon: Link2, description: "Je recommande des biens pour des commissions" },
  { role: "investisseur", icon: Star, description: "J'investis dans l'immobilier" },
  { role: "formateur", icon: GraduationCap, description: "Je crée des formations immobilières" },
];

// ─── Component ──────────────────────────────────────────

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    city: "",
    selectedRole: "" as Role | "autre" | "",
    autreRoleDescription: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (stepErrors[field]) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = "Requis";
    if (!form.lastName.trim()) errors.lastName = "Requis";
    if (!form.email.trim()) errors.email = "Requis";
    if (!form.password.trim()) errors.password = "Requis";
    else if (form.password.length < 8) errors.password = "Min. 8 caractères";
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.phone.trim()) errors.phone = "Requis";
    if (!form.country.trim()) errors.country = "Requis";
    if (!form.city.trim()) errors.city = "Requis";
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) {
      setStepErrors({});
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStepErrors({});
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && form.selectedRole && acceptTerms) {
      setLoading(true);
      setTimeout(() => {
        router.push("/feed");
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* ─── Left decorative panel ─── */}
      <div className="hidden flex-1 items-center justify-center auth-gradient-bg lg:flex">
        <div className="max-w-md px-12 text-center">
          <h1 className="text-5xl font-bold">
            <span className="text-white">E-</span>
            <span className="bg-gradient-to-r from-[#C4956A] to-[#D4A574] bg-clip-text text-transparent">
              Dome
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-sm font-medium tracking-wide text-[#C4956A]/70">
            Marketplace &middot; Réseau Social &middot; Apporteurs &middot; Formations &middot; Services
          </p>

          <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
            Rejoignez la communauté immobilière la plus innovante. Créez votre profil en quelques minutes.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 space-y-4 text-left">
            <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/15">
                <svg className="h-4 w-4 text-[#C4956A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm text-white/80">Commissions réduites de 40-60%</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/15">
                <svg className="h-4 w-4 text-[#C4956A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <span className="text-sm text-white/80">Visibilité organique gratuite</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/15">
                <svg className="h-4 w-4 text-[#C4956A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <span className="text-sm text-white/80">Écosystème tout-en-un</span>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-[#C4956A]"
                style={{ opacity: 1 - i * 0.25 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right form panel ─── */}
      <div className="flex flex-1 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-3xl font-bold">
              <span className="text-white">E-</span>
              <span className="bg-gradient-to-r from-[#C4956A] to-[#D4A574] bg-clip-text text-transparent">
                Dome
              </span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-[var(--foreground)]">Créer un compte</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Étape {step} sur 3 -- {steps[step - 1].label}
          </p>

          {/* Step progress */}
          <div className="mt-6 flex gap-2">
            {steps.map((s) => (
              <div key={s.id} className="flex-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-colors",
                    s.id <= step ? "bg-[#C4956A]" : "bg-[var(--card)]"
                  )}
                />
                <p className="mt-1 text-[10px] text-[var(--text-secondary)]">{s.label}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Identité ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => updateForm("firstName", e.target.value)}
                          placeholder="Prénom"
                          className={cn(
                            "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                            stepErrors.firstName ? "border-red-500/50" : "border-[var(--card-border)]"
                          )}
                        />
                      </div>
                      {stepErrors.firstName && (
                        <p className="mt-1 text-xs text-red-400">{stepErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Nom</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => updateForm("lastName", e.target.value)}
                        placeholder="Nom"
                        className={cn(
                          "w-full rounded-lg border bg-[var(--card)] py-3 px-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                          stepErrors.lastName ? "border-red-500/50" : "border-[var(--card-border)]"
                        )}
                      />
                      {stepErrors.lastName && (
                        <p className="mt-1 text-xs text-red-400">{stepErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Adresse email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="nom@email.com"
                        className={cn(
                          "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                          stepErrors.email ? "border-red-500/50" : "border-[var(--card-border)]"
                        )}
                      />
                    </div>
                    {stepErrors.email && (
                      <p className="mt-1 text-xs text-red-400">{stepErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => updateForm("password", e.target.value)}
                        placeholder="Min. 8 caractères"
                        className={cn(
                          "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-10 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                          stepErrors.password ? "border-red-500/50" : "border-[var(--card-border)]"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {stepErrors.password && (
                      <p className="mt-1 text-xs text-red-400">{stepErrors.password}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Coordonnées ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="+41 79 000 00 00"
                        className={cn(
                          "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                          stepErrors.phone ? "border-red-500/50" : "border-[var(--card-border)]"
                        )}
                      />
                    </div>
                    {stepErrors.phone && (
                      <p className="mt-1 text-xs text-red-400">{stepErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Pays</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => updateForm("country", e.target.value)}
                        placeholder="Suisse"
                        className={cn(
                          "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                          stepErrors.country ? "border-red-500/50" : "border-[var(--card-border)]"
                        )}
                      />
                    </div>
                    {stepErrors.country && (
                      <p className="mt-1 text-xs text-red-400">{stepErrors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Ville</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                        placeholder="Genève"
                        className={cn(
                          "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                          stepErrors.city ? "border-red-500/50" : "border-[var(--card-border)]"
                        )}
                      />
                    </div>
                    {stepErrors.city && (
                      <p className="mt-1 text-xs text-red-400">{stepErrors.city}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Role ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <p className="text-sm text-[var(--text-secondary)]">
                    Sélectionnez votre rôle principal. Vous pourrez en ajouter d&apos;autres plus tard.
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {roleOptions.map(({ role, icon: Icon, description }) => {
                      const isSelected = form.selectedRole === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => updateForm("selectedRole", role)}
                          className={cn(
                            "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition",
                            isSelected
                              ? "border-[#C4956A]/50 bg-[#C4956A]/10"
                              : "border-[var(--card-border)] bg-[var(--card)] hover:border-white/[0.1]"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C4956A]">
                              <Check className="h-3 w-3 text-black" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg",
                              isSelected ? "bg-[#C4956A]/20 text-[#C4956A]" : "bg-white/[0.05] text-[var(--text-secondary)]"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{roleLabels[role]}</p>
                            <p className="mt-0.5 text-[11px] leading-snug text-[var(--text-secondary)]">{description}</p>
                          </div>
                        </button>
                      );
                    })}

                    {/* Autre role option */}
                    <button
                      type="button"
                      onClick={() => updateForm("selectedRole", "autre")}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition",
                        form.selectedRole === "autre"
                          ? "border-[#C4956A]/50 bg-[#C4956A]/10"
                          : "border-[var(--card-border)] bg-[var(--card)] hover:border-white/[0.1]"
                      )}
                    >
                      {form.selectedRole === "autre" && (
                        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C4956A]">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          form.selectedRole === "autre" ? "bg-[#C4956A]/20 text-[#C4956A]" : "bg-white/[0.05] text-[var(--text-secondary)]"
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </div>
                      <div className="w-full">
                        <p className="text-sm font-medium text-[var(--foreground)]">Autre</p>
                        <p className="mt-0.5 text-[11px] leading-snug text-[var(--text-secondary)]">Mon rôle n&apos;est pas dans la liste</p>
                        {form.selectedRole === "autre" && (
                          <input
                            type="text"
                            value={form.autreRoleDescription}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateForm("autreRoleDescription", e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Décrivez votre rôle..."
                            className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
                          />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Terms */}
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/[0.1] bg-[var(--card)] accent-[#C4956A]"
                    />
                    <span className="text-xs leading-relaxed text-[var(--text-secondary)]">
                      J&apos;accepte les{" "}
                      <span className="text-[#C4956A]">conditions d&apos;utilisation</span> et la{" "}
                      <span className="text-[#C4956A]">politique de confidentialité</span>
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/[0.03]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#C4956A] py-3 text-sm font-semibold text-black transition hover:bg-[#D4A574]"
                >
                  Continuer
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!form.selectedRole || !acceptTerms || loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#C4956A] py-3 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Link to login */}
          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Déjà un compte ?{" "}
            <Link href="/auth/connexion" className="font-medium text-[#C4956A] hover:underline">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
