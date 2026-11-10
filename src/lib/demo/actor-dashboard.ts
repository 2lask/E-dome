import { properties as CATALOGUE, formations as FORMATIONS, reviewsReceivedBy } from "@/lib/mock-data";
import type { Currency, TransactionType } from "@/lib/types";
import { personaFor } from "@/content/roles";
import * as derive from "./derive";
import { LEDGER, type Entry, type LedgerSource } from "./ledger";
import { PROFILES } from "./identity";
import { requirePerson } from "./directory";
import { isAgencyMember } from "./actors";
import { followerCount, followingCount } from "./social";
import type { SessionState } from "./session-store";
import {
  applicationsBy,
  applicationsReceivedBy,
  bookingsHostedBy,
  bookingsMadeBy,
  notificationsFor,
  publishedBy,
  threadsFor,
} from "./session-views";

/* ── Le tableau de bord de la personne incarnée (chantier P3) ───────────────

   Une fonction PURE qui dit, pour n'importe laquelle des seize personnes, ce
   que son tableau de bord montre — et rien d'autre que SES données :

   - les montants descendent du journal FILTRÉ par `ownerId` (`derive.ts`),
     donc aucun franc de Léo ne fuit chez Céline ;
   - les biens sont ceux qu'elle héberge au catalogue, les formations celles
     dont elle est l'autrice, les avis ceux qu'elle a réellement reçus ;
   - les conversations, notifications, réservations et candidatures de la
     session sont lues du point de vue de cette personne.

   Pour une personne sans activité de propriétaire (Ana, Clémence, Bernard,
   Aline, Yves, Hélène), le tableau de bord se tourne vers ce qu'elle fait
   VRAIMENT : ses recherches et favoris, ses séjours et achats, ses
   démarches, ses conversations, le bien qu'elle vend. Jamais vide, jamais
   celui de Léo. */

export type DashboardFocus = "revenus" | "agence" | "vente" | "recherche" | "apporteur";

export type HostedStatus = "vendu" | "en vente" | "courte durée" | "longue durée";

export interface HostedProperty {
  id: string;
  title: string;
  city: string;
  cover: string;
  transactionType: TransactionType;
  status: HostedStatus;
  price: number;
  currency: Currency;
  /** Revenu du mois courant (courte durée seulement), dérivé du journal. */
  monthRevenue: number;
  /** Taux d'occupation du mois (courte durée seulement). */
  occupancy: number;
}

export interface FormationLine {
  id: string;
  title: string;
  price: number;
  sold12m: number;
  revenue12m: number;
}

export interface MoneyLine {
  id: string;
  date: string;
  label: string;
  counterparty: string;
  amount: number;
  status: Entry["status"];
}

export interface ActorDashboard {
  personId: string;
  focus: DashboardFocus;
  /** Vrai si la personne porte des montants au journal (table `PROFILES`). */
  earns: boolean;
  revenue12m: number;
  revenueMonth: number;
  /** Les sources non nulles sur douze mois. */
  bySource: { source: LedgerSource; value: number }[];
  /** Volume d'affaires (ventes conclues), jamais un revenu. */
  gmv: number;
  hosted: HostedProperty[];
  /** Séjours reçus sur ses biens (journal), les plus récents d'abord. */
  stays: MoneyLine[];
  formations: FormationLine[];
  /** Prestations vendues (journal, source `services`). */
  serviceSales: MoneyLine[];
  /** Ce qu'elle a acheté ou réservé ailleurs (séjours, achat, prestations). */
  purchases: MoneyLine[];
  reviews: { count: number; avg: number };
  followers: number;
  following: number;
  conversations: { count: number; unread: number; recent: { id: string; title: string; lastText: string; unread: number }[] };
  unreadNotifications: number;
  favorites: string[];
  searches: { label: string; href: string }[];
  /** Ce que la personne a fait pendant la session. */
  session: {
    published: number;
    bookingsMade: number;
    bookingsReceived: number;
    applicationsSent: number;
    applicationsReceived: number;
  };
  /** Les sous-pages du tableau de bord qui ont un sens pour elle. */
  sections: DashboardSection[];
}

export type DashboardSection = "reservations" | "calendrier" | "annonces" | "avis" | "audience" | "apporteurs";

const NAME = (id: string) => {
  const p = requirePerson(id);
  return `${p.firstName} ${p.lastName}`;
};

function statusOf(p: (typeof CATALOGUE)[number]): HostedStatus {
  if (p.transactionType === "vente") return p.soldTo ? "vendu" : "en vente";
  return p.transactionType === "location-ct" ? "courte durée" : "longue durée";
}

const toLine = (e: Entry): MoneyLine => ({
  id: e.id,
  date: e.date,
  label: e.stay?.label ?? e.label,
  counterparty: e.counterparty,
  amount: Math.round(e.gross),
  status: e.status,
});

export function actorDashboard(personId: string, state: SessionState, favorites: readonly string[] = []): ActorDashboard {
  const person = requirePerson(personId);
  const name = NAME(personId);
  const earns = PROFILES.some((p) => p.ownerId === personId);
  const has = (r: string) => person.roles.some((x) => x === r);

  /* L'argent : le journal, filtré par `ownerId`. */
  const bySourceYear = derive.bySourceYear(personId).filter((s) => s.value > 0);
  const revenue12m = bySourceYear.reduce((s, x) => s + x.value, 0);
  const revenueMonth = derive.bySource(personId).reduce((s, x) => s + x.value, 0);
  const gmv = derive.gmvVolume(personId);

  /* Les biens qu'elle héberge, et ce qu'elle y publie pendant la session. */
  const hosted: HostedProperty[] = CATALOGUE.filter((c) => c.host.id === personId).map((c) => {
    const short = c.transactionType === "location-ct";
    return {
      id: c.id,
      title: c.title,
      city: c.location.city,
      cover: c.images[0] ?? "",
      transactionType: c.transactionType,
      status: statusOf(c),
      price: c.price,
      currency: c.currency,
      monthRevenue: short ? derive.currentMonth({ source: "biens", subjectId: c.id, ownerId: personId }) : 0,
      occupancy: short ? derive.occupancy(c.id, personId) : 0,
    };
  });

  const stays = derive.stays(undefined, personId).map(toLine);

  const formations: FormationLine[] = FORMATIONS.filter((f) => f.instructor.id === personId).map((f) => {
    const revenue = derive.total({ source: "formations", subjectId: f.id, ownerId: personId });
    return { id: f.id, title: f.title, price: f.price, revenue12m: revenue, sold12m: Math.round(revenue / f.price) };
  });

  const serviceSales = derive
    .entries({ source: "services", ownerId: personId })
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(toLine);

  /* Ce qu'elle a acheté : les écritures où elle est la contrepartie nommée
     (un séjour chez un autre hôte, l'appartement acheté, une prestation). */
  const purchases = LEDGER.filter((e) => e.ownerId !== personId && e.counterparty === name && e.status !== "cancelled")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((e) => {
      const title = CATALOGUE.find((c) => c.id === e.subject.id)?.title ?? e.label;
      const label = e.stay ? `Séjour · ${title}` : e.source === "vente" ? `Achat · ${title}` : e.label;
      return { ...toLine(e), label };
    });

  const revs = reviewsReceivedBy(personId);
  const reviews = {
    count: revs.length,
    avg: revs.length ? revs.reduce((s, r) => s + r.rating, 0) / revs.length : 0,
  };

  const threads = threadsFor(state, personId);
  const conversations = {
    count: threads.length,
    unread: threads.reduce((s, t) => s + t.unreadCount, 0),
    recent: threads.slice(0, 4).map((t) => ({
      id: t.id,
      title: t.name ?? t.otherIds.map(NAME).join(", "),
      lastText: t.lastText,
      unread: t.unreadCount,
    })),
  };
  const unreadNotifications = notificationsFor(state, personId).filter((n) => !n.read).length;

  const mine = publishedBy(state, personId);
  const session = {
    published: mine.listings.length + mine.services.length + mine.formations.length + mine.lives.length,
    bookingsMade: bookingsMadeBy(state, personId).length,
    bookingsReceived: bookingsHostedBy(state, personId).length,
    applicationsSent: applicationsBy(state, personId).length,
    applicationsReceived: applicationsReceivedBy(state, personId).length,
  };

  /* Ce sur quoi le tableau de bord s'ouvre. */
  const focus: DashboardFocus = isAgencyMember(personId) || (has("agence") && gmv > 0)
    ? "agence"
    : earns
      ? "revenus"
      : has("apporteur")
        ? "apporteur"
        : hosted.some((h) => h.status === "en vente")
          ? "vente"
          : "recherche";

  const hasShortTerm = hosted.some((h) => h.status === "courte durée") || stays.length > 0;
  const sections: DashboardSection[] = [];
  if (hasShortTerm) sections.push("reservations", "calendrier");
  if (hosted.length > 0 || formations.length > 0 || serviceSales.length > 0 || session.published > 0) sections.push("annonces");
  if (reviews.count > 0) sections.push("avis");
  sections.push("audience");
  if (has("apporteur")) sections.push("apporteurs");

  return {
    personId,
    focus,
    earns,
    revenue12m,
    revenueMonth,
    bySource: bySourceYear,
    gmv,
    hosted,
    stays,
    formations,
    serviceSales,
    purchases,
    reviews,
    followers: followerCount(personId),
    following: followingCount(personId),
    conversations,
    unreadNotifications,
    favorites: [...favorites],
    searches: personaFor(personId)?.searches ?? [],
    session,
    sections,
  };
}
