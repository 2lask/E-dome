import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { apporteurNetChf } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Traction", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/* ── /admin/traction — les chiffres RÉELS de la plateforme ───────────────────
   Pour piloter, et pour répondre à un incubateur ou un investisseur avec des
   données vérifiables plutôt que des promesses. Tout est lu en base (clé de
   service, côté serveur). Accès : adresses listées dans EDOME_ADMIN_EMAILS
   (séparées par des virgules) — rien n'est écrit en dur dans le code.

   « Revenu théorique » : la part d'E-Dome sur les primes et récompenses
   ACCEPTÉES. Il n'est pas encore encaissé (versement intégré à venir). */

type Count = number | null;

/* L'horloge, lue une fois par requête (composant serveur dynamique). */
function clock() {
  const now = Date.now();
  return { now, since7: new Date(now - 7 * 86400000).toISOString(), since56: new Date(now - 56 * 86400000).toISOString() };
}

export default async function TractionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Fadmin%2Ftraction");
  const allowed = (process.env.EDOME_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!user.email || !allowed.includes(user.email.toLowerCase())) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="text-[20px] font-semibold">Accès réservé</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Ajoutez votre e-mail à la variable <code className="rounded bg-subtle px-1">EDOME_ADMIN_EMAILS</code> (Vercel et .env.local).
        </p>
      </div>
    );
  }
  const admin = createAdminClient();
  if (!admin) return <p className="text-muted-foreground">Clé de service absente.</p>;

  const { now, since7, since56 } = clock();
  const db = admin;
  const count = async (table: string, since?: string): Promise<Count> => {
    const base = db.from(table).select("*", { count: "exact", head: true });
    const { count: c, error } = await (since ? base.gte("created_at", since) : base);
    /* Table absente : pas d'erreur mais un compte vide — on affiche « — ». */
    return error || c === null ? null : c;
  };

  const [
    users, users7, props, primes, searches, inquiries, inquiries7, introsAcc, introsAll, answersAcc, answersAll, dossiers,
  ] = await Promise.all([
    count("profiles"),
    count("profiles", since7),
    admin.from("properties").select("transaction_type, city, analytics, sold_to"),
    admin.from("primes").select("amount_chf").eq("active", true),
    admin.from("searches").select("kind, city, reward_chf").eq("active", true),
    count("inquiries"),
    count("inquiries", since7),
    admin.from("introductions").select("amount_chf").eq("status", "acceptee"),
    count("introductions"),
    admin.from("search_answers").select("reward_chf").eq("status", "acceptee"),
    count("search_answers"),
    count("rental_dossiers"),
  ]);
  const signups = await admin.from("profiles").select("created_at").gte("created_at", since56);

  const P = (props.data ?? []) as { transaction_type: string; city: string; analytics: Record<string, unknown> | null; sold_to: string | null }[];
  const online = P.filter((p) => !p.sold_to);
  const reprises = online.filter((p) => p.transaction_type === "location-lt" && p.analytics?.reprise === true).length;
  const ventes = online.filter((p) => p.transaction_type === "vente").length;
  const locations = online.filter((p) => p.transaction_type === "location-lt").length - reprises;
  const primeSum = ((primes.data ?? []) as { amount_chf: number }[]).reduce((s, x) => s + Number(x.amount_chf), 0);
  const S = (searches.data ?? []) as { kind: string; city: string; reward_chf: number }[];
  const rewardSum = S.reduce((s, x) => s + Number(x.reward_chf), 0);
  const accepted = [
    ...((introsAcc.data ?? []) as { amount_chf: number | null }[]).map((x) => Number(x.amount_chf ?? 0)),
    ...((answersAcc.data ?? []) as { reward_chf: number | null }[]).map((x) => Number(x.reward_chf ?? 0)),
  ];
  const acceptedGross = accepted.reduce((s, a) => s + a, 0);
  const edomeRevenue = accepted.reduce((s, a) => s + (a - apporteurNetChf(a)), 0);

  /* Villes : annonces + recherches. */
  const cityMap = new Map<string, { biens: number; recherches: number }>();
  for (const p of online) { const c = p.city.trim() || "—"; cityMap.set(c, { biens: (cityMap.get(c)?.biens ?? 0) + 1, recherches: cityMap.get(c)?.recherches ?? 0 }); }
  for (const s of S) { const c = s.city.trim() || "—"; cityMap.set(c, { biens: cityMap.get(c)?.biens ?? 0, recherches: (cityMap.get(c)?.recherches ?? 0) + 1 }); }
  const cities = [...cityMap.entries()].sort((a, b) => b[1].biens + b[1].recherches - (a[1].biens + a[1].recherches)).slice(0, 8);

  /* Inscriptions des 8 dernières semaines. */
  const weeks = Array.from({ length: 8 }, (_, i) => ({ start: now - (8 - i) * 7 * 86400000, n: 0 }));
  for (const r of (signups.data ?? []) as { created_at: string }[]) {
    const t = new Date(r.created_at).getTime();
    const w = weeks.findIndex((x) => t >= x.start && t < x.start + 7 * 86400000);
    if (w >= 0) weeks[w].n += 1;
  }
  const maxW = Math.max(1, ...weeks.map((w) => w.n));
  const fmt = (c: Count) => (c === null ? "—" : formatNumber(c));

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Pilotage</p>
      <h1 className="page-heading mt-1.5 text-[30px]">Traction</h1>
      <p className="mt-1 text-[14px] text-muted-foreground">Chiffres réels, lus en base à l&apos;instant. « — » : table pas encore créée (migration à appliquer).</p>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Comptes" value={fmt(users)} sub={`+${fmt(users7)} sur 7 jours`} />
        <Kpi label="Annonces en ligne" value={formatNumber(online.length)} sub={`${ventes} ventes · ${locations} locations · ${reprises} reprises`} />
        <Kpi label="Recherches à récompense" value={formatNumber(S.length)} sub={`${formatNumber(rewardSum)} CHF offerts`} prime />
        <Kpi label="Primes actives" value={formatNumber(primes.data?.length ?? 0)} sub={`${formatNumber(primeSum)} CHF offerts`} prime />
        <Kpi label="Demandes reçues" value={fmt(inquiries)} sub={`+${fmt(inquiries7)} sur 7 jours`} />
        <Kpi label="Mises en relation" value={fmt(introsAll)} sub={`${introsAcc.data?.length ?? 0} acceptées`} />
        <Kpi label="Propositions aux recherches" value={fmt(answersAll)} sub={`${answersAcc.data?.length ?? 0} acceptées`} />
        <Kpi label="Dossiers de location" value={fmt(dossiers)} sub="remplis par des locataires" />
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-laiton-border bg-laiton-soft/50 p-5">
          <p className="text-[13px] text-laiton">Primes et récompenses acceptées (volume)</p>
          <p className="mt-1 text-[28px] font-semibold tabular-nums text-laiton">{formatNumber(acceptedGross)} CHF</p>
          <p className="text-[12.5px] text-muted-foreground">Revenu théorique E-Dome : <strong className="text-foreground">{formatNumber(Math.round(edomeRevenue))} CHF</strong> (12 %, min. 3 CHF — pas encore encaissé)</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-[13px] text-muted-foreground">Inscriptions par semaine (8 semaines)</p>
          <div className="mt-3 flex h-24 items-end gap-2" role="img" aria-label={`Inscriptions hebdomadaires : ${weeks.map((w) => w.n).join(", ")}`}>
            {weeks.map((w, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] tabular-nums text-muted-foreground">{w.n}</span>
                <div className="w-full rounded-t-md bg-leman" style={{ height: `${Math.max(4, (w.n / maxW) * 72)}px`, opacity: i === 7 ? 1 : 0.55 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card">
        <p className="border-b px-5 py-3 text-[14px] font-semibold">Villes</p>
        {cities.length === 0 ? (
          <p className="px-5 py-6 text-[13px] text-muted-foreground">Pas encore de contenu.</p>
        ) : (
          <table className="w-full text-[13.5px]">
            <thead><tr className="text-left text-muted-foreground"><th className="px-5 py-2 font-medium">Ville</th><th className="px-5 py-2 text-right font-medium">Annonces</th><th className="px-5 py-2 text-right font-medium">Recherches</th></tr></thead>
            <tbody>
              {cities.map(([c, v]) => (
                <tr key={c} className="border-t"><td className="px-5 py-2.5">{c}</td><td className="px-5 py-2.5 text-right tabular-nums">{v.biens}</td><td className="px-5 py-2.5 text-right tabular-nums">{v.recherches}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, prime = false }: { label: string; value: string; sub: string; prime?: boolean }) {
  return (
    <div className={prime ? "rounded-2xl border border-laiton-border bg-laiton-soft/40 p-4" : "rounded-2xl border bg-card p-4"}>
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className={prime ? "mt-1 text-[24px] font-semibold tabular-nums text-laiton" : "mt-1 text-[24px] font-semibold tabular-nums"}>{value}</p>
      <p className="text-[11.5px] text-muted-foreground">{sub}</p>
    </div>
  );
}
