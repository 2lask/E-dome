import type { Metadata } from "next";
import { Download, LogOut } from "lucide-react";
import { audience, engagementsFor } from "@/content/landing";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/leads/admin-auth";
import { getLeadStore } from "@/lib/leads/store";
import type { StoredLead } from "@/lib/leads/types";
import { loginAction, logoutAction } from "./actions";

/* ── Administration des manifestations d'intérêt ─────────────────────────────

   Page volontairement nue : hors du groupe (app), donc sans barre latérale ni
   bandeau de démonstration. `noindex` et absente du plan du site ; elle n'est
   liée depuis aucune page publique.

   Les filtres passent par la chaîne de requête et un `<form method="get">` :
   aucun JavaScript, l'état est dans l'URL donc partageable et re-jouable, et
   le bouton « retour » du navigateur fonctionne naturellement.

   Les contacts sont chargés une seule fois puis filtrés en mémoire, plutôt
   que de déléguer le filtre au store. Raison : les compteurs du haut doivent
   porter sur la totalité alors que le tableau ne montre que la sélection — un
   filtre en base imposerait deux requêtes et deux vérités possibles. Le
   volume d'une liste d'attente s'y prête ; à revoir au-delà de quelques
   milliers de lignes. */

export const metadata: Metadata = {
  title: "Manifestations d'intérêt · E-Dome",
  robots: { index: false, follow: false, nocache: true },
};

/* La page lit des cookies : rendu à la demande, jamais mis en cache. */
export const dynamic = "force-dynamic";

const PROFILE_LABELS: Record<string, string> = Object.fromEntries(
  audience.profiles.map((p) => [p.id, p.label]),
);

/** Libellés de tous les engagements, les deux jeux confondus. */
const ENGAGEMENT_LABELS: Record<string, string> = Object.fromEntries(
  [...engagementsFor("agence"), ...engagementsFor("equipe")].map((e) => [e.id, e.label]),
);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LoginScreen({ error, configured }: { error: boolean; configured: boolean }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <h1 className="page-heading text-2xl text-[var(--foreground)]">Accès réservé</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Cette page liste les manifestations d&apos;intérêt reçues.
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
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function countBy<T extends string>(values: T[]): [T, number][] {
  const map = new Map<T, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map].sort((a, b) => b[1] - a[1]);
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <LoginScreen error={params.erreur === "1"} configured={isAdminConfigured()} />;
  }

  const one = (key: string): string => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };

  const profileFilter = one("profil");
  const engagementFilter = one("engagement");
  const minScoreRaw = one("score");
  const minScore = minScoreRaw === "" ? null : Number(minScoreRaw);

  let all: StoredLead[] = [];
  let loadError: string | null = null;
  let storeName = "";

  try {
    const store = getLeadStore();
    storeName = store.name;
    all = await store.list();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Lecture impossible.";
  }

  const filtered = all
    .filter((l) => (profileFilter ? l.profile === profileFilter : true))
    .filter((l) => (engagementFilter ? l.engagements.includes(engagementFilter) : true))
    .filter((l) =>
      minScore !== null && Number.isFinite(minScore) ? l.engagementScore >= minScore : true,
    );

  const byProfile = countBy(all.map((l) => l.profile));
  const byEngagement = countBy(all.flatMap((l) => l.engagements));
  const bySource = countBy(all.map((l) => l.utmSource ?? "(direct)"));
  const withReferrer = all.filter((l) => l.referredBy).length;

  const exportQuery = new URLSearchParams();
  if (profileFilter) exportQuery.set("profil", profileFilter);
  if (engagementFilter) exportQuery.set("engagement", engagementFilter);
  if (minScoreRaw) exportQuery.set("score", minScoreRaw);
  const exportHref = `/api/admin/leads/export${exportQuery.size ? `?${exportQuery}` : ""}`;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-heading text-2xl text-[var(--foreground)] sm:text-3xl">
            Manifestations d&apos;intérêt
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Stockage : {storeName}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={exportHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            <Download size={15} strokeWidth={1.9} aria-hidden="true" />
            Export CSV
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)]"
            >
              <LogOut size={15} strokeWidth={1.9} aria-hidden="true" />
              Quitter
            </button>
          </form>
        </div>
      </div>

      {loadError && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]"
        >
          {loadError}
        </p>
      )}

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total" value={all.length} />
        <Stat label="Sélection affichée" value={filtered.length} />
        <Stat label="Venus par parrainage" value={withReferrer} />
        <Stat
          label="Score moyen"
          value={
            all.length === 0
              ? "—"
              : (all.reduce((s, l) => s + l.engagementScore, 0) / all.length).toFixed(1)
          }
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Par profil</h2>
          <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
            {byProfile.length === 0 && <li className="text-[var(--text-muted)]">Aucune donnée.</li>}
            {byProfile.map(([profile, count]) => (
              <li key={profile} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">{PROFILE_LABELS[profile] ?? profile}</span>
                <span className="font-mono">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Par engagement</h2>
          <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
            {byEngagement.length === 0 && (
              <li className="text-[var(--text-muted)]">Aucune donnée.</li>
            )}
            {byEngagement.map(([id, count]) => (
              <li key={id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">{ENGAGEMENT_LABELS[id] ?? id}</span>
                <span className="font-mono">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Sources</h2>
          <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
            {bySource.length === 0 && <li className="text-[var(--text-muted)]">Aucune donnée.</li>}
            {bySource.slice(0, 8).map(([source, count]) => (
              <li key={source} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">{source}</span>
                <span className="font-mono">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <form
        method="get"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <div>
          <label htmlFor="filter-profile" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Profil
          </label>
          <select
            id="filter-profile"
            name="profil"
            defaultValue={profileFilter}
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]"
          >
            <option value="">Tous</option>
            {audience.profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-engagement" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Engagement
          </label>
          <select
            id="filter-engagement"
            name="engagement"
            defaultValue={engagementFilter}
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]"
          >
            <option value="">Tous</option>
            {Object.entries(ENGAGEMENT_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-score" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Score minimum
          </label>
          <input
            id="filter-score"
            name="score"
            type="number"
            min={0}
            inputMode="numeric"
            defaultValue={minScoreRaw}
            className="min-h-11 w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-lg bg-[var(--primary)] px-5 text-sm font-medium text-[var(--primary-foreground)]"
        >
          Filtrer
        </button>
        <a
          href="/admin/leads"
          className="inline-flex min-h-11 items-center px-3 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)]"
        >
          Réinitialiser
        </a>
      </form>

      {/* overflow-x-auto : le tableau est large, il doit pouvoir defiler
          horizontalement sur mobile au lieu d'etre tronque. */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[var(--muted)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
            <tr>
              <th scope="col" className="px-3 py-3 font-semibold">Date</th>
              <th scope="col" className="px-3 py-3 font-semibold">Prénom</th>
              <th scope="col" className="px-3 py-3 font-semibold">E-mail</th>
              <th scope="col" className="px-3 py-3 font-semibold">Profil</th>
              <th scope="col" className="px-3 py-3 font-semibold">Canton</th>
              <th scope="col" className="px-3 py-3 font-semibold">Score</th>
              <th scope="col" className="px-3 py-3 font-semibold">Engagements</th>
              <th scope="col" className="px-3 py-3 font-semibold">Source</th>
              <th scope="col" className="px-3 py-3 font-semibold">Parrain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-[var(--text-muted)]">
                  Aucune manifestation d&apos;intérêt ne correspond.
                </td>
              </tr>
            )}
            {filtered.map((lead) => (
              <tr key={lead.id} className="align-top text-[var(--text-secondary)]">
                <td className="whitespace-nowrap px-3 py-3 font-mono text-xs">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-3 py-3 text-[var(--foreground)]">{lead.firstName}</td>
                <td className="px-3 py-3">
                  <a href={`mailto:${lead.email}`} className="underline underline-offset-2">
                    {lead.email}
                  </a>
                </td>
                <td className="px-3 py-3">{PROFILE_LABELS[lead.profile] ?? lead.profile}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {lead.canton}
                  {lead.country ? ` · ${lead.country}` : ""}
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex min-w-7 justify-center rounded-md bg-[var(--muted)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--foreground)]">
                    {lead.engagementScore}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {lead.engagements.length === 0 ? (
                    <span className="text-[var(--text-muted)]">—</span>
                  ) : (
                    <ul className="space-y-0.5 text-xs">
                      {lead.engagements.map((id) => (
                        <li key={id}>{ENGAGEMENT_LABELS[id] ?? id}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-3 py-3 text-xs">
                  {lead.utmSource ?? <span className="text-[var(--text-muted)]">direct</span>}
                  {lead.utmCampaign ? ` · ${lead.utmCampaign}` : ""}
                </td>
                <td className="px-3 py-3 font-mono text-xs">
                  {lead.referredBy ?? <span className="text-[var(--text-muted)]">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-[var(--text-muted)]">
        Les réponses détaillées de chaque profil ne sont pas affichées ici pour garder le tableau
        lisible : elles figurent dans l&apos;export CSV, colonne par question.
      </p>
    </main>
  );
}
