"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Gift, ExternalLink, Clock } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  listPrimedProperties,
  createIntroduction,
  listMyIntroductions,
} from "@/lib/supabase/introduction-actions";
import { apporteurNetChf, type PrimedProperty, type MyIntroduction } from "@/lib/my-property";

/* ── Espace apporteur RÉEL (chantier C5, tranche 2) ──────────────────────────

   La version branchée sur la base, affichée dès qu'un vrai compte est connecté
   (la page garde sa version de démonstration pour le mode anonyme). Deux faits
   RÉELS, aucune traction inventée :
     · les biens à prime active (table `primes`), hors les miens ;
     · mes mises en relation (table `introductions`) et leur statut.

   La marketplace et les abonnements apporteur restent à venir (parqués V1) :
   on le dit, on n'affiche pas de chiffres fictifs. */

const chf = (n: number) => `${Math.round(n).toLocaleString("fr-CH")} CHF`;

const STATUS: Record<MyIntroduction["status"], { label: string; cls: string }> = {
  proposee: { label: "En attente du vendeur", cls: "chip-warning-soft" },
  acceptee: { label: "Acceptée · prime due", cls: "chip-success-soft" },
  refusee: { label: "Refusée · rien dû", cls: "bg-[var(--hover-bg)] text-[var(--text-muted)]" },
  contestee: { label: "Contestée", cls: "bg-[var(--hover-bg)] text-[var(--text-muted)]" },
};

export function ApporteurReal() {
  const { addToast } = useToast();
  const [offers, setOffers] = useState<PrimedProperty[]>([]);
  const [intros, setIntros] = useState<MyIntroduction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = useCallback(
    () =>
      Promise.all([listPrimedProperties(), listMyIntroductions()]).then(([o, i]) => {
        setOffers(o);
        setIntros(i);
        setLoaded(true);
      }),
    [],
  );

  useEffect(() => {
    let active = true;
    Promise.all([listPrimedProperties(), listMyIntroductions()]).then(([o, i]) => {
      if (!active) return;
      setOffers(o);
      setIntros(i);
      setLoaded(true);
    });
    return () => { active = false; };
  }, []);

  const pending = intros.filter((i) => i.status === "proposee").length;
  const accepted = intros.filter((i) => i.status === "acceptee");
  const dueNet = accepted.reduce((s, i) => s + apporteurNetChf(i.amountChf), 0);

  const submit = async (o: PrimedProperty) => {
    if (contact.trim().length < 3 || busy) return;
    setBusy(true);
    const res = await createIntroduction({ primeId: o.primeId, sellerId: o.sellerId, contactLabel: contact.trim() });
    setBusy(false);
    if (!res.ok) {
      addToast("Impossible d'envoyer le contact. Réessayez.", "error");
      return;
    }
    setContact("");
    setOpenId(null);
    addToast("Contact proposé. Le vendeur accepte (prime due) ou refuse (rien dû).", "success");
    void reload();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 animate-fade-in">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">Espace apporteur</p>
        <h1 className="text-2xl page-heading text-[var(--foreground)] sm:text-3xl">
          Recommandez le bon contact, touchez la prime
        </h1>
        <p className="max-w-3xl text-sm text-[var(--text-secondary)]">
          Sur un <strong>bien</strong>, le vendeur offre une prime fixe en francs, payée quand il accepte le contact que
          vous lui amenez — jamais un pourcentage du prix, jamais conditionnée à la vente. Vous ne négociez rien, ne
          représentez personne.
        </p>
      </header>

      {/* Totaux RÉELS, dérivés de mes mises en relation. */}
      <section aria-label="Vos apports" className="grid gap-3 sm:grid-cols-3">
        <StatCard label="En attente" value={String(pending)} hint="contacts proposés" />
        <StatCard label="Acceptées" value={String(accepted.length)} hint="primes dues" />
        <StatCard label="À recevoir (net)" value={chf(dueNet)} hint="après part E-Dome" />
      </section>

      {/* Biens à prime */}
      <section className="space-y-4" aria-label="Biens à prime">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <Building2 size={17} className="text-[var(--primary)]" aria-hidden /> Biens à prime
        </h2>
        {!loaded ? (
          <p className="text-[12.5px] text-[var(--text-muted)]">Chargement…</p>
        ) : offers.length === 0 ? (
          <p className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-[12.5px] text-[var(--text-muted)]">
            Aucun bien à prime pour l&apos;instant. Dès qu&apos;un vendeur attache une prime à son annonce, elle apparaît ici.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {offers.map((o) => {
              const net = apporteurNetChf(o.amountChf);
              const open = openId === o.propertyId;
              return (
                <li key={o.primeId} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.cover} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/explorer/${o.propertyId}`} className="block truncate text-[14px] font-semibold text-[var(--foreground)] hover:underline">
                        {o.title}
                      </Link>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        {o.city} · {o.transactionType === "vente" ? "Vente" : "Location longue durée"} · {o.sellerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold tabular-nums text-[var(--foreground)]">{chf(net)}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">net pour vous · prime {chf(o.amountChf)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setOpenId(open ? null : o.propertyId); setContact(""); }}
                      className="shrink-0 rounded-lg bg-[var(--foreground)] px-3 py-2 text-[12.5px] font-medium text-[var(--background)] hover:opacity-90"
                    >
                      Proposer un contact
                    </button>
                  </div>
                  {open && (
                    <form
                      className="mt-3 flex flex-col gap-2 border-t border-[var(--card-border)] pt-3 sm:flex-row"
                      onSubmit={(e) => { e.preventDefault(); void submit(o); }}
                    >
                      <input
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Qui amenez-vous ? Ex. couple, cherche un 4,5 p. proche des écoles"
                        className="flex-1 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                      />
                      <button
                        type="submit"
                        disabled={contact.trim().length < 3 || busy}
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
                      >
                        Envoyer au vendeur
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Mes mises en relation */}
      <section className="space-y-3" aria-label="Vos mises en relation">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Vos mises en relation</h2>
        {intros.length === 0 ? (
          <p className="text-[12.5px] text-[var(--text-muted)]">Aucune mise en relation pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-[var(--card-border)] rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
            {intros.map((l) => {
              const st = STATUS[l.status];
              const net = apporteurNetChf(l.amountChf);
              return (
                <li key={l.id} className="flex flex-col gap-1 p-3 text-[12.5px] sm:flex-row sm:items-center sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-[var(--foreground)]">{l.propertyTitle}</span>
                    <p className="text-[11.5px] text-[var(--text-muted)]">{l.contactLabel}</p>
                  </div>
                  <span className={`self-start rounded-full px-2 py-0.5 text-[11px] font-medium sm:self-auto ${st.cls}`}>{st.label}</span>
                  <span className="w-24 text-right font-semibold tabular-nums text-[var(--foreground)]">
                    {l.status === "acceptee" ? chf(net) : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Marketplace & abonnements — parqués V1, dits honnêtement. */}
      <section className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <Clock size={15} className="text-[var(--text-muted)]" aria-hidden /> Marketplace & abonnements apportés
        </h2>
        <p className="text-[12.5px] leading-snug text-[var(--text-secondary)]">
          Recommander des formations, événements ou abonnements et toucher un pourcentage : <strong>bientôt</strong>.
          On préfère l&apos;activer pour de vrai plutôt que d&apos;afficher des chiffres d&apos;exemple.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <ShieldCheck size={15} className="text-[var(--primary)]" aria-hidden /> Les règles du programme
        </h2>
        <ul className="space-y-1.5 text-[12.5px] leading-snug text-[var(--text-secondary)]">
          <li>· Aucune intermédiation : vous ne négociez aucun prix, ne signez aucun mandat, ne représentez aucune partie.</li>
          <li>· La prime est fixe, en francs, définie par le vendeur, due à l&apos;acceptation du contact — jamais un % du prix, jamais conditionnée à la vente.</li>
          <li>· E-Dome ne touche jamais l&apos;argent de la transaction : la prime transite par un prestataire de paiement agréé.</li>
        </ul>
        <Link href="/a-propos" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--primary)] hover:underline">
          Comment ça marche <ExternalLink size={12} aria-hidden />
        </Link>
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--foreground)]">{value}</p>
      <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>
    </div>
  );
}
