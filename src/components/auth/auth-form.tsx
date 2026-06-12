"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/* AuthForm : form reutilisable connexion / inscription.
   - mode 'login' ou 'signup'
   - signInWithPassword (login) ou signUp (signup)
   - signInWithOAuth Google pour les 2 modes
   - Gere le cas Supabase pas configure : banner demo + boutons disabled. */

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/feed";
  const supabase = createClient();
  const configured = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState<null | "email" | "google">(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError("Authentification non configuree. Configure Supabase dans .env.local.");
      return;
    }
    setLoading("email");
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName, lastName },
            emailRedirectTo: typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
          },
        });
        if (err) throw err;
      }
      router.push(redirect);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur s'est produite.");
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    if (!supabase) {
      setError("Authentification non configuree. Configure Supabase dans .env.local.");
      return;
    }
    setLoading("google");
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });
      if (err) throw err;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur OAuth.");
      setLoading(null);
    }
  };

  const inputCls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

  return (
    <div>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {mode === "login" ? "Bienvenue" : "Rejoignez E-Dome"}
      </p>
      <h1 className="page-heading mt-1 text-3xl">
        {mode === "login" ? "Se connecter" : "Creer un compte"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login"
          ? "Acces a votre tableau de bord, vos messages, vos biens."
          : "Gratuit. Pas de carte bancaire. 60 secondes pour demarrer."}
      </p>

      {!configured && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <strong>Mode demo :</strong> l&apos;authentification reelle n&apos;est pas activee.
          Configure Supabase dans <code className="font-mono">.env.local</code> pour
          activer connexion + inscription. La demo continue sans compte.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="firstName" className="text-xs font-medium text-muted-foreground">
                Prenom
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputCls + " mt-1"}
                placeholder="Leo"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-xs font-medium text-muted-foreground">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputCls + " mt-1"}
                placeholder="Martin"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls + " mt-1"}
            placeholder="vous@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Mot de passe
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls + " pr-10"}
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "signup" ? 8 : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? "Masquer" : "Afficher"}
              tabIndex={-1}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mode === "signup" && (
            <p className="mt-1 text-[10px] text-muted-foreground">8 caracteres minimum</p>
          )}
        </div>

        {error && (
          <p className="rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading !== null || !configured}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading === "email" && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "login" ? "Se connecter" : "Creer mon compte"}
        </button>
      </form>

      <div className="relative my-4">
        <span className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </span>
        <span className="relative flex justify-center">
          <span className="bg-background px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            ou
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading !== null || !configured}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2c-2 1.4-4.5 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8L6.3 33C9.7 39.6 16.3 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.3 5.2C40 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
        )}
        Continuer avec Google
      </button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {mode === "login" ? (
          <>
            Pas de compte ?{" "}
            <Link href="/auth/inscription" className="font-medium text-foreground underline underline-offset-2">
              Creer un compte
            </Link>
          </>
        ) : (
          <>
            Deja un compte ?{" "}
            <Link href="/auth/connexion" className="font-medium text-foreground underline underline-offset-2">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
