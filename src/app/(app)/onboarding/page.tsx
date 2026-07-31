"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Camera, User, MapPin, Globe,
  Home, Building2, TrendingUp, Handshake, Briefcase, GraduationCap,
  Scale, PenTool, Shield,
  Search, BookOpen, Plus, Sparkles, MessageCircle, ShoppingBag, Zap,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { computeProfileCompletion } from "@/lib/profile-schema";
import type { Role } from "@/lib/types";

/* Onboarding progressif branché sur le profil (contexte, persisté). Chaque
   étape écrit dans le profil : photo, titre, à propos, localisation, rôles.
   La barre « Profil complété à X% » utilise le même moteur que le profil. */

const WELCOME_FEATURES = [
  { icon: ShoppingBag, title: "Marketplace immobilière", desc: "Achetez, vendez ou louez des biens dans le monde entier." },
  { icon: MessageCircle, title: "Réseau social intégré", desc: "Publiez, échangez et développez votre réseau professionnel." },
  { icon: Handshake, title: "Apporteurs d'affaires", desc: "Gagnez des commissions en recommandant des biens et services." },
  { icon: GraduationCap, title: "Formations certifiantes", desc: "Apprenez et obtenez des certifications reconnues." },
];

const ROLES: { id: Role; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { id: "client", label: "Client", icon: User, desc: "Rechercher et louer un bien" },
  { id: "hote", label: "Hôte", icon: Home, desc: "Mettre en location ses biens" },
  { id: "agence", label: "Agence", icon: Building2, desc: "Gérer un portefeuille" },
  { id: "promoteur", label: "Promoteur", icon: TrendingUp, desc: "Développer des projets" },
  { id: "apporteur", label: "Apporteur", icon: Handshake, desc: "Référer et gagner" },
  { id: "investisseur", label: "Investisseur", icon: Briefcase, desc: "Investir dans l'immobilier" },
  { id: "formateur", label: "Formateur", icon: GraduationCap, desc: "Créer des formations" },
  { id: "photographe", label: "Photographe", icon: Camera, desc: "Services photo" },
  { id: "courtier", label: "Courtier", icon: Scale, desc: "Accompagner les transactions" },
  { id: "architecte", label: "Architecte", icon: PenTool, desc: "Concevoir des espaces" },
  { id: "notaire", label: "Notaire", icon: Shield, desc: "Sécuriser les actes" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // État local seedé depuis le profil, committé dans le contexte à chaque étape.
  const [avatar, setAvatar] = useState(profile.avatar);
  const [headline, setHeadline] = useState(profile.headline);
  const [about, setAbout] = useState(profile.about);
  const [city, setCity] = useState(profile.location.city);
  const [country, setCountry] = useState(profile.location.country);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(profile.roles.length ? profile.roles : ["client"]);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleRole = (id: Role) =>
    setSelectedRoles((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const onPhoto = (file?: File) => {
    if (!file || !file.type.startsWith("image/") || file.size > 3 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  // % live calculé sur un profil dérivé des saisies en cours.
  const previewProfile = { ...profile, avatar, headline, about, location: { city, country }, roles: selectedRoles };
  const completion = computeProfileCompletion(previewProfile).percent;

  const commitProfileStep = () => {
    updateProfile({ avatar, headline: headline.trim(), about: about.trim(), location: { city: city.trim(), country: country.trim() } });
  };

  const next = () => {
    if (step === 2) commitProfileStep();
    if (step === 3) updateProfile({ roles: selectedRoles.length ? selectedRoles : ["client"] });
    setStep((s) => s + 1);
  };

  const finish = () => {
    commitProfileStep();
    updateProfile({ roles: selectedRoles.length ? selectedRoles : ["client"] });
    router.push("/feed");
  };

  const getSuggestions = () => {
    const s: { icon: React.ComponentType<{ className?: string }>; label: string; href: string }[] = [];
    if (selectedRoles.includes("client") || selectedRoles.includes("investisseur")) s.push({ icon: Search, label: "Explorer les biens", href: "/explorer" });
    if (selectedRoles.includes("hote") || selectedRoles.includes("agence") || selectedRoles.includes("promoteur")) s.push({ icon: Plus, label: "Publier un bien", href: "/publier" });
    if (selectedRoles.includes("formateur")) s.push({ icon: BookOpen, label: "Créer une formation", href: "/formations/creer" });
    if (selectedRoles.includes("apporteur")) s.push({ icon: Handshake, label: "Espace apporteurs", href: "/apporteurs" });
    s.push({ icon: MessageCircle, label: "Voir le feed", href: "/feed" });
    if (s.length < 4) s.push({ icon: GraduationCap, label: "Trouver une formation", href: "/formations" });
    return s.slice(0, 4);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors";

  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-2xl">
        {/* Header + progression */}
        <div className="sticky top-0 z-10 bg-[var(--card)] border-b border-[var(--card-border)] p-6 pb-4 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                <span className="text-[var(--primary-foreground)] text-lg font-bold">E</span>
              </div>
              <span className="font-bold text-lg">E-Dome</span>
            </div>
            <span className="text-sm text-[var(--text-muted)]">Étape {step} sur {totalSteps}</span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-[var(--primary)]" : "bg-[var(--input-bg)]"}`} />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Bienvenue sur E-Dome, {profile.firstName} !</h2>
                <p className="text-[var(--text-secondary)]">Découvrez tout ce que la plateforme peut vous offrir.</p>
              </div>
              <div className="space-y-4">
                {WELCOME_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)]">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Complétez votre profil</h2>
              <p className="text-[var(--text-secondary)] mb-6">Plus votre profil est complet, plus vous inspirez confiance.</p>

              <div className="mb-8 p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profil complété à {completion}%</span>
                  <span className="text-sm text-[var(--primary)] font-semibold">{completion}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--input-bg)]">
                  <div className="h-full rounded-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${completion}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[var(--input-bg)] border-2 border-dashed border-[var(--input-border)] flex items-center justify-center hover:border-[var(--primary)] transition-colors group"
                >
                  {avatar ? (
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
                <div>
                  <p className="font-medium text-sm">Photo de profil</p>
                  <p className="text-xs text-[var(--text-muted)]">JPG, PNG. Max 3 Mo.</p>
                  <button onClick={() => fileRef.current?.click()} className="text-xs text-[var(--primary)] hover:underline mt-1">
                    Télécharger une photo
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">Titre professionnel</label>
                  <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Ex : Investisseur & formateur immobilier" maxLength={160} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">À propos</label>
                  <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Présentez-vous en quelques mots…" rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Ville</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lausanne" className={`${inputClass} pl-11`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Pays</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Suisse" className={`${inputClass} pl-11`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Activez vos rôles</h2>
              <p className="text-[var(--text-secondary)] mb-6">Sélectionnez les rôles qui correspondent à votre activité. Vous pourrez les modifier à tout moment.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROLES.map(({ id, label, icon: Icon, desc }) => {
                  const on = selectedRoles.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleRole(id)}
                      className={`relative p-4 rounded-xl border text-left transition-all ${on ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--text-muted)]"}`}
                    >
                      <div className={`absolute top-3 right-3 w-8 h-5 rounded-full transition-colors flex items-center ${on ? "bg-[var(--primary)]" : "bg-[var(--input-bg)]"}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${on ? "translate-x-3.5" : "translate-x-1"}`} />
                      </div>
                      <Icon className={`w-6 h-6 mb-2 ${on ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`} />
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                    </button>
                  );
                })}
              </div>
              {selectedRoles.length > 0 && (
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--primary)] font-semibold">{selectedRoles.length}</span> rôle{selectedRoles.length > 1 ? "s" : ""} sélectionné{selectedRoles.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Tout est prêt !</h2>
                <p className="text-[var(--text-secondary)]">Votre profil est complété à {completion}%. Voici des suggestions pour commencer.</p>
              </div>
              <div className="space-y-3">
                {getSuggestions().map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { finish(); router.push(s.href); }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)]/20 transition-colors">
                      <s.icon className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <span className="font-medium text-sm flex-1">{s.label}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="sticky bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-0 bg-[var(--card)] border-t border-[var(--card-border)] p-6 rounded-b-2xl">
          <div className="flex gap-3">
            {step < totalSteps && (
              <button onClick={next} className="px-6 py-3 rounded-xl border border-[var(--card-border)] bg-transparent hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] font-medium transition-colors text-sm">
                Passer
              </button>
            )}
            {step < totalSteps ? (
              <button onClick={next} className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Suivant <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={finish} className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Commencer <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
