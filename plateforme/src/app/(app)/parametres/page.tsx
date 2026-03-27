"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  Lock,
  CreditCard,
  Users,
  Camera,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  LogOut,
  Star,
  Home,
  Building2,
  Briefcase,
  TrendingUp,
  Link2,
  GraduationCap,
  User,
  ChevronRight,
  Check,
  Loader2,
  Trash2,
  AlertTriangle,
  X,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";
import { roleLabels } from "@/lib/types";
import type { Role } from "@/lib/types";
import { useApp } from "@/lib/context";

// ─── Types ──────────────────────────────────────────────

type IconComponent = React.ComponentType<{ className?: string }>;

interface SettingsSection {
  id: string;
  label: string;
  icon: IconComponent;
}

// ─── Nav config ─────────────────────────────────────────

const sections: SettingsSection[] = [
  { id: "general", label: "Général", icon: Settings },
  { id: "securite", label: "Sécurité", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "confidentialite", label: "Confidentialité", icon: Lock },
  { id: "facturation", label: "Facturation", icon: CreditCard },
  { id: "roles", label: "Rôles", icon: Users },
];

// ─── Role config ────────────────────────────────────────

interface RoleConfig {
  role: Role;
  icon: IconComponent;
  description: string;
}

const roleConfigs: RoleConfig[] = [
  { role: "client", icon: User, description: "Recherchez et réservez des biens immobiliers" },
  { role: "hote", icon: Home, description: "Proposez vos biens en location courte durée" },
  { role: "proprietaire", icon: Building2, description: "Gérez vos propriétés et locataires" },
  { role: "agence", icon: Briefcase, description: "Gérez un portefeuille d'agence immobilière" },
  { role: "promoteur", icon: TrendingUp, description: "Publiez et vendez des programmes neufs" },
  { role: "apporteur", icon: Link2, description: "Recommandez des biens et gagnez des commissions" },
  { role: "investisseur", icon: Star, description: "Investissez dans l'immobilier et suivez vos rendements" },
  { role: "formateur", icon: GraduationCap, description: "Créez et vendez des formations immobilières" },
];

// ─── Component ──────────────────────────────────────────

export default function ParametresPage() {
  const { availableRoles, toggleAvailableRole, formatPrice } = useApp();
  const [activeSection, setActiveSection] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState(0); // 0=off, 1=QR, 2=code, 3=done
  const [twoFACode, setTwoFACode] = useState(["", "", "", "", "", ""]);

  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Toast & saving
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // GDPR export
  const [showGDPRModal, setShowGDPRModal] = useState(false);
  const [gdprExporting, setGdprExporting] = useState(false);
  const [gdprDone, setGdprDone] = useState(false);

  // Form state
  const [form, setForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phone: currentUser.phone || "",
    country: currentUser.country,
    city: currentUser.city,
    bio: currentUser.bio || "",
    language: "fr",
  });

  // Notification toggles
  const [notifChannels, setNotifChannels] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [notifCategories, setNotifCategories] = useState({
    messages: true,
    reservations: true,
    likes: true,
    commentaires: true,
    suivis: false,
    promotions: false,
  });
  const [notifSound, setNotifSound] = useState(true);

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showOnline: true,
  });

  // Autre role state
  const [autreRoleEnabled, setAutreRoleEnabled] = useState(false);
  const [autreRoleDescription, setAutreRoleDescription] = useState("");

  const toggleRole = (role: Role) => {
    toggleAvailableRole(role);
  };

  // Password strength
  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (!pwd) return { label: "", color: "", width: "0%" };
    if (pwd.length < 6) return { label: "Faible", color: "bg-red-500", width: "33%" };
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
      return { label: "Moyen", color: "bg-yellow-500", width: "66%" };
    return { label: "Fort", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  // Avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save with loading
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Sauvegardé !");
    }, 1500);
  };

  // 2FA flow
  const handle2FAToggle = () => {
    if (twoFAEnabled) {
      setTwoFAEnabled(false);
      setTwoFAStep(0);
      setTwoFACode(["", "", "", "", "", ""]);
    } else {
      setTwoFAStep(1);
    }
  };

  const handle2FACodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...twoFACode];
    newCode[index] = value.slice(-1);
    setTwoFACode(newCode);
    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handle2FAVerify = () => {
    if (twoFACode.every((d) => d !== "")) {
      setTwoFAStep(3);
      setTwoFAEnabled(true);
      setTimeout(() => {
        setTwoFAStep(0);
      }, 3000);
    }
  };

  // Toggle helper
  const Toggle = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors",
        enabled ? "bg-[#C4956A]" : "bg-[var(--card)]"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-0 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
      {/* ── Toast ── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed right-6 top-6 z-50 rounded-xl border border-[#C4956A]/30 bg-[var(--card)] px-6 py-3 text-sm font-medium text-[#C4956A] shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {toast}
          </div>
        </motion.div>
      )}

      {/* ── Delete Account Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 w-full max-w-md rounded-2xl border border-red-500/20 bg-[var(--card)] p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Supprimer mon compte</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Cette action est irréversible. Toutes vos données, biens et historique seront
              définitivement supprimés.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--card)] py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast("Compte supprimé (démo)");
                }}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── GDPR Export Modal ── */}
      {showGDPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 w-full max-w-md rounded-2xl border border-[#C4956A]/20 bg-[var(--card)] p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C4956A]/10">
              <Download className="h-6 w-6 text-[#C4956A]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Exporter mes donn&eacute;es</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD),
              vous avez le droit de recevoir une copie de toutes les donn&eacute;es personnelles
              que nous d&eacute;tenons vous concernant.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              L&apos;export inclut : informations de profil, historique des r&eacute;servations,
              messages, paiements et activit&eacute;.
            </p>

            {gdprDone ? (
              <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <p className="text-sm font-medium text-green-400">
                    Votre export sera envoy&eacute; par email sous 48h.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowGDPRModal(false);
                  setGdprDone(false);
                  setGdprExporting(false);
                }}
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--card)] py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5"
              >
                Fermer
              </button>
              {!gdprDone && (
                <button
                  onClick={() => {
                    setGdprExporting(true);
                    setTimeout(() => {
                      setGdprExporting(false);
                      setGdprDone(true);
                    }, 2000);
                  }}
                  disabled={gdprExporting}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition",
                    gdprExporting
                      ? "bg-[#C4956A]/50 text-black/50 cursor-wait"
                      : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                  )}
                >
                  {gdprExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Demander l&apos;export
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── Sidebar ─── */}
      <div className="w-[250px] flex-shrink-0 border-r border-[var(--card-border)] p-4">
        <h1 className="mb-6 px-3 text-lg font-semibold text-[var(--foreground)]">Paramètres</h1>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-[#C4956A]/10 text-[#C4956A]"
                    : "text-[var(--text-secondary)] hover:bg-white/[0.03] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* ── General ── */}
        {activeSection === "general" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Informations générales</h2>

            {/* Avatar with file upload */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative overflow-hidden"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full border-2 border-[#C4956A] object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-2xl font-bold text-black">
                      {form.firstName[0]}{form.lastName[0]}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#C4956A] text-black">
                    <Camera className="h-3.5 w-3.5" />
                  </div>
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Photo de profil</p>
                <p className="text-xs text-[var(--text-secondary)]">JPG, PNG ou GIF. Max 5 MB. Cliquez pour modifier.</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Prénom</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Téléphone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Pays</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Ville</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Biographie</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Langue</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#C4956A] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>

            {/* Delete account */}
            <div className="border-t border-[var(--card-border)] pt-6">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer mon compte
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Securite ── */}
        {activeSection === "securite" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Sécurité</h2>

            {/* Change password */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Changer le mot de passe</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Mot de passe actuel</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="--------"
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="--------"
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--card)]">
                        <div
                          className={cn("h-full rounded-full transition-all", passwordStrength.color)}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                      <p className={cn(
                        "mt-1 text-[10px] font-medium",
                        passwordStrength.color === "bg-red-500" ? "text-red-400" :
                        passwordStrength.color === "bg-yellow-500" ? "text-yellow-400" : "text-green-400"
                      )}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="--------"
                    className={cn(
                      "w-full rounded-lg border bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#C4956A]/50",
                      confirmPassword && !passwordsMatch
                        ? "border-red-500/50"
                        : confirmPassword && passwordsMatch
                          ? "border-green-500/50"
                          : "border-[var(--card-border)]"
                    )}
                  />
                  {confirmPassword && (
                    <p className={cn("mt-1 text-[10px] font-medium", passwordsMatch ? "text-green-400" : "text-red-400")}>
                      {passwordsMatch ? "Les mots de passe correspondent" : "Les mots de passe ne correspondent pas"}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#C4956A] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Mettre à jour"
                  )}
                </button>
              </div>
            </div>

            {/* 2FA */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Authentification à deux facteurs</h3>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Ajoutez une couche de sécurité supplémentaire</p>
                </div>
                <Toggle enabled={twoFAEnabled} onChange={handle2FAToggle} />
              </div>

              {/* 2FA Setup Flow */}
              <AnimatePresence>
                {twoFAStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <p className="mb-3 text-xs text-[var(--text-secondary)]">Étape 1 : Scannez ce QR code avec votre application d&apos;authentification</p>
                    {/* Placeholder QR code */}
                    <div className="mx-auto mb-4 w-fit rounded-xl bg-white p-4">
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {Array.from({ length: 14 }).map((_, row) =>
                          Array.from({ length: 14 }).map((_, col) => {
                            const filled = (row + col) % 3 === 0 || (row * col) % 5 < 2;
                            return filled ? (
                              <rect
                                key={`${row}-${col}`}
                                x={col * 10}
                                y={row * 10}
                                width="10"
                                height="10"
                                fill="black"
                              />
                            ) : null;
                          })
                        )}
                      </svg>
                    </div>
                    <button
                      onClick={() => setTwoFAStep(2)}
                      className="w-full rounded-lg bg-[#C4956A] py-2.5 text-sm font-semibold text-black transition hover:bg-[#D4A574]"
                    >
                      Suivant
                    </button>
                  </motion.div>
                )}

                {twoFAStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <p className="mb-3 text-xs text-[var(--text-secondary)]">Étape 2 : Entrez le code à 6 chiffres</p>
                    <div className="flex justify-center gap-2">
                      {twoFACode.map((digit, i) => (
                        <input
                          key={i}
                          id={`2fa-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handle2FACodeChange(i, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !digit && i > 0) {
                              document.getElementById(`2fa-${i - 1}`)?.focus();
                            }
                          }}
                          className="h-12 w-12 rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-center text-xl font-bold text-[var(--foreground)] outline-none focus:border-[#C4956A]/50"
                        />
                      ))}
                    </div>
                    <button
                      onClick={handle2FAVerify}
                      disabled={!twoFACode.every((d) => d !== "")}
                      className="mt-4 w-full rounded-lg bg-[#C4956A] py-2.5 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-40"
                    >
                      Vérifier
                    </button>
                  </motion.div>
                )}

                {twoFAStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3"
                  >
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Activé avec succès !</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sessions */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Sessions actives</h3>
              <div className="space-y-3">
                {[
                  { device: "MacBook Pro - Chrome", location: "Genève, Suisse", icon: Monitor, current: true },
                  { device: "iPhone 15 - Safari", location: "Genève, Suisse", icon: Smartphone, current: false },
                ].map((session, i) => {
                  const DeviceIcon = session.icon;
                  return (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                      <div className="flex items-center gap-3">
                        <DeviceIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                        <div>
                          <p className="text-sm text-[var(--foreground)]">{session.device}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{session.location}</p>
                        </div>
                      </div>
                      {session.current ? (
                        <span className="text-xs text-green-400">Session actuelle</span>
                      ) : (
                        <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
                          <LogOut className="h-3 w-3" /> Déconnecter
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Notifications ── */}
        {activeSection === "notifications" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Notifications</h2>

            {/* Channels */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Canaux de notification</h3>
              <div className="space-y-4">
                {(["email", "push", "sms"] as const).map((channel) => (
                  <div key={channel} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--foreground)]">
                        {channel === "email" ? "Email" : channel === "push" ? "Notifications push" : "SMS"}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {channel === "email"
                          ? "Recevez des notifications par email"
                          : channel === "push"
                            ? "Notifications dans le navigateur"
                            : "Alertes par SMS"}
                      </p>
                    </div>
                    <Toggle
                      enabled={notifChannels[channel]}
                      onChange={() => setNotifChannels({ ...notifChannels, [channel]: !notifChannels[channel] })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sound toggle */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Son de notification</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--foreground)]">Activer le son</p>
                  <p className="text-xs text-[var(--text-secondary)]">Jouer un son lors de la réception d&apos;une notification</p>
                </div>
                <Toggle
                  enabled={notifSound}
                  onChange={() => {
                    setNotifSound(!notifSound);
                    showToast(notifSound ? "Son de notification désactivé" : "Son de notification activé");
                  }}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Catégories</h3>
              <div className="space-y-4">
                {(Object.keys(notifCategories) as (keyof typeof notifCategories)[]).map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <p className="text-sm capitalize text-[var(--foreground)]">{cat}</p>
                    <Toggle
                      enabled={notifCategories[cat]}
                      onChange={() => {
                        const newVal = !notifCategories[cat];
                        setNotifCategories({ ...notifCategories, [cat]: newVal });
                        showToast(`Notifications ${cat} ${newVal ? "activées" : "désactivées"}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Preview */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Aperçu de notification</h3>
              <div className="rounded-xl border border-[#C4956A]/20 bg-[#C4956A]/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C4956A]/20">
                    <Bell className="h-5 w-5 text-[#C4956A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">Nouveau message</p>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Sophie Martin vous a envoyé un message</p>
                    <p className="mt-1 text-[10px] text-[var(--text-muted)]">Il y a 2 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Confidentialite ── */}
        {activeSection === "confidentialite" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Confidentialité</h2>

            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)]">Profil public</p>
                    <p className="text-xs text-[var(--text-secondary)]">Votre profil est visible par tous les utilisateurs</p>
                  </div>
                  <Toggle
                    enabled={privacy.profilePublic}
                    onChange={() => setPrivacy({ ...privacy, profilePublic: !privacy.profilePublic })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)]">Afficher l&apos;email</p>
                    <p className="text-xs text-[var(--text-secondary)]">Votre email est visible sur votre profil</p>
                  </div>
                  <Toggle
                    enabled={privacy.showEmail}
                    onChange={() => setPrivacy({ ...privacy, showEmail: !privacy.showEmail })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)]">Afficher le téléphone</p>
                    <p className="text-xs text-[var(--text-secondary)]">Votre numéro est visible sur votre profil</p>
                  </div>
                  <Toggle
                    enabled={privacy.showPhone}
                    onChange={() => setPrivacy({ ...privacy, showPhone: !privacy.showPhone })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)]">Statut en ligne</p>
                    <p className="text-xs text-[var(--text-secondary)]">Les autres peuvent voir quand vous êtes en ligne</p>
                  </div>
                  <Toggle
                    enabled={privacy.showOnline}
                    onChange={() => setPrivacy({ ...privacy, showOnline: !privacy.showOnline })}
                  />
                </div>
              </div>
            </div>

            {/* GDPR Data Export */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Portabilit&eacute; des donn&eacute;es</h3>
              <p className="mb-4 text-xs text-[var(--text-secondary)]">
                T&eacute;l&eacute;chargez une copie de toutes vos donn&eacute;es personnelles (RGPD).
              </p>
              <button
                onClick={() => {
                  setGdprDone(false);
                  setGdprExporting(false);
                  setShowGDPRModal(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-[#C4956A]/15 px-4 py-2.5 text-sm font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/25"
              >
                <Download className="h-4 w-4" />
                Exporter mes donn&eacute;es
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Facturation ── */}
        {activeSection === "facturation" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Facturation</h2>

            {/* Current plan */}
            <div className="rounded-xl border border-[#C4956A]/30 bg-gradient-to-br from-[#C4956A]/10 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#C4956A]">Plan actuel</p>
                  <h3 className="mt-1 text-xl font-bold text-[var(--foreground)]">Premium</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{formatPrice(49)} / mois</p>
                </div>
                <button className="rounded-lg border border-[#C4956A] px-4 py-2 text-sm font-medium text-[#C4956A] transition hover:bg-[#C4956A]/10">
                  Changer de plan
                </button>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Moyen de paiement</h3>
              <div className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-14 items-center justify-center rounded-md bg-[var(--card)] text-xs font-bold text-[var(--foreground)]">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]">**** **** **** 4242</p>
                    <p className="text-xs text-[var(--text-secondary)]">Expire 12/27</p>
                  </div>
                </div>
                <button className="text-xs text-[#C4956A] hover:underline">Modifier</button>
              </div>
            </div>

            {/* Billing history */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Historique de facturation</h3>
              <div className="space-y-2">
                {[
                  { date: "01 mars 2026", amountNum: 49, status: "Payé" },
                  { date: "01 février 2026", amountNum: 49, status: "Payé" },
                  { date: "01 janvier 2026", amountNum: 49, status: "Payé" },
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3">
                    <span className="text-sm text-[var(--foreground)]">{invoice.date}</span>
                    <span className="text-sm text-[var(--text-secondary)]">{formatPrice(invoice.amountNum)}</span>
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                      {invoice.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Roles ── */}
        {activeSection === "roles" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Gestion des rôles</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Activez ou désactivez les rôles selon vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {roleConfigs.map(({ role, icon: Icon, description }) => {
                const isActive = availableRoles.includes(role);
                return (
                  <div
                    key={role}
                    className={cn(
                      "rounded-xl border p-5 transition",
                      isActive
                        ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                        : "border-[var(--card-border)] bg-[var(--card)]/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            isActive ? "bg-[#C4956A]/20 text-[#C4956A]" : "bg-white/[0.05] text-[var(--text-secondary)]"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">{roleLabels[role]}</p>
                        </div>
                      </div>
                      <Toggle enabled={isActive} onChange={() => toggleRole(role)} />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">{description}</p>
                  </div>
                );
              })}

              {/* Autre role */}
              <div
                className={cn(
                  "rounded-xl border p-5 transition",
                  autreRoleEnabled
                    ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                    : "border-[var(--card-border)] bg-[var(--card)]/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        autreRoleEnabled ? "bg-[#C4956A]/20 text-[#C4956A]" : "bg-white/[0.05] text-[var(--text-secondary)]"
                      )}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Autre</p>
                    </div>
                  </div>
                  <Toggle enabled={autreRoleEnabled} onChange={() => setAutreRoleEnabled(!autreRoleEnabled)} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">Définissez un rôle personnalisé</p>
                {autreRoleEnabled && (
                  <input
                    type="text"
                    value={autreRoleDescription}
                    onChange={(e) => setAutreRoleDescription(e.target.value)}
                    placeholder="Décrivez votre rôle..."
                    className="mt-3 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
