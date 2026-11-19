import Link from "next/link";
import { formatNumber } from "@/lib/format";
import {
  ArrowRight, Coins, Inbox, ImageOff, Gift, Check, Circle, Plus, Compass, Building2, UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopilotButton } from "@/components/home/copilot-button";
import { apporteurNetChf, primeEligible, type MyIntroduction, type MyPrime, type MyProperty } from "@/lib/my-property";
import type { Demande, PendingIntroduction } from "@/lib/demandes";
import type { SessionUser } from "@/lib/session-user";
import { cn } from "@/lib/utils";

/* ── Accueil MEMBRE : « ce qui demande votre attention » (REBUILD.md §3.2) ───

   Inspiré de l'Inbox de Linear et des checklists d'activation de Stripe et
   Shopify : l'accueil n'est pas une vitrine, c'est la liste de ce qu'il y a à
   faire maintenant, puis l'état réel du compte. Tout est calculé à partir de
   la base — un compte neuf voit des zéros et un chemin pour démarrer. */

const chf = (n: number) => `${formatNumber(n)} CHF`;

interface Todo {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
  prime?: boolean;
}

export function MemberHome({
  user,
  biens,
  primes,
  demandes,
  pending,
  intros,
  pendingAnswers = 0,
  settlementTodos = 0,
}: {
  user: SessionUser;
  biens: MyProperty[];
  primes: MyPrime[];
  demandes: Demande[];
  pending: PendingIntroduction[];
  intros: MyIntroduction[];
  /** Propositions en attente sur mes recherches à récompense. */
  pendingAnswers?: number;
  /** Règlements à payer ou à confirmer. */
  settlementTodos?: number;
}) {
  const activePrimes = primes.filter((p) => p.active);
  const primed = new Set(activePrimes.map((p) => p.propertyId));
  const online = biens.filter((b) => !b.soldTo);
  const newDemandes = demandes.filter((d) => d.status === "nouvelle");
  const openDemandes = demandes.filter((d) => d.status !== "conclue" && d.status !== "fermee");
  const noPhoto = online.filter((b) => b.images.length === 0);
  const unprimed = online.filter((b) => primeEligible(b.transactionType) && !primed.has(b.id));
  const accepted = intros.filter((i) => i.status === "acceptee");
  const dueNet = accepted.reduce((s, i) => s + apporteurNetChf(i.amountChf), 0);

  /* ── À faire, par ordre d'urgence ─────────────────────────────────────── */
  const todos: Todo[] = [];
  if (pending.length > 0)
    todos.push({
      key: "decide", href: "/demandes", icon: Coins, prime: true,
      title: `${pending.length} mise${pending.length > 1 ? "s" : ""} en relation à décider`,
      hint: "Un apporteur vous présente un contact. Accepter rend la prime due ; refuser ne coûte rien.",
    });
  if (settlementTodos > 0)
    todos.push({
      key: "settle", href: "/reglements", icon: Coins, prime: true,
      title: `${settlementTodos} règlement${settlementTodos > 1 ? "s" : ""} à traiter`,
      hint: "Une prime acceptée à verser, ou un paiement reçu à confirmer.",
    });
  if (pendingAnswers > 0)
    todos.push({
      key: "answers", href: "/demandes", icon: Coins, prime: true,
      title: `${pendingAnswers} proposition${pendingAnswers > 1 ? "s" : ""} sur vos recherches`,
      hint: "Quelqu'un pense avoir trouvé ce que vous cherchez. Accepter rend la récompense due ; refuser ne coûte rien.",
    });
  if (newDemandes.length > 0)
    todos.push({
      key: "new", href: "/demandes", icon: Inbox,
      title: `${newDemandes.length} nouvelle${newDemandes.length > 1 ? "s" : ""} demande${newDemandes.length > 1 ? "s" : ""}`,
      hint: "Répondre vite fait la différence : la plupart des acheteurs contactent plusieurs vendeurs.",
    });
  for (const b of noPhoto.slice(0, 2))
    todos.push({
      key: `photo-${b.id}`, href: "/mes-biens", icon: ImageOff,
      title: `« ${b.title} » n'a pas de photo`,
      hint: "Une annonce sans photo est rarement ouverte. Ajoutez-en au moins trois.",
    });
  for (const b of unprimed.slice(0, 2))
    todos.push({
      key: `prime-${b.id}`, href: "/mes-biens", icon: Gift, prime: true,
      title: `Ajoutez une prime à « ${b.title} »`,
      hint: "Les apporteurs ne recommandent que les biens à prime. Vous ne payez que si vous acceptez un contact.",
    });

  /* ── Bien démarrer (checklist d'activation) ───────────────────────────── */
  const steps = [
    { done: Boolean(user.bio && user.city), label: "Compléter mon profil", href: "/profil", icon: UserRound },
    { done: online.length > 0, label: "Publier mon premier bien", href: "/publier", icon: Plus },
    { done: activePrimes.length > 0, label: "Poser une prime sur un bien", href: "/mes-biens", icon: Gift },
    { done: intros.length > 0, label: "Recommander un premier contact", href: "/apporteurs", icon: Coins },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            {new Date().toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="page-heading mt-1.5 text-[30px]">Bonjour {user.firstName || "à vous"}</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {todos.length > 0
              ? `${todos.length} chose${todos.length > 1 ? "s" : ""} demande${todos.length > 1 ? "nt" : ""} votre attention.`
              : "Rien d'urgent pour l'instant."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopilotButton />
          <Button asChild>
            <Link href="/publier"><Plus className="h-4 w-4" aria-hidden /> Publier un bien</Link>
          </Button>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── À faire ──────────────────────────────────────────────────── */}
        <section aria-label="À faire" className="min-w-0">
          <h2 className="mb-3 text-[15px] font-semibold">À faire</h2>
          {todos.length === 0 ? (
            <div className="rounded-2xl border bg-card px-5 py-8 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-leman-soft text-leman">
                <Check className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 text-[14.5px] font-medium">Rien en attente</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {doneCount < steps.length
                  ? "Pour démarrer, suivez la liste « Bien démarrer ». Les demandes et mises en relation apparaîtront ici."
                  : "Les nouvelles demandes et les mises en relation apparaîtront ici."}
              </p>
            </div>
          ) : (
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-xs">
              {todos.map((t) => (
                <li key={t.key}>
                  <Link href={t.href} className="group flex items-start gap-3.5 px-4 py-3.5 hover:bg-accent/50">
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        t.prime ? "border border-laiton-border bg-laiton-soft text-laiton" : "bg-subtle text-foreground",
                      )}
                    >
                      <t.icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium">{t.title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-foreground">{t.hint}</span>
                    </span>
                    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* ── Chiffres RÉELS ───────────────────────────────────────── */}
          <h2 className="mb-3 mt-8 text-[15px] font-semibold">Votre activité</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat href="/mes-biens" label="Biens en ligne" value={String(online.length)} />
            <Stat href="/demandes" label="Demandes ouvertes" value={String(openDemandes.length)} />
            <Stat href="/mes-biens" label="Primes actives" value={String(activePrimes.length)} />
            <Stat href="/apporteurs" label="Gains apporteur" value={chf(dueNet)} prime={dueNet > 0} sub="net, primes dues" />
          </div>
        </section>

        {/* ── Colonne : démarrage + raccourcis ─────────────────────────── */}
        <aside className="space-y-4">
          {doneCount < steps.length && (
            <section aria-label="Bien démarrer" className="rounded-2xl border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold">Bien démarrer</h2>
                <span className="text-[12px] tabular-nums text-muted-foreground">{doneCount}/{steps.length}</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
                <div className="h-full rounded-full bg-leman transition-[width]" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
              </div>
              <ul className="mt-3 space-y-0.5">
                {steps.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13.5px] hover:bg-accent/60",
                        s.done && "text-muted-foreground",
                      )}
                    >
                      {s.done ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leman text-white dark:text-[#0d1513]">
                          <Check className="h-3 w-3" aria-hidden />
                        </span>
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/60" aria-hidden />
                      )}
                      <span className={cn("flex-1", s.done && "line-through decoration-muted-foreground/40")}>{s.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-label="Raccourcis" className="rounded-2xl border bg-card p-2 shadow-xs">
            <Shortcut href="/explorer" icon={Compass} label="Explorer les biens" />
            <Shortcut href="/mes-biens" icon={Building2} label="Mes biens et primes" />
            <Shortcut href="/apporteurs" icon={Coins} label="Recommander et gagner" />
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({ href, label, value, sub, prime = false }: { href: string; label: string; value: string; sub?: string; prime?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-2xl border bg-card p-4 shadow-xs hover:border-foreground/20",
        prime && "border-laiton-border bg-laiton-soft/50",
      )}
    >
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-[22px] font-semibold tabular-nums tracking-[-0.02em]", prime && "text-laiton")}>{value}</p>
      {sub && <p className="text-[11.5px] text-muted-foreground">{sub}</p>}
    </Link>
  );
}

function Shortcut({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13.5px] hover:bg-accent/60">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="flex-1">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
    </Link>
  );
}
