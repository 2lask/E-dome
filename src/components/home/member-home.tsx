import Link from "next/link";
import { formatNumber } from "@/lib/format";
import {
  ArrowRight, Coins, Inbox, ImageOff, Gift, Check, Circle, Plus, Compass, Building2, UserRound, BarChart3,
} from "lucide-react";
import { CopilotButton } from "@/components/home/copilot-button";
import { apporteurNetChf, primeEligible, type MyIntroduction, type MyPrime, type MyProperty } from "@/lib/my-property";
import type { Demande, PendingIntroduction } from "@/lib/demandes";
import type { SessionUser } from "@/lib/session-user";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion/reveal";
import { SpotlightCard } from "@/components/ui/motion/spotlight";

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
      hint: "Un apporteur vous présente un contact. Acceptez pour recevoir ses coordonnées ; la commission suit les conditions de votre annonce.",
    });
  if (settlementTodos > 0)
    todos.push({
      key: "settle", href: "/reglements", icon: Coins, prime: true,
      title: `${settlementTodos} règlement${settlementTodos > 1 ? "s" : ""} à traiter`,
      hint: "Une commission à verser, ou un paiement reçu à confirmer.",
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
      title: `Proposez une commission sur « ${b.title} »`,
      hint: "Les apporteurs recommandent les biens à commission. Par défaut, vous ne payez que si la vente est conclue grâce à eux.",
    });

  /* ── Bien démarrer (checklist d'activation) ───────────────────────────── */
  const steps = [
    { done: Boolean(user.bio && user.city), label: "Compléter mon profil", href: "/profil", icon: UserRound },
    { done: online.length > 0, label: "Publier mon premier bien", href: "/publier", icon: Plus },
    { done: activePrimes.length > 0, label: "Proposer une commission sur un bien", href: "/mes-biens", icon: Gift },
    { done: intros.length > 0, label: "Partager un premier lien d'apporteur", href: "/apporteurs", icon: Coins },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="mx-auto max-w-5xl">
      <Reveal as="header" y={10} className="v3-beam v3-beam--cine rounded-3xl shadow-[0_30px_90px_-30px_rgb(0_0_0/0.7)]">
      <div className="v3-beam__inner cine v3-grain relative rounded-3xl p-6 md:p-8">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div aria-hidden className="v3-orb v3-orb--gold -left-16 -top-20 h-64 w-64" />
        <div aria-hidden className="v3-orb v3-orb--leman -right-10 bottom-0 h-64 w-64" />
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="v3-eyebrow v3-eyebrow--cine">
                {new Date().toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <h1 className="mt-4 text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[48px]">
                Bonjour <span className="cine-gold">{user.firstName || "à vous"}</span>
              </h1>
              <p className="mt-1 text-[14.5px] text-white/65">
                {todos.length > 0
                  ? `${todos.length} chose${todos.length > 1 ? "s" : ""} demande${todos.length > 1 ? "nt" : ""} votre attention.`
                  : "Rien d'urgent pour l'instant."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopilotButton />
              <Link href="/publier" className="cine-btn-gold v3-sheen inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]">
                <Plus className="h-4 w-4" aria-hidden /> Publier un bien
              </Link>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat href="/mes-biens" icon={Building2} label="Biens en ligne" value={String(online.length)} />
            <Stat href="/demandes" icon={Inbox} label="Demandes ouvertes" value={String(openDemandes.length)} />
            <Stat href="/mes-biens" icon={Gift} label="Commissions actives" value={String(activePrimes.length)} />
            <Stat href="/tableau-de-bord?vue=apports" icon={Coins} label="Gains apporteur" value={chf(dueNet)} prime={dueNet > 0} sub="net, mises en relation" />
          </div>
        </div>
      </div>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── À faire ──────────────────────────────────────────────────── */}
        <Reveal as="section" delay={0.08} className="min-w-0">
          <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
            À faire
            {todos.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-laiton-soft px-1.5 text-[11px] font-semibold tabular-nums text-laiton ring-1 ring-laiton-border">
                {todos.length}
              </span>
            )}
          </h2>
          {todos.length === 0 ? (
            <SpotlightCard className="v3-card--static relative px-5 py-10 text-center">
              <div aria-hidden className="v3-dots" />
              <span className="v3-icon relative mx-auto h-11 w-11">
                <Check className="h-5 w-5" aria-hidden />
              </span>
              <p className="relative mt-4 text-[15px] font-semibold">Rien en attente</p>
              <p className="relative mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">
                {doneCount < steps.length
                  ? "Pour démarrer, suivez la liste « Bien démarrer ». Les demandes et mises en relation apparaîtront ici."
                  : "Les nouvelles demandes et les mises en relation apparaîtront ici."}
              </p>
            </SpotlightCard>
          ) : (
            <SpotlightCard className="v3-card--static">
              <RevealGroup as="ul" className="divide-y">
                {todos.map((t) => (
                  <RevealItem as="li" key={t.key} className="relative">
                    {t.prime && <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-laiton to-laiton/30" />}
                    <Link href={t.href} className="group flex items-start gap-3.5 px-4 py-4 transition-colors hover:bg-accent/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
                      <span className={cn("v3-icon mt-0.5 h-9 w-9 rounded-xl", t.prime && "v3-icon--gold")}>
                        <t.icon className="h-[18px] w-[18px]" />
                      </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium">{t.title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-foreground">{t.hint}</span>
                    </span>
                    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" aria-hidden />
                  </Link>
                </RevealItem>
              ))}
              </RevealGroup>
            </SpotlightCard>
          )}

          {/* ── Chiffres RÉELS ───────────────────────────────────────── */}
        </Reveal>

        {/* ── Colonne : démarrage + raccourcis ─────────────────────────── */}
        <Reveal delay={0.16} className="space-y-4">
          {doneCount < steps.length && (
            <SpotlightCard as="article" className="v3-card--static p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold">Bien démarrer</h2>
                <span className="text-[12px] tabular-nums text-muted-foreground">{doneCount}/{steps.length}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
                <div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-leman to-laiton shadow-[0_0_12px_var(--leman)] transition-transform duration-700"
                  style={{ transform: `scaleX(${doneCount / steps.length})` }}
                />
              </div>
              <ul className="mt-3 space-y-0.5">
                {steps.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className={cn(
                        "flex min-h-11 items-center gap-2.5 rounded-lg px-2 py-2 text-[13.5px] transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
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
            </SpotlightCard>
          )}

          <SpotlightCard as="article" className="v3-card--static p-2">
            <h2 className="sr-only">Raccourcis</h2>
            <Shortcut href="/tableau-de-bord" icon={BarChart3} label="Tableau de bord en direct" />
            <Shortcut href="/explorer" icon={Compass} label="Explorer les biens" />
            <Shortcut href="/mes-biens" icon={Building2} label="Mes biens et commissions" />
            <Shortcut href="/apporteurs" icon={Coins} label="Recommander et gagner" prime />
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  );
}

function Stat({
  href, icon: Icon, label, value, sub, prime = false,
}: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; prime?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[rgb(227_184_92/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]",
        prime && "border-[#d9a441]/40 bg-[#d9a441]/10",
      )}
    >
      <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(closest-side,rgb(227_184_92/0.25),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <p className="flex items-center gap-1.5 text-[12px] text-white/55">
        <Icon className={cn("h-3.5 w-3.5", prime ? "text-[#f2c66b]" : "text-white/40")} />
        {label}
      </p>
      <p className={cn("mt-1.5 text-[28px] font-semibold tabular-nums tracking-[-0.03em] text-white", prime && "text-[#f7d488]")}>{value}</p>
      {sub && <p className="text-[11.5px] text-white/50">{sub}</p>}
    </Link>
  );
}

function Shortcut({
  href, icon: Icon, label, prime = false,
}: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; prime?: boolean }) {
  return (
    <Link href={href} className="group flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
      <span className={cn("v3-icon h-8 w-8 rounded-lg", prime && "v3-icon--gold")}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
