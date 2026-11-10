"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BedDouble,
  Building2,
  GraduationCap,
  Handshake,
  Heart,
  MessageCircle,
  Search,
  Star,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/lib/context";
import { useSession } from "@/lib/use-session";
import { useActor } from "@/lib/use-actor";
import { CURRENT_USER_ID } from "@/lib/demo/identity";
import { actorDashboard, type ActorDashboard, type DashboardSection, type MoneyLine } from "@/lib/demo/actor-dashboard";
import { isAgencyMember } from "@/lib/demo/actors";
import { avisOf, frDate } from "@/lib/demo/showcase";
import { followersOf } from "@/lib/demo/social";
import { personSummary } from "@/lib/demo/directory";
import { postsByAuthor } from "@/lib/demo/posts";
import { bookingsHostedBy, bookingsMadeBy, publishedBy } from "@/lib/demo/session-views";
import { properties as CATALOGUE } from "@/lib/mock-data";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Le tableau de bord de la personne incarnée (chantier P3) ───────────────

   Léo garde son tableau de bord détaillé (`/dashboard` et ses sous-pages,
   construits sur `dashboard-data.ts`). Dès qu'on incarne quelqu'un d'autre,
   `ActorGate` remplace la page par SA version, calculée par
   `actorDashboard()` : les montants filtrés par `ownerId` au journal, ses
   biens, ses formations, ses prestations, ses avis, ses conversations — et,
   pour qui ne gagne rien sur la plateforme, ses recherches, ses favoris, ses
   séjours, le bien qu'il vend. Jamais vide, jamais celui de Léo.

   Au rendu serveur, l'acteur est toujours Léo : la page de Léo est rendue,
   puis remplacée après l'hydratation si une autre personne est mémorisée. */

const LABEL = "font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground";

const SOURCE_LABELS: Record<string, string> = {
  biens: "Locations courte durée",
  formations: "Formations",
  evenements: "Événements",
  services: "Prestations",
  boutique: "Boutique",
  lives: "Lives",
  apporteurs: "Apports",
};

const chf = (n: number) => `${formatNumber(Math.round(n))} CHF`;

function useActorDashboard(): { d: ActorDashboard; firstName: string; line: string; avatar: string } {
  const actor = useActor();
  const { state } = useSession();
  const { favorites } = useApp();
  const d = useMemo(() => actorDashboard(actor.id, state, [...favorites]), [actor.id, state, favorites]);
  return { d, firstName: actor.firstName, line: actor.line, avatar: actor.avatar };
}

/* ── La porte : Léo voit sa page, les autres la leur ─────────────────────── */

export function ActorGate({ section, children }: { section: DashboardSection | "overview"; children: React.ReactNode }) {
  const { actorId } = useSession();
  if (actorId === CURRENT_USER_ID) return <>{children}</>;
  return section === "overview" ? <ActorOverview /> : <ActorSection section={section} />;
}

/* ── Petites briques ─────────────────────────────────────────────────────── */

function Tile({ icon: Icon, label, value, sub, href }: { icon: LucideIcon; label: string; value: string; sub?: string; href?: string }) {
  const body = (
    <Card className={cn("h-full", href && "transition-colors hover:border-foreground/30")}>
      <CardContent className="p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <p className={cn(LABEL, "mt-3 text-[10px]")}>{label}</p>
        <p className="mt-0.5 font-mono text-2xl font-medium tabular-nums">{value}</p>
        {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function Panel({ id, title, description, children, action }: { id?: string; title: string; description?: string; children: React.ReactNode; action?: { href: string; label: string } }) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className={LABEL}>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && (
            <Link href={action.href} className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-foreground/80 hover:text-foreground">
              {action.label} <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">{children}</p>;
}

function MoneyRows({ rows, empty }: { rows: MoneyLine[]; empty: string }) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;
  return (
    <ul className="divide-y">
      {rows.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <span className="min-w-0">
            <span className="block truncate">{r.label}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {frDate(r.date)} · {r.counterparty}
              {r.status === "cancelled" ? " · annulé" : r.status === "pending" ? " · en attente" : ""}
            </span>
          </span>
          <span className={cn("shrink-0 font-mono tabular-nums", r.status === "cancelled" && "text-muted-foreground line-through")}>{chf(r.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

function HostedList({ d }: { d: ActorDashboard }) {
  if (d.hosted.length === 0) return <Empty>Aucun bien publié pour l’instant.</Empty>;
  return (
    <ul className="divide-y">
      {d.hosted.map((h) => (
        <li key={h.id}>
          <Link href={`/explorer/${h.id}`} className="flex items-center gap-3 py-2.5 hover:opacity-80">
            {h.cover ? <img src={h.cover} alt="" className="h-10 w-14 shrink-0 rounded object-cover" /> : null}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{h.title}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {h.city} · {h.status}
                {h.status === "courte durée" ? ` · occupation ${Math.round(h.occupancy * 100)} % ce mois` : ""}
              </span>
            </span>
            <span className="shrink-0 text-right font-mono text-xs tabular-nums">
              {h.status === "courte durée"
                ? `${chf(h.monthRevenue)} ce mois`
                : `${formatNumber(h.price)} ${h.currency}${h.status === "longue durée" ? " /mois" : ""}`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ── La vue d'ensemble ──────────────────────────────────────────────────── */

const FOCUS_INTRO: Record<ActorDashboard["focus"], string> = {
  revenus: "Vos revenus, vos biens et votre activité — chaque franc vient du journal de la démonstration.",
  agence: "Vos mandats, votre volume de ventes et vos locations.",
  vente: "Votre bien en vente, les personnes qui vous écrivent et vos prochaines démarches.",
  recherche: "Vos recherches, vos favoris et vos conversations en cours.",
  apporteur: "Vos recommandations et votre réseau.",
};

export function ActorOverview() {
  const { d, firstName, line, avatar } = useActorDashboard();
  const shortTerm = d.hosted.filter((h) => h.status === "courte durée").length;
  const forSale = d.hosted.filter((h) => h.status === "en vente");
  const favProps = CATALOGUE.filter((p) => d.favorites.includes(p.id));
  const sold12m = d.formations.reduce((s, f) => s + f.sold12m, 0);
  const staysCount = d.stays.filter((s) => s.status !== "cancelled").length;

  /* Les tuiles : celles qui ont des données, dans l'ordre de ce qui compte
     pour cette personne ; les conversations complètent toujours. */
  const tiles: { key: string; icon: LucideIcon; label: string; value: string; sub?: string; href?: string }[] = [];
  if (d.earns) tiles.push({ key: "rev", icon: TrendingUp, label: "Revenus · 12 mois", value: chf(d.revenue12m), sub: `dont ${chf(d.revenueMonth)} ce mois` });
  if (d.gmv > 0) tiles.push({ key: "gmv", icon: Building2, label: "Volume de ventes", value: chf(d.gmv), sub: "Un volume, pas un revenu" });
  if (d.hosted.length > 0) tiles.push({ key: "biens", icon: Building2, label: "Biens", value: String(d.hosted.length), sub: forSale.length ? `${forSale.length} en vente` : shortTerm ? `${shortTerm} en courte durée` : undefined, href: "/dashboard/annonces" });
  if (staysCount > 0) tiles.push({ key: "stays", icon: BedDouble, label: "Séjours reçus · 12 mois", value: String(staysCount), href: "/dashboard/reservations" });
  if (d.formations.length > 0) tiles.push({ key: "form", icon: GraduationCap, label: "Inscriptions · 12 mois", value: String(sold12m), sub: `${d.formations.length} formation${d.formations.length > 1 ? "s" : ""}` });
  if (d.serviceSales.length > 0) tiles.push({ key: "svc", icon: Wrench, label: "Prestations vendues", value: String(d.serviceSales.length) });
  if (d.focus === "recherche" || favProps.length > 0) tiles.push({ key: "fav", icon: Heart, label: "Favoris", value: String(favProps.length), href: "/favoris" });
  if (d.searches.length > 0) tiles.push({ key: "search", icon: Search, label: "Recherches enregistrées", value: String(d.searches.length) });
  if (d.reviews.count > 0) tiles.push({ key: "avis", icon: Star, label: "Note moyenne", value: `${d.reviews.avg.toFixed(1)} / 5`, sub: `${d.reviews.count} avis`, href: "/dashboard/avis" });
  tiles.push({ key: "conv", icon: MessageCircle, label: "Conversations", value: String(d.conversations.count), sub: d.conversations.unread ? `${d.conversations.unread} non lu${d.conversations.unread > 1 ? "s" : ""}` : "Tout est lu", href: "/messages" });
  tiles.push({ key: "net", icon: Users, label: "Abonnés", value: String(d.followers), sub: `${d.following} suivis`, href: "/reseau" });

  const sessionTotal = d.session.published + d.session.bookingsMade + d.session.bookingsReceived + d.session.applicationsSent + d.session.applicationsReceived;

  return (
    <div className="space-y-8" data-testid="actor-dashboard">
      <section className="flex items-center gap-4">
        <img src={avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
        <div className="min-w-0">
          <p className={LABEL}>Tableau de bord</p>
          <h1 className="text-2xl font-semibold">Bonjour {firstName}</h1>
          <p className="text-sm text-muted-foreground">
            {line} — {FOCUS_INTRO[d.focus]}
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.slice(0, 4).map(({ key, ...t }) => (
          <Tile key={key} {...t} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {forSale.length > 0 && d.focus === "vente" && (
          <Panel title="Mon bien en vente" description="Sans agence : vous gérez les visites et les offres." action={{ href: "/messages", label: "Messages" }}>
            <HostedList d={{ ...d, hosted: forSale }} />
          </Panel>
        )}

        {d.hosted.length > 0 && d.focus !== "vente" && (
          <Panel title={d.focus === "agence" ? "Mes mandats et locations" : "Mes biens"} action={{ href: "/dashboard/annonces", label: "Tout voir" }}>
            <HostedList d={d} />
          </Panel>
        )}

        {d.earns && d.bySource.length > 0 && (
          <Panel title="Revenus par source · 12 mois" description="Dérivés du journal, à votre nom uniquement.">
            <ul className="space-y-3">
              {d.bySource.map((s) => (
                <li key={s.source}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">{SOURCE_LABELS[s.source] ?? s.source}</span>
                    <span className="font-mono text-xs tabular-nums">{chf(s.value)}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-foreground/70" style={{ width: `${Math.round((s.value / Math.max(1, d.revenue12m)) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {d.formations.length > 0 && (
          <Panel id="formations" title="Mes formations" action={{ href: "/formations/creer", label: "Créer" }}>
            <ul className="divide-y">
              {d.formations.map((f) => (
                <li key={f.id}>
                  <Link href={`/formations/${f.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:opacity-80">
                    <span className="min-w-0">
                      <span className="block truncate">{f.title}</span>
                      <span className="block text-[11px] text-muted-foreground">{f.sold12m} inscriptions · {chf(f.price)}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums">{chf(f.revenue12m)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {d.serviceSales.length > 0 && (
          <Panel id="prestations" title="Mes prestations vendues" action={{ href: "/services/proposer", label: "Proposer un service" }}>
            <MoneyRows rows={d.serviceSales} empty="Aucune prestation vendue." />
          </Panel>
        )}

        {(d.focus === "recherche" || d.searches.length > 0) && (
          <Panel title="Mes recherches" action={{ href: "/explorer", label: "Explorer" }}>
            {d.searches.length === 0 ? (
              <Empty>Aucune recherche enregistrée.</Empty>
            ) : (
              <ul className="divide-y">
                {d.searches.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:opacity-80">
                      <span className="flex items-center gap-2"><Search className="h-3.5 w-3.5 text-muted-foreground" />{s.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        {(d.focus === "recherche" || favProps.length > 0) && (
          <Panel title="Mes favoris" action={{ href: "/favoris", label: "Tout voir" }}>
            {favProps.length === 0 ? (
              <Empty>Aucun favori. Le cœur d’une fiche de bien l’ajoute ici.</Empty>
            ) : (
              <ul className="divide-y">
                {favProps.map((p) => (
                  <li key={p.id}>
                    <Link href={`/explorer/${p.id}`} className="flex items-center gap-3 py-2.5 hover:opacity-80">
                      <img src={p.images[0]} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{p.title}</span>
                        <span className="block text-[11px] text-muted-foreground">{p.location.city} · {p.host.firstName} {p.host.lastName}</span>
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums">
                        {formatNumber(p.price)} {p.currency}{p.transactionType === "location-lt" ? " /mois" : p.transactionType === "location-ct" ? " /nuit" : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        {d.purchases.length > 0 && (
          <Panel title="Mes séjours et achats" description="Ce que vous avez réservé ou acheté sur la plateforme.">
            <MoneyRows rows={d.purchases} empty="" />
          </Panel>
        )}

        <Panel title="Conversations en cours" action={{ href: "/messages", label: "Messagerie" }}>
          {d.conversations.recent.length === 0 ? (
            <Empty>Aucune conversation. Contactez un vendeur, un hôte ou un prestataire depuis sa fiche.</Empty>
          ) : (
            <ul className="divide-y">
              {d.conversations.recent.map((c) => (
                <li key={c.id}>
                  <Link href={`/messages?conv=${c.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:opacity-80">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{c.title}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{c.lastText}</span>
                    </span>
                    {c.unread > 0 && (
                      <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-medium text-background">{c.unread}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {(isAgencyMember(d.personId) || d.focus === "apporteur") && (
          <Panel
            title={isAgencyMember(d.personId) ? "Espace agence" : "Espace apporteur"}
            description={
              isAgencyMember(d.personId)
                ? "Les demandes du secteur, les mandats et l’équipe d’Hartmann Immobilier SA."
                : "Vos liens de recommandation et leur suivi."
            }
          >
            <Link
              href={isAgencyMember(d.personId) ? "/agence" : "/apporteurs"}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              {isAgencyMember(d.personId) ? <Building2 className="h-4 w-4" /> : <Handshake className="h-4 w-4" />}
              Ouvrir
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Panel>
        )}

        {sessionTotal > 0 && (
          <Panel title="Pendant cette visite" description="Ce que vous avez fait en son nom depuis le début de la démonstration.">
            <ul className="space-y-1.5 text-sm">
              {d.session.published > 0 && <li>{d.session.published} publication(s)</li>}
              {d.session.bookingsMade > 0 && <li>{d.session.bookingsMade} réservation(s) faite(s)</li>}
              {d.session.bookingsReceived > 0 && <li>{d.session.bookingsReceived} réservation(s) reçue(s)</li>}
              {d.session.applicationsSent > 0 && <li>{d.session.applicationsSent} candidature(s) envoyée(s)</li>}
              {d.session.applicationsReceived > 0 && <li>{d.session.applicationsReceived} proposition(s) d’agence reçue(s)</li>}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  );
}

/* ── Les sous-pages ─────────────────────────────────────────────────────── */

const SECTION_TITLES: Record<DashboardSection, string> = {
  reservations: "Réservations",
  calendrier: "Calendrier",
  annonces: "Annonces",
  avis: "Avis",
  audience: "Audience",
  apporteurs: "Apporteurs",
};

export function ActorSection({ section }: { section: DashboardSection }) {
  const { d, firstName } = useActorDashboard();
  const { state } = useSession();
  const title = SECTION_TITLES[section];

  const header = (
    <div>
      <p className={LABEL}>Tableau de bord · {firstName}</p>
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );

  if (!d.sections.includes(section)) {
    return (
      <div className="space-y-6">
        {header}
        <Empty>
          Rien à afficher ici pour {firstName} : cette page concerne une activité qu’elle ou il n’a pas sur la plateforme.{" "}
          <Link href="/dashboard" className="underline underline-offset-2">Retour au tableau de bord</Link>
        </Empty>
      </div>
    );
  }

  let body: React.ReactNode = null;

  if (section === "reservations") {
    const sessionBookings = bookingsHostedBy(state, d.personId);
    body = (
      <div className="grid gap-6">
        {sessionBookings.length > 0 && (
          <Panel title="Reçues pendant la visite">
            <ul className="divide-y">
              {sessionBookings.map((b) => (
                <li key={b.id} className="flex justify-between gap-3 py-2.5 text-sm">
                  <span>{b.subject} · {frDate(b.checkIn)} → {frDate(b.checkOut)}</span>
                  <span className="font-mono tabular-nums">{chf(b.total)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        <Panel title="Séjours · 12 mois" description="Dérivés du journal, sur vos biens en courte durée.">
          <MoneyRows rows={d.stays} empty="Aucun séjour sur vos biens." />
        </Panel>
      </div>
    );
  } else if (section === "calendrier") {
    const mine = bookingsMadeBy(state, d.personId);
    const byMonth = new Map<string, MoneyLine[]>();
    for (const s of d.stays) {
      const k = s.date.slice(0, 7);
      byMonth.set(k, [...(byMonth.get(k) ?? []), s]);
    }
    body = (
      <div className="grid gap-6">
        {[...byMonth.entries()].slice(0, 6).map(([month, rows]) => (
          <Panel key={month} title={frDate(`${month}-01`).replace(/^1 /, "")} description={`${rows.length} séjour(s)`}>
            <MoneyRows rows={rows} empty="" />
          </Panel>
        ))}
        {mine.length > 0 && (
          <Panel title="Mes séjours réservés">
            <ul className="divide-y text-sm">
              {mine.map((b) => (
                <li key={b.id} className="py-2.5">{b.subject} · {frDate(b.checkIn)} → {frDate(b.checkOut)}</li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    );
  } else if (section === "annonces") {
    const added = publishedBy(state, d.personId);
    body = (
      <div className="grid gap-6">
        {added.listings.length + added.services.length + added.formations.length + added.lives.length > 0 && (
          <Panel title="Publiés pendant la visite">
            <ul className="divide-y text-sm">
              {added.listings.map((p) => <li key={p.id} className="py-2.5"><Link href={`/explorer/${p.id}`} className="hover:underline">{p.title}</Link> · bien</li>)}
              {added.services.map((s) => <li key={s.id} className="py-2.5">{s.title} · service</li>)}
              {added.formations.map((f) => <li key={f.id} className="py-2.5"><Link href={`/formations/${f.id}`} className="hover:underline">{f.title}</Link> · formation</li>)}
              {added.lives.map((l) => <li key={l.id} className="py-2.5">{l.title} · live</li>)}
            </ul>
          </Panel>
        )}
        {d.hosted.length > 0 && (
          <Panel title="Biens">
            <HostedList d={d} />
          </Panel>
        )}
        {d.formations.length > 0 && (
          <Panel id="formations" title="Formations">
            <ul className="divide-y">
              {d.formations.map((f) => (
                <li key={f.id} className="flex justify-between gap-3 py-2.5 text-sm">
                  <Link href={`/formations/${f.id}`} className="truncate hover:underline">{f.title}</Link>
                  <span className="shrink-0 font-mono text-xs tabular-nums">{f.sold12m} inscriptions · {chf(f.revenue12m)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {d.serviceSales.length > 0 && (
          <Panel id="prestations" title="Prestations vendues">
            <MoneyRows rows={d.serviceSales} empty="" />
          </Panel>
        )}
      </div>
    );
  } else if (section === "avis") {
    const { avis } = avisOf(d.personId);
    body = (
      <Panel title={`${avis.length} avis reçus`} description={`Note moyenne ${d.reviews.avg.toFixed(1)} / 5`}>
        <ul className="divide-y">
          {avis.map((a) => (
            <li key={a.id} className="py-3 text-sm">
              <p className="font-medium">{a.author} · {"★".repeat(a.rating)}</p>
              <p className="text-[11px] text-muted-foreground">{a.about} · {a.date}</p>
              <p className="mt-1">{a.text}</p>
              {a.reply && <p className="mt-1 border-l-2 pl-2 text-muted-foreground">Votre réponse : {a.reply.text}</p>}
            </li>
          ))}
        </ul>
      </Panel>
    );
  } else if (section === "audience") {
    const followers = followersOf(d.personId).map(personSummary);
    const posts = postsByAuthor(d.personId);
    body = (
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={`${followers.length} abonnés`} description={`${d.following} suivis · des personnes réelles du réseau`} action={{ href: "/reseau", label: "Réseau" }}>
          {followers.length === 0 ? (
            <Empty>Personne ne vous suit encore.</Empty>
          ) : (
            <ul className="divide-y">
              {followers.map((p) => (
                <li key={p.id}>
                  <Link href={`/profil/${p.id}`} className="flex items-center gap-2.5 py-2 text-sm hover:opacity-80">
                    <img src={p.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto truncate text-[11px] text-muted-foreground">{p.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title={`${posts.length} publication(s)`} description="Vos publications dans le fil." action={{ href: "/profil", label: "Mon profil" }}>
          {posts.length === 0 ? (
            <Empty>Aucune publication. Le fil vous attend.</Empty>
          ) : (
            <ul className="divide-y text-sm">
              {posts.slice(0, 6).map((p) => (
                <li key={p.id} className="py-2.5">
                  <p className="line-clamp-2">{p.content}</p>
                  <p className="text-[11px] text-muted-foreground">{p.likes} j’aime · {p.comments.length} commentaire(s)</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      {body}
    </div>
  );
}
