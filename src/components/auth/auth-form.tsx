"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, BadgeCheck, Eye, EyeOff, Loader2, Lock, Mail, MailCheck, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ── Connexion / inscription ─────────────────────────────────────────────────

   · Le chemin de retour (`?redirect=`) est conservé partout — y compris en
     passant de « connexion » à « inscription » et à travers l'e-mail de
     confirmation — pour que « Publier mon bien » mène bien à la publication.
   · Si Supabase exige la confirmation de l'e-mail, l'inscription ne crée pas
     de session : on l'annonce clairement au lieu de renvoyer vers un écran
     protégé qui ramènerait ici sans explication.
   · Les erreurs de Supabase (en anglais) sont traduites. */

interface AuthFormProps {
  mode: "login" | "signup";
}

const ERRORS: [RegExp, string][] = [
  [/invalid login credentials/i, "E-mail ou mot de passe incorrect."],
  [/email not confirmed/i, "Confirmez d'abord votre adresse : un lien vous a été envoyé par e-mail."],
  [/user already registered/i, "Un compte existe déjà avec cet e-mail. Connectez-vous."],
  [/password should be at least/i, "Le mot de passe doit contenir au moins 8 caractères."],
  /* Service d'e-mail de Supabase saturé ou refusé (pas de SMTP configuré). */
  [/sending (confirmation|magic link)|email rate limit|error sending/i, "Nous n'avons pas pu envoyer l'e-mail de confirmation. Réessayez dans quelques minutes ou écrivez-nous via la page Contact."],
  [/rate limit|too many/i, "Trop de tentatives. Patientez une minute puis réessayez."],
  [/network|fetch/i, "Connexion impossible. Vérifiez votre réseau."],
];
const translate = (m: string) => ERRORS.find(([re]) => re.test(m))?.[1] ?? "Une erreur s'est produite. Réessayez.";


/* Le bouton Google n'apparaît que si le fournisseur est activé dans Supabase
   (Authentication → Providers → Google) ET signalé ici : sinon le clic
   finirait sur une erreur. Activer : NEXT_PUBLIC_AUTH_GOOGLE=1 dans Vercel. */
const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_AUTH_GOOGLE === "1";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  /* Chemin relatif uniquement : sans ce garde, « ?redirect=https://evil.com »
     éjecterait l'utilisateur vers un site tiers après connexion. */
  const rawRedirect = searchParams.get("redirect") ?? "/";
  const redirect = /^\/(?!\/)/.test(rawRedirect) ? rawRedirect : "/";
  const keep = redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : "";
  /* Un nouveau membre sans destination précise passe par l'accueil. */
  const afterSignup = redirect === "/" ? "/bienvenue" : redirect;
  const supabase = createClient();
  const configured = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState<null | "email" | "google">(null);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const context =
    redirect.startsWith("/publier")
      ? "Pour publier votre bien, gratuitement."
      : redirect.startsWith("/apporteurs")
        ? "Pour recommander des biens avec votre lien et toucher des commissions."
        : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError("L'authentification n'est pas configurée sur cet environnement.");
      return;
    }
    setLoading("email");
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push(redirect);
        router.refresh();
        return;
      }
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName: firstName.trim(), lastName: lastName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(afterSignup)}`,
        },
      });
      if (err) throw err;
      if (data.session) {
        router.push(afterSignup);
        router.refresh();
      } else {
        setSentTo(email);
      }
    } catch (e) {
      setError(translate(e instanceof Error ? e.message : ""));
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    if (!supabase) return;
    setLoading("google");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}` },
    });
    if (err) {
      setError(translate(err.message));
      setLoading(null);
    }
  };

  /* Inscription envoyée, confirmation requise. */
  if (sentTo) {
    return (
      <div className="relative overflow-hidden rounded-3xl border bg-card/80 p-7 text-center shadow-[0_30px_80px_-40px_rgb(0_0_0/0.55)] backdrop-blur">
        <div aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-leman/60 to-transparent" />
        <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-leman/25 bg-leman-soft text-leman">
          <MailCheck className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="page-heading mt-5 text-[28px]">Vérifiez votre e-mail</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Un lien de confirmation a été envoyé à <strong className="break-all text-foreground">{sentTo}</strong>. Ouvrez-le pour
          activer votre compte{redirect.startsWith("/publier") ? " — vous arriverez directement sur la publication" : ""}.
        </p>
        <p className="mt-6 text-[12.5px] text-muted-foreground">
          Rien reçu ? Regardez dans les indésirables, ou{" "}
          <button type="button" onClick={() => setSentTo(null)} className="inline-flex min-h-11 items-center font-medium text-leman hover:underline">
            corrigez l&apos;adresse
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-[11.5px] font-medium text-muted-foreground backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-laiton" aria-hidden />
        {mode === "login" ? "Espace membre" : "Nouveau membre"}
      </p>
      <h1 className="page-heading mt-4 text-[32px] sm:text-[36px]">{mode === "login" ? "Se connecter" : "Créer un compte"}</h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
        {context ?? (mode === "login" ? "Retrouvez vos biens, vos demandes et vos commissions." : "Gratuit, sans carte bancaire.")}
      </p>

      <div className="relative mt-7 rounded-3xl border bg-card/80 p-5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.55)] backdrop-blur sm:p-6">
        {/* Arête éclairée : le seul ornement de la carte. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-laiton/50 to-transparent" />

        {!configured && (
          <div className="mb-5 rounded-xl border bg-warning-soft p-3 text-[12.5px] text-[var(--warning-text)]">
            L&apos;authentification n&apos;est pas activée sur cet environnement (Supabase non configuré).
          </div>
        )}

        {GOOGLE_ENABLED && (<>
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          disabled={loading !== null || !configured}
          className="h-11 w-full rounded-xl text-[14px]"
        >
          {loading === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2c-2 1.4-4.5 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8L6.3 33C9.7 39.6 16.3 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.3 5.2C40 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
          )}
          Continuer avec Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-[11.5px] text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou par e-mail <span className="h-px flex-1 bg-border" />
        </div>
        </>)}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <Field id="firstName" label="Prénom">
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required className="h-11 rounded-xl" />
              </Field>
              <Field id="lastName" label="Nom">
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required className="h-11 rounded-xl" />
              </Field>
            </div>
          )}

          <Field id="email" label="E-mail">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.ch"
              autoComplete="email"
              required
              leadingIcon={Mail}
              className="h-11 rounded-xl pl-10"
            />
          </Field>

          <Field id="password" label="Mot de passe" hint={mode === "signup" ? "8 caractères minimum" : undefined}>
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "signup" ? 8 : undefined}
              required
              leadingIcon={Lock}
              className="h-11 rounded-xl pl-10 pr-12"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </Field>

          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-[color-mix(in_oklab,var(--danger-text)_25%,transparent)] bg-danger-soft px-3 py-2.5 text-[13px] text-[var(--danger-text)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading !== null || !configured} className="group h-11 w-full rounded-xl text-[15px] font-semibold">
            {loading === "email" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
            {loading !== "email" && (
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-[13.5px] text-muted-foreground">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href={`/auth/inscription${keep}`} className="inline-flex min-h-11 items-center font-medium text-leman hover:underline">
              Créer un compte
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Link href={`/auth/connexion${keep}`} className="inline-flex min-h-11 items-center font-medium text-leman hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </p>

      <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
        <li className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-leman" aria-hidden /> Publication gratuite</li>
        <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-leman" aria-hidden /> E-Dome ne détient jamais votre argent</li>
      </ul>

      {mode === "signup" && (
        <p className="mt-5 text-center text-[11.5px] leading-relaxed text-muted-foreground">
          En créant un compte, vous acceptez les{" "}
          <Link href="/conditions" className="underline underline-offset-2 hover:text-foreground">conditions</Link> et la{" "}
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-foreground">politique de confidentialité</Link>.
        </p>
      )}
    </div>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11.5px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
