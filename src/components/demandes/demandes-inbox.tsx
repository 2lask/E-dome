"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { formatNumber } from "@/lib/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox, ArrowLeft, Mail, Phone, CalendarDays, Coins, Check, X, Plus,
  MessageSquareText, CircleDot, StickyNote, Building2, UserCheck, Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  KIND_LABEL, STATUS_FLOW, STATUS_LABEL, isOpen, relativeFr,
  type Demande, type DemandeEvent, type DemandeStatus, type PendingIntroduction,
} from "@/lib/demandes";
import {
  addDemandeNote, decideIntroduction, listDemandeEvents, setDemandeStatus,
} from "@/lib/supabase/demande-actions";
import { apporteurNetChf } from "@/lib/my-property";
import { AnswersInbox } from "@/components/demandes/answers-inbox";
import type { SearchAnswer } from "@/lib/recherches";
import { cn } from "@/lib/utils";

/* ── La boîte des demandes (REBUILD.md §3.4) ─────────────────────────────────

   Deux temps, dans l'ordre de l'urgence :
     1. « À décider » — les mises en relation proposées par des apporteurs.
        Accepter = la prime (fixe, figée) est due et les coordonnées
        apparaissent ; refuser = rien n'est dû.
     2. La boîte — liste + détail (Front, Linear Inbox) : le message, les
        coordonnées, le pipeline, les notes, l'historique horodaté.
   Aucun chiffre inventé : tout vient de la base. */

const chf = (n: number) => `${formatNumber(n)} CHF`;

type Filter = "ouvertes" | "toutes" | "closes";

export function DemandesInbox({
  demandes,
  pending,
  ready,
  answers = [],
}: {
  demandes: Demande[];
  pending: PendingIntroduction[];
  ready: boolean;
  /** Propositions reçues sur mes recherches à récompense. */
  answers?: SearchAnswer[];
}) {
  const [filter, setFilter] = useState<Filter>("ouvertes");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      demandes.filter((d) =>
        filter === "toutes" ? true : filter === "ouvertes" ? isOpen(d.status) : !isOpen(d.status),
      ),
    [demandes, filter],
  );
  const counts = useMemo(
    () => ({
      ouvertes: demandes.filter((d) => isOpen(d.status)).length,
      closes: demandes.filter((d) => !isOpen(d.status)).length,
      toutes: demandes.length,
    }),
    [demandes],
  );
  /* Sélection : celle choisie si elle est visible, sinon la première (bureau). */
  const selected = visible.find((d) => d.id === selectedId) ?? null;
  const desktopSelected = selected ?? visible[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-heading text-[28px]">Demandes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tout ce qui arrive sur vos biens : contacts, demandes de visite, mises en relation.
          </p>
        </div>
      </header>

      {!ready && <MigrationNotice />}

      {pending.length > 0 && <PendingSection pending={pending} />}

      <AnswersInbox answers={answers} />

      {demandes.length === 0 && ready ? (
        <EmptyInbox hasPending={pending.length > 0 || answers.length > 0} />
      ) : demandes.length > 0 ? (
        <section aria-label="Boîte des demandes" className="overflow-hidden rounded-2xl border bg-card shadow-xs">
          <div className="flex items-center gap-1 border-b px-3 py-2">
            {(["ouvertes", "toutes", "closes"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => { setFilter(f); setSelectedId(null); }}
                aria-pressed={filter === f}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px]",
                  filter === f ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f === "ouvertes" ? "Ouvertes" : f === "toutes" ? "Toutes" : "Closes"}
                <span className="tabular-nums text-[11.5px] text-muted-foreground">{counts[f]}</span>
              </button>
            ))}
          </div>

          <div className="md:grid md:min-h-[520px] md:grid-cols-[340px_1fr]">
            {/* Liste — sur mobile, masquée quand une demande est ouverte. */}
            <ul className={cn("divide-y md:border-r", selected && "hidden md:block")}>
              {visible.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">Rien ici.</li>
              ) : (
                visible.map((d) => (
                  <li key={d.id}>
                    <DemandeRow
                      d={d}
                      active={desktopSelected?.id === d.id}
                      onClick={() => setSelectedId(d.id)}
                    />
                  </li>
                ))
              )}
            </ul>

            {/* Détail */}
            <div className={cn(!selected && "hidden md:block")}>
              {desktopSelected ? (
                <DemandeDetail
                  key={desktopSelected.id}
                  d={desktopSelected}
                  onBack={() => setSelectedId(null)}
                />
              ) : (
                <div className="hidden h-full items-center justify-center p-10 text-sm text-muted-foreground md:flex">
                  Sélectionnez une demande.
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/* ── À décider ──────────────────────────────────────────────────────────── */

function PendingSection({ pending }: { pending: PendingIntroduction[] }) {
  return (
    <section aria-label="Mises en relation à décider" className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[15px] font-semibold">À décider</h2>
        <span className="chip-prime rounded-full px-2 py-0.5 text-[11.5px] font-medium tabular-nums">{pending.length}</span>
      </div>
      <ul className="grid gap-3 lg:grid-cols-2">
        {pending.map((p) => (
          <li key={p.id}>
            <PendingCard p={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PendingCard({ p }: { p: PendingIntroduction }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const decide = (decision: "acceptee" | "refusee") =>
    startTransition(async () => {
      const res = await decideIntroduction(p.id, decision);
      if (!res.ok) { addToast(res.error, "error"); return; }
      addToast(
        decision === "acceptee"
          ? `Accepté. La prime de ${chf(p.amountChf)} est due ; le contact est dans votre boîte.`
          : "Refusé. Rien n'est dû.",
        decision === "acceptee" ? "success" : "info",
      );
      router.refresh();
    });

  return (
    <article className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-xs">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.property.cover} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-muted-foreground">
            <span className="font-medium text-foreground">{p.apporteurName}</span> vous propose un contact
          </p>
          <Link href={`/explorer/${p.property.id}`} className="block truncate text-[14px] font-semibold hover:underline">
            {p.property.title}
          </Link>
        </div>
        <span className="chip-prime shrink-0 rounded-lg px-2 py-1 text-[12.5px] font-semibold tabular-nums">
          {chf(p.amountChf)}
        </span>
      </div>

      <blockquote className="mt-3 rounded-xl bg-subtle px-3 py-2.5 text-[13.5px] leading-snug">
        {p.contactLabel}
      </blockquote>
      <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
        Coordonnées révélées si vous acceptez. La prime est fixe : due à l&apos;acceptation, quelle que soit
        l&apos;issue — jamais un pourcentage du prix. {relativeFr(p.createdAt)}.
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {confirming ? (
          <>
            <Button variant="prime" size="sm" disabled={isPending} onClick={() => decide("acceptee")}>
              <Check className="h-4 w-4" aria-hidden />
              Confirmer · je dois {chf(p.amountChf)}
            </Button>
            <Button variant="ghost" size="sm" disabled={isPending} onClick={() => setConfirming(false)}>
              Annuler
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" disabled={isPending} onClick={() => setConfirming(true)}>
              <UserCheck className="h-4 w-4" aria-hidden />
              Accepter le contact
            </Button>
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => decide("refusee")}>
              <X className="h-4 w-4" aria-hidden />
              Refuser · rien dû
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

/* ── Liste ──────────────────────────────────────────────────────────────── */

function KindIcon({ kind, className }: { kind: Demande["kind"]; className?: string }) {
  const Icon = kind === "visite" ? CalendarDays : kind === "apport" ? Coins : MessageSquareText;
  return <Icon className={className} aria-hidden />;
}

function DemandeRow({ d, active, onClick }: { d: Demande; active: boolean; onClick: () => void }) {
  const fresh = d.status === "nouvelle";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex w-full gap-3 px-4 py-3 text-left",
        active ? "bg-accent" : "hover:bg-accent/60",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background",
          d.kind === "apport" && "border-laiton-border bg-laiton-soft text-laiton",
        )}
      >
        <KindIcon kind={d.kind} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("truncate text-[13.5px]", fresh ? "font-semibold" : "font-medium")}>{d.sender.name}</span>
          {fresh && <span className="h-2 w-2 shrink-0 rounded-full bg-leman" aria-label="Nouvelle" />}
          <span className="ml-auto shrink-0 text-[11.5px] text-muted-foreground">{relativeFr(d.createdAt)}</span>
        </span>
        <span className="block truncate text-[12.5px] text-muted-foreground">
          {KIND_LABEL[d.kind]} · {d.property.title}
        </span>
        {d.message && <span className="mt-0.5 block truncate text-[12.5px] text-foreground/80">{d.message}</span>}
      </span>
    </button>
  );
}

/* ── Détail ─────────────────────────────────────────────────────────────── */

function DemandeDetail({ d, onBack }: { d: Demande; onBack: () => void }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [events, setEvents] = useState<DemandeEvent[] | null>(null);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    listDemandeEvents(d.id).then((e) => { if (alive) setEvents(e); });
    return () => { alive = false; };
  }, [d.id, d.status]);

  const move = (status: DemandeStatus) =>
    startTransition(async () => {
      const res = await setDemandeStatus(d.id, status);
      if (!res.ok) { addToast(res.error, "error"); return; }
      router.refresh();
    });

  const saveNote = () =>
    startTransition(async () => {
      const res = await addDemandeNote(d.id, note);
      if (!res.ok) { addToast(res.error, "error"); return; }
      setNote("");
      setEvents(await listDemandeEvents(d.id));
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3 md:hidden">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Toutes les demandes
        </button>
      </div>

      <div className="space-y-5 p-5">
        {/* Qui */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">{KIND_LABEL[d.kind]}</p>
            <h2 className="mt-1 text-[19px] font-semibold tracking-[-0.015em]">{d.sender.name}</h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
              {d.sender.email && (
                <a href={`mailto:${d.sender.email}?subject=${encodeURIComponent(d.property.title)}`} className="inline-flex items-center gap-1.5 text-leman hover:underline">
                  <Mail className="h-3.5 w-3.5" aria-hidden /> {d.sender.email}
                </a>
              )}
              {d.sender.phone && (
                <a href={`tel:${d.sender.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-leman hover:underline">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> {d.sender.phone}
                </a>
              )}
            </div>
          </div>
          <Link
            href={`/explorer/${d.property.id}`}
            className="flex max-w-full items-center gap-2.5 rounded-xl border bg-background p-1.5 pr-3 hover:border-foreground/20"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.property.cover} alt="" className="h-9 w-12 shrink-0 rounded-lg object-cover" />
            <span className="min-w-0">
              <span className="block max-w-[220px] truncate text-[13px] font-medium">{d.property.title}</span>
              <span className="block text-[11.5px] text-muted-foreground">{d.property.city}</span>
            </span>
          </Link>
        </div>

        {/* Apport */}
        {d.introduction && (
          <div className="flex items-start gap-2.5 rounded-xl border border-laiton-border bg-laiton-soft/60 px-3.5 py-3 text-[13px]">
            <Coins className="mt-0.5 h-4 w-4 shrink-0 text-laiton" aria-hidden />
            <p>
              Apporté par <strong>{d.introduction.apporteurName}</strong>. Prime de{" "}
              <strong className="tabular-nums">{chf(d.introduction.amountChf)}</strong> due (acceptée) —
              l&apos;apporteur en touche {chf(apporteurNetChf(d.introduction.amountChf))} net.
            </p>
          </div>
        )}

        {/* Le message */}
        <div className="space-y-2">
          {d.preferredDate && (
            <p className="inline-flex items-center gap-1.5 rounded-lg bg-leman-soft px-2.5 py-1 text-[12.5px] font-medium text-leman">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              Visite souhaitée le {new Date(d.preferredDate).toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          )}
          <p className="whitespace-pre-line rounded-xl bg-subtle px-4 py-3 text-[14px] leading-relaxed">
            {d.message || <span className="text-muted-foreground">Pas de message.</span>}
          </p>
        </div>

        {/* Pipeline */}
        <div>
          <p className="eyebrow mb-2">Avancement</p>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Statut de la demande">
            {STATUS_FLOW.map((s) => (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={d.status === s.value}
                disabled={isPending}
                onClick={() => d.status !== s.value && move(s.value)}
                className={cn(
                  "h-8 rounded-full border px-3 text-[12.5px]",
                  d.status === s.value
                    ? "border-leman bg-leman-soft font-medium text-leman"
                    : "bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                )}
              >
                {s.short}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor={`note-${d.id}`} className="eyebrow mb-2 block">Note privée</label>
          <div className="flex gap-2">
            <input
              id={`note-${d.id}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && note.trim()) saveNote(); }}
              placeholder="Rappeler jeudi, budget confirmé…"
              className="h-9 flex-1 rounded-lg border border-input bg-card px-3 text-[13px] outline-none focus:border-leman"
            />
            <Button variant="outline" size="sm" disabled={!note.trim() || isPending} onClick={saveNote}>
              <Plus className="h-4 w-4" aria-hidden /> Ajouter
            </Button>
          </div>
        </div>

        {/* Historique */}
        <div>
          <p className="eyebrow mb-2">Historique</p>
          {events === null ? (
            <p className="text-[12.5px] text-muted-foreground">Chargement…</p>
          ) : (
            <ol className="relative space-y-3 border-l pl-4">
              {events.map((e) => (
                <li key={e.id} className="relative text-[12.5px]">
                  <span className="absolute -left-[21px] top-0.5 flex h-2.5 w-2.5 rounded-full border-2 border-card bg-muted-foreground/50" />
                  <EventLine e={e} />
                  <span className="block text-[11.5px] text-muted-foreground">
                    {new Date(e.createdAt).toLocaleString("fr-CH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-3 text-[11.5px] text-muted-foreground">
            Horodaté et conservé : la trace de qui a amené qui, et quand.
          </p>
        </div>
      </div>
    </div>
  );
}

function EventLine({ e }: { e: DemandeEvent }) {
  if (e.kind === "creee") {
    const kind = String(e.data.kind ?? "contact");
    return (
      <span className="inline-flex items-center gap-1.5">
        <CircleDot className="h-3.5 w-3.5 text-leman" aria-hidden />
        {kind === "apport" ? "Mise en relation acceptée — demande créée" : kind === "visite" ? "Demande de visite reçue" : "Message reçu"}
      </span>
    );
  }
  if (e.kind === "statut") {
    const to = String(e.data.to ?? "") as DemandeStatus;
    return <span>Statut : <strong>{STATUS_LABEL[to] ?? to}</strong>{e.actorName ? ` · ${e.actorName}` : ""}</span>;
  }
  return (
    <span className="inline-flex items-start gap-1.5">
      <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="whitespace-pre-line">{String(e.data.text ?? "")}</span>
    </span>
  );
}

/* ── États ──────────────────────────────────────────────────────────────── */

function EmptyInbox({ hasPending }: { hasPending: boolean }) {
  if (hasPending) return null;
  return (
    <section className="rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-subtle">
        <Inbox className="h-5 w-5 text-muted-foreground" aria-hidden />
      </span>
      <h2 className="mt-4 text-[16px] font-semibold">Aucune demande pour l&apos;instant</h2>
      <p className="mx-auto mt-1.5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
        Les demandes arrivent ici quand quelqu&apos;un écrit ou demande une visite sur l&apos;un de vos biens. Ajoutez
        une prime : les apporteurs vous amèneront des contacts qualifiés.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/publier"><Plus className="h-4 w-4" aria-hidden /> Publier un bien</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/mes-biens"><Building2 className="h-4 w-4" aria-hidden /> Mes biens et primes</Link>
        </Button>
      </div>
    </section>
  );
}

function MigrationNotice() {
  return (
    <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border bg-card p-4 text-[13px]">
      <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <p>
        <strong>Base à mettre à jour.</strong> La boîte des demandes attend la migration{" "}
        <code className="rounded bg-subtle px-1">supabase/migrations/002_demandes.sql</code> (Supabase → SQL Editor → Run).
      </p>
    </div>
  );
}
