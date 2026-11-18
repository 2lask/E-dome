"use client";

import { useCallback, useEffect, useState } from "react";
import { formatNumber } from "@/lib/format";
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

const chf = (n: number) => `${formatNumber(n)} CHF`;

const EMPTY_FORM = { label: "", name: "", email: "", phone: "", consent: false };
const FIELD =
  "w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--leman)]";

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
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof EMPTY_FORM, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const formValid =
    form.label.trim().length >= 10 &&
    form.name.trim().length >= 2 &&
    (form.email.trim() || form.phone.trim()) &&
    form.consent;

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
      /* Venu d'une fiche bien (« Recommander quelqu'un ») : on ouvre
         directement le formulaire de ce bien. */
      const bien = new URLSearchParams(window.location.search).get("bien");
      if (bien && o.some((x) => x.propertyId === bien)) {
        setOpenId(bien);
        requestAnimationFrame(() =>
          document.getElementById(`offer-${bien}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
        );
      }
    });
    return () => { active = false; };
  }, []);

  const pending = intros.filter((i) => i.status === "proposee").length;
  const accepted = intros.filter((i) => i.status === "acceptee");
  const dueNet = accepted.reduce((s, i) => s + apporteurNetChf(i.amountChf), 0);

  const submit = async (o: PrimedProperty) => {
    if (!formValid || busy) return;
    setBusy(true);
    setFormError("");
    const res = await createIntroduction({
      primeId: o.primeId,
      sellerId: o.sellerId,
      contactLabel: form.label,
      contactName: form.name,
      contactEmail: form.email,
      contactPhone: form.phone,
      consent: form.consent,
    });
    setBusy(false);
    if (!res.ok) {
      setFormError(res.error ?? "Impossible d'envoyer le contact. Réessayez.");
      return;
    }
    setForm(EMPTY_FORM);
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
                <li key={o.primeId} id={`offer-${o.propertyId}`} className="scroll-mt-24 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5">
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
                      onClick={() => { setOpenId(open ? null : o.propertyId); setForm(EMPTY_FORM); setFormError(""); }}
                      className="shrink-0 rounded-lg bg-[var(--foreground)] px-3 py-2 text-[12.5px] font-medium text-[var(--background)] hover:opacity-90"
                    >
                      Proposer un contact
                    </button>
                  </div>
                  {open && (
                    <form
                      className="mt-3 space-y-3 border-t border-[var(--card-border)] pt-3"
                      onSubmit={(e) => { e.preventDefault(); void submit(o); }}
                    >
                      <div>
                        <label className="mb-1 block text-[12px] font-medium" htmlFor={`label-${o.primeId}`}>
                          Son besoin <span className="font-normal text-[var(--text-muted)]">— ce que le vendeur voit avant d&apos;accepter</span>
                        </label>
                        <textarea
                          id={`label-${o.primeId}`}
                          value={form.label}
                          onChange={(e) => set("label", e.target.value)}
                          rows={2}
                          placeholder="Ex. couple avec deux enfants, cherche un 4,5 p. proche des écoles, budget validé, achat d'ici 6 mois"
                          className={FIELD}
                        />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nom du contact" aria-label="Nom du contact" className={FIELD} />
                        <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="E-mail" type="email" aria-label="E-mail du contact" className={FIELD} />
                        <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Téléphone" type="tel" aria-label="Téléphone du contact" className={FIELD} />
                      </div>
                      <p className="text-[11.5px] text-[var(--text-muted)]">
                        Les coordonnées ne sont révélées au vendeur qu&apos;<strong>après</strong> qu&apos;il a accepté — et donc que la prime est due.
                      </p>
                      <label className="flex items-start gap-2 text-[12.5px]">
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={(e) => set("consent", e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[var(--leman)]"
                        />
                        <span>Cette personne m&apos;a autorisé à transmettre ses coordonnées au vendeur de ce bien.</span>
                      </label>
                      {formError && <p role="alert" className="text-[12.5px] text-[var(--danger-text)]">{formError}</p>}
                      <button
                        type="submit"
                        disabled={!formValid || busy}
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-[13px] font-medium text-[var(--primary-foreground)] disabled:opacity-45"
                      >
                        {busy ? "Envoi…" : "Envoyer au vendeur"}
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
