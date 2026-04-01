"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, X, ArrowRight, Loader2 } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push("/feed");
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await new Promise((r) => setTimeout(r, 800));
    setForgotSent(true);
  };

  const handleGoogle = () => {
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#C4956A]/20 via-[var(--background)] to-[#C4956A]/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-md text-center px-8">
          <div className="w-20 h-20 rounded-2xl bg-[#C4956A] flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-3xl font-bold">E</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Bienvenue sur E-Dome
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            La plateforme immobilière tout-en-un pour les professionnels et particuliers.
          </p>
          <div className="mt-12 flex gap-4 justify-center">
            {["Acheter", "Louer", "Investir"].map((t) => (
              <span
                key={t}
                className="px-4 py-2 rounded-full border border-[var(--card-border)] text-sm text-[var(--text-secondary)] bg-[var(--card)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#C4956A] flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">E-Dome</span>
          </div>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Connexion</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Connectez-vous pour accéder à votre espace
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]/30 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="••••••••"
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
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--input-border)] accent-[#C4956A]"
                />
                <span className="text-sm text-[var(--text-secondary)]">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm text-[#C4956A] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[var(--card-border)]" />
            <span className="text-sm text-[var(--text-muted)]">ou</span>
            <div className="flex-1 h-px bg-[var(--card-border)]" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--hover-bg)] text-[var(--foreground)] font-medium flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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

          {/* Link to inscription */}
          <p className="text-center mt-8 text-[var(--text-secondary)]">
            Pas encore de compte ?{" "}
            <Link href="/auth/inscription" className="text-[#C4956A] hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)]">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Réinitialiser le mot de passe
              </h3>
              <button
                onClick={() => {
                  setShowForgot(false);
                  setForgotSent(false);
                  setForgotEmail("");
                }}
                className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#C4956A]/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#C4956A]" />
                </div>
                <p className="text-[var(--foreground)] font-medium mb-2">E-mail envoyé !</p>
                <p className="text-[var(--text-secondary)] text-sm">
                  Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                  Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]/30 transition-colors mb-4"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white font-semibold transition-colors"
                >
                  Envoyer le lien
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
