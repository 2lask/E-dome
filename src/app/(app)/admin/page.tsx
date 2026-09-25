import { LogOut } from "lucide-react";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/leads/admin-auth";
import { AdminConsole } from "./admin-console";
import { loginAction, logoutAction } from "./actions";

/* ── /admin — la console de modération de la démonstration ───────────────────

   Dette #1 de la Mission 2 (B.7) : cette console listait des utilisateurs, des
   biens et des signalements nominatifs et restait **publiquement atteignable**
   en production, parce que le proxy ne redirige que si Supabase est configuré
   (ce qui n'est pas le cas). Elle passe désormais par la **même porte que
   `/admin/leads`** : un mot de passe serveur (`ADMIN_PASSWORD`), vérifié à
   temps constant, cookie de session au chemin `/admin` (donc les deux consoles
   partagent la session).

   Le contenu client — l'ancienne page — vit maintenant dans `admin-console.tsx`
   et n'est rendu qu'après authentification. */

export const dynamic = "force-dynamic";

function LoginScreen({ error, configured }: { error: boolean; configured: boolean }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <h1 className="page-heading text-2xl text-[var(--foreground)]">Accès réservé</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        La console d&apos;administration de la démonstration.
      </p>

      {!configured ? (
        <p className="mt-6 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-4 text-sm text-[var(--warning-text)]">
          Aucun mot de passe n&apos;est configuré. Renseignez la variable
          d&apos;environnement <code className="font-mono">ADMIN_PASSWORD</code> puis rechargez.
        </p>
      ) : (
        <form action={loginAction} className="mt-6 grid gap-3">
          <label htmlFor="password" className="text-sm font-medium text-[var(--foreground)]">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-base text-[var(--foreground)] focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/25"
          />
          {error && (
            <p id="login-error" role="alert" className="text-sm text-[var(--danger)]">
              Accès refusé.
            </p>
          )}
          <button
            type="submit"
            className="mt-1 inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            Entrer
          </button>
        </form>
      )}
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    const { erreur } = await searchParams;
    return <LoginScreen error={erreur === "1"} configured={isAdminConfigured()} />;
  }

  return (
    <>
      <div className="mx-auto flex max-w-7xl items-center justify-end px-4 pt-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--foreground)]"
          >
            <LogOut size={14} aria-hidden />
            Se déconnecter
          </button>
        </form>
      </div>
      <AdminConsole />
    </>
  );
}
