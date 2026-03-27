"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [toast, setToast] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "L'email est requis";
    if (!password.trim()) newErrors.password = "Le mot de passe est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      router.push("/feed");
    }, 1500);
  };

  const handleGoogleLogin = () => {
    showToast("Connexion Google bientôt disponible");
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* ── Toast ── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed right-6 top-6 z-50 rounded-xl border border-[#C4956A]/30 bg-[var(--card)] px-6 py-3 text-sm font-medium text-[#C4956A] shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {toast}
          </div>
        </motion.div>
      )}

      {/* ─── Left decorative panel ─── */}
      <div className="hidden flex-1 items-center justify-center auth-gradient-bg lg:flex">
        <div className="max-w-md px-12 text-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-5xl font-bold">
              <span className="text-white">E-</span>
              <span className="bg-gradient-to-r from-[#C4956A] to-[#D4A574] bg-clip-text text-transparent">
                Dome
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-sm font-medium tracking-wide text-[#C4956A]/70">
            Marketplace &middot; Reseau Social &middot; Apporteurs &middot; Formations &middot; Services
          </p>

          <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
            La plateforme immobiliere sociale tout-en-un. Achetez, vendez, louez et investissez dans l&apos;immobilier.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 space-y-4 text-left">
            <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/15">
                <svg className="h-4 w-4 text-[#C4956A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm text-white/80">Commissions reduites de 40-60%</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/15">
                <svg className="h-4 w-4 text-[#C4956A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <span className="text-sm text-white/80">Visibilite organique gratuite</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#C4956A]/15">
                <svg className="h-4 w-4 text-[#C4956A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <span className="text-sm text-white/80">Ecosysteme tout-en-un</span>
            </div>
          </div>

          {/* Decorative elements */}
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

          <h2 className="text-2xl font-bold text-[var(--foreground)]">Se connecter</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Bienvenue ! Connectez-vous à votre compte.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="nom@email.com"
                  className={cn(
                    "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                    errors.email ? "border-red-500/50" : "border-[var(--card-border)]"
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="--------"
                  className={cn(
                    "w-full rounded-lg border bg-[var(--card)] py-3 pl-10 pr-10 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50",
                    errors.password ? "border-red-500/50" : "border-[var(--card-border)]"
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/[0.1] bg-[var(--card)] text-[#C4956A] accent-[#C4956A]"
                />
                <span className="text-xs text-[var(--text-secondary)]">Se souvenir de moi</span>
              </label>
              <button type="button" onClick={() => { setShowForgotPassword(true); setResetSent(false); setResetEmail(email); }} className="text-xs text-[#C4956A] hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C4956A] py-3 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--card-border)]" />
              <span className="text-xs text-[var(--text-muted)]">ou</span>
              <div className="h-px flex-1 bg-[var(--card-border)]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--card)] py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/[0.03]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuer avec Google
            </button>
          </form>

          {/* Link to register */}
          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Pas encore de compte ?{" "}
            <Link href="/auth/inscription" className="font-medium text-[#C4956A] hover:underline">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowForgotPassword(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
          >
            {resetSent ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-7 w-7 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Email envoyé !</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Un email de réinitialisation a été envoyé à <span className="font-medium text-[#C4956A]">{resetEmail}</span>.
                </p>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="mt-2 rounded-lg bg-[#C4956A] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574]"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">Mot de passe oublié</h3>
                <p className="mb-5 text-sm text-[var(--text-secondary)]">
                  Entrez votre email pour réinitialiser votre mot de passe.
                </p>
                <div className="relative mb-4">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nom@email.com"
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 rounded-lg border border-[var(--card-border)] py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/[0.03]"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (resetEmail.trim()) setResetSent(true);
                    }}
                    disabled={!resetEmail.trim()}
                    className="flex-1 rounded-lg bg-[#C4956A] py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574] disabled:opacity-50"
                  >
                    Envoyer
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
