"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Check, Loader2, Camera, User, MapPin, Globe,
  Home, Building2, TrendingUp, Handshake, Briefcase, GraduationCap,
  UserCheck, Scale, PenTool, Shield, Search, BookOpen, Plus,
  Sparkles, MessageCircle, ShoppingBag, Zap, Star
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const WELCOME_FEATURES = [
  {
    icon: ShoppingBag,
    title: "Marketplace immobilière",
    desc: "Achetez, vendez ou louez des biens dans le monde entier.",
  },
  {
    icon: MessageCircle,
    title: "Réseau social intégré",
    desc: "Publiez, echangez et developpez votre réseau professionnel.",
  },
  {
    icon: Handshake,
    title: "Apporteurs d'affaires",
    desc: "Gagnez des commissions en recommandant des biens et services.",
  },
  {
    icon: GraduationCap,
    title: "Formations certifiantes",
    desc: "Apprenez et obtenez des certifications reconnues.",
  },
];

const ROLES = [
  { id: "client", label: "Client", icon: User, desc: "Rechercher et louer un bien" },
  { id: "hote", label: "Hote", icon: Home, desc: "Mettre en location ses biens" },
  { id: "agence", label: "Agence", icon: Building2, desc: "Gerer un portefeuille" },
  { id: "promoteur", label: "Promoteur", icon: TrendingUp, desc: "Developper des projets" },
  { id: "apporteur", label: "Apporteur", icon: Handshake, desc: "Referer et gagner" },
  { id: "investisseur", label: "Investisseur", icon: Briefcase, desc: "Investir dans l'immobilier" },
  { id: "formateur", label: "Formateur", icon: GraduationCap, desc: "Créer des formations" },
  { id: "photographe", label: "Photographe", icon: Camera, desc: "Services photo" },
  { id: "courtier", label: "Courtier", icon: Scale, desc: "Accompagner les transactions" },
  { id: "architecte", label: "Architecte", icon: PenTool, desc: "Concevoir des espaces" },
  { id: "notaire", label: "Notaire", icon: Shield, desc: "Securiser les actes" },
];

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Profile state
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Roles state
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["client"]);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const profileCompletion = () => {
    let filled = 2; // name + email already filled
    if (bio) filled++;
    if (city) filled++;
    if (country) filled++;
    return Math.round((filled / 5) * 100);
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (selectedRoles.includes("client") || selectedRoles.includes("investisseur")) {
      suggestions.push({ icon: Search, label: "Explorer les biens", href: "/explorer" });
    }
    if (selectedRoles.includes("hote") || selectedRoles.includes("agence") || selectedRoles.includes("promoteur")) {
      suggestions.push({ icon: Plus, label: "Publier un bien", href: "/publier" });
    }
    if (selectedRoles.includes("formateur")) {
      suggestions.push({ icon: BookOpen, label: "Créer une formation", href: "/formations/creer" });
    }
    if (selectedRoles.includes("apporteur")) {
      suggestions.push({ icon: Handshake, label: "Espace apporteurs", href: "/apporteurs" });
    }
    // Always suggest these
    suggestions.push({ icon: MessageCircle, label: "Voir le feed", href: "/feed" });
    if (suggestions.length < 4) {
      suggestions.push({ icon: GraduationCap, label: "Trouver une formation", href: "/formations" });
    }
    return suggestions.slice(0, 4);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1] focus:ring-1 focus:ring-[#1e9df1]/30 transition-colors";

  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-2xl">
        {/* Header with progress */}
        <div className="sticky top-0 z-10 bg-[var(--card)] border-b border-[var(--divider)] p-6 pb-4 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1e9df1] flex items-center justify-center">
                <span className="text-white text-lg font-bold">E</span>
              </div>
              <span className="font-bold text-lg">E-Dome</span>
            </div>
            <span className="text-sm text-[var(--text-muted)]">
              Etape {step} sur {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < step ? "bg-[#1e9df1]" : "bg-[var(--input-bg)]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* ─── Step 1: Bienvenue ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#1e9df1]/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#1e9df1]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Bienvenue sur E-Dome, Leo !
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Découvrez tout ce que la plateforme peut vous offrir.
                </p>
              </div>

              <div className="space-y-4">
                {WELCOME_FEATURES.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1e9df1]/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-[#1e9df1]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 2: Completer le profil ──────────────────────────── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Completez votre profil</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Plus votre profil est complet, plus vous inspirez confiance.
              </p>

              {/* Progress indicator */}
              <div className="mb-8 p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profil complété à {profileCompletion()}%</span>
                  <span className="text-sm text-[#1e9df1] font-semibold">{profileCompletion()}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--input-bg)]">
                  <div
                    className="h-full rounded-full bg-[#1e9df1] transition-all duration-500"
                    style={{ width: `${profileCompletion()}%` }}
                  />
                </div>
              </div>

              {/* Photo upload */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[var(--input-bg)] border-2 border-dashed border-[var(--input-border)] flex items-center justify-center cursor-pointer hover:border-[#1e9df1] transition-colors group">
                  <Camera className="w-8 h-8 text-[var(--text-muted)] group-hover:text-[#1e9df1] transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-sm">Photo de profil</p>
                  <p className="text-xs text-[var(--text-muted)]">JPG, PNG. Max 5 Mo.</p>
                  <button className="text-xs text-[#1e9df1] hover:underline mt-1">
                    Telecharger une photo
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Présentez-vous en quelques mots..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Ville</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Lausanne"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Pays</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Suisse"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 3: Activer vos roles ────────────────────────────── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Activez vos roles</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Sélectionnez les roles qui correspondent a votre activité. Vous pourrez les modifier a tout moment.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROLES.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleRole(id)}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      selectedRoles.includes(id)
                        ? "border-[#1e9df1] bg-[#1e9df1]/10"
                        : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    {/* Toggle indicator */}
                    <div
                      className={`absolute top-3 right-3 w-8 h-5 rounded-full transition-colors flex items-center ${
                        selectedRoles.includes(id) ? "bg-[#1e9df1]" : "bg-[var(--input-bg)]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                          selectedRoles.includes(id) ? "translate-x-3.5" : "translate-x-1"
                        }`}
                      />
                    </div>

                    <Icon
                      className={`w-6 h-6 mb-2 ${
                        selectedRoles.includes(id) ? "text-[#1e9df1]" : "text-[var(--text-muted)]"
                      }`}
                    />
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>

              {selectedRoles.length > 0 && (
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  <span className="text-[#1e9df1] font-semibold">{selectedRoles.length}</span>{" "}
                  role{selectedRoles.length > 1 ? "s" : ""} selectionne{selectedRoles.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {/* ─── Step 4: Commencer ────────────────────────────────────── */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#1e9df1]/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#1e9df1]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Tout est pret !
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Voici des suggestions personnalisées pour commencer votre expérience E-Dome.
                </p>
              </div>

              <div className="space-y-3">
                {getSuggestions().map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(suggestion.href)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[#1e9df1]/50 hover:bg-[#1e9df1]/5 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1e9df1]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1e9df1]/20 transition-colors">
                      <suggestion.icon className="w-5 h-5 text-[#1e9df1]" />
                    </div>
                    <span className="font-medium text-sm flex-1">{suggestion.label}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[#1e9df1] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer navigation ──────────────────────────────────────── */}
        <div className="sticky bottom-0 bg-[var(--card)] border-t border-[var(--divider)] p-6 rounded-b-2xl">
          <div className="flex gap-3">
            {step < totalSteps && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 rounded-xl border border-[var(--card-border)] bg-transparent hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] font-medium transition-colors text-sm"
              >
                Passer
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 rounded-xl bg-[#1e9df1] hover:bg-[#1583c9] text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/feed")}
                className="flex-1 py-3 rounded-xl bg-[#1e9df1] hover:bg-[#1583c9] text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Commencer
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
