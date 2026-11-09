import assert from "node:assert/strict";
import { test } from "node:test";

import { DEMO_TODAY } from "@/lib/demo/clock";
import { CURRENT_USER_ID } from "@/lib/demo/identity";
import { users } from "@/lib/mock-data";
import {
  emptySession,
  recordEvent,
  markNotificationsRead,
  markThreadRead,
  parseSession,
  serializeSession,
  loadSession,
  saveSession,
  SESSION_STORAGE_KEY,
  type SessionEventInput,
  type SessionState,
} from "@/lib/demo/session-store";
import {
  threadsFor,
  notificationsFor,
  unreadNotificationCount,
  unreadMessageCount,
  sessionListings,
  sessionFormations,
  bookingsMadeBy,
  bookingsHostedBy,
  applicationsReceivedBy,
  findDirectThread,
} from "@/lib/demo/session-views";
import { NOTIFICATION_SEEDS, THREAD_SEEDS } from "@/lib/demo/inbox-seeds";

/* ── Le moteur d'interactions (chantier P2) ─────────────────────────────────

   La mémoire de session est pure : ces épreuves la font tourner sans React ni
   navigateur. Chacune répond à un cul-de-sac relevé par l'audit (AUDIT-2,
   thèmes 2, 3 et 8) : une action affichait « succès » et ne créait rien, la
   messagerie ne reliait personne, trois compteurs de notifications se
   contredisaient. */

const LEO = CURRENT_USER_ID;
const CELINE = "user-002";
const ANA = "user-006";
const BERNARD = "user-007";

function run(...steps: { actor?: string; input: SessionEventInput }[]): SessionState {
  let s = emptySession();
  for (const step of steps) s = recordEvent(s, step.actor ?? LEO, step.input).state;
  return s;
}

const visitToBernard: SessionEventInput = {
  kind: "visit.requested",
  data: { toId: BERNARD, propertyId: "prop3", subject: "Maison familiale avec jardin à Pully", date: "2026-10-10", time: "10:00" },
};

test("P2.1 — une demande de visite crée une conversation réelle avec le vendeur", () => {
  const before = threadsFor(emptySession(), LEO);
  assert.equal(findDirectThread(emptySession(), LEO, BERNARD), undefined, "aucun fil Léo ↔ Bernard au départ");
  const s = run({ input: visitToBernard });
  const after = threadsFor(s, LEO);
  assert.equal(after.length, before.length + 1);
  const t = findDirectThread(s, LEO, BERNARD);
  assert.ok(t, "le fil Léo ↔ Bernard existe");
  assert.equal(t.messages.length, 1);
  assert.equal(t.messages[0]!.senderId, LEO);
  assert.match(t.messages[0]!.text, /10 octobre à 10:00/);
  assert.match(t.messages[0]!.topic ?? "", /Demande de visite/);
  /* Léo voit son propre message comme lu ; c'est Bernard qui a un non-lu. */
  assert.equal(after.find((x) => x.id === t.id)!.unreadCount, 0);
  assert.equal(threadsFor(s, BERNARD).find((x) => x.id === t.id)!.unreadCount, 1);
});

test("P2.2 — l'action notifie le destinataire, pas l'acteur", () => {
  const s = run({ input: visitToBernard });
  const forBernard = notificationsFor(s, BERNARD).filter((n) => n.fromSession);
  assert.equal(forBernard.length, 1);
  assert.equal(forBernard[0]!.href, `/messages?to=${LEO}`);
  assert.equal(forBernard[0]!.read, false);
  assert.equal(notificationsFor(s, LEO).filter((n) => n.fromSession).length, 0);
});

test("P2.3 — écrire à quelqu'un avec qui un fil d'amorce existe l'alimente, sans doublon", () => {
  const seed = THREAD_SEEDS.find((t) => t.id === "th-ana-leo")!;
  const s = run({ input: { kind: "contact.sent", data: { toId: ANA, propertyId: "prop8", subject: "Renens", text: "Oui, c'est normal : trois mois au maximum." } } });
  const leoThreadsWithAna = threadsFor(s, LEO).filter((t) => !t.isGroup && t.otherIds[0] === ANA);
  assert.equal(leoThreadsWithAna.length, 1, "un seul fil Léo ↔ Ana");
  assert.equal(leoThreadsWithAna[0]!.id, "th-ana-leo");
  assert.equal(leoThreadsWithAna[0]!.messages.length, seed.messages.length + 1);
});

test("P2.4 — le compteur de notifications est unique et « tout marquer comme lu » le remet à zéro", () => {
  const s0 = run(
    { input: { kind: "listing.published", data: listingData() } },
    { actor: ANA, input: { kind: "contact.sent", data: { toId: LEO, text: "Merci pour votre réponse !" } } },
  );
  const list = notificationsFor(s0, LEO);
  const unread = list.filter((n) => !n.read).length;
  assert.equal(unreadNotificationCount(s0, LEO), unread, "un seul calcul");
  const seedUnread = NOTIFICATION_SEEDS.filter((n) => n.recipientId === LEO && !n.read).length;
  assert.equal(unread, seedUnread + 2, "amorce + annonce publiée + message d'Ana");
  const s1 = markNotificationsRead(s0, list.map((n) => n.id));
  assert.equal(unreadNotificationCount(s1, LEO), 0);
  assert.ok(unreadNotificationCount(s1, CELINE) > 0, "les notifications des autres ne sont pas touchées");
});

test("P2.5 — ouvrir un fil le marque lu ; le compteur de messages suit", () => {
  const s0 = emptySession();
  const before = unreadMessageCount(s0, LEO);
  const ana = threadsFor(s0, LEO).find((t) => t.id === "th-ana-leo")!;
  assert.ok(ana.unreadCount > 0, "Ana a écrit et Léo n'a pas lu");
  const s1 = markThreadRead(s0, LEO, ana.id, ana.messages.length);
  assert.equal(unreadMessageCount(s1, LEO), before - ana.unreadCount);
});

function listingData() {
  return {
    title: "Attique avec terrasse à Prilly",
    description: "",
    type: "appartement" as const,
    transactionType: "vente" as const,
    price: 1_180_000,
    currency: "CHF" as const,
    city: "Prilly",
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    images: [],
    amenities: ["Terrasse"],
    openToReferrers: true,
  };
}

test("P2.6 — publier un bien le met au catalogue de session, avec sa fiche et sa notification", () => {
  const s = run({ input: { kind: "listing.published", data: listingData() } });
  const listings = sessionListings(s);
  assert.equal(listings.length, 1);
  assert.equal(listings[0]!.id, "s-bien-1");
  assert.equal(listings[0]!.host.id, LEO);
  assert.ok(listings[0]!.images.length > 0, "une image par défaut, jamais une fiche vide");
  const n = notificationsFor(s, LEO).find((x) => x.fromSession)!;
  assert.equal(n.href, "/explorer/s-bien-1", "la notification mène à SA fiche");
});

test("P2.7 — publier une formation crée une fiche résoluble", () => {
  const s = run({
    input: {
      kind: "formation.published",
      data: { title: "Louer en courte durée à Lausanne", category: "Gestion locative", level: "debutant", description: "", image: "", price: 149, duration: "3 h", modules: [{ title: "Le cadre légal", lessons: [{ title: "Le règlement communal", duration: "12 min" }] }] },
    },
  });
  const f = sessionFormations(s);
  assert.equal(f[0]!.id, "s-form-1");
  assert.equal(f[0]!.modules[0]!.lessons.length, 1);
});

test("P2.8 — réserver : la réservation existe pour le voyageur et pour l'hôte", () => {
  const s = run({
    input: {
      kind: "booking.made",
      data: { propertyId: "prop12", hostId: "user-013", subject: "2 pièces vue lac à Montreux", checkIn: "2026-10-12", checkOut: "2026-10-15", nights: 3, total: 630, currency: "CHF" },
    },
  });
  assert.equal(bookingsMadeBy(s, LEO).length, 1);
  assert.equal(bookingsHostedBy(s, "user-013").length, 1);
  assert.ok(notificationsFor(s, "user-013").some((n) => n.type === "reservation" && n.fromSession));
  assert.ok(findDirectThread(s, LEO, "user-013"), "un message part dans le fil avec l'hôte");
});

test("P2.9 — postuler n'ouvre AUCUNE conversation (l'agence n'écrit pas la première), mais notifie le particulier", () => {
  const s = run({
    input: {
      kind: "application.sent",
      data: { demandId: "d1", demandLabel: "Appartement 4,5 p. — Neuchâtel", ownerId: "user-011", rate: "2,8 %", included: "Photos", timeline: "72 h", references: ["A", "B"] },
    },
  });
  assert.equal(threadsFor(s, "user-011").length, threadsFor(emptySession(), "user-011").length);
  assert.equal(applicationsReceivedBy(s, "user-011").length, 1);
  assert.ok(notificationsFor(s, "user-011").some((n) => n.fromSession && n.href === "/vendre/accompagnement"));
});

test("P2.10 — horodatage dérivé de DEMO_TODAY, croissant, après l'amorce", () => {
  const s = run({ input: visitToBernard }, { input: visitToBernard }, { input: visitToBernard });
  const times = s.events.map((e) => e.at);
  assert.ok(times.every((t) => t > DEMO_TODAY.toISOString()));
  assert.deepEqual([...times].sort(), times);
  for (const t of THREAD_SEEDS) for (const m of t.messages) assert.ok(m.at <= DEMO_TODAY.toISOString(), m.id);
});

test("P2.11 — la persistance tolère tout : vide, illisible, autre version, stockage en panne", () => {
  assert.deepEqual(parseSession(null), emptySession());
  assert.deepEqual(parseSession("{pas du json"), emptySession());
  assert.deepEqual(parseSession(JSON.stringify({ version: 99, events: [] })), emptySession());
  const s = run({ input: visitToBernard });
  assert.deepEqual(parseSession(serializeSession(s)), s);
  const broken = {
    getItem: () => {
      throw new Error("SecurityError");
    },
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
  };
  assert.deepEqual(loadSession(broken), emptySession());
  assert.doesNotThrow(() => saveSession(broken, s));
  const mem = new Map<string, string>();
  saveSession({ setItem: (k, v) => void mem.set(k, v) }, s);
  assert.ok(mem.has(SESSION_STORAGE_KEY));
  assert.match(SESSION_STORAGE_KEY, /\.v\d+$/, "clé versionnée");
});

test("P2.12 — l'amorce est cohérente : chaque lien de notification vise une personne ou une page qui existe", () => {
  const ids = new Set(users.map((u) => u.id));
  for (const n of NOTIFICATION_SEEDS) {
    const to = /^\/messages\?to=(.+)$/.exec(n.href)?.[1];
    if (to) assert.ok(ids.has(to), `${n.id} → ${to}`);
    const conv = /^\/messages\?conv=(.+)$/.exec(n.href)?.[1];
    if (conv) assert.ok(THREAD_SEEDS.some((t) => t.id === conv && t.memberIds.includes(n.recipientId)), `${n.id} → ${conv}`);
    const prof = /^\/profil\/(.+)$/.exec(n.href)?.[1];
    if (prof) assert.ok(ids.has(prof), `${n.id} → ${prof}`);
  }
  /* Les six fils du casting demandés par le chantier P2. */
  const pairs = [
    [ANA, LEO],
    ["user-003", CELINE],
    [BERNARD, "user-005"],
    ["user-013", "user-016"],
    ["user-004", "user-015"],
    ["user-008", CELINE],
  ];
  for (const [a, b] of pairs) assert.ok(findDirectThread(emptySession(), a!, b!), `fil ${a} ↔ ${b}`);
});

test("P2.13 — changer d'acteur (chantier P3) : Céline voit ce que Léo lui a envoyé", () => {
  const s = run({ input: { kind: "contact.sent", data: { toId: CELINE, text: "Bonjour Céline, une question sur Riex." } } });
  const t = threadsFor(s, CELINE).find((x) => x.otherIds[0] === LEO)!;
  assert.equal(t.id, "th-leo-celine", "le fil d'amorce Léo ↔ Céline est alimenté");
  assert.equal(t.unreadCount, 1);
  assert.ok(notificationsFor(s, CELINE).some((n) => n.fromSession && n.actorId === LEO));
});
