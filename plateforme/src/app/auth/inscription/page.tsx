"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Globe, MapPin,
  ArrowRight, ArrowLeft, Check, Loader2, Building2, Camera,
  GraduationCap, Briefcase, Home, TrendingUp, Scale, Pencil,
  Handshake, UserCheck
} from "lucide-react";

const ROLES = [
  { id: "client", label: "Client", icon: User, desc: "Chercher un bien" },
  { id: "hote", label: "Hôte", icon: Home, desc: "Mettre en location" },
  { id: "agence", label: "Agence", icon: Building2, desc: "Agence immobilière" },
  { id: "promoteur", label: "Promoteur", icon: TrendingUp, desc: "Projets immobiliers" },
  { id: "apporteur", label: "Apporteur d'affaires", icon: Handshake, desc: "Référer des clients" },
  { id: "investisseur", label: "Investisseur", icon: Briefcase, desc: "Investir dans l'immobilier" },
  { id: "formateur", label: "Formateur", icon: GraduationCap, desc: "Former et éduquer" },
  { id: "proprietaire", label: "Propriétaire", icon: UserCheck, desc: "Gérer mes biens" },
  { id: "photographe", label: "Photographe", icon: Camera, desc: "Photos immobilières" },
] as const;

const COUNTRIES = [
  "Suisse", "France", "Belgique", "Luxembourg", "Maroc", "Tunisie",
  "Côte d'Ivoire", "Sénégal", "Cameroun", "Émirats arabes unis", "Thaïlande",
];

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // Step 3
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [otherRole, setOtherRole] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const validateStep1 = () => {
    if (!lastName || !firstName || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!phone || !country || !city) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0 && !showOtherInput) {
      setError("Veuillez sélectionner au moins un rôle.");
      return;
    }
    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push("/feed");
  };

  const inputClass =
    "w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]/30 transition-colors";

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#C4956A]/20 via-[var(--background)] to-[#C4956A]/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-md text-center px-8">
          <div className="w-20 h-20 rounded-2xl bg-[#C4956A] flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-3xl font-bold">E</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Rejoignez E-Dome
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Créez votre compte et accédez à l&apos;écosystème immobilier de demain.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#C4956A] flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">E-Dome</span>
          </div>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Inscription</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Étape {step} sur 3 —{" "}
            {step === 1 ? "Identité" : step === 2 ? "Coordonnées" : "Rôle"}
          </p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-[#C4956A]" : "bg-[var(--card-border)]"
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
              {error}
            </div>
          )}

          {/* Step 1: Identité */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dupont"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Marie"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          password.length >= level * 3
                            ? level <= 2
                              ? "bg-red-400"
                              : level === 3
                              ? "bg-yellow-400"
                              : "bg-green-400"
                            : "bg-[var(--card-border)]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Coordonnées */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 79 123 45 67"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Pays
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Sélectionnez un pays</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Ville
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lausanne"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Rôle */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {ROLES.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleRole(id)}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      selectedRoles.includes(id)
                        ? "border-[#C4956A] bg-[#C4956A]/10"
                        : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    {selectedRoles.includes(id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C4956A] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Icon className={`w-6 h-6 mb-2 ${selectedRoles.includes(id) ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`} />
                    <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                  </button>
                ))}

                {/* Autre */}
                <button
                  type="button"
                  onClick={() => setShowOtherInput(!showOtherInput)}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    showOtherInput
                      ? "border-[#C4956A] bg-[#C4956A]/10"
                      : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <Pencil className={`w-6 h-6 mb-2 ${showOtherInput ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`} />
                  <p className="text-sm font-medium text-[var(--foreground)]">Autre</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Précisez votre rôle</p>
                </button>
              </div>

              {showOtherInput && (
                <div className="mb-6 animate-fade-in">
                  <input
                    type="text"
                    value={otherRole}
                    onChange={(e) => setOtherRole(e.target.value)}
                    placeholder="Décrivez votre rôle..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]/30 transition-colors"
                  />
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--input-border)] accent-[#C4956A] mt-0.5"
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  J&apos;accepte les{" "}
                  <span className="text-[#C4956A] hover:underline cursor-pointer">
                    conditions d&apos;utilisation
                  </span>{" "}
                  et la{" "}
                  <span className="text-[#C4956A] hover:underline cursor-pointer">
                    politique de confidentialité
                  </span>
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
                className="px-6 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--hover-bg)] text-[var(--foreground)] font-medium flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            )}

            <button
              type="button"
              onClick={step < 3 ? handleNext : handleSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step < 3 ? (
                <>
                  Continuer
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Créer mon compte
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Link to connexion */}
          <p className="text-center mt-8 text-[var(--text-secondary)]">
            Déjà un compte ?{" "}
            <Link href="/auth/connexion" className="text-[#C4956A] hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
