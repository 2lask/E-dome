import type { Currency, Formation, Notification, Property, User } from "@/lib/types";
import { properties as CATALOGUE, users } from "@/lib/mock-data";
import { dayMonth } from "./clock";
import {
  type SessionEvent,
  type SessionState,
  type ApplicationData,
  directThreadId,
  listingIdOf,
  serviceIdOf,
  formationIdOf,
  liveIdOf,
  bookingIdOf,
  eventIdOf,
} from "./session-store";
import { NOTIFICATION_SEEDS, THREAD_SEEDS, type ThreadSeed } from "./inbox-seeds";

/* ── LES VUES DÉRIVÉES de la mémoire de session ─────────────────────────────

   Tout ce que les écrans affichent du moteur d'interactions sort d'ici :
   les fils de la messagerie, les notifications et leur compteur UNIQUE, et
   les objets créés pendant la visite (biens, services, formations, lives,
   réservations). Chaque vue est une fonction pure de (amorce + journal) et,
   quand elle dépend de la personne qui regarde, d'un `viewerId` — jamais
   d'un « utilisateur courant » implicite (chantier P3). */

/* ── Petits outils ─────────────────────────────────────────────────────── */

function person(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function displayName(id: string): string {
  const p = person(id);
  return p ? `${p.firstName} ${p.lastName}` : "Quelqu'un";
}

/** Groupement suisse des milliers, sans `toLocaleString` (l'ICU du serveur et
    celle du navigateur diffèrent : hydratation cassée). */
export function groupThousands(n: number): string {
  const r = Math.round(n);
  const s = Math.abs(r)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return r < 0 ? `-${s}` : s;
}

function money(amount: number, currency: Currency): string {
  return `${groupThousands(amount)} ${currency}`;
}

function quote(text: string, max = 90): string {
  const t = text.trim().replace(/\s+/g, " ");
  return `« ${t.length > max ? t.slice(0, max - 1) + "…" : t} »`;
}

/** « 12 octobre » depuis une date ISO (AAAA-MM-JJ). Valeur brute si illisible. */
function dayLabel(isoDate: string): string {
  const d = new Date(`${isoDate.slice(0, 10)}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? isoDate : dayMonth(d);
}

/* ── LA MESSAGERIE ─────────────────────────────────────────────────────── */

export interface ThreadMessage {
  id: string;
  senderId: string;
  text: string;
  at: string;
  /** Ligne de contexte au-dessus du message (« Demande de visite · … »). */
  topic?: string;
  /** Message d'amorce marqué non lu pour ses destinataires. */
  seedUnread: boolean;
  fromSession: boolean;
}

export interface Thread {
  id: string;
  memberIds: string[];
  isGroup: boolean;
  name?: string;
  avatar?: string;
  subject?: { kind: "property"; id: string; title: string };
  messages: ThreadMessage[];
}

export interface ThreadView extends Thread {
  /** Les autres membres, du point de vue de `viewerId`. */
  otherIds: string[];
  unreadCount: number;
  lastAt: string;
  lastText: string;
}

const pairKey = (a: string, b: string) => directThreadId(a, b);

function fromSeed(seed: ThreadSeed): Thread {
  const subjectProp = seed.subject ? CATALOGUE.find((p) => p.id === seed.subject!.id) : undefined;
  return {
    id: seed.id,
    memberIds: [...seed.memberIds],
    isGroup: seed.memberIds.length > 2 || Boolean(seed.name),
    name: seed.name,
    avatar: seed.avatar,
    subject: subjectProp ? { kind: "property", id: subjectProp.id, title: subjectProp.title } : undefined,
    messages: seed.messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      text: m.text,
      at: m.at,
      seedUnread: Boolean(m.unread),
      fromSession: false,
    })),
  };
}

/** Le message qu'un événement dépose dans un fil direct, s'il en dépose un. */
function directMessageOf(e: SessionEvent): { toId: string; text: string; topic?: string } | null {
  switch (e.kind) {
    case "contact.sent":
      return { toId: e.data.toId, text: e.data.text, topic: e.data.subject ? `Contact · ${e.data.subject}` : undefined };
    case "visit.requested":
      return {
        toId: e.data.toId,
        text: `Bonjour, je souhaiterais visiter ce bien le ${dayLabel(e.data.date)} à ${e.data.time}. Ce créneau vous convient-il ?`,
        topic: `Demande de visite · ${e.data.subject}`,
      };
    case "offer.made":
      return {
        toId: e.data.toId,
        text: `Bonjour, je vous fais une offre de ${money(e.data.amount, e.data.currency)} pour ce bien.${
          e.data.conditions.trim() ? ` Conditions : ${e.data.conditions.trim()}` : ""
        }`,
        topic: `Offre · ${e.data.subject}`,
      };
    case "quote.sent":
      return e.data.toId
        ? {
            toId: e.data.toId,
            text: `Bonjour, je souhaiterais un devis.${e.data.text.trim() ? ` ${e.data.text.trim()}` : ""}${
              e.data.date ? ` Date souhaitée : ${dayLabel(e.data.date)}.` : ""
            }`,
            topic: `Demande de devis · ${e.data.subject}`,
          }
        : null;
    case "agency.contacted":
      return {
        toId: e.data.toId,
        text: `Bonjour, j'ai comparé les propositions reçues pour mon bien et je choisis d'ouvrir le contact avec ${e.data.agencyName}. Vous avez désormais mes coordonnées ; je suis disponible pour un premier rendez-vous.`,
        topic: "Vendre accompagné · contact ouvert",
      };
    case "booking.made":
      return {
        toId: e.data.hostId,
        text: `Bonjour, je viens de réserver du ${dayLabel(e.data.checkIn)} au ${dayLabel(e.data.checkOut)} (${e.data.nights} ${
          e.data.nights > 1 ? "nuits" : "nuit"
        }). Au plaisir de vous rencontrer !`,
        topic: `Réservation · ${e.data.subject}`,
      };
    default:
      return null;
  }
}

/** P6a (ajout) : le message qu'un événement dépose au nom d'une AUTRE
    personne que l'acteur (réponse simulée), ou un message de l'acteur qui
    n'est pas une première prise de contact (acceptation, paiement, avis). */
function counterpartMessageOf(e: SessionEvent): { senderId: string; toId: string; text: string; topic?: string } | null {
  switch (e.kind) {
    case "service.quoted":
      return {
        senderId: e.data.providerId,
        toId: e.actorId,
        text: `${e.data.message} Total : ${money(e.data.totalChf, "CHF")}.`,
        topic: `Devis · ${e.data.subject}`,
      };
    case "service.quote.accepted":
      return {
        senderId: e.actorId,
        toId: e.data.providerId,
        text: `J'accepte votre devis de ${money(e.data.totalChf, "CHF")}. Je procède au paiement sur E-Dome.`,
        topic: "Devis accepté",
      };
    case "service.paid":
      return {
        senderId: e.actorId,
        toId: e.data.providerId,
        text: `Paiement de ${money(e.data.totalChf, "CHF")} effectué sur E-Dome (simulation). À bientôt pour la prestation.`,
        topic: "Paiement",
      };
    default:
      return null;
  }
}

/** Tous les fils (amorce + session), indépendamment de qui regarde. */
export function buildThreads(state: SessionState): Thread[] {
  const threads = new Map<string, Thread>();
  const directByPair = new Map<string, string>();
  for (const seed of THREAD_SEEDS) {
    const t = fromSeed(seed);
    threads.set(t.id, t);
    if (!t.isGroup && t.memberIds.length === 2) directByPair.set(pairKey(t.memberIds[0]!, t.memberIds[1]!), t.id);
  }

  const ensureDirect = (a: string, b: string): Thread => {
    const key = pairKey(a, b);
    const existing = directByPair.get(key);
    if (existing) return threads.get(existing)!;
    const t: Thread = { id: key, memberIds: [a, b], isGroup: false, messages: [] };
    threads.set(t.id, t);
    directByPair.set(key, t.id);
    return t;
  };

  for (const e of state.events) {
    if (e.kind === "group.created") {
      if (!threads.has(e.data.threadId)) {
        threads.set(e.data.threadId, {
          id: e.data.threadId,
          memberIds: [...new Set([e.actorId, ...e.data.memberIds])],
          isGroup: true,
          name: e.data.name,
          messages: [],
        });
      }
      continue;
    }
    if (e.kind === "message.sent") {
      let t = threads.get(e.data.threadId);
      if (!t) {
        const members = [...new Set([e.actorId, ...e.data.memberIds])];
        t = members.length === 2 ? ensureDirect(members[0]!, members[1]!) : undefined;
        if (!t) {
          t = { id: e.data.threadId, memberIds: members, isGroup: true, messages: [] };
          threads.set(t.id, t);
        }
      }
      t.messages.push({ id: e.id, senderId: e.actorId, text: e.data.text, at: e.at, seedUnread: false, fromSession: true });
      continue;
    }
    const dm = directMessageOf(e);
    if (dm && dm.toId !== e.actorId) {
      const t = ensureDirect(e.actorId, dm.toId);
      t.messages.push({ id: e.id, senderId: e.actorId, text: dm.text, topic: dm.topic, at: e.at, seedUnread: false, fromSession: true });
    }
    /* P6a (ajout) : les messages qui partent AU NOM DE L'AUTRE partie — le
       devis simulé du prestataire, et l'accusé de paiement côté client. */
    const reply = counterpartMessageOf(e);
    if (reply && reply.senderId !== reply.toId) {
      const t = ensureDirect(reply.senderId, reply.toId);
      t.messages.push({ id: `${e.id}:r`, senderId: reply.senderId, text: reply.text, topic: reply.topic, at: e.at, seedUnread: false, fromSession: true });
    }
  }
  return [...threads.values()];
}

function unreadIn(state: SessionState, t: Thread, viewerId: string): number {
  const mark = state.threadReadMarks[`${viewerId}|${t.id}`] ?? 0;
  let n = 0;
  t.messages.forEach((m, i) => {
    if (i < mark || m.senderId === viewerId) return;
    if (m.fromSession || m.seedUnread) n++;
  });
  return n;
}

/** Les fils dont `viewerId` est membre, du plus récent au plus ancien. Un fil
    vide (groupe tout juste créé) reste visible : on vient de le créer. */
export function threadsFor(state: SessionState, viewerId: string): ThreadView[] {
  return buildThreads(state)
    .filter((t) => t.memberIds.includes(viewerId))
    .map((t) => {
      const last = t.messages[t.messages.length - 1];
      return {
        ...t,
        otherIds: t.memberIds.filter((id) => id !== viewerId),
        unreadCount: unreadIn(state, t, viewerId),
        lastAt: last?.at ?? "",
        lastText: last ? (t.isGroup && last.senderId !== viewerId ? `${displayName(last.senderId).split(" ")[0]} : ${last.text}` : last.text) : "",
      };
    })
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

/** Le fil direct entre deux personnes, s'il existe déjà. */
export function findDirectThread(state: SessionState, a: string, b: string): Thread | undefined {
  return buildThreads(state).find((t) => !t.isGroup && t.memberIds.length === 2 && t.memberIds.includes(a) && t.memberIds.includes(b));
}

export function unreadMessageCount(state: SessionState, viewerId: string): number {
  return threadsFor(state, viewerId).reduce((s, t) => s + t.unreadCount, 0);
}

/* ── LES NOTIFICATIONS ─────────────────────────────────────────────────── */

export interface NotificationView extends Notification {
  recipientId: string;
  actorId?: string;
  fromSession: boolean;
}

type Draft = Omit<NotificationView, "id" | "read" | "createdAt" | "fromSession">;

/** Les notifications qu'un événement produit, chez qui. */
function notificationsOf(e: SessionEvent): Draft[] {
  const actor = displayName(e.actorId);
  const msgHref = `/messages?to=${e.actorId}`;
  switch (e.kind) {
    case "contact.sent":
      return [{ recipientId: e.data.toId, actorId: e.actorId, type: "message", title: `${actor} vous a écrit`, message: quote(e.data.text), href: msgHref }];
    case "visit.requested":
      return [
        {
          recipientId: e.data.toId,
          actorId: e.actorId,
          type: "reservation",
          title: `Demande de visite de ${actor}`,
          message: `${e.data.subject} · ${dayLabel(e.data.date)} à ${e.data.time}`,
          href: msgHref,
        },
      ];
    case "offer.made":
      return [
        {
          recipientId: e.data.toId,
          actorId: e.actorId,
          type: "payment",
          title: `Offre reçue de ${actor}`,
          message: `${money(e.data.amount, e.data.currency)} · ${e.data.subject}`,
          href: msgHref,
        },
      ];
    case "quote.sent":
      return e.data.toId
        ? [{ recipientId: e.data.toId, actorId: e.actorId, type: "message", title: `Demande de devis de ${actor}`, message: e.data.subject, href: msgHref }]
        : [];
    case "agency.contacted":
      return [
        {
          recipientId: e.data.toId,
          actorId: e.actorId,
          type: "message",
          title: `${actor} a ouvert le contact`,
          message: `Votre proposition pour ${e.data.agencyName} a été retenue`,
          href: msgHref,
        },
      ];
    case "application.sent":
      return e.data.ownerId && e.data.ownerId !== e.actorId
        ? [
            {
              recipientId: e.data.ownerId,
              actorId: e.actorId,
              type: "system",
              title: "Une agence a répondu à votre demande",
              message: `${e.data.demandLabel} · comparez les propositions`,
              href: "/vendre/accompagnement",
            },
          ]
        : [];
    case "booking.made": {
      const stay = `${dayLabel(e.data.checkIn)} – ${dayLabel(e.data.checkOut)}`;
      const out: Draft[] = [
        {
          recipientId: e.actorId,
          type: "reservation",
          title: "Réservation confirmée",
          message: `${e.data.subject} · ${stay}`,
          href: "/dashboard/reservations",
        },
      ];
      if (e.data.hostId !== e.actorId) {
        out.push({
          recipientId: e.data.hostId,
          actorId: e.actorId,
          type: "reservation",
          title: `Nouvelle réservation de ${actor}`,
          message: `${e.data.subject} · ${stay}`,
          href: "/dashboard/reservations",
        });
      }
      return out;
    }
    case "follow":
      return [{ recipientId: e.data.toId, actorId: e.actorId, type: "follow", title: `${actor} vous suit`, message: "Un nouvel abonné à vos publications.", href: `/profil/${e.actorId}` }];
    case "listing.published":
      return [
        {
          recipientId: e.actorId,
          type: "system",
          title: "Votre annonce est en ligne",
          message: `${e.data.title} · ${e.data.city}`,
          href: `/explorer/${listingIdOf(e.seq)}`,
        },
      ];
    case "service.published":
      return [
        { recipientId: e.actorId, type: "system", title: "Votre service est en ligne", message: e.data.title, href: `/services?focus=${serviceIdOf(e.seq)}` },
      ];
    case "formation.published":
      return [
        { recipientId: e.actorId, type: "system", title: "Votre formation est publiée", message: e.data.title, href: `/formations/${formationIdOf(e.seq)}` },
      ];
    case "live.scheduled":
      return [
        {
          recipientId: e.actorId,
          type: "system",
          title: "Votre live est programmé",
          message: `${e.data.title} · ${dayLabel(e.data.date)}`,
          href: `/live?focus=${liveIdOf(e.seq)}`,
        },
      ];
    case "message.sent": {
      const others = e.data.memberIds.filter((id) => id !== e.actorId);
      const isGroup = others.length > 1;
      return others.map((id) => ({
        recipientId: id,
        actorId: e.actorId,
        type: "message" as const,
        title: `${actor} vous a écrit`,
        message: quote(e.data.text),
        href: isGroup ? `/messages?conv=${e.data.threadId}` : msgHref,
      }));
    }
    case "group.created":
      return e.data.memberIds
        .filter((id) => id !== e.actorId)
        .map((id) => ({
          recipientId: id,
          actorId: e.actorId,
          type: "message" as const,
          title: `${actor} vous a ajouté à un groupe`,
          message: e.data.name,
          href: `/messages?conv=${e.data.threadId}`,
        }));
    /* Modèle économique visible (P4a) : les deux côtés d'une mise en relation. */
    case "introduction.made":
      return [{
        recipientId: e.data.sellerId,
        actorId: e.actorId,
        type: "payment",
        title: `${actor} vous propose un contact`,
        message: `${e.data.contactLabel} — prime ${groupThousands(e.data.primeChf)} CHF si vous acceptez. Refuser est gratuit.`,
        href: "/publier#primes",
      }];
    case "introduction.answered":
      return [{
        recipientId: e.data.apporteurId,
        actorId: e.actorId,
        type: "payment",
        title: e.data.decision === "accepted" ? `${actor} a accepté votre mise en relation` : `${actor} a décliné votre contact`,
        message: e.data.decision === "accepted" ? "Votre prime nette est acquise." : "Rien n'est facturé ; vous pouvez proposer un autre contact.",
        href: "/apporteurs",
      }];
    case "introduction.disputed":
      return [{
        recipientId: e.data.apporteurId,
        actorId: e.actorId,
        type: "system",
        title: `${actor} a signalé un contact comme peu sérieux`,
        message: e.data.reason,
        href: "/apporteurs",
      }];
    /* ── Services et formations (P6a, ajout) ── */
    case "service.quoted":
      return [{
        recipientId: e.actorId,
        actorId: e.data.providerId,
        type: "message",
        title: `Devis reçu de ${displayName(e.data.providerId)}`,
        message: `${e.data.subject} · ${money(e.data.totalChf, "CHF")}`,
        href: `/services/${e.data.serviceId}#devis`,
      }];
    case "service.quote.accepted":
      return [{
        recipientId: e.data.providerId,
        actorId: e.actorId,
        type: "message",
        title: `${actor} a accepté votre devis`,
        message: money(e.data.totalChf, "CHF"),
        href: `/messages?to=${e.actorId}`,
      }];
    case "service.paid":
      return [{
        recipientId: e.data.providerId,
        actorId: e.actorId,
        type: "payment",
        title: `Paiement reçu de ${actor}`,
        message: `${money(e.data.totalChf, "CHF")} · prestation à réaliser`,
        href: `/services/${e.data.serviceId}`,
      }];
    case "service.reviewed":
      return [{
        recipientId: e.data.providerId,
        actorId: e.actorId,
        type: "system",
        title: `${actor} vous a laissé un avis`,
        message: `${e.data.rating}/5${e.data.comment.trim() ? ` · ${quote(e.data.comment, 70)}` : ""}`,
        href: `/services/${e.data.serviceId}#avis`,
      }];
    case "formation.enrolled":
      return e.data.authorId !== e.actorId
        ? [{
            recipientId: e.data.authorId,
            actorId: e.actorId,
            type: "payment",
            title: `${actor} s'est inscrit·e à votre formation`,
            message: money(e.data.priceChf, "CHF"),
            href: `/formations/${e.data.formationId}`,
          }]
        : [];
    /* Événements et lives (P6c) : l'inscrit reçoit sa confirmation, et
       l'organisateur — une personne de l'annuaire — est prévenu. */
    case "event.registered": {
      const href = e.data.target === "live" ? `/live?focus=${e.data.eventId}` : `/evenements/${e.data.eventId}`;
      const what = e.data.target === "live" ? "live" : "événement";
      const paid = e.data.priceChf > 0 ? ` · billet ${money(e.data.priceChf, "CHF")}` : " · gratuit";
      const out: Draft[] = [
        { recipientId: e.actorId, type: "system", title: "Inscription confirmée", message: `${e.data.title} · ${dayLabel(e.data.date)}${paid}`, href },
      ];
      if (e.data.organizerId !== e.actorId) {
        out.push({
          recipientId: e.data.organizerId,
          actorId: e.actorId,
          type: e.data.priceChf > 0 ? "payment" : "system",
          title: `${actor} s'est inscrit·e à votre ${what}`,
          message: `${e.data.title}${paid}`,
          href,
        });
      }
      return out;
    }
    case "event.unregistered":
      return e.data.organizerId !== e.actorId
        ? [{
            recipientId: e.data.organizerId,
            actorId: e.actorId,
            type: "system",
            title: `${actor} a annulé son inscription`,
            message: e.data.title,
            href: e.data.target === "live" ? `/live?focus=${e.data.eventId}` : `/evenements/${e.data.eventId}`,
          }]
        : [];
    case "agenda.added":
      return [{
        recipientId: e.actorId,
        type: "system",
        title: "Ajouté à votre agenda",
        message: `${e.data.title} · ${dayLabel(e.data.date)}`,
        href: e.data.target === "live" ? `/live?focus=${e.data.eventId}` : `/evenements/${e.data.eventId}`,
      }];
    case "event.published":
      return [{
        recipientId: e.actorId,
        type: "system",
        title: "Votre événement est publié",
        message: `${e.data.titre} · ${dayLabel(e.data.date)}`,
        href: `/evenements/${eventIdOf(e.seq)}`,
      }];
    default:
      return [];
  }
}

/** Toutes les notifications de `viewerId`, de la plus récente à la plus
    ancienne. LA source unique : la barre latérale, l'en-tête, la nav mobile
    et la page /notifications lisent toutes celle-ci. */
export function notificationsFor(state: SessionState, viewerId: string): NotificationView[] {
  const read = new Set(state.readNotificationIds);
  const seeds: NotificationView[] = NOTIFICATION_SEEDS.filter((n) => n.recipientId === viewerId).map((n) => ({
    id: n.id,
    recipientId: n.recipientId,
    actorId: n.actorId,
    type: n.type,
    title: n.title,
    message: n.message,
    href: n.href,
    createdAt: n.at,
    read: n.read || read.has(n.id),
    fromSession: false,
  }));
  const fromEvents: NotificationView[] = [];
  for (const e of state.events) {
    for (const d of notificationsOf(e)) {
      if (d.recipientId !== viewerId) continue;
      const id = `${e.id}:${d.recipientId}`;
      fromEvents.push({ ...d, id, createdAt: e.at, read: read.has(id), fromSession: true });
    }
  }
  return [...fromEvents, ...seeds].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** LE compteur de notifications non lues. Il n'y en a qu'un. */
export function unreadNotificationCount(state: SessionState, viewerId: string): number {
  return notificationsFor(state, viewerId).filter((n) => !n.read).length;
}

/* ── LE CATALOGUE DE SESSION ───────────────────────────────────────────── */

const DEFAULT_LISTING_IMAGE: Record<string, string> = {
  appartement: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
  studio: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
  maison: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
  chalet: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
};
const FALLBACK_LISTING_IMAGE = DEFAULT_LISTING_IMAGE.appartement!;

const byNewest = <T extends { seq: number }>(a: T, b: T) => b.seq - a.seq;

/** Les biens publiés pendant la session, au format du catalogue. */
export function sessionListings(state: SessionState): Property[] {
  const out: Property[] = [];
  for (const e of [...state.events].sort(byNewest)) {
    if (e.kind !== "listing.published") continue;
    const host = person(e.actorId);
    if (!host) continue;
    const d = e.data;
    out.push({
      id: listingIdOf(e.seq),
      title: d.title,
      description: d.description || "Annonce publiée pendant cette démonstration.",
      type: d.type,
      transactionType: d.transactionType,
      price: d.price,
      currency: d.currency,
      location: { city: d.city, country: host.country || "Suisse", address: d.address },
      images: d.images.length > 0 ? d.images : [DEFAULT_LISTING_IMAGE[d.type] ?? FALLBACK_LISTING_IMAGE],
      host,
      bedrooms: d.bedrooms,
      bathrooms: d.bathrooms,
      area: d.area,
      amenities: d.amenities,
      rating: 0,
      reviewCount: 0,
    });
  }
  return out;
}

export function isSessionId(id: string): boolean {
  return id.startsWith("s-");
}

export interface SessionService {
  id: string;
  title: string;
  category: string;
  description: string;
  zone: string;
  providerId: string;
  provider: string;
  avatar: string;
  price: number;
  unit: string;
  publishedAt: string;
}

export function sessionServices(state: SessionState): SessionService[] {
  return state.events
    .filter((e): e is Extract<SessionEvent, { kind: "service.published" }> => e.kind === "service.published")
    .sort(byNewest)
    .map((e) => ({
      id: serviceIdOf(e.seq),
      title: e.data.title,
      category: e.data.category,
      description: e.data.description,
      zone: e.data.zone,
      providerId: e.actorId,
      provider: displayName(e.actorId),
      avatar: person(e.actorId)?.avatar ?? "",
      price: e.data.price,
      unit: e.data.unit,
      publishedAt: e.at,
    }));
}

const DEFAULT_FORMATION_IMAGE = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=500&fit=crop";

export function sessionFormations(state: SessionState): Formation[] {
  const out: Formation[] = [];
  for (const e of [...state.events].sort(byNewest)) {
    if (e.kind !== "formation.published") continue;
    const instructor = person(e.actorId);
    if (!instructor) continue;
    const id = formationIdOf(e.seq);
    out.push({
      id,
      title: e.data.title,
      description: e.data.description || "Formation publiée pendant cette démonstration.",
      category: e.data.category || "Immobilier",
      level: e.data.level,
      instructor,
      thumbnail: e.data.image || DEFAULT_FORMATION_IMAGE,
      price: e.data.price,
      currency: "CHF",
      duration: e.data.duration || "À préciser",
      modules: e.data.modules.map((m, i) => ({
        id: `${id}-m${i + 1}`,
        title: m.title || `Module ${i + 1}`,
        duration: "",
        lessons: m.lessons.map((l, j) => ({ id: `${id}-m${i + 1}-l${j + 1}`, title: l.title || `Leçon ${j + 1}`, duration: l.duration })),
      })),
      rating: 0,
      studentCount: 0,
    });
  }
  return out;
}

export interface SessionLive {
  id: string;
  title: string;
  speakerId: string;
  speaker: string;
  format: string;
  date: string;
  dateLabel: string;
  durationMin: number;
  description: string;
  price: number;
}

export function sessionLives(state: SessionState): SessionLive[] {
  return state.events
    .filter((e): e is Extract<SessionEvent, { kind: "live.scheduled" }> => e.kind === "live.scheduled")
    .sort(byNewest)
    .map((e) => ({
      id: liveIdOf(e.seq),
      title: e.data.title,
      speakerId: e.actorId,
      speaker: displayName(e.actorId),
      format: e.data.format,
      date: e.data.date,
      dateLabel: dayLabel(e.data.date),
      durationMin: e.data.durationMin,
      description: e.data.description,
      price: e.data.price,
    }));
}

/** Le rang d'un objet créé en session, lu dans son id (`s-bien-12` → 12). */
export function seqOfSessionId(id: string): number | undefined {
  const m = /^s-[a-z]+-(\d+)$/.exec(id);
  return m ? Number(m[1]) : undefined;
}

export interface SessionBooking {
  id: string;
  guestId: string;
  hostId: string;
  propertyId: string;
  subject: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  currency: Currency;
  at: string;
}

function bookings(state: SessionState): SessionBooking[] {
  return state.events
    .filter((e): e is Extract<SessionEvent, { kind: "booking.made" }> => e.kind === "booking.made")
    .sort(byNewest)
    .map((e) => ({
      id: bookingIdOf(e.seq),
      guestId: e.actorId,
      hostId: e.data.hostId,
      propertyId: e.data.propertyId,
      subject: e.data.subject,
      checkIn: e.data.checkIn,
      checkOut: e.data.checkOut,
      nights: e.data.nights,
      total: e.data.total,
      currency: e.data.currency,
      at: e.at,
    }));
}

/** Les séjours que `guestId` a réservés pendant la session. */
export const bookingsMadeBy = (state: SessionState, guestId: string) => bookings(state).filter((b) => b.guestId === guestId);
/** Les réservations reçues par `hostId` pendant la session. */
export const bookingsHostedBy = (state: SessionState, hostId: string) =>
  bookings(state).filter((b) => b.hostId === hostId && b.guestId !== hostId);

/* ── Les autres traces (devis, candidatures, contacts d'agence) ─────────── */

export function quotedServiceIds(state: SessionState, actorId: string): Set<string> {
  return new Set(state.events.flatMap((e) => (e.kind === "quote.sent" && e.actorId === actorId ? [e.data.serviceId] : [])));
}

export function contactedProposalIds(state: SessionState, actorId: string): Set<string> {
  return new Set(state.events.flatMap((e) => (e.kind === "agency.contacted" && e.actorId === actorId ? [e.data.proposalId] : [])));
}

export interface SessionApplication extends ApplicationData {
  id: string;
  agencyId: string;
  at: string;
}

const applications = (state: SessionState): SessionApplication[] =>
  state.events.flatMap((e) => (e.kind === "application.sent" ? [{ ...e.data, id: e.id, agencyId: e.actorId, at: e.at }] : []));

/** Les candidatures envoyées par `actorId` (côté agence). */
export const applicationsBy = (state: SessionState, actorId: string) => applications(state).filter((a) => a.agencyId === actorId);
/** Les candidatures reçues sur les demandes de `ownerId` (côté particulier). */
export const applicationsReceivedBy = (state: SessionState, ownerId: string) =>
  applications(state).filter((a) => a.ownerId === ownerId && a.agencyId !== ownerId);

/** Ce que `personId` a publié pendant la session, au format des vitrines de
    profil (biens, formations, services, lives) — en tête de sa fiche. */
export function sessionShowcaseOf(state: SessionState, personId: string) {
  const mine = publishedBy(state, personId);
  return {
    biens: mine.listings.map((p) => ({
      id: p.id,
      title: p.title,
      cover: p.images[0] ?? FALLBACK_LISTING_IMAGE,
      price: p.price,
      currency: p.currency,
      unit: p.transactionType === "vente" ? "" : p.transactionType === "location-lt" ? "/mois" : "/nuit",
      location: `${p.location.city}, ${p.location.country} · Nouveau`,
    })),
    formations: mine.formations.map((f) => ({
      id: f.id,
      title: f.title,
      cover: f.thumbnail,
      price: f.price,
      currency: f.currency,
      students: 0,
      rating: 0,
    })),
    services: mine.services.map((s) => ({
      id: s.id,
      title: s.title,
      cover: DEFAULT_LISTING_IMAGE.appartement!,
      price: s.price,
      currency: "CHF",
      unit: s.unit,
    })),
    lives: mine.lives.map((l) => ({
      id: l.id,
      title: l.title,
      cover: DEFAULT_FORMATION_IMAGE,
      status: "scheduled" as const,
      scheduledAt: l.dateLabel,
    })),
  };
}

/** Les objets que `actorId` a publiés pendant la session (pour « Mes annonces »). */
export function publishedBy(state: SessionState, actorId: string) {
  const mine = { ...state, events: state.events.filter((e) => e.actorId === actorId) };
  return {
    listings: sessionListings(mine),
    services: sessionServices(mine),
    formations: sessionFormations(mine),
    lives: sessionLives(mine),
  };
}

/* ── Services et formations (chantier P6a, ajout) ───────────────────────── */

/** Un avis de prestation laissé pendant la session. */
export interface SessionServiceReview {
  id: string;
  serviceId: string;
  providerId: string;
  authorId: string;
  rating: number;
  comment: string;
  at: string;
}

/** Les avis de prestation laissés pendant la session, du plus récent au plus ancien. */
export function sessionServiceReviews(state: SessionState): SessionServiceReview[] {
  return state.events
    .filter((e): e is Extract<SessionEvent, { kind: "service.reviewed" }> => e.kind === "service.reviewed")
    .sort(byNewest)
    .map((e) => ({
      id: e.id,
      serviceId: e.data.serviceId,
      providerId: e.data.providerId,
      authorId: e.actorId,
      rating: e.data.rating,
      comment: e.data.comment,
      at: e.at,
    }));
}

/** Les avis de session reçus par `personId`, au format des avis de profil. */
export function sessionAvisOf(state: SessionState, personId: string, titleOf?: (serviceId: string) => string | undefined) {
  return sessionServiceReviews(state)
    .filter((r) => r.providerId === personId && r.authorId !== personId)
    .map((r) => {
      const a = person(r.authorId);
      return {
        id: r.id,
        author: displayName(r.authorId),
        authorId: r.authorId,
        authorAvatar: a?.avatar ?? "",
        about: `Prestation · ${titleOf?.(r.serviceId) ?? "cette session"}`,
        rating: r.rating,
        text: r.comment,
        date: dayLabel(r.at),
      };
    });
}
